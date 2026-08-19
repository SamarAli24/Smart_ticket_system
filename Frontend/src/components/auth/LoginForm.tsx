import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string; remember: boolean }) => void;
  error?: string | null;
  isSubmitting?: boolean;
}

export default function LoginForm({ onSubmit, error, isSubmitting }: LoginFormProps) {
  const [email, setEmail] = useState("alice.johnson@example.com");
  const [password, setPassword] = useState("Password123!");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, remember });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-500">Sign in to your support account</p>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-6">
        <Input
          label="Email"
          type="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@smart.support"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mt-4">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          icon={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
          />
          Remember me
        </label>
        <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700">
          Forgot password?
        </a>
      </div>

      <Button type="submit" variant="primary" className="mt-5 w-full py-2.5" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
