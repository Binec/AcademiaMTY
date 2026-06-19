import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { exams } from "../data/examQuestions";
import { courses } from "../data/site";
import { getMyAttempts, getMyCertificates } from "../services/api";
import { DbAttempt, DbCertificate } from "../services/db";
import { downloadCertificate } from "../utils/certificate";

function loadAttempts(): DbAttempt[] {
  try {
    return getMyAttempts();
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const { user, logout, hasAccess } = useAuth();
  const attempts = loadAttempts();
  const certificates = (() => {
    try {
      return getMyCertificates();
    } catch {
      return [] as DbCertificate[];
    }
  })();

  if (!user) return null;

  const purchasedLevels = user.purchasedCourses;

  return (
    <>
      <section className="hero-bg text-white py-16">
        <div className="container-x max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-white/70 text-sm">Bienvenido</div>
              <h1 className="text-3xl md:text-4xl font-bold mt-1">{user.name}</h1>
              <p className="text-white/75 text-sm mt-2">{user.email}</p>
            </div>
            <button onClick={logout} className="border border-white/30 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x max-w-5xl">
          {/* Cursos / Acceso */}
          <div className="mb-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="eyebrow mb-2">Mis cursos</div>
                <h2 className="text-2xl font-bold">Acceso a exámenes</h2>
              </div>
              {purchasedLevels.length < 3 && (
                <Link to="/cursos" className="text-sm font-semibold text-primary hover:underline">
                  Comprar más cursos →
                </Link>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.values(exams).map((e) => {
                const access = hasAccess(e.level);
                return (
                  <div key={e.level} className={`bg-white rounded-xl border p-7 flex flex-col ${access ? "border-emerald-300" : "border-slate-200"}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Nivel {e.level}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                        access ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {access ? "✓ Habilitado" : "Sin acceso"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold">{e.title}</h3>
                    <p className="mt-2 text-sm text-muted flex-1">{e.description}</p>
                    {access ? (
                      <Link to={`/examen/${e.level}`} className="btn-primary w-full mt-5">
                        Iniciar examen
                      </Link>
                    ) : (
                      <>
                        <Link to={`/checkout/${e.level}`} className="btn-outline w-full mt-5">
                          Comprar por ${courses.find((c) => c.id === e.level)?.price.toLocaleString()}
                        </Link>
                        <Link to="/cursos" className="btn-ghost w-full mt-3 text-sm">
                          Ver detalles
                        </Link>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-xs uppercase tracking-wider text-muted font-semibold">Cursos activos</div>
              <div className="text-3xl font-bold text-primary mt-2">{purchasedLevels.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-xs uppercase tracking-wider text-muted font-semibold">Intentos realizados</div>
              <div className="text-3xl font-bold text-primary mt-2">{attempts.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-xs uppercase tracking-wider text-muted font-semibold">Aprobados</div>
              <div className="text-3xl font-bold text-emerald-600 mt-2">
                {attempts.filter((a) => a.passed).length}
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="eyebrow mb-2">Exámenes</div>
                <h2 className="text-2xl font-bold">Continúa tu proceso</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.values(exams).map((e) => (
                <div key={e.level} className="bg-white rounded-xl border border-slate-200 p-7 flex flex-col">
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wider">Nivel {e.level}</div>
                  <h3 className="mt-2 text-lg font-bold">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted">{e.description}</p>
                  <div className="mt-4 text-xs text-muted">
                    {e.questions.length} preguntas · {e.duration} min · {e.passingScore}% mínimo
                  </div>
                  <Link to={`/examen/${e.level}`} className="btn-primary w-full mt-6">
                    Iniciar examen
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Mis certificados</h2>
            {certificates.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="text-3xl mb-2">🎓</div>
                <div className="font-semibold text-sm">Aún no tienes certificados emitidos</div>
                <p className="mt-1 text-xs text-muted">Aprueba un examen con 80% o más para obtener tu certificado PDF.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {certificates.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl border border-emerald-200 p-5 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Certificado oficial</div>
                        <div className="text-lg font-bold capitalize mt-1">{c.level}</div>
                      </div>
                      <div className="text-2xl">🏅</div>
                    </div>
                    <div className="mt-3 text-xs text-muted space-y-0.5 flex-1">
                      <div>Emitido: {c.date}</div>
                      <div>Calificación: <strong className="text-primary">{c.score}%</strong></div>
                      <div className="font-mono text-[10px]">Folio: {c.certificateId}</div>
                    </div>
                    <button
                      onClick={() => {
                        downloadCertificate({
                          studentName: user?.name || "Alumno",
                          email: user?.email || "",
                          level: c.level,
                          score: c.score,
                          date: c.date,
                          certificateId: c.certificateId,
                        });
                      }}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-4 py-2 text-xs font-semibold transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Descargar PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Historial</h2>
            {attempts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                <div className="text-4xl mb-3">📝</div>
                <div className="font-semibold">Aún no has realizado ningún examen</div>
                <p className="mt-2 text-sm text-muted">Elige un examen de la lista superior para comenzar.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-muted text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold">Nivel</th>
                      <th className="text-left px-6 py-3 font-semibold">Calificación</th>
                      <th className="text-left px-6 py-3 font-semibold">Estado</th>
                      <th className="text-left px-6 py-3 font-semibold">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attempts.slice().reverse().map((a, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 font-medium capitalize">{a.level}</td>
                        <td className="px-6 py-4">{a.score}%</td>
                        <td className="px-6 py-4">
                          {a.passed ? (
                            <span className="text-emerald-700 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded">APROBADO</span>
                          ) : (
                            <span className="text-red-700 text-xs font-semibold bg-red-50 px-2.5 py-1 rounded">REPROBADO</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted">
                          {new Date(a.date).toLocaleString("es-MX", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
