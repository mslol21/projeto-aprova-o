import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { unauthorized, forbidden, handleApiError } from '@/lib/errors'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const { id } = await params

    const subject = await prisma.subject.findUnique({
      where: { id },
    })

    if (!subject || subject.userId !== session.userId) {
      return forbidden('Matéria não encontrada ou acesso negado')
    }

    await prisma.subject.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
