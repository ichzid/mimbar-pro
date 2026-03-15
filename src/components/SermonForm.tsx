"use client";

import { useState } from "react";
import {
  Sparkles, MessageCircle, Clock, Users, BookOpen,
  Loader2, PenTool, ChevronRight
} from "lucide-react";
import { toast } from "react-toastify";

const TYPES = [
  { id: "kultum",              label: "Kultum",           icon: "🕌" },
  { id: "pengajian_rutin",     label: "Pengajian Rutin",  icon: "📖" },
  { id: "khotbah_jumat",       label: "Khotbah Jumat",    icon: "🕋" },
  { id: "ceramah_hari_raya",   label: "Ceramah Hari Raya",icon: "🌙" },
  { id: "kajian_keluarga",     label: "Kajian Nikah",     icon: "💍" },
  { id: "tausiyah_kematian",   label: "Tausiyah Takziyah",icon: "🤲" },
];

const AUDIENCES = [
  { id: "umum",         label: "Jamaah Umum",        desc: "Campuran berbagai usia, bahasa universal", icon: "🕌" },
  { id: "milenial",     label: "Anak Muda",           desc: "Relatable, relevan, tidak menggurui",      icon: "📱" },
  { id: "ibu-ibu",      label: "Ibu-ibu / Majelis",  desc: "Keluarga, fiqih wanita, emosional",        icon: "👩" },
  { id: "profesional",  label: "Pekerja Profesional", desc: "Etos kerja, rezeki halal, aplikatif",      icon: "💼" },
  { id: "keluarga",     label: "Keluarga / Pasangan", desc: "Rumah tangga Islami & parenting",          icon: "👨‍👩‍👧" },
  { id: "anak-anak",    label: "Pelajar / Anak",      desc: "Sederhana, ceria, banyak ilustrasi",       icon: "🎒" },
];

const TONES = [
  { id: "menggugah",  label: "Menggugah",  icon: "🔥" },
  { id: "lembut",     label: "Lembut",     icon: "🌷" },
  { id: "logis",      label: "Akademis",   icon: "🧠" },
  { id: "santai",     label: "Santai",     icon: "😊" },
  { id: "tegas",      label: "Tegas",      icon: "⚡" },
  { id: "bercerita",  label: "Storytelling", icon: "📚" },
];

const DURATIONS = [
  { id: "singkat", label: "5 – 7 Menit",  icon: "⚡" },
  { id: "sedang",  label: "15 Menit",     icon: "🕐" },
  { id: "panjang", label: "30+ Menit",    icon: "📜" },
];

interface SermonFormProps {
  onGenerated: (result: string) => void;
  onTopicChange: (topic: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

/* ===================================================
   Section Label Component
=================================================== */
function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-brand-800 dark:text-brand-200 mb-3">
      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-100 dark:bg-brand-900/40">
        <Icon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
      </span>
      {label}
    </label>
  );
}

/* ===================================================
   Main Form
=================================================== */
export default function SermonForm({ onGenerated, onTopicChange, isLoading, setIsLoading }: SermonFormProps) {
  const [topic, setTopic] = useState("");

  const updateTopic = (value: string) => {
    setTopic(value);
    onTopicChange(value);
  };
  const [selectedType, setSelectedType] = useState("kultum");
  const [selectedAudience, setSelectedAudience] = useState("umum");
  const [selectedTone, setSelectedTone] = useState("menggugah");
  const [selectedDuration, setSelectedDuration] = useState("sedang");
  const [requireDalil, setRequireDalil] = useState(true);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestTopic = async () => {
    setIsSuggesting(true);
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType }),
      });
      const data = await res.json();
      if (data.topics && data.topics.length > 0) updateTopic(data.topics[0]);
      else if (data[0] && data[0].topic) updateTopic(data[0].topic);
      else if (typeof data === "string") updateTopic(data);
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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic || "Pentingnya Menjaga Lisan",
          type: selectedType,
          audience: selectedAudience,
          tone: selectedTone,
          duration: selectedDuration,
          requireDalil,
        }),
      });
      const data = await res.json();
      if (data.content) {
        onGenerated(data.content);
        toast.success("Teks ceramah berhasil dibuat");
      } else if (data[0] && data[0].content) {
        onGenerated(data[0].content);
        toast.success("Teks ceramah berhasil dibuat");
      } else if (typeof data === "string") {
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
    <div
      className="glass-card rounded-2xl overflow-hidden shadow-xl shadow-brand-900/10 dark:shadow-brand-900/30"
      style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
    >
      {/* === Card Header === */}
      <div className="relative p-5 sm:p-6 pb-4 overflow-hidden">
        {/* Gold accent top border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

        {/* Decorative arabic star */}
        <div className="absolute right-5 top-4 text-4xl text-brand-200/20 dark:text-brand-700/20 select-none pointer-events-none"
          style={{ fontFamily: 'var(--font-amiri), serif' }}>
          ✦
        </div>

        <div className="flex items-center gap-3">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-gold-400 to-brand-500" />
          <div>
            <h2
              className="text-lg font-bold text-brand-900 dark:text-white"
              style={{ fontFamily: 'var(--font-amiri), serif' }}
            >
              Mulai Buat Ceramah Sekarang
            </h2>
            <p className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-0.5">
              Sesuaikan preferensi ceramah Anda di bawah ini
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-brand-200/60 dark:via-brand-700/40 to-transparent" />

      {/* === Form Body === */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-7">

        {/* Jenis Ceramah */}
        <div>
          <SectionLabel icon={BookOpen} label="Jenis Ceramah" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`cursor-pointer relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left flex items-center gap-2 border ${
                  selectedType === t.id
                    ? "bg-brand-600 text-white border-brand-700 shadow-lg shadow-brand-500/30 dark:shadow-brand-900/40 scale-[1.02]"
                    : "bg-white/60 dark:bg-white/5 text-brand-800 dark:text-brand-200 border-brand-100/60 dark:border-brand-700/20 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-300 dark:hover:border-brand-600"
                }`}
              >
                <span className="text-base">{t.icon}</span>
                <span className="leading-tight">{t.label}</span>
                {selectedType === t.id && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Target Jamaah */}
        <div>
          <SectionLabel icon={Users} label="Target Jamaah" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedAudience(a.id)}
                className={`cursor-pointer text-left px-4 py-3 rounded-xl transition-all duration-200 border group ${
                  selectedAudience === a.id
                    ? "bg-brand-600/10 dark:bg-brand-400/10 border-brand-400 dark:border-brand-500"
                    : "bg-white/50 dark:bg-white/5 border-brand-100/50 dark:border-brand-800/30 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50/50 dark:hover:bg-brand-900/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{a.icon}</span>
                  <div>
                    <div className={`text-sm font-semibold transition-colors ${
                      selectedAudience === a.id
                        ? "text-brand-700 dark:text-brand-300"
                        : "text-brand-900 dark:text-brand-100 group-hover:text-brand-700 dark:group-hover:text-brand-300"
                    }`}>
                      {a.label}
                    </div>
                    <div className={`text-[11px] mt-0.5 line-clamp-1 transition-colors ${
                      selectedAudience === a.id
                        ? "text-brand-600/80 dark:text-brand-400/80"
                        : "text-brand-600/50 dark:text-brand-400/50"
                    }`}>
                      {a.desc}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gaya Bahasa & Durasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gaya Bahasa */}
          <div>
            <SectionLabel icon={MessageCircle} label="Gaya Bahasa" />
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTone(t.id)}
                  className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                    selectedTone === t.id
                      ? "bg-gold-500/10 dark:bg-gold-400/10 text-gold-700 dark:text-gold-300 border-gold-400/60 dark:border-gold-500/40"
                      : "bg-white/50 dark:bg-white/5 text-brand-700 dark:text-brand-300 border-brand-100/50 dark:border-brand-800/30 hover:border-brand-300 dark:hover:border-brand-600"
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Durasi */}
          <div>
            <SectionLabel icon={Clock} label="Durasi Ceramah" />
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDuration(d.id)}
                  className={`cursor-pointer flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                    selectedDuration === d.id
                      ? "bg-brand-600 text-white border-brand-700 shadow-md shadow-brand-500/25 scale-[1.03]"
                      : "bg-white/50 dark:bg-white/5 text-brand-700 dark:text-brand-300 border-brand-100/50 dark:border-brand-800/30 hover:border-brand-300 dark:hover:border-brand-600"
                  }`}
                >
                  <span className="text-base">{d.icon}</span>
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gold separator */}
        <div className="gold-divider" />

        {/* Topik / Tema */}
        <div>
          <SectionLabel icon={PenTool} label="Topik atau Tema" />
          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Contoh: Sabar dalam Ujian, Keutamaan Shalat..."
                value={topic}
                onChange={(e) => updateTopic(e.target.value)}
                className="w-full bg-white/70 dark:bg-white/5 border border-brand-200/60 dark:border-brand-700/30 rounded-xl px-4 py-3 text-sm text-brand-900 dark:text-white placeholder:text-brand-400/60 dark:placeholder:text-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleSuggestTopic}
              disabled={isSuggesting}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border
                bg-gold-50 dark:bg-gold-900/20 text-gold-800 dark:text-gold-300 border-gold-200 dark:border-gold-700/40
                hover:bg-gold-100 dark:hover:bg-gold-800/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
            >
              {isSuggesting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Sparkles className="w-4 h-4" />
              }
              Bantu Cari Topik
            </button>
          </div>
          <p className="text-[11px] text-brand-500/70 dark:text-brand-400/50 mt-2 pl-1">
            Kosongkan jika ingin AI memilih topik berdasarkan jenis & audiens. Atau klik &quot;Bantu Cari Topik&quot; untuk saran instan.
          </p>
        </div>

        {/* Dalil Toggle */}
        <div className="flex items-center justify-between bg-brand-50/80 dark:bg-brand-900/20 border border-brand-100/60 dark:border-brand-700/20 rounded-xl px-4 py-3.5">
          <div>
            <h4 className="text-sm font-bold text-brand-900 dark:text-brand-100 flex items-center gap-1.5">
              📜 Sertakan Dalil Sahih
            </h4>
            <p className="text-xs text-brand-600/70 dark:text-brand-400/60 mt-0.5">
              Ayat Al-Quran & Hadits (min. derajat Hasan)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRequireDalil(!requireDalil)}
            role="switch"
            aria-checked={requireDalil}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500  ${
              requireDalil
                ? "bg-brand-500"
                : "bg-brand-200/50 dark:bg-brand-800/50"
            }`}
          >
            <span className="sr-only">Toggle Dalil</span>
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                requireDalil ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer group w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300
            relative overflow-hidden
            bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600
            text-white shadow-xl shadow-brand-600/30 dark:shadow-brand-900/40
            disabled:opacity-70 disabled:cursor-not-allowed
            active:scale-[0.98]"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Harap tunggu... Menyiapkan naskah ceramah Anda.
              </>
            ) : (
              <>
                Buat Ceramah Sekarang
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
