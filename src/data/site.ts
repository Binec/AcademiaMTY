// Site-wide configuration for Escuela de Manejo
export const siteConfig = {
  name: "AutoEscuela Pro",
  tagline: "Aprende a conducir con seguridad y confianza",
  description:
    "Escuela de manejo certificada con instructores expertos, unidades modernas y exámenes en línea para obtener tu licencia.",
  phone: "+52 55 1234 5678",
  phoneRaw: "525512345678",
  email: "contacto@autoescuelapro.com",
  address: "Av. Revolución 1234, Col. Guadalupe, CDMX, México",
  whatsapp: "525512345678",
  whatsappMessage:
    "Hola! Me interesa obtener más información sobre los cursos de manejo.",
  hours: "Lunes a Sábado · 7:00 am - 8:00 pm",
  social: {
    facebook: "https://facebook.com/autoescuelapro",
    instagram: "https://instagram.com/autoescuelapro",
    tiktok: "https://tiktok.com/@autoescuelapro",
    youtube: "https://youtube.com/@autoescuelapro",
  },
  corporateEmails: [
    "contacto@autoescuelapro.com",
    "ventas@autoescuelapro.com",
    "soporte@autoescuelapro.com",
    "cursos@autoescuelapro.com",
    "certificaciones@autoescuelapro.com",
  ],
};

export type CourseLevel = "basico" | "intermedio" | "experto" | "primeros-auxilios";

export interface Course {
  id: CourseLevel;
  title: string;
  tagline: string;
  price: number;
  oldPrice?: number;
  hours: string;
  features: string[];
  highlight?: string;
  color: string;
}

export const courses: Course[] = [
  {
    id: "basico",
    title: "Curso Básico",
    tagline: "Ideal para principiantes sin experiencia previa.",
    price: 1499,
    oldPrice: 1899,
    hours: "12 hrs prácticas + Teoría",
    features: [
      "Clases teóricas de reglamento de tránsito",
      "12 horas de práctica en vehículo doble comando",
      "Circuito cerrado y vías reales",
      "Material de estudio digital",
      "Examen simulado incluido",
      "Certificado de asistencia",
    ],
    highlight: "Más popular para nuevos conductores",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "intermedio",
    title: "Curso Intermedio",
    tagline: "Perfecciona tu técnica y maneja con seguridad total.",
    price: 2299,
    oldPrice: 2799,
    hours: "20 hrs prácticas + Examen oficial",
    features: [
      "Todo lo incluido en el Curso Básico",
      "20 horas de práctica guiada",
      "Manejo en autopista y ciudad",
      "Técnicas de frenado y evasión",
      "Examen oficial de tránsito",
      "Gestión de cita para licencia",
    ],
    highlight: "Recomendado para obtener licencia",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "experto",
    title: "Curso Experto",
    tagline: "Conducción avanzada, defensiva y manejo de emergencias.",
    price: 3499,
    oldPrice: 4199,
    hours: "30 hrs prácticas + Certificación",
    features: [
      "Todo lo incluido en el Curso Intermedio",
      "30 horas de práctica avanzada",
      "Conducción defensiva certificada",
      "Simulacros de emergencia",
      "Examen experto con certificación",
      "Diploma oficial impreso y digital",
    ],
    highlight: "Certificación internacional incluida",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "primeros-auxilios",
    title: "Primeros Auxilios",
    tagline: "Curso práctico en RCP, heridas, fracturas y emergencias médicas.",
    price: 799,
    oldPrice: 999,
    hours: "12 hrs teóricas + Prácticas",
    features: [
      "Reanimación cardiopulmonar (RCP)",
      "Atención de heridas, hemorragias y quemaduras",
      "Inmovilización de fracturas y esguinces",
      "Protocolo PAS (Proteger, Avisar, Socorrer)",
      "Uso correcto de DEA (Desfibrilador Externo Automático)",
      "Certificado oficial de primeros auxilios",
    ],
    highlight: "Certificación en primeros auxilios",
    color: "from-rose-500 to-red-600",
  },
];
