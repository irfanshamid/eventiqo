import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, TrendingUp } from 'lucide-react';
import prisma from '@/lib/prisma';
import {
  MonthlyRevenueChart,
  ProfitTrendChart,
  ExpenseBreakdownChart,
} from '@/components/reports/charts';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ReportsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect('/api/auth/logout');

  const ownerId = user.managerId || user.id;

  const events = await prisma.event.findMany({
    where: { createdById: ownerId },
    include: {
      expenses: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Process data for charts
  const monthlyData: Record<string, { revenue: number; profit: number }> = {};
  const expenseCategoryData: Record<string, number> = {};

  events.forEach((event) => {
    if (!event.date) return;

    const month = new Date(event.date).toLocaleString('default', {
      month: 'short',
      year: '2-digit',
    });

    if (!monthlyData[month]) {
      monthlyData[month] = { revenue: 0, profit: 0 };
    }

    const eventCost = event.expenses.reduce(
      (sum, exp) => sum + exp.actualAmount,
      0,
    );
    const eventProfit = event.totalBudget - eventCost;

    monthlyData[month].revenue += event.totalBudget;
    monthlyData[month].profit += eventProfit;

    // Expense Breakdown
    event.expenses.forEach((exp) => {
      if (!expenseCategoryData[exp.category]) {
        expenseCategoryData[exp.category] = 0;
      }
      expenseCategoryData[exp.category] += exp.actualAmount;
    });
  });

  const revenueChartData = Object.entries(monthlyData).map(([name, data]) => ({
    name,
    value: data.revenue,
  }));

  const profitChartData = Object.entries(monthlyData).map(([name, data]) => ({
    name,
    value: data.profit,
  }));

  const expenseChartData = Object.entries(expenseCategoryData)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Reports & Analytics
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#1E88E5] rounded-md hover:bg-[#1565C0]">
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <MonthlyRevenueChart data={revenueChartData} />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expense Breakdown
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ExpenseBreakdownChart data={expenseChartData} />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer col-span-1 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Trend</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ProfitTrendChart data={profitChartData} />
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold">Key Insights</h2>
        </div>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>
            Top revenue month:{' '}
            <strong>
              {revenueChartData.sort((a, b) => b.value - a.value)[0]?.name ||
                'N/A'}
            </strong>
          </li>
          <li>
            Most expensive category:{' '}
            <strong>{expenseChartData[0]?.name || 'N/A'}</strong>
          </li>
          <li>
            Total Profit Year-to-Date:{' '}
            <strong>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(profitChartData.reduce((a, b) => a + b.value, 0))}
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
