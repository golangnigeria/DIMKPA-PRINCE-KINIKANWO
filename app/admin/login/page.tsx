import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense, type FC } from "react";
import { HERO_NAME } from "@/constants/portfolio-constants";
import { getAdminState } from "@/lib/admin/auth";
import { SetupNotice } from "@/components/admin/setup-notice";
import {
  ADMIN_LOGIN_DESCRIPTION,
  ADMIN_LOGIN_TITLE,
} from "@/constants/seo-constants";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: ADMIN_LOGIN_TITLE,
  description: ADMIN_LOGIN_DESCRIPTION,
  openGraph: {
    type: "website",
    title: `${ADMIN_LOGIN_TITLE} · ${HERO_NAME}`,
    description: ADMIN_LOGIN_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${ADMIN_LOGIN_TITLE} · ${HERO_NAME}`,
    description: ADMIN_LOGIN_DESCRIPTION,
  },
};

const AdminLoginPage: FC = async () => {
  const state = await getAdminState();

  if (state.status === "admin") redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xl font-bold text-emerald-400">
            {HERO_NAME.charAt(0)}
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Inquiries and leads for {HERO_NAME}
          </p>
        </div>

        <div className="glass gradient-border p-6 md:p-7">
          {state.status === "not-configured" || state.status === "schema-missing" ? (
            <SetupNotice />
          ) : (
            <Suspense
              fallback={
                <div className="h-64 animate-pulse rounded-lg bg-white/5" />
              }
            >
              <LoginForm />
            </Suspense>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500 font-mono">
          Protected area · Go Backend API
        </p>
      </div>
    </main>
  );
};

export default AdminLoginPage;
