import ReactMarkdown from "react-markdown";
import { Copy, Download, Check, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface SermonResultProps {
  content: string;
}

export default function SermonResult({ content }: SermonResultProps) {
  const [copied, setCopied] = useState(false);

  const stripMarkdown = (markdown: string) => {
    return markdown
      .replace(/[#*`~_]/g, "") // Removes basic markdown formatting symbols
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Extracts text from links
      .replace(/>\s*(.*)/g, "$1") // Formats blockquotes to regular text
      .trim();
  };

  const getSermonTitle = (markdown: string) => {
    // Cari baris pertama yang merupakan Heading Markdown (## Judul atau # Judul atau **Judul**)
    const match = markdown.match(/^(?:#+|[*]*)\s*(.+)$/m);
    
    // Jika ketemu ambil huruf abjad & spasinya saja (max 50 char). Jika gagal, gunakan fallback
    if (match && match[1]) {
        let cleanTitle = match[1].replace(/[^\w\s-]/gi, '').trim().substring(0, 50);
        return cleanTitle ? `MimbarPro - ${cleanTitle}.pdf` : 'MimbarPro - Teks Ceramah.pdf';
    }
    
    return 'MimbarPro - Teks Ceramah.pdf';
  };

  const handleCopy = () => {
    const plainText = stripMarkdown(content);
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      const element = document.getElementById("pdf-content");
      if (!element) return;
      
      const toastId = toast.loading("Mempersiapkan Unduhan PDF...");
      
      // Dynamic import to avoid SSR 'window is not defined' errors
      const html2pdf = (await import("html2pdf.js")).default;
      
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <div style="font-family: serif; line-height: 1.6; color: #000; font-size: 14pt;">
          ${element.innerHTML}
          <div style="margin-top: 50px; padding-top: 15px; border-top: 1px solid #ccc; font-size: 10pt; color: #555; text-align: center; font-family: sans-serif;">
            Teks Ceramah dipersiapkan menggunakan kecerdasan buatan dari MimbarPro
          </div>
        </div>
      `;

      // Inject robust inline styling to override tailwind reset/class bugs during html2canvas render
      const headings = wrapper.querySelectorAll("h1, h2, h3, h4, p, li, strong");
      headings.forEach(h => {
          if (h.tagName === 'H1') h.setAttribute('style', 'font-size: 20pt; padding-bottom: 5px; margin-top: 20px; border-bottom: 2px solid #20bc82; color: #000; font-weight: bold; margin-bottom: 20px;');
          if (h.tagName === 'H2') h.setAttribute('style', 'font-size: 16pt; margin-top: 24px; color: #000; font-weight: bold; margin-bottom: 12px;');
          if (h.tagName === 'H3') h.setAttribute('style', 'font-size: 14pt; margin-top: 20px; color: #000; font-weight: bold; margin-bottom: 10px;');
          if (h.tagName === 'P') h.setAttribute('style', 'margin-bottom: 16px; text-align: justify;');
          if (h.tagName === 'LI') h.setAttribute('style', 'margin-bottom: 8px;');
          if (h.tagName === 'STRONG') h.setAttribute('style', 'font-weight: bold;');
      });

      const pdfFileName = getSermonTitle(content);

      const opt: any = {
        margin:       15,
        filename:     pdfFileName,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(wrapper).save();
      
      toast.update(toastId, { render: "PDF berhasil diunduh!", type: "success", isLoading: false, autoClose: 3000 });

    } catch (error) {
      console.error("Failed to generate PDF", error);
      toast.error("Terjadi kesalahan saat membuat PDF.");
    }
  };

  if (!content) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 overflow-hidden text-gray-800 dark:text-gray-100 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {/* Result Header */}
      <div className="p-4 sm:p-5 pb-3 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/80 dark:bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-bold font-serif text-gray-800 dark:text-gray-100">Teks Ceramah Selesai</h2>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Siap dibaca atau disimpan.</p>
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          <button
            onClick={handleCopy}
            className="cursor-pointer p-2 sm:px-3 sm:py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-center gap-2 transition-all tooltip tooltip-bottom"
            title="Salin Teks"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline font-medium">{copied ? "Tersalin" : "Salin"}</span>
          </button>
          
          <button 
            onClick={handleDownloadPdf}
            className="cursor-pointer p-2 sm:px-3 sm:py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">PDF</span>
          </button>
        </div>
      </div>

      {/* Result Body (Markdown) */}
      <div className="bg-white dark:bg-slate-900 min-h-[40vh] max-h-[70vh] overflow-y-auto w-full">
        <div id="pdf-content" className="p-5 sm:p-8 selection:bg-emerald-100 dark:selection:bg-emerald-900/30 prose prose-emerald dark:prose-invert prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-a:text-emerald-600 dark:prose-a:text-emerald-400">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      
      {/* Footer Info & Donasi */}
      <div className="px-5 py-4 sm:px-8 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/80 text-xs text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>Disusun oleh MimbarPro</span>
        
        <a 
          href="https://saweria.co/ichzid" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 dark:text-emerald-400 px-4 py-1.5 rounded-full font-semibold transition-colors duration-300 shadow-sm"
        >
          <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Infaq Perawatan Server
        </a>
      </div>
    </div>
  );
}
