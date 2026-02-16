import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { startOfDay, subDays } from 'date-fns'
import { createSessionSchema } from '@/lib/validation'
import { unauthorized, forbidden, handleApiError } from '@/lib/errors'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7days'

    let where: any = { userId: session.userId }

    if (session.plan === 'free' || range === '7days') {
      const sevenDaysAgo = startOfDay(subDays(new Date(), 7))
      where.createdAt = { gte: sevenDaysAgo }
    }

    const studySessions = await prisma.studySession.findMany({
      where,
      include: {
        subject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(studySessions)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const body = await request.json()
    const { subjectId, durationMinutes, type, questionsTotal, questionsCorrect, notes } = createSessionSchema.parse(body)

    // Security: Verify subject ownership
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    })

    if (!subject || subject.userId !== session.userId) {
      return forbidden('Matéria não encontrada ou não pertence ao usuário')
    }

    // Wrap in transaction to update session and subject timestamp
    const [studySession] = await prisma.$transaction([
      prisma.studySession.create({
        data: {
          userId: session.userId,
          subjectId,
          durationMinutes,
          type,
          questionsTotal,
          questionsCorrect,
          notes,
        },
        include: {
          subject: true,
        },
      }),
      prisma.subject.update({
        where: { id: subjectId },
        data: { lastStudiedAt: new Date() }
      })
    ])

    // Update streak logic
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { lastStudyDate: true, streakCount: true }
    })

    if (user) {
      const today = startOfDay(new Date())
      const lastDate = user.lastStudyDate ? startOfDay(user.lastStudyDate) : null
      
      let newStreak = user.streakCount
      
      if (!lastDate) {
        newStreak = 1
      } else {
        const diffTime = today.getTime() - lastDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          newStreak += 1
        } else if (diffDays > 1) {
          newStreak = 1
        }
        // If diffDays === 0, it's the same day, streak stays the same
      }

      await prisma.user.update({
        where: { id: session.userId },
        data: {
          lastStudyDate: today,
          streakCount: newStreak
        }
      })
    }

    return NextResponse.json(studySession, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
