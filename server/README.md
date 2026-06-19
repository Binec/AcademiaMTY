# Backend de AutoEscuela Pro (Referencia)

Este directorio contiene el código **de referencia** para desplegar en producción un backend Node.js con:

- ✉️ **Nodemailer** — Envío de correos SMTP con PDF adjunto (formulario de contacto + certificados).
- 📄 **PDFKit** — Generación server-side de certificados PDF con plantilla.
- 💳 **Stripe / Mercado Pago / PayPal** — Checkout seguro con PaymentIntents / Preferences.
- 🔐 **SSL / HTTPS** — Configuración con Let's Encrypt.
- 📮 **5 correos corporativos** — Reenvío / recepción con dominio propio.

## Estructura sugerida

```
server/
├── src/
│   ├── index.js              # Express server + HTTPS
│   ├── config.js             # Variables de entorno
│   ├── controllers/
│   │   ├── contact.js        # POST /api/contact
│   │   ├── certificate.js    # POST /api/send-certificate
│   │   └── checkout.js       # POST /api/create-checkout-session
│   ├── services/
│   │   ├── email.js          # Nodemailer transport
│   │   ├── pdf.js            # PDFKit plantilla certificado
│   │   └── payments.js       # Stripe / MercadoPago SDK
│   └── routes.js
├── templates/
│   └── certificate.pdfkit.js
├── .env.example
└── package.json
```

## Variables de entorno (`.env`)

```env
# HTTPS / SSL
SSL_CERT=/etc/letsencrypt/live/autoescuelapro.com/fullchain.pem
SSL_KEY=/etc/letsencrypt/live/autoescuelapro.com/privkey.pem

# SMTP (Gmail / SendGrid / Mailgun / propio)
SMTP_HOST=smtp.autoescuelapro.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contacto@autoescuelapro.com
SMTP_PASS=tu-contraseña-de-aplicacion

# Correos corporativos destino
EMAIL_CONTACTO=contacto@autoescuelapro.com
EMAIL_VENTAS=ventas@autoescuelapro.com
EMAIL_SOPORTE=soporte@autoescuelapro.com
EMAIL_CURSOS=cursos@autoescuelapro.com
EMAIL_CERT=certificaciones@autoescuelapro.com

# Pasarelas de pago
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
MERCADO_PAGO_ACCESS_TOKEN=TEST-xxx-xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx

# Dominio
PUBLIC_URL=https://autoescuelapro.com
```

## Ejemplo rápido: enviar certificado por correo (Node.js)

```js
// src/services/email.js
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function enviarCertificado({ studentName, email, level, score, pdfBuffer }) {
  return transport.sendMail({
    from: `"AutoEscuela Pro" <${process.env.SMTP_USER}>`,
    to: [email, process.env.EMAIL_CERT],   // copia a certificaciones
    subject: `Tu certificado ${level.toUpperCase()} está listo, ${studentName}!`,
    html: `
      <h1>¡Felicidades, ${studentName}!</h1>
      <p>Has aprobado el examen ${level.toUpperCase()} con un <strong>${score}%</strong>.</p>
      <p>Adjunto encontrarás tu certificado oficial en PDF.</p>
      <p>— Equipo AutoEscuela Pro</p>
    `,
    attachments: [
      {
        filename: `certificado_${level}_${studentName}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
```

## Ejemplo: generar PDF con PDFKit (server-side)

```js
// src/services/pdf.js
const PDFDocument = require("pdfkit");

function generarCertificado({ studentName, level, score, date, certificateId }) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 40 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    // Fondo azul
    doc.rectangle(0, 0, doc.page.width, doc.page.height).fill("#083a66");
    doc.rectangle(20, 20, doc.page.width - 40, doc.page.height - 40).fill("#ffffff");

    doc.font("Helvetica-Bold").fontSize(28).fillColor("#0b4f8a")
       .text("AUTOESCUELA PRO", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(14).fillColor("#475569").text("CERTIFICADO DE APROBACIÓN", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(34).fillColor("#0f172a").text(studentName.toUpperCase(), { align: "center" });
    doc.moveDown(1);
    doc.fontSize(12).fillColor("#475569")
       .text(`Nivel: ${level.toUpperCase()}  ·  Calificación: ${score}%`, { align: "center" })
       .text(`Fecha: ${date}  ·  Folio: ${certificateId}`, { align: "center" });

    doc.end();
  });
}
```

## Ejemplo: Stripe Checkout Session

```js
// src/controllers/checkout.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/api/create-checkout-session", async (req, res) => {
  const { courseId, courseName, price, studentName, email } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [{
      price_data: {
        currency: "mxn",
        product_data: { name: courseName },
        unit_amount: price * 100,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${process.env.PUBLIC_URL}/gracias/${courseId}?name=${encodeURIComponent(studentName)}&email=${encodeURIComponent(email)}`,
    cancel_url: `${process.env.PUBLIC_URL}/checkout/${courseId}`,
    metadata: { courseId, studentName, email },
  });
  res.json({ url: session.url, id: session.id });
});
```

## Despliegue HTTPS con Let's Encrypt

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d autoescuelapro.com -d www.autoescuelapro.com

# Renovación automática
sudo certbot renew --dry-run
```

## Correos corporativos (5 cuentas)

Configura en tu proveedor de dominio (cPanel / Plesk / Google Workspace / Zoho):

1. `contacto@autoescuelapro.com`
2. `ventas@autoescuelapro.com`
3. `soporte@autoescuelapro.com`
4. `cursos@autoescuelapro.com`
5. `certificaciones@autoescuelapro.com`

Crea registros **MX**, **SPF** (`v=spf1 include:_spf.google.com ~all`), **DKIM** y **DMARC** para evitar spam.

---

## Integración con el frontend (React)

El formulario de `src/pages/Contacto.tsx` y el módulo de certificados en `src/utils/certificate.ts` ya incluyen comentarios con los `fetch()` a estos endpoints. Solo reemplaza las URLs y descomenta el código.
