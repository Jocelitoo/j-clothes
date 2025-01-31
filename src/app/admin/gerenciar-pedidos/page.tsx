import { AdminNav } from '@/components/AdminNav';
import { prisma } from '@/lib/db';
import { DataTable } from './data-table';
import { columns } from './columns';

const ManageOrders = async () => {
  // Pegar todos os pedidos da base de dados
  const initialData = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <>
      <AdminNav />

      <div className="my-8 px-2 sm:px-4 lg:px-20">
        <DataTable columns={columns} initialData={initialData} />
      </div>
    </>
  );
};

export default ManageOrders;
