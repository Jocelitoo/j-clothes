import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

export const POST = async (req: Request) => {
  try {
    // Pega o corpo cru como ArrayBuffer e converte para Buffer
    const buf = Buffer.from(await req.arrayBuffer());
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (error) {
      return NextResponse.json(
        { error: `Webhook error ${error}` },
        { status: 400 },
      );
    }

    switch (event.type) {
      case 'charge.succeeded': {
        const charge: Stripe.Charge = event.data.object as Stripe.Charge;

        if (typeof charge.payment_intent === 'string') {
          // Garantir que os campos de endereço sejam válidos ou undefined
          const address = charge.shipping?.address
            ? {
                line1: charge.shipping.address.line1 || '', // Garantir que não seja null
                line2: charge.shipping.address.line2 || '', // Garantir que não seja null
                city: charge.shipping.address.city || '', // Garantir que não seja null
                state: charge.shipping.address.state || '', // Garantir que não seja null
                cep: charge.shipping.address.postal_code || '', // Garantir que não seja null
                country: charge.shipping.address.country || '', // Garantir que não seja null
              }
            : undefined; // Se não houver endereço, passe undefined

          try {
            // Atualizar o status do pedido para pago
            const updatedOrder = await prisma.order.update({
              where: { paymentIntentId: charge.payment_intent },
              data: {
                status: 'Pago',
                address: address || undefined,
              },
            });

            // Identificar os itens comprados e diminuir sua quantidade disponível no estoque de acordo com a quantidade que foi comprada
            updatedOrder.products.map(async (product) => {
              const productInBD = await prisma.product.findUnique({
                where: { id: product.id },
              });

              if (!productInBD) {
                return NextResponse.json(
                  { error: 'Produto não encontrado' },
                  { status: 400 },
                );
              }

              const updatedVariations = productInBD.variations.map(
                (variation) => {
                  if (variation.size === product.size) {
                    return {
                      ...variation,
                      inStock: variation.inStock - product.quantity,
                    };
                  }
                  return variation;
                },
              );

              await prisma.product.update({
                where: { id: product.id },
                data: { variations: updatedVariations },
              });
            });

            console.log('Pedido atualizado com sucesso:');
          } catch (error) {
            console.error(
              'Erro ao atualizar o pedido no banco de dados:',
              error,
            );

            return NextResponse.json(
              { error: 'Database update failed: ' + error },
              { status: 500 },
            );
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Retorna uma resposta de sucesso
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Erro na função do webhook: ${error}`);

    // Retorna um status 500 em caso de erro no processamento do webhook
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
};
