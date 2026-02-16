import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { registerSchema } from '@/lib/validation'
import { handleApiError, badRequest } from '@/lib/errors'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const { name, email, password } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return badRequest('E-mail já cadastrado')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        plan: 'free',
      },
    })

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
