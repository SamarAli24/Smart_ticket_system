import Badge from "../common/Badge";
import type { Role } from "../../types";

const toneByRole: Record<Role, string> = {
  Admin: "bg-ink-900 text-white border-ink-900",
  Agent: "bg-emerald-500 text-white border-emerald-500",
};

const dotByRole: Record<Role, string> = {
  Admin: "bg-white/70",
  Agent: "bg-white/80",
};

export default function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge toneClassName={toneByRole[role]} dotClassName={dotByRole[role]}>
      {role}
    </Badge>
  );
}
