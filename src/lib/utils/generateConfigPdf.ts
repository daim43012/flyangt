import { jsPDF } from "jspdf";

type PickedOption = { title: string; price: number; weightKg: number };

interface ConfigPdfData {
  picked: PickedOption[];
  totalPrice: number;
  totalWeightKg: number;
  leadDays: number;
}

const ACCENT = [176, 141, 87] as const;    // bronze
const TEXT = [18, 20, 22] as const;         // --text-main
const MUTED = [100, 116, 139] as const;    // --text-muted
const BG = [246, 242, 234] as const;       // --bg-main
const LINE = [220, 216, 208] as const;

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export async function generateConfigPdf(data: ConfigPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = W - margin * 2;
  let y = 20;

  // --- Logo ---
  try {
    const res = await fetch("/images/logo.png");
    const blob = await res.blob();
    const dataUrl = await blobToDataUrl(blob);
    doc.addImage(dataUrl, "PNG", margin, y, 18, 18);
  } catch {
    // skip logo if unavailable
  }

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...TEXT);
  doc.text("ANG-01 Configuration", margin + 22, y + 10);

  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin + 22, y + 16);

  y += 28;

  // --- Accent line ---
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.8);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // --- Selected options ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...ACCENT);
  doc.text("SELECTED OPTIONS", margin, y);
  y += 8;

  for (const item of data.picked) {
    // Option row with background
    doc.setFillColor(...BG);
    doc.roundedRect(margin, y - 4.5, contentW, 9, 2, 2, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...TEXT);
    doc.text(item.title, margin + 4, y);

    const priceText = `+$${fmt(item.price)}`;
    const weightText = `${item.weightKg} kg`;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...ACCENT);
    doc.text(priceText, W - margin - 30, y, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(weightText, W - margin - 4, y, { align: "right" });

    y += 12;
  }

  y += 4;

  // --- Divider ---
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(margin, y, W - margin, y);
  y += 12;

  // --- Summary rows ---
  const summaryRows = [
    { label: "TOTAL PRICE", value: `$ ${fmt(data.totalPrice)}` },
    { label: "ESTIMATED WEIGHT", value: `${fmt(data.totalWeightKg)} kg` },
    { label: "LEAD TIME", value: `${data.leadDays} days` },
  ];

  for (const row of summaryRows) {
    doc.setFillColor(...BG);
    doc.roundedRect(margin, y - 5, contentW, 12, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(row.label, margin + 6, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...TEXT);
    doc.text(row.value, W - margin - 6, y + 1, { align: "right" });

    y += 18;
  }

  y += 4;

  // --- Legal note ---
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(margin, y, W - margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "* Price excludes taxes and delivery. Weight is an estimate. Configuration subject to availability.",
    margin,
    y
  );
  y += 5;
  doc.text(
    "This document is for informational purposes only and does not constitute a binding offer.",
    margin,
    y
  );

  // --- Footer ---
  const footerY = doc.internal.pageSize.getHeight() - 14;
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 4, W - margin, footerY - 4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...ACCENT);
  doc.text("FlyANGT", margin, footerY);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("flyangt.com", W - margin, footerY, { align: "right" });

  // --- Save ---
  doc.save("ANG-01-Configuration.pdf");
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
