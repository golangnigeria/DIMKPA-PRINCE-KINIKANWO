"use client";

import { useEffect, useState, type FC } from "react";
import { useRouter } from "next/navigation";
import { AdminPanel } from "@/components/admin/admin-panel";
import { StatCard } from "@/components/admin/stat-card";
import { SubmissionCard } from "@/components/admin/submission-card";
import { formatDate } from "@/helpers/format-helpers";
import { type ContactRow, type SubmissionStats } from "@/types/admin-types";
import { LogoutButton } from "./logout-button";

const AdminPage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    last7Days: 0,
    latest: null,
  });
  const [submissions, setSubmissions] = useState<ContactRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const loadData = async (currentPage = 1, currentSearch = "") => {
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/admin/login");
        return;
      }
      const authData = await authRes.json();
      if (authData.status !== "admin") {
        router.push("/admin/login");
        return;
      }
      setAdminEmail(authData.user?.email || "Admin");

      const [statsRes, listRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(
          `/api/admin/submissions?page=${currentPage}&q=${encodeURIComponent(
            currentSearch
          )}`
        ),
      ]);

      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s);
      }

      if (listRes.ok) {
        const l = await listRes.json();
        setSubmissions(l.rows || []);
        setTotalCount(l.total || 0);
        setPage(l.page || 1);
        setPageCount(l.pageCount || 1);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page, search);
  }, [page, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-5 py-14">
        <div className="flex items-center gap-3 text-neutral-400">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-mono">Loading dashboard...</span>
        </div>
      </main>
    );
  }

  const firstOnPage = totalCount > 0 ? (page - 1) * 10 + 1 : 0;
  const lastOnPage = Math.min(page * 10, totalCount);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow">Admin</p>
          <h1 className="text-heading mt-1">Contact submissions</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Signed in as {adminEmail}
          </p>
        </div>
        <LogoutButton />
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total" value={String(stats.total)} />
        <StatCard label="Last 7 days" value={String(stats.last7Days)} />
        <StatCard
          label="Most recent"
          value={stats.latest ? formatDate(stats.latest) : "N/A"}
        />
      </section>

      <form onSubmit={handleSearchSubmit} className="mt-8 flex gap-3">
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, email, or message..."
          className="field-input field-input-focus flex-1"
        />
        <button type="submit" className="btn-primary px-6 py-2 text-sm">
          Search
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-500">
        {totalCount === 0
          ? search
            ? `No submissions match “${search}”.`
            : "No submissions yet."
          : `Showing ${firstOnPage} to ${lastOnPage} of ${totalCount}`}
      </p>

      <section className="mt-4 space-y-4">
        {submissions.map((row) => (
          <SubmissionCard key={row.id} row={row} />
        ))}
      </section>

      {pageCount > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-ghost px-4 py-2 text-xs disabled:opacity-40"
          >
            Previous
          </button>
          <span className="flex items-center px-3 text-xs text-neutral-400">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            className="btn-ghost px-4 py-2 text-xs disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default AdminPage;
