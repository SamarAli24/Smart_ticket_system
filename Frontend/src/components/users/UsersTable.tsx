import UserRow from "./UserRow";
import type { AgentUser } from "../../types";

const columns = ["Name", "Email", "Role", "Status"];

interface UsersTableProps {
  users: AgentUser[];
  onDeactivate?: (id: string) => void;
}

export default function UsersTable({ users, onDeactivate }: UsersTableProps) {
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
          {users.map((user) => (
            <UserRow key={user.id} user={user} onDeactivate={onDeactivate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
