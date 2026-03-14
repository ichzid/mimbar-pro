"use client";

import { useState } from "react";
import { Sparkles, MessageCircle, Clock, Users, BookOpen, ToggleLeft, ToggleRight, Loader2, PenTool } from "lucide-react";
import { toast } from "react-toastify";

const TYPES = [
  { id: "kultum", label: "Kultum" },
  { id: "pengajian_rutin", label: "Pengajian Rutin" },
  { id: "khotbah_jumat", label: "Khotbah Jumat" },
  { id: "ceramah_hari_raya", label: "Ceramah Hari Raya" },
  { id: "kajian_keluarga", label: "Kajian Keluarga/Nikah" },
  { id: "tausiyah_kematian", label: "Tausiyah Takziyah (Belasungkawa)" },
];

const AUDIENCES = [
  { id: "umum", label: "Jamaah Umum / Masyarakat Masjid", desc: "Campuran berbagai usia, profesi. Bahasa sederhana, tema universal (syukur, sabar, shalat)." },
  { id: "milenial", label: "Anak Muda (Milenial / Gen Z)", desc: "Bahasa relatable, relevan dengan tren (sosmed, mental health), tidak menggurui." },
  { id: "ibu-ibu", label: "Ibu-ibu / Majelis Taklim", desc: "Seputar keluarga, mendidik anak, fiqih wanita. Interaktif dan emosional." },
  { id: "profesional", label: "Pekerja / Profesional", desc: "Audiens sibuk. Materi aplikatif kerja (etos kerja, rezeki halal, manajemen stres)." },
  { id: "keluarga", label: "Keluarga / Calon Pasangan", desc: "Fokus manajemen konflik rumah tangga, hak kewajiban suami istri, parenting." },
  { id: "anak-anak", label: "Pelajar / Anak-anak", desc: "Bahasa sangat sederhana, banyak ilustrasi, cerita, dan interaksi/kuis." },
];

const TONES = [
  { id: "menggugah", label: "Menggugah & Semangat" },
  { id: "lembut", label: "Lembut & Menyentuh" },
  { id: "logis", label: "Logis & Akademis" },
  { id: "santai", label: "Santai & Humoris" },
  { id: "tegas", label: "Tegas (Peringatan)" },
  { id: "bercerita", label: "Bercerita (Storytelling)" },
];

const DURATIONS = [
  { id: "singkat", label: "5-7 Menit" },
  { id: "sedang", label: "15 Menit" },
  { id: "panjang", label: "30+ Menit" },
];

interface SermonFormProps {
  onGenerated: (result: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function SermonForm({ onGenerated, isLoading, setIsLoading }: SermonFormProps) {
  const [topic, setTopic] = useState("");
  const [selectedType, setSelectedType] = useState("kultum");
  const [selectedAudience, setSelectedAudience] = useState("umum");
  const [selectedTone, setSelectedTone] = useState("menggugah");
  const [selectedDuration, setSelectedDuration] = useState("sedang");
  const [requireDalil, setRequireDalil] = useState(true);

  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestTopic = async () => {
    setIsSuggesting(true);
    try {
      // Memanggil Internal Next.js API kita sendiri (menjaga secret env variable)
      const res = await fetch("/api/topics", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType })
      });
      
      const data = await res.json();
      
      // Menyesuaikan dengan struktur data n8n (biasanya array berisi object)
      // Contoh: n8n mengembalikan { topics: ["Sabar", "Syukur"] } atau sekadar teks
      if (data.topics && data.topics.length > 0) {
        setTopic(data.topics[0]); 
      } else if (data[0] && data[0].topic) {
        setTopic(data[0].topic);
      } else if (typeof data === 'string') {
        setTopic(data);
      }
    } catch (error) {
      console.error("Failed to fetch topics", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Memanggil Internal API kita (ini akan diteruskan secara aman ke n8n oleh backend)
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic || "Pentingnya Menjaga Lisan", // Fallback if empty
          type: selectedType,
          audience: selectedAudience,
          tone: selectedTone,
          duration: selectedDuration,
          requireDalil,
        }),
      });

      const data = await res.json();
      
      // Menyesuaikan dengan struktur data n8n
      if (data.content) {
        onGenerated(data.content);
        toast.success("Teks ceramah berhasil dibuat");
      } else if (data[0] && data[0].content) {
        onGenerated(data[0].content);
        toast.success("Teks ceramah berhasil dibuat");
      } else if (typeof data === 'string') {
        onGenerated(data);
        toast.success("Teks ceramah berhasil dibuat");
      }
    } catch (error) {
      console.error("Failed to generate sermon", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden text-gray-800 dark:text-gray-100">
      <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
        <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">Mulai Buat Ceramah Sekarang</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 opacity-80">Sesuaikan preferensi ceramah Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 bg-white dark:bg-slate-900">
        {/* Jenis Ceramah dipindahkan ke paling atas */}

        {/* Jenis Ceramah */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Jenis Ceramah
          </label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`cursor-pointer px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedType === t.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none"
                    : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/60 dark:border-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Jamaah */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Target Jamaah
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AUDIENCES.map((a) => (
               <button
               key={a.id}
               type="button"
               onClick={() => setSelectedAudience(a.id)}
               className={`cursor-pointer text-left p-3 rounded-xl transition-all border ${
                 selectedAudience === a.id
                   ? "bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 shadow-sm"
                   : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
               }`}
             >
               <div className={`text-sm font-bold ${selectedAudience === a.id ? "text-emerald-800 dark:text-emerald-400" : "text-gray-700 dark:text-gray-200"}`}>
                 {a.label}
               </div>
               <div className={`text-[11px] mt-1 line-clamp-2 ${selectedAudience === a.id ? "text-emerald-600/80 dark:text-emerald-400/80" : "text-gray-500 dark:text-gray-400"}`}>
                 {a.desc}
               </div>
             </button>
            ))}
          </div>
        </div>

        {/* Tone/Gaya & Durasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Gaya Bahasa
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTone(t.id)}
                  className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedTone === t.id
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 border font-medium"
                      : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Durasi
            </label>
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
              {DURATIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDuration(d.id)}
                  className={`cursor-pointer flex-1 py-2 px-1 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                    selectedDuration === d.id
                      ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-slate-800" />

        {/* Topic Input (Moved here) */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <PenTool className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Topik atau Tema
          </label>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Contoh: Sabar & Shalat..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={handleSuggestTopic}
              disabled={isSuggesting}
              className="cursor-pointer px-4 py-3 h-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/60 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200 dark:border-emerald-700/50 whitespace-nowrap shadow-sm"
            >
              {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Bantu Cari Topik</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 pl-1">
            <span className="hidden sm:inline">Klik tombol di samping untuk mendapatkan ide topik instan dari AI berdasarkan pilihan tipe ceramah.</span>
            <span className="inline sm:hidden">Klik tombol di atas untuk mendapatkan ide topik otomatis.</span>
          </p>
        </div>

        <hr className="border-gray-100 dark:border-slate-800" />

        {/* Dalil Toggle */}
        <div className="flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50">
          <div>
             <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Sertakan Dalil Sahih</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ayat Al-Quran & Hadits (min. Hasan)</p>
          </div>
          <button 
            type="button" 
            onClick={() => setRequireDalil(!requireDalil)}
            role="switch"
            aria-checked={requireDalil}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
              requireDalil ? "bg-emerald-500" : "bg-gray-200 dark:bg-slate-600"
            }`}
          >
            <span className="sr-only">Toggle Dalil Sahih</span>
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                requireDalil ? "translate-x-3" : "-translate-x-3"
              }`}
            >
              {requireDalil && <Sparkles className="w-3.5 h-3.5 text-emerald-500" />}
            </span>
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 text-lg border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Harap tunggu... Menyiapkan naskah ceramah Anda.
            </>
          ) : (
            "Buat Ceramah Sekarang"
          )}
        </button>
      </form>
    </div>
  );
}
