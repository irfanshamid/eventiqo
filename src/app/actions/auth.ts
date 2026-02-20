"use server";

import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/auth-utils";
import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: "Invalid credentials" };
  }

  if (user.isBanned) {
    return { error: "This account has been banned." };
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return { error: "Invalid credentials" };
  }

  await login({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isFirstLogin: user.isFirstLogin,
    isBanned: user.isBanned
  });

  if (user.isFirstLogin) {
    redirect("/complete-profile");
  } else if (user.role === 'ADMIN') {
    redirect("/admin");
  } else {
    redirect("/dashboard/panel");
  }
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
