import { ShieldCheck } from "lucide-react";

export default function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
        <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight text-white">Smart Support</p>
        <p className="text-xs leading-tight text-slate-400">Ticket System</p>
      </div>
    </div>
  );
}
