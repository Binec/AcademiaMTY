import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminGetStats,
  adminGetUserDetail,
  adminListUsers,
  adminUpdateUser,
  adminDeleteUser,
} from "../services/api";
import { AdminStats, DbAttempt, DbCertificate, DbUser } from "../services/db";
import { CourseLevel, courses } from "../data/site";
import { downloadCertificate } from "../utils/certificate";

const priceMap: Record<CourseLevel, number> = {
  basico: 1499,
  intermedio: 2299,
  experto: 3499,
  "primeros-auxilios": 799,
};

type Tab = "overview" | "students" | "admins";

export default function Admin() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Estado global
  const [tab, setTab] = useState<Tab>("students");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [search, setSearch] = useState("");

  // Estado del drawer
  const [selectedUser, setSelectedUser] = useState<DbUser | null>(null);
  const [userAttempts, setUserAttempts] = useState<DbAttempt[]>([]);
  const [userCerts, setUserCerts] = useState<DbCertificate[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Estado de edición
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [editSaving, setEditSaving] = useState(false);

  // Estado de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Carga datos
  const loadStats = useCallback(() => {
    adminGetStats().then(setStats).catch(console.error);
  }, []);

  const loadUsers = useCallback(() => {
    adminListUsers({ search }).then((r) => {
      setUsers(r.users);
    });
  }, [search]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadUsers(); }, [loadUsers]);

  // Drawer: cargar detalle de usuario
  useEffect(() => {
    if (!userId) {
      setSelectedUser(null);
      setUserAttempts([]);
      setUserCerts([]);
      setEditMode(false);
      setShowDeleteConfirm(false);
      return;
    }
    setLoadingDetail(true);
    adminGetUserDetail(userId)
      .then(({ user, attempts, certificates }) => {
        setSelectedUser(user);
        setUserAttempts(attempts);
        setUserCerts(certificates);
        setEditForm({ name: user.name, email: user.email, phone: user.phone || "" });
      })
      .catch(() => setSelectedUser(null))
      .finally(() => setLoadingDetail(false));
  }, [userId]);

  const closeDetail = () => {
    navigate("/admin");
    setEditMode(false);
    setShowDeleteConfirm(false);
  };

  const openUser = (id: string) => navigate(`/admin/${id}`);

  // GUARDAR EDICIÓN
  const saveEdit = async () => {
    if (!selectedUser) return;
    setEditSaving(true);
    try {
      await adminUpdateUser(selectedUser.id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || undefined,
      });
      const fresh = await adminGetUserDetail(selectedUser.id);
      setSelectedUser(fresh.user);
      setEditMode(false);
      loadUsers();
      loadStats();
    } catch (e: any) {
      alert(e.message || "Error al guardar");
    } finally {
      setEditSaving(false);
    }
  };

  // CAMBIAR ROL
  const toggleRole = async () => {
    if (!selectedUser) return;
    const newRole = selectedUser.role === "admin" ? "student" : "admin";
    try {
      await adminUpdateUser(selectedUser.id, { role: newRole });
      const fresh = await adminGetUserDetail(selectedUser.id);
      setSelectedUser(fresh.user);
      loadUsers();
      loadStats();
    } catch (e: any) {
      alert(e.message || "Error al cambiar rol");
    }
  };

  // ELIMINAR USUARIO
  const confirmDelete = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    try {
      await adminDeleteUser(selectedUser.id);
      closeDetail();
      loadUsers();
      loadStats();
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  };

  // Total pagado por usuario
  const userTotalPaid = (u: DbUser) =>
    u.purchasedCourses.reduce((sum, lvl) => sum + (priceMap[lvl] || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-primary text-white py-10">
        <div className="container-x max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow mb-2 text-white/70">Panel administrativo</div>
              <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setTab("overview"); navigate("/admin"); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === "overview" ? "bg-white text-primary" : "text-white/80 hover:bg-white/10"}`}
              >
                Resumen
              </button>
              <button
                onClick={() => { setTab("students"); navigate("/admin"); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === "students" ? "bg-white text-primary" : "text-white/80 hover:bg-white/10"}`}
              >
                Alumnos
              </button>
              <button
                onClick={() => { setTab("admins"); navigate("/admin"); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === "admins" ? "bg-white text-primary" : "text-white/80 hover:bg-white/10"}`}
              >
                Admins
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x max-w-7xl py-10">
        {/* STATS */}
        {tab === "overview" && stats && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard label="Usuarios" value={stats.totalUsers} accent="primary" />
              <StatCard label="Alumnos" value={stats.totalStudents} accent="secondary" />
              <StatCard label="Intentos" value={stats.totalAttempts} />
              <StatCard label="Aprobados" value={stats.totalPassed} accent="emerald" />
              <StatCard label="Certificados" value={stats.totalCertificates} accent="emerald" />
              <StatCard label="Ingresos" value={`$${stats.totalRevenue.toLocaleString()}`} accent="amber" small />
            </div>

            {/* Últimos usuarios registrados */}
            <div>
              <h2 className="text-lg font-bold mb-4">Últimos usuarios</h2>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-muted text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold">Usuario</th>
                      <th className="text-left px-5 py-3 font-semibold">Rol</th>
                      <th className="text-left px-5 py-3 font-semibold">Cursos</th>
                      <th className="text-left px-5 py-3 font-semibold">Pagado</th>
                      <th className="text-left px-5 py-3 font-semibold">Registro</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.slice(0, 10).map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-3">
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-xs text-muted">{u.email}</div>
                        </td>
                        <td className="px-5 py-3">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-5 py-3">
                          <CourseBadges courses={u.purchasedCourses} />
                        </td>
                        <td className="px-5 py-3 font-semibold text-sm">${userTotalPaid(u).toLocaleString()}</td>
                        <td className="px-5 py-3 text-xs text-muted">
                          {new Date(u.createdAt).toLocaleDateString("es-MX")}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => openUser(u.id)} className="text-xs font-semibold text-primary hover:underline">
                            Ver →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ALUMNOS */}
        {tab === "students" && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Buscar alumno</label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nombre o correo"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="md:w-40">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Resultados</label>
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-sm font-semibold text-ink-soft">
                  {users.filter((u) => u.role === "student").length} alumnos
                </div>
              </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-muted text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold">Usuario</th>
                      <th className="text-left px-5 py-3 font-semibold">Cursos</th>
                      <th className="text-left px-5 py-3 font-semibold">Total pagado</th>
                      <th className="text-left px-5 py-3 font-semibold">Registro</th>
                      <th className="text-left px-5 py-3 font-semibold">Último acceso</th>
                      <th className="px-5 py-3 text-right">
                        <span className="text-xs font-semibold uppercase tracking-wider">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.filter((u) => u.role === "student").length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-muted">
                          No se encontraron alumnos.
                        </td>
                      </tr>
                    )}
                    {users.filter((u) => u.role === "student").map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold">{u.name}</div>
                              <div className="text-xs text-muted">{u.email}</div>
                              {u.phone && <div className="text-xs text-muted">{u.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <CourseBadges courses={u.purchasedCourses} />
                        </td>
                        <td className="px-5 py-3 font-semibold text-sm">
                          ${userTotalPaid(u).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-xs text-muted">
                          {new Date(u.createdAt).toLocaleDateString("es-MX")}
                        </td>
                        <td className="px-5 py-3 text-xs text-muted">
                          {u.lastLoginAt
                            ? new Date(u.lastLoginAt).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })
                            : "—"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openUser(u.id)}
                              className="text-xs font-semibold text-primary hover:underline"
                            >
                              Ver
                            </button>
                            <span className="text-slate-200">|</span>
                            <button
                              onClick={() => openUser(u.id)}
                              className="text-xs font-semibold text-ink-soft hover:text-primary"
                            >
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADMINS */}
        {tab === "admins" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Buscar</label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nombre o correo"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="md:w-40">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Resultados</label>
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-sm font-semibold text-ink-soft">
                  {users.filter((u) => u.role === "admin").length} admins
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-muted text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold">Usuario</th>
                      <th className="text-left px-5 py-3 font-semibold">Correo</th>
                      <th className="text-left px-5 py-3 font-semibold">Registro</th>
                      <th className="text-left px-5 py-3 font-semibold">Último acceso</th>
                      <th className="px-5 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.filter((u) => u.role === "admin").length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-muted">
                          No se encontraron administradores.
                        </td>
                      </tr>
                    )}
                    {users.filter((u) => u.role === "admin").map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="font-semibold">{u.name}</div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm">{u.email}</td>
                        <td className="px-5 py-3 text-xs text-muted">
                          {new Date(u.createdAt).toLocaleDateString("es-MX")}
                        </td>
                        <td className="px-5 py-3 text-xs text-muted">
                          {u.lastLoginAt
                            ? new Date(u.lastLoginAt).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })
                            : "—"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => openUser(u.id)}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            Ver detalle →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======== DRAWER DETALLE / EDICIÓN ======== */}
      {userId && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={closeDetail}>
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del drawer */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-bold text-lg">
                {editMode ? "Editar usuario" : "Detalle del usuario"}
              </h2>
              <div className="flex items-center gap-3">
                {!editMode && selectedUser && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                )}
                <button onClick={closeDetail} className="text-muted hover:text-ink transition-colors">
                  ✕
                </button>
              </div>
            </div>

            {loadingDetail && (
              <div className="p-6 text-center text-muted text-sm">Cargando…</div>
            )}
            {!loadingDetail && !selectedUser && (
              <div className="p-6 text-center text-muted text-sm">Usuario no encontrado</div>
            )}

            {/* ====== VISTA DETALLE ====== */}
            {!loadingDetail && selectedUser && !editMode && (
              <div className="p-6 space-y-6">
                {/* Avatar + info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shrink-0">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <div className="text-sm text-muted">{selectedUser.email}</div>
                    {selectedUser.phone && <div className="text-sm text-muted">{selectedUser.phone}</div>}
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <RoleBadge role={selectedUser.role} />
                      <span className="text-muted">ID: {selectedUser.id}</span>
                    </div>
                  </div>
                </div>

                {/* Resumen de pago */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Total pagado</span>
                    <span className="text-xl font-bold text-primary">${userTotalPaid(selectedUser).toLocaleString()} MXN</span>
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    Registro: {new Date(selectedUser.createdAt).toLocaleDateString("es-MX", { dateStyle: "long" })}
                    {selectedUser.lastLoginAt && (
                      <> · Último acceso: {new Date(selectedUser.lastLoginAt).toLocaleDateString("es-MX")}</>
                    )}
                  </div>
                </div>

                {/* Cursos adquiridos */}
                <Section title="Cursos adquiridos" count={selectedUser.purchasedCourses.length}>
                  {selectedUser.purchasedCourses.length === 0 ? (
                    <Empty text="Sin cursos comprados" />
                  ) : (
                    <div className="space-y-2">
                      {selectedUser.purchasedCourses.map((lvl) => {
                        const c = courses.find((co) => co.id === lvl);
                        return (
                          <div key={lvl} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                            <div>
                              <div className="font-semibold text-sm">{c?.title ?? lvl}</div>
                              <div className="text-xs text-emerald-600 mt-0.5">
                                Comprado: {selectedUser.purchasedAt[lvl]
                                  ? new Date(selectedUser.purchasedAt[lvl]!).toLocaleDateString("es-MX", { dateStyle: "long" })
                                  : "—"}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-emerald-700">${priceMap[lvl]?.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Section>

                {/* Intentos de examen */}
                <Section title="Intentos de examen" count={userAttempts.length}>
                  {userAttempts.length === 0 ? (
                    <Empty text="Sin intentos registrados" />
                  ) : (
                    <div className="space-y-2">
                      {userAttempts.slice().reverse().map((a) => (
                        <div key={a.id} className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3">
                          <div>
                            <div className="font-semibold text-sm capitalize">{a.level}</div>
                            <div className="text-xs text-muted mt-0.5">
                              {a.correct}/{a.total} correctas ·{" "}
                              {new Date(a.date).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{a.score}%</div>
                            <div className={`text-xs font-semibold ${a.passed ? "text-emerald-700" : "text-red-600"}`}>
                              {a.passed ? "APROBADO" : "REPROBADO"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>

                {/* Certificados */}
                <Section title="Certificados emitidos" count={userCerts.length}>
                  {userCerts.length === 0 ? (
                    <Empty text="Sin certificados" />
                  ) : (
                    <div className="space-y-2">
                      {userCerts.map((c) => (
                        <div key={c.id} className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm capitalize">{c.level}</div>
                            <div className="text-xs text-muted mt-0.5">
                              {c.date} · Calificación: <span className="font-semibold text-primary">{c.score}%</span>
                            </div>
                            <div className="text-[10px] font-mono text-muted mt-1">Folio: {c.certificateId}</div>
                          </div>
                          <button
                            onClick={() => downloadCertificate({
                              studentName: selectedUser?.name || "Alumno",
                              email: selectedUser?.email || "",
                              level: c.level, score: c.score, date: c.date, certificateId: c.certificateId,
                            })}
                            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark px-3 py-1.5 rounded border border-primary/20 hover:bg-primary/10 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>

                {/* Acciones peligrosas */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <button
                    onClick={toggleRole}
                    className="w-full text-center px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-ink-soft hover:border-primary hover:text-primary transition-colors"
                  >
                    {selectedUser.role === "admin" ? "Degradar a Alumno" : "Ascender a Admin"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full text-center px-4 py-2.5 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Eliminar usuario
                  </button>
                </div>
              </div>
            )}

            {/* ====== VISTA EDICIÓN ====== */}
            {!loadingDetail && selectedUser && editMode && (
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shrink-0">
                    {editForm.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted mb-3">Editando: {selectedUser.email}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Field label="Nombre completo">
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </Field>
                  <Field label="Correo electrónico">
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </Field>
                  <Field label="Teléfono">
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      placeholder="Opcional"
                    />
                  </Field>
                  <Field label="Rol actual">
                    <div className="flex items-center gap-3">
                      <RoleBadge role={selectedUser.role} />
                      <button
                        onClick={toggleRole}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Cambiar a {selectedUser.role === "admin" ? "Alumno" : "Admin"}
                      </button>
                    </div>
                  </Field>
                  <Field label="ID del usuario">
                    <div className="text-xs font-mono text-muted bg-slate-50 rounded-lg border border-slate-200 px-4 py-2.5">
                      {selectedUser.id}
                    </div>
                  </Field>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-ink-soft hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={editSaving || !editForm.name.trim() || !editForm.email.trim()}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {editSaving ? "Guardando…" : "Guardar cambios"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ====== MODAL CONFIRMACIÓN ELIMINAR ====== */}
          {showDeleteConfirm && selectedUser && (
            <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto">
                  ⚠
                </div>
                <h3 className="mt-4 text-xl font-bold text-center">Eliminar usuario</h3>
                <p className="mt-3 text-sm text-muted text-center leading-relaxed">
                  ¿Estás seguro de eliminar a <strong className="text-ink">{selectedUser.name}</strong> ({selectedUser.email})?
                  <br />
                  <span className="text-red-600 font-semibold">Esta acción no se puede deshacer.</span>
                  <br />
                  Se eliminarán todos sus intentos de examen y certificados.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-ink-soft hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {deleting ? "Eliminando…" : "Sí, eliminar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========================
// COMPONENTES AUXILIARES
// ========================

function StatCard({ label, value, accent, small }: {
  label: string;
  value: string | number;
  accent?: "primary" | "secondary" | "emerald" | "amber";
  small?: boolean;
}) {
  const c =
    accent === "emerald" ? "text-emerald-600"
    : accent === "amber" ? "text-amber-600"
    : accent === "primary" ? "text-primary"
    : accent === "secondary" ? "text-secondary"
    : "text-ink";
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-xs uppercase tracking-wider text-muted font-semibold">{label}</div>
      <div className={`mt-1 ${small ? "text-lg" : "text-2xl"} font-bold ${c}`}>{value}</div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
      role === "admin" ? "bg-primary/10 text-primary" : "bg-slate-100 text-ink-soft"
    }`}>
      {role === "admin" ? "Admin" : "Alumno"}
    </span>
  );
}

function CourseBadges({ courses: list }: { courses: CourseLevel[] }) {
  if (list.length === 0) return <span className="text-xs text-muted">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {list.map((lvl) => (
        <span key={lvl} className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
          {lvl}
        </span>
      ))}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-2">{title} <span className="text-muted font-normal">({count})</span></h4>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-sm text-muted py-2">{text}</div>;
}
