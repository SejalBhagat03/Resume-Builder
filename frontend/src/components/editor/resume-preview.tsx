import * as React from "react";
import {
  ZoomIn,
  ZoomOut,
  Loader2,
  FileText,
  AlertTriangle,
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Resume } from "@/lib/resume-store";

/* ------------- Font and Text Measurement Helpers ------------- */

function getCleanFontFamily(fontName: string) {
  if (!fontName) return "inherit";
  const name = fontName.toLowerCase();
  if (name.includes("times") || name.includes("liberationserif") || name.includes("georgia")) {
    return "Georgia, Times New Roman, serif";
  }
  if (name.includes("courier") || name.includes("mono")) {
    return "monospace";
  }
  return "Inter, Arial, sans-serif";
}

function getFontStyles(fontFamily: string) {
  const lower = fontFamily.toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles: any = {};
  if (lower.includes("bold") || lower.includes("bd") || lower.includes("black")) {
    styles.fontWeight = "bold";
  }
  if (lower.includes("italic") || lower.includes("oblique") || lower.includes("it")) {
    styles.fontStyle = "italic";
  }
  return styles;
}

function getTextWidth(text: string, fontStr: string): number {
  if (typeof document === "undefined") return 0;
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    ctx.font = fontStr;
    return ctx.measureText(text).width;
  } catch {
    return 0;
  }
}

/* ------------- PageRenderer Component ------------- */

export function PageRenderer({
  page,
  pageIdx,
  onLayoutChange,
  importedLayout,
  pdfDoc,
  zoom = 1.0,
  onConvertToNative,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  pageIdx: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLayoutChange?: (layout: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importedLayout: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfDoc?: any;
  zoom?: number;
  onConvertToNative?: () => void;
}) {
  const [containerWidth, setContainerWidth] = React.useState(794);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingBlock, setEditingBlock] = React.useState<any>(null);
  const [editingText, setEditingText] = React.useState("");
  const [fontScale, setFontScale] = React.useState(1.0);
  const [widthScale, setWidthScale] = React.useState(1.0);
  const [xOffset, setXOffset] = React.useState(0);
  const [yOffset, setYOffset] = React.useState(0);
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [textColor, setTextColor] = React.useState("#000000");
  const [fontWeight, setFontWeight] = React.useState("normal");
  const [textAlign, setTextAlign] = React.useState("left");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingSnapshot, setEditingSnapshot] = React.useState<any>(null);

  const [draggingItem, setDraggingItem] = React.useState<{
    itemIdx: number;
    startX: number;
    startY: number;
    origXOffset: number;
    origYOffset: number;
  } | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let active = true;
    const render = async () => {
      try {
        const pdfPage = await pdfDoc.getPage(pageIdx + 1);
        const viewport = pdfPage.getViewport({ scale: 2.0 });
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await pdfPage.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch (err) {
        console.error("PDF page render error:", err);
      }
    };
    render();
    return () => {
      active = false;
    };
  }, [pdfDoc, pageIdx]);

  const viewport = page.viewport;
  const scale = containerWidth / viewport.width;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateEditingBlockProp = (propName: string, value: any) => {
    if (!editingBlock) return;

    if (propName === "text") setEditingText(value);
    else if (propName === "fontScale") setFontScale(value);
    else if (propName === "widthScale") setWidthScale(value);
    else if (propName === "xOffset") setXOffset(value);
    else if (propName === "yOffset") setYOffset(value);
    else if (propName === "bgColor") setBgColor(value);
    else if (propName === "textColor") setTextColor(value);
    else if (propName === "fontWeight") setFontWeight(value);
    else if (propName === "textAlign") setTextAlign(value);

    const nextLayout = { ...importedLayout };
    nextLayout.pages = [...nextLayout.pages];
    nextLayout.pages[pageIdx] = {
      ...nextLayout.pages[pageIdx],
      textItems: [...nextLayout.pages[pageIdx].textItems],
    };

    const currentItem = nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx];
    if (currentItem.originalText === undefined) {
      currentItem.originalText = currentItem.text;
    }
    currentItem[propName] = value;
    onLayoutChange?.(nextLayout);
  };

  const resetPosition = () => {
    setXOffset(0);
    setYOffset(0);
    const nextLayout = { ...importedLayout };
    nextLayout.pages = [...nextLayout.pages];
    nextLayout.pages[pageIdx] = {
      ...nextLayout.pages[pageIdx],
      textItems: [...nextLayout.pages[pageIdx].textItems],
    };
    const currentItem = nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx];
    currentItem.xOffset = 0;
    currentItem.yOffset = 0;
    onLayoutChange?.(nextLayout);
  };

  const resetBlock = () => {
    const origText = editingBlock.item.originalText || editingBlock.item.text;
    setEditingText(origText);
    setFontScale(1.0);
    setWidthScale(1.0);
    setXOffset(0);
    setYOffset(0);
    setBgColor("#ffffff");
    setTextColor("#000000");
    setFontWeight("normal");
    setTextAlign("left");

    const nextLayout = { ...importedLayout };
    nextLayout.pages = [...nextLayout.pages];
    nextLayout.pages[pageIdx] = {
      ...nextLayout.pages[pageIdx],
      textItems: [...nextLayout.pages[pageIdx].textItems],
    };
    nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx] = {
      ...editingBlock.item,
      text: origText,
      originalText: origText,
      fontScale: undefined,
      widthScale: undefined,
      xOffset: undefined,
      yOffset: undefined,
      bgColor: undefined,
      textColor: undefined,
      fontWeight: undefined,
      textAlign: undefined,
    };
    onLayoutChange?.(nextLayout);
  };

  // Build the warning parameters
  let isOverflowing = false;
  let computedNewWidth = 0;
  let computedBoxWidth = 0;
  let isBigEdit = false;

  if (editingBlock) {
    const cleanFont = getCleanFontFamily(editingBlock.item.fontFamily || "");
    const fontStyles = getFontStyles(editingBlock.item.fontFamily || "");
    const currentWeight = fontWeight || fontStyles.fontWeight || "normal";
    const currentStyle = fontStyles.fontStyle || "normal";
    const fontStyleStr = `${currentWeight} ${currentStyle} ${editingBlock.item.fontSize}px ${cleanFont}`;
    computedNewWidth = getTextWidth(editingText, fontStyleStr) * fontScale;
    computedBoxWidth = editingBlock.item.width * widthScale;
    isOverflowing = computedNewWidth > computedBoxWidth + 10;

    const origLen = (editingBlock.item.originalText || editingBlock.item.text).length;
    isBigEdit = editingText.length > origLen + 50;
  }

  return (
    <div
      ref={containerRef}
      className="pdf-page-render relative bg-white border border-border shadow-soft overflow-hidden select-text transition-all"
      style={{
        width: `${100 * zoom}%`,
        maxWidth: `${viewport.width * zoom}px`,
        aspectRatio: `${viewport.width} / ${viewport.height}`,
        position: "relative",
      }}
    >
      {pdfDoc ? (
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{ display: "block" }}
        />
      ) : (
        <div className="absolute inset-0 bg-white z-0" />
      )}

      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {page.textItems.map((item: any, itemIdx: number) => {
          const cleanFont = getCleanFontFamily(item.fontFamily || "");
          const fontStyles = getFontStyles(item.fontFamily || "");

          const isEdited =
            (item.originalText !== undefined && item.text !== item.originalText) ||
            (item.xOffset !== undefined && item.xOffset !== 0) ||
            (item.yOffset !== undefined && item.yOffset !== 0) ||
            (item.fontScale !== undefined && item.fontScale !== 1.0) ||
            (item.widthScale !== undefined && item.widthScale !== 1.0) ||
            item.bgColor !== undefined ||
            item.textColor !== undefined ||
            item.textAlign !== undefined ||
            item.fontWeight !== undefined;

          const currentFontScale = item.fontScale ?? 1.0;
          const currentWidthScale = item.widthScale ?? 1.0;
          const currentXOffset = item.xOffset ?? 0;
          const currentYOffset = item.yOffset ?? 0;
          const currentBgColor = item.bgColor ?? "#ffffff";
          const currentTextColor = item.textColor ?? "#000000";
          const currentWeight = item.fontWeight ?? (fontStyles.fontWeight || "normal");
          const currentAlign = item.textAlign ?? "left";

          const style: React.CSSProperties = {
            position: "absolute",
            left: `${((item.x + currentXOffset) / viewport.width) * 100}%`,
            top: `${((item.y + currentYOffset) / viewport.height) * 100}%`,
            width: `${((item.width * currentWidthScale) / viewport.width) * 100}%`,
            height: `${(item.height / viewport.height) * 100}%`,
            fontSize: `${item.fontSize * scale * currentFontScale}px`,
            fontFamily: cleanFont,
            fontWeight: currentWeight,
            fontStyle: fontStyles.fontStyle || "normal",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            textAlign: currentAlign as any,
            lineHeight: 1.15,
            whiteSpace: "pre-wrap",
            pointerEvents: "auto",
            boxSizing: "border-box",
            backgroundColor: "transparent",
            color: isEdited ? currentTextColor : "transparent",
            zIndex: 10,
          };

          return (
            <React.Fragment key={itemIdx}>
              {/* Background Patch Mask (at original coordinates) */}
              {isEdited && (
                <div
                  style={{
                    position: "absolute",
                    left: `${(item.x / viewport.width) * 100}%`,
                    top: `${(item.y / viewport.height) * 100}%`,
                    width: `${(item.width / viewport.width) * 100}%`,
                    height: `${(item.height / viewport.height) * 100}%`,
                    backgroundColor: currentBgColor,
                    pointerEvents: "none",
                    zIndex: 5,
                  }}
                />
              )}

              {/* Text Overlay element */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (onLayoutChange) {
                    if (item.originalText === undefined) {
                      item.originalText = item.text;
                    }
                    setEditingBlock({ itemIdx, item });
                    setEditingText(item.text);
                    setFontScale(item.fontScale ?? 1.0);
                    setWidthScale(item.widthScale ?? 1.0);
                    setXOffset(item.xOffset ?? 0);
                    setYOffset(item.yOffset ?? 0);
                    setBgColor(item.bgColor ?? "#ffffff");
                    setTextColor(item.textColor ?? "#000000");
                    setFontWeight(item.fontWeight ?? (fontStyles.fontWeight || "normal"));
                    setTextAlign(item.textAlign ?? "left");
                    setEditingSnapshot({ ...item });
                  }
                }}
                onPointerDown={(e) => {
                  if (!onLayoutChange) return;
                  if (e.button !== 0) return;
                  e.stopPropagation();
                  (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);

                  setDraggingItem({
                    itemIdx,
                    startX: e.clientX,
                    startY: e.clientY,
                    origXOffset: item.xOffset || 0,
                    origYOffset: item.yOffset || 0,
                  });
                }}
                onPointerMove={(e) => {
                  if (!draggingItem || draggingItem.itemIdx !== itemIdx) return;
                  e.stopPropagation();

                  const dx = e.clientX - draggingItem.startX;
                  const dy = e.clientY - draggingItem.startY;

                  const displayWidth = viewport.width * scale;
                  const displayHeight = viewport.height * scale;

                  const pdfDx = (dx / displayWidth) * viewport.width;
                  const pdfDy = (dy / displayHeight) * viewport.height;

                  const nextLayout = { ...importedLayout };
                  nextLayout.pages = [...nextLayout.pages];
                  nextLayout.pages[pageIdx] = {
                    ...nextLayout.pages[pageIdx],
                    textItems: [...nextLayout.pages[pageIdx].textItems],
                  };

                  const currentItem = nextLayout.pages[pageIdx].textItems[itemIdx];
                  if (currentItem.originalText === undefined) {
                    currentItem.originalText = currentItem.text;
                  }
                  currentItem.xOffset = draggingItem.origXOffset + pdfDx;
                  currentItem.yOffset = draggingItem.origYOffset + pdfDy;
                  onLayoutChange?.(nextLayout);
                }}
                onPointerUp={(e) => {
                  if (draggingItem && draggingItem.itemIdx === itemIdx) {
                    e.stopPropagation();
                    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
                    setDraggingItem(null);
                  }
                }}
                style={style}
                className={cn(
                  "outline-none select-text transition-all duration-100",
                  onLayoutChange !== undefined
                    ? "hover:bg-brand/10 hover:ring-1 hover:ring-brand/40 hover:cursor-move rounded"
                    : "",
                )}
                title={onLayoutChange !== undefined ? "Drag to Move | Click to Edit" : undefined}
              >
                {isEdited ? item.text : ""}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {editingBlock && (
        <div
          className="absolute z-50 bg-card border border-border shadow-xl rounded-2xl p-4 space-y-3 flex flex-col pointer-events-auto animate-fade-in text-left text-foreground text-xs"
          style={{
            left: `${Math.min(
              containerWidth - 340,
              Math.max(10, (editingBlock.item.x + (editingBlock.item.xOffset || 0)) * scale),
            )}px`,
            top: `${Math.min(
              viewport.height * scale - 370,
              Math.max(
                10,
                (editingBlock.item.y +
                  (editingBlock.item.yOffset || 0) +
                  editingBlock.item.height +
                  4) *
                  scale,
              ),
            )}px`,
            width: "320px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-1.5 mb-0.5">
            <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Move className="h-3 w-3" /> Visual Editor Controls
            </span>
            <button
              className="text-brand hover:underline font-bold text-[10px]"
              onClick={resetBlock}
            >
              Reset All
            </button>
          </div>

          {/* Text Area */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
              <span>Edit Text</span>
              {editingBlock.item.originalText && editingText !== editingBlock.item.originalText && (
                <button
                  className="text-brand hover:underline"
                  onClick={() => updateEditingBlockProp("text", editingBlock.item.originalText)}
                >
                  Reset text
                </button>
              )}
            </div>
            <textarea
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-background resize-none outline-none focus:ring-1 focus:ring-brand"
              rows={3}
              value={editingText}
              onChange={(e) => updateEditingBlockProp("text", e.target.value)}
              autoFocus
              placeholder="Enter replacement text..."
            />
          </div>

          {/* Sizing Controls */}
          <div className="space-y-2.5 bg-muted/30 p-2.5 rounded-xl border border-border/60">
            {/* Font Size Scale */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                <span className="font-semibold">Font Size Scale</span>
                <span className="font-mono font-bold text-brand">
                  {Math.round(fontScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={fontScale}
                onChange={(e) => updateEditingBlockProp("fontScale", parseFloat(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-brand"
              />
            </div>

            {/* Box Width Scale */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                <span className="font-semibold">Box Width Scale</span>
                <span className="font-mono font-bold text-brand">
                  {Math.round(widthScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={widthScale}
                onChange={(e) => updateEditingBlockProp("widthScale", parseFloat(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-brand"
              />
            </div>
          </div>

          {/* Alignment & Styles */}
          <div className="grid grid-cols-2 gap-3.5 pt-0.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground block">
                Alignment
              </span>
              <div className="flex rounded-lg border border-border p-0.5 bg-muted/50 gap-0.5">
                {(["left", "center", "right"] as const).map((align) => {
                  const Icon =
                    align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
                  return (
                    <button
                      key={align}
                      onClick={() => updateEditingBlockProp("textAlign", align)}
                      className={cn(
                        "flex-1 py-1 rounded flex justify-center items-center hover:bg-background cursor-pointer text-muted-foreground",
                        textAlign === align && "bg-background shadow-xs text-brand",
                      )}
                      title={`Align ${align}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground block">
                Style Toggle
              </span>
              <div className="flex rounded-lg border border-border p-0.5 bg-muted/50">
                <button
                  onClick={() =>
                    updateEditingBlockProp("fontWeight", fontWeight === "bold" ? "normal" : "bold")
                  }
                  className={cn(
                    "w-full py-1 rounded flex justify-center items-center gap-1 hover:bg-background cursor-pointer text-[10px] font-semibold text-muted-foreground",
                    fontWeight === "bold" && "bg-background shadow-xs text-brand font-bold",
                  )}
                >
                  <Bold className="h-3.5 w-3.5" /> Bold
                </button>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3.5 pt-0.5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground block">
                Text Color
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: "Black", val: "#000000" },
                  { name: "White", val: "#ffffff" },
                  { name: "Navy", val: "#1e3a8a" },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => updateEditingBlockProp("textColor", c.val)}
                    className={cn(
                      "h-4 w-4 rounded-full border border-border/80 cursor-pointer transition-all",
                      textColor === c.val && "ring-2 ring-brand ring-offset-1",
                    )}
                    style={{ backgroundColor: c.val }}
                    title={c.name}
                  />
                ))}
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => updateEditingBlockProp("textColor", e.target.value)}
                  className="h-4 w-4 p-0 border-0 bg-transparent cursor-pointer rounded"
                  title="Custom Color"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground block">
                Mask Bg Color
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: "White", val: "#ffffff" },
                  { name: "Off-white", val: "#fcfcfc" },
                  { name: "Slate", val: "#f1f5f9" },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => updateEditingBlockProp("bgColor", c.val)}
                    className={cn(
                      "h-4 w-4 rounded-full border border-border/80 cursor-pointer transition-all",
                      bgColor === c.val && "ring-2 ring-brand ring-offset-1",
                    )}
                    style={{ backgroundColor: c.val }}
                    title={c.name}
                  />
                ))}
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => updateEditingBlockProp("bgColor", e.target.value)}
                  className="h-4 w-4 p-0 border-0 bg-transparent cursor-pointer rounded"
                  title="Custom Bg"
                />
              </div>
            </div>
          </div>

          {/* Nudging Controls */}
          <div className="space-y-1 pt-1 border-t border-border/60">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span className="font-semibold">Nudge Offset</span>
              {(xOffset !== 0 || yOffset !== 0) && (
                <button className="text-[9px] hover:underline" onClick={resetPosition}>
                  Reset Position
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 bg-muted/40 p-1.5 rounded-lg border border-border/80">
              <div className="flex gap-1.5 text-[9px] font-mono font-bold text-muted-foreground">
                <span>X: {Math.round(xOffset)}px</span>
                <span>Y: {Math.round(yOffset)}px</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => {
                    const nextVal = xOffset - 2;
                    updateEditingBlockProp("xOffset", nextVal);
                  }}
                  className="h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer"
                  title="Nudge Left"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    const nextVal = yOffset - 2;
                    updateEditingBlockProp("yOffset", nextVal);
                  }}
                  className="h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer"
                  title="Nudge Up"
                >
                  ↑
                </button>
                <button
                  onClick={() => {
                    const nextVal = yOffset + 2;
                    updateEditingBlockProp("yOffset", nextVal);
                  }}
                  className="h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer"
                  title="Nudge Down"
                >
                  ↓
                </button>
                <button
                  onClick={() => {
                    const nextVal = xOffset + 2;
                    updateEditingBlockProp("xOffset", nextVal);
                  }}
                  className="h-5 w-6 rounded bg-background border flex items-center justify-center font-bold hover:bg-muted text-[10px] cursor-pointer"
                  title="Nudge Right"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {(isOverflowing || isBigEdit) && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-2.5 rounded-xl space-y-1">
              <div className="font-semibold text-[10px] leading-tight text-amber-800 dark:text-amber-300">
                ⚠️ Layout Overflow Warning
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">
                {isOverflowing &&
                  `Text width (~${Math.round(computedNewWidth)}px) exceeds box width (${Math.round(computedBoxWidth)}px). `}
                {isBigEdit && "This edit is large and may overlap nearby items."}
              </p>
              {onConvertToNative && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onConvertToNative();
                  }}
                  className="text-[9px] text-brand hover:underline font-bold text-left block cursor-pointer mt-1"
                >
                  ✨ Convert to Native for template auto-layout
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-1.5 pt-1.5 border-t border-border/60">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs rounded-lg text-muted-foreground cursor-pointer"
              onClick={() => {
                if (editingSnapshot) {
                  const nextLayout = { ...importedLayout };
                  nextLayout.pages = [...nextLayout.pages];
                  nextLayout.pages[pageIdx] = {
                    ...nextLayout.pages[pageIdx],
                    textItems: [...nextLayout.pages[pageIdx].textItems],
                  };
                  nextLayout.pages[pageIdx].textItems[editingBlock.itemIdx] = editingSnapshot;
                  onLayoutChange?.(nextLayout);
                }
                setEditingBlock(null);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs rounded-lg bg-brand text-brand-foreground font-semibold cursor-pointer"
              onClick={() => setEditingBlock(null)}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------- ResumePreview Component ------------- */

export function ResumePreview({
  data,
  template = "ats-professional",
  onLayoutChange,
  pdfBase64,
  onConvertToNative,
  forceTemplatePreview = false,
}: {
  data: Resume["data"];
  template?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLayoutChange?: (layout: any) => void;
  pdfBase64?: string | null;
  onConvertToNative?: () => void;
  forceTemplatePreview?: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDoc, setPdfDoc] = React.useState<any>(null);
  const [pdfLoading, setPdfLoading] = React.useState(false);
  const [zoom, setZoom] = React.useState(1.0);

  const filename = data.importedPdf?.originalFilename || "";
  const isImage = filename.match(/\.(png|jpe?g|webp)$/i);
  const isDocx = filename.match(/\.(docx?)$/i);

  React.useEffect(() => {
    if (pdfBase64 && !isImage && !isDocx) {
      setPdfLoading(true);
      const loadPdfjs = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pdfjsLib = (window as any).pdfjsLib;
              pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
              resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdfjsLib = (window as any).pdfjsLib;
        }

        try {
          const bin = atob(pdfBase64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i);
          }
          const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
          setPdfDoc(doc);
        } catch (err) {
          console.error("Error parsing base64 PDF in preview:", err);
        } finally {
          setPdfLoading(false);
        }
      };
      loadPdfjs();
    }
  }, [pdfBase64, isImage, isDocx]);

  if (!forceTemplatePreview) {
    if (isImage && pdfBase64) {
      const ext = filename.split(".").pop() || "png";
      return (
        <div className="w-full flex justify-center p-4 bg-muted/20 border border-border rounded-3xl select-text overflow-auto max-h-[80vh]">
          <img
            src={`data:image/${ext};base64,${pdfBase64}`}
            alt="Original Resume Visual Reference"
            className="max-w-full rounded-2xl shadow-md border object-contain max-h-[75vh]"
          />
        </div>
      );
    }

    if (isDocx) {
      return (
        <div className="w-full bg-white text-slate-800 p-8 rounded-3xl shadow-sm border border-border font-serif text-sm leading-relaxed whitespace-pre-wrap select-text max-h-[80vh] overflow-y-auto text-left">
          <h2 className="text-center font-bold text-lg mb-6 border-b pb-4 text-slate-900 uppercase tracking-wide">
            {filename || "Word Document Reference"}
          </h2>
          {data.rawText || "No text could be extracted from this document."}
        </div>
      );
    }

    if (data.importedLayout) {
      const pages = data.importedLayout.pages || [
        {
          viewport: data.importedLayout.viewport!,
          textItems: data.importedLayout.textItems!,
        },
      ];

      if (pdfLoading) {
        return (
          <div className="w-full flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed rounded-3xl gap-2.5">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
            <span className="text-xs text-muted-foreground">Loading PDF canvas layer...</span>
          </div>
        );
      }

      return (
        <div className="w-full space-y-4">
          {/* Zoom Controls toolbar */}
          <div className="flex items-center justify-between bg-card border border-border p-3 rounded-2xl shadow-sm text-xs select-none">
            <div className="flex items-center gap-2">
              <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                Original Preview Zoom
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg cursor-pointer"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                disabled={zoom <= 0.5}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-mono font-bold min-w-[36px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg cursor-pointer"
                onClick={() => setZoom((z) => Math.min(2.0, z + 0.25))}
                disabled={zoom >= 2.0}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            id="resume-preview-printable"
            className="w-full flex flex-col gap-6 bg-muted/30 p-4 rounded-3xl items-center select-text overflow-auto max-h-[85vh]"
          >
            {pages.map((page, pageIdx) => (
              <PageRenderer
                key={pageIdx}
                page={page}
                pageIdx={pageIdx}
                onLayoutChange={onLayoutChange}
                importedLayout={data.importedLayout!}
                pdfDoc={pdfDoc}
                zoom={zoom}
                onConvertToNative={onConvertToNative}
              />
            ))}
          </div>
        </div>
      );
    }
  }

  const custom = data.customization || { accentColor: "", fontSize: "md", spacing: "md" };
  const accent =
    custom.accentColor ||
    (template === "ats-professional"
      ? "#3b82f6"
      : template === "modern"
        ? "#f97316"
        : template === "minimal"
          ? "#1e293b"
          : template === "creative"
            ? "#d946ef"
            : "#10b981");

  const fontSize = custom.fontSize || "md";
  const spacing = custom.spacing || "md";

  const sizeClass =
    fontSize === "sm"
      ? {
          name: "text-base font-bold",
          body: "text-[11px] leading-snug",
          section: "text-[10px] font-bold tracking-wider uppercase",
          itemTitle: "text-[12px] font-semibold",
        }
      : fontSize === "lg"
        ? {
            name: "text-2xl font-extrabold",
            body: "text-[14px] leading-relaxed",
            section: "text-[13px] font-bold tracking-wider uppercase",
            itemTitle: "text-[15px] font-semibold",
          }
        : {
            name: "text-xl font-bold",
            body: "text-[12px] leading-normal",
            section: "text-[11px] font-bold tracking-wider uppercase",
            itemTitle: "text-[13px] font-semibold",
          };

  const spacingClass =
    spacing === "sm"
      ? { container: "p-4 space-y-3", sectionMargin: "space-y-2", itemSpacing: "space-y-1" }
      : spacing === "lg"
        ? { container: "p-8 space-y-6", sectionMargin: "space-y-5", itemSpacing: "space-y-2.5" }
        : { container: "p-6 space-y-4.5", sectionMargin: "space-y-4", itemSpacing: "space-y-2" };

  const renderSummary = () =>
    data.summary && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Summary
        </h2>
        <p className={sizeClass.body}>{data.summary}</p>
      </div>
    );

  const renderExperience = () =>
    data.experience.length > 0 && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Experience
        </h2>
        <ul className={spacingClass.itemSpacing}>
          {data.experience.map((e, idx) => (
            <li key={idx} className="space-y-0.5">
              <div className="flex flex-wrap justify-between gap-1 text-[12px]">
                <span className="font-semibold text-foreground">
                  {e.role} — {e.company}
                </span>
                <span className="text-[10px] text-muted-foreground">{e.period}</span>
              </div>
              <ul className="list-disc pl-4 text-muted-foreground">
                {e.bullets.filter(Boolean).map((bullet, bIdx) => (
                  <li key={bIdx} className={sizeClass.body}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );

  const renderEducation = () =>
    data.education.length > 0 && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Education
        </h2>
        <ul className={spacingClass.itemSpacing}>
          {data.education.map((ed, idx) => (
            <li key={idx} className="flex flex-wrap justify-between gap-1 text-[12px]">
              <span>
                <span className="font-semibold text-foreground">{ed.degree}</span> — {ed.school}
              </span>
              <span className="text-[10px] text-muted-foreground">{ed.year}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  const renderProjects = () =>
    data.projects.length > 0 && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Projects
        </h2>
        <ul className={spacingClass.itemSpacing}>
          {data.projects.map((p, idx) => (
            <li key={idx} className="space-y-0.5">
              <div className="text-[12px] font-semibold text-foreground">
                {p.name} <span className="font-normal text-muted-foreground">— {p.tools}</span>
              </div>
              <ul className="list-disc pl-4 text-muted-foreground">
                {p.bullets.filter(Boolean).map((bullet, bIdx) => (
                  <li key={bIdx} className={sizeClass.body}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );

  const renderSkills = () =>
    data.skills.length > 0 && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Skills
        </h2>
        <ul className="space-y-0.5 text-[12px]">
          {data.skills.map((s, idx) => (
            <li key={idx}>
              <span className="font-semibold text-foreground">{s.category}:</span>{" "}
              <span className="text-muted-foreground">{s.items}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  const renderCertifications = () =>
    data.certifications &&
    data.certifications.length > 0 && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Certifications
        </h2>
        <ul className="list-disc pl-4 text-muted-foreground">
          {data.certifications.filter(Boolean).map((c, idx) => (
            <li key={idx} className={sizeClass.body}>
              {c}
            </li>
          ))}
        </ul>
      </div>
    );

  const renderAchievements = () =>
    data.achievements &&
    data.achievements.length > 0 && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Achievements
        </h2>
        <ul className="list-disc pl-4 text-muted-foreground">
          {data.achievements.filter(Boolean).map((a, idx) => (
            <li key={idx} className={sizeClass.body}>
              {a}
            </li>
          ))}
        </ul>
      </div>
    );

  const renderLanguages = () =>
    data.languages &&
    data.languages.length > 0 && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Languages
        </h2>
        <p className={sizeClass.body}>{data.languages.filter(Boolean).join(", ")}</p>
      </div>
    );

  const renderPublications = () =>
    data.publications &&
    data.publications.length > 0 && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Publications
        </h2>
        <ul className="list-disc pl-4 text-muted-foreground">
          {data.publications.filter(Boolean).map((p, idx) => (
            <li key={idx} className={sizeClass.body}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    );

  const renderVolunteer = () =>
    data.volunteer &&
    data.volunteer.length > 0 && (
      <div className={spacingClass.itemSpacing}>
        <h2 className={sizeClass.section} style={{ color: accent }}>
          Volunteer & Leadership
        </h2>
        <ul className="list-disc pl-4 text-muted-foreground">
          {data.volunteer.filter(Boolean).map((v, idx) => (
            <li key={idx} className={sizeClass.body}>
              {v}
            </li>
          ))}
        </ul>
      </div>
    );

  // Template 1: Two Column Layout
  if (template === "two-column") {
    return (
      <article
        id="resume-preview-printable"
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft flex text-left",
        )}
        style={{ minHeight: "297mm" }}
      >
        {/* Left Column sidebar */}
        <div
          className="w-[32%] p-5 space-y-5 flex flex-col shrink-0 border-r border-border"
          style={{ backgroundColor: `${accent}0d` }}
        >
          <div
            className="h-12 w-12 rounded-full mx-auto flex items-center justify-center text-sm font-bold animate-pulse-subtle"
            style={{
              backgroundColor: `${accent}20`,
              border: `1px solid ${accent}40`,
              color: accent,
            }}
          >
            {data.fullName
              ? data.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "U"}
          </div>

          <div className="text-center">
            <h1 className="text-base font-extrabold leading-tight text-foreground truncate">
              {data.fullName}
            </h1>
            <p className="text-[10px] text-muted-foreground truncate">
              {data.experience[0]?.role || "Professional"}
            </p>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-2">
            <h3 className={sizeClass.section} style={{ color: accent }}>
              Contact
            </h3>
            <div className="space-y-1.5 text-[10px] text-muted-foreground break-all">
              {data.email && (
                <div className="truncate">
                  <a
                    href={`mailto:${data.email}`}
                    className="hover:underline text-muted-foreground"
                  >
                    📧 {data.email}
                  </a>
                </div>
              )}
              {data.phone && (
                <div>
                  <a href={`tel:${data.phone}`} className="hover:underline text-muted-foreground">
                    📞 {data.phone}
                  </a>
                </div>
              )}
              {data.location && <div>📍 {data.location}</div>}
              {data.website && (
                <div className="truncate">
                  <a
                    href={
                      data.website.startsWith("http") ? data.website : `https://${data.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium"
                    style={{ color: accent }}
                  >
                    🔗 Portfolio
                  </a>
                </div>
              )}
              {data.linkedin && (
                <div className="truncate">
                  <a
                    href={
                      data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium"
                    style={{ color: accent }}
                  >
                    💼 LinkedIn
                  </a>
                </div>
              )}
              {data.github && (
                <div className="truncate">
                  <a
                    href={data.github.startsWith("http") ? data.github : `https://${data.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium"
                    style={{ color: accent }}
                  >
                    💻 GitHub
                  </a>
                </div>
              )}
            </div>
          </div>

          {data.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className={sizeClass.section} style={{ color: accent }}>
                Skills
              </h3>
              <div className="space-y-2">
                {data.skills.map((s, i) => (
                  <div key={i} className="text-[11px]">
                    <div className="font-semibold text-foreground">{s.category}</div>
                    <div className="text-muted-foreground text-[10px] leading-tight">{s.items}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.languages && data.languages.length > 0 && (
            <div className="space-y-2">
              <h3 className={sizeClass.section} style={{ color: accent }}>
                Languages
              </h3>
              <div className="text-[10px] text-muted-foreground break-all font-medium leading-normal">
                {data.languages.filter(Boolean).join(", ")}
              </div>
            </div>
          )}
        </div>

        {/* Right main column */}
        <div className="flex-1 p-6 space-y-5">
          {renderSummary()}
          {renderExperience()}
          {renderProjects()}
          {renderEducation()}
          {renderCertifications()}
          {renderAchievements()}
          {renderPublications()}
          {renderVolunteer()}
        </div>
      </article>
    );
  }

  // Template 2: Modern Layout
  if (template === "modern") {
    return (
      <article
        id="resume-preview-printable"
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft flex flex-col text-left",
        )}
        style={{ minHeight: "297mm" }}
      >
        <div className="p-6 text-white space-y-1 shrink-0" style={{ background: accent }}>
          <h1 className="text-2xl font-black uppercase tracking-tight leading-tight">
            {data.fullName}
          </h1>
          <div className="text-[10px] text-white/90 flex flex-wrap gap-x-3 gap-y-1">
            {data.email && (
              <a href={`mailto:${data.email}`} className="hover:underline text-white font-medium">
                {data.email}
              </a>
            )}
            {data.phone && (
              <span>
                •{" "}
                <a href={`tel:${data.phone}`} className="hover:underline text-white">
                  {data.phone}
                </a>
              </span>
            )}
            {data.location && <span>• {data.location}</span>}
            {data.website && (
              <span>
                •{" "}
                <a
                  href={data.website.startsWith("http") ? data.website : `https://${data.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-white font-bold"
                >
                  Portfolio
                </a>
              </span>
            )}
            {data.linkedin && (
              <span>
                •{" "}
                <a
                  href={
                    data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-white font-bold"
                >
                  LinkedIn
                </a>
              </span>
            )}
            {data.github && (
              <span>
                •{" "}
                <a
                  href={data.github.startsWith("http") ? data.github : `https://${data.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-white font-bold"
                >
                  GitHub
                </a>
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-5 flex-1">
          {data.summary && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Summary
              </h2>
              <p className={sizeClass.body}>{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Experience
              </h2>
              <ul className="space-y-4">
                {data.experience.map((e, idx) => (
                  <li key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline gap-1 text-[12px]">
                      <span className="font-semibold text-foreground">
                        {e.role} — {e.company}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{e.period}</span>
                    </div>
                    <ul className="list-disc pl-4 text-muted-foreground">
                      {e.bullets.filter(Boolean).map((b, bIdx) => (
                        <li key={bIdx} className={sizeClass.body}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Projects
              </h2>
              <ul className="space-y-3">
                {data.projects.map((p, idx) => (
                  <li key={idx} className="space-y-1">
                    <div className="text-[12px] font-semibold text-foreground">
                      {p.name}{" "}
                      <span className="font-normal text-muted-foreground">— {p.tools}</span>
                    </div>
                    <ul className="list-disc pl-4 text-muted-foreground">
                      {p.bullets.filter(Boolean).map((b, bIdx) => (
                        <li key={bIdx} className={sizeClass.body}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.education.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Education
              </h2>
              <ul className="space-y-2">
                {data.education.map((ed, idx) => (
                  <li key={idx} className="flex justify-between items-baseline gap-1 text-[12px]">
                    <span className="font-semibold text-foreground">
                      {ed.degree}{" "}
                      <span className="font-normal text-muted-foreground">at {ed.school}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{ed.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.skills.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Skills
              </h2>
              <ul className="space-y-1 text-[12px]">
                {data.skills.map((s, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-foreground">{s.category}:</span>{" "}
                    <span className="text-muted-foreground">{s.items}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Certifications
              </h2>
              <ul className="list-disc pl-4 text-muted-foreground">
                {data.certifications.filter(Boolean).map((c, idx) => (
                  <li key={idx} className={sizeClass.body}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.achievements && data.achievements.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Achievements
              </h2>
              <ul className="list-disc pl-4 text-muted-foreground">
                {data.achievements.filter(Boolean).map((a, idx) => (
                  <li key={idx} className={sizeClass.body}>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Languages
              </h2>
              <p className={sizeClass.body}>{data.languages.filter(Boolean).join(", ")}</p>
            </div>
          )}

          {data.publications && data.publications.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Publications
              </h2>
              <ul className="list-disc pl-4 text-muted-foreground">
                {data.publications.filter(Boolean).map((p, idx) => (
                  <li key={idx} className={sizeClass.body}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.volunteer && data.volunteer.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] gap-4">
              <h2
                className={cn(sizeClass.section, "border-r border-border pr-2 font-bold uppercase")}
                style={{ color: accent }}
              >
                Volunteer
              </h2>
              <ul className="list-disc pl-4 text-muted-foreground">
                {data.volunteer.filter(Boolean).map((v, idx) => (
                  <li key={idx} className={sizeClass.body}>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    );
  }

  // Template 3: Minimal Layout
  if (template === "minimal") {
    return (
      <article
        id="resume-preview-printable"
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft text-left",
          spacingClass.container,
        )}
        style={{ minHeight: "297mm" }}
      >
        <header className="border-b border-border pb-3 mb-2">
          <h1 className={cn("text-2xl font-light tracking-tight text-foreground")}>
            {data.fullName}
          </h1>
          <div className="mt-1 text-[10px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
            {data.email && (
              <a href={`mailto:${data.email}`} className="hover:underline text-muted-foreground">
                {data.email}
              </a>
            )}
            {data.phone && (
              <span>
                •{" "}
                <a href={`tel:${data.phone}`} className="hover:underline text-muted-foreground">
                  {data.phone}
                </a>
              </span>
            )}
            {data.location && <span>• {data.location}</span>}
            {data.website && (
              <span>
                •{" "}
                <a
                  href={data.website.startsWith("http") ? data.website : `https://${data.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-foreground font-semibold"
                >
                  Portfolio
                </a>
              </span>
            )}
            {data.linkedin && (
              <span>
                •{" "}
                <a
                  href={
                    data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-foreground font-semibold"
                >
                  LinkedIn
                </a>
              </span>
            )}
            {data.github && (
              <span>
                •{" "}
                <a
                  href={data.github.startsWith("http") ? data.github : `https://${data.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-foreground font-semibold"
                >
                  GitHub
                </a>
              </span>
            )}
          </div>
        </header>

        {data.summary && (
          <section className="space-y-1">
            <h2
              className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")}
              style={{ color: accent }}
            >
              Summary
            </h2>
            <p className={sizeClass.body}>{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="space-y-2">
            <h2
              className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")}
              style={{ color: accent }}
            >
              Experience
            </h2>
            <ul className="space-y-3">
              {data.experience.map((e, idx) => (
                <li key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline gap-1 text-[12px]">
                    <span className="font-medium text-foreground">
                      {e.role} — {e.company}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{e.period}</span>
                  </div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    {e.bullets.filter(Boolean).map((b, bIdx) => (
                      <li key={bIdx} className={sizeClass.body}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="space-y-2">
            <h2
              className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")}
              style={{ color: accent }}
            >
              Projects
            </h2>
            <ul className="space-y-2">
              {data.projects.map((p, idx) => (
                <li key={idx} className="space-y-1">
                  <div className="text-[12px] font-medium text-foreground">
                    {p.name} <span className="font-normal text-muted-foreground">— {p.tools}</span>
                  </div>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    {p.bullets.filter(Boolean).map((b, bIdx) => (
                      <li key={bIdx} className={sizeClass.body}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="space-y-2">
            <h2
              className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")}
              style={{ color: accent }}
            >
              Education
            </h2>
            <ul className="space-y-1">
              {data.education.map((ed, idx) => (
                <li key={idx} className="flex justify-between items-baseline gap-1 text-[12px]">
                  <span>
                    {ed.degree} — <span className="text-muted-foreground">{ed.school}</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">{ed.year}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.skills.length > 0 && (
          <section className="space-y-2">
            <h2
              className={cn(sizeClass.section, "border-b border-border pb-0.5 tracking-wider")}
              style={{ color: accent }}
            >
              Skills
            </h2>
            <ul className="space-y-0.5 text-[12px]">
              {data.skills.map((s, idx) => (
                <li key={idx}>
                  <span className="font-medium text-foreground">{s.category}:</span>{" "}
                  <span className="text-muted-foreground">{s.items}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {renderCertifications()}
        {renderAchievements()}
        {renderLanguages()}
        {renderPublications()}
        {renderVolunteer()}
      </article>
    );
  }

  // Template 4: Creative Layout
  if (template === "creative") {
    return (
      <article
        id="resume-preview-printable"
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft text-left",
          spacingClass.container,
        )}
        style={{ minHeight: "297mm" }}
      >
        <header className="flex items-center gap-4 border-b border-border pb-4 mb-3">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-extrabold shrink-0"
            style={{
              backgroundColor: `${accent}20`,
              color: accent,
              border: `2px solid ${accent}`,
            }}
          >
            {data.fullName
              ? data.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: accent }}>
              {data.fullName}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.experience[0]?.role || "Professional"}
            </p>
            <div className="mt-1.5 text-[10px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
              {data.email && (
                <a href={`mailto:${data.email}`} className="hover:underline text-muted-foreground">
                  {data.email}
                </a>
              )}
              {data.phone && (
                <span>
                  •{" "}
                  <a href={`tel:${data.phone}`} className="hover:underline text-muted-foreground">
                    {data.phone}
                  </a>
                </span>
              )}
              {data.location && <span>• {data.location}</span>}
              {data.website && (
                <span>
                  •{" "}
                  <a
                    href={
                      data.website.startsWith("http") ? data.website : `https://${data.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-semibold"
                    style={{ color: accent }}
                  >
                    Portfolio
                  </a>
                </span>
              )}
              {data.linkedin && (
                <span>
                  •{" "}
                  <a
                    href={
                      data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-semibold"
                    style={{ color: accent }}
                  >
                    LinkedIn
                  </a>
                </span>
              )}
              {data.github && (
                <span>
                  •{" "}
                  <a
                    href={data.github.startsWith("http") ? data.github : `https://${data.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-semibold"
                    style={{ color: accent }}
                  >
                    GitHub
                  </a>
                </span>
              )}
            </div>
          </div>
        </header>

        {renderSummary()}
        {renderExperience()}
        {renderProjects()}
        {renderEducation()}
        {renderSkills()}
        {renderCertifications()}
        {renderAchievements()}
        {renderLanguages()}
        {renderPublications()}
        {renderVolunteer()}
      </article>
    );
  }

  // Template 5: ATS Professional Layout
  return (
    <article
      id="resume-preview-printable"
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-white text-slate-800 shadow-soft text-center",
        spacingClass.container,
      )}
      style={{ minHeight: "297mm" }}
    >
      <header className="space-y-1 pb-2 border-b border-border mb-3">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
          {data.fullName}
        </h1>
        <div className="text-[10px] text-muted-foreground flex flex-wrap justify-center gap-x-3 gap-y-1">
          {data.email && (
            <a href={`mailto:${data.email}`} className="hover:underline text-muted-foreground">
              {data.email}
            </a>
          )}
          {data.phone && (
            <span>
              •{" "}
              <a href={`tel:${data.phone}`} className="hover:underline text-muted-foreground">
                {data.phone}
              </a>
            </span>
          )}
          {data.location && <span>• {data.location}</span>}
          {data.website && (
            <span>
              •{" "}
              <a
                href={data.website.startsWith("http") ? data.website : `https://${data.website}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-slate-800 font-semibold"
              >
                Portfolio
              </a>
            </span>
          )}
          {data.linkedin && (
            <span>
              •{" "}
              <a
                href={data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-slate-800 font-semibold"
              >
                LinkedIn
              </a>
            </span>
          )}
          {data.github && (
            <span>
              •{" "}
              <a
                href={data.github.startsWith("http") ? data.github : `https://${data.github}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-slate-800 font-semibold"
              >
                GitHub
              </a>
            </span>
          )}
        </div>
      </header>

      <div className="space-y-4 text-left">
        {renderSummary()}
        {renderExperience()}
        {renderProjects()}
        {renderEducation()}
        {renderSkills()}
        {renderCertifications()}
        {renderAchievements()}
        {renderLanguages()}
        {renderPublications()}
        {renderVolunteer()}
      </div>
    </article>
  );
}
