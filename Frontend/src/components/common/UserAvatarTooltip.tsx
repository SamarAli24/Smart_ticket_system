import { UserRound } from "lucide-react";
import UserAvatar from "./UserAvatar";
import type { AgentUser } from "../../types";

export default function UserAvatarTooltip({ user }: { user: AgentUser | null }) {
  return (
    <div className="group relative flex shrink-0 items-center" tabIndex={0}>
      {user ? (
        <UserAvatar name={user.name} />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-300">
          <UserRound className="h-4 w-4" />
        </span>
      )}
      <div className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 hidden w-max max-w-[240px] rounded-lg bg-ink-900 px-3 py-2 text-left shadow-lg group-focus-within:block group-hover:block">
        <p className="text-xs font-semibold text-white">{user ? user.name : "Unassigned"}</p>
        <p className="truncate text-[11px] text-slate-400">
          {user ? user.email : "No agent assigned yet"}
        </p>
      </div>
    </div>
  );
}
