import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

// 🎤 HeyGen Voices API
const HEYGEN_API_BASE = "https://api.heygen.com";
const HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

interface HeyGenVoice {
  voice_id: string;
  language: string;
  gender: string;
  name: string;
  preview_audio?: string;
  support_interactive_avatar?: boolean;
}

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: "male" | "female" | "neutral";
  preview_audio?: string;
  description?: string;
}

async function getHeyGenVoices(): Promise<Voice[]> {
  if (!HEYGEN_API_KEY) {
    throw new Error("HeyGen API key not configured");
  }

  console.log("🎤 === HEYGEN VOICES REQUEST ===");
  console.log("🔑 API Key available:", !!HEYGEN_API_KEY);

  const response = await fetch(`${HEYGEN_API_BASE}/v2/voices`, {
    method: "GET",
    headers: {
      "x-api-key": HEYGEN_API_KEY,
      "Accept": "application/json",
    },
  });

  console.log("📡 Voices API Response:", response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Voices API error:", errorText);
    throw new Error(`HeyGen voices API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("📊 Raw voices response keys:", Object.keys(result));
  console.log("📊 Has data:", !!result.data);
  console.log("📊 Data structure:", result.data ? Object.keys(result.data) : "No data");
  
  if (!result.data || !result.data.voices || !Array.isArray(result.data.voices)) {
    console.error("❌ Invalid voices response structure:", result);
    throw new Error("Invalid voices response from HeyGen");
  }

  const voices = result.data.voices as HeyGenVoice[];
  console.log("🎤 Total voices received:", voices.length);

  // Filter Russian voices + some multilingual options
  const supportedVoices = voices.filter(voice => {
    const isRussian = voice.language?.toLowerCase().includes("russian");
    const isMultilingual = voice.language?.toLowerCase().includes("multilingual");
    return isRussian || isMultilingual;
  });

  console.log("🇷🇺 Russian/Multilingual voices found:", supportedVoices.length);

  // Map to our Voice interface
  const mappedVoices: Voice[] = supportedVoices.map(voice => ({
    id: voice.voice_id,
    name: voice.name || "Unknown Voice",
    language: voice.language || "Russian",
    gender: voice.gender?.toLowerCase() === "female" ? "female" : 
           voice.gender?.toLowerCase() === "male" ? "male" : "neutral",
    preview_audio: voice.preview_audio,
    description: `${voice.name} (${voice.language})`
  }));

  console.log("✅ Mapped voices:", mappedVoices.length);
  console.log("🎤 Sample voice:", mappedVoices[0]);

  return mappedVoices;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const voices = await getHeyGenVoices();

    res.status(200).json({
      success: true,
      voices,
      total: voices.length,
    });
  } catch (error) {
    console.error("❌ Voices API error:", error);
    res.status(500).json({
      success: false,
      error: String(error),
      voices: [],
      total: 0,
    });
  }
}