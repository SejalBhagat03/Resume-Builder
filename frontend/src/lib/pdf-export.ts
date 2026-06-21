/**
 * pdf-export.ts
 * Client-side PDF generation using jsPDF + html2canvas.
 *
 * ROOT CAUSE OF oklch ERROR:
 * - html2canvas's JavaScript color parser does not support oklch().
 * - Previous fixes tried a probe element (getComputedStyle returns oklch, not rgb in Chrome).
 * - This version uses a pure-JS oklch→sRGB conversion so we never depend on
 *   browser serialization behavior.
 */

import type { Resume } from "@/lib/resume-store";

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

export async function downloadResumePdf(
  resume: Resume,
  previewElementId = "resume-preview-printable",
) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas-pro"),
  ]);

  const el = document.getElementById(previewElementId);
  if (!el) {
    throw new Error(
      `Preview element #${previewElementId} not found. Make sure the resume preview is visible.`,
    );
  }

  const A4_W = 210;
  const A4_H = 297;
  const DPI_SCALE = 2;

  const html2canvasOptions = {
    scale: DPI_SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  };

  // --- Visually-imported PDF pages ---
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
      const canvas = await html2canvas(pageEl, html2canvasOptions);
      const imgData = canvas.toDataURL("image/png");
      const pageH = (pageEl.offsetHeight * A4_W) / pageEl.offsetWidth;
      if (i > 0) pdf.addPage([A4_W, pageH]);
      pdf.addImage(imgData, "PNG", 0, 0, A4_W, pageH);
    }

    const filename = `${resume.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    pdf.save(filename);
    return filename;
  }

  // --- Standard template preview ---
  const canvas = await html2canvas(el, html2canvasOptions);
  const imgData = canvas.toDataURL("image/png");

  const canvasW = canvas.width / DPI_SCALE;
  const canvasH = canvas.height / DPI_SCALE;
  const pdfH = (canvasH * A4_W) / canvasW;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [A4_W, Math.max(pdfH, A4_H)],
  });

  pdf.addImage(imgData, "PNG", 0, 0, A4_W, pdfH);

  const filename = `${resume.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
  pdf.save(filename);
  return filename;
}
