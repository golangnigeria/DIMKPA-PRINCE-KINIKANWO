import { type FC } from "react";

export const SetupNotice: FC = () => (
  <div className="space-y-4 text-sm">
    <div className="flex items-center gap-2">
      <span className="inline-block h-2 w-2 rounded-full bg-sand" />
      <h2 className="font-semibold text-white">
        Backend server not connected
      </h2>
    </div>

    <p className="text-neutral-400">
      The contact form and this inbox connect to the Go backend server.
      Make sure your Go server is running:
    </p>
    <div className="rounded-lg bg-neutral-900/60 p-3 font-mono text-xs text-neutral-300">
      cd backend &amp;&amp; go run main.go
    </div>
    <p className="text-xs text-neutral-500">
      In development, SQLite is automatically initialized. In production, PostgreSQL is used.
    </p>
  </div>
);
