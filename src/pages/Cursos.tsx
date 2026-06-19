import { Link } from "react-router-dom";
import { courses } from "../data/site";

export default function Cursos() {
  return (
    <>
      <section className="hero-bg text-white py-24">
        <div className="container-x max-w-4xl text-center">
          <div className="eyebrow mb-4 text-white/70">Tienda en línea</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Compra tu curso</h1>
          <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
            Pago seguro con tarjeta, transferencia o PayPal. Certificado incluido.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((c, idx) => (
              <div
                key={c.id}
                className={`rounded-xl border overflow-hidden flex flex-col ${
                  idx === 1
                    ? "border-primary shadow-md"
                    : "border-slate-200 course-card-hover"
                }`}
              >
                {idx === 1 && (
                  <div className="bg-primary text-white text-xs font-semibold px-4 py-2 text-center">
                    MÁS VENDIDO
                  </div>
                )}
                <div className="p-7 flex-1 flex flex-col min-h-[560px]">
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wider">{c.id}</div>
                  <h2 className="mt-2 text-xl font-bold">{c.title}</h2>
                  <p className="mt-2 text-sm text-muted">{c.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${c.price.toLocaleString()}</span>
                    {c.oldPrice && <span className="text-muted text-sm line-through">${c.oldPrice.toLocaleString()}</span>}
                    <span className="text-muted text-sm">MXN</span>
                  </div>
                  <div className="text-xs text-muted mt-1">{c.hours}</div>
                  {c.highlight && (
                    <div className="mt-4 text-xs bg-primary/5 text-primary font-medium px-3 py-2 rounded-lg">
                      {c.highlight}
                    </div>
                  )}
                  <ul className="mt-5 space-y-2.5 text-sm flex-1">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="text-secondary mt-0.5">✓</span>
                        <span className="text-ink-soft">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Link to={`/checkout/${c.id}`} className="btn-primary w-full">
                      Comprar ahora
                    </Link>
                    <div className="mt-3 text-xs text-center text-muted">Pago seguro · SSL</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment methods */}
          <div className="mt-16 bg-white rounded-xl border border-slate-100 p-8">
            <div className="max-w-2xl">
              <div className="eyebrow mb-3">Pago seguro</div>
              <h3 className="text-xl font-bold">Métodos de pago aceptados</h3>
              <p className="mt-2 text-sm text-muted">Todas las transacciones se procesan con cifrado SSL. No almacenamos tarjetas.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Visa", "Mastercard", "PayPal", "Mercado Pago", "Stripe", "Transferencia", "OXXO", "SPEI"].map((p) => (
                <div key={p} className="px-5 py-3 rounded-lg bg-slate-50 border border-slate-100 text-sm font-medium text-ink-soft">
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-10 bg-slate-50 rounded-xl p-10 text-center">
            <div className="text-amber-500 text-sm mb-4">★★★★★</div>
            <p className="text-ink-soft max-w-2xl mx-auto">
              "El proceso fue sencillo. Pagué con tarjeta y al día siguiente ya tenía mi horario confirmado."
            </p>
            <div className="mt-4 text-sm font-semibold text-muted">— Mariana G., Curso Intermedio</div>
          </div>
        </div>
      </section>
    </>
  );
}
