# 🕌 MimbarPro - AI Asisten Dakwah

MimbarPro adalah aplikasi Software-as-a-Service (SaaS) mutakhir berbasis **Kecerdasan Buatan (AI)** yang dirancang khusus untuk mempermudah para Da'i, Ustadz, dan umat Muslim dalam meracik teks ceramah berkualitas tinggi, inspiratif, dan selalu berlandaskan dalil yang sahih hanya dalam hitungan detik. 

Aplikasi ini dapat diakses pada semua perangkat (Responsif) serta memanfaatkan kekuatan **Google Gemini AI** untuk menghasilkan naskah ceramah lengkap dengan pengaturan bahasa dan target audiens yang detail.

---

## ✨ Fitur Utama
* **🧠 Pembuat Naskah Super Cepat:** Hasilkan ceramah Khotbah, Kultum, maupun Tausiyah lengkap dengan Mukadimah & Doa penutup otomatis.
* **🎯 Personalisasi Dakwah Tinggi:** Anda dapat mengatur parameter ceramah sesuai kebutuhan:
  * **Jenis Kegiatan**: *Kultum, Pengajian Rutin, Khotbah Jumat, Tausiyah Takziyah, Ceramah Hari Raya, dan Kajian Keluarga*.
  * **Target Audiens**: *Jamaah Umum, Milenial/Gen Z, Pekerja Kantoran, Ibu-ibu Majelis, hingga Anak-anak*.
  * **Gaya Bahasa**: *Menggugah, Lembut (Menyentuh), Logis, Santai, hingga Bercerita (Storytelling)*.
  * **Durasi Target**: *Singkat (5-7 Menit) hingga Ekstra Panjang (30+ Menit)*.
* **📖 Integrasi Dalil Cerdas:** Fitur opsional untuk wajib menyematkan ayat suci Al-Quran dan Hadits (min. berderajat Hasan).
* **💡 Asisten Penemu Topik:** Buntu ide? Cukup 1 kali klik, sistem secara acak-pintar *(smart shuffle)* memberikan ide topik dakwah yang relevan.
* **⬇️ Export PDF Satu Klik:** Ubah langsung hasil ceramah yang indah ke dalam dokumen cetak (PDF). Tanpa melewati kotak dialog Print peramban yang memusingkan!
* **🌗 Dark Mode:** Dukungan penuh mode gelap & terang (Sistem otomatis/manual toggle) untuk kenyamanan mata.
* **🛡️ Fallback API Terjamin:** Sistem dirancang stabil dengan dukungan mekanisme "Jaring Penyelamat" (API Fallback) untuk menjaga layanan selalu menyala saat melebihi target batasan kuota *LLM API*.

---

## 🛠️ Stack Teknologi

Proyek ini dibangun menggunakan kumpulan ekosistem terbaru:
* **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4
* **Ikon & Antarmuka**: Lucide React, React Toastify, React Markdown
* **Fitur Ekspor**: html2pdf.js
* **Backend LLM**: Google Gemini 2.5 Flash API (REST Native Integration)

---

## 🚀 Panduan Menjalankan di Komputer (Lokal)

1. Tiru (Kloning) repositori ini:
\`\`\`bash
git clone https://github.com/ichzid/mimbar-pro.git
cd mimbar-pro
\`\`\`

2. Pasang/Install seluruh dependensi:
\`\`\`bash
npm install
\`\`\`

3. Duplikasi berkas sampel environment dan atur API Key Anda. (Daftar API Key gratis di Google AI Studio)
\`\`\`bash
cp .env.example .env.local
\`\`\`
Isi \`.env.local\` dengan:
\`\`\`env
# Model Gemini yang digunakan
GEMINI_MODEL="gemini-2.5-flash"

# Primary Key
GEMINI_API_KEY="AIzaSy_KUNCI_UTAMA_ANDA"

# Backup (Optional - Digunakan saat Key Pertama kehabisan kuota limit)
GEMINI_API_KEY_BACKUP_1="AIzaSy_CADANGAN_1_ANDA"
GEMINI_API_KEY_BACKUP_2="AIzaSy_CADANGAN_2_ANDA"
\`\`\`

4. Jalankan mesin pengembangan!
\`\`\`bash
npm run dev
\`\`\`
Aplikasi akan langsung mengudara di \`http://localhost:3000\`.


## 🤝 Donasi & Kontribusi
Proyek ini bersifat terbuka untuk kontribusi publik. Layanan ini dibuat agar dapat dipergunakan gratis selamanya untuk amal jariyah bersama.

Jika aplikasi ini bermanfaat bagi dakwah Anda, jangan ragu untuk berinfak membantu perawatan peladen (Server & Kuota Limit AI) di:
💖 [Traktir Server (Infaq via Saweria)](https://saweria.co/ichzid)

---
*Dipersiapkan dengan sepenuh hati oleh IchZid & AI Assistant.*
