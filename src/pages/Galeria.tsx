import { useState } from "react";

type Category = "todos" | "unidades" | "instalaciones" | "alumnos";

interface GalleryItem {
  id: number;
  title: string;
  category: Exclude<Category, "todos">;
  emoji: string;
  gradient: string;
}

const items: GalleryItem[] = [
  { id: 1, title: "Sedán doble comando", category: "unidades", emoji: "🚗", gradient: "from-slate-100 to-slate-200" },
  { id: 2, title: "Hatchback moderno", category: "unidades", emoji: "🚙", gradient: "from-slate-100 to-slate-200" },
  { id: 3, title: "SUV para prácticas", category: "unidades", emoji: "🚐", gradient: "from-slate-100 to-slate-200" },
  { id: 4, title: "Circuito cerrado", category: "instalaciones", emoji: "🛣️", gradient: "from-slate-50 to-slate-100" },
  { id: 5, title: "Salón de clases", category: "instalaciones", emoji: "🏫", gradient: "from-slate-50 to-slate-100" },
  { id: 6, title: "Oficinas", category: "instalaciones", emoji: "🏢", gradient: "from-slate-50 to-slate-100" },
  { id: 7, title: "Simuladores", category: "instalaciones", emoji: "🎮", gradient: "from-slate-50 to-slate-100" },
  { id: 8, title: "Graduación 2025", category: "alumnos", emoji: "🎓", gradient: "from-primary/5 to-primary/10" },
  { id: 9, title: "Clase práctica", category: "alumnos", emoji: "👨‍🎓", gradient: "from-primary/5 to-primary/10" },
  { id: 10, title: "Examen en línea", category: "alumnos", emoji: "💻", gradient: "from-primary/5 to-primary/10" },
  { id: 11, title: "Entrega de certificados", category: "alumnos", emoji: "🏅", gradient: "from-primary/5 to-primary/10" },
  { id: 12, title: "Curso de menores", category: "alumnos", emoji: "👧", gradient: "from-primary/5 to-primary/10" },
];

const filters: { key: Category; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "unidades", label: "Unidades" },
  { key: "instalaciones", label: "Instalaciones" },
  { key: "alumnos", label: "Alumnos" },
];

export default function Galeria() {
  const [filter, setFilter] = useState<Category>("todos");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = filter === "todos" ? items : items.filter((i) => i.category === filter);

  return (
    <>
      <section className="hero-bg text-white py-24">
        <div className="container-x max-w-4xl text-center">
          <div className="eyebrow mb-4 text-white/70">Galería</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Nuestras instalaciones</h1>
          <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
            Vehículos, infraestructura y alumnos de AutoEscuela Pro.
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
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightbox(item)}
                className={`group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${item.gradient} hover:shadow-lg transition-shadow`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50 group-hover:opacity-70 transition-opacity">
                  {item.emoji}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs uppercase tracking-wider text-white/70">{item.category}</div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`aspect-video bg-gradient-to-br ${lightbox.gradient} flex items-center justify-center text-8xl`}>
              {lightbox.emoji}
            </div>
            <div className="p-6">
              <div className="text-xs uppercase tracking-wider text-secondary font-semibold">{lightbox.category}</div>
              <h3 className="mt-1 text-xl font-bold">{lightbox.title}</h3>
              <button onClick={() => setLightbox(null)} className="btn-primary w-full mt-5">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
