# 🕌 MimbarPro - AI Asisten Dakwah

MimbarPro adalah aplikasi SaaS berbasis **AI** yang dirancang untuk membantu para Da'i, Ustadz, dan umat Muslim dalam membuat naskah ceramah berkualitas tinggi, inspiratif, dan berlandaskan dalil yang sahih — hanya dalam hitungan detik.

Bisa diakses di semua perangkat (responsif) dan menggunakan **Google Gemini AI** untuk menghasilkan naskah ceramah lengkap dengan pengaturan bahasa dan target audiens yang fleksibel.

---

## ✨ Fitur Utama

- **🧠 Pembuat Naskah Super Cepat** — Hasilkan ceramah lengkap dengan mukadimah dan doa penutup secara otomatis, cocok untuk Khotbah, Kultum, maupun Tausiyah.
- **🎯 Personalisasi Dakwah** — Sesuaikan ceramah dengan kebutuhanmu:
  - **Jenis Kegiatan**: Kultum, Pengajian Rutin, Khotbah Jumat, Tausiyah Takziyah, Ceramah Hari Raya, Kajian Keluarga
  - **Target Audiens**: Jamaah Umum, Milenial/Gen Z, Pekerja Kantoran, Ibu-ibu Majelis, Anak-anak
  - **Gaya Bahasa**: Menggugah, Lembut, Logis, Santai, Storytelling
  - **Durasi**: Singkat (5-7 menit) sampai Ekstra Panjang (30+ menit)
- **📖 Integrasi Dalil Otomatis** — Opsi untuk menyematkan ayat Al-Quran dan Hadits (minimal berderajat Hasan).
- **💡 Generator Ide Topik** — Kehabisan ide? Satu klik langsung dapat topik dakwah yang relevan secara acak.
- **⬇️ Export PDF Satu Klik** — Langsung cetak hasil ceramah ke PDF tanpa repot lewat dialog print browser.
- **🌗 Dark Mode** — Dukungan mode gelap dan terang, bisa otomatis ikut sistem atau toggle manual.
- **🛡️ API Fallback** — Sistem tetap stabil meski kuota API utama habis, karena ada mekanisme fallback ke key cadangan.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4
- **UI & Ikon**: Lucide React, React Toastify, React Markdown
- **Export**: html2pdf.js
- **AI Backend**: Google Gemini 2.5 Flash API (Native REST)

---

## 🚀 Cara Menjalankan Secara Lokal

**1. Clone repo ini:**
```bash
git clone https://github.com/ichzid/mimbar-pro.git
cd mimbar-pro
```

**2. Install dependensi:**
```bash
npm install
```

**3. Buat file environment dan isi API Key kamu** (daftar gratis di [Google AI Studio](https://aistudio.google.com)):
```bash
cp .env.example .env.local
```

Isi `.env.local` dengan:
```env
# Model Gemini yang dipakai
GEMINI_MODEL="gemini-2.5-flash"

# API Key utama
GEMINI_API_KEY="AIzaSy_KUNCI_UTAMA_ANDA"

# Cadangan (opsional - aktif kalau key utama kehabisan kuota)
GEMINI_API_KEY_BACKUP_1="AIzaSy_CADANGAN_1_ANDA"
GEMINI_API_KEY_BACKUP_2="AIzaSy_CADANGAN_2_ANDA"
```

**4. Jalankan development server:**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🤝 Kontribusi & Donasi

Proyek ini open source dan gratis selamanya — semoga jadi amal jariyah bersama.

Kalau aplikasi ini bermanfaat untuk dakwahmu, kamu bisa bantu biaya server dan kuota AI di sini:

💖 [Infaq via Saweria](https://saweria.co/ichzid)

---

*Dibuat dengan sepenuh hati oleh IchZid & AI Assistant.*
