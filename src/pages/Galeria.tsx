import { useState } from "react";

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
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = filter === "todos" ? items : items.filter((i) => i.category === filter);

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
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightbox(item)}
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
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-slate-100 overflow-hidden">
              <img src={lightbox.image} alt={lightbox.title} className="w-full h-full object-cover" />
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
