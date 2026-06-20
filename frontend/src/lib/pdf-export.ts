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
// oklch → sRGB conversion (pure math, no browser APIs needed)
// ---------------------------------------------------------------------------

function oklchToRgbString(L: number, C: number, H: number, alpha = 1): string {
  // oklch → oklab
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  // oklab → linear sRGB  (Björn Ottosson's matrix)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;

  const r = +4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  const g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  const bv = -0.004196086 * lc - 0.7034186147 * mc + 1.707614701 * sc;

  // linear → sRGB gamma
  const gamma = (c: number) => {
    const clamped = Math.max(0, Math.min(1, c));
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const ri = Math.round(gamma(r) * 255);
  const gi = Math.round(gamma(g) * 255);
  const bi = Math.round(gamma(bv) * 255);

  return alpha < 1 ? `rgba(${ri}, ${gi}, ${bi}, ${alpha})` : `rgb(${ri}, ${gi}, ${bi})`;
}

/** Parse `oklch(L C H)` or `oklch(L C H / alpha)` */
function parseOklch(value: string): string | null {
  const m = value
    .trim()
    .match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i);
  if (!m) return null;
  const L = parseFloat(m[1]);
  const C = parseFloat(m[2]);
  const H = parseFloat(m[3]);
  const alpha = m[4] ? (m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1;
  return oklchToRgbString(L, C, H, alpha);
}

// ---------------------------------------------------------------------------
// Design-system variables (from styles.css :root block)
// We map every oklch value to its converted rgb equivalent.
// ---------------------------------------------------------------------------

const CSS_VAR_OKLCH: Record<string, string> = {
  "--background": "oklch(0.985 0.008 80)",
  "--foreground": "oklch(0.22 0.025 60)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.22 0.025 60)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.22 0.025 60)",
  "--primary": "oklch(0.5 0.105 55)",
  "--primary-foreground": "oklch(0.99 0.01 80)",
  "--secondary": "oklch(0.955 0.018 75)",
  "--secondary-foreground": "oklch(0.32 0.04 55)",
  "--muted": "oklch(0.965 0.012 80)",
  "--muted-foreground": "oklch(0.52 0.025 60)",
  "--accent": "oklch(0.93 0.035 70)",
  "--accent-foreground": "oklch(0.32 0.06 55)",
  "--destructive": "oklch(0.58 0.21 27)",
  "--destructive-foreground": "oklch(0.99 0.01 80)",
  "--border": "oklch(0.9 0.018 75)",
  "--input": "oklch(0.92 0.015 75)",
  "--ring": "oklch(0.5 0.105 55)",
  "--brand": "oklch(0.5 0.105 55)",
  "--brand-foreground": "oklch(0.99 0.01 80)",
  "--brand-soft": "oklch(0.94 0.045 70)",
  "--success": "oklch(0.62 0.13 150)",
  "--warning": "oklch(0.72 0.15 70)",
  "--chart-1": "oklch(0.5 0.105 55)",
  "--chart-2": "oklch(0.62 0.13 150)",
  "--chart-3": "oklch(0.72 0.15 70)",
  "--chart-4": "oklch(0.6 0.18 30)",
  "--chart-5": "oklch(0.55 0.15 280)",
  "--sidebar": "oklch(0.97 0.014 78)",
  "--sidebar-foreground": "oklch(0.32 0.03 60)",
  "--sidebar-primary": "oklch(0.5 0.105 55)",
  "--sidebar-primary-foreground": "oklch(0.99 0.01 80)",
  "--sidebar-accent": "oklch(0.93 0.04 70)",
  "--sidebar-accent-foreground": "oklch(0.32 0.06 55)",
  "--sidebar-border": "oklch(0.9 0.02 75)",
  "--sidebar-ring": "oklch(0.5 0.105 55)",
};

/**
 * Builds a <style> block that replaces every oklch CSS variable with its
 * mathematically-correct rgb() equivalent, and patches any hardcoded oklch
 * values in utility classes.
 */
function buildOklchFixCSS(): string {
  // Convert each variable
  const varLines = Object.entries(CSS_VAR_OKLCH)
    .map(([varName, oklch]) => {
      const rgb = parseOklch(oklch);
      return rgb ? `  ${varName}: ${rgb} !important;` : null;
    })
    .filter(Boolean)
    .join("\n");

  // shadow-soft uses raw oklch() in box-shadow values
  const shadowSoftFix = [
    ".shadow-soft {",
    "  box-shadow:",
    `    0 1px 2px ${oklchToRgbString(0.2, 0.02, 60, 0.04)},`,
    `    0 8px 24px -12px ${oklchToRgbString(0.2, 0.02, 60, 0.08)} !important;`,
    "}",
  ].join("\n");

  // hero-gradient uses color-mix(in oklch, ...) — replace with a safe gradient
  const heroGradFix = [
    ".hero-gradient {",
    "  background: linear-gradient(135deg,",
    "    rgba(244, 235, 220, 0.9) 0%,",
    "    rgba(250, 245, 238, 0.4) 100%) !important;",
    "}",
  ].join("\n");

  return [`:root {\n${varLines}\n}`, shadowSoftFix, heroGradFix].join("\n\n");
}

// ---------------------------------------------------------------------------
// Inject / cleanup
// ---------------------------------------------------------------------------

function injectFix(): { css: string; cleanup: () => void } {
  const css = buildOklchFixCSS();
  const style = document.createElement("style");
  style.id = "__pdf-oklch-fix";
  style.textContent = css;
  document.head.appendChild(style);
  return {
    css,
    cleanup: () => {
      const el = document.getElementById("__pdf-oklch-fix");
      if (el) el.remove();
    },
  };
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

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

  const { css: fixCSS, cleanup } = injectFix();

  try {
    const A4_W = 210;
    const A4_H = 297;
    const DPI_SCALE = 2;

    const html2canvasOptions = {
      scale: DPI_SCALE,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (clonedDoc: Document) => {
        // Inject the same fix into html2canvas's cloned document
        const s = clonedDoc.createElement("style");
        s.textContent = fixCSS;
        clonedDoc.head.appendChild(s);
      },
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
  } finally {
    cleanup();
  }
}
