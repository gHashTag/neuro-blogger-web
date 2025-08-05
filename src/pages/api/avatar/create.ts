import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { headers } from "@/helpers/headers";
import { AvatarCreationRequest, AvatarCreationResponse, Avatar } from "@/types/avatar";

// 🔧 HeyGen API Configuration
const HEYGEN_API_BASE = "https://api.heygen.com/v1";
const HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

interface HeyGenCreateAvatarRequest {
  callback_url?: string;
  avatar_name: string;
  avatar_style?: string;
  
  // Для текстового метода
  text?: string;
  
  // Для фото метода
  photos?: {
    url: string;
  }[];
  
  // Для видео метода
  video?: {
    url: string;
  };
}

interface HeyGenCreateAvatarResponse {
  code: number;
  message: string;
  data?: {
    avatar_id: string;
    job_id: string;
    status: string;
  };
}

// 🎭 Create Avatar with HeyGen API
async function createHeyGenAvatar(request: AvatarCreationRequest): Promise<string> {
  if (!HEYGEN_API_KEY) {
    throw new Error("HeyGen API key not configured");
  }

  let heygenRequest: HeyGenCreateAvatarRequest = {
    avatar_name: request.name,
    avatar_style: request.style,
    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/avatar/webhook` // для получения уведомлений
  };

  // Формируем запрос в зависимости от метода
  switch (request.method) {
    case 'text':
      if (!request.prompt) {
        throw new Error("Prompt is required for text method");
      }
      heygenRequest.text = request.prompt;
      break;
      
    case 'photo':
      if (!request.photos || request.photos.length === 0) {
        throw new Error("Photos are required for photo method");
      }
      // В реальной реализации здесь бы загружались файлы в облако
      // и передавались URL'ы в HeyGen
      throw new Error("Photo method not implemented yet");
      
    case 'video':
      if (!request.video) {
        throw new Error("Video is required for video method");
      }
      // В реальной реализации здесь бы загружался видео файл
      throw new Error("Video method not implemented yet");
      
    default:
      throw new Error(`Unsupported method: ${request.method}`);
  }

  console.log('🎭 Creating HeyGen avatar:', heygenRequest);

  // 🚀 Call HeyGen API
  const response = await fetch(`${HEYGEN_API_BASE}/avatar/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${HEYGEN_API_KEY}`,
    },
    body: JSON.stringify(heygenRequest),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('❌ HeyGen API error:', errorData);
    throw new Error(`HeyGen API error: ${response.status} ${response.statusText}`);
  }

  const result: HeyGenCreateAvatarResponse = await response.json();
  
  if (result.code !== 200) {
    throw new Error(`HeyGen error: ${result.message}`);
  }

  if (!result.data?.avatar_id) {
    throw new Error("No avatar_id returned from HeyGen");
  }

  return result.data.avatar_id;
}

// 💾 Save Avatar to Database
async function saveAvatarToDatabase(
  request: AvatarCreationRequest, 
  heygenAvatarId: string,
  userId: string
): Promise<Avatar> {
  // В реальной реализации здесь бы было сохранение в Supabase
  // Сейчас возвращаем мок объект
  
  const avatar: Avatar = {
    id: `avatar-${Date.now()}`,
    name: request.name,
    method: request.method,
    style: request.style,
    status: 'processing',
    heygen_avatar_id: heygenAvatarId,
    
    training_data: {
      prompt: request.prompt,
    },
    
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: userId,
    
    // Мок данные для превью
    thumbnail: '/avatars/generating-placeholder.jpg',
  };

  console.log('💾 Avatar saved to database:', avatar);
  return avatar;
}

// 🔐 Get User ID (placeholder)
async function getUserId(req: NextApiRequest): Promise<string> {
  // В реальной реализации здесь бы была аутентификация
  // Используем DEV_AUTH_BYPASS для разработки
  return "dev-user-123";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AvatarCreationResponse>
) {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...headers } });
  }
  
  await NextCors(req, res, {
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed" 
    });
  }

  try {
    console.log('🎭 Avatar creation request received');

    // 🔐 Аутентификация
    const userId = await getUserId(req);
    
    // 📝 Валидация запроса
    const request: AvatarCreationRequest = req.body;
    
    if (!request.name || !request.method || !request.style) {
      return res.status(400).json({
        success: false,
        error: "name, method, and style are required"
      });
    }

    // Дополнительная валидация для текстового метода
    if (request.method === 'text' && !request.prompt) {
      return res.status(400).json({
        success: false,
        error: "prompt is required for text method"
      });
    }

    console.log('✅ Request validated:', {
      name: request.name,
      method: request.method,
      style: request.style,
      hasPrompt: !!request.prompt
    });

    // 🎭 Создание аватара в HeyGen
    let heygenAvatarId: string;
    
    if (!HEYGEN_API_KEY) {
      // 🛠️ No API Key - Mock HeyGen Response
      console.log('🛠️ No API key: using mock HeyGen response');
      heygenAvatarId = `mock-heygen-${Date.now()}`;
      
      // Симуляция задержки API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // 🚀 Real HeyGen API
      console.log('🚀 Using real HeyGen API');
      heygenAvatarId = await createHeyGenAvatar(request);
    }

    // 💾 Сохранение в базу данных
    const avatar = await saveAvatarToDatabase(request, heygenAvatarId, userId);

    console.log('🎉 Avatar creation initiated successfully:', avatar.id);

    return res.status(200).json({
      success: true,
      avatar: avatar,
      job_id: heygenAvatarId
    });

  } catch (error) {
    console.error('❌ Avatar creation failed:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}