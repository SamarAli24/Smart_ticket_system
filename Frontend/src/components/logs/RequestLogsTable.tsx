import StatusCodeBadge from "./StatusCodeBadge";
import { formatTimestamp } from "../../utils/formatTimestamp";
import type { RequestLogDto } from "../../services/apiTypes";

const columns = ["Method", "Path", "Status", "Response Time", "User Id", "IP Address", "Timestamp"];

export default function RequestLogsTable({ logs }: { logs: RequestLogDto[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-900">
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 font-bold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log) => {
            const { date, time } = formatTimestamp(log.timestamp);
            return (
              <tr key={log.id} className="align-top hover:bg-slate-50/60">
                <td className="px-5 py-4 font-medium text-slate-800">{log.method}</td>
                <td className="max-w-[260px] px-5 py-4 text-slate-600">
                  <p className="truncate">
                    {log.path}
                    {log.queryString}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <StatusCodeBadge statusCode={log.statusCode} />
                </td>
                <td className="px-5 py-4 text-slate-600">{log.responseTimeMs} ms</td>
                <td className="px-5 py-4 text-slate-600">{log.userId ?? "-"}</td>
                <td className="px-5 py-4 text-slate-600">{log.ipAddress ?? "-"}</td>
                <td className="px-5 py-4 text-slate-500">
                  <p>{date}</p>
                  <p className="text-xs text-slate-400">{time}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
