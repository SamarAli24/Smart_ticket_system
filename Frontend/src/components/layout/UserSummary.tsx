import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UserAvatar from "../common/UserAvatar";
import type { AgentUser } from "../../types";

interface UserSummaryProps {
  user: AgentUser;
  variant?: "sidebar" | "topbar";
  onLogout?: () => void;
}

export default function UserSummary({ user, variant = "sidebar", onLogout }: UserSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleLogout() {
    setIsOpen(false);
    onLogout?.();
  }

  if (variant === "topbar") {
    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-slate-100"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <UserAvatar name={user.name} />
          <div className="text-left leading-tight">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-2 py-0.5 text-[11px] font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {user.role}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-10 mt-2 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1 transition hover:bg-white/5"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <UserAvatar name={user.name} />
          <div className="text-left leading-tight">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-10 mb-2 w-full overflow-hidden rounded-lg border border-white/10 bg-ink-900 py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
