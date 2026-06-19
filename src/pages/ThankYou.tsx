import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CourseLevel, courses } from "../data/site";
import { useAuth } from "../context/AuthContext";
import { purchaseCourse } from "../services/api";

const PENDING_KEY = "aep_pending_access";

export default function ThankYou() {
  const { courseId = "basico" } = useParams();
  const [params] = useSearchParams();
  const name = params.get("name") || "Estimado alumno";
  const email = params.get("email") || "tu correo";
  const orderId = "AEP-" + Math.floor(100000 + Math.random() * 900000);
  const { user, refresh } = useAuth();
  const [grantStatus, setGrantStatus] = useState<"idle" | "granting" | "done" | "pending">("idle");

  // Lista de cursos comprados: del query param ?items=a,b,c o fallback al courseId de la URL
  const itemsParam = params.get("items");
  const validIds = courses.map((c) => c.id as string);
  const levels: CourseLevel[] = (
    itemsParam
      ? itemsParam.split(",").filter((x) => validIds.includes(x))
      : [courseId]
  ).filter((x) => validIds.includes(x)) as CourseLevel[];

  const purchasedCourses = courses.filter((c) => levels.includes(c.id));
  const subtotal = purchasedCourses.reduce((sum, c) => sum + c.price, 0);
  const bundleDiscount = purchasedCourses.length >= 2 ? Math.round(subtotal * 0.10) : 0;
  const total = Math.round((subtotal - bundleDiscount) * 1.16);

  // Al pago exitoso: otorgar acceso automático a TODOS los cursos del carrito
  useEffect(() => {
    if (!email || levels.length === 0) return;
    if (user) {
      setGrantStatus("granting");
      Promise.all(levels.map((lvl) => purchaseCourse(lvl)))
        .then(() => {
          // Limpiar acceso pendiente por si existía
          try {
            const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "{}");
            if (pending[email]) {
              delete pending[email];
              localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
            }
          } catch {}
          refresh();
          setGrantStatus("done");
        })
        .catch(() => setGrantStatus("idle"));
    } else {
      // Usuario no autenticado: guardamos accesos pendientes asociados al correo
      try {
        const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "{}");
        pending[email] = Array.from(new Set([...(pending[email] || []), ...levels]));
        localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
      } catch {}
      setGrantStatus("pending");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user, email]);

  return (
    <section className="py-24">
      <div className="container-x max-w-3xl text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
          ✓
        </div>
        <h1 className="mt-6 text-3xl md:text-4xl font-bold">Gracias por tu compra, {name}</h1>
        <p className="mt-4 text-muted max-w-xl mx-auto">
          Tu pago se ha procesado. Hemos enviado la confirmación a <strong>{email}</strong>.
        </p>

        <div className="mt-10 bg-white rounded-xl border border-slate-200 p-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted font-semibold">Pedido</div>
              <div className="text-lg font-bold mt-1">{orderId}</div>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Pago aprobado
            </div>
          </div>

          {/* Cursos comprados */}
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-muted font-semibold mb-3">
              {purchasedCourses.length === 1 ? "Curso adquirido" : `Cursos adquiridos (${purchasedCourses.length})`}
            </div>
            <div className="space-y-2">
              {purchasedCourses.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 p-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{c.title}</div>
                    <div className="text-xs text-muted mt-0.5">{c.hours}</div>
                  </div>
                  <div className="font-semibold text-sm shrink-0">${c.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-2 text-sm">
            {bundleDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Descuento paquete (-10%)</span>
                <span className="font-semibold">-${bundleDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <span className="font-semibold">Total pagado (IVA incluido)</span>
              <span className="text-xl font-bold text-primary">${total.toLocaleString()} MXN</span>
            </div>
          </div>

          {grantStatus === "granting" && (
            <div className="mt-5 text-xs text-muted flex items-center justify-center gap-2">
              <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Activando acceso a {levels.length === 1 ? "tu examen" : "tus exámenes"}…
            </div>
          )}
          {grantStatus === "done" && (
            <div className="mt-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
              ✓ {levels.length === 1 ? "Acceso al examen habilitado" : `Acceso habilitado a ${levels.length} exámenes`} en tu cuenta
            </div>
          )}
          {grantStatus === "pending" && (
            <div className="mt-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              ⏳ Inicia sesión con <strong>{email}</strong> para activar tu acceso a {levels.length === 1 ? "tu examen" : "tus exámenes"}
            </div>
          )}
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
          {[
            { icon: "📧", title: "Correo de confirmación", desc: "Recibirás tu recibo en los próximos 15 minutos." },
            { icon: "📝", title: "Acceso a exámenes", desc: "Puedes tomar tus exámenes teóricos en línea." },
            { icon: "🎓", title: "Certificado digital", desc: "Lo recibirás por correo al aprobar." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="text-2xl">{item.icon}</div>
              <h3 className="mt-3 font-semibold text-sm">{item.title}</h3>
              <p className="mt-1.5 text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/examenes" className="btn-primary">Ir a exámenes</Link>
          <Link to="/contacto" className="btn-ghost">Contactar asesor</Link>
          <Link to="/" className="btn-ghost">Volver al inicio</Link>
        </div>
      </div>
    </section>
  );
}
