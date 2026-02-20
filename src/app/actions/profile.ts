"use server";

import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { getSession, login } from "@/lib/auth"; // Need to update session
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeProfile(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const gender = formData.get("gender") as string;

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const hashedPassword = await hashPassword(password);

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      password: hashedPassword,
      phoneNumber,
      gender,
      isFirstLogin: false,
    },
  });

  // Update session with new data (important to clear isFirstLogin flag in session)
  await login({
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role,
    isFirstLogin: false,
    isBanned: updatedUser.isBanned
  });

  redirect("/dashboard/panel");
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const gender = formData.get("gender") as string;
  const email = formData.get("email") as string; // Allow email update? Maybe restricted. Let's allow it for now.

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phoneNumber,
        gender,
        email: email || null,
      },
    });

    // Update session
    await login({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      isFirstLogin: updatedUser.isFirstLogin,
      isBanned: updatedUser.isBanned
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (e) {
    return { error: "Failed to update profile. Email might be taken." };
  }
}
