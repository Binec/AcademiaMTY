import { Link } from "react-router-dom";
import { siteConfig } from "../data/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-slate-300">
      {/* Main footer */}
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="h-24 w-auto shrink-0">
                <img
                  src="https://github.com/Binec/AcademiaMTY/blob/main/AM_SINFONDOMesa%20de%20trabajo%202%20copia%202@2x.png?raw=true"
                  alt="AM Monterrey Academia"
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
              Más de 15 años formando conductores responsables y seguros en México.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Navegación</h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Inicio" },
                { to: "/nosotros", label: "Nosotros" },
                { to: "/servicios", label: "Servicios" },
                { to: "/cursos", label: "Cursos" },
                { to: "/examenes", label: "Exámenes" },
                { to: "/galeria", label: "Galería" },
                { to: "/contacto", label: "Contacto" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Contacto</h4>
            <ul className="space-y-4 text-sm">

              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${siteConfig.phoneRaw}`} className="text-slate-400 hover:text-white transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${siteConfig.email}`} className="text-slate-400 hover:text-white transition-colors">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10">
              <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Síguenos</h5>
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13.5 21v-7h2.5l.5-3h-3V9.2c0-.9.3-1.5 1.6-1.5H17V5.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.1V11H8v3h2.5v7h3z"/>
                  </svg>
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a
                  href={siteConfig.social.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.5 3.5h-2v11.3a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V10a4.8 4.8 0 1 0 4.2 4.7V8.8a6.4 6.4 0 0 0 3.7 1.2V8a4.4 4.4 0 0 1-4-4.5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Horario</h4>
            <div className="text-sm text-slate-400 space-y-2">
              <div>{siteConfig.hours}</div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {currentYear} {siteConfig.name}. Todos los derechos reservados.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Términos</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Reembolsos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
