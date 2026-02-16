import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { unauthorized, handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    // Somente para usuários Premium
    if (session.plan !== 'premium') {
      return NextResponse.json({ 
        error: 'Recurso exclusivo do Plano Premium',
        isLocked: true 
      }, { status: 403 })
    }

    const subjects = await prisma.subject.findMany({
      where: { userId: session.userId },
      orderBy: [
        { lastStudiedAt: 'asc' }, // Quem foi estudado há mais tempo primeiro
        { weight: 'desc' },       // Se houver empate, quem tem maior peso
      ]
    })

    if (subjects.length === 0) {
      return NextResponse.json({ message: 'Nenhuma matéria cadastrada' })
    }

    // A "próxima" é a primeira da lista ordenada
    const nextSubject = subjects[0]

    return NextResponse.json({
      nextSubject,
      reason: nextSubject.lastStudiedAt 
        ? `Você não estuda ${nextSubject.name} desde ${new Date(nextSubject.lastStudiedAt).toLocaleDateString()}.`
        : `Você ainda não iniciou os estudos de ${nextSubject.name}.`,
      allOrdered: subjects
    })
  } catch (error) {
    return handleApiError(error)
  }
}
