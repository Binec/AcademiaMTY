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

  const inputClass =
    "w-full rounded-lg border border-white/15 bg-white/10 text-white placeholder:text-white/40 px-4 py-2.5 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2";

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
            <h1 className="text-3xl font-bold text-white">Crear cuenta</h1>
            <p className="text-white/70 text-sm">Regístrate para acceder a exámenes y certificaciones.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-white/[0.07] backdrop-blur-md rounded-2xl border border-white/15 p-8 space-y-4 shadow-2xl">
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input
              required
              minLength={3}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <label className={labelClass}>Correo electrónico</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className={labelClass}>Teléfono <span className="font-normal normal-case text-white/40">(opcional)</span></label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
              placeholder="55 1234 5678"
            />
          </div>
          <div>
            <label className={labelClass}>Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className={labelClass}>Confirmar contraseña</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={inputClass}
              placeholder="Repite tu contraseña"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/15 border border-red-400/30 text-red-200 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <div className="text-center text-sm text-white/60 pt-2">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-secondary font-semibold hover:underline">
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
