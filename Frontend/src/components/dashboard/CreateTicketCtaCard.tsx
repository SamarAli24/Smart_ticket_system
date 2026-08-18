import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function CreateTicketCtaCard() {
  return (
    <div className="rounded-xl bg-ink-950 p-5 text-white">
      <p className="text-sm font-semibold">Need to log an issue?</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">
        Create a new ticket and the system will auto-triage its priority for you.
      </p>
      <Link
        to="/tickets/new"
        className="mt-4 flex w-fit items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
      >
        <PlusCircle className="h-4 w-4" />
        Create Ticket
      </Link>
    </div>
  );
}
