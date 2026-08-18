import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import Button from "../common/Button";

export default function TicketListHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">All Tickets</h2>
        <p className="text-sm text-slate-500">Showing {count} tickets in the queue</p>
      </div>
      <Link to="/tickets/new">
        <Button variant="primary">
          <PlusCircle className="h-4 w-4" />
          New Ticket
        </Button>
      </Link>
    </div>
  );
}
