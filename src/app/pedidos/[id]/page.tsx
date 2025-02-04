import { prisma } from '@/lib/db';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import { Suspense } from 'react';
import { Loading2 } from '@/components/Loading2';

interface OrdersProps {
  params: Promise<{ id: string }>;
}

const Orders: React.FC<OrdersProps> = async ({ params }) => {
  const { id } = await params; // Pega o parâmetro id

  const data = await prisma.order.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mt-8 space-y-4 px-2 sm:px-4 lg:px-20">
      <h1 className="text-center text-2xl font-bold">Seus pedidos</h1>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default function OrdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<Loading2 loadingText="Carregando dados..." />}>
      <Orders params={params} />
    </Suspense>
  );
}
