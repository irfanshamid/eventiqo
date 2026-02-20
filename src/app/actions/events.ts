"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const name = formData.get("name") as string;
  const clientName = formData.get("clientName") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;
  const totalBudget = parseFloat(formData.get("totalBudget") as string);
  const targetMargin = parseFloat(formData.get("targetMargin") as string);
  const status = formData.get("status") as string;

  await prisma.event.create({
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
}

export async function updateEvent(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const clientName = formData.get("clientName") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;
  const totalBudget = parseFloat(formData.get("totalBudget") as string);
  const targetMargin = parseFloat(formData.get("targetMargin") as string);
  const status = formData.get("status") as string;

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
}
