'use client';

import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import dayjs from 'dayjs';
import { Bike, Check, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { OrderProps } from '@/utils/props';
import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';
import { redirect } from 'next/navigation';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'em %s',
    past: '%s atrás',
    s: 'alguns segundos',
    m: '1 minuto',
    mm: '%d minutos',
    h: '1 hora',
    hh: '%d horas',
    d: '1 dia',
    dd: '%d dias',
    M: '1 mês',
    MM: '%d meses',
    y: '1 ano',
    yy: '%d anos',
  },
});

interface OrderInfoProps {
  order: OrderProps;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    if (currentUser?.id !== order.userId && currentUser?.role !== 'Admin')
      redirect('/');
  }, [currentUser, order.userId]);

  const formatedDate = dayjs(order.createdAt).fromNow(); // Formata a data de criação para dizer quantos dias fazem desde o dia que o order foi criado
  const formatedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(order.amount / 100);

  return (
    <>
      <h1 className="font-bold text-3xl">Detalhes do pedido</h1>

      <div className="space-y-2">
        <p>Id do pedido: {order.id}</p>
        <p>Nome do comprador: {order.user?.name}</p>
        <p>Email do comprador: {order.user?.email}</p>
        <p>Data: {formatedDate}</p>
        <p>
          Endereço: {order.address?.line1}, {order.address?.city} -{' '}
          {order.address?.state} - {order.address?.cep}
        </p>
        <p>Total: {formatedAmount}</p>

        <p className="flex items-center gap-2">
          Status de pagamento:{' '}
          <span
            className={`w-fit ${order.status === 'Pago' ? 'bg-cyan-300' : 'bg-slate-300'} p-2 rounded-md flex gap-1 items-center`}
          >
            {order.status}{' '}
            {order.status === 'Pago' ? (
              <Check size={16} />
            ) : (
              <Clock size={16} />
            )}
          </span>
        </p>

        <p className="flex items-center gap-2">
          Status de Entrega:{' '}
          <span
            className={`w-fit ${order.deliveryStatus === 'Entregue' ? 'bg-green-300' : order.deliveryStatus === 'Enviado' ? 'bg-purple-300' : 'bg-slate-300'} p-2 rounded-md flex gap-1 items-center`}
          >
            {order.deliveryStatus}
            {order.deliveryStatus === 'Entregue' ? (
              <Check size={16} />
            ) : order.deliveryStatus === 'Enviado' ? (
              <Bike size={16} />
            ) : (
              <Clock size={16} />
            )}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-xl">Produtos comprados:</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Tamanho</TableHead>
              <TableHead className="text-center">Preço</TableHead>
              <TableHead className="text-center">Quantidade</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {order.products.map((product, index) => {
              const formatPrice = (price: number) => {
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(price);
              };

              return (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-2">
                    <Link
                      href={`/produto/${product.id}`}
                      className="aspect-square relative min-w-14 sm:min-w-20 bg-slate-200 rounded-md"
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    {product.name}
                  </TableCell>

                  <TableCell className="text-center">{product.size}</TableCell>

                  <TableCell className="text-center">
                    {formatPrice(product.price)}
                  </TableCell>

                  <TableCell className="text-center">
                    {product.quantity}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatPrice(product.price * product.quantity)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
