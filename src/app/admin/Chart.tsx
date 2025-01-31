'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { OrderProps } from '@/utils/props';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import 'dayjs/locale/pt-br'; // Importar o idioma desejado pro Dayjs
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';

dayjs.locale('pt-br'); // Idioma do Dayjs

const initialChartData = [
  { month: 'janeiro', lucro: 0 },
  { month: 'fevereiro', lucro: 0 },
  { month: 'março', lucro: 0 },
  { month: 'abril', lucro: 0 },
  { month: 'maio', lucro: 0 },
  { month: 'junho', lucro: 0 },
  { month: 'julho', lucro: 0 },
  { month: 'agosto', lucro: 0 },
  { month: 'setembro', lucro: 0 },
  { month: 'outubro', lucro: 0 },
  { month: 'novembro', lucro: 0 },
  { month: 'dezembro', lucro: 0 },
];

const chartConfig = {
  desktop: {
    label: 'Lucro',
    color: '#2563eb',
  },
} satisfies ChartConfig;

interface ChartParams {
  orders: OrderProps[];
}

export const Chart: React.FC<ChartParams> = ({ orders }) => {
  const [chartData, setChartData] = useState(initialChartData);
  const [chartFormat, setChartFormat] = useState('Desktop');

  const year = String(dayjs().year()); // Pega o ano atual
  const lastYear = String(dayjs().subtract(1, 'y').year()); // Pega o ano anterior
  const [dataYear, setDataYear] = useState(year);

  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    // Resetar os dados para o estado inicial
    const updatedChartData = initialChartData.map((data) => ({
      ...data,
      lucro: 0,
    }));

    orders.map((order) => {
      const orderYear = dayjs(order.createdAt).format('YYYY'); // Pega o ano do pedido

      if (orderYear === dataYear) {
        const orderMonth = dayjs(order.createdAt).format('MMMM'); // Pega o mês do pedido

        updatedChartData.map((data) => {
          if (data.month === orderMonth) {
            data.lucro += order.amount / 100;
          }
        });
      }
    });

    // Formatar o lucro
    updatedChartData.map((data) => {
      data.lucro = Number(data.lucro.toFixed(2));
    });

    setChartData(updatedChartData);
  }, [orders, dataYear]);

  // Controla o formato do Chart de acordo com o tamanho da tela
  const handleWindowResize = useCallback(() => {
    if (window.innerWidth >= 640) setChartFormat('Desktop');
    if (window.innerWidth < 640) setChartFormat('Mobile');
  }, []);

  useEffect(() => {
    handleWindowResize(); // Executa a função quando a página é carregada

    // Executa a função quando a página é recarregada
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  return (
    currentUser?.role === 'Admin' && (
      <>
        <div className="flex justify-end">
          <Select
            defaultValue={year}
            onValueChange={(value) => setDataYear(value)}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Selecione um ano" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value={lastYear}>{lastYear}</SelectItem>
                <SelectItem value={year}>{year}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <ChartContainer
          config={chartConfig}
          className="h-96 w-full border rounded-md p-4"
        >
          {chartFormat === 'Desktop' ? (
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey={'month'}
                tickLine={false}
                tickMargin={10}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickMargin={8}
                tickCount={5}
                tickFormatter={(value) => 'R$ ' + value}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey={'lucro'} fill="var(--color-desktop)" radius={4} />
            </BarChart>
          ) : (
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: -20,
              }}
            >
              <XAxis
                type="number"
                tickMargin={10}
                tickCount={5}
                tickFormatter={(value) => 'R$ ' + value}
              />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="lucro" fill="var(--color-desktop)" radius={5} />
            </BarChart>
          )}
        </ChartContainer>
      </>
    )
  );
};
