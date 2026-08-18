import Badge from "../common/Badge";
import type { Status } from "../../types";

const toneByStatus: Record<Status, string> = {
  Open: "bg-sky-50 text-sky-600 border-sky-100",
  "In Progress": "bg-violet-50 text-violet-600 border-violet-100",
  Resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Closed: "bg-slate-100 text-slate-500 border-slate-200",
};

const dotByStatus: Record<Status, string> = {
  Open: "bg-sky-500",
  "In Progress": "bg-violet-500",
  Resolved: "bg-emerald-500",
  Closed: "bg-slate-400",
};

export default function TicketStatusBadge({ status }: { status: Status }) {
  return (
    <Badge toneClassName={toneByStatus[status]} dotClassName={dotByStatus[status]}>
      {status}
    </Badge>
  );
}
