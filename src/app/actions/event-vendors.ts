"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addEventVendor(eventId: string, formData: FormData) {
  const vendorId = formData.get("vendorId") as string;
  const role = formData.get("role") as string;
  const agreedCost = parseFloat(formData.get("agreedCost") as string);
  const status = formData.get("status") as string;

  await prisma.eventVendor.create({
    data: {
      eventId,
      vendorId,
      role,
      agreedCost: isNaN(agreedCost) ? 0 : agreedCost,
      status,
    },
  });

  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function updateEventVendor(id: string, eventId: string, formData: FormData) {
  const role = formData.get("role") as string;
  const agreedCost = parseFloat(formData.get("agreedCost") as string);
  const status = formData.get("status") as string;

  await prisma.eventVendor.update({
    where: { id },
    data: {
      role,
      agreedCost: isNaN(agreedCost) ? 0 : agreedCost,
      status,
    },
  });

  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function deleteEventVendor(id: string, eventId: string) {
  await prisma.eventVendor.delete({
    where: { id },
  });

  revalidatePath(`/dashboard/events/${eventId}`);
}
