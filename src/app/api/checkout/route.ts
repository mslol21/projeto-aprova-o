import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { mpClient } from '@/lib/mercadopago'
import { PreApproval } from 'mercadopago'
import { unauthorized, handleApiError } from '@/lib/errors'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const preApproval = new PreApproval(mpClient)

    const result = await preApproval.create({
      body: {
        reason: 'Projeto Aprovação - Plano Premium Mensal',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 19.90,
          currency_id: 'BRL',
        },
        back_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://projetoaprovacao.vercel.app'}/dashboard`,
        payer_email: session.email,
        external_reference: session.userId,
      }
    })

    // O PreApproval retorna o link de checkout no init_point ou sandbox_init_point
    return NextResponse.json({ init_point: (result as any).init_point || (result as any).sandbox_init_point })
  } catch (error) {
    return handleApiError(error)
  }
}
