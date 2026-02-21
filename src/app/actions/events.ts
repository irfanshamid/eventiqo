"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function createEvent(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "User not found" };
  
  const ownerId = user.managerId || user.id;

  const name = formData.get("name") as string;
  const clientName = formData.get("clientName") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;
  const totalBudget = parseFloat(formData.get("totalBudget") as string);
  const targetMargin = parseFloat(formData.get("targetMargin") as string);
  const status = formData.get("status") as string;

  try {
    await prisma.event.create({
      data: {
        name,
        clientName,
        location,
        date: dateStr ? new Date(dateStr) : null,
        totalBudget: isNaN(totalBudget) ? 0 : totalBudget,
        targetMargin: isNaN(targetMargin) ? 20 : targetMargin,
        status,
        createdById: ownerId,
      },
    });

    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create event" };
  }
}

export async function updateEvent(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const clientName = formData.get("clientName") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;
  const totalBudget = parseFloat(formData.get("totalBudget") as string);
  const targetMargin = parseFloat(formData.get("targetMargin") as string);
  const status = formData.get("status") as string;

  try {
    await prisma.event.update({
      where: { id },
      data: {
        name,
        clientName,
        location,
        date: dateStr ? new Date(dateStr) : null,
        totalBudget: isNaN(totalBudget) ? 0 : totalBudget,
        targetMargin: isNaN(targetMargin) ? 20 : targetMargin,
        status,
      },
    });

    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete event" };
  }
}
