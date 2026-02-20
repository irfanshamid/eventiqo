import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarDays, 
  CheckSquare, 
  Users, 
  Briefcase 
} from "lucide-react";
import prisma from "@/lib/prisma";
import { OverviewChart } from "@/components/dashboard/overview-chart";

export default async function DashboardPage() {
  const events = await prisma.event.findMany();
  const tasks = await prisma.task.findMany();
  const vendors = await prisma.vendor.findMany();
  const users = await prisma.user.findMany();

  const activeEventsCount = events.filter(e => e.status === 'ACTIVE').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'PENDING').length;

  const eventStats = [
    { name: 'Draft', total: events.filter(e => e.status === 'DRAFT').length },
    { name: 'Active', total: activeEventsCount },
    { name: 'Completed', total: events.filter(e => e.status === 'COMPLETED').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Dashboard</h1>
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
            <p className="text-xs text-muted-foreground">Total {events.length} events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tugas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground">Total {tasks.length} tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tim</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
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
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Meeting Klien A</p>
                  <p className="text-sm text-muted-foreground">Baru saja</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Pembayaran Vendor B</p>
                  <p className="text-sm text-muted-foreground">2 jam lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
