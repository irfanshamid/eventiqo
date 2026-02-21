import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { EventList } from '@/components/events/event-list';
import { EventDialog } from '@/components/events/event-dialog';
import { redirect } from 'next/navigation';

export default async function EventsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect('/api/auth/logout');

  const ownerId = user.managerId || user.id;

  const events = await prisma.event.findMany({
    where: { createdById: ownerId },
    orderBy: {
      date: 'asc',
    },
  });

  const serializedEvents = events.map((event) => ({
    id: event.id,
    name: event.name,
    clientName: event.clientName,
    location: event.location,
    date: event.date ? event.date.toISOString() : null,
    totalBudget: event.totalBudget,
    targetMargin: event.targetMargin,
    status: event.status,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Events
        </h1>
        <EventDialog />
      </div>
      <EventList events={serializedEvents} />
    </div>
  );
}
