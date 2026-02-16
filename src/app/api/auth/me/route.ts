import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfDay } from 'date-fns'
import { unauthorized, handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      const response = unauthorized()
      response.cookies.delete('token')
      return response
    }

    let user = await prisma.user.findUnique({
      where: { id: session.userId },
    })

    if (!user) {
      const response = unauthorized('Usuário não encontrado')
      response.cookies.delete('token')
      return response
    }

    if (user && user.lastStudyDate) {
      const today = startOfDay(new Date())
      const lastDate = startOfDay(user.lastStudyDate)
      const diffTime = today.getTime() - lastDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // If more than 1 day has passed without study, reset streak
      if (diffDays > 1 && user.streakCount > 0) {
        user = await prisma.user.update({
          where: { id: session.userId },
          data: { streakCount: 0 }
        })
      }
    }

    return NextResponse.json({ 
      authenticated: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        streakCount: user.streakCount || 0,
        lastStudyDate: user.lastStudyDate
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
