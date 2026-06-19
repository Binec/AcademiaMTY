import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/examenes";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (!res.ok) setError(res.error || "Error al iniciar sesión");
    else navigate(from, { replace: true });
  };

  return (
    <section className="py-20 min-h-screen bg-slate-50 flex items-center">
      <div className="container-x max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">AE</div>
            <span className="font-bold">AutoEscuela Pro</span>
          </Link>
          <h1 className="text-3xl font-bold">Iniciar sesión</h1>
          <p className="mt-2 text-muted text-sm">Accede a tus exámenes y certificaciones.</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-xl border border-slate-200 p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Correo electrónico</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>

          <div className="text-center text-sm text-muted pt-2">
            ¿No tienes cuenta?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
