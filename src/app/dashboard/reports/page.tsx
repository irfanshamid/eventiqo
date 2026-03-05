import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ReportsClientPage from './client-page';

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
      draftRabItems: {
        where: {
          totalPriceReal: {
            not: null,
          },
        },
      },
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

    const eventCost = event.draftRabItems.reduce(
      (sum, item) => sum + (item.totalPriceReal || 0),
      0,
    );
    const eventProfit = event.totalBudget - eventCost;

    monthlyData[month].revenue += event.totalBudget;
    monthlyData[month].profit += eventProfit;

    // Expense Breakdown
    event.draftRabItems.forEach((item) => {
      const category = item.category || 'Other';
      if (!expenseCategoryData[category]) {
        expenseCategoryData[category] = 0;
      }
      expenseCategoryData[category] += item.totalPriceReal || 0;
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
    <ReportsClientPage 
      revenueChartData={revenueChartData}
      profitChartData={profitChartData}
      expenseChartData={expenseChartData}
    />
  );
}
