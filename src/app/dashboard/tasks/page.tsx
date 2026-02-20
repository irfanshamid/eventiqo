import prisma from '@/lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Calendar, User, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { TaskDialog } from '@/components/tasks/task-dialog';

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    include: {
      event: true,
      assignee: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const events = await prisma.event.findMany({
    select: { id: true, name: true },
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Task Management
        </h1>
        <TaskDialog events={events} users={users} />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Title</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-gray-500"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-gray-400" />
                      {task.title}
                    </div>
                  </TableCell>
                  <TableCell>{task.event.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-gray-400" />
                      {task.assignee?.name || 'Unassigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Flag
                        className={`h-3 w-3 ${
                          task.priority === 'HIGH'
                            ? 'text-red-500'
                            : task.priority === 'MEDIUM'
                              ? 'text-yellow-500'
                              : 'text-green-500'
                        }`}
                      />
                      {task.priority}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === 'COMPLETED' ? 'secondary' : 'default'
                      }
                      className={
                        task.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TaskDialog task={task} events={events} users={users} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
