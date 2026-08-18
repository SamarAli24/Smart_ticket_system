import { AlertTriangle } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-100 bg-rose-50 py-16 text-center">
      <AlertTriangle className="h-5 w-5 text-rose-500" />
      <p className="text-sm text-rose-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
