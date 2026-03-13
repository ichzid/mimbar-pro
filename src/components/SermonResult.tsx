import ReactMarkdown from "react-markdown";
import { Copy, Download, Share2, Check } from "lucide-react";
import { useState } from "react";

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

  const handleCopy = () => {
    const plainText = stripMarkdown(content);
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    try {
      const element = document.getElementById("pdf-content");
      if (!element) return;
      
      // We use a dynamically injected iframe to run standard browser printing,
      // avoiding any color parsing bugs from html2pdf/html2canvas with Tailwind v4
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      
      const pri = iframe.contentWindow;
      if (!pri) return;

      pri.document.open();
      pri.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>MimbarPro - Teks Ceramah</title>
            <style>
              @page { size: A4; margin: 15mm; }
              body { 
                font-family: serif; 
                line-height: 1.6; 
                color: #000; 
                font-size: 14pt;
              }
              h1, h2, h3, h4 { color: #000; font-weight: bold; margin-bottom: 8px; }
              h1 { font-size: 20pt; padding-bottom: 5px; margin-top: 20px; border-bottom: 2px solid #20bc82; }
              h2 { font-size: 16pt; margin-top: 24px; }
              h3 { font-size: 14pt; margin-top: 20px; }
              p { margin-bottom: 16px; text-align: justify; }
              ul, ol { margin-bottom: 16px; padding-left: 20px; }
              li { margin-bottom: 8px; }
              strong { font-weight: bold; }
              
              /* Optional Footer styling */
              .footer { 
                margin-top: 50px; 
                padding-top: 15px; 
                border-top: 1px solid #ccc; 
                font-size: 10pt; 
                color: #555; 
                text-align: center; 
                font-family: sans-serif;
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
            <div class="footer">
              Teks Ceramah dipersiapkan menggunakan kecerdasan buatan dari MimbarPro (Mimbar Profesional)
            </div>
            
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
                  window.print();
                }, 250);
              };
            </script>
          </body>
        </html>
      `);
      pri.document.close();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 5000); // Wait long enough for the print dialog to open before cleaning up
      
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Terjadi kesalahan saat membuat PDF.");
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
      
      {/* Footer Info */}
      <div className="px-5 py-3 sm:px-8 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-xs text-gray-500 dark:text-gray-400 text-center">
        Disusun oleh MimbarPro MVP
      </div>
    </div>
  );
}
