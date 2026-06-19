import { useState } from "react";
import { siteConfig } from "../data/site";

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const url = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {open && (
        <div className="bg-white rounded-xl shadow-2xl w-[300px] overflow-hidden border border-slate-200">
          <div className="bg-[#075e54] text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
                <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.38L1.054 31.2l6.072-1.946A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.338 22.594c-.39 1.1-1.932 2.014-3.16 2.282-.842.18-1.94.324-5.638-1.208-4.732-1.96-7.78-6.756-8.014-7.072-.226-.316-1.876-2.498-1.876-4.764s1.188-3.374 1.61-3.836c.422-.462.922-.578 1.23-.578.308 0 .616.002.886.016.286.014.668-.108 1.044.792.39.932 1.326 3.236 1.442 3.472.116.236.194.512.038.828-.156.316-.234.512-.468.792-.234.28-.492.624-.702.838-.234.234-.478.49-.206.956.272.466 1.214 2.002 2.604 3.24 1.784 1.59 3.286 2.082 3.754 2.316.468.234.74.194 1.014-.116.272-.312 1.168-1.36 1.478-1.826.308-.468.616-.386 1.044-.234.426.156 2.718 1.282 3.184 1.516.468.236.78.352.896.548.116.196.116 1.128-.274 2.228z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-sm">AutoEscuela Pro</div>
              <div className="text-xs opacity-80">En línea</div>
            </div>
          </div>
          <div className="p-4 bg-slate-50">
            <div className="bg-white rounded-lg p-3 text-sm text-slate-600 border border-slate-100">
              ¡Hola! ¿En qué podemos ayudarte?
            </div>
          </div>
          <div className="p-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-[#25d366] hover:bg-[#128c7e] text-white text-center py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Iniciar conversación
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-lg hover:bg-[#128c7e] transition-colors"
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7" fill="currentColor">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.38L1.054 31.2l6.072-1.946A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.338 22.594c-.39 1.1-1.932 2.014-3.16 2.282-.842.18-1.94.324-5.638-1.208-4.732-1.96-7.78-6.756-8.014-7.072-.226-.316-1.876-2.498-1.876-4.764s1.188-3.374 1.61-3.836c.422-.462.922-.578 1.23-.578.308 0 .616.002.886.016.286.014.668-.108 1.044.792.39.932 1.326 3.236 1.442 3.472.116.236.194.512.038.828-.156.316-.234.512-.468.792-.234.28-.492.624-.702.838-.234.234-.478.49-.206.956.272.466 1.214 2.002 2.604 3.24 1.784 1.59 3.286 2.082 3.754 2.316.468.234.74.194 1.014-.116.272-.312 1.168-1.36 1.478-1.826.308-.468.616-.386 1.044-.234.426.156 2.718 1.282 3.184 1.516.468.236.78.352.896.548.116.196.116 1.128-.274 2.228z" />
        </svg>
      </button>
    </div>
  );
}
