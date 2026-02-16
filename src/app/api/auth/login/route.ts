import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { loginSchema } from '@/lib/validation'
import { handleApiError, unauthorized } from '@/lib/errors'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return unauthorized('Credenciais inválidas')
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return unauthorized('Credenciais inválidas')
    }

    const token = signToken({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      plan: user.plan as 'free' | 'premium',
    })

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        streakCount: user.streakCount,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
