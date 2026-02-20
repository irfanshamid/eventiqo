import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Calendar, MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/prisma';

import { EventDialog } from '@/components/events/event-dialog';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">
          Event Management
        </h1>
        <EventDialog />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nama Event</TableHead>
              <TableHead>Klien</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-gray-500"
                >
                  Belum ada event. Silakan buat event baru.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-gray-400" />
                      {event.clientName || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {event.date
                        ? new Date(event.date).toLocaleDateString('id-ID')
                        : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {event.location || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === 'ACTIVE'
                          ? 'default'
                          : event.status === 'COMPLETED'
                            ? 'secondary'
                            : 'outline'
                      }
                      className={
                        event.status === 'ACTIVE'
                          ? 'bg-[#22C55E] hover:bg-[#16A34A]'
                          : event.status === 'DRAFT'
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-[#1E88E5] hover:bg-[#1565C0]'
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/events/${event.id}`}>
                          Detail
                        </Link>
                      </Button>
                      <EventDialog event={event} />
                    </div>
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
