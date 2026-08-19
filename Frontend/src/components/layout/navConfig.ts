import {
  Activity,
  AlertTriangle,
  Globe,
  LayoutGrid,
  ListChecks,
  PlusCircle,
  ScrollText,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  children: NavItem[];
}

export const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/tickets", label: "Tickets", icon: ListChecks, matchExact: true },
  { to: "/tickets/new", label: "Create Ticket", icon: PlusCircle },
  { to: "/users", label: "Users", icon: Users },
];

export const logsNavGroup: NavGroup = {
  label: "Logs",
  icon: ScrollText,
  children: [
    { to: "/logs/activity", label: "Activity", icon: Activity, matchExact: true },
    { to: "/logs/requests", label: "Requests", icon: Globe, matchExact: true },
    { to: "/logs/errors", label: "Errors", icon: AlertTriangle, matchExact: true },
  ],
};
