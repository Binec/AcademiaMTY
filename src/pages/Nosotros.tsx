import { Link } from "react-router-dom";

const instructors = [
  { name: "Ing. Pedro Martínez", role: "Director / Instructor Senior", years: "20 años", exp: "Conducción defensiva y emergencias", image: "https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { name: "Luz María Hernández", role: "Instructora Certificada", years: "12 años", exp: "Alumnos principiantes", image: "https://images.pexels.com/photos/7752788/pexels-photo-7752788.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { name: "Carlos Ríos", role: "Instructor Intermedio", years: "10 años", exp: "Manejo en ciudad y autopista", image: "https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { name: "Dra. Ana Solís", role: "Coordinadora Académica", years: "15 años", exp: "Diseño curricular y evaluaciones", image: "https://images.pexels.com/photos/25651531/pexels-photo-25651531.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
];

const values = [
  { title: "Misión", desc: "Formar conductores responsables, seguros y comprometidos con la vida, mediante una metodología práctica y humana." },
  { title: "Visión", desc: "Ser la escuela de manejo más confiable de México, con estándares internacionales de seguridad vial." },
  { title: "Valores", desc: "Integridad, seguridad, respeto, responsabilidad, profesionalismo y mejora continua." },
];

export default function Nosotros() {
  return (
    <>
      <section className="hero-bg text-white py-24">
        <div className="container-x max-w-4xl text-center">
          <div className="eyebrow mb-4 text-white/70">Nuestra historia</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Conductores seguros desde 2009</h1>
          <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
            Más de 15 años formando conductores responsables. Nuestra prioridad es tu seguridad.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="eyebrow mb-3">Sobre nosotros</div>
            <h2 className="section-title">Un equipo comprometido con tu aprendizaje</h2>
            <p className="mt-5 text-muted leading-relaxed">
              En AutoEscuela Pro combinamos experiencia docente, vehículos modernos y una metodología probada para garantizar que desarrolles hábitos de seguridad vial de por vida.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              Contamos con unidades equipadas con doble comando, frenos ABS y seguro de responsabilidad civil. Todos nuestros instructores están certificados por las autoridades de tránsito.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { n: "15+", l: "Años" },
                { n: "8,500+", l: "Alumnos" },
                { n: "20", l: "Instructores" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-white border border-primary p-5 text-center shadow-sm">
                  <div className="text-2xl font-bold text-primary">{s.n}</div>
                  <div className="text-xs text-muted mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xl">
              <img
                src="https://images.pexels.com/photos/9518016/pexels-photo-9518016.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="Alumno aprendiendo a conducir con instructor certificado"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-slate-100 p-5 max-w-[220px]">
              <div className="font-semibold text-sm">Certificación oficial</div>
              <div className="text-xs text-muted mt-1">Reconocida por autoridades de tránsito</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow mb-3">Nuestra esencia</div>
            <h2 className="section-title">Misión, Visión y Valores</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl border border-slate-100 p-8">
                <div className="w-10 h-0.5 bg-accent mb-6" />
                <h3 className="text-lg font-bold">{v.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow mb-3">Equipo</div>
            <h2 className="section-title">Instructores certificados</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((p) => (
              <div key={p.name} className="bg-white rounded-xl border border-slate-100 p-6 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary/10">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="mt-2 font-semibold text-sm">{p.name}</h3>
                <div className="text-xs text-secondary font-medium mt-1">{p.role}</div>
                <div className="mt-4 text-xs text-muted space-y-1">
                  <div>{p.years} de experiencia</div>
                  <div>{p.exp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/6165395/pexels-photo-6165395.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
          alt="Persona conduciendo un auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary-dark/80" />
        <div className="container-x relative text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow">Conoce nuestras instalaciones</h2>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Circuito cerrado, salones de clase y unidades modernas para tu aprendizaje.
          </p>
          <Link to="/galeria" className="mt-8 inline-flex bg-white text-secondary-dark px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            Ver galería →
          </Link>
        </div>
      </section>
    </>
  );
}
