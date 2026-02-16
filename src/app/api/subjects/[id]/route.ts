import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createSubjectSchema } from '@/lib/validation'
import { unauthorized, forbidden, handleApiError, notFound } from '@/lib/errors'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session) return unauthorized()

    const body = await request.json()
    const { name, weight, difficulty, color } = createSubjectSchema.parse(body)

    // Verify ownership
    const existingSubject = await prisma.subject.findUnique({
      where: { id }
    })

    if (!existingSubject) return notFound('Matéria não encontrada')
    if (existingSubject.userId !== session.userId) return forbidden()

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        weight,
        difficulty,
        color
      }
    })

    return NextResponse.json(subject)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session) return unauthorized()

    const existingSubject = await prisma.subject.findUnique({
      where: { id }
    })

    if (!existingSubject) return notFound('Matéria não encontrada')
    if (existingSubject.userId !== session.userId) return forbidden()

    await prisma.subject.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return handleApiError(error)
  }
}
