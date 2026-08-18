import Badge from "../common/Badge";

export default function UserStatusBadge({ status }: { status: "Active" | "Inactive" }) {
  const isActive = status === "Active";
  return (
    <Badge
      toneClassName={
        isActive
          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
          : "bg-slate-100 text-slate-500 border-slate-200"
      }
      dotClassName={isActive ? "bg-emerald-500" : "bg-slate-400"}
    >
      {status}
    </Badge>
  );
}
