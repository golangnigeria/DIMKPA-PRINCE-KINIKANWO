import { type FC } from "react";
import { DeleteButton } from "@/app/admin/delete-button";
import { formatDateTime } from "@/helpers/format-helpers";
import { type SubmissionCardProps } from "@/types/admin-types";

export const SubmissionCard: FC<SubmissionCardProps> = ({ row }) => (
  <article className="glass p-5 border border-white/10 hover:border-emerald-500/30 transition-colors">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-white">
          {row.name}
        </h3>
        <a
          href={`mailto:${row.email}`}
          className="break-all text-sm text-emerald-400 hover:underline"
        >
          {row.email}
        </a>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {row.budget && (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs text-emerald-300">
            {row.budget}
          </span>
        )}
        <time
          dateTime={row.created_at}
          className="whitespace-nowrap text-xs text-neutral-500 font-mono"
        >
          {formatDateTime(row.created_at)}
        </time>
      </div>
    </header>

    <p className="mt-3.5 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
      {row.message}
    </p>

    {row.email_sent === false && (
      <p className="mt-3.5 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
        Notification email was not delivered
        {row.email_error ? `: ${row.email_error}` : "."}
      </p>
    )}

    <details className="mt-4">
      <summary className="cursor-pointer list-none text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-300">
        Metadata
      </summary>
      <dl className="mt-3 grid gap-2 text-xs text-neutral-400 sm:grid-cols-[7rem_1fr]">
        <dt className="text-neutral-500">IP address</dt>
        <dd className="break-all font-mono">{row.ip_address ?? "N/A"}</dd>
        <dt className="text-neutral-500">User agent</dt>
        <dd className="break-all">{row.user_agent ?? "N/A"}</dd>
        <dt className="text-neutral-500">Submission ID</dt>
        <dd className="break-all font-mono text-[11px] text-neutral-500">{row.id}</dd>
      </dl>
    </details>

    <footer className="mt-4 flex justify-end border-t border-white/[0.06] pt-3">
      <DeleteButton id={row.id} />
    </footer>
  </article>
);
