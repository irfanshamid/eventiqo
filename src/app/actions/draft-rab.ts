"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDraftRabItem(eventId: string, formData: FormData) {
  const category = formData.get("category") as string;
  const item = formData.get("item") as string;
  const specification = formData.get("specification") as string;
  const qty = parseInt(formData.get("qty") as string) || 0;
  const qtyType = formData.get("qtyType") as string;
  const frequency = parseInt(formData.get("frequency") as string) || 0;
  const frequencyType = formData.get("frequencyType") as string;
  const unitPriceRab = parseFloat(formData.get("unitPriceRab") as string) || 0;
  const unitPriceReal = parseFloat(formData.get("unitPriceReal") as string) || 0;
  const remarks = formData.get("remarks") as string;

  const totalPriceRab = qty * frequency * unitPriceRab;
  const totalPriceReal = qty * frequency * unitPriceReal;

  await prisma.draftRabItem.create({
    data: {
      category,
      item,
      specification,
      qty,
      qtyType,
      frequency,
      frequencyType,
      unitPriceRab,
      totalPriceRab,
      unitPriceReal,
      totalPriceReal,
      remarks,
      eventId,
    },
  });

  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function updateDraftRabItem(id: string, eventId: string, formData: FormData) {
  const category = formData.get("category") as string;
  const item = formData.get("item") as string;
  const specification = formData.get("specification") as string;
  const qty = parseInt(formData.get("qty") as string) || 0;
  const qtyType = formData.get("qtyType") as string;
  const frequency = parseInt(formData.get("frequency") as string) || 0;
  const frequencyType = formData.get("frequencyType") as string;
  const unitPriceRab = parseFloat(formData.get("unitPriceRab") as string) || 0;
  const unitPriceReal = parseFloat(formData.get("unitPriceReal") as string) || 0;
  const remarks = formData.get("remarks") as string;

  const totalPriceRab = qty * frequency * unitPriceRab;
  const totalPriceReal = qty * frequency * unitPriceReal;

  await prisma.draftRabItem.update({
    where: { id },
    data: {
      category,
      item,
      specification,
      qty,
      qtyType,
      frequency,
      frequencyType,
      unitPriceRab,
      totalPriceRab,
      unitPriceReal,
      totalPriceReal,
      remarks,
    },
  });

  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function deleteDraftRabItem(id: string, eventId: string) {
  await prisma.draftRabItem.delete({
    where: { id },
  });
  revalidatePath(`/dashboard/events/${eventId}`);
}
