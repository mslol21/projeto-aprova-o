# Configuração Final Mercado Pago 🚀

Baseado nas capturas de tela, já configurei as credenciais e as rotas no código. Para que tudo funcione perfeitamente (automação do Plano Premium), siga estes passos finais no painel do Mercado Pago:

## 1. Atualizar a URL do Webhook
Na sua captura de tela (Webhooks), a URL está apenas como `https://projetoaprovacao.vercel.app/`. 
**Você precisa atualizar para a rota completa do código:**
- URL: `https://projetoaprovacao.vercel.app/api/webhooks/mercadopago`
- Certifique-se de que os eventos **Pagamentos** e **Planos e Assinaturas** continuam marcados.

## 2. Variáveis de Ambiente na Vercel
Como adicionamos novas variáveis no `.env`, você precisa cadastrá-las no painel da Vercel para que o checkout funcione em produção:
1. Vá em **Settings > Environment Variables** na Vercel.
2. Adicione:
   - `MERCADOPAGO_PUBLIC_KEY`: `APP_USR-e49255c2-f391-4609-8575-beb2740b1fad`
   - `MERCADOPAGO_ACCESS_TOKEN`: `APP_USR-6783630116786843-021610-d460b0f4b0ad9879cc8a6cea7f0708d5-264023100`
   - `MERCADOPAGO_WEBHOOK_SECRET`: `33bdcc2ba441294bf35fbff27c7b60a8409e66ee6aeff0b1732bcbfbe5889375`
3. Faça um **Redeploy** na Vercel para aplicar.

## 3. O que foi implementado?
- **Checkout Pro**: Ao clicar em "Começar Premium" ou no botão de Upgrade no Dashboard, o usuário é levado para o Mercado Pago.
- **Ativação Automática**: Assim que o pagamento for aprovado, o Mercado Pago avisará nosso sistema via Webhook, e o plano do usuário mudará para `premium` instantaneamente no banco de dados.
- **Travas Visuais**: Agora o botão de Upgrade aparece no topo do Dashboard para usuários free, facilitando a conversão.

Se precisar de ajuda com os testes de pagamento, use os cartões de teste que aparecem no seu painel!
