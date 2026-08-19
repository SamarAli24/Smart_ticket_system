import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import type { NavGroup } from "./navConfig";

export default function SidebarNavGroup({ label, icon: Icon, children }: NavGroup) {
  const location = useLocation();
  const containsActiveRoute = children.some((item) => location.pathname.startsWith(item.to));
  const [isOpen, setIsOpen] = useState(containsActiveRoute);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mt-1 flex flex-col gap-1 border-l border-white/10 pl-4">
          {children.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.matchExact}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon className="h-3.5 w-3.5" strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
