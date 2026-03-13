"use client";

import { useState } from "react";
import SermonForm from "@/components/SermonForm";
import SermonResult from "@/components/SermonResult";
import ThemeToggle from "@/components/ThemeToggle";
import { BookOpenText } from "lucide-react";

export default function Home() {
  const [generatedSermon, setGeneratedSermon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
             <div className="bg-emerald-600 dark:bg-emerald-700 p-2 rounded-xl shadow-inner shadow-emerald-400/20">
               <BookOpenText className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="text-xl font-bold font-serif text-emerald-950 dark:text-emerald-50">MimbarPro</h1>
               <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 leading-none">AI Asisten Dakwah</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full mt-2">
        <div className="flex flex-col gap-8 w-full items-center">
          
          {/* Top: Form */}
          <div className="w-full transition-all duration-700">
            {!generatedSermon && (
               <div className="text-center w-full mb-8 lg:mt-6">
                 <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-50 tracking-tight leading-tight">Buat Ceramah<br/>dalam Hitungan Detik.</h2>
                 <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md mx-auto sm:text-lg">Kembangkan ide dakwah inspiratif dengan rujukan dalil sahih secara mudah dan praktis.</p>
               </div>
            )}

            
            <SermonForm 
              onGenerated={setGeneratedSermon} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
            />
          </div>

          {/* Bottom: Result */}
          {generatedSermon && (
             <div className="w-full animate-in fade-in slide-in-from-bottom-4">
                <SermonResult content={generatedSermon} />
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
