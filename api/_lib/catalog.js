// Catálogo de cursos — debe reflejar src/data/site.ts
// IMPORTANTE: el backend SIEMPRE calcula el precio desde aquí.
// Nunca confiar en el precio que llega desde el navegador.

const COURSES = {
  basico: { title: "Curso Básico", price: 1499 },
  intermedio: { title: "Curso Intermedio", price: 2299 },
  experto: { title: "Curso Experto", price: 3499 },
  "primeros-auxilios": { title: "Primeros Auxilios", price: 799 },
};

/**
 * Calcula el total del carrito de forma segura en el servidor.
 * @param {string[]} cart - array de ids de curso, ej. ["basico", "intermedio"]
 */
function buildOrder(cart) {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("Carrito vacío o inválido");
  }

  const items = cart.map((id) => {
    const course = COURSES[id];
    if (!course) throw new Error(`Curso inválido: ${id}`);
    return { id, title: course.title, price: course.price };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const bundleDiscount = cart.length >= 2 ? Math.round(subtotal * 0.10) : 0;
  const taxBase = subtotal - bundleDiscount;
  const iva = Math.round(taxBase * 0.16);
  const total = taxBase + iva;

  return { items, subtotal, bundleDiscount, iva, total };
}

module.exports = { COURSES, buildOrder };