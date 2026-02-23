"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const eventId = formData.get("eventId") as string;
  const assigneeId = formData.get("assigneeId") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const dueDate = formData.get("dueDate") as string;

  await prisma.task.create({
    data: {
      title,
      eventId,
      assigneeId: assigneeId === "unassigned" ? null : assigneeId || null,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath("/dashboard/tasks");
}

export async function updateTask(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const eventId = formData.get("eventId") as string;
  const assigneeId = formData.get("assigneeId") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const dueDate = formData.get("dueDate") as string;

  await prisma.task.update({
    where: { id },
    data: {
      title,
      eventId,
      assigneeId: assigneeId === "unassigned" ? null : assigneeId || null,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath("/dashboard/tasks");
}
