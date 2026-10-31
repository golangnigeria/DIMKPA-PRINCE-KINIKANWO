"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_BASE_URL } from "@/lib/api/config";

export interface LoginState {
  error?: string;
}

const safeRedirect = (next: string | null): string =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

export const signIn = async (
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> => {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirect(String(formData.get("next") ?? "") || null);

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      return { error: data.error || "Invalid email or password." };
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", data.token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });
  } catch (error) {
    console.error("Sign in request failed:", error);
    return { error: "Could not reach the authentication backend." };
  }

  revalidatePath("/admin", "layout");
  redirect(next);
};

export const signOut = async (): Promise<void> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;

    if (sessionCookie) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionCookie}`,
          Cookie: `admin_session=${sessionCookie}`,
        },
        cache: "no-store",
      }).catch(() => {});
    }

    cookieStore.delete("admin_session");
  } catch (error) {
    console.error("Sign out error:", error);
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/login");
};
