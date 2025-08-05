import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { headers } from "@/helpers/headers";
import { Avatar } from "@/types/avatar";

// 🔧 HeyGen API Configuration
const HEYGEN_API_BASE = "https://api.heygen.com/v1";
const HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

interface HeyGenStatusResponse {
  code: number;
  message: string;
  data?: {
    avatar_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    avatar_url?: string;
    thumbnail_url?: string;
    error_message?: string;
  };
}

interface AvatarStatusResponse {
  success: boolean;
  avatar?: Avatar;
  error?: string;
}

// 🔍 Check HeyGen Avatar Status
async function checkHeyGenStatus(avatarId: string): Promise<HeyGenStatusResponse['data']> {
  if (!HEYGEN_API_KEY) {
    throw new Error("HeyGen API key not configured");
  }

  console.log('🔍 Checking HeyGen status for avatar:', avatarId);

  const response = await fetch(`${HEYGEN_API_BASE}/avatar/status/${avatarId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${HEYGEN_API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('❌ HeyGen API error:', errorData);
    throw new Error(`HeyGen API error: ${response.status} ${response.statusText}`);
  }

  const result: HeyGenStatusResponse = await response.json();
  
  if (result.code !== 200) {
    throw new Error(`HeyGen error: ${result.message}`);
  }

  return result.data;
}

// 💾 Get Avatar from Database
async function getAvatarFromDatabase(avatarId: string): Promise<Avatar | null> {
  // В реальной реализации здесь бы был запрос к Supabase
  // Сейчас возвращаем мок данные
  
  console.log('💾 Fetching avatar from database:', avatarId);
  
  // Мок данные для разработки
  const mockAvatars: { [key: string]: Avatar } = {
    [`avatar-${avatarId}`]: {
      id: avatarId,
      name: "Test Avatar",
      method: 'text',
      style: 'realistic',
      status: 'processing',
      heygen_avatar_id: `mock-heygen-${avatarId}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "dev-user-123",
      thumbnail: '/avatars/generating-placeholder.jpg',
    }
  };

  return mockAvatars[`avatar-${avatarId}`] || null;
}

// 💾 Update Avatar Status in Database
async function updateAvatarInDatabase(avatar: Avatar, heygenData: any): Promise<Avatar> {
  // Обновляем статус и данные аватара на основе ответа HeyGen
  const updatedAvatar: Avatar = {
    ...avatar,
    updated_at: new Date().toISOString(),
  };

  // Маппинг статусов HeyGen на наши статусы
  switch (heygenData?.status) {
    case 'pending':
    case 'processing':
      updatedAvatar.status = 'processing';
      break;
    case 'completed':
      updatedAvatar.status = 'ready';
      if (heygenData.avatar_url) {
        updatedAvatar.preview_video = heygenData.avatar_url;
      }
      if (heygenData.thumbnail_url) {
        updatedAvatar.thumbnail = heygenData.thumbnail_url;
      }
      
      // Создаем Remotion props для интеграции с видео шаблоном
      updatedAvatar.remotion_props = {
        lipSyncVideo: heygenData.avatar_url || '/test-assets/lip-sync.mp4',
        avatarImageUrl: heygenData.thumbnail_url,
      };
      break;
    case 'failed':
      updatedAvatar.status = 'failed';
      break;
    default:
      // Оставляем текущий статус
      break;
  }

  console.log('💾 Avatar updated in database:', {
    id: updatedAvatar.id,
    status: updatedAvatar.status,
    hasPreview: !!updatedAvatar.preview_video
  });

  return updatedAvatar;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AvatarStatusResponse>
) {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...headers } });
  }
  
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed" 
    });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Avatar ID is required"
      });
    }

    console.log('🔍 Checking avatar status:', id);

    // 💾 Получаем аватара из базы данных
    const avatar = await getAvatarFromDatabase(id);
    
    if (!avatar) {
      return res.status(404).json({
        success: false,
        error: "Avatar not found"
      });
    }

    // Если аватар уже готов, возвращаем его без дополнительных запросов
    if (avatar.status === 'ready' || avatar.status === 'failed') {
      return res.status(200).json({
        success: true,
        avatar: avatar
      });
    }

    // 🔍 Проверяем статус в HeyGen
    let heygenData;
    
    if (!HEYGEN_API_KEY) {
      // 🛠️ No API Key - Mock HeyGen Response
      console.log('🛠️ No API key: using mock HeyGen status');
      
      // Симуляция прогресса генерации
      const elapsed = Date.now() - new Date(avatar.created_at).getTime();
      const isComplete = elapsed > 10000; // Завершается через 10 секунд
      
      heygenData = {
        avatar_id: avatar.heygen_avatar_id,
        status: isComplete ? 'completed' : 'processing',
        progress: isComplete ? 100 : Math.min(90, (elapsed / 10000) * 100),
        avatar_url: isComplete ? '/test-assets/lip-sync.mp4' : undefined,
        thumbnail_url: isComplete ? '/avatars/generated-avatar.jpg' : undefined,
      };
    } else {
      // 🚀 Real HeyGen API
      console.log('🚀 Using real HeyGen API');
      heygenData = await checkHeyGenStatus(avatar.heygen_avatar_id!);
    }

    // 💾 Обновляем аватара в базе данных
    const updatedAvatar = await updateAvatarInDatabase(avatar, heygenData);

    console.log('✅ Avatar status checked:', {
      id: updatedAvatar.id,
      status: updatedAvatar.status,
      progress: heygenData?.progress
    });

    return res.status(200).json({
      success: true,
      avatar: updatedAvatar
    });

  } catch (error) {
    console.error('❌ Avatar status check failed:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
}