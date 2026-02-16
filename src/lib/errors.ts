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
  // Log detalhado para o console da Vercel
  console.error('❌ API ERROR:', error)

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
  if (error && typeof error === 'object') {
    const err = error as any
    
    // Erros de Inicialização (Geralmente Env Vars faltando)
    if (err.name === 'PrismaClientInitializationError') {
      console.error('🚨 ERRO DE CONEXÃO: Verifique se DATABASE_URL e DIRECT_URL estão configuradas na Vercel!')
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados. Verifique as configurações.' },
        { status: 500 }
      )
    }

    if ('code' in err) {
      if (err.code === 'P2002') {
        return NextResponse.json(
          { error: 'Este registro já existe' },
          { status: 409 }
        )
      }
      
      if (err.code === 'P2025') {
        return NextResponse.json(
          { error: 'Registro não encontrado' },
          { status: 404 }
        )
      }
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
