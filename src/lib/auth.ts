import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { jwtPayloadSchema, type JWTPayload } from './validation'

// Validate JWT_SECRET exists in production
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be defined in production environment')
  }
  console.warn('⚠️  JWT_SECRET not set. Using development fallback.')
}

const SECRET = JWT_SECRET || 'dev-secret-only-for-local-development'

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET)
    // Validate the decoded token matches our schema
    const result = jwtPayloadSchema.safeParse(decoded)
    return result.success ? result.data : null
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  return {
    userId: decoded.userId,
    name: decoded.userName,
    email: decoded.userEmail,
    plan: decoded.plan
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}
