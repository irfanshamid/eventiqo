import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { BudgetPlanner } from '@/components/events/budget-planner';
import { EventVendorList } from '@/components/events/vendors/event-vendor-list';
import prisma from '@/lib/prisma';
import { EventDialog } from '@/components/events/event-dialog';
import { EventDocumentList } from '@/components/events/documents/event-document-list';
import { TaskList } from '@/components/tasks/task-list';
import { DraftRabList } from '@/components/events/draft-rab/draft-rab-list';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect('/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!currentUser) redirect('/api/auth/logout');

  const ownerId = currentUser.managerId || currentUser.id;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      vendors: {
        include: {
          vendor: true,
        },
      },
      expenses: true,
      draftRabItems: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!event) {
    return <div>Event not found</div>;
  }

  const tasks = await prisma.task.findMany({
    where: { eventId: id },
    include: {
      event: true,
      assignee: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const users = await prisma.user.findMany({
    where: {
      OR: [{ id: ownerId }, { managerId: ownerId }],
    },
    select: { id: true, name: true },
  });

  const allVendors = await prisma.vendor.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  const templates = await prisma.template.findMany({
    select: { id: true, title: true, category: true, content: true },
    orderBy: { title: 'asc' },
  });

  const totalVendorCost = event.vendors.reduce(
    (acc, v) => acc + (v.agreedCost || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
            {event.name}
          </h1>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {event.date
                ? new Date(event.date).toLocaleDateString()
                : 'No date'}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location || 'No location'}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {event.clientName || 'No client'}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <EventDialog event={event} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="draft-rab">Draft RAB</TabsTrigger>
          <TabsTrigger value="budget">Budget & Finance</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="documents">Proposal & Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">
                  Total Budget
                </h3>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(event.totalBudget)}
              </div>
              <p className="text-xs text-muted-foreground">
                Target margin {event.targetMargin}%
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <TaskList
            tasks={tasks}
            events={[{ id: event.id, name: event.name }]}
            users={users}
            currentUserRole={currentUser.role}
          />
        </TabsContent>

        <TabsContent value="draft-rab">
          <DraftRabList items={event.draftRabItems} eventId={event.id} />
        </TabsContent>

        <TabsContent value="budget">
          <BudgetPlanner
            eventId={event.id}
            totalBudget={event.totalBudget}
            targetMargin={event.targetMargin}
            draftRabItems={event.draftRabItems}
          />
        </TabsContent>

        <TabsContent value="vendors">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900">
              Total Vendor Cost (Agreed)
            </span>
            <span className="text-xl font-bold text-blue-700">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(totalVendorCost)}
            </span>
          </div>
          <EventVendorList
            eventId={event.id}
            eventVendors={event.vendors}
            vendors={allVendors}
          />
        </TabsContent>

        <TabsContent value="documents">
          <EventDocumentList
            templates={templates}
            event={{
              name: event.name,
              clientName: event.clientName || '',
              date: event.date ? new Date(event.date).toLocaleDateString() : '',
              location: event.location || '',
              totalBudget: new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(event.totalBudget),
            }}
            draftRabItems={event.draftRabItems}
            vendors={event.vendors.map((v) => v.vendor)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
