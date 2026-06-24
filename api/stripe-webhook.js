// api/stripe-webhook.js
//
// Endpoint: POST /api/stripe-webhook
// Configúralo en el Dashboard de Stripe -> Developers -> Webhooks
// Evento a escuchar: checkout.session.completed
//
// Este es el ÚNICO lugar en el que debes confiar para otorgar acceso al
// curso. El navegador llegando a /gracias NO garantiza que el pago se
// haya cobrado realmente (puede cerrar la pestaña, fallar la red, etc).

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Vercel necesita el body "crudo" (sin parsear) para verificar la firma del webhook.
module.exports.config = {
  api: { bodyParser: false },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Firma de webhook inválida:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { courseIds, studentName, email } = session.metadata || {};

    // TODO: aquí es donde debes otorgar el acceso real al curso.
    // Ejemplo si tuvieras una base de datos real (no localStorage):
    //
    //   const ids = (courseIds || "").split(",").filter(Boolean);
    //   await db.grantAccessByEmail(email, ids);

    console.log("✅ Pago confirmado:", { email, studentName, courseIds });
  }

  res.status(200).json({ received: true });
};
