import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { courses } from "../data/site";

function CountUp({ end, duration = 2000, suffix = "", decimals = 0 }: { end: number; duration?: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = progress * end;
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={elementRef}>
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

const stats = [
  { end: 15, suffix: "+", label: "Años de experiencia" },
  { end: 8500, suffix: "+", label: "Alumnos graduados" },
  { end: 98, suffix: "%", label: "Aprobación" },
  { end: 4.9, suffix: "/5", decimals: 1, label: "Calificación" },
];

const benefits = [
  { icon: "01", title: "Seguridad garantizada", desc: "Vehículos con doble comando, frenos ABS y seguro de responsabilidad civil." },
  { icon: "02", title: "Instructores certificados", desc: "Profesionales con más de 10 años de experiencia en conducción segura." },
  { icon: "03", title: "Material incluido", desc: "Manual digital, videos explicativos y exámenes simulados." },
  { icon: "04", title: "Certificación oficial", desc: "Diploma válido para trámite de licencia de conducir." },
  { icon: "05", title: "Horarios flexibles", desc: "Clases de lunes a sábado en turnos matutinos y vespertinos." },
  { icon: "06", title: "Pago seguro", desc: "Tarjeta, transferencia, PayPal y Mercado Pago." },
];

const testimonials = [
  { name: "María González", role: "Curso Intermedio", text: "Excelente atención. Me sentí segura desde el primer día. Aprobé mi examen a la primera.", rating: 5 },
  { name: "Carlos Ramírez", role: "Curso Experto", text: "La parte de conducción defensiva vale mucho. Los simulacros de emergencia fueron muy útiles.", rating: 5 },
  { name: "Laura Hernández", role: "Madre de alumno", text: "Inscribí a mi hijo y el trato fue impecable. Recibió su certificado al día siguiente de aprobar.", rating: 5 },
];

const faqs = [
  { q: "¿Necesito experiencia previa?", a: "No. Nuestro Curso Básico está diseñado para personas sin experiencia. Empezamos en circuito cerrado." },
  { q: "¿Cuánto dura un curso?", a: "El Básico dura 2 semanas, el Intermedio 3 semanas y el Experto 4 semanas." },
  { q: "¿Qué documentos necesito?", a: "INE o pasaporte, CURP, comprobante de domicilio y pago inicial." },
  { q: "¿El certificado es válido para la licencia?", a: "Sí. Nuestros certificados están avalados por las autoridades de tránsito." },
];

const sliderItems = [
  {
    title: "Aprendizaje acompañado desde el primer día",
    text: "Instructores certificados te guían paso a paso para que conduzcas con seguridad, calma y criterio vial.",
    image: "https://images.pexels.com/photos/6817037/pexels-photo-6817037.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    label: "Clases prácticas",
    cta: "Certifícate",
    ctaLink: "/examenes",
  },
  {
    title: "Confianza al volante en situaciones reales",
    text: "Entrenamos en ciudad, circuitos controlados y escenarios cotidianos para fortalecer tu toma de decisiones.",
    image: "https://images.pexels.com/photos/9518022/pexels-photo-9518022.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    label: "Manejo seguro",
    cta: "Sign up",
    ctaLink: "/signup",
  },
  {
    title: "Preparación teórica para certificarte",
    text: "Accede a materiales, simuladores y exámenes en línea para validar tus conocimientos antes de obtener tu certificado.",
    image: "https://images.pexels.com/photos/35745592/pexels-photo-35745592.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    label: "Certificación",
    cta: "Contáctanos",
    ctaLink: "/contacto",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % sliderItems.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const goToPrevSlide = () => {
    setActiveSlide((current) => (current - 1 + sliderItems.length) % sliderItems.length);
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % sliderItems.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNextSlide();
    } else if (distance < -minSwipeDistance) {
      goToPrevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      {/* HERO */}
      <section className="hero-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/50 to-transparent" />
        <div className="container-x relative py-24 md:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-8 h-40 md:h-36 w-auto">
              <img
                src="https://github.com/Binec/AcademiaMTY/blob/main/AM_SINFONDOMesa%20de%20trabajo%202%20copia%202@2x.png?raw=true"
                alt="AM Monterrey Academia"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              Escuela certificada con 15+ años de experiencia
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight">
              Aprende a conducir con seguridad
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-lg leading-relaxed">
              Cursos prácticos con instructores certificados, vehículos modernos y exámenes en línea para obtener tu certificación oficial.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cursos" className="bg-white text-primary px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                Ver cursos
              </Link>
              <Link to="/examenes" className="border border-white/40 text-white px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
                Exámenes en línea
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="relative inline-flex bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full overflow-hidden">
                  <span className="absolute inset-0 bg-accent/30 animate-pulse rounded-full" />
                  <span className="relative">OFERTA</span>
                </span>
                <span className="text-white/60 text-xs">Curso Básico</span>
              </div>
              <div className="text-5xl font-bold mb-2">$1,499</div>
              <div className="text-white/50 text-sm line-through mb-6">$1,899 MXN</div>
              <ul className="space-y-3 mb-8">
                {["12 horas prácticas", "Instructores certificados", "Material digital", "Certificado oficial"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs transition-transform duration-300 hover:scale-125">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/cursos" className="block w-full bg-white text-primary py-3 rounded-lg text-sm font-semibold text-center hover:bg-primary hover:text-white transition-colors">
                Reservar mi cupo
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container-x pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold">
                  <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="text-xs text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE SLIDER */}
      <section className="py-20 bg-white">
        <div className="container-x">
          <div
            className="relative h-[560px] sm:h-[480px] md:h-[540px] overflow-hidden rounded-2xl border border-slate-200 bg-primary shadow-sm"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {sliderItems.map((item, index) => (
              <div
                key={item.title}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  index === activeSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={`h-full w-full object-cover transition-transform duration-[5000ms] ease-linear ${
                    index === activeSlide ? "scale-105" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-primary/20 md:to-transparent" />
              </div>
            ))}

            <div className="absolute inset-0 flex items-end sm:items-center p-4 sm:p-6 md:p-12">
              <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-white/[0.08] p-5 sm:p-6 md:p-8 text-white shadow-2xl backdrop-blur-md">
                <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  {sliderItems[activeSlide].label}
                </div>
                <h2 className="sm:mt-3 text-xl sm:text-3xl font-bold leading-tight md:text-4xl">
                  {sliderItems[activeSlide].title}
                </h2>
                <p className="hidden sm:block sm:mt-3 text-xs sm:text-sm leading-relaxed text-white/75 md:text-base">
                  {sliderItems[activeSlide].text}
                </p>
                <Link
                  to={sliderItems[activeSlide].ctaLink}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition-colors hover:bg-secondary-dark"
                >
                  {sliderItems[activeSlide].cta}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    {sliderItems.map((item, index) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === activeSlide ? "w-10 bg-secondary" : "w-5 bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Ver slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-white/55 sm:hidden">Desliza ↔</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24">
        <div className="container-x">
          <div className="max-w-2xl mb-14">
            <div className="eyebrow mb-3">Por qué elegirnos</div>
            <h2 className="section-title">Seis razones para aprender con nosotros</h2>
            <p className="section-subtitle mt-4">
              Más de 15 años formando conductores responsables.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="group flex gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md">
                <div className="w-12 h-12 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-sm shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <div className="eyebrow mb-3">Cursos</div>
              <h2 className="section-title">Elige el plan ideal para ti</h2>
              <p className="section-subtitle mt-4">
                Tres niveles para cubrir desde principiantes hasta conductores certificados.
              </p>
            </div>
            <Link to="/cursos" className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1">
              Ver todos →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div key={c.id} className="card course-card-hover overflow-hidden flex flex-col">
                <div className="p-7 flex-1 flex flex-col min-h-[540px]">
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wider">{c.id}</div>
                  <h3 className="mt-2 text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted">{c.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${c.price.toLocaleString()}</span>
                    {c.oldPrice && <span className="text-muted text-sm line-through">${c.oldPrice.toLocaleString()}</span>}
                  </div>
                  <div className="text-xs text-muted mt-1">{c.hours}</div>
                  <ul className="mt-6 space-y-2.5 text-sm text-ink-soft flex-1">
                    {c.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="text-secondary mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Link to="/cursos" className="btn-primary w-full">Comprar ahora</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="container-x">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="eyebrow mb-3">Proceso</div>
            <h2 className="section-title">Cómo obtener tu certificación</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Elige tu curso", desc: "Selecciona el nivel según tu experiencia." },
              { step: "02", title: "Reserva y paga", desc: "Pago en línea seguro y rápido." },
              { step: "03", title: "Toma tus clases", desc: "Aprende con instructores certificados." },
              { step: "04", title: "Certificación", desc: "Aprueba y recibe tu certificado oficial." },
            ].map((s) => (
              <div key={s.step} className="text-center md:text-left">
                <div className="text-4xl font-bold text-slate-200 mb-3">{s.step}</div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="eyebrow mb-3">Testimonios</div>
            <h2 className="section-title">Lo que dicen nuestros alumnos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-slate-100 p-7">
                <div className="text-amber-500 text-sm mb-4">{"★".repeat(t.rating)}</div>
                <p className="text-ink-soft text-sm leading-relaxed">"{t.text}"</p>
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-sm text-primary">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-14">
            <div className="eyebrow mb-3">Dudas</div>
            <h2 className="section-title">Preguntas frecuentes</h2>
          </div>
          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {faqs.map((f, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
                  <span className="font-semibold text-ink pr-4">{f.q}</span>
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-muted group-open:rotate-45 transition-transform shrink-0">+</span>
                </summary>
                <p className="pb-5 text-sm text-muted leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/6165395/pexels-photo-6165395.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
          alt="Persona conduciendo un auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary-dark/80" />
        <div className="container-x relative text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow">¿Listo para obtener tu licencia?</h2>
          <p className="mt-4 text-white/90 max-w-xl mx-auto">
            Reserva tu curso hoy y comienza a conducir con confianza.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/cursos" className="bg-white text-secondary-dark px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              Ver cursos
            </Link>
            <Link to="/contacto" className="border border-white/60 text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-white/15 transition-colors">
              Contactar asesor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
