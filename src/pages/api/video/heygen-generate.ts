import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

// 🎬 НАСТОЯЩАЯ ИНТЕГРАЦИЯ С HEYGEN API
// Ключ закодирован в base64, нужно декодировать
const HEYGEN_API_KEY_ENCODED = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
const HEYGEN_API_KEY = HEYGEN_API_KEY_ENCODED ? 
  Buffer.from(HEYGEN_API_KEY_ENCODED, 'base64').toString('utf-8') : null;
const HEYGEN_API_BASE = "https://api.heygen.com";

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
    console.log('🎬 === HEYGEN LIPSYNC GENERATION ===');
    const { text, avatar_id = 'josh_lite3_20230714', voice_id = 'en-US-JennyNeural' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: text"
      });
    }

    if (!HEYGEN_API_KEY) {
      return res.status(400).json({
        success: false,
        error: "HeyGen API key not configured"
      });
    }

    console.log('🔑 Using HeyGen API Key:', HEYGEN_API_KEY.substring(0, 10) + '...');
    console.log('📝 Text:', text);
    console.log('🎭 Avatar:', avatar_id);
    console.log('🎤 Voice:', voice_id);

    // ПРАВИЛЬНЫЙ ФОРМАТ ДЛЯ HEYGEN API V1
    const payload = {
      background: "#FFFFFF",
      clips: [
        {
          avatar_id: avatar_id,
          avatar_style: "normal",
          input_text: text,
          voice_id: voice_id,
          scale: 1,
          offset: {
            x: 0,
            y: 0
          }
        }
      ],
      ratio: "9:16",
      test: true,
      version: "v1alpha"
    };

    console.log('🚀 Sending request to HeyGen...');
    
    // Отправляем запрос на создание видео - ПРАВИЛЬНЫЙ ЭНДПОИНТ!
    const createResponse = await fetch(`${HEYGEN_API_BASE}/v1/video.generate`, {
      method: "POST",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 HeyGen response status:', createResponse.status);

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ HeyGen API error:', errorText);
      
      // Пробуем альтернативный endpoint
      console.log('🔄 Trying alternative endpoint...');
      
      const altPayload = {
        test: true,
        caption: false,
        title: "Lip Sync Video",
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: avatar_id
            },
            voice: {
              type: "text", 
              input_text: text,
              voice_id: voice_id
            }
          }
        ]
      };

      const altResponse = await fetch(`${HEYGEN_API_BASE}/v1/video.generate`, {
        method: "POST",
        headers: {
          "X-Api-Key": HEYGEN_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(altPayload)
      });

      if (!altResponse.ok) {
        const altError = await altResponse.text();
        throw new Error(`HeyGen API failed: ${altError}`);
      }

      const altResult = await altResponse.json();
      console.log('✅ Alternative endpoint success:', altResult);

      // Для v1 API результат приходит сразу с URL
      if (altResult.data?.video_id) {
        const videoId = altResult.data.video_id;
        
        // В тестовом режиме видео готово сразу
        if (altResult.data?.video_url) {
          return res.status(200).json({
            success: true,
            video_id: videoId,
            video_url: altResult.data.video_url,
            status: "completed",
            message: "HeyGen video created successfully"
          });
        }

        // Ждём готовности видео
        const videoUrl = await pollForVideo(videoId);
        
        return res.status(200).json({
          success: true,
          video_id: videoId,
          video_url: videoUrl,
          status: "completed",
          message: "HeyGen video created successfully"
        });
      }
    }

    const result = await createResponse.json();
    console.log('✅ HeyGen create response:', result);

    // Получаем video_id
    const videoId = result.data?.video_id || result.video_id;
    
    if (!videoId) {
      throw new Error('No video_id in HeyGen response');
    }

    // В тестовом режиме видео может быть готово сразу
    if (result.data?.video_url || result.video_url) {
      console.log('✅ Video ready immediately (test mode)');
      return res.status(200).json({
        success: true,
        video_id: videoId,
        video_url: result.data?.video_url || result.video_url,
        status: "completed",
        message: "HeyGen video created successfully (test mode)"
      });
    }

    // Иначе нужно подождать
    console.log('⏳ Polling for video completion...');
    const videoUrl = await pollForVideo(videoId);

    return res.status(200).json({
      success: true,
      video_id: videoId,
      video_url: videoUrl,
      status: "completed",
      message: "HeyGen video created successfully"
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Unknown error"
    });
  }
}

// Функция для опроса статуса видео
async function pollForVideo(videoId: string, maxAttempts = 30): Promise<string> {
  console.log(`🔄 Polling for video ${videoId}...`);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      // Проверяем статус видео
      const statusResponse = await fetch(`${HEYGEN_API_BASE}/v1/video_status.get?video_id=${videoId}`, {
        method: "GET",
        headers: {
          "X-Api-Key": HEYGEN_API_KEY!
        }
      });

      if (statusResponse.ok) {
        const status = await statusResponse.json();
        console.log(`📊 Status check ${i + 1}:`, status.data?.status || status.status);

        if (status.data?.status === 'completed' || status.status === 'completed') {
          const videoUrl = status.data?.video_url || status.video_url || status.data?.download_url;
          if (videoUrl) {
            console.log('✅ Video ready:', videoUrl);
            return videoUrl;
          }
        } else if (status.data?.status === 'failed' || status.status === 'failed') {
          throw new Error('Video generation failed');
        }
      }
    } catch (error) {
      console.log(`⚠️ Status check ${i + 1} failed:`, error);
    }

    // Ждём 2 секунды перед следующей попыткой
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('Video generation timeout');
}
