import { useRef, useState } from "react";

type Category = "todos" | "unidades" | "instalaciones" | "alumnos";

interface GalleryItem {
  id: number;
  title: string;
  category: Exclude<Category, "todos">;
  image: string;
}

const items: GalleryItem[] = [
  { id: 1, title: "Sedán doble comando", category: "unidades", image: "https://images.pexels.com/photos/31775351/pexels-photo-31775351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 2, title: "Sedán de práctica", category: "unidades", image: "https://images.pexels.com/photos/11418914/pexels-photo-11418914.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 3, title: "SUV para carretera", category: "unidades", image: "https://images.pexels.com/photos/29036735/pexels-photo-29036735.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 4, title: "Manejo en autopista", category: "instalaciones", image: "https://images.pexels.com/photos/28884174/pexels-photo-28884174.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 5, title: "Práctica al volante", category: "instalaciones", image: "https://images.pexels.com/photos/19477337/pexels-photo-19477337.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 6, title: "Vehículo equipado", category: "instalaciones", image: "https://images.pexels.com/photos/1405666/pexels-photo-1405666.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 7, title: "Control del vehículo", category: "instalaciones", image: "https://images.pexels.com/photos/9737305/pexels-photo-9737305.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 8, title: "Clase con instructor", category: "alumnos", image: "https://images.pexels.com/photos/6817037/pexels-photo-6817037.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 9, title: "Primera clase práctica", category: "alumnos", image: "https://images.pexels.com/photos/9518244/pexels-photo-9518244.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 10, title: "Alumno aprendiendo", category: "alumnos", image: "https://images.pexels.com/photos/9518016/pexels-photo-9518016.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 11, title: "Acompañamiento del instructor", category: "alumnos", image: "https://images.pexels.com/photos/9518019/pexels-photo-9518019.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { id: 12, title: "Sesión de manejo", category: "alumnos", image: "https://images.pexels.com/photos/9518022/pexels-photo-9518022.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
];

const filters: { key: Category; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "unidades", label: "Unidades" },
  { key: "instalaciones", label: "Instalaciones" },
  { key: "alumnos", label: "Alumnos" },
];

export default function Galeria() {
  const [filter, setFilter] = useState<Category>("todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const filtered = filter === "todos" ? items : items.filter((i) => i.category === filter);
  const lightbox = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      return (current - 1 + filtered.length) % filtered.length;
    });
  };
  const showNext = () => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      return (current + 1) % filtered.length;
    });
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
    if (distance > 50) showNext();
    if (distance < -50) showPrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <section className="hero-bg text-white py-24">
        <div className="container-x max-w-4xl text-center">
          <div className="eyebrow mb-4 text-white/70">Galería</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Nuestras instalaciones</h1>
          <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
            Vehículos, infraestructura y alumnos de AM Monterrey Academia.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-ink-soft hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <div className="text-[10px] uppercase tracking-wider text-white/70">{item.category}</div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 md:p-6"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black/35 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/15"
              aria-label="Cerrar galería"
            >
              x
            </button>

            <button
              onClick={showPrev}
              className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/15 md:grid md:place-items-center"
              aria-label="Imagen anterior"
            >
              ‹
            </button>

            <button
              onClick={showNext}
              className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/15 md:grid md:place-items-center"
              aria-label="Siguiente imagen"
            >
              ›
            </button>

            <div className="w-full bg-black">
              <img
                src={lightbox.image}
                alt={lightbox.title}
                className="h-[55vh] max-h-[680px] min-h-[300px] w-full object-cover"
              />
            </div>
            <div className="border-t border-white/10 bg-black/45 p-5 text-white backdrop-blur-md md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                    {lightbox.category} · {(lightboxIndex ?? 0) + 1}/{filtered.length}
                  </div>
                  <h3 className="mt-2 text-2xl font-bold md:text-3xl">{lightbox.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                    Imagen relacionada con la formación vial, el acompañamiento de instructores y las prácticas de manejo seguro en AM Monterrey Academia.
                  </p>
                </div>
                <div className="hidden shrink-0 gap-2 sm:flex">
                  <button onClick={showPrev} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10">
                    Anterior
                  </button>
                  <button onClick={showNext} className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary-dark">
                    Siguiente
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between sm:hidden">
                <span className="text-xs text-white/50">Desliza para ver más</span>
                <div className="flex gap-2">
                  <button onClick={showPrev} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80">Anterior</button>
                  <button onClick={showNext} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-white">Siguiente</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
