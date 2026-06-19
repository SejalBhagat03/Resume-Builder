/**
 * pdf-export.ts
 * Client-side PDF generation using jsPDF + html2canvas.
 * Captures the live resume preview element as a pixel-perfect PDF.
 */

import type { Resume } from "@/lib/resume-store";

export async function downloadResumePdf(
  resume: Resume,
  previewElementId = "resume-preview-printable",
) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const el = document.getElementById(previewElementId);
  if (!el) {
    throw new Error(
      `Preview element #${previewElementId} not found. Make sure the resume preview is visible.`,
    );
  }

  // A4 dimensions in mm
  const A4_W = 210;
  const A4_H = 297;
  const DPI_SCALE = 2; // retina quality

  // Check if we are rendering visually imported pages
  const visualPages = el.getElementsByClassName("pdf-page-render");
  if (visualPages.length > 0) {
    const firstPage = visualPages[0] as HTMLElement;
    const firstPageH = (firstPage.offsetHeight * A4_W) / firstPage.offsetWidth;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [A4_W, firstPageH],
    });

    for (let i = 0; i < visualPages.length; i++) {
      const pageEl = visualPages[i] as HTMLElement;
      const canvas = await html2canvas(pageEl, {
        scale: DPI_SCALE,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pageH = (pageEl.offsetHeight * A4_W) / pageEl.offsetWidth;

      if (i > 0) {
        pdf.addPage([A4_W, pageH]);
      }

      pdf.addImage(imgData, "PNG", 0, 0, A4_W, pageH);
    }

    const filename = `${resume.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    pdf.save(filename);
    return filename;
  }

  const canvas = await html2canvas(el, {
    scale: DPI_SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  // Calculate height proportionally
  const canvasW = canvas.width / DPI_SCALE;
  const canvasH = canvas.height / DPI_SCALE;
  const pdfH = (canvasH * A4_W) / canvasW;

  const pdf = new jsPDF({
    orientation: pdfH > A4_H ? "portrait" : "portrait",
    unit: "mm",
    format: [A4_W, Math.max(pdfH, A4_H)],
  });

  pdf.addImage(imgData, "PNG", 0, 0, A4_W, pdfH);

  const filename = `${resume.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
  pdf.save(filename);
  return filename;
}
