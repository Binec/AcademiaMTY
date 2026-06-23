import { useState } from "react";
import { siteConfig } from "../data/site";

type Status = "idle" | "sending" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initial: FormState = { name: "", email: "", phone: "", message: "" };

export default function Contacto() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (form.name.trim().length < 3) e.name = "Ingresa tu nombre completo";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    if (!/^[\d\s\-+()]{8,}$/.test(form.phone)) e.phone = "Teléfono inválido";
    if (form.message.trim().length < 10) e.message = "Mínimo 10 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      await new Promise((r) => setTimeout(r, 1200));
      console.log("[Contacto] Enviando a", siteConfig.email, form);
      setStatus("success");
      setForm(initial);
    } catch {
      setStatus("error");
    }
  };

  const update = (k: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: ev.target.value }));

  return (
    <>
      <section className="hero-bg text-white py-24">
        <div className="container-x max-w-4xl text-center">
          <div className="eyebrow mb-4 text-white/70">Contacto</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Estamos para ayudarte</h1>
          <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
            Escríbenos, llámanos o visítanos.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[
              { label: "Teléfono", text: siteConfig.phone, href: `tel:${siteConfig.phoneRaw}`, iconPath: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
              { label: "Correo", text: siteConfig.email, href: `mailto:${siteConfig.email}`, iconPath: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { label: "Horario", text: siteConfig.hours, iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-xl border border-slate-100 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={c.iconPath} />
                  </svg>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted font-semibold">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="font-medium text-sm hover:text-primary transition-colors">{c.text}</a>
                  ) : (
                    <div className="font-medium text-sm">{c.text}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-100 p-8">
              <div className="eyebrow mb-3">Formulario</div>
              <h2 className="text-2xl font-bold">Envíanos un mensaje</h2>
              <p className="mt-2 text-muted text-sm">Te contactaremos a la brevedad.</p>

              <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Nombre completo</label>
                    <input
                      value={form.name}
                      onChange={update("name")}
                      className={`w-full rounded-lg border ${errors.name ? "border-red-300" : "border-slate-200"} px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20`}
                      placeholder="Juan Pérez"
                    />
                    {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Correo electrónico</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      className={`w-full rounded-lg border ${errors.email ? "border-red-300" : "border-slate-200"} px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20`}
                      placeholder="tucorreo@ejemplo.com"
                    />
                    {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Teléfono</label>
                  <input
                    value={form.phone}
                    onChange={update("phone")}
                    className={`w-full rounded-lg border ${errors.phone ? "border-red-300" : "border-slate-200"} px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20`}
                    placeholder="55 1234 5678"
                  />
                  {errors.phone && <div className="text-xs text-red-600 mt-1">{errors.phone}</div>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Mensaje</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    className={`w-full rounded-lg border ${errors.message ? "border-red-300" : "border-slate-200"} px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none`}
                    placeholder="Cuéntanos sobre el curso que te interesa..."
                  />
                  {errors.message && <div className="text-xs text-red-600 mt-1">{errors.message}</div>}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {status === "sending" ? "Enviando..." : "Enviar mensaje"}
                </button>

                {status === "success" && (
                  <div className="p-4 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">
                    ✓ Tu mensaje ha sido enviado. Te contactaremos pronto.
                  </div>
                )}
                {status === "error" && (
                  <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                    ✗ Ocurrió un error. Intenta de nuevo o escríbenos a {siteConfig.email}.
                  </div>
                )}
              </form>
            </div>


          </div>
        </div>
      </section>
    </>
  );
}
