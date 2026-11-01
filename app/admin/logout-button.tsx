"use client";

import { useState, type FC } from "react";
import { useRouter } from "next/navigation";

export const LogoutButton: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/admin/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="btn-ghost px-4 py-2 text-xs disabled:opacity-60 cursor-pointer"
    >
      <span>{loading ? "Signing out…" : "Sign out"}</span>
    </button>
  );
};
