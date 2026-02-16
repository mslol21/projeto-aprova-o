import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { jwtPayloadSchema, type JWTPayload } from './validation'

// Função para obter o segredo de forma segura em runtime
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    // No ambiente de produção da Vercel, isso NUNCA deve acontecer se a env var estiver configurada
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ WARNING: JWT_SECRET não encontrada em produção! Usando fallback inseguro.')
      return 'prod-fallback-insecure-secret'
    }
    return 'dev-secret-only-for-local-development'
  }
  return secret
}

export function signToken(payload: JWTPayload) {
  const secret = getJwtSecret()
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = getJwtSecret()
    const decoded = jwt.verify(token, secret)
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
