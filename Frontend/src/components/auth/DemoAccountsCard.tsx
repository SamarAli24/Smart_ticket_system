const demoAccounts = [
  { role: "Admin", credentials: "alice.johnson@example.com / Password123!" },
  { role: "Agent", credentials: "bob.smith@example.com / Password123!" },
];

export default function DemoAccountsCard() {
  return (
    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
      <p className="font-medium text-slate-600">Demo accounts</p>
      {demoAccounts.map((account) => (
        <p key={account.role} className="mt-1 first:mt-1">
          {account.role} · <span className="text-emerald-600">{account.credentials}</span>
        </p>
      ))}
    </div>
  );
}
