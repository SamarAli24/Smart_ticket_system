import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginBrandPanel from "../components/auth/LoginBrandPanel";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) navigate("/dashboard", { replace: true });
  }, [currentUser, navigate]);

  const handleLogin = async (credentials: { email: string; password: string; remember: boolean }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await login(credentials.email, credentials.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <LoginBrandPanel />

      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <LoginForm onSubmit={handleLogin} error={error} isSubmitting={isSubmitting} />
        <p className="mt-6 text-xs text-slate-400">
          © 2025 Smart Support Ticket System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
