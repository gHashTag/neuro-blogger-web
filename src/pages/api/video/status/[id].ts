import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

// 🎬 HeyGen Video Status API
const HEYGEN_API_BASE = "https://api.heygen.com";
const HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

interface HeyGenStatusResponse {
  status?: string;
  video_url?: string;
  thumbnail_url?: string;
  error?: {
    code: string;
    message: string;
  };
  data?: {
    status: string;
    video_url?: string;
    thumbnail_url?: string;
  };
}

async function checkHeyGenVideoStatus(videoId: string): Promise<any> {
  if (!HEYGEN_API_KEY) {
    throw new Error("HeyGen API key not configured");
  }

  const statusEndpoints = [
    `${HEYGEN_API_BASE}/v1/video_status?video_id=${videoId}`,
    `${HEYGEN_API_BASE}/v2/video_status?video_id=${videoId}`,
    `${HEYGEN_API_BASE}/v1/video/${videoId}`,
    `${HEYGEN_API_BASE}/v2/video/${videoId}`,
    `${HEYGEN_API_BASE}/v1/video/${videoId}/status`,
    `${HEYGEN_API_BASE}/v2/video/${videoId}/status`,
  ];

  let lastError = null;

  for (const endpoint of statusEndpoints) {
    try {
      console.log(`🔍 Checking status: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "X-API-Key": HEYGEN_API_KEY,
          "Accept": "application/json",
        },
      });

      console.log(`📡 ${endpoint} → ${response.status} ${response.statusText}`);

      if (response.ok) {
        const result: HeyGenStatusResponse = await response.json();
        console.log(`✅ Status from ${endpoint}:`, result);
        return result;
      } else {
        const errorText = await response.text();
        console.log(`❌ ${endpoint} failed: ${response.status} - ${errorText}`);
        lastError = `${response.status}: ${errorText}`;
      }
    } catch (error) {
      console.log(`❌ Status check failed for ${endpoint}:`, error);
      lastError = error;
    }
  }

  throw new Error(`All status endpoints failed. Last error: ${lastError}`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: ["http://localhost:80", "http://localhost:3000"],
    credentials: true,
  });

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { id: videoId } = req.query;

    if (!videoId || typeof videoId !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Missing video ID"
      });
    }

    console.log('🎬 === VIDEO STATUS CHECK ===');
    console.log('🔑 API Key available:', !!HEYGEN_API_KEY);
    console.log('🎥 Video ID:', videoId);

    if (!HEYGEN_API_KEY || HEYGEN_API_KEY.trim() === '') {
      console.error('❌ HeyGen API key not configured or empty');
      console.error('🔑 API Key value:', HEYGEN_API_KEY ? `"${HEYGEN_API_KEY}"` : 'undefined');
      
      return res.status(400).json({
        success: false,
        error: "HeyGen API key not configured. Cannot check video status.",
        code: "MISSING_API_KEY"
      });
    }

    console.log('🚀 Checking real HeyGen video status...');
    
    const statusData = await checkHeyGenVideoStatus(videoId);

    // Parse different response formats
    const status = statusData.status || statusData.data?.status || "unknown";
    const videoUrl = statusData.video_url || statusData.data?.video_url;
    const thumbnailUrl = statusData.thumbnail_url || statusData.data?.thumbnail_url;

    console.log('✅ Video status:', { status, videoUrl: !!videoUrl });

    return res.status(200).json({
      success: true,
      status,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      raw_response: statusData, // For debugging
    });

  } catch (error) {
    console.error('❌ Video status check failed:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}