import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    // Mengumpulkan semua API Key yang tersedia (Utama + Cadangan)
    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_BACKUP_1,
      process.env.GEMINI_API_KEY_BACKUP_2
    ].filter(Boolean) as string[];

    if (apiKeys.length === 0 || apiKeys[0] === "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
      return NextResponse.json({ 
        topics: [`Ini contoh topik simulasi untuk: ${type}. Silakan isi GEMINI_API_KEY di .env.local`] 
      });
    }

    const prompt = `Anda adalah asisten perumus judul ceramah Islami.
Berikan 1 ide judul ceramah yang ringkas (maksimal 6 kata) dan memikat, khusus untuk jenis kegiatan: ${type}.
Kembalikan respon DALAM FORMAT JSON SEPERTI INI SAJA TANPA MARKDOWN:
{ "topics": ["Judul Saran Anda"] }`;

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
        console.warn(`[Topics API] Key gagal, mencoba kunci cadangan berikutnya...`);
        lastError = err;
        // Akan otomatis lanjut ke putaran berikutnya (key cadangan selanjutnya)
      }
    }

    // Jika setelah semua putaran gagal, lemparkan error untuk memicu Fallback statis
    if (!isSuccess) {
      throw lastError || new Error("Semua API Key (Utama & Cadangan) telah gagal/habis limit.");
    }

    return NextResponse.json(parsedContent);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // Fallback Responses: Jika LLM gagal (limit, timeout, apiKey salah)
    const fallbackTopics = [
      "Keutamaan Sabar dan Shalat",
      "Pentingnya Menjaga Lisan",
      "Membangun Keluarga Sakinah",
      "Sedekah Menolak Bala",
      "Menjemput Rezeki yang Halal"
    ];
    
    // Jangan lempar error 500 ke frontend, berikan saran topik otomatis
    return NextResponse.json({ topics: fallbackTopics });
  }
}
