import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import RecentTicketListItem from "./RecentTicketListItem";
import type { Ticket } from "../../types";

export default function RecentTicketsCard({ tickets }: { tickets: Ticket[] }) {
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="col-span-2 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Recent Tickets</p>
          <p className="text-xs text-slate-500">Latest activity across the queue</p>
        </div>
        <Link
          to="/tickets"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ul className="divide-y divide-slate-100">
        {recentTickets.map((ticket) => (
          <RecentTicketListItem key={ticket.id} ticket={ticket} />
        ))}
      </ul>
    </div>
  );
}
