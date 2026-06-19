// Generación automatizada de certificado PDF al aprobar un examen.
// Usa jsPDF para generar el PDF directamente en el navegador.
// En producción: el backend (Node.js + PDFKit / Puppeteer) debe regenerar el PDF y enviarlo por correo con Nodemailer.

import jsPDF from "jspdf";
import { CourseLevel } from "../data/site";

export interface CertificateData {
  studentName: string;
  email: string;
  level: CourseLevel;
  score: number; // percentage
  date: string;
  certificateId: string;
}

const levelTitle: Record<CourseLevel, string> = {
  basico: "Curso Básico de Conducción Segura",
  intermedio: "Curso Intermedio de Conducción",
  experto: "Curso Experto de Conducción Defensiva",
  "primeros-auxilios": "Curso de Primeros Auxilios",
};

export function generateCertificatePDF(data: CertificateData): jsPDF {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Fondo
  doc.setFillColor(8, 58, 102);
  doc.rect(0, 0, w, h, "F");

  // Marco interior
  doc.setFillColor(255, 255, 255);
  doc.rect(10, 10, w - 20, h - 20, "F");

  // Bordes decorativos
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1.5);
  doc.rect(14, 14, w - 28, h - 28);
  doc.setDrawColor(11, 79, 138);
  doc.setLineWidth(0.5);
  doc.rect(17, 17, w - 34, h - 34);

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(11, 79, 138);
  doc.text("AUTOESCUELA PRO", w / 2, 35, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("ESCUELA DE MANEJO CERTIFICADA", w / 2, 42, { align: "center" });

  // Línea decorativa
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1);
  doc.line(60, 48, w - 60, 48);

  // "Certifica que"
  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105);
  doc.text("La presente certifica que:", w / 2, 60, { align: "center" });

  // Nombre del alumno
  doc.setFontSize(30);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(data.studentName.toUpperCase(), w / 2, 78, { align: "center" });

  // Subrayado
  doc.setDrawColor(16, 185, 129);
  const nameWidth = doc.getTextWidth(data.studentName.toUpperCase());
  doc.line(w / 2 - nameWidth / 2 - 10, 82, w / 2 + nameWidth / 2 + 10, 82);

  // Descripción
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(
    `Ha aprobado satisfactoriamente el ${levelTitle[data.level]}, demostrando los conocimientos teóricos y prácticos necesarios para conducir de manera segura y responsable.`,
    170
  );
  doc.text(lines, w / 2, 95, { align: "center" });

  // Calificación
  doc.setFontSize(13);
  doc.setTextColor(11, 79, 138);
  doc.text(`Calificación obtenida: ${data.score}%  ·  Nivel: ${data.level.toUpperCase()}`, w / 2, 120, { align: "center" });

  // Fecha y folio
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Fecha de emisión: ${data.date}`, w / 2, 132, { align: "center" });
  doc.text(`Folio: ${data.certificateId}`, w / 2, 140, { align: "center" });

  // Firmas
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.5);
  doc.line(40, 170, 95, 170);
  doc.line(w - 95, 170, w - 40, 170);

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Ing. Pedro Martínez", 67.5, 176, { align: "center" });
  doc.text("Director General", 67.5, 182, { align: "center" });

  doc.text("Dra. Ana Solís", w - 67.5, 176, { align: "center" });
  doc.text("Coordinadora Académica", w - 67.5, 182, { align: "center" });

  // Sello
  doc.setDrawColor(16, 185, 129);
  doc.setFillColor(16, 185, 129);
  doc.circle(w / 2, 175, 12);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("OFICIAL", w / 2, 173, { align: "center" });
  doc.text("APROBADO", w / 2, 178, { align: "center" });

  // Pie
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Este certificado es válido para trámite de licencia. Verifícalo en www.autoescuelapro.com/verificar", w / 2, 195, { align: "center" });

  return doc;
}

export function downloadCertificate(data: CertificateData) {
  const doc = generateCertificatePDF(data);
  const safeName = data.studentName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`certificado_${data.level}_${safeName}.pdf`);
  return doc;
}

// Integración con backend para envío por correo (NodeMailer):
// Endpoint sugerido: POST /api/send-certificate
// Body: { studentName, email, level, score, date, certificateId }
// El backend genera el PDF con PDFKit y lo adjunta en un correo SMTP.
export async function sendCertificateByEmail(data: CertificateData): Promise<boolean> {
  try {
    // En producción: reemplazar por llamada real al endpoint
    // const res = await fetch("/api/send-certificate", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    // return res.ok;
    console.log("[sendCertificateByEmail] Simulando envío a", data.email, data);
    await new Promise((r) => setTimeout(r, 1500));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
