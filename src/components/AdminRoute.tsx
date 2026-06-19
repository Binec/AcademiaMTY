import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-muted text-sm">Verificando permisos…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return (
      <section className="py-24 min-h-screen bg-slate-50 flex items-center">
        <div className="container-x max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto">
            ⛔
          </div>
          <h1 className="mt-6 text-2xl font-bold">Acceso restringido</h1>
          <p className="mt-3 text-muted text-sm">
            Esta sección requiere privilegios de administrador.
          </p>
          <a href="/dashboard" className="btn-primary mt-6 inline-flex">
            Ir a mi panel
          </a>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
