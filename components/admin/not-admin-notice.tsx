import { type FC } from "react";
import { LogoutButton } from "@/app/admin/logout-button";

export const NotAdminNotice: FC<{ email: string }> = ({ email }) => (
  <div className="space-y-4 text-sm">
    <h1 className="text-lg font-semibold text-white">Not an admin</h1>
    <p className="text-neutral-400">
      You are signed in as <span className="text-neutral-200">{email}</span>, but
      that account is not on this project&rsquo;s admin list.
    </p>
    <LogoutButton />
  </div>
);
