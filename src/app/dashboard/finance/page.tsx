import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FinanceChart } from '@/components/finance/finance-chart';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function FinancePage() {
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
      date: 'desc',
    },
  });

  const totalRevenue = events.reduce(
    (sum, event) => sum + event.totalBudget,
    0,
  );
  const totalCost = events.reduce((sum, event) => {
    return (
      sum + event.expenses.reduce((expSum, exp) => expSum + exp.actualAmount, 0)
    );
  }, 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const chartData = events.map((event) => {
    const cost = event.expenses.reduce((sum, exp) => sum + exp.actualAmount, 0);
    const profit = event.totalBudget - cost;
    return {
      name: event.name,
      revenue: event.totalBudget,
      cost,
      profit,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Financial Overview
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">From all events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(totalCost)}
            </div>
            <p className="text-xs text-muted-foreground">Expenses incurred</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(totalProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Margin: {profitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Financial Performance per Event</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <FinanceChart data={chartData} />
        </CardContent>
      </Card>

      <div className="rounded-md border bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">Profitability per Event</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead className="text-right">Revenue (Budget)</TableHead>
              <TableHead className="text-right">Cost (Expenses)</TableHead>
              <TableHead className="text-right">Profit</TableHead>
              <TableHead className="text-right">Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => {
              const eventCost = event.expenses.reduce(
                (sum, exp) => sum + exp.actualAmount,
                0,
              );
              const eventProfit = event.totalBudget - eventCost;
              const margin =
                event.totalBudget > 0
                  ? (eventProfit / event.totalBudget) * 100
                  : 0;

              return (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(event.totalBudget)}
                  </TableCell>
                  <TableCell className="text-right text-red-500">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(eventCost)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${eventProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(eventProfit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        margin >= 20
                          ? 'default'
                          : margin >= 10
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {margin.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
