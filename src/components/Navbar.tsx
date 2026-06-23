import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/servicios", label: "Servicios" },
  { to: "/cursos", label: "Cursos" },
  { to: "/examenes", label: "Exámenes" },
  { to: "/galeria", label: "Galería" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 border-b ${
        scrolled
          ? "bg-white/98 backdrop-blur-md border-slate-200 shadow-sm"
          : "bg-primary border-primary/20"
      }`}
    >
      <div className="container-x flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center h-14 w-auto shrink-0">
            <img
              src="https://github.com/Binec/AcademiaMTY/blob/main/AM_SINFONDOMesa%20de%20trabajo%202%20copia%202@2x.png?raw=true"
              alt="AM Monterrey Academia"
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className={`font-bold text-[15px] tracking-tight ${scrolled ? "text-ink" : "text-white"}`}>
              AM Monterrey
            </div>
            <div className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${scrolled ? "text-secondary" : "text-secondary"}`}>
              Academia de Manejo
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                  isActive
                    ? scrolled
                      ? "text-primary bg-primary/5"
                      : "text-white bg-white/15"
                    : scrolled
                    ? "text-ink-soft hover:text-primary hover:bg-slate-50"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right section */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((m) => !m)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled ? "text-ink-soft hover:bg-slate-50" : "text-white hover:bg-white/10"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden xl:inline">{user.name.split(" ")[0]}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-40">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-muted truncate">{user.email}</div>
                    </div>
                    <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-slate-50">
                      Mi panel
                    </Link>
                    <Link to="/examenes" className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-slate-50">
                      Exámenes
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2.5 text-sm text-primary font-semibold hover:bg-primary/5 border-t border-slate-100">
                        ⚙️ Panel administrador
                      </Link>
                    )}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-medium px-3 py-2 transition-colors ${
                  scrolled ? "text-ink-soft hover:text-primary" : "text-white/90 hover:text-white"
                }`}
              >
                Iniciar sesión
              </Link>
              <Link to="/signup" className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                scrolled ? "bg-primary text-white hover:bg-primary-dark" : "bg-white text-primary hover:bg-slate-50"
              }`}>
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Abrir menú"
          onClick={() => setOpen((o) => !o)}
          className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            scrolled ? "text-ink hover:bg-slate-100" : "text-white hover:bg-white/10"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-slate-100 ${
          open ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <nav className="container-x py-3 flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium border-b border-slate-50 last:border-0 ${
                  isActive ? "text-primary bg-primary/5" : "text-ink-soft hover:bg-slate-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="p-4 flex flex-col gap-2">
            {user ? (
              <>
                <div className="text-sm text-muted">Sesión: <span className="font-semibold text-ink">{user.name}</span></div>
                <Link to="/dashboard" className="btn-outline justify-center text-sm">Mi panel</Link>
                <button onClick={logout} className="btn-ghost justify-center text-sm text-red-600 border-red-200 hover:bg-red-50">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost justify-center text-sm">Iniciar sesión</Link>
                <Link to="/signup" className="btn-primary justify-center text-sm">Registrarse</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
