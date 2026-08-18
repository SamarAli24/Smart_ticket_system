import BrandLogo from "./BrandLogo";
import SidebarNavLink from "./SidebarNavLink";
import UserSummary from "./UserSummary";
import { navItems } from "./navConfig";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  if (!currentUser) return null;

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-ink-950 text-slate-300">
      <div className="px-5 py-6">
        <BrandLogo />
      </div>

      <div className="mt-2 flex-1 px-3">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <SidebarNavLink key={item.to} {...item} />
          ))}
        </nav>
      </div>

      <div className="border-t border-white/5 p-4">
        <UserSummary user={currentUser} variant="sidebar" onLogout={logout} />
      </div>
    </aside>
  );
}
