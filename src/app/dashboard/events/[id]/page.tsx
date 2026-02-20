import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { BudgetPlanner } from '@/components/events/budget-planner';
import { EventVendorList } from '@/components/events/vendors/event-vendor-list';
import prisma from '@/lib/prisma';
import { EventDialog } from '@/components/events/event-dialog';

import { EventDocumentList } from '@/components/events/documents/event-document-list';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      vendors: {
        include: {
          vendor: true,
        },
      },
      expenses: true,
    },
  });

  if (!event) {
    return <div>Event not found</div>;
  }

  const allVendors = await prisma.vendor.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  const templates = await prisma.template.findMany({
    select: { id: true, title: true, category: true },
    orderBy: { title: 'asc' },
  });

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
          <Button className="bg-[#1E88E5]">Publish Event</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="budget">Budget & Finance</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="documents">Proposal & Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Quick stats for this event */}
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
                }).format(event.totalBudget)}
              </div>
              <p className="text-xs text-muted-foreground">Target margin 20%</p>
            </div>
            {/* Add more cards */}
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="rounded-md border p-4 bg-white">
            <h3 className="text-lg font-medium mb-4">Task Management</h3>
            <p className="text-gray-500">Task list goes here...</p>
          </div>
        </TabsContent>

        <TabsContent value="budget">
          <BudgetPlanner
            eventId={event.id}
            totalBudget={event.totalBudget}
            targetMargin={event.targetMargin}
            expenses={event.expenses}
          />
        </TabsContent>

        <TabsContent value="vendors">
          <EventVendorList
            eventId={event.id}
            eventVendors={event.vendors}
            vendors={allVendors}
          />
        </TabsContent>

        <TabsContent value="documents">
          <EventDocumentList templates={templates} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
