"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function createVendor(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  const ownerId = user.managerId || user.id;

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
      createdById: ownerId,
    },
  });

  revalidatePath("/dashboard/vendors");
}

export async function deleteVendor(id: string) {
  await prisma.vendor.delete({
    where: { id },
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
