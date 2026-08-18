import { UserPlus } from "lucide-react";
import Button from "../common/Button";

export default function UserListHeader({ onAddUser }: { onAddUser: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">User Management</h2>
        <p className="text-sm text-slate-500">Manage support team members, roles, and access.</p>
      </div>
      <Button variant="primary" onClick={onAddUser}>
        <UserPlus className="h-4 w-4" />
        Add User
      </Button>
    </div>
  );
}
