import { Link } from "react-router-dom";
import { courses } from "../data/site";

const services = [
  { icon: "01", title: "Clases prácticas", desc: "Entrenamiento en vehículo doble comando con instructor certificado." },
  { icon: "02", title: "Teoría y reglamento", desc: "Curso completo de señalización, reglamento y mecánica básica." },
  { icon: "03", title: "Exámenes simulados", desc: "Evaluaciones en línea con retroalimentación inmediata." },
  { icon: "04", title: "Certificación oficial", desc: "Diploma válido para trámite de licencia." },
  { icon: "05", title: "Trámite de licencia", desc: "Te apoyamos con la cita y documentación ante la autoridad." },
  { icon: "06", title: "Cursos para menores", desc: "Programa especializado para adolescentes de 16 a 17 años." },
  { icon: "07", title: "Conducción en autopista", desc: "Entrenamiento avanzado para carreteras y rebase." },
  { icon: "08", title: "Conducción defensiva", desc: "Técnicas avanzadas y certificación internacional." },
  { icon: "09", title: "Clases a domicilio", desc: "Te recogemos en tu casa u oficina." },
];

const schedules = [
  { day: "Lunes a Viernes", hours: "7:00 am - 8:00 pm" },
  { day: "Sábados", hours: "8:00 am - 6:00 pm" },
  { day: "Domingos", hours: "8:00 am - 2:00 pm" },
];

export default function Servicios() {
  return (
    <>
      <section className="hero-bg text-white py-24">
        <div className="container-x max-w-4xl text-center">
          <div className="eyebrow mb-4 text-white/70">Servicios</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Todo para conducir seguro</h1>
          <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
            Desde clases prácticas hasta certificación oficial.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <div className="max-w-2xl mb-14">
            <div className="eyebrow mb-3">Nuestros servicios</div>
            <h2 className="section-title">Soluciones integrales de conducción</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => (
              <div key={s.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {s.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container-x">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="eyebrow mb-3">Planes</div>
            <h2 className="section-title">Nuestros cursos certificados</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-100 course-card-hover p-7 flex flex-col min-h-[540px]">
                <div className="text-xs font-semibold text-secondary uppercase tracking-wider">{c.id}</div>
                <h3 className="mt-2 text-xl font-bold">{c.title}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${c.price.toLocaleString()}</span>
                  {c.oldPrice && <span className="text-muted text-sm line-through">${c.oldPrice.toLocaleString()}</span>}
                </div>
                <div className="text-xs text-muted mt-1">{c.hours}</div>
                <ul className="mt-6 space-y-2.5 text-sm flex-1">
                  {c.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="text-secondary mt-0.5">✓</span>
                      <span className="text-ink-soft">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link to="/cursos" className="btn-primary w-full">Más información</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="eyebrow mb-3">Horarios</div>
            <h2 className="section-title">Flexibilidad para tu rutina</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {schedules.map((s) => (
              <div key={s.day} className="bg-white rounded-xl border border-slate-100 p-8 text-center">
                <h3 className="font-semibold">{s.day}</h3>
                <div className="mt-2 text-primary font-semibold">{s.hours}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/contacto" className="btn-primary">Reservar mi horario →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
