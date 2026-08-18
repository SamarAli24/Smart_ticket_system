import { LogOut } from "lucide-react";
import UserAvatar from "../common/UserAvatar";
import type { AgentUser } from "../../types";

interface UserSummaryProps {
  user: AgentUser;
  variant?: "sidebar" | "topbar";
  onLogout?: () => void;
}

export default function UserSummary({ user, variant = "sidebar", onLogout }: UserSummaryProps) {
  if (variant === "topbar") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <UserAvatar name={user.name} />
          <div className="leading-tight">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-2 py-0.5 text-[11px] font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {user.role}
            </span>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-rose-500"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2.5">
      <div className="flex items-center gap-2.5">
        <UserAvatar name={user.name} />
        <div className="leading-tight">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-slate-400">{user.role}</p>
        </div>
      </div>
      {onLogout && (
        <button
          onClick={onLogout}
          className="text-slate-500 hover:text-rose-400"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
