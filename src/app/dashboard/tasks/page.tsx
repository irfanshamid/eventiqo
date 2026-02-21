import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { TaskList } from '@/components/tasks/task-list';

export default async function TasksPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect('/api/auth/logout');

  const ownerId = user.managerId || user.id;

  const tasks = await prisma.task.findMany({
    where: {
      event: {
        createdById: ownerId,
      },
    },
    include: {
      event: true,
      assignee: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const events = await prisma.event.findMany({
    where: { createdById: ownerId },
    select: { id: true, name: true },
  });

  const users = await prisma.user.findMany({
    where: {
      OR: [{ id: ownerId }, { managerId: ownerId }],
    },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Task Management
        </h1>
      </div>
      <TaskList
        tasks={tasks}
        events={events}
        users={users}
        currentUserRole={user.role}
      />
    </div>
  );
}
