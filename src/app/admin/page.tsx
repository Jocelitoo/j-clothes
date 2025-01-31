import { AdminNav } from '@/components/AdminNav';
import { prisma } from '@/lib/db';
import { Chart } from './Chart';
import { MonthStatus } from './MonthStatus';

const Admin = async () => {
  const paidOrders = await prisma.order.findMany({ where: { status: 'Pago' } }); // Pega os pedidos que foram pagos
  const users = await prisma.user.findMany(); // Pega os usuários

  return (
    <>
      <AdminNav />

      <div className="my-8 px-2 space-y-4 sm:px-4 lg:px-20">
        <MonthStatus paidOrders={paidOrders} users={users} />

        <Chart orders={paidOrders} />
      </div>
    </>
  );
};

export default Admin;
