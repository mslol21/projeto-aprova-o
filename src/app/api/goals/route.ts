import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createGoalSchema } from '@/lib/validation'
import { unauthorized, handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const goal = await prisma.weeklyGoal.findFirst({
      where: { userId: session.userId },
    })

    return NextResponse.json(goal || { targetHours: 0 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const body = await request.json()
    const { targetHours } = createGoalSchema.parse(body)

    const existingGoal = await prisma.weeklyGoal.findFirst({
      where: { userId: session.userId },
    })

    if (existingGoal) {
      const updated = await prisma.weeklyGoal.update({
        where: { id: existingGoal.id },
        data: { targetHours },
      })
      return NextResponse.json(updated)
    }

    const created = await prisma.weeklyGoal.create({
      data: {
        userId: session.userId,
        targetHours,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
