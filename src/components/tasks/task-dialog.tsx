"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createTask, updateTask } from "@/app/actions/tasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  eventId: string;
  assigneeId: string | null;
  priority: string;
  status: string;
}

interface Event {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
}

interface TaskDialogProps {
  task?: Task;
  events: Event[];
  users: User[];
}

export function TaskDialog({ task, events, users }: TaskDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!task;

  async function handleSubmit(formData: FormData) {
    if (isEditing && task) {
      await updateTask(task.id, formData);
    } else {
      await createTask(formData);
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
          <Button className="bg-[#1E88E5]">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update task details."
                : "Create a new task and assign it to a team member."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={task?.title}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="eventId">
                Event
              </Label>
              <div>
                <Select name="eventId" defaultValue={task?.eventId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="assigneeId">
                Assignee
              </Label>
              <div>
                <Select name="assigneeId" defaultValue={task?.assigneeId || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="priority">
                Priority
              </Label>
              <div>
                <Select name="priority" defaultValue={task?.priority || "MEDIUM"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">
                Status
              </Label>
              <div>
                <Select name="status" defaultValue={task?.status || "PENDING"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? "Save changes" : "Create Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
