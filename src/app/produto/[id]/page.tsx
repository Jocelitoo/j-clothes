import React from 'react';
import { ProductImage } from './ProductImage';
import { ProductInfo } from './ProductInfo';
import { prisma } from '@/lib/db';
import { Review } from './Review';
import { getServerSession } from 'next-auth';

type Params = Promise<{ id: string }>;

interface ProductParamsProps {
  params: Params;
}

const Product: React.FC<ProductParamsProps> = async ({ params }) => {
  const { id } = await params; // Pega o parâmetro chamado id que é o id do produto
  const session = await getServerSession(); // Pega os dados da sessão
  const userEmail = session?.user.email; // Pega o email do usuário logado
  let hableToReview = true;

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: { reviews: true },
  });

  if (product) {
    // Pega os pedido que estão conectados ao email do usuário logado, que na lista de produtos possuem algum produto com o id recebido no parâmetro, que tem seu status 'Pago' e o deliveryStatus 'Enviado'
    const orders = await prisma.order.findMany({
      where: {
        user: {
          email: userEmail,
        },
        AND: {
          products: {
            some: {
              id: id,
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
            email: userEmail,
          },
        },
      });

      if (reviews.length > 0) hableToReview = false;
    }
  }

  return product ? (
    <div className="px-2 sm:px-4 lg:px-20">
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 items-center justify-center gap-4 sm:gap-8 my-8 max-w-[1060px] mx-auto">
        <ProductImage product={product} />

        <ProductInfo product={product} />
      </div>

      <Review product={product} hableToReview={hableToReview} />
    </div>
  ) : (
    <div className="flex-grow flex items-center justify-center">
      <h1 className="font-bold text-2xl">Produto não encontrado</h1>
    </div>
  );
};

export default Product;
