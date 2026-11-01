"use client";

import { useState, type FC, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HERO_NAME } from "@/constants/portfolio-constants";

const AdminLoginPage: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Could not reach authentication server.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="relative inline-flex h-14 w-14 overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/40 shadow-lg shadow-emerald-950/50">
            <Image
              src="/profile.webp"
              alt={HERO_NAME}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Inquiries and leads for {HERO_NAME}
          </p>
        </div>

        <div className="glass gradient-border p-6 md:p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="field-label">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input field-input-focus"
                placeholder="stackninja.pro@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="field-label">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input field-input-focus"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Authenticating…" : "Sign In"}</span>
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500 font-mono">
          Protected area · Go Backend API
        </p>
      </div>
    </main>
  );
};

export default AdminLoginPage;
