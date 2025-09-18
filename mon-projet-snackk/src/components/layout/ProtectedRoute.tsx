import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Pendant le chargement, on ne redirige pas encore
  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
