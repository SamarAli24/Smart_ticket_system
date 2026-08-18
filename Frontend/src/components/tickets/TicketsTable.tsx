import TicketRow from "./TicketRow";
import type { Status, Ticket } from "../../types";

const columns = ["Title", "Description", "Priority", "Status", "Assigned To", "Created"];

interface TicketsTableProps {
  tickets: Ticket[];
  onChangeStatus?: (id: string, currentStatus: Status) => void;
  onDelete?: (id: string) => void;
}

export default function TicketsTable({ tickets, onChangeStatus, onDelete }: TicketsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 font-semibold">
                {col}
              </th>
            ))}
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onChangeStatus={onChangeStatus}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
