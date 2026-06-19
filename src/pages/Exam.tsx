import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { exams, Question } from "../data/examQuestions";
import { CertificateData, downloadCertificate, sendCertificateByEmail } from "../utils/certificate";
import { useAuth } from "../context/AuthContext";
import { submitExamAttempt } from "../services/api";

type Stage = "intro" | "exam" | "result";

export default function Exam() {
  const { level = "basico" } = useParams();
  const examData = exams[level] ?? exams.basico;

  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>("intro");
  const [student, setStudent] = useState({ name: user?.name || "", email: user?.email || "" });
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(examData.duration * 60);
  const [result, setResult] = useState<{ score: number; correct: number; total: number; passed: boolean } | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const total = examData.questions.length;
  const progress = useMemo(() => Math.round((Object.keys(answers).length / total) * 100), [answers, total]);

  useEffect(() => {
    if (stage !== "exam") return;
    if (timeLeft <= 0) { finishExam(); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, timeLeft]);

  const startExam = () => {
    if (student.name.trim().length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
      alert("Ingresa tu nombre y un correo válido.");
      return;
    }
    setAnswers({});
    setCurrent(0);
    setTimeLeft(examData.duration * 60);
    setStage("exam");
  };

  const finishExam = async () => {
    let correct = 0;
    examData.questions.forEach((q: Question) => {
      if (answers[q.id] === q.correct) correct++;
    });
    const score = Math.round((correct / total) * 100);
    const passed = score >= examData.passingScore;
    setResult({ score, correct, total, passed });
    setStage("result");

    // Guardar intento + certificado (si aplica) en la base de datos centralizada
    let finalCertId = `AEP-${examData.level.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    try {
      const result = await submitExamAttempt({
        level: examData.level,
        correct,
        total,
      });
      if (result.certificate) finalCertId = result.certificate.certificateId;
    } catch (e) {
      console.error("Error al guardar intento", e);
    }

    if (passed) {
      const certData: CertificateData = {
        studentName: student.name,
        email: student.email,
        level: examData.level,
        score,
        date: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" }),
        certificateId: finalCertId,
      };
      downloadCertificate(certData);
      setSendingEmail(true);
      sendCertificateByEmail(certData).then((ok) => {
        setEmailSent(ok);
        setSendingEmail(false);
      });
    }
  };

  const answer = (qid: number, opt: number) => setAnswers((a) => ({ ...a, [qid]: opt }));
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  // INTRO
  if (stage === "intro") {
    return (
      <section className="py-24">
        <div className="container-x max-w-3xl">
          <Link to="/examenes" className="text-sm text-primary font-medium hover:underline">← Volver a exámenes</Link>
          <div className="mt-8 bg-white rounded-xl border border-slate-200 p-8 md:p-10">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Examen {examData.level}</span>
            <h1 className="mt-3 text-3xl font-bold">{examData.title}</h1>
            <p className="mt-4 text-muted">{examData.description}</p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{total}</div>
                <div className="text-xs text-muted mt-1">Preguntas</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{examData.duration}m</div>
                <div className="text-xs text-muted mt-1">Tiempo</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary">{examData.passingScore}%</div>
                <div className="text-xs text-muted mt-1">Mínimo</div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Nombre completo</label>
                <input
                  value={student.name}
                  onChange={(e) => setStudent({ ...student, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  placeholder="Nombre para el certificado"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={student.email}
                  onChange={(e) => setStudent({ ...student, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  placeholder="donde recibirás el certificado PDF"
                />
              </div>
            </div>

            <button onClick={startExam} className="btn-primary w-full mt-8">
              Comenzar examen →
            </button>
          </div>
        </div>
      </section>
    );
  }

  // RESULT
  if (stage === "result" && result) {
    return (
      <section className="py-24">
        <div className="container-x max-w-3xl text-center">
          {result.passed ? (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">✓</div>
              <h1 className="mt-6 text-3xl font-bold text-emerald-700">¡Aprobaste!</h1>
              <p className="mt-4 text-muted max-w-xl mx-auto">
                Tu certificado se ha enviado a <strong>{student.email}</strong>.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto">✕</div>
              <h1 className="mt-6 text-3xl font-bold text-red-600">Reprobado</h1>
              <p className="mt-4 text-muted max-w-xl mx-auto">
                No alcanzaste el 80%. Puedes reintentarlo.
              </p>
            </>
          )}

          <div className="mt-8 bg-white rounded-xl border border-slate-200 p-8">
            <div className="text-sm text-muted">Calificación</div>
            <div className={`text-6xl font-bold mt-2 ${result.passed ? "text-emerald-600" : "text-red-600"}`}>
              {result.score}%
            </div>
            <div className="mt-3 text-sm text-ink-soft">
              {result.correct} de {result.total} correctas
            </div>
            <div className="mt-5 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className={`h-full ${result.passed ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${result.score}%` }} />
            </div>
            <div className="mt-2 text-xs text-muted flex justify-between">
              <span>0%</span>
              <span className="font-medium text-primary">Mínimo: {examData.passingScore}%</span>
              <span>100%</span>
            </div>
          </div>

          {result.passed && (
            <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
              Certificado PDF descargado. {sendingEmail ? "Enviando correo..." : emailSent ? "Copiado a " + student.email : ""}
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {result.passed ? (
              <>
                <button
                  onClick={() => {
                    downloadCertificate({
                      studentName: student.name, email: student.email, level: examData.level,
                      score: result.score, date: new Date().toLocaleDateString("es-MX"),
                      certificateId: `AEP-${Date.now().toString(36).toUpperCase()}`
                    });
                  }}
                  className="btn-primary"
                >
                  Descargar certificado
                </button>
                <Link to="/" className="btn-ghost">Inicio</Link>
              </>
            ) : (
              <>
                <button onClick={() => { setStage("intro"); setResult(null); }} className="btn-primary">
                  Reintentar
                </button>
                <Link to="/examenes" className="btn-ghost">Otro nivel</Link>
              </>
            )}
          </div>

          {/* Review */}
          <div className="mt-12 text-left">
            <h3 className="font-semibold text-lg mb-4">Revisión de respuestas</h3>
            <div className="space-y-3">
              {examData.questions.map((q: Question, i: number) => {
                const chosen = answers[q.id];
                const isCorrect = chosen === q.correct;
                return (
                  <div key={q.id} className={`rounded-lg border p-5 ${isCorrect ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"}`}>
                    <div className="flex gap-3">
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 ${isCorrect ? "bg-emerald-500" : "bg-red-500"}`}>
                        {isCorrect ? "✓" : "✕"}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{i + 1}. {q.text}</div>
                        <div className="mt-2 text-xs text-muted">
                          <span>Tu respuesta: </span>
                          <span className={isCorrect ? "text-emerald-700 font-semibold" : "text-red-700 font-semibold"}>
                            {chosen !== undefined ? q.options[chosen] : "Sin responder"}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-xs text-emerald-700 font-semibold mt-1">
                            Correcta: {q.options[q.correct]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // EXAM
  const q: Question = examData.questions[current];

  return (
    <section className="py-8 bg-slate-50 min-h-screen">
      <div className="container-x max-w-4xl">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-secondary uppercase tracking-wider">Examen {examData.level}</div>
            <div className="font-semibold">{examData.title}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-center px-4 py-2 rounded-lg ${timeLeft < 60 ? "bg-red-50 text-red-700" : "bg-slate-50 text-primary"}`}>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted">Tiempo</div>
              <div className="text-lg font-bold tabular-nums">{mm}:{ss}</div>
            </div>
            <div className="text-center px-4 py-2 rounded-lg bg-slate-50">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted">Progreso</div>
              <div className="text-lg font-bold">{progress}%</div>
            </div>
            {/* PROTOTYPE ONLY: Auto-approve cheat for Curso Basico */}
            {examData.level === "basico" && (
              <button
                type="button"
                onClick={() => {
                  const correctAnswers: Record<number, number> = {};
                  examData.questions.forEach((q) => {
                    correctAnswers[q.id] = q.correct;
                  });
                  setAnswers(correctAnswers);
                }}
                className="w-5 h-5 rounded border border-slate-200 bg-white text-[9px] text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                title="Debug: Autocompletar (prototype)"
                aria-label="Autocompletar respuestas"
              >
                ⚡
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>

        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-8">
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-muted">Pregunta <strong className="text-primary">{current + 1}</strong> de {total}</span>
          </div>
          <h2 className="text-lg md:text-xl font-semibold leading-relaxed">{q.text}</h2>

          <div className="mt-6 space-y-3">
            {q.options.map((opt, idx) => {
              const selected = answers[q.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => answer(q.id, idx)}
                  className={`w-full text-left rounded-lg border-2 p-4 transition-colors flex items-start gap-3 ${
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center font-semibold text-sm shrink-0 ${
                    selected ? "bg-primary text-white" : "bg-slate-100 text-ink-soft"
                  }`}>
                    {["A", "B", "C", "D"][idx] ?? (idx + 1)}
                  </div>
                  <span className="text-sm font-medium pt-1">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="btn-ghost disabled:opacity-40"
            >
              ← Anterior
            </button>
            {current < total - 1 ? (
              <button onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))} className="btn-primary">
                Siguiente →
              </button>
            ) : (
              <button onClick={finishExam} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
                Finalizar ✓
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-xs uppercase tracking-wider text-muted font-semibold mb-3">Navegación</div>
          <div className="grid grid-cols-6 md:grid-cols-10 gap-1.5">
            {examData.questions.map((qq: Question, i: number) => {
              const answered = answers[qq.id] !== undefined;
              return (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-9 rounded text-xs font-medium transition ${
                    i === current ? "bg-primary text-white" : answered ? "bg-emerald-500 text-white" : "bg-slate-100 text-ink-soft hover:bg-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-right">
            <button onClick={finishExam} className="btn-primary text-sm">
              Finalizar ({Object.keys(answers).length}/{total})
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
