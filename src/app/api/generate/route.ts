import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const preferences = await req.json();

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    // Mengumpulkan semua API Key yang tersedia (Utama + Cadangan)
    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_BACKUP_1,
      process.env.GEMINI_API_KEY_BACKUP_2
    ].filter(Boolean) as string[];

    if (apiKeys.length === 0 || apiKeys[0] === "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
      return NextResponse.json({ 
        content: `**Simulasi Hasil Ceramah**\n\nGEMINI_API_KEY belum dikonfigurasi dengan benar di file .env.local Anda.\n\nPreferensi yang Anda kirimkan:\n- Topik: ${preferences.topic}\n- Jenis: ${preferences.type}\n- Durasi: ${preferences.duration}` 
      });
    }

    let depthInstruction = "";
    if (preferences.duration === "singkat") {
      depthInstruction = "SANGAT PENDEK & RINGKAS (Target: 500 - 700 kata saja. Cocok untuk 5-7 Menit). Harus langsung ke inti poin tanpa basa-basi panjang bulat.";
    } else if (preferences.duration === "sedang") {
      depthInstruction = "MENENGAH & STANDAR (Target: 1200 - 1500 kata. Cocok untuk 15 Menit). Penjelasan sedang, dalil dijabarkan secukupnya, dan ada penjabaran ringan.";
    } else if (preferences.duration === "panjang") {
      depthInstruction = "HINDARI HASIL RANGKUMAN! SANGAT PANJANG & MENDALAM (Target: Minimum 2500 kata. Cocok untuk ceramah 30+ Menit). Harus super detil, elaborasi mendalam, kaya akan hikmah/cerita panjang, rincian hadits/tafsir, dan berbagai contoh.";
    } else {
      depthInstruction = preferences.duration;
    }

    const prompt = `Anda adalah seorang Ustadz dan Khatib yang ahli menyusun materi ceramah.
Buat teks ceramah dengan kriteria berikut:

Topik: ${preferences.topic}
Jenis Kegiatan: ${preferences.type}
Gaya Bahasa: ${preferences.tone}
Target Audiens: ${preferences.audience}
Durasi & Panjang Teks: ${depthInstruction}
Wajib Dalil Sahih: ${preferences.requireDalil}

Instruksi Format:
1. Gunakan format Markdown (menggunakan ## untuk sub-judul, *italic*, **bold**).
2. Mulai dengan salam pembuka Arab yang sesuai dengan "Jenis Kegiatan".
3. Tuliskan paragraf pembuka (mukadimah).
4. Jika "Wajib Dalil Sahih" adalah true, berikan minimal 1 ayat Al-Quran dan 1 Hadits Sahih/Hasan lengkap dengan terjemahannya dan referensinya.
5. Buat struktur penutup dan doa yang khidmat.
6. SANGAT PENTING: Kembalikan hasil tulisan Anda ini murni ke dalam format JSON dengan "KEY" content.

CONTOH STRUKTUR JSON YANG DIHARAPKAN:
{
  "content": "Assalamu'alaikum warahmatullahi wabarakatuh...\\n\\n## Pendahuluan\\n\\nPuji syukur..."
}`;

    let parsedContent = null;
    let lastError = null;
    let isSuccess = false;

    // Loop mencoba satu per satu API Key
    for (const key of apiKeys) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`Gemini API responded with status: ${response.status}`);
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;
        parsedContent = JSON.parse(content);

        // Berhasil mendapatkan respons, tandai sukses dan hentikan loop
        isSuccess = true;
        break;
        
      } catch (err) {
        console.warn(`[Generate API] Key gagal, mencoba kunci cadangan berikutnya...`);
        lastError = err;
        // Akan otomatis lanjut ke putaran berikutnya (key cadangan selanjutnya)
      }
    }

    // Jika setelah semua putaran gagal, lemparkan error untuk memicu Fallback Statik
    if (!isSuccess) {
      throw lastError || new Error("Semua API Key (Utama & Cadangan) telah gagal/habis limit.");
    }

    return NextResponse.json(parsedContent);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // Static Fallback Sermon (Sebagai Jaring Pengaman)
    const fallbackContent = `Assalamu'alaikum warahmatullahi wabarakatuh.

Innal hamda lillah, nahmaduhu wa nasta'inuhu wa nastaghfiruh.

Hadirin jamaah yang dimuliakan Allah,
*(Pemberitahuan Sistem: Server AI kami saat ini sedang mengalami antrean padat atau batas limit permintaan (token) Gemini telah tercapai. Namun jangan khawatir, kami telah menyiapkan materi ceramah darurat ini untuk Anda)*.

## Pentingnya Bersyukur di Setiap Keadaan

Segala puji mutlak hanya milik Allah SWT yang tak henti-hentinya mencurahkan nikmat sehat, waktu luang, dan keimanan kepada kita. Shalawat tak lupa terus kita sanjungkan kepada teladan umat, Nabi Muhammad SAW.

Bersyukur adalah sifat para Nabi dan amalan hati yang paling agung. Allah memberikan garansi kepastian bagi siapa saja yang mengayunkan bibirnya untuk bersyukur. 

Allah Ta'ala berfirman dalam kitab-Nya yang mulia:

> *"Dan (ingatlah juga), tatkala Tuhanmu memaklumkan: 'Sesungguhnya jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu, dan jika kamu mengingkari (nikmat-Ku), maka sesungguhnya azab-Ku sangat pedih'."* **(QS. Ibrahim: 7)**

Hadirin yang berbahagia, rasa syukur bukan hanya diucapkan di lisan, tapi ditanamkan dalam hati bahwa semua rezeki datang dari Allah, dan diwujudkan dengan amal perbuatan yakni menggunakan rezeki tersebut untuk hal-hal yang diperintahkan Allah.

Semoga kita semua terus senantiasa dilindungi oleh Allah dan dicatat sebagai hamba-hamba-Nya yang pandai bersyukur abadi. Amin ya Rabbal'alamin.

Wabillahi taufiq wal hidayah,
Wassalamu'alaikum warahmatullahi wabarakatuh.`;

    // Kita return status HTTP sukses (200) dengan konten cadangan agar UI tidak pecah/error
    return NextResponse.json({ content: fallbackContent });
  }
}
