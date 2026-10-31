import { cache } from "react";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api/config";

export interface AdminUser {
  id: string;
  email: string;
}

export type AdminState =
  | { status: "admin"; user: AdminUser }
  | { status: "signed-out" }
  | { status: "not-admin"; email: string }
  | { status: "schema-missing" }
  | { status: "not-configured" };

export const getAdminState = cache(async (): Promise<AdminState> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;

    if (!sessionCookie) {
      return { status: "signed-out" };
    }

    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionCookie}`,
        Cookie: `admin_session=${sessionCookie}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { status: "signed-out" };
    }

    const data = await res.json();
    if (data.status === "admin" && data.user) {
      return {
        status: "admin",
        user: { id: data.user.id, email: data.user.email },
      };
    }

    return { status: "signed-out" };
  } catch (error) {
    console.error("Backend auth check error:", error);
    return { status: "not-configured" };
  }
});

export const getAdminUser = async (): Promise<AdminUser | null> => {
  const state = await getAdminState();
  return state.status === "admin" ? state.user : null;
};
