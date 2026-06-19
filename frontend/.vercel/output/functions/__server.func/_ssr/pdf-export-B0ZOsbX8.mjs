import { o as __toESM } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pdf-export-B0ZOsbX8.js
async function downloadResumePdf(resume, previewElementId = "resume-preview-printable") {
	const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())), import("../_libs/html2canvas.mjs").then((n) => (n.n(), n.t))]);
	const el = document.getElementById(previewElementId);
	if (!el) throw new Error(`Preview element #${previewElementId} not found. Make sure the resume preview is visible.`);
	const A4_W = 210;
	const A4_H = 297;
	const DPI_SCALE = 2;
	const visualPages = el.getElementsByClassName("pdf-page-render");
	if (visualPages.length > 0) {
		const firstPage = visualPages[0];
		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: [A4_W, firstPage.offsetHeight * A4_W / firstPage.offsetWidth]
		});
		for (let i = 0; i < visualPages.length; i++) {
			const pageEl = visualPages[i];
			const imgData = (await html2canvas(pageEl, {
				scale: DPI_SCALE,
				useCORS: true,
				backgroundColor: "#ffffff",
				logging: false
			})).toDataURL("image/png");
			const pageH = pageEl.offsetHeight * A4_W / pageEl.offsetWidth;
			if (i > 0) pdf.addPage([A4_W, pageH]);
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
		logging: false
	});
	const imgData = canvas.toDataURL("image/png");
	const canvasW = canvas.width / DPI_SCALE;
	const pdfH = canvas.height / DPI_SCALE * A4_W / canvasW;
	const pdf = new jsPDF({
		orientation: pdfH > A4_H ? "portrait" : "portrait",
		unit: "mm",
		format: [A4_W, Math.max(pdfH, A4_H)]
	});
	pdf.addImage(imgData, "PNG", 0, 0, A4_W, pdfH);
	const filename = `${resume.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
	pdf.save(filename);
	return filename;
}
//#endregion
export { downloadResumePdf };
