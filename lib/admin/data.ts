import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api/config";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  budget: string | null;
  message: string;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  email_sent?: boolean | null;
  email_error?: string | null;
}

export const PAGE_SIZE = 25;

export interface SubmissionPage {
  rows: ContactSubmission[];
  total: number;
  page: number;
  pageCount: number;
}

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  if (!sessionCookie) {
    throw new Error("Not signed in as an admin.");
  }
  return {
    Authorization: `Bearer ${sessionCookie}`,
    Cookie: `admin_session=${sessionCookie}`,
  };
};

export const listSubmissions = async (
  search: string,
  page: number
): Promise<SubmissionPage> => {
  const headers = await getAuthHeaders();
  const query = new URLSearchParams();
  if (search) query.set("q", search);
  if (page > 1) query.set("page", String(page));
  query.set("limit", String(PAGE_SIZE));

  const url = `${API_BASE_URL}/api/admin/submissions?${query.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Could not load submissions.");
  }

  const data = await res.json();
  return {
    rows: data.rows ?? [],
    total: data.total ?? 0,
    page: data.page ?? 1,
    pageCount: data.pageCount ?? 1,
  };
};

export const getSubmissionStats = async (): Promise<{
  total: number;
  last7Days: number;
  latest: string | null;
}> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    return { total: 0, last7Days: 0, latest: null };
  }

  const data = await res.json();
  return {
    total: data.total ?? 0,
    last7Days: data.last7Days ?? 0,
    latest: data.latest ?? null,
  };
};

export const deleteSubmission = async (id: string): Promise<void> => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/admin/submissions/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Could not delete that submission.");
  }
};
