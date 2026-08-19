export function formatTimestamp(iso: string): { date: string; time: string } {
  const parsed = new Date(iso);
  return {
    date: parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: parsed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}
