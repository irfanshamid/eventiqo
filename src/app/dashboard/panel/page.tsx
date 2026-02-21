import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarDays,
  CheckSquare,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    // If session exists but user not found in DB, clear session to prevent loop
    redirect('/api/auth/logout');
  }

  const ownerId = user.managerId || user.id;

  const events = await prisma.event.findMany({
    where: { createdById: ownerId },
    orderBy: { createdAt: 'desc' },
  });

  const tasks = await prisma.task.findMany({
    where: {
      event: {
        createdById: ownerId,
      },
    },
  });

  const vendors = await prisma.vendor.findMany();

  const teamMembers = await prisma.user.findMany({
    where: {
      OR: [{ id: ownerId }, { managerId: ownerId }],
    },
  });

  const expenses = await prisma.expense.findMany({
    where: {
      event: {
        createdById: ownerId,
      },
    },
  });

  const activeEventsCount = events.filter((e) => e.status === 'ACTIVE').length;
  const pendingTasksCount = tasks.filter((t) => t.status === 'PENDING').length;

  const eventStats = [
    { name: 'Draft', total: events.filter((e) => e.status === 'DRAFT').length },
    { name: 'Active', total: activeEventsCount },
    {
      name: 'Completed',
      total: events.filter((e) => e.status === 'COMPLETED').length,
    },
  ];

  const totalBudget = events.reduce((acc, e) => acc + e.totalBudget, 0);
  const totalSpent = expenses.reduce((acc, e) => acc + e.actualAmount, 0);
  const totalProfit = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Overview</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Aktif</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEventsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total {events.length} events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tugas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground">
              Total {tasks.length} tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tim</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendor</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">Partner vendors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview Progress Event</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={eventStats} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Finance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Budget
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(totalBudget)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Spent
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(totalSpent)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Estimated Profit
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(totalProfit)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
