import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { mpClient } from '@/lib/mercadopago'
import { Preference } from 'mercadopago'
import { unauthorized, handleApiError } from '@/lib/errors'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return unauthorized()

    const preference = new Preference(mpClient)

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'premium-plan',
            title: 'Projeto Aprovação - Plano Premium',
            quantity: 1,
            unit_price: 19.90,
            currency_id: 'BRL',
          }
        ],
        payer: {
          email: session.email,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL || 'https://projetoaprovacao.vercel.app'}/dashboard?payment=success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL || 'https://projetoaprovacao.vercel.app'}/dashboard?payment=failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL || 'https://projetoaprovacao.vercel.app'}/dashboard?payment=pending`,
        },
        auto_return: 'approved',
        notification_url: 'https://projetoaprovacao.vercel.app/api/webhooks/mercadopago',
        external_reference: session.userId, // Identificador do usuário para o webhook
      }
    })

    return NextResponse.json({ init_point: result.init_point })
  } catch (error) {
    return handleApiError(error)
  }
}
