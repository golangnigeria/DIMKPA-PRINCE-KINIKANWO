"use client";

import { useState, type FC } from "react";

export const DeleteButton: FC<{ id: string; onDeleted?: () => void }> = ({
  id,
  onDeleted,
}) => {
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not delete submission.");
        setArmed(false);
        setPending(false);
        return;
      }
      if (onDeleted) {
        onDeleted();
      } else {
        window.location.reload();
      }
    } catch {
      setError("Network error while deleting.");
      setArmed(false);
      setPending(false);
    }
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
        disabled={pending}
        onClick={handleDelete}
        className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-60 cursor-pointer"
      >
        {pending ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setArmed(false)}
        className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
};
