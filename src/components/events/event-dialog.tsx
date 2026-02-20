'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { createEvent, updateEvent } from '@/app/actions/events';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Event {
  id: string;
  name: string;
  clientName: string | null;
  location: string | null;
  date: Date | null;
  totalBudget: number;
  targetMargin: number;
  status: string;
}

export function EventDialog({ event }: { event?: Event }) {
  const [open, setOpen] = useState(false);
  const isEditing = !!event;

  async function handleSubmit(formData: FormData) {
    if (isEditing && event) {
      await updateEvent(event.id, formData);
    } else {
      await createEvent(formData);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="bg-[#1E88E5] hover:bg-[#1565C0]">
            <Plus className="mr-2 h-4 w-4" />
            Buat Event Baru
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update event details.'
                : 'Create a new event and start planning.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={event?.name}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="clientName">Client</Label>
              <Input
                id="clientName"
                name="clientName"
                defaultValue={event?.clientName || ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={event?.location || ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                defaultValue={
                  event?.date
                    ? new Date(event.date).toISOString().split('T')[0]
                    : ''
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="totalBudget">Budget</Label>
              <Input
                id="totalBudget"
                name="totalBudget"
                type="number"
                defaultValue={event?.totalBudget || 0}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="targetMargin">Target Profit Margin (%)</Label>
              <Input
                id="targetMargin"
                name="targetMargin"
                type="number"
                defaultValue={event?.targetMargin || 20}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <div>
                <Select name="status" defaultValue={event?.status || 'DRAFT'}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? 'Save changes' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
