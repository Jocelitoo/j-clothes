import { AdminNav } from '@/components/AdminNav';
import { prisma } from '@/lib/db';
import { Chart } from './Chart';
import { MonthStatus } from './MonthStatus';
import { Suspense } from 'react';
import { Loading2 } from '@/components/Loading2';

const Admin = async () => {
  const paidOrders = await prisma.order.findMany({ where: { status: 'Pago' } }); // Pega os pedidos que foram pagos
  const users = await prisma.user.findMany(); // Pega os usuários

  return (
    <div className="my-8 px-2 space-y-4 sm:px-4 lg:px-20">
      <MonthStatus paidOrders={paidOrders} users={users} />

      <Chart orders={paidOrders} />
    </div>
  );
};

export default function AdminPage() {
  return (
    <>
      <AdminNav />

      <Suspense fallback={<Loading2 loadingText="Carregando dados..." />}>
        <Admin />
      </Suspense>
    </>
  );
}
