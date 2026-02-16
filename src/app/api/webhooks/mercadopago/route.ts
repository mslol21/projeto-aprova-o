import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mpClient } from '@/lib/mercadopago'
import { Payment, PreApproval } from 'mercadopago'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('🔔 Webhook Mercado Pago recebido:', body)

    let userId: string | undefined

    // Caso 1: Pagamento Único
    if (body.type === 'payment' && body.data?.id) {
      const payment = new Payment(mpClient)
      const paymentData = await payment.get({ id: body.data.id })
      if (paymentData.status === 'approved') {
        userId = paymentData.external_reference
      }
    } 
    // Caso 2: Assinatura Recorrente
    else if (body.type === 'subscription_preapproval' && body.data?.id) {
      const preApproval = new PreApproval(mpClient)
      const subscriptionData = await preApproval.get({ id: body.data.id })
      if (subscriptionData.status === 'authorized') {
        userId = subscriptionData.external_reference
      }
    }

    if (userId) {
      console.log(`✅ Upgrade para Premium via ${body.type}: Usuário ${userId}`)
      await prisma.user.update({
        where: { id: userId },
        data: { plan: 'premium' }
      })
      return NextResponse.json({ message: 'Plan updated to premium' })
    }

    // Responder 200 para o MP parar de tentar enviar o mesmo webhook
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Erro no Webhook Mercado Pago:', error)
    // Mesmo com erro, retornamos 200/201 para não entrar em loop de retentativas se for erro de lógica
    return NextResponse.json({ error: 'Internal error' }, { status: 200 })
  }
}
