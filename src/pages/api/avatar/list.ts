import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { headers } from "@/helpers/headers";

// 🔧 HeyGen API Configuration
const HEYGEN_API_BASE = "https://api.heygen.com/v2";
const HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

interface HeyGenAvatar {
  avatar_id: string;
  avatar_name: string;
  gender?: "male" | "female" | "neutral" | "unknown";
  premium?: boolean;
  preview_image_url: string;
  preview_video_url?: string;
  default_voice_id?: string | null;
  type?: string | null;
  tags?: string | null;
}

interface HeyGenListAvatarsResponse {
  data?: HeyGenAvatar[] | null;
  error?: {
    code: string;
    message: string;
  };
}

// 🎭 Get Available Avatars from HeyGen
async function getHeyGenAvatars(): Promise<HeyGenAvatar[]> {
  if (!HEYGEN_API_KEY) {
    throw new Error("HeyGen API key not configured");
  }

  try {
    // 🚀 FORCE V2 API ONLY - trying different v2 endpoints and auth methods
          const v2Endpoints = [
        `https://api.heygen.com/v2/avatars?limit=50`, // Лимит для предотвращения обрыва соединения
        `https://api.heygen.com/v2/talking-photos?limit=50`,
        `https://api.heygen.com/v2/avatar?limit=50`,
        `https://api.heygen.com/v2/instant-avatar?limit=50`,
      ];
    
    const authMethods = [
  
      { "Authorization": `Bearer ${HEYGEN_API_KEY}` },
      { "x-api-key": HEYGEN_API_KEY },
    ];
    
    let response = null;
    let workingConfig = null;
    
    console.log('🚀 === TESTING V2 API ENDPOINTS ===');
    
    for (const endpoint of v2Endpoints) {
      for (const authHeader of authMethods) {
        const authKey = Object.keys(authHeader)[0];
        console.log(`🔍 Testing: ${endpoint} with ${authKey}`);
        
        try {
          const headers: Record<string, string> = {
            "Accept": "application/json",
            "Content-Type": "application/json",
          };
          
          // Add only defined auth headers
          Object.entries(authHeader).forEach(([key, value]) => {
            if (value !== undefined) {
              headers[key] = value;
            }
          });
          
          response = await fetch(endpoint, {
            method: "GET",
            headers,
          });
          
          const statusText = `${response.status} ${response.statusText}`;
          console.log(`📡 ${endpoint} (${authKey}) → ${statusText}`);
          
          if (response.ok) {
            workingConfig = { endpoint, authHeader };
            console.log(`✅ SUCCESS! Working config found`);
            break;
          } else {
            // Log error details for debugging
            const errorText = await response.text();
            console.log(`❌ Error response: ${errorText.substring(0, 200)}...`);
          }
        } catch (err) {
          console.log(`❌ Request failed:`, err);
        }
      }
      if (workingConfig) break;
    }
    
    if (!workingConfig || !response?.ok) {
      const errorData = await response?.text() || 'No response received';
      console.error('❌ ALL V2 ENDPOINTS FAILED');
      console.error('🔑 API Key used:', HEYGEN_API_KEY ? `${HEYGEN_API_KEY.substring(0, 20)}...` : 'MISSING');
      throw new Error(`HeyGen V2 API completely failed. Last status: ${response?.status}. Error: ${errorData.substring(0, 300)}`);
    }
    
    console.log(`✅ Using: ${workingConfig.endpoint} with ${Object.keys(workingConfig.authHeader)[0]}`);



    const result = await response.json();
    console.log('📊 HeyGen API Raw Result:', result);
    console.log('📋 Result structure:', {
      resultKeys: Object.keys(result),
      hasData: !!result.data,
      dataType: typeof result.data,
      isArray: Array.isArray(result.data),
      dataLength: result.data?.length,
      hasError: !!result.error,
      hasCode: !!result.code,
      hasMessage: !!result.message
    });

    // Handle different API response formats
    let avatars: HeyGenAvatar[] = [];
    
    // Format 1: { data: [...], error: null }
    if (result.data && Array.isArray(result.data)) {
      avatars = result.data;
    }
    // Format 2: { code: 100, data: { avatars: [...] } }
    else if (result.data && result.data.avatars && Array.isArray(result.data.avatars)) {
      avatars = result.data.avatars;
    }
    // Format 3: Direct array response
    else if (Array.isArray(result)) {
      avatars = result;
    }
    // Format 4: { avatars: [...] }
    else if (result.avatars && Array.isArray(result.avatars)) {
      avatars = result.avatars;
    }
    
    if (result.error) {
      console.error('❌ HeyGen API Error Object:', result.error);
      throw new Error(`HeyGen API error: ${result.error.message || result.error}`);
    }
    
    console.log(`📊 Extracted ${avatars.length} avatars from response`);
    console.log(`✅ HeyGen returned ${avatars.length} avatars`);
    
    if (avatars.length > 0) {
      console.log('👤 Sample avatar structure:', {
        avatar_id: avatars[0].avatar_id,
        avatar_name: avatars[0].avatar_name,
        preview_image_url: avatars[0].preview_image_url?.substring(0, 80) + '...',
        allKeys: Object.keys(avatars[0])
      });
    }

    return avatars;

  } catch (error) {
    console.error('❌ Error fetching HeyGen avatars:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS configuration
  await NextCors(req, res, {
    methods: ["GET"],
    origin: ["http://localhost:80", "http://localhost:3000"],
    credentials: true,
  });

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    console.log('🎭 === AVATAR LIST REQUEST ===');
    console.log('🔑 API Key available:', !!HEYGEN_API_KEY);
    console.log('🔑 API Key first 10 chars:', HEYGEN_API_KEY ? HEYGEN_API_KEY.substring(0, 10) + '...' : 'N/A');

    let avatars: HeyGenAvatar[] = [];

    if (!HEYGEN_API_KEY) {
      console.log('⚠️ No HeyGen API key - returning empty array');
      avatars = [];
    } else {
      console.log('🚀 Using real HeyGen API');
      try {
        avatars = await getHeyGenAvatars();
        console.log('📊 Raw avatars from HeyGen:', avatars.length);
        console.log('📋 First avatar sample:', avatars[0] ? {
          avatar_id: avatars[0].avatar_id,
          avatar_name: avatars[0].avatar_name,
          preview_image_url: avatars[0].preview_image_url?.substring(0, 50) + '...'
        } : 'No avatars');
      } catch (error) {
        console.error('❌ HeyGen API failed:', error);
        // Return empty array instead of error when API fails
        avatars = [];
      }
    }

    console.log(`✅ Found ${avatars.length} avatars`);
    
    // ✅ Маппинг HeyGen API данных в наш интерфейс Avatar
    const mappedAvatars = avatars.map(avatar => ({
      ...avatar,
      id: avatar.avatar_id, // avatar_id -> id для совместимости
      name: avatar.avatar_name,
      style: "realistic" as const, // HeyGen аватары всегда realistic
      gender: avatar.gender || "unknown" as const, // используем gender из API
    }));

    const response = {
      success: true,
      avatars: mappedAvatars,
      total: mappedAvatars.length
    };
    
    console.log('📤 API Response:', {
      success: response.success,
      total: response.total,
      avatarsCount: response.avatars.length
    });

    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Avatar list failed:', error);
    
    // Always return empty array on error, not 500
    return res.status(200).json({
      success: true,
      avatars: [],
      total: 0
    });
  }
}