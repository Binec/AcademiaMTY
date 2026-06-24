// api/create-checkout-session.js
//
// Endpoint: POST /api/create-checkout-session
// Body esperado: { cart: string[], name: string, email: string }
//
// Crea una Stripe Checkout Session y regresa { url } para redirigir al alumno.
// El precio SIEMPRE se calcula aquí con buildOrder(), nunca se confía en
// cualquier "total" que venga del navegador.

const Stripe = require("stripe");
const { buildOrder } = require("./_lib/catalog");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // CORS básico (ajusta el origin a tu dominio real en producción)
  res.setHeader("Access-Control-Allow-Origin", process.env.PUBLIC_URL || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { cart, name, email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Correo inválido" });
    }

    const order = buildOrder(cart); // valida cursos y calcula el total real

    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "mxn",
        product_data: { name: item.title },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: 1,
    }));

    // El descuento y el IVA se reflejan en una sola línea de ajuste para que
    // el total cobrado coincida exactamente con order.total.
    const ajuste = order.total - order.subtotal;
    if (ajuste !== 0) {
      line_items.push({
        price_data: {
          currency: "mxn",
          product_data: {
            name:
              order.bundleDiscount > 0
                ? `IVA (16%) menos descuento por paquete (-10%)`
                : `IVA (16%)`,
          },
          unit_amount: Math.round(ajuste * 100),
        },
        quantity: 1,
      });
    }

    const courseIds = order.items.map((i) => i.id).join(",");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items,
      mode: "payment",
      success_url: `${process.env.PUBLIC_URL}/gracias/${order.items[0].id}?items=${encodeURIComponent(
        courseIds
      )}&name=${encodeURIComponent(name || "")}&email=${encodeURIComponent(email)}`,
      cancel_url: `${process.env.PUBLIC_URL}/checkout/${order.items[0].id}`,
      metadata: {
        courseIds,
        studentName: name || "",
        email,
      },
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("Error creando checkout session:", err);
    return res.status(400).json({ error: err.message || "Error al crear el pago" });
  }
};