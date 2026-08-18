import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  toneClassName: string;
  dotClassName?: string;
}

export default function Badge({ children, toneClassName, dotClassName }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${toneClassName}`}
    >
      {dotClassName && <span className={`h-1.5 w-1.5 rounded-full ${dotClassName}`} />}
      {children}
    </span>
  );
}
