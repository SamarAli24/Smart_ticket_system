import QueueHealthBar from "./QueueHealthBar";
import type { Ticket } from "../../types";

const segments = [
  { label: "Open", status: "Open" as const, colorClassName: "bg-sky-400" },
  { label: "In Progress", status: "In Progress" as const, colorClassName: "bg-violet-400" },
  { label: "Resolved", status: "Resolved" as const, colorClassName: "bg-emerald-400" },
];

export default function QueueHealthCard({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-slate-900">Queue Health</p>
      <div className="mt-4 space-y-4">
        {segments.map((segment) => {
          const count = tickets.filter((t) => t.status === segment.status).length;
          const percent = tickets.length ? Math.round((count / tickets.length) * 100) : 0;
          return (
            <QueueHealthBar
              key={segment.label}
              label={segment.label}
              count={count}
              percent={percent}
              colorClassName={segment.colorClassName}
            />
          );
        })}
      </div>
    </div>
  );
}
