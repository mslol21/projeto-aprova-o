import { MercadoPagoConfig, Preference, Payment, PreApproval } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn('⚠️ MERCADOPAGO_ACCESS_TOKEN não configurado!');
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
});

export const preference = new Preference(mpClient);
export const payment = new Payment(mpClient);
export const preApproval = new PreApproval(mpClient);
