import { ClipboardList, Inbox, Loader2, CheckCircle2, Users as UsersIcon } from "lucide-react";
import StatCard from "./StatCard";
import type { AgentUser, Ticket } from "../../types";

interface StatCardsRowProps {
  tickets: Ticket[];
  users: AgentUser[];
}

export default function StatCardsRow({ tickets, users }: StatCardsRowProps) {
  const stats = [
    {
      label: "Total Tickets",
      value: tickets.length,
      icon: ClipboardList,
      toneClassName: "text-slate-500 bg-slate-100",
    },
    {
      label: "Open",
      value: tickets.filter((t) => t.status === "Open").length,
      icon: Inbox,
      toneClassName: "text-sky-500 bg-sky-50",
    },
    {
      label: "In Progress",
      value: tickets.filter((t) => t.status === "In Progress").length,
      icon: Loader2,
      toneClassName: "text-violet-500 bg-violet-50",
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => t.status === "Resolved").length,
      icon: CheckCircle2,
      toneClassName: "text-emerald-500 bg-emerald-50",
    },
    {
      label: "Total Agents",
      value: users.filter((u) => u.role === "Agent").length,
      icon: UsersIcon,
      toneClassName: "text-emerald-500 bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
