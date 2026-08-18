interface QueueHealthBarProps {
  label: string;
  count: number;
  percent: number;
  colorClassName: string;
}

export default function QueueHealthBar({ label, count, percent, colorClassName }: QueueHealthBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>
          {count} · {percent}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${colorClassName}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
