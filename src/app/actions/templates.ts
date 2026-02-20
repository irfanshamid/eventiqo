"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTemplate(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;

  await prisma.template.create({
    data: {
      title,
      category,
      content,
    },
  });

  revalidatePath("/dashboard/documents");
}

export async function updateTemplate(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;

  await prisma.template.update({
    where: { id },
    data: {
      title,
      category,
      content,
    },
  });

  revalidatePath("/dashboard/documents");
}

export async function deleteTemplate(id: string) {
  await prisma.template.delete({
    where: { id },
  });

  revalidatePath("/dashboard/documents");
}
