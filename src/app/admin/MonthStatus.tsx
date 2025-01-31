'use client';

import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';
import { CurrentUserProps, OrderProps } from '@/utils/props';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; // Importar o idioma desejado pro Dayjs
import { CreditCard, DollarSign, Users2 } from 'lucide-react';

dayjs.locale('pt-br'); // Idioma do Dayjs

interface MonthStatusProps {
  paidOrders: OrderProps[];
  users: CurrentUserProps[];
}

export const MonthStatus: React.FC<MonthStatusProps> = ({
  paidOrders,
  users,
}) => {
  const { currentUser } = useCurrentUserContext();
  const lastMonth = dayjs(dayjs().subtract(1, 'M')).format('MMMM'); // Pega o mês anterior no formato string
  const actualMonth = dayjs(dayjs()).format('MMMM'); // Pega o mês atual no formato string

  const getPercentage = (thisMonth: number, lastMonth: number) => {
    return ((thisMonth * 100) / lastMonth - 100).toFixed(2);
  };

  const percentageFormater = (percentage: string) => {
    return `${percentage.includes('-') ? percentage : `+${percentage}`}% em relação ao mês passado`;
  };

  // Pegar os pedidos pagos do mês atual
  const ordersThisMonth = paidOrders.filter(
    (order) => actualMonth === dayjs(order.createdAt).format('MMMM'),
  );

  // Pegar os pedidos pagos do mês passado
  const ordersLastMonth = paidOrders.filter(
    (order) => lastMonth === dayjs(order.createdAt).format('MMMM'),
  );

  // Calcular a porcentagem de diferença do número de vendas do mês atual e o do mês passado
  const ordersPercentage = getPercentage(
    ordersThisMonth.length,
    ordersLastMonth.length,
  );

  // Pegar os usuários criados no mês atual
  const usersThisMonth = users.filter(
    (user) => actualMonth === dayjs(user.createdAt).format('MMMM'),
  );

  // Pegar os usuários criados no mês passado
  const usersLastMonth = users.filter(
    (user) => lastMonth === dayjs(user.createdAt).format('MMMM'),
  );

  // Calcular a porcentagem de diferença do número de usuários criados do mês atual e o do mês passado
  const usersPercentage = getPercentage(
    usersThisMonth.length,
    usersLastMonth.length,
  );

  // Calcular o lucro do mês atual
  const revenueThisMonth = ordersThisMonth.reduce(
    (acc, order) => acc + order.amount,
    0,
  );

  // calcular o lucro do mês passado
  const revenueInLastMonth = ordersLastMonth.reduce(
    (acc, order) => acc + order.amount,
    0,
  );

  // Calcular a porcentagem de diferença do lucro do mês atual e o do mês passado
  const revenuePercentage = getPercentage(revenueThisMonth, revenueInLastMonth);

  const formatedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(revenueThisMonth / 100);

  const allStatus = [
    {
      label: 'Lucro',
      icon: <DollarSign size={16} className="text-slate-500 hidden sm:block" />,
      number: formatedTotal,
      percentage: percentageFormater(revenuePercentage),
    },
    {
      label: 'Vendas',
      icon: <CreditCard size={16} className="text-slate-500 hidden sm:block" />,
      number: `+${ordersThisMonth.length}`,
      percentage: percentageFormater(ordersPercentage),
    },
    {
      label: 'Novos usuários',
      icon: <Users2 size={16} className="text-slate-500 hidden sm:block" />,
      number: `+${usersThisMonth.length}`,
      percentage: percentageFormater(usersPercentage),
    },
  ];

  return (
    currentUser?.role === 'Admin' && (
      <div className="space-y-4">
        <h1 className="text-center text-2xl font-bold">Sumário</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {allStatus.map((status, index) => {
            return (
              <div
                key={index}
                className="text-center border p-4 rounded-md flex flex-col gap-1 sm:text-start"
              >
                <div className="flex items-center justify-center sm:justify-between">
                  <p className="font-semibold"> {status.label}</p>

                  {status.icon}
                </div>

                <p className="font-bold text-2xl">{status.number}</p>

                <p className="text-sm text-slate-500">{status.percentage}</p>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};
