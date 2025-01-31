'use client';

import { ColumnDef } from '@tanstack/react-table';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br'; // Importar o idioma desejado pro Dayjs
import dayjs from 'dayjs';
import { OrderProps } from '@/utils/props';
import { Button } from '@/components/ui/button';
import { Bike, Check, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { updateDeliveryStatus } from '@/actions/orderActions';

dayjs.extend(relativeTime);
dayjs.locale('pt-br'); // Idioma do Dayjs

export const columns: ColumnDef<OrderProps>[] = [
  { accessorKey: 'user.name', header: 'Nome' },
  {
    accessorKey: 'amount',
    header: 'Total',
    cell: ({ row }) => {
      const amount = row.original.amount / 100; // Pega o valor do order e dividi por 100 para corrigir, pq o stripe recebe os valos sem virgula, então dividir por 100 corrigi isso

      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status de pagamento',
    cell: ({ row }) => {
      const paymentStatus = row.original.status; // Pega o status de pagamento do order

      return (
        <div
          className={`w-fit ${paymentStatus === 'Pago' ? 'bg-cyan-300' : 'bg-slate-300'} p-2 rounded-md flex gap-1 items-center`}
        >
          {paymentStatus}
          {paymentStatus === 'Pago' ? <Check size={16} /> : <Clock size={16} />}
        </div>
      );
    },
  },
  {
    accessorKey: 'deliveryStatus',
    header: 'Status de entrega',
    cell: ({ row }) => {
      const deliveryStatus = row.original.deliveryStatus; // Pega o deliveryStatus do order

      return (
        <div
          className={`w-fit ${deliveryStatus === 'Entregue' ? 'bg-green-300' : deliveryStatus === 'Enviado' ? 'bg-purple-300' : 'bg-slate-300'} p-2 rounded-md flex gap-1 items-center`}
        >
          {deliveryStatus}

          {deliveryStatus === 'Entregue' ? (
            <Check size={16} />
          ) : deliveryStatus === 'Enviado' ? (
            <Bike size={16} />
          ) : (
            <Clock size={16} />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => {
      const date = row.original.createdAt; // Pega a data de criação do order
      const formatedDate = dayjs(date).fromNow(); // Formata a data de criação para dizer quantos dias fazem desde o dia que o order foi criado

      return <div>{formatedDate}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const id = row.original.id; // Pega o id do order
      const paymentStatus = row.original.status; // Pega o status de pagamento do order

      return (
        <div className="flex gap-4">
          <Button
            disabled={paymentStatus !== 'Pago'}
            variant={'outline'}
            onClick={() =>
              updateDeliveryStatus(id, 'Enviado').catch((error) =>
                alert(error.message),
              )
            }
          >
            <span className="sr-only">Enviar</span>
            <Bike />
          </Button>

          <Button
            disabled={paymentStatus !== 'Pago'}
            variant={'outline'}
            onClick={() =>
              updateDeliveryStatus(id, 'Entregue').catch((error) =>
                alert(error.message),
              )
            }
          >
            <span className="sr-only">Entregue</span>
            <Check />
          </Button>

          <Button variant={'outline'} asChild>
            <Link href={`/pedido/${id}`}>
              <span className="sr-only">Ver pedido</span>
              <Eye />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
