import UserAvatar from "../common/UserAvatar";
import type { AgentUser } from "../../types";

export default function TicketAssigneeCell({ assignedTo }: { assignedTo: AgentUser | null }) {
  if (!assignedTo) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
        Unassigned
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <UserAvatar name={assignedTo.name} />
      <span className="text-slate-700">{assignedTo.name}</span>
    </div>
  );
}
