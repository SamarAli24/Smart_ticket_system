import { ShieldCheck, ShieldQuestion } from "lucide-react";

const features = [
  "Auto-prioritized ticket triage",
  "Role-based admin & agent views",
  "Real-time assignment & status tracking",
];

export default function LoginBrandPanel() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-emerald-950 px-12 py-10 text-white lg:flex">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
          <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Smart Support</p>
          <p className="text-xs leading-tight text-slate-400">Ticket System</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <h2 className="text-3xl font-bold leading-tight">Deliver faster, smarter IT support.</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          A unified workspace for helpdesk teams to triage, assign, and resolve tickets, with
          role-based access for admins and agents.
        </p>
        <ul className="mt-6 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <ShieldQuestion className="h-3 w-3" strokeWidth={2.5} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-slate-500">
        © 2025 Smart Support Ticket System. All rights reserved.
      </p>
    </div>
  );
}
