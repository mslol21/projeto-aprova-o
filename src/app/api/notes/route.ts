import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createNoteSchema } from '@/lib/validation'
import { unauthorized, badRequest, handleApiError } from '@/lib/errors'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (date) {
      const note = await prisma.dailyNote.findUnique({
        where: {
          userId_date: {
            userId: session.userId,
            date
          }
        }
      })
      return NextResponse.json(note)
    }

    const notes = await prisma.dailyNote.findMany({
      where: { userId: session.userId },
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(notes)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const body = await request.json()
    const { date, content } = createNoteSchema.parse(body)

    const note = await prisma.dailyNote.upsert({
      where: {
        userId_date: {
          userId: session.userId,
          date
        }
      },
      update: { content },
      create: {
        userId: session.userId,
        date,
        content
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    return handleApiError(error)
  }
}
