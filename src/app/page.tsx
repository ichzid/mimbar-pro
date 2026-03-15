"use client";

import { useState } from "react";
import SermonForm from "@/components/SermonForm";
import SermonResult from "@/components/SermonResult";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";

export default function Home() {
  const [generatedSermon, setGeneratedSermon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sermonTopic, setSermonTopic] = useState<string>("");

  return (
    <div className="min-h-screen islamic-pattern-bg dark:bg-[#0a1628] pb-24 transition-colors duration-500">

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 transition-all duration-300">
        <div className="glass-card dark:border-brand-800/20 shadow-sm shadow-brand-500/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-400/20 rounded-xl blur-md" />
                <Image
                  src="/icon.png"
                  alt="MimbarPro Logo"
                  width={44}
                  height={44}
                  className="relative object-contain drop-shadow-md rounded-xl"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-brand-900 dark:text-brand-50 tracking-tight"
                  style={{ fontFamily: 'var(--font-amiri), serif', letterSpacing: '0.02em' }}>
                  MimbarPro
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 leading-none">
                  AI Asisten Dakwah
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <span
                className="hidden sm:block text-brand-400/60 dark:text-brand-500/40 text-xl select-none"
                style={{ fontFamily: 'var(--font-amiri), serif' }}
                title="Bismillah"
              >
                ﷽
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
        {/* Gold line separator */}
        <div className="gold-divider" />
      </header>

      {/* ===== MAIN ===== */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 w-full">

        {/* === HERO SECTION (only shown before generation) === */}
        {!generatedSermon && (
          <div className="text-center mb-10 animate-fade-slide-up">
            {/* Arabic Bismillah ornament */}
            <div
              className="text-3xl sm:text-4xl text-brand-600/50 dark:text-brand-400/30 mb-3 select-none"
              style={{ fontFamily: 'var(--font-amiri), serif' }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>

            {/* Geometric accent */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400/60" />
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-gold-500 opacity-70" fill="currentColor">
                <path d="M12 2L9.5 9.5H2L7.75 14L5.5 21L12 17L18.5 21L16.25 14L22 9.5H14.5L12 2Z" />
              </svg>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400/60" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-brand-950 dark:text-white leading-tight tracking-tight">
              Buat Ceramah{" "}
              <span className="shimmer-text">Berkualitas</span>
              <br />
              <span className="text-brand-700 dark:text-brand-300">dalam Hitungan Detik</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-brand-800/70 dark:text-brand-200/60 max-w-md mx-auto leading-relaxed">
              Kembangkan ide dakwah inspiratif dengan rujukan dalil sahih secara mudah, cepat, dan terpercaya.
            </p>

            {/* Stats badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[
                { icon: "✦", label: "Dalil Sahih" },
                { icon: "◈", label: "6 Jenis Ceramah" },
                { icon: "❋", label: "AI-Powered" },
              ].map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
                    bg-white/70 dark:bg-white/5 text-brand-700 dark:text-brand-300
                    border border-brand-200/60 dark:border-brand-700/30 backdrop-blur-sm"
                >
                  <span className="text-gold-500">{s.icon}</span>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* === FORM === */}
        <div className="w-full transition-all duration-700">
          <SermonForm
            onGenerated={setGeneratedSermon}
            onTopicChange={setSermonTopic}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* === RESULT === */}
        {generatedSermon && (
          <div className="w-full mt-6 animate-fade-slide-up">
            <SermonResult content={generatedSermon} topic={sermonTopic} />
          </div>
        )}

      </main>
    </div>
  );
}
