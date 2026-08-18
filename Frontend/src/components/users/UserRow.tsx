import UserAvatar from "../common/UserAvatar";
import RoleBadge from "./RoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import UserRowActions from "./UserRowActions";
import { useAuth } from "../../context/AuthContext";
import type { AgentUser } from "../../types";

interface UserRowProps {
  user: AgentUser;
  onDeactivate?: (id: string) => void;
}

export default function UserRow({ user, onDeactivate }: UserRowProps) {
  const { currentUser } = useAuth();
  const isCurrentUser = user.id === currentUser?.id;

  return (
    <tr className="hover:bg-slate-50/60">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} size="md" />
          <div>
            <p className="font-medium text-slate-800">
              {user.name} {isCurrentUser && <span className="text-slate-400">(you)</span>}
            </p>
            <p className="text-xs text-slate-400">{user.id}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-slate-500">{user.email}</td>
      <td className="px-5 py-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-5 py-4">
        <UserStatusBadge status={user.status} />
      </td>
      <td className="px-5 py-4">
        <UserRowActions onDeactivate={() => onDeactivate?.(user.id)} />
      </td>
    </tr>
  );
}
