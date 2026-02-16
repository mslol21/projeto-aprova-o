import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Dados inválidos',
        details: error.issues.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      },
      { status: 400 }
    )
  }

  // Custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: any }
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        { error: 'Este registro já existe' },
        { status: 409 }
      )
    }
    
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      )
    }
  }

  // Generic server error
  return NextResponse.json(
    { error: 'Erro interno do servidor' },
    { status: 500 }
  )
}

export function unauthorized(message = 'Não autorizado') {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message = 'Acesso negado') {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function notFound(message = 'Não encontrado') {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function badRequest(message = 'Requisição inválida') {
  return NextResponse.json({ error: message }, { status: 400 })
}
