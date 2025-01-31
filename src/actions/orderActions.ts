'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const getOrders = async () => {
  try {
    // Pegar todos os pedidos
    const order = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    return order;
  } catch (error) {
    throw error;
  }
};

export const updateDeliveryStatus = async (
  id: string,
  deliveryStatus: string,
) => {
  try {
    // Verificar se o order existe
    const order = await prisma.order.findUnique({ where: { id: id } });

    if (!order) throw new Error('Pedido não existe');

    // Verificar se o order foi pago
    if (order.status !== 'Pago') throw new Error('Pedido não foi pago');

    // Atualizar o order
    await prisma.order.update({
      where: { id: id },
      data: {
        deliveryStatus: deliveryStatus,
      },
    });

    revalidatePath('/admin/gerenciar-pedidos'); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return 'Status atualizado com sucesso';
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (id: string) => {
  try {
    // Verificar se o order existe
    const order = await prisma.order.findUnique({ where: { id: id } });

    if (!order) throw new Error('Pedido não existe');

    // Verificar se o order foi pago
    if (order.status === 'Pago')
      throw new Error('Pedido pagos não podem ser deletados');

    // Deletar o order
    await prisma.order.delete({
      where: { id: id },
    });

    revalidatePath('/pedidos'); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return 'Pedido deletado';
  } catch (error) {
    throw error;
  }
};
