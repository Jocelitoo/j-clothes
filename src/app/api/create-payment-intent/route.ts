import { prisma } from '@/lib/db';
import { CartProductProps } from '@/utils/props';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

const calculateOrderAmount = (products: CartProductProps[]) => {
  const totalPrice = products.reduce(
    (acc, product) => acc + product.price * product.quantity, // Soma o valor de acc com o resultado da multiplicação entre o valor e a quantidade do item, acc começa com valor 0
    0,
  );

  return Math.round(totalPrice * 100); // Stripe recebe os valores em centavos, então é preciso multiplicar por 100. 120 centavos * 100 = 1.20
};

export async function POST(request: Request) {
  const session = await getServerSession(); // Pega o name e email do usuário logado (server-side)

  // Pegar os dados completos do usuário logado
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user.email },
  });

  if (!currentUser)
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  // Organizar os dados
  const body = await request.json();
  const { products, payment_intent_id } = body;
  const total = calculateOrderAmount(products);

  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: total,
    currency: 'brl', // minúscula
    status: 'Pendente',
    deliveryStatus: 'Pendente',
    paymentIntentId: payment_intent_id,
    products: products,
  };

  if (payment_intent_id) {
    const current_intent =
      await stripe.paymentIntents.retrieve(payment_intent_id);

    // Atualizar o pedido
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: total },
      );

      // Verificar se o pedido existe antes de tentar atualizar
      const existing_order = await prisma.order.findUnique({
        where: { paymentIntentId: payment_intent_id },
      });

      if (!existing_order) {
        // Criar o pedido
        await prisma.order.create({ data: orderData });

        revalidatePath('/admin/gerenciar-pedidos'); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
      } else {
        // Atualizar o pedido
        await prisma.order.update({
          where: { id: existing_order.id },
          data: {
            amount: total,
            products: products,
          },
        });
      }
      revalidatePath('/admin/gerenciar-pedidos'); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página

      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    // Criar o intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'brl',
      automatic_payment_methods: { enabled: true },
    });

    // Criar o pedido
    orderData.paymentIntentId = paymentIntent.id;

    await prisma.order.create({
      data: orderData,
    });

    revalidatePath('/admin/gerenciar-pedidos'); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página

    return NextResponse.json({ paymentIntent });
  }
}
