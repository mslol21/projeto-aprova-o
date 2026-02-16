import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createSubjectSchema } from '@/lib/validation'
import { unauthorized, forbidden, handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const subjects = await prisma.subject.findMany({
      where: { userId: session.userId },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(subjects)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const body = await request.json()
    const { name, weight, difficulty, color } = createSubjectSchema.parse(body)

    // Check plan limit
    if (session.plan === 'free') {
      const count = await prisma.subject.count({
        where: { userId: session.userId },
      })

      if (count >= 6) {
        return forbidden('Limite do plano gratuito atingido (6 matérias)')
      }
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        weight,
        difficulty,
        color,
        userId: session.userId,
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
