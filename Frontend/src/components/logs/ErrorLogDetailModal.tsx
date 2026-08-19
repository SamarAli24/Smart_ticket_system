import Modal from "../common/Modal";
import { formatTimestamp } from "../../utils/formatTimestamp";
import type { ErrorLogDto } from "../../services/apiTypes";

export default function ErrorLogDetailModal({
  log,
  onClose,
}: {
  log: ErrorLogDto | null;
  onClose: () => void;
}) {
  if (!log) return null;
  const { date, time } = formatTimestamp(log.timestamp);

  return (
    <Modal open={log !== null} onClose={onClose} title={`${log.method} ${log.path}`} description={`${date} at ${time}`}>
      <div className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Status:</span> {log.statusCode}
          </p>
          {log.errorCode !== null && (
            <p>
              <span className="font-medium text-slate-800">Error code:</span> {log.errorCode}
            </p>
          )}
          <p>
            <span className="font-medium text-slate-800">User Id:</span> {log.userId ?? "-"}
          </p>
          <p>
            <span className="font-medium text-slate-800">IP:</span> {log.ipAddress ?? "-"}
          </p>
        </div>

        <div>
          <p className="font-medium text-slate-800">Message</p>
          <p className="mt-1 text-slate-600">{log.message}</p>
        </div>

        {log.exceptionType && (
          <div>
            <p className="font-medium text-slate-800">Exception type</p>
            <p className="mt-1 text-slate-600">{log.exceptionType}</p>
          </div>
        )}

        {log.stackTrace && (
          <div>
            <p className="font-medium text-slate-800">Stack trace</p>
            <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
              {log.stackTrace}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}
