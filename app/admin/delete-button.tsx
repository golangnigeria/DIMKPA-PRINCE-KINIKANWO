"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FC } from "react";
import { deleteSubmissionAction } from "./actions";

export const DeleteButton: FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteSubmissionAction(id);
      if (!result.ok) {
        setError(result.error ?? "Could not delete.");
        setArmed(false);
        return;
      }
      router.refresh();
    });
  };

  if (!armed) {
    return (
      <div className="flex items-center gap-3">
        {error && (
          <span role="alert" className="text-xs text-red-400">
            {error}
          </span>
        )}
        <button
          type="button"
          onClick={() => setArmed(true)}
          className="text-xs text-neutral-500 transition-colors hover:text-red-400 cursor-pointer"
          aria-label="Delete submission"
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-400">Delete permanently?</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-60 cursor-pointer"
      >
        {pending ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setArmed(false)}
        disabled={pending}
        className="text-xs text-neutral-500 hover:text-neutral-300 disabled:opacity-60 cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
};
