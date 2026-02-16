import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mpClient } from '@/lib/mercadopago'
import { Payment } from 'mercadopago'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('🔔 Webhook Mercado Pago recebido:', body)

    // O Mercado Pago envia o tipo de recurso e o ID
    // Ex: { "type": "payment", "data": { "id": "123456" } }
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id
      const payment = new Payment(mpClient)
      
      const paymentData = await payment.get({ id: paymentId })
      
      console.log('💰 Status do Pagamento:', paymentData.status)

      if (paymentData.status === 'approved') {
        const userId = paymentData.external_reference
        
        if (userId) {
          console.log(`✅ Upgrade para Premium: Usuário ${userId}`)
          
          await prisma.user.update({
            where: { id: userId },
            data: { plan: 'premium' }
          })
          
          return NextResponse.json({ message: 'Plan updated to premium' })
        }
      }
    }

    // Responder 200 para o MP parar de tentar enviar o mesmo webhook
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Erro no Webhook Mercado Pago:', error)
    // Mesmo com erro, retornamos 200/201 para não entrar em loop de retentativas se for erro de lógica
    return NextResponse.json({ error: 'Internal error' }, { status: 200 })
  }
}
