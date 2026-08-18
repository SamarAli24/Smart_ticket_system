import QuickSearchInput from "./QuickSearchInput";
import UserSummary from "./UserSummary";
import { useAuth } from "../../context/AuthContext";

interface TopBarProps {
  title: string;
  subtitle: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { currentUser, logout } = useAuth();
  if (!currentUser) return null;

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <QuickSearchInput />
        <UserSummary user={currentUser} variant="topbar" onLogout={logout} />
      </div>
    </header>
  );
}
