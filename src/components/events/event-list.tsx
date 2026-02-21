'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Search, MoreHorizontal } from 'lucide-react';
import { deleteEvent } from '@/app/actions/events';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventDialog } from '@/components/events/event-dialog';

interface Event {
  id: string;
  name: string;
  clientName: string | null;
  location: string | null;
  date: Date | string | null;
  totalBudget: number;
  targetMargin: number;
  status: string;
}

export function EventList({ events }: { events: Event[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const router = useRouter();

  const filteredEvents = events.filter((event) => {
    const matchesName = event.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const eventDate = event.date ? new Date(event.date) : null;
    let matchesDate = true;

    if (dateStart && eventDate) {
      matchesDate = matchesDate && eventDate >= new Date(dateStart);
    }
    if (dateEnd && eventDate) {
      matchesDate = matchesDate && eventDate <= new Date(dateEnd);
    }

    return matchesName && matchesDate;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  async function handleDelete() {
    if (selectedEvent) {
      await deleteEvent(selectedEvent.id);
      router.refresh();
      setConfirmOpen(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search event name..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            className="bg-white w-auto"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
          <span className="self-center text-gray-500">-</span>
          <Input
            type="date"
            className="bg-white w-auto"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="py-4 pl-6">Event Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEvents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-32 text-gray-500"
                >
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium py-4 pl-6">
                    {event.name}
                  </TableCell>
                  <TableCell>{event.clientName || '-'}</TableCell>
                  <TableCell>{event.location || '-'}</TableCell>
                  <TableCell>
                    {event.date
                      ? format(new Date(event.date), 'dd MMM yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(event.totalBudget)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === 'COMPLETED' ? 'default' : 'secondary'
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/events/${event.id}`}
                            className="flex items-center w-full cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4 text-blue-600" />{' '}
                            Detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditEvent(event);
                            setIsEditOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4 text-green-600" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedEvent(event);
                            setConfirmOpen(true);
                          }}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="self-center text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Event"
        description={`Are you sure you want to delete "${selectedEvent?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        variant="destructive"
      />

      {editEvent && (
        <EventDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          event={editEvent}
        />
      )}
    </div>
  );
}
