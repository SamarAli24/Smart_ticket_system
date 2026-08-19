import TicketRow from "./TicketRow";
import type { Status, Ticket } from "../../types";

const columns = ["Title", "Description", "Priority", "Status", "Assigned To", "Created"];

interface TicketsTableProps {
  tickets: Ticket[];
  onEdit?: (ticket: Ticket) => void;
  onChangeStatus?: (id: string, currentStatus: Status) => void;
  onDelete?: (id: string) => void;
}

export default function TicketsTable({ tickets, onEdit, onChangeStatus, onDelete }: TicketsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-900">
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 font-bold">
                {col}
              </th>
            ))}
            <th className="px-5 py-3 text-right font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onEdit={onEdit}
              onChangeStatus={onChangeStatus}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
