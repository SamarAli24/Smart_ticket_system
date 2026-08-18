import { LayoutGrid, ListChecks, PlusCircle, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

export const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/tickets", label: "Tickets", icon: ListChecks, matchExact: true },
  { to: "/tickets/new", label: "Create Ticket", icon: PlusCircle },
  { to: "/users", label: "Users", icon: Users },
];
