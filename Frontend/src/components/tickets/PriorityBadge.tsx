import Badge from "../common/Badge";
import type { Priority } from "../../types";

const toneByPriority: Record<Priority, string> = {
  High: "bg-rose-50 text-rose-600 border-rose-100",
  Medium: "bg-amber-50 text-amber-600 border-amber-100",
  Low: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const dotByPriority: Record<Priority, string> = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-emerald-500",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge toneClassName={toneByPriority[priority]} dotClassName={dotByPriority[priority]}>
      {priority}
    </Badge>
  );
}
