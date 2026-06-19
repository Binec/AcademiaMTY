import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const res = await signUp({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);

    if (!res.ok) setError(res.error || "Error al crear la cuenta");
    else navigate("/examenes", { replace: true });
  };

  return (
    <section className="py-20 min-h-screen bg-slate-50 flex items-center">
      <div className="container-x max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">AE</div>
            <span className="font-bold">AutoEscuela Pro</span>
          </Link>
          <h1 className="text-3xl font-bold">Crear cuenta</h1>
          <p className="mt-2 text-muted text-sm">Regístrate para acceder a exámenes y certificaciones.</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-xl border border-slate-200 p-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Nombre completo</label>
            <input
              required
              minLength={3}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="Juan Pérez"
            />
          </div>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Teléfono <span className="font-normal normal-case text-muted">(opcional)</span></label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="55 1234 5678"
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
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Confirmar contraseña</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="Repite tu contraseña"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <div className="text-center text-sm text-muted pt-2">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
