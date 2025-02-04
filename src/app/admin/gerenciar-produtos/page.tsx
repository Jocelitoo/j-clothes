import { AdminNav } from '@/components/AdminNav';
import { prisma } from '@/lib/db';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Suspense } from 'react';
import { Loading2 } from '@/components/Loading2';

const ManageProducts = async () => {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }, // Pega os produtos na ordem do mais novo criado para o mais velho
  });

  return (
    <div className="my-8 px-2 sm:px-4 lg:px-20">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default function ManageProductsPage() {
  return (
    <>
      <AdminNav />

      <Suspense fallback={<Loading2 loadingText="Carregando produtos..." />}>
        <ManageProducts />
      </Suspense>
    </>
  );
}
