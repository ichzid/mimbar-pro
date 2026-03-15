"use client";
import ReactMarkdown from "react-markdown";
import { Copy, Download, Check, Heart, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface SermonResultProps {
  content: string;
  topic: string;
}

export default function SermonResult({ content, topic }: SermonResultProps) {
  const [copied, setCopied] = useState(false);

  const stripMarkdown = (markdown: string) =>
    markdown
      .replace(/[#*`~_]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/>\s*(.*)/g, "$1")
      .trim();

  const getPdfFilename = () => {
    // Gunakan topic yang diketik user sebagai judul PDF
    const cleanTopic = topic?.trim().replace(/[^\w\s-]/gi, "").trim().substring(0, 60);
    if (cleanTopic) return `MimbarPro - ${cleanTopic}.pdf`;

    // Fallback: ambil dari heading markdown
    const match = content.match(/^(?:#+|[*]*)\s*(.+)$/m);
    if (match && match[1]) {
      const clean = match[1].replace(/[^\w\s-]/gi, "").trim().substring(0, 60);
      return clean ? `MimbarPro - ${clean}.pdf` : "MimbarPro - Teks Ceramah.pdf";
    }
    return "MimbarPro - Teks Ceramah.pdf";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(stripMarkdown(content));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      const element = document.getElementById("pdf-content");
      if (!element) return;
      const toastId = toast.loading("Mempersiapkan Unduhan PDF...");
      const html2pdf = (await import("html2pdf.js")).default;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <div style="font-family: serif; line-height: 1.7; color: #000; font-size: 13pt;">
          ${element.innerHTML}
          <div style="margin-top: 48px; padding-top: 14px; border-top: 2px solid #14b89a; font-size: 9pt; color: #666; text-align: center; font-family: sans-serif;">
            Teks Ceramah dipersiapkan menggunakan kecerdasan buatan dari MimbarPro
          </div>
        </div>
      `;
      wrapper.querySelectorAll("h1, h2, h3, h4, p, li, strong").forEach((h) => {
        if (h.tagName === "H1") h.setAttribute("style", "font-size: 20pt; margin-top: 20px; border-bottom: 2px solid #14b89a; color: #000; font-weight: bold; margin-bottom: 20px; padding-bottom: 6px;");
        if (h.tagName === "H2") h.setAttribute("style", "font-size: 16pt; margin-top: 24px; color: #000; font-weight: bold; margin-bottom: 12px;");
        if (h.tagName === "H3") h.setAttribute("style", "font-size: 14pt; margin-top: 20px; color: #000; font-weight: bold; margin-bottom: 10px;");
        if (h.tagName === "P")  h.setAttribute("style", "margin-bottom: 16px; text-align: justify;");
        if (h.tagName === "LI") h.setAttribute("style", "margin-bottom: 8px;");
      });
      await html2pdf()
        .set({
          margin: 15,
          filename: getPdfFilename(),
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(wrapper)
        .save();
      toast.update(toastId, { render: "PDF berhasil diunduh!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("PDF error", error);
      toast.error("Terjadi kesalahan saat membuat PDF.");
    }
  };

  if (!content) return null;

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden shadow-xl shadow-brand-900/10 dark:shadow-brand-900/30"
      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
    >
      {/* Gold top border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

      {/* Header — NOT sticky, mengikuti flow normal agar tidak menimpa konten */}
      <div className="px-5 py-4 sm:px-6 flex items-center justify-between border-b border-brand-100/30 dark:border-brand-700/20">
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-gold-400 to-brand-500" />
          <div>
            <h2
              className="text-base font-bold text-brand-900 dark:text-white"
              style={{ fontFamily: "var(--font-amiri), serif" }}
            >
              Teks Ceramah Siap ✓
            </h2>
            {topic && (
              <p className="text-xs text-gold-600 dark:text-gold-400 font-medium mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                {topic}
              </p>
            )}
            {!topic && (
              <p className="text-xs text-brand-500 dark:text-brand-400 mt-0.5">
                Siap dibaca, disalin, atau diunduh sebagai PDF
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            title="Salin Teks"
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200
              bg-white/70 dark:bg-white/5 border border-brand-200/50 dark:border-brand-700/30
              text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-brand-500" />
              : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Tersalin!" : "Salin"}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            title="Unduh PDF"
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200
              bg-brand-600 text-white border border-brand-700
              hover:bg-brand-500 shadow-md shadow-brand-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Body — Markdown output */}
      <div className="bg-white/60 dark:bg-black/20 min-h-[40vh] max-h-[70vh] overflow-y-auto w-full">
        <div
          id="pdf-content"
          className="p-6 sm:p-8 selection:bg-brand-100 dark:selection:bg-brand-900/30
            prose prose-brand dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-brand-900 dark:prose-headings:text-brand-50
            prose-p:leading-relaxed prose-p:text-brand-800/90 dark:prose-p:text-brand-100/80
            prose-strong:text-brand-700 dark:prose-strong:text-brand-300
            prose-a:text-brand-600 dark:prose-a:text-brand-400"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 sm:px-6 border-t border-brand-100/30 dark:border-brand-700/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-brand-500/70 dark:text-brand-400/50">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Disusun oleh MimbarPro · AI Asisten Dakwah</span>
        </div>

        <a
          href="https://saweria.co/ichzid"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300
            bg-gradient-to-r from-gold-500/10 to-gold-400/10 dark:from-gold-500/10 dark:to-gold-400/5
            text-gold-700 dark:text-gold-400 border border-gold-300/40 dark:border-gold-600/30
            hover:from-gold-500/20 hover:to-gold-400/20 hover:border-gold-400/60
            shadow-sm hover:shadow-md hover:shadow-gold-500/10"
        >
          <Heart className="w-3.5 h-3.5 text-gold-500" />
          Infaq Perawatan Server
        </a>
      </div>
    </div>
  );
}
