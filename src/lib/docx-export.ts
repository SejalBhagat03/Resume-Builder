/**
 * docx-export.ts
 * Client-side DOCX generation using the `docx` package.
 * Produces a structured, ATS-friendly Word document from resume JSON.
 */

import type { Resume } from "@/lib/resume-store";

const BRAND = "2E5A8E"; // dark blue accent

function heading(text: string) {
  const { Paragraph, TextRun, BorderStyle } = require("docx") as typeof import("docx");
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 18,
        color: BRAND,
      }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND },
    },
    spacing: { before: 200, after: 80 },
  });
}

function bullet(text: string) {
  const { Paragraph, TextRun } = require("docx") as typeof import("docx");
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    bullet: { level: 0 },
    spacing: { after: 40 },
  });
}

function row(left: string, right: string) {
  const { Paragraph, TextRun, TabStopPosition, TabStopType, AlignmentType } =
    require("docx") as typeof import("docx");
  return new Paragraph({
    children: [
      new TextRun({ text: left, bold: true, size: 22 }),
      new TextRun({ text: "\t" + right, size: 20, color: "666666" }),
    ],
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
    spacing: { after: 40 },
  });
}

export async function downloadResumeDocx(resume: Resume) {
  const { Document, Packer, Paragraph, TextRun, AlignmentType } =
    (await import("docx")) as typeof import("docx");

  const { saveAs } = await import("file-saver");

  const d = resume.data;
  const children: InstanceType<typeof Paragraph>[] = [];

  // ── Header ──────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: d.fullName, bold: true, size: 36, color: "1a1a1a" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: [d.email, d.phone, d.location].filter(Boolean).join("  •  "),
          size: 18,
          color: "555555",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
  );

  // ── Summary ──────────────────────────────────────────────────
  if (d.summary) {
    children.push(
      heading("Summary"),
      new Paragraph({
        children: [new TextRun({ text: d.summary, size: 20 })],
        spacing: { after: 80 },
      }),
    );
  }

  // ── Experience ───────────────────────────────────────────────
  if (d.experience.length > 0) {
    children.push(heading("Experience"));
    for (const ex of d.experience) {
      children.push(row(`${ex.role} — ${ex.company}`, ex.period));
      for (const b of ex.bullets.filter(Boolean)) {
        children.push(bullet(b));
      }
      children.push(new Paragraph({ spacing: { after: 80 } }));
    }
  }

  // ── Education ────────────────────────────────────────────────
  if (d.education.length > 0) {
    children.push(heading("Education"));
    for (const ed of d.education) {
      children.push(
        row(`${ed.degree} — ${ed.school}`, ed.year + (ed.cgpa ? `  •  CGPA ${ed.cgpa}` : "")),
      );
    }
    children.push(new Paragraph({ spacing: { after: 80 } }));
  }

  // ── Projects ─────────────────────────────────────────────────
  if (d.projects.length > 0) {
    children.push(heading("Projects"));
    for (const p of d.projects) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: p.name, bold: true, size: 22 }),
            new TextRun({ text: p.tools ? `  —  ${p.tools}` : "", size: 20, color: "666666" }),
          ],
          spacing: { after: 40 },
        }),
      );
      for (const b of p.bullets.filter(Boolean)) {
        children.push(bullet(b));
      }
      children.push(new Paragraph({ spacing: { after: 60 } }));
    }
  }

  // ── Skills ───────────────────────────────────────────────────
  if (d.skills.length > 0) {
    children.push(heading("Skills"));
    for (const s of d.skills) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${s.category}: `, bold: true, size: 20 }),
            new TextRun({ text: s.items, size: 20 }),
          ],
          spacing: { after: 60 },
        }),
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20 },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${resume.title.replace(/[^a-z0-9]/gi, "_")}.docx`;
  saveAs(blob, filename);
  return filename;
}
