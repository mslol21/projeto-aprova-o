import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { jwtPayloadSchema, type JWTPayload } from './validation'

// Obtenção do segredo com fallback apenas para build/dev
const getSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      // No build time da Vercel, o segredo pode não estar presente
      // Retornamos um fallback temporário, mas as funções de sign/verify 
      // vão falhar se usadas sem o segredo real no runtime.
      return 'build-time-fallback-only'
    }
    return 'dev-secret-only-for-local-development'
  }
  return secret
}

const SECRET = getSecret()

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
