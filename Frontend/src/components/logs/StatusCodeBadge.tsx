import Badge from "../common/Badge";

export default function StatusCodeBadge({ statusCode }: { statusCode: number }) {
  const toneClassName =
    statusCode >= 500
      ? "bg-rose-50 text-rose-600 border-rose-100"
      : statusCode >= 400
      ? "bg-amber-50 text-amber-600 border-amber-100"
      : "bg-emerald-50 text-emerald-600 border-emerald-100";

  return <Badge toneClassName={toneClassName}>{statusCode}</Badge>;
}
