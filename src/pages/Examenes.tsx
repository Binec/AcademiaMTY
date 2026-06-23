import { Link } from "react-router-dom";
import { exams } from "../data/examQuestions";
import { useAuth } from "../context/AuthContext";

export default function Examenes() {
  const { user, hasAccess } = useAuth();

  return (
    <>
      <section className="hero-bg text-white py-24">
        <div className="container-x max-w-4xl text-center">
          <div className="eyebrow mb-4 text-white/70">Evaluación</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Exámenes en línea</h1>
          <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
            Elige tu nivel. Al aprobar con 80% o más obtienes tu certificado oficial.
          </p>
          {!user && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/login" className="bg-white text-primary px-6 py-3 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                Iniciar sesión
              </Link>
              <Link to="/signup" className="border border-white/40 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-24">
        <div className="container-x grid md:grid-cols-3 gap-6">
          {Object.values(exams).map((e) => {
            const level = e.level;
            const access = user ? hasAccess(level) : false;
            return (
              <div key={level} className={`bg-white rounded-xl border p-8 flex flex-col ${access ? "border-emerald-300" : "border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Nivel {level}</span>
                  {user && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                      access ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {access ? "✓ Habilitado" : "Requiere compra"}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold">{e.title}</h2>
                <p className="mt-3 text-sm text-muted flex-1">{e.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                  <li className="flex items-center gap-2"><span className="text-muted">•</span> {e.duration} minutos</li>
                  <li className="flex items-center gap-2"><span className="text-muted">•</span> {e.questions.length} preguntas</li>
                  <li className="flex items-center gap-2"><span className="text-muted">•</span> Aprobación: {e.passingScore}%</li>
                </ul>
                {user && !access && (
                  <Link to={`/checkout/${level}`} className="btn-outline w-full mt-6">
                    Comprar curso
                  </Link>
                )}
                <Link to={`/examen/${level}`} className={`w-full mt-3 ${user && !access ? "btn-ghost" : "btn-primary"}`}>
                  {user && !access ? "Ver examen" : "Iniciar examen"}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="container-x mt-16">
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <div className="eyebrow mb-3">Proceso</div>
            <h2 className="text-2xl md:text-3xl font-bold text-center">Certificación automatizada</h2>
            <div className="mt-10 grid md:grid-cols-4 gap-6 text-left">
              {[
                { n: "01", t: "Regístrate", d: "Crea tu cuenta gratuita." },
                { n: "02", t: "Compra", d: "Adquiere el curso de tu nivel." },
                { n: "03", t: "Evalúa", d: "Realiza tu examen en línea." },
                { n: "04", t: "Certifícate", d: "Recibe tu PDF por correo." },
              ].map((s) => (
                <div key={s.n} className="bg-white rounded-lg p-5 border border-slate-100">
                  <div className="text-3xl font-bold text-slate-200">{s.n}</div>
                  <h3 className="mt-2 font-semibold text-sm">{s.t}</h3>
                  <p className="mt-1.5 text-xs text-muted">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
