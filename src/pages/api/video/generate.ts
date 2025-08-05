import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

// 🎬 HeyGen Video Generation API
const HEYGEN_API_BASE = "https://api.heygen.com";
const HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

interface VideoGenerationRequest {
  avatar_id: string;
  script: string;
  title?: string;
  voice?: string;
  language?: string;
}

interface HeyGenVideoResponse {
  video_id?: string;
  error?: {
    code: string;
    message: string;
  };
  data?: {
    video_id: string;
  };
}

async function createHeyGenVideo(request: VideoGenerationRequest): Promise<string> {
  if (!HEYGEN_API_KEY) {
    throw new Error("HeyGen API key not configured");
  }

  // 🔄 Try different HeyGen endpoints for video generation
  const endpoints = [
    `${HEYGEN_API_BASE}/v2/video/generate`,
    `${HEYGEN_API_BASE}/v1/video/generate`,
    `${HEYGEN_API_BASE}/v2/talking_photo/generate`,
    `${HEYGEN_API_BASE}/v1/talking_photo/generate`,
    `${HEYGEN_API_BASE}/v2/avatar_video/generate`,
  ];

  const payloads = [
    // ✅ HeyGen v2 API - правильный формат 
    {
      test: false,
      caption: false,
      title: request.title || "Generated Video",
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: request.avatar_id
          },
          voice: {
            type: "text",
            input_text: request.script,
            voice_id: request.voice || "BV009_en"
          }
        }
      ]
    },
    // Simple avatar video payload
    {
      avatar_id: request.avatar_id,
      script: request.script,
      voice: request.voice || "natural",
      language: request.language || "ru-RU",
      title: request.title
    },
    // Talking photo style payload
    {
      talking_photo_id: request.avatar_id,
      text: request.script,
      voice: request.voice || "natural",
      language: request.language || "ru-RU"
    }
  ];

  let lastError = null;

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    const payload = payloads[i % payloads.length];
    
    console.log(`🔍 Trying endpoint: ${endpoint}`);
    console.log(`📄 Payload:`, JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "X-API-Key": HEYGEN_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(`📡 ${endpoint} → ${response.status} ${response.statusText}`);

      if (response.ok) {
        const result: HeyGenVideoResponse = await response.json();
        console.log(`✅ Success from ${endpoint}:`, result);
        
        const videoId = result.video_id || result.data?.video_id;
        if (videoId) {
          return videoId;
        }
        throw new Error("No video_id in response");
      } else {
        const errorText = await response.text();
        console.log(`❌ ${endpoint} failed: ${response.status} - ${errorText}`);
        lastError = `${response.status}: ${errorText}`;
      }
    } catch (error) {
      console.log(`❌ ${endpoint} error:`, error);
      lastError = error;
    }
  }

  throw new Error(`All HeyGen endpoints failed. Last error: ${lastError}`);
}

async function checkVideoStatus(videoId: string): Promise<any> {
  if (!HEYGEN_API_KEY) {
    throw new Error("HeyGen API key not configured");
  }

  const statusEndpoints = [
    `${HEYGEN_API_BASE}/v1/video_status?video_id=${videoId}`,
    `${HEYGEN_API_BASE}/v2/video_status?video_id=${videoId}`,
    `${HEYGEN_API_BASE}/v1/video/${videoId}`,
    `${HEYGEN_API_BASE}/v2/video/${videoId}`,
  ];

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

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Status from ${endpoint}:`, result);
        return result;
      }
    } catch (error) {
      console.log(`❌ Status check failed for ${endpoint}:`, error);
    }
  }

  throw new Error("Could not check video status");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["POST"],
    origin: ["http://localhost:80", "http://localhost:3000"],
    credentials: true,
  });

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    console.log('🎬 === VIDEO GENERATION REQUEST ===');
    console.log('🔑 API Key available:', !!HEYGEN_API_KEY);
    console.log('📄 Request body:', req.body);

    const { avatar_id, script, title, voice, language } = req.body;

    if (!avatar_id || !script) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: avatar_id and script"
      });
    }

    if (!HEYGEN_API_KEY || HEYGEN_API_KEY.trim() === '') {
      console.error('❌ HeyGen API key not configured or empty');
      console.error('🔑 API Key value:', HEYGEN_API_KEY ? `"${HEYGEN_API_KEY}"` : 'undefined');
      
      return res.status(400).json({
        success: false,
        error: "HeyGen API key not configured. Cannot generate real videos.",
        code: "MISSING_API_KEY"
      });
    }

    console.log('🚀 Starting real HeyGen video generation...');
    
    const videoId = await createHeyGenVideo({
      avatar_id,
      script,
      title,
      voice,
      language,
    });

    console.log('✅ Video generation started:', videoId);

    return res.status(200).json({
      success: true,
      video_id: videoId,
      status: "pending",
      message: "Video generation started successfully",
    });

  } catch (error) {
    console.error('❌ Video generation failed:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}