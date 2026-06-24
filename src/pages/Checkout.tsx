import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { courses, CourseLevel } from "../data/site";
import { useAuth } from "../context/AuthContext";

type PaymentMethod = "card" | "paypal" | "mercado" | "stripe";

export default function Checkout() {
  const { courseId = "basico" } = useParams();
  const navigate = useNavigate();
  const { user, hasAccess } = useAuth();

  const initialLevel = (courses.find((c) => c.id === courseId)?.id ?? "basico") as CourseLevel;
  const [cart, setCart] = useState<CourseLevel[]>([initialLevel]);

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "", card: "", exp: "", cvc: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cartCourses = useMemo(() => courses.filter((c) => cart.includes(c.id)), [cart]);
  const availableCourses = useMemo(
    () => courses.filter((c) => !cart.includes(c.id) && !(user && hasAccess(c.id))),
    [cart, user, hasAccess]
  );

  const subtotal = cartCourses.reduce((sum, c) => sum + c.price, 0);
  // Descuento por paquete: 10% al llevar 2+ cursos
  const bundleDiscount = cart.length >= 2 ? Math.round(subtotal * 0.10) : 0;
  const taxBase = subtotal - bundleDiscount;
  const iva = Math.round(taxBase * 0.16);
  const total = taxBase + iva;

  const addToCart = (level: CourseLevel) => {
    setCart((prev) => (prev.includes(level) ? prev : [...prev, level]));
  };

  const removeFromCart = (level: CourseLevel) => {
    setCart((prev) => {
      if (prev.length <= 1) return prev; // mínimo 1 curso en el carrito
      return prev.filter((l) => l !== level);
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Nombre inválido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    if (method === "card") {
      if (form.card.replace(/\s/g, "").length < 13) e.card = "Número inválido";
      if (!/^\d{2}\/\d{2}$/.test(form.exp)) e.exp = "MM/AA";
      if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = "CVC inválido";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    const items = cart.join(",");
    navigate(
      `/gracias/${cart[0]}?items=${encodeURIComponent(items)}&name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}`
    );
  };

  return (
    <>
      <section className="py-8">
        <div className="container-x">
          <Link to="/cursos" className="text-sm text-primary font-medium hover:underline">← Volver a cursos</Link>
        </div>
      </section>

      <section className="pb-24 bg-slate-50">
        <div className="container-x grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Carrito */}
            <div className="bg-white rounded-xl border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-2xl font-bold">Tu carrito</h1>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {cart.length} {cart.length === 1 ? "curso" : "cursos"}
                </span>
              </div>
              <p className="text-muted text-sm">Agrega o quita cursos antes de pagar.</p>

              {/* Items en el carrito */}
              <div className="mt-6 space-y-3">
                {cartCourses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-secondary uppercase tracking-wider">{c.id.replace("_", " ")}</div>
                      <div className="font-semibold truncate">{c.title}</div>
                      <div className="text-xs text-muted mt-0.5">{c.hours}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold">${c.price.toLocaleString()}</div>
                      {c.oldPrice && <div className="text-xs text-muted line-through">${c.oldPrice.toLocaleString()}</div>}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(c.id)}
                      disabled={cart.length <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                      title={cart.length <= 1 ? "El carrito debe tener al menos un curso" : "Quitar del carrito"}
                      aria-label={`Quitar ${c.title}`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Agregar más cursos */}
              {availableCourses.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold text-sm">Agrega otro curso y ahorra</h3>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                      -10% llevando 2 o más
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {availableCourses.map((c) => (
                      <div key={c.id} className="rounded-lg border border-dashed border-slate-300 p-4 flex flex-col">
                        <div className="text-xs font-semibold text-secondary uppercase tracking-wider">{c.id.replace("_", " ")}</div>
                        <div className="font-semibold text-sm mt-0.5">{c.title}</div>
                        <div className="flex items-baseline gap-2 mt-1 mb-3">
                          <span className="font-bold">${c.price.toLocaleString()}</span>
                          {c.oldPrice && <span className="text-xs text-muted line-through">${c.oldPrice.toLocaleString()}</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(c.id)}
                          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary text-primary px-4 py-2 text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Agregar al carrito
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de pago */}
            <form onSubmit={onSubmit} className="bg-white rounded-xl border border-slate-100 p-8">
              <h2 className="text-xl font-bold">Datos y pago</h2>
              <p className="text-muted text-sm mt-1">Completa tus datos para procesar el pago.</p>

              <div className="mt-8">
                <h3 className="font-semibold mb-4">Datos del alumno</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Nombre completo</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      placeholder="Juan Pérez"
                    />
                    {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Correo</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      placeholder="tu@correo.com"
                    />
                    {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Teléfono</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      placeholder="55 1234 5678"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4">Método de pago</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {([
                    { id: "card", label: "Tarjeta" },
                    { id: "stripe", label: "Stripe" },
                    { id: "paypal", label: "PayPal" },
                    { id: "mercado", label: "Mercado Pago" },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`rounded-lg border-2 p-4 text-center text-sm font-medium transition ${
                        method === m.id ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-ink-soft hover:border-slate-300"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {method === "card" && (
                  <div className="mt-5 rounded-xl bg-slate-50 p-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Número de tarjeta</label>
                      <input
                        value={form.card}
                        onChange={(e) => setForm({ ...form, card: e.target.value.replace(/\D/g, "").slice(0, 19) })}
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      />
                      {errors.card && <div className="text-xs text-red-600 mt-1">{errors.card}</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Expiración</label>
                        <input
                          value={form.exp}
                          onChange={(e) => setForm({ ...form, exp: e.target.value })}
                          placeholder="MM/AA"
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                        {errors.exp && <div className="text-xs text-red-600 mt-1">{errors.exp}</div>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">CVC</label>
                        <input
                          value={form.cvc}
                          onChange={(e) => setForm({ ...form, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          placeholder="123"
                          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                        {errors.cvc && <div className="text-xs text-red-600 mt-1">{errors.cvc}</div>}
                      </div>
                    </div>
                    <div className="text-xs text-muted">Conexión segura SSL · No almacenamos tarjetas</div>
                  </div>
                )}

                {method !== "card" && (
                  <div className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-muted">
                    Al confirmar serás redirigido al portal seguro de {method === "stripe" ? "Stripe" : method === "paypal" ? "PayPal" : "Mercado Pago"} para completar el pago.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="btn-primary w-full mt-8 disabled:opacity-60"
              >
                {processing ? "Procesando..." : `Pagar $${total.toLocaleString()} MXN`}
              </button>
              <div className="text-xs text-muted mt-3 text-center">
                Al pagar aceptas los términos y condiciones.
              </div>
            </form>
          </div>

          {/* Resumen */}
          <aside className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-100 p-7 sticky top-24">
              <h3 className="font-semibold mb-5">Resumen del pedido</h3>

              <div className="space-y-3">
                {cartCourses.map((c) => (
                  <div key={c.id} className="rounded-lg bg-slate-50 border border-slate-100 p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-secondary uppercase truncate">{c.id.replace("_", " ")}</div>
                      <div className="font-semibold text-sm truncate">{c.title}</div>
                    </div>
                    <div className="font-semibold text-sm shrink-0">${c.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal ({cart.length} {cart.length === 1 ? "curso" : "cursos"})</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Descuento paquete (-10%)</span>
                    <span className="font-semibold">-${bundleDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">IVA (16%)</span>
                  <span className="font-medium">${iva.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Certificados</span>
                  <span className="font-medium text-secondary">Incluidos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Exámenes en línea</span>
                  <span className="font-medium text-secondary">Incluidos</span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">${total.toLocaleString()} <span className="text-sm text-muted font-normal">MXN</span></span>
              </div>

              {bundleDiscount === 0 && availableCourses.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  💡 Agrega otro curso y obtén <strong>10% de descuento</strong> en todo tu pedido.
                </div>
              )}

              <div className="mt-5 text-xs text-muted text-center">Pago 100% seguro</div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
