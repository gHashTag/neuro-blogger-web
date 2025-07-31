// 🎬 API: Рендеринг видео через Inngest Queue
// Более масштабируемая версия user-render.ts

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabase";
import { inngest } from "../../../inngest/client";
import { DEV_AUTH_BYPASS, DEV_MOCK_USER } from "../../../utils/constants";
import NextCors from "nextjs-cors";

export interface InngestRenderRequest {
  // Шаблон и конфигурация
  template_name: string; // "LipSyncTemplate", "PromoVideo", etc.
  template_type?: string; // "lipSync", "promo", "lottie"
  
  // Пользовательские ассеты
  user_assets?: {
    lipSyncVideo?: string;
    coverImage?: string;
    backgroundMusic?: string;
    backgroundVideos?: string[];
  };
  
  // Конфигурация для PromoVideo шаблона
  video_frames?: {
    frameList?: any[];
    music?: string;
    totalDuration?: number;
    screenWidth?: number;
    screenHeight?: number;
  };
  
  // Конфигурация рендеринга (для LipSync шаблона)
  config?: {
    mainText?: string;
    musicVolume?: number;
    vignetteStrength?: number;
    colorCorrection?: number;
    coverDuration?: number;
    [key: string]: any;
  };
  
  // Метаданные
  video_title: string;
  video_description?: string;
  workspace_id?: string;
  room_id?: string;
  task_id?: number;
}

export interface InngestRenderResponse {
  success: boolean;
  video_id?: string;
  message?: string;
  error?: string;
  inngest_event_id?: string;
}

const headers = {
  "Content-Type": "application/json",
};

// 🔐 Получение пользователя из запроса
async function getAuthenticatedUser(req: NextApiRequest) {
  // 🕉️ Dev Authentication Bypass
  if (DEV_AUTH_BYPASS) {
    console.log("🎭 DEV_AUTH_BYPASS: Using mock user for Inngest video rendering");
    return {
      user_id: DEV_MOCK_USER.user_id,
      username: DEV_MOCK_USER.username,
      workspace_id: DEV_MOCK_USER.workspace_id,
    };
  }

  // В продакшне: извлекаем user_id из JWT токена
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    throw new Error("User ID required in x-user-id header");
  }

  return { user_id: userId };
}

// 📊 Проверка лимитов пользователя
async function checkUserLimits(userId: string) {
  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  
  const { data: usage, error } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", userId)
    .eq("period_start", currentMonth)
    .maybeSingle();

  if (error) {
    console.error("Error checking user limits:", error);
  }

  const currentUsage = usage || { videos_rendered: 0, videos_limit: 5 };
  
  if (currentUsage.videos_rendered >= currentUsage.videos_limit) {
    throw new Error(`Monthly video limit reached (${currentUsage.videos_limit} videos). Upgrade your plan to render more videos.`);
  }

  return currentUsage;
}

// 🔄 Подготовка пропсов для Remotion
function prepareRemotionProps(request: InngestRenderRequest) {
  const { user_assets, config, video_frames, template_type } = request;
  
  // Для LipSync шаблона (наш оригинальный)
  if (template_type === "lipSync" || !template_type) {
    const defaultProps = {
      lipSyncVideo: "test-assets/lip-sync.mp4",
      coverImage: "test-assets/cover01.png",
      backgroundMusic: "test-assets/news.mp3",
      musicVolume: 0.5,
      backgroundVideos: [
        "test-assets/bg-video01.mp4",
        "test-assets/bg-video02.mp4",
        "test-assets/bg-video03.mp4",
        "test-assets/bg-video04.mp4",
      ],
      mainText: "НОВАЯ МОДЕЛЬ GEMINI",
      coverDuration: 2,
      vignetteStrength: 0.7,
      colorCorrection: 1.2,
    };

    return {
      ...defaultProps,
      ...config,
      ...(user_assets?.lipSyncVideo && { 
        lipSyncVideo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-avatars/${user_assets.lipSyncVideo}` 
      }),
      ...(user_assets?.coverImage && { 
        coverImage: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-covers/${user_assets.coverImage}` 
      }),
      ...(user_assets?.backgroundMusic && { 
        backgroundMusic: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-music/${user_assets.backgroundMusic}` 
      }),
      ...(user_assets?.backgroundVideos && {
        backgroundVideos: user_assets.backgroundVideos.map(path => 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-backgrounds/${path}`
        )
      }),
    };
  }
  
  // Для PromoVideo шаблона (из Promo-Video-Beta)
  if (template_type === "promo" && video_frames) {
    return {
      videoFrames: video_frames,
      frameList: video_frames.frameList,
      isLottieTemplate: false,
    };
  }
  
  // Для Lottie шаблона
  if (template_type === "lottie" && video_frames) {
    return {
      templateName: "data-json",
      videoFrames: video_frames,
      frameList: video_frames.frameList,
      isLottieTemplate: true,
    };
  }

  // Fallback - возвращаем config как есть
  return config || {};
}

// 📝 Создание записи в базе данных
async function createVideoRecord(request: InngestRenderRequest, userId: string) {
  const videoData = {
    user_id: userId,
    // Опциональные поля - передаем только если они есть
    ...(request.workspace_id && { workspace_id: request.workspace_id }),
    ...(request.room_id && { room_id: request.room_id }),
    ...(request.task_id && { task_id: request.task_id }),
    
    video_title: request.video_title,
    video_description: request.video_description || "",
    render_status: "queued",
    composition_name: request.template_name,
    template_id: null, // Используем null для placeholder template
    input_props: {
      template_type: request.template_type,
      config: request.config,
      user_assets: request.user_assets,
      video_frames: request.video_frames,
    },
  };

  const { data, error } = await supabase
    .from("user_videos")
    .insert([videoData])
    .select("*")
    .single();

  if (error) {
    console.error("Supabase error creating video record:", error);
    console.error("Video data being inserted:", JSON.stringify(videoData, null, 2));
    throw new Error(`Failed to create video record: ${error.message}`);
  }

  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InngestRenderResponse>
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
    // 1️⃣ Аутентификация
    const user = await getAuthenticatedUser(req);
    console.log("🔐 Authenticated user:", user.user_id);

    // 2️⃣ Валидация запроса
    const request: InngestRenderRequest = req.body;
    
    if (!request.template_name || !request.video_title) {
      return res.status(400).json({
        success: false,
        error: "template_name and video_title are required"
      });
    }

    // 3️⃣ Проверка лимитов
    await checkUserLimits(user.user_id);
    console.log("✅ User limits checked");

    // 4️⃣ Создание записи в БД
    const videoRecord = await createVideoRecord(request, user.user_id);
    console.log("📝 Video record created:", videoRecord.id);

    // 5️⃣ Подготовка пропсов для рендеринга
    const remotionProps = prepareRemotionProps(request);
    console.log("🎛️ Remotion props prepared");

    // 6️⃣ Отправка события в Inngest
    console.log("📤 Sending event to Inngest queue...");
    
    const inngestEvent = await inngest.send({
      name: "render/video",
      data: {
        videoId: videoRecord.id,
        userId: user.user_id,
        composition: request.template_name,
        inputProps: remotionProps,
        templateType: request.template_type || "lipSync",
      },
    });

    console.log("✅ Inngest event sent:", inngestEvent.ids[0]);

    return res.status(200).json({
      success: true,
      video_id: videoRecord.id,
      message: "Video queued for rendering",
      inngest_event_id: inngestEvent.ids[0],
    });

  } catch (error: any) {
    console.error("❌ Inngest video render failed:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}