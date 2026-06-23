import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminGetStats,
  adminGetUserDetail,
  adminListUsers,
  adminUpdateUser,
  adminDeleteUser,
  adminGrantCourse,
  adminRevokeCourse,
  adminCreateStudent,
} from "../services/api";
import { AdminStats, DbAttempt, DbCertificate, DbUser } from "../services/db";
import { CourseLevel } from "../data/site";
import { downloadCertificate } from "../utils/certificate";

const priceMap: Record<CourseLevel, number> = {
  basico: 1499,
  intermedio: 2299,
  experto: 3499,
  "primeros-auxilios": 799,
};

export default function Admin() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "admin" | "student">("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Drawer / Detail state
  const [selectedUser, setSelectedUser] = useState<DbUser | null>(null);
  const [userAttempts, setUserAttempts] = useState<DbAttempt[]>([]);
  const [userCerts, setUserCerts] = useState<DbCertificate[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Modals state
  const [creating, setCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<DbUser | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState({ name: "", email: "", phone: "", password: "student123" });
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", role: "student" as "admin" | "student" });

  const refreshData = () => setRefreshCounter((c) => c + 1);

  // Load Main List & Stats
  useEffect(() => {
    adminGetStats().then(setStats).catch(console.error);
    adminListUsers({ search: search.trim(), role: roleFilter || undefined })
      .then((r) => {
        setUsers(r.users);
        setTotal(r.total);
      })
      .catch(console.error);
  }, [search, roleFilter, refreshCounter]);

  // Load User Detail if userId in URL
  useEffect(() => {
    if (!userId) {
      setSelectedUser(null);
      setUserAttempts([]);
      setUserCerts([]);
      return;
    }
    setLoadingDetail(true);
    adminGetUserDetail(userId)
      .then(({ user, attempts, certificates }) => {
        setSelectedUser(user);
        setUserAttempts(attempts);
        setUserCerts(certificates);
      })
      .catch((e) => {
        console.error(e);
        setSelectedUser(null);
      })
      .finally(() => setLoadingDetail(false));
  }, [userId, refreshCounter]);

  const selectUser = (id: string) => navigate(`/admin/${id}`);
  const closeDetail = () => navigate("/admin");

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email) return;
    try {
      const res = await adminCreateStudent(createForm);
      if (!res.ok) {
        alert(res.error || "Error al crear estudiante");
        return;
      }
      setCreateForm({ name: "", email: "", phone: "", password: "student123" });
      setCreating(false);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Error al crear");
    }
  };

  const startEdit = (u: DbUser) => {
    setEditingUser(u);
    setEditForm({ name: u.name, email: u.email, phone: u.phone || "", role: u.role });
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await adminUpdateUser(editingUser.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        phone: editForm.phone.trim() || undefined,
        role: editForm.role,
      });
      setEditingUser(null);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Error al actualizar");
    }
  };

  const handleDeleteUser = async (u: DbUser) => {
    if (u.email.toLowerCase() === "admin@user.com") {
      alert("No puedes eliminar al Super Administrador principal (admin@user.com).");
      return;
    }
    if (!confirm(`¿Eliminar definitivamente al usuario ${u.name} (${u.email})?\nSe borrarán también todos sus intentos de examen y certificados.`)) return;
    try {
      await adminDeleteUser(u.id);
      if (selectedUser?.id === u.id) closeDetail();
      refreshData();
    } catch (err: any) {
      alert(err.message || "Error al eliminar");
    }
  };

  const handleGrantCourse = async (lvl: CourseLevel) => {
    if (!selectedUser) return;
    try {
      await adminGrantCourse(selectedUser.id, lvl);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Error al habilitar curso");
    }
  };

  const handleRevokeCourse = async (lvl: CourseLevel) => {
    if (!selectedUser) return;
    if (!confirm(`¿Revocar acceso a ${lvl} para ${selectedUser.name}?`)) return;
    try {
      await adminRevokeCourse(selectedUser.id, lvl);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Error al revocar curso");
    }
  };

  const totalRevenue = users.reduce((sum, u) => sum + u.purchasedCourses.reduce((s, l) => s + (priceMap[l] || 0), 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <section className="bg-primary text-white py-10">
        <div className="container-x max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-white/70 text-xs font-semibold uppercase tracking-[0.2em] mb-2">Panel Administrativo Global</div>
            <h1 className="text-3xl md:text-4xl font-bold">Administración de Estudiantes y Usuarios</h1>
            <p className="mt-2 text-white/75 text-sm">Supervisa alumnos, edita perfiles, gestiona pagos/cursos y descarga certificados oficiales.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setCreating(true)} className="btn-secondary !bg-white !text-primary hover:!bg-slate-100 gap-2 shadow-lg">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              + Nuevo Alumno
            </button>
            <button onClick={refreshData} className="border border-white/40 text-white hover:bg-white/10 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              🔄 Actualizar
            </button>
          </div>
        </div>
      </section>

      <div className="container-x max-w-7xl py-10">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            <StatCard label="Usuarios Totales" value={stats.totalUsers} accent="primary" />
            <StatCard label="Alumnos Registrados" value={stats.totalStudents} accent="secondary" />
            <StatCard label="Exámenes Realizados" value={stats.totalAttempts} />
            <StatCard label="Exámenes Aprobados" value={stats.totalPassed} accent="emerald" />
            <StatCard label="Certificados Emitidos" value={stats.totalCertificates} accent="emerald" />
            <StatCard label="Ingresos Estimados" value={`$${totalRevenue.toLocaleString()}`} accent="amber" small />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar alumno por nombre, correo o teléfono..."
                className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium focus:border-primary focus:outline-none bg-white cursor-pointer"
            >
              <option value="">Todos los roles</option>
              <option value="student">👨‍🎓 Solo Alumnos</option>
              <option value="admin">⚙️ Solo Administradores</option>
            </select>
          </div>
          <div className="text-xs text-muted font-medium">Mostrando <strong className="text-ink">{total}</strong> registros</div>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-muted text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Usuario / Alumno</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Cursos Habilitados</th>
                  <th className="px-6 py-4">Pagos (Est.)</th>
                  <th className="px-6 py-4">Registro</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted text-base">No se encontraron alumnos registrados.</td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const rev = u.purchasedCourses.reduce((sum, lvl) => sum + (priceMap[lvl] || 0), 0);
                    return (
                      <tr key={u.id} className="hover:bg-primary/[0.03] transition-colors">
                        <td className="px-6 py-4 min-w-[220px]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-ink">{u.name}</div>
                              <div className="text-xs text-muted mt-0.5">{u.email}</div>
                              {u.phone && <div className="text-xs text-slate-400 mt-0.5">📞 {u.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 ${
                            u.role === "admin" ? "bg-primary/10 text-primary" : "bg-slate-100 text-ink-soft"
                          }`}>
                            {u.role === "admin" ? "⚙️ Admin" : "👨‍🎓 Alumno"}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="flex flex-wrap gap-1.5">
                            {u.purchasedCourses.length === 0 && <span className="text-xs text-slate-300 italic">Sin cursos</span>}
                            {u.purchasedCourses.map((lvl) => (
                              <span key={lvl} className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-md uppercase">
                                {lvl.replace("-", " ")}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-bold ${rev > 0 ? "text-emerald-600" : "text-slate-400"}`}>${rev.toLocaleString()} MXN</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => selectUser(u.id)} className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 text-ink-soft hover:bg-primary hover:text-white transition-colors">
                              📂 Ver
                            </button>
                            <button onClick={() => startEdit(u)} className="w-8 h-8 rounded-lg font-semibold text-xs bg-slate-100 text-ink-soft hover:bg-amber-50 hover:text-amber-700 transition-colors flex items-center justify-center" title="Editar">
                              ✏️
                            </button>
                            <button onClick={() => handleDeleteUser(u)} className="w-8 h-8 rounded-lg font-semibold text-xs bg-slate-100 text-ink-soft hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center" title="Eliminar">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer detail */}
      {userId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end" onClick={closeDetail}>
          <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-primary text-white px-6 py-5 flex items-center justify-between shadow-md">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-white/70">Expediente Oficial</span>
                <h2 className="font-bold text-xl mt-0.5">{selectedUser ? selectedUser.name : "Detalle del Alumno"}</h2>
              </div>
              <button onClick={closeDetail} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">✕</button>
            </div>

            {loadingDetail ? (
              <div className="flex-1 grid place-items-center p-12 text-muted text-sm">Cargando expediente…</div>
            ) : !selectedUser ? (
              <div className="flex-1 grid place-items-center p-12 text-muted text-sm">No se pudo cargar la información.</div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Info General */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold truncate text-ink">{selectedUser.name}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${selectedUser.role === "admin" ? "bg-primary/10 text-primary" : "bg-slate-200 text-ink-soft"}`}>
                        {selectedUser.role === "admin" ? "⚙️ Administrador" : "👨‍🎓 Alumno"}
                      </span>
                    </div>
                    <div className="text-sm text-muted mt-1">📧 {selectedUser.email}</div>
                    {selectedUser.phone && <div className="text-sm text-muted mt-0.5">📞 {selectedUser.phone}</div>}
                    <div className="mt-3 pt-3 border-t border-slate-200/80 flex justify-between items-center text-xs text-slate-400">
                      <span>ID: {selectedUser.id}</span>
                      <span>Registrado: {new Date(selectedUser.createdAt).toLocaleDateString("es-MX")}</span>
                    </div>
                  </div>
                </div>

                {/* Payments / Courses */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-ink">Cursos y Pagos del Alumno</h4>
                    <span className="text-xs text-muted">Click para habilitar o revocar</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {([
                      { id: "basico", title: "Curso Básico", price: priceMap.basico },
                      { id: "intermedio", title: "Curso Intermedio", price: priceMap.intermedio },
                      { id: "experto", title: "Curso Experto", price: priceMap.experto },
                      { id: "primeros-auxilios", title: "Primeros Auxilios", price: priceMap["primeros-auxilios"] },
                    ] as const).map((course) => {
                      const active = selectedUser.purchasedCourses.includes(course.id as any);
                      return (
                        <div key={course.id} className={`rounded-xl border p-4 flex flex-col justify-between ${active ? "bg-emerald-50/70 border-emerald-300" : "bg-white border-slate-200"}`}>
                          <div>
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="uppercase text-secondary">{course.id.replace("-", " ")}</span>
                              <span className={active ? "text-emerald-700 font-bold" : "text-muted"}>${course.price.toLocaleString()} MXN</span>
                            </div>
                            <div className="font-bold text-sm mt-1 text-ink">{course.title}</div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className={`text-xs font-semibold ${active ? "text-emerald-700" : "text-slate-400"}`}>{active ? "✅ Habilitado (Pagado)" : "❌ No pagado"}</span>
                            <button
                              type="button"
                              onClick={() => (active ? handleRevokeCourse(course.id as any) : handleGrantCourse(course.id as any))}
                              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${active ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" : "bg-primary text-white hover:bg-primary-dark"}`}
                            >
                              {active ? "Revocar" : "Habilitar"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Attempts */}
                <div>
                  <h4 className="font-bold text-lg text-ink mb-3">Intentos de Examen ({userAttempts.length})</h4>
                  {userAttempts.length === 0 ? (
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center text-muted text-sm italic">Este alumno aún no ha realizado exámenes.</div>
                  ) : (
                    <div className="space-y-2.5">
                      {userAttempts.slice().reverse().map((att) => (
                        <div key={att.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4">
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${att.passed ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                              {att.passed ? "Aprobado 🏆" : "Reprobado 📉"}
                            </span>
                            <div className="font-bold text-base mt-1 capitalize text-ink">Examen {att.level.replace("-", " ")}</div>
                            <div className="text-xs text-muted mt-0.5">{new Date(att.date).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" })}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-black ${att.passed ? "text-emerald-600" : "text-red-600"}`}>{att.score}%</div>
                            <div className="text-xs text-muted">{att.correct} / {att.total} aciertos</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certificates */}
                <div>
                  <h4 className="font-bold text-lg text-ink mb-3">Certificados Oficiales ({userCerts.length})</h4>
                  {userCerts.length === 0 ? (
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center text-muted text-sm italic">No se han emitido certificados.</div>
                  ) : (
                    <div className="space-y-3">
                      {userCerts.map((cert) => (
                        <div key={cert.id} className="bg-primary/5 rounded-xl border border-primary/20 p-5 flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-primary uppercase tracking-wider">CERTIFICADO OFICIAL</span>
                              <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md">Folio: {cert.certificateId}</span>
                            </div>
                            <h5 className="text-lg font-bold mt-1 text-ink capitalize">{cert.level === "primeros-auxilios" ? "Curso de Primeros Auxilios" : `Curso ${cert.level}`}</h5>
                            <div className="text-xs text-muted mt-1">Emitido el {cert.date} · Calificación: <strong className="text-primary font-bold">{cert.score}%</strong></div>
                          </div>
                          <button
                            type="button"
                            onClick={() => downloadCertificate({
                              studentName: selectedUser.name,
                              email: selectedUser.email,
                              level: cert.level as any,
                              score: cert.score,
                              date: cert.date,
                              certificateId: cert.certificateId,
                            })}
                            className="btn-primary !py-2.5 !px-4 gap-1.5 shrink-0 text-xs"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Descargar PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedUser && (
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <button type="button" onClick={() => startEdit(selectedUser)} className="btn-ghost !py-2">✏️ Editar Datos</button>
                <button type="button" onClick={() => handleDeleteUser(selectedUser)} className="btn-ghost !py-2 !text-red-600 hover:!border-red-300 hover:!bg-red-50">🗑️ Eliminar Expediente</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create student modal */}
      {creating && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setCreating(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-ink">Registrar Nuevo Alumno</h3>
              <button onClick={() => setCreating(false)} className="text-muted hover:text-ink">✕</button>
            </div>
            <form onSubmit={handleCreateStudent} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Nombre completo</label>
                <input required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="Ej. Juan Pérez" className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Correo electrónico</label>
                <input required type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} placeholder="alumno@ejemplo.com" className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Teléfono (opcional)</label>
                <input value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} placeholder="55 1234 5678" className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Contraseña Temporal</label>
                <input required value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none font-mono text-xs" />
                <span className="text-[11px] text-muted mt-1 block">El alumno podrá cambiarla al iniciar sesión.</span>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setCreating(false)} className="btn-ghost">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Alumno ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit user modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setEditingUser(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-ink">Editar Datos del Alumno</h3>
              <button onClick={() => setEditingUser(null)} className="text-muted hover:text-ink">✕</button>
            </div>
            <form onSubmit={handleEditUser} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Nombre completo</label>
                <input required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Correo electrónico</label>
                <input required type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Teléfono</label>
                <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Rol</label>
                <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none bg-white cursor-pointer font-medium">
                  <option value="student">👨‍🎓 Alumno</option>
                  <option value="admin">⚙️ Administrador</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setEditingUser(null)} className="btn-ghost">Cancelar</button>
                <button type="submit" className="btn-primary">Actualizar Cambios ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent, small }: { label: string; value: string | number; accent?: "primary" | "secondary" | "emerald" | "amber"; small?: boolean }) {
  const accentColor =
    accent === "emerald" ? "text-emerald-600" :
    accent === "amber" ? "text-amber-600" :
    accent === "primary" ? "text-primary" :
    accent === "secondary" ? "text-secondary" : "text-ink";
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="text-xs uppercase tracking-wider text-muted font-bold truncate">{label}</div>
      <div className={`mt-2 ${small ? "text-xl" : "text-3xl"} font-black ${accentColor}`}>{value}</div>
    </div>
  );
}
