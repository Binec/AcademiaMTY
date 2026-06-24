/**
 * Servicio de pagos — capa entre el Checkout y los endpoints reales (/api/*).
 *
 * Cada gateway tiene su propia función. Todas reciben los mismos datos
 * (cart, name, email) y regresan { url } a donde redirigir al alumno.
 * Esto hace trivial agregar PayPal / Mercado Pago más adelante: solo se
 * agrega una función más con la misma forma.
 */

import type { CourseLevel } from "../data/site";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

type CheckoutPayload = {
  cart: CourseLevel[];
  name: string;
  email: string;
};

async function postJSON(path: string, payload: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al procesar el pago");
  return data as { url: string; id: string };
}

export async function createStripeSession(payload: CheckoutPayload) {
  return postJSON("/api/create-checkout-session", payload);
}

// Cuando agregues Mercado Pago / PayPal, solo crea funciones análogas:
//
// export async function createMercadoPagoPreference(payload: CheckoutPayload) {
//   return postJSON("/api/create-mercadopago-preference", payload);
// }