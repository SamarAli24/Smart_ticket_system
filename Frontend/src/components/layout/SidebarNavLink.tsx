import { NavLink } from "react-router-dom";
import type { NavItem } from "./navConfig";

export default function SidebarNavLink({ to, label, icon: Icon, matchExact }: NavItem) {
  return (
    <NavLink
      to={to}
      end={matchExact}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-emerald-500/10 text-emerald-400"
            : "text-slate-300 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      {label}
    </NavLink>
  );
}
