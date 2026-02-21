"use server";

import prisma from "@/lib/prisma";
import { hashPassword, generatePassword } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function createUser(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  let role = formData.get("role") as string;
  
  if (!username) {
    return { error: "Username is required" };
  }

  // If user is not ADMIN, force role to STAFF and assign managerId
  let managerId = null;
  if (session.user.role !== 'ADMIN') {
    role = 'STAFF';
    managerId = session.user.id;
  }
  
  // Generate random password
  const password = generatePassword(10);
  const hashedPassword = await hashPassword(password);

  try {
    await prisma.user.create({
      data: {
        username,
        email: email || null,
        name,
        role,
        password: hashedPassword,
        isFirstLogin: true,
        managerId,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/dashboard/team");
    return { success: true, password }; // Return password to show to admin
  } catch (e) {
    return { error: "Failed to create user. Username or Email might be taken." };
  }
}

export async function deleteUser(userId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  // TODO: Add permission check (only Admin or Manager of the user)
  
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath("/admin");
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (e) {
    return { error: "Failed to delete user." };
  }
}

export async function resetPassword(userId: string) {
  const password = generatePassword(10);
  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: { id: userId },
    data: { 
      password: hashedPassword,
      isFirstLogin: true // Force them to change it again? Usually yes for hard reset.
    },
  });
  revalidatePath("/admin");
  return { success: true, password };
}

export async function toggleBanUser(userId: string, isBanned: boolean) {
  await prisma.user.update({
    where: { id: userId },
    data: { isBanned },
  });
  revalidatePath("/admin");
}
