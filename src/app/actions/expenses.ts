"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createExpense(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const estimatedAmount = parseFloat(formData.get("estimatedAmount") as string);
  const actualAmount = parseFloat(formData.get("actualAmount") as string);
  const status = formData.get("status") as string;

  await prisma.expense.create({
    data: {
      eventId,
      description,
      category,
      estimatedAmount: isNaN(estimatedAmount) ? 0 : estimatedAmount,
      actualAmount: isNaN(actualAmount) ? 0 : actualAmount,
      status,
      date: new Date(), // Default to current date for now
    },
  });

  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function deleteExpense(id: string, eventId: string) {
  await prisma.expense.delete({
    where: { id },
  });

  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function updateExpense(id: string, eventId: string, formData: FormData) {
  const status = formData.get("status") as string;
  const estimatedAmount = parseFloat(formData.get("estimatedAmount") as string);
  const actualAmount = parseFloat(formData.get("actualAmount") as string);

  await prisma.expense.update({
    where: { id },
    data: {
      status,
      estimatedAmount: isNaN(estimatedAmount) ? undefined : estimatedAmount,
      actualAmount: isNaN(actualAmount) ? undefined : actualAmount,
    },
  });

  revalidatePath(`/dashboard/events/${eventId}`);
}
