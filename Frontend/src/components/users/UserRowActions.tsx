import { Pencil, Power } from "lucide-react";

interface UserRowActionsProps {
  onEdit?: () => void;
  onDeactivate?: () => void;
}

export default function UserRowActions({ onEdit, onDeactivate }: UserRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-4 text-xs font-medium">
      <button
        onClick={onEdit}
        className="flex items-center gap-1 text-slate-500 hover:text-emerald-600"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </button>
      <button
        onClick={onDeactivate}
        className="flex items-center gap-1 text-slate-400 hover:text-rose-500"
      >
        <Power className="h-3.5 w-3.5" />
        Deactivate
      </button>
    </div>
  );
}
