import { prisma } from '@/lib/db';
import React from 'react';
import { OrderInfo } from './OrderInfo';

interface OrderProps {
  params: Promise<{ id: string }>;
}

const Order: React.FC<OrderProps> = async ({ params }) => {
  const { id } = await params; // Pega o id enviado no parâmetro
  const order = await prisma.order.findUnique({
    where: { id: id },
    include: { user: true },
  });

  if (!order) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <h1 className="font-bold text-2xl">Pedido não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="my-8 px-2 sm:px-4 lg:px-20 flex flex-col gap-4">
      <OrderInfo order={order} />
    </div>
  );
};

export default Order;
