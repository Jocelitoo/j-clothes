'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface DataProps {
  userId: string;
  productId: string;
  userName: string;
  text: string;
  rating: number;
}

export const createReview = async (data: DataProps) => {
  try {
    const { productId, userId, userName, text, rating } = data;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('Usuário não existe');

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error('Produto não existe');

    // Verificar se o usuário já fez alguma review no produto
    const orders = await prisma.order.findMany({
      where: {
        user: {
          email: user.email,
        },
        AND: {
          products: {
            some: {
              id: product.id,
            },
          },
          AND: {
            status: 'Pago',
            AND: {
              deliveryStatus: 'Enviado',
            },
          },
        },
      },
    });

    if (orders.length > 0) {
      // Verificar se o usuário já fez uma review
      const reviews = await prisma.review.findMany({
        where: {
          user: {
            email: user.email,
          },
        },
      });

      if (reviews.length > 0) throw new Error('Usuário já fez uma review');
    }

    // Criar o review
    await prisma.review.create({
      data: {
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
        userName: userName,
        text: text,
        rating: rating,
      },
    });

    revalidatePath(`/produto/${productId}`); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return 'Review criado';
  } catch (error) {
    throw error;
  }
};
