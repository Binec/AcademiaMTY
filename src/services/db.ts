/**
 * Capa de persistencia (mock de base de datos).
 * 
 * En producción: reemplazar cada función por `fetch()` a un backend Node.js
 * con Express + Prisma/Postgres + JWT + bcrypt real.
 * 
 * Diseño listo para escalar a 100+ usuarios activos:
 * - Estructura relacional (users, attempts, purchases, certificates)
 * - Índices por id y email
 * - Queries filtrables (por rol, estado, nivel)
 * - Preparada para paginación (skip/limit)
 */

import { CourseLevel } from "../data/site";
import * as bcrypt from "bcryptjs";

export type { CourseLevel };

const SALT_ROUNDS = 10;

// ============================================================
// TIPOS
// ============================================================

export type UserRole = "admin" | "student";

export interface DbUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  purchasedCourses: CourseLevel[];
  purchasedAt: Partial<Record<CourseLevel, string>>;
  createdAt: string;
  lastLoginAt?: string;
}

export interface DbAttempt {
  id: string;
  userId: string;
  level: CourseLevel;
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  date: string;
}

export interface DbCertificate {
  id: string;
  userId: string;
  level: CourseLevel;
  score: number;
  date: string;
  certificateId: string;
}

// ============================================================
// KEYS DE STORAGE
// ============================================================

const USERS_KEY = "aep_db_users";
const ATTEMPTS_KEY = "aep_db_attempts";
const CERTIFICATES_KEY = "aep_db_certificates";
const SESSION_KEY = "aep_session";

// ============================================================
// HELPERS
// ============================================================

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================================
// SEED DE ADMIN INICIAL
// ============================================================

export async function ensureSeed(): Promise<void> {
  const users = read<DbUser[]>(USERS_KEY, []);
  const targetAdminEmail = "admin@user.com";
  const adminIdx = users.findIndex((u) => u.email.toLowerCase() === targetAdminEmail);

  // Aseguramos que exista y que su contraseña sea la correcta ('123456') si se actualizó
  const expectedHash = await bcrypt.hash("123456", SALT_ROUNDS);

  if (adminIdx < 0) {
    const mainAdmin: DbUser = {
      id: uid("u"),
      name: "Super Administrador",
      email: targetAdminEmail,
      passwordHash: expectedHash,
      role: "admin",
      purchasedCourses: ["basico", "intermedio", "experto", "primeros-auxilios"],
      purchasedAt: {
        basico: new Date().toISOString(),
        intermedio: new Date().toISOString(),
        experto: new Date().toISOString(),
        "primeros-auxilios": new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };
    users.push(mainAdmin);
    write(USERS_KEY, users);
  } else {
    // Forzamos la actualización del password si ya estaba en el local storage
    const currentAdmin = users[adminIdx];
    const match = await bcrypt.compare("123456", currentAdmin.passwordHash);
    if (!match) {
      currentAdmin.passwordHash = expectedHash;
      users[adminIdx] = currentAdmin;
      write(USERS_KEY, users);
    }
  }

  // Si solo hay 1 usuario (el admin) o menos de 3, creamos estudiantes de prueba realistas
  if (users.length <= 1) {
    const defaultPw = await bcrypt.hash("student123", SALT_ROUNDS);
    const sampleStudents: DbUser[] = [
      {
        id: "u_sample_1",
        name: "Carlos Rivera",
        email: "carlos@gmail.com",
        phone: "55 8192 3841",
        passwordHash: defaultPw,
        role: "student",
        purchasedCourses: ["basico", "primeros-auxilios"],
        purchasedAt: { basico: "2026-01-10T10:00:00.000Z", "primeros-auxilios": "2026-01-12T14:30:00.000Z" },
        createdAt: "2026-01-10T09:30:00.000Z",
      },
      {
        id: "u_sample_2",
        name: "Mariana Gómez",
        email: "mariana@hotmail.com",
        phone: "55 9128 4721",
        passwordHash: defaultPw,
        role: "student",
        purchasedCourses: ["intermedio"],
        purchasedAt: { intermedio: "2026-01-15T11:15:00.000Z" },
        createdAt: "2026-01-15T10:45:00.000Z",
      },
      {
        id: "u_sample_3",
        name: "Fernando Sánchez",
        email: "fer@yahoo.com",
        phone: "55 7182 9381",
        passwordHash: defaultPw,
        role: "student",
        purchasedCourses: ["experto", "primeros-auxilios"],
        purchasedAt: { experto: "2026-02-01T16:00:00.000Z", "primeros-auxilios": "2026-02-02T09:00:00.000Z" },
        createdAt: "2026-02-01T15:20:00.000Z",
      },
      {
        id: "u_sample_4",
        name: "Sofía Hernández",
        email: "sofia@outlook.com",
        phone: "55 6172 8392",
        passwordHash: defaultPw,
        role: "student",
        purchasedCourses: ["basico"],
        purchasedAt: { basico: "2026-02-10T12:00:00.000Z" },
        createdAt: "2026-02-10T11:30:00.000Z",
      },
    ];

    const attempts = read<DbAttempt[]>(ATTEMPTS_KEY, []);
    const certs = read<DbCertificate[]>(CERTIFICATES_KEY, []);

    // Agregamos intentos y certificados para los sample students
    // Carlos aprobó basico y tiene certificado
    attempts.push({
      id: "att_s1_1",
      userId: "u_sample_1",
      level: "basico",
      score: 90,
      correct: 27,
      total: 30,
      passed: true,
      date: "2026-01-14T18:20:00.000Z",
    });
    certs.push({
      id: "cert_s1_1",
      userId: "u_sample_1",
      level: "basico",
      score: 90,
      date: "14 de enero de 2026",
      certificateId: "AEP-BASICO-CR90",
    });

    // Mariana reprobó intermedio una vez, luego aprobó
    attempts.push({
      id: "att_s2_1",
      userId: "u_sample_2",
      level: "intermedio",
      score: 70,
      correct: 21,
      total: 30,
      passed: false,
      date: "2026-01-18T10:00:00.000Z",
    });
    attempts.push({
      id: "att_s2_2",
      userId: "u_sample_2",
      level: "intermedio",
      score: 96,
      correct: 29,
      total: 30,
      passed: true,
      date: "2026-01-20T12:30:00.000Z",
    });
    certs.push({
      id: "cert_s2_1",
      userId: "u_sample_2",
      level: "intermedio",
      score: 96,
      date: "20 de enero de 2026",
      certificateId: "AEP-INTER-MG96",
    });

    sampleStudents.forEach((s) => users.push(s));
    write(USERS_KEY, users);
    write(ATTEMPTS_KEY, attempts);
    write(CERTIFICATES_KEY, certs);
  }
}

// ============================================================
// USERS
// ============================================================

export async function createUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
}): Promise<{ ok: true; user: DbUser } | { ok: false; error: string }> {
  const users = read<DbUser[]>(USERS_KEY, []);
  const emailLower = input.email.trim().toLowerCase();
  if (users.find((u) => u.email.toLowerCase() === emailLower)) {
    return { ok: false, error: "Este correo ya está registrado." };
  }
  if (input.password.length < 6) {
    return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
  }
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user: DbUser = {
    id: uid("u"),
    name: input.name.trim(),
    email: emailLower,
    phone: input.phone?.trim() || undefined,
    passwordHash,
    role: input.role ?? "student",
    purchasedCourses: [],
    purchasedAt: {},
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  write(USERS_KEY, users);
  return { ok: true, user };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ ok: true; user: DbUser } | { ok: false; error: string }> {
  const users = read<DbUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return { ok: false, error: "Correo no registrado." };
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return { ok: false, error: "Contraseña incorrecta." };
  user.lastLoginAt = new Date().toISOString();
  write(USERS_KEY, users);
  return { ok: true, user };
}

export function getUserById(id: string): DbUser | undefined {
  return read<DbUser[]>(USERS_KEY, []).find((u) => u.id === id);
}

export function updateUser(id: string, patch: Partial<DbUser>): DbUser | undefined {
  const users = read<DbUser[]>(USERS_KEY, []);
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return undefined;
  users[idx] = { ...users[idx], ...patch };
  write(USERS_KEY, users);
  return users[idx];
}

export function deleteUser(id: string): boolean {
  let users = read<DbUser[]>(USERS_KEY, []);
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return false;
  users = users.filter((u) => u.id !== id);
  write(USERS_KEY, users);

  // Cascade delete attempts & certificates
  const attempts = read<DbAttempt[]>(ATTEMPTS_KEY, []).filter((a) => a.userId !== id);
  write(ATTEMPTS_KEY, attempts);

  const certs = read<DbCertificate[]>(CERTIFICATES_KEY, []).filter((c) => c.userId !== id);
  write(CERTIFICATES_KEY, certs);
  return true;
}

export function listUsers(opts: { role?: UserRole; search?: string; limit?: number; skip?: number } = {}): {
  total: number;
  users: DbUser[];
} {
  let users = read<DbUser[]>(USERS_KEY, []);
  if (opts.role) users = users.filter((u) => u.role === opts.role);
  if (opts.search) {
    const s = opts.search.toLowerCase();
    users = users.filter(
      (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
    );
  }
  const total = users.length;
  const skip = opts.skip ?? 0;
  const limit = opts.limit ?? 100;
  return { total, users: users.slice(skip, skip + limit) };
}

// ============================================================
// SESSION (simulación de JWT)
// ============================================================

export interface SessionToken {
  userId: string;
  role: UserRole;
  email: string;
  iat: number; // issued at
  exp: number; // expires at (7 días)
}

export function createSession(user: DbUser): SessionToken {
  const now = Date.now();
  const token: SessionToken = {
    userId: user.id,
    role: user.role,
    email: user.email,
    iat: now,
    exp: now + 1000 * 60 * 60 * 24 * 7,
  };
  // En producción: JWT.sign(token, SECRET) con expiración y firma
  localStorage.setItem(SESSION_KEY, JSON.stringify(token));
  return token;
}

export function getSession(): SessionToken | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const token: SessionToken = JSON.parse(raw);
    if (token.exp < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ============================================================
// ATTEMPTS
// ============================================================

export function createAttempt(input: Omit<DbAttempt, "id">): DbAttempt {
  const attempts = read<DbAttempt[]>(ATTEMPTS_KEY, []);
  const attempt: DbAttempt = { id: uid("att"), ...input };
  attempts.push(attempt);
  write(ATTEMPTS_KEY, attempts);
  return attempt;
}

export function listAttempts(opts: { userId?: string; level?: CourseLevel } = {}): DbAttempt[] {
  let attempts = read<DbAttempt[]>(ATTEMPTS_KEY, []);
  if (opts.userId) attempts = attempts.filter((a) => a.userId === opts.userId);
  if (opts.level) attempts = attempts.filter((a) => a.level === opts.level);
  return attempts;
}

// ============================================================
// CERTIFICATES
// ============================================================

export function createCertificate(input: Omit<DbCertificate, "id">): DbCertificate {
  const certs = read<DbCertificate[]>(CERTIFICATES_KEY, []);
  const cert: DbCertificate = { id: uid("cert"), ...input };
  certs.push(cert);
  write(CERTIFICATES_KEY, certs);
  return cert;
}

export function listCertificates(opts: { userId?: string; level?: CourseLevel } = {}): DbCertificate[] {
  let certs = read<DbCertificate[]>(CERTIFICATES_KEY, []);
  if (opts.userId) certs = certs.filter((c) => c.userId === opts.userId);
  if (opts.level) certs = certs.filter((c) => c.level === opts.level);
  return certs;
}

// ============================================================
// PURCHASES (acceso a exámenes)
// ============================================================

export function grantAccess(userId: string, level: CourseLevel): boolean {
  const users = read<DbUser[]>(USERS_KEY, []);
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return false;
  const user = users[idx];
  if (user.purchasedCourses.includes(level)) return false;
  user.purchasedCourses = [...user.purchasedCourses, level];
  user.purchasedAt = { ...user.purchasedAt, [level]: new Date().toISOString() };
  users[idx] = user;
  write(USERS_KEY, users);
  return true;
}

export function revokeAccess(userId: string, level: CourseLevel): boolean {
  const users = read<DbUser[]>(USERS_KEY, []);
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return false;
  const user = users[idx];
  if (!user.purchasedCourses.includes(level)) return false;
  user.purchasedCourses = user.purchasedCourses.filter((l) => l !== level);
  const dates = { ...user.purchasedAt };
  delete dates[level];
  user.purchasedAt = dates;
  users[idx] = user;
  write(USERS_KEY, users);
  return true;
}

// ============================================================
// ESTADÍSTICAS (para admin)
// ============================================================

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalAttempts: number;
  totalPassed: number;
  totalCertificates: number;
  totalRevenue: number;
}

export function getStats(): AdminStats {
  const { users } = listUsers();
  const attempts = read<DbAttempt[]>(ATTEMPTS_KEY, []);
  const certs = read<DbCertificate[]>(CERTIFICATES_KEY, []);

  // Precios desde site
  const prices: Record<CourseLevel, number> = {
    basico: 1499,
    intermedio: 2299,
    experto: 3499,
    "primeros-auxilios": 799,
  };

  let revenue = 0;
  users.forEach((u) => {
    u.purchasedCourses.forEach((lvl) => {
      revenue += prices[lvl] ?? 0;
    });
  });

  return {
    totalUsers: users.length,
    totalStudents: users.filter((u) => u.role === "student").length,
    totalAttempts: attempts.length,
    totalPassed: attempts.filter((a) => a.passed).length,
    totalCertificates: certs.length,
    totalRevenue: revenue,
  };
}
