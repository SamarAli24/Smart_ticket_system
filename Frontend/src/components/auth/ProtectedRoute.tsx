import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isInitializing } = useAuth();

  if (isInitializing) return null;
  if (!currentUser) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
