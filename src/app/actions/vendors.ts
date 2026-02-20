"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createVendor(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const contactInfo = formData.get("contactInfo") as string;
  const averageCost = parseFloat(formData.get("averageCost") as string);

  await prisma.vendor.create({
    data: {
      name,
      category,
      contactInfo,
      averageCost: isNaN(averageCost) ? 0 : averageCost,
    },
  });

  revalidatePath("/dashboard/vendors");
}

export async function updateVendor(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const contactInfo = formData.get("contactInfo") as string;
  const averageCost = parseFloat(formData.get("averageCost") as string);

  await prisma.vendor.update({
    where: { id },
    data: {
      name,
      category,
      contactInfo,
      averageCost: isNaN(averageCost) ? 0 : averageCost,
    },
  });

  revalidatePath("/dashboard/vendors");
}
