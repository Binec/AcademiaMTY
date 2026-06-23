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
    <section className="py-20 min-h-screen hero-bg flex items-center">
      <div className="container-x max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="flex flex-col items-center group">
            <div className="h-32 w-32 mb-4 transition-transform group-hover:scale-105 duration-300">
              <img
                src="https://github.com/Binec/AcademiaMTY/blob/main/AM_SINFONDOMesa%20de%20trabajo%202%20copia%202@2x.png?raw=true"
                alt="AM Monterrey Academia"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-bold text-white text-2xl tracking-tight">AM Monterrey Academia</span>
          </Link>
          <div className="mt-8 space-y-2">
            <h1 className="text-3xl font-bold text-white">Iniciar sesión</h1>
            <p className="text-white/70 text-sm">Accede a tus exámenes y certificaciones.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-white/[0.07] backdrop-blur-md rounded-2xl border border-white/15 p-8 space-y-5 shadow-2xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Correo electrónico</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-white/15 bg-white/10 text-white placeholder:text-white/40 px-4 py-2.5 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-white/15 bg-white/10 text-white placeholder:text-white/40 px-4 py-2.5 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/15 border border-red-400/30 text-red-200 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>

          <div className="text-center text-sm text-white/60 pt-2">
            ¿No tienes cuenta?{" "}
            <Link to="/signup" className="text-secondary font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
