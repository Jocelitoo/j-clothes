'use client';

import { ColumnDef } from '@tanstack/react-table';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br'; // Importar o idioma desejado pro Dayjs
import dayjs from 'dayjs';
import { CartProductProps, OrderProps } from '@/utils/props';
import { Button } from '@/components/ui/button';
import { Bike, Check, Clock, DollarSign, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCartContext } from '@/hooks/CartContextProvider';
import { deleteOrder } from '@/actions/orderActions';

dayjs.extend(relativeTime);
dayjs.locale('pt-br'); // Idioma do Dayjs

// Componente separado para a célula de ações pois é preciso usar hooks que só funcionam dentro de component React
const ActionsCell: React.FC<{
  id: string;
  products: CartProductProps[];
  paymentIntentId: string;
  status: string;
}> = ({ id, products, paymentIntentId, status }) => {
  const { setCartProducts, handleSetPaymentIntent } = useCartContext();

  const handleCartUpdate = () => {
    setCartProducts(products);
    handleSetPaymentIntent(paymentIntentId);
  };

  return (
    <div className="flex gap-4">
      <Button variant={'outline'} asChild>
        <Link href={`/pedido/${id}`}>
          <span className="sr-only">Ver pedido</span>
          <Eye />
        </Link>
      </Button>

      {status !== 'Pago' && (
        <>
          <Button variant={'outline'} asChild>
            <Link href={`/carrinho`} onClick={handleCartUpdate}>
              <span className="sr-only">Efetuar pagamento</span>
              <DollarSign />
            </Link>
          </Button>

          <Button variant={'outline'} onClick={() => deleteOrder(id)}>
            <span className="sr-only">Apagar</span>
            <Trash2 />
          </Button>
        </>
      )}
    </div>
  );
};

export const columns: ColumnDef<OrderProps>[] = [
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
      const { id, products, paymentIntentId, status } = row.original; // Pega o id, products e paymentIntentId  do order

      return (
        <ActionsCell
          id={id}
          products={products}
          paymentIntentId={paymentIntentId}
          status={status}
        />
      );
    },
  },
];
