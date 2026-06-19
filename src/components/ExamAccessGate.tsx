import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CourseLevel } from "../data/site";
import { useAuth } from "../context/AuthContext";

interface Props {
  level: CourseLevel;
  children: ReactNode;
}

const levelInfo: Record<CourseLevel, { title: string; price: number }> = {
  basico: { title: "Examen Básico", price: 1499 },
  intermedio: { title: "Examen Intermedio", price: 2299 },
  experto: { title: "Examen Experto", price: 3499 },
  "primeros-auxilios": { title: "Examen de Primeros Auxilios", price: 799 },
};

export default function ExamAccessGate({ level, children }: Props) {
  const { user, hasAccess } = useAuth();

  if (!user) {
    return (
      <section className="py-24 bg-slate-50 min-h-screen flex items-center">
        <div className="container-x max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto">🔒</div>
          <h1 className="mt-6 text-2xl font-bold">Inicia sesión para continuar</h1>
          <p className="mt-3 text-muted text-sm">
            Debes iniciar sesión para acceder al {levelInfo[level].title.toLowerCase()}.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/login" className="btn-primary w-full">Iniciar sesión</Link>
            <Link to="/signup" className="btn-outline w-full">Crear cuenta gratis</Link>
            <Link to="/cursos" className="btn-ghost w-full">Ver cursos y precios</Link>
          </div>
        </div>
      </section>
    );
  }

  if (!hasAccess(level)) {
    return (
      <section className="py-24 bg-slate-50 min-h-screen flex items-center">
        <div className="container-x max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto">🔑</div>
          <h1 className="mt-6 text-2xl font-bold">Acceso no disponible</h1>
          <p className="mt-3 text-muted text-sm">
            Aún no has adquirido el <strong>{levelInfo[level].title.toLowerCase()}</strong>.
            Compra el curso correspondiente para habilitar tu examen y certificación.
          </p>
          <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted font-semibold">Curso {level}</div>
                <div className="font-semibold mt-1">{levelInfo[level].title}</div>
              </div>
              <div className="text-2xl font-bold text-primary">${levelInfo[level].price.toLocaleString()}</div>
            </div>
            <Link to={`/checkout/${level}`} className="btn-primary w-full mt-5">
              Comprar y habilitar examen
            </Link>
          </div>
          <div className="mt-4 text-xs text-muted">
            ¿Ya pagaste? El acceso se activa automáticamente después del pago exitoso.
            <br />
            Si tienes dudas, <Link to="/contacto" className="text-primary font-semibold hover:underline">contáctanos</Link>.
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
