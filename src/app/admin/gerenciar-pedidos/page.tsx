import { AdminNav } from '@/components/AdminNav';
import { prisma } from '@/lib/db';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Suspense } from 'react';
import { Loading2 } from '@/components/Loading2';

const ManageOrders = async () => {
  // Pegar todos os pedidos da base de dados
  const initialData = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="my-8 px-2 sm:px-4 lg:px-20">
      <DataTable columns={columns} initialData={initialData} />
    </div>
  );
};

export default function ManageOrdersPage() {
  return (
    <>
      <AdminNav />

      <Suspense fallback={<Loading2 loadingText="Carregando pedidos..." />}>
        <ManageOrders />
      </Suspense>
    </>
  );
}
