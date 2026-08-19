import { Pencil, RefreshCcw, Trash2 } from "lucide-react";

interface TicketRowActionsProps {
  onEdit?: () => void;
  onChangeStatus?: () => void;
  onDelete?: () => void;
}

export default function TicketRowActions({
  onEdit,
  onChangeStatus,
  onDelete,
}: TicketRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 text-slate-400">
      <button
        onClick={onEdit}
        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </button>
      <button
        onClick={onChangeStatus}
        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600"
      >
        <RefreshCcw className="h-3.5 w-3.5" />
        Status
      </button>
      <button onClick={onDelete} className="text-slate-400 hover:text-rose-500" aria-label="Delete ticket">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
