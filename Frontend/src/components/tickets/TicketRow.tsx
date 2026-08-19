import PriorityBadge from "./PriorityBadge";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketAssigneeCell from "./TicketAssigneeCell";
import TicketRowActions from "./TicketRowActions";
import type { Status, Ticket } from "../../types";

interface TicketRowProps {
  ticket: Ticket;
  onEdit?: (ticket: Ticket) => void;
  onChangeStatus?: (id: string, currentStatus: Status) => void;
  onDelete?: (id: string) => void;
}

export default function TicketRow({ ticket, onEdit, onChangeStatus, onDelete }: TicketRowProps) {
  return (
    <tr className="align-top hover:bg-slate-50/60">
      <td className="max-w-[180px] px-5 py-4">
        <p className="truncate font-medium text-slate-800">{ticket.title}</p>
        <p className="text-xs text-slate-400">{ticket.code}</p>
      </td>
      <td className="max-w-[220px] px-5 py-4 text-slate-500">
        <p className="truncate">{ticket.description}</p>
      </td>
      <td className="px-5 py-4">
        <PriorityBadge priority={ticket.priority} />
      </td>
      <td className="px-5 py-4">
        <TicketStatusBadge status={ticket.status} />
      </td>
      <td className="px-5 py-4">
        <TicketAssigneeCell assignedTo={ticket.assignedTo} />
      </td>
      <td className="px-5 py-4 text-slate-500">
        <p>{ticket.createdAt}</p>
        <p className="text-xs text-slate-400">{ticket.createdTime}</p>
      </td>
      <td className="px-5 py-4">
        <TicketRowActions
          onEdit={() => onEdit?.(ticket)}
          onChangeStatus={() => onChangeStatus?.(ticket.id, ticket.status)}
          onDelete={() => onDelete?.(ticket.id)}
        />
      </td>
    </tr>
  );
}
