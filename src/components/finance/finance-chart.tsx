'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface FinanceChartProps {
  data: {
    name: string;
    revenue: number;
    cost: number;
    profit: number;
  }[];
}

export function FinanceChart({ data }: FinanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            new Intl.NumberFormat('id-ID', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(value)
          }
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          formatter={(
            value: number | string | Array<number | string> | undefined,
          ) => [
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(Number(value || 0)),
          ]}
        />
        <Legend />
        <Bar
          dataKey="revenue"
          name="Revenue"
          fill="#22C55E"
          radius={[4, 4, 0, 0]}
        />
        <Bar dataKey="cost" name="Cost" fill="#EF4444" radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="profit"
          name="Profit"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
