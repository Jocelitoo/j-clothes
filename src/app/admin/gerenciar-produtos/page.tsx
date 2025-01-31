import { AdminNav } from '@/components/AdminNav';
import { prisma } from '@/lib/db';
import { DataTable } from './data-table';
import { columns } from './columns';

const ManageProducts = async () => {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }, // Pega os produtos na ordem do mais novo criado para o mais velho
  });

  return (
    <>
      <AdminNav />

      <div className="my-8 px-2 sm:px-4 lg:px-20">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default ManageProducts;
