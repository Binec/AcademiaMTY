/**
 * Servicio API — capa intermedia entre UI y base de datos.
 *
 * Simula llamadas REST con latencia artificial.
 * En producción: reemplazar cada función por `fetch()` a endpoints reales
 * con JWT en header `Authorization: Bearer <token>`.
 *
 * Ejemplo de endpoint real:
 *   POST /api/auth/signup     → createUser
 *   POST /api/auth/login      → authenticateUser + crear JWT
 *   GET  /api/admin/users     → listUsers (requiere rol admin)
 *   POST /api/exam/attempt    → createAttempt
 */

import * as db from "./db";

const LATENCY = 400;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ============================================================
// AUTH
// ============================================================

export async function signUp(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  await delay(LATENCY);
  const res = await db.createUser({ ...data, role: "student" });
  if (!res.ok) return res;
  const token = db.createSession(res.user);
  return { ok: true as const, user: res.user, token };
}

export async function signIn(email: string, password: string) {
  await delay(LATENCY);
  const res = await db.authenticateUser(email, password);
  if (!res.ok) return res;
  const token = db.createSession(res.user);
  return { ok: true as const, user: res.user, token };
}

export function signOut() {
  db.clearSession();
}

export function getSession() {
  const token = db.getSession();
  if (!token) return null;
  const user = db.getUserById(token.userId);
  return user ?? null;
}

// ============================================================
// AUTH GUARDS
// ============================================================

function requireAuth() {
  const user = getSession();
  if (!user) throw new Error("No autenticado");
  return user;
}

function requireAdmin() {
  const user = requireAuth();
  if (user.role !== "admin") throw new Error("Se requieren privilegios de administrador");
  return user;
}

// ============================================================
// EXAM PROGRESS (requiere auth)
// ============================================================

export async function submitExamAttempt(data: {
  level: db.CourseLevel;
  correct: number;
  total: number;
}) {
  const user = requireAuth();
  await delay(200);
  const score = Math.round((data.correct / data.total) * 100);
  const passed = score >= 80;
  const attempt = db.createAttempt({
    userId: user.id,
    level: data.level,
    score,
    correct: data.correct,
    total: data.total,
    passed,
    date: new Date().toISOString(),
  });

  let certificate: db.DbCertificate | null = null;
  if (passed) {
    certificate = db.createCertificate({
      userId: user.id,
      level: data.level,
      score,
      date: new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      certificateId: `AEP-${data.level.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    });
  }

  return { attempt, certificate };
}

export function getMyAttempts() {
  const user = requireAuth();
  return db.listAttempts({ userId: user.id });
}

export function getMyCertificates() {
  const user = requireAuth();
  return db.listCertificates({ userId: user.id });
}

export function hasAccessTo(level: db.CourseLevel): boolean {
  const user = getSession();
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.purchasedCourses.includes(level);
}

export async function purchaseCourse(level: db.CourseLevel) {
  const user = requireAuth();
  await delay(300);
  db.grantAccess(user.id, level);
  return { ok: true as const };
}

// ============================================================
// ADMIN
// ============================================================

export async function adminListUsers(opts: Parameters<typeof db.listUsers>[0] = {}) {
  requireAdmin();
  await delay(200);
  return db.listUsers(opts);
}

export async function adminGetStats() {
  requireAdmin();
  await delay(100);
  return db.getStats();
}

export async function adminGetUserDetail(userId: string) {
  requireAdmin();
  await delay(150);
  const user = db.getUserById(userId);
  if (!user) throw new Error("Usuario no encontrado");
  const attempts = db.listAttempts({ userId });
  const certificates = db.listCertificates({ userId });
  return { user, attempts, certificates };
}

export async function adminUpdateUser(userId: string, patch: Partial<Pick<db.DbUser, "name" | "email" | "phone" | "role">>) {
  requireAdmin();
  await delay(200);
  const updated = db.updateUser(userId, patch);
  if (!updated) throw new Error("Usuario no encontrado");
  return updated;
}

export async function adminDeleteUser(userId: string) {
  requireAdmin();
  await delay(200);
  const ok = db.deleteUser(userId);
  if (!ok) throw new Error("Usuario no encontrado");
  return { ok: true as const };
}
