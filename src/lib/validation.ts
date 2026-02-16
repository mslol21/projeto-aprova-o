import { z } from 'zod'

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').max(100)
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

// Subject schemas
export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100)
})

// Session schemas
export const createSessionSchema = z.object({
  subjectId: z.string().cuid('ID de matéria inválido'),
  durationMinutes: z.number().int().min(1).max(1440), // max 24 hours
  type: z.enum(['50min', '25min', 'free']),
  createdAt: z.string().datetime().optional()
})

// Goal schemas
export const createGoalSchema = z.object({
  targetHours: z.number().int().min(1).max(168) // max 168 hours per week
})

// Note schemas
export const createNoteSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  content: z.string().max(5000, 'Conteúdo muito longo')
})

// JWT Payload schema
export const jwtPayloadSchema = z.object({
  userId: z.string().cuid(),
  userName: z.string(),
  userEmail: z.string().email(),
  plan: z.enum(['free', 'premium']),
  iat: z.number().optional(),
  exp: z.number().optional()
})

export type JWTPayload = z.infer<typeof jwtPayloadSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>
export type CreateSessionInput = z.infer<typeof createSessionSchema>
export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type CreateNoteInput = z.infer<typeof createNoteSchema>
