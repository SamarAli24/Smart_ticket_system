import { Activity } from "lucide-react";
import PriorityBadge from "../tickets/PriorityBadge";
import TicketStatusBadge from "../tickets/TicketStatusBadge";
import UserAvatarTooltip from "../common/UserAvatarTooltip";
import type { Ticket } from "../../types";

export default function RecentTicketListItem({ ticket }: { ticket: Ticket }) {
  return (
    <li className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
          <Activity className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">{ticket.title}</p>
          <p className="text-xs text-slate-400">
            {ticket.code} · {ticket.createdAt}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <UserAvatarTooltip user={ticket.assignedTo} />
        <PriorityBadge priority={ticket.priority} />
        <TicketStatusBadge status={ticket.status} />
      </div>
    </li>
  );
}
