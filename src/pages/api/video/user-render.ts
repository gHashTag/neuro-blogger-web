// 🎬 API: Пользовательский рендеринг видео с аутентификацией
// POST /api/video/user-render

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabase";
import { renderVideoLocally } from "../../../utils/video/local-render";
import { DEV_AUTH_BYPASS, DEV_MOCK_USER } from "../../../utils/constants";
import NextCors from "nextjs-cors";

export interface UserRenderRequest {
  // Шаблон и конфигурация
  template_name: string; // "LipSyncTemplate"
  template_id?: string; // UUID сохраненного шаблона
  
  // Пользовательские ассеты (пути в Supabase Storage)
  user_assets: {
    lipSyncVideo?: string; // "user-uploads/avatars/user123_avatar.mp4"
    coverImage?: string;
    backgroundMusic?: string;
    backgroundVideos?: string[];
  };
  
  // Конфигурация рендеринга
  config: {
    mainText?: string;
    musicVolume?: number;
    vignetteStrength?: number;
    colorCorrection?: number;
    coverDuration?: number;
    [key: string]: any; // Дополнительные параметры
  };
  
  // Метаданные
  video_title: string;
  video_description?: string;
  workspace_id?: string;
  room_id?: string;
  task_id?: number;
}

export interface UserRenderResponse {
  success: boolean;
  video_id?: string;
  message?: string;
  error?: string;
  render_status?: string;
}

const headers = {
  "Content-Type": "application/json",
};

// 🔐 Получение пользователя из запроса
async function getAuthenticatedUser(req: NextApiRequest) {
  // 🕉️ Dev Authentication Bypass
  if (DEV_AUTH_BYPASS) {
    console.log("🎭 DEV_AUTH_BYPASS: Using mock user for video rendering");
    return {
      user_id: DEV_MOCK_USER.user_id,
      username: DEV_MOCK_USER.username,
      workspace_id: DEV_MOCK_USER.workspace_id,
    };
  }

  // В продакшне: извлекаем user_id из JWT токена или сессии
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("Authorization header required");
  }

  // TODO: Реальная аутентификация через Supabase Auth
  // const { data: { user }, error } = await supabase.auth.getUser(token);
  // if (error || !user) throw new Error("Invalid token");
  
  // Пока что для демо - получаем user_id из заголовка
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
    // Продолжаем выполнение, если не удалось проверить лимиты
  }

  const currentUsage = usage || { videos_rendered: 0, videos_limit: 5 };
  
  if (currentUsage.videos_rendered >= currentUsage.videos_limit) {
    throw new Error(`Monthly video limit reached (${currentUsage.videos_limit} videos). Upgrade your plan to render more videos.`);
  }

  return currentUsage;
}

// 🔄 Подготовка пропсов для Remotion
function prepareRemotionProps(request: UserRenderRequest) {
  const { user_assets, config } = request;
  
  // Базовые пропсы из дефолтного шаблона
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

  // Заменяем дефолты на пользовательские ассеты
  const finalProps = {
    ...defaultProps,
    ...config, // пользовательская конфигурация
    ...(user_assets.lipSyncVideo && { 
      lipSyncVideo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-avatars/${user_assets.lipSyncVideo}` 
    }),
    ...(user_assets.coverImage && { 
      coverImage: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-covers/${user_assets.coverImage}` 
    }),
    ...(user_assets.backgroundMusic && { 
      backgroundMusic: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-music/${user_assets.backgroundMusic}` 
    }),
    ...(user_assets.backgroundVideos && {
      backgroundVideos: user_assets.backgroundVideos.map(path => 
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-backgrounds/${path}`
      )
    }),
  };

  return finalProps;
}

// 📝 Создание записи в базе данных
async function createVideoRecord(request: UserRenderRequest, userId: string) {
  const videoData = {
    user_id: userId,
    workspace_id: request.workspace_id,
    room_id: request.room_id,
    task_id: request.task_id,
    video_title: request.video_title,
    video_description: request.video_description || "",
    render_status: "pending",
    composition_name: request.template_name,
    input_props: {
      ...request.config,
      user_assets: request.user_assets,
    },
  };

  const { data, error } = await supabase
    .from("user_videos")
    .insert([videoData])
    .select("*")
    .single();

  if (error) {
    console.error("Error creating video record:", error);
    throw new Error("Failed to create video record");
  }

  return data;
}

// 📈 Обновление статистики использования
async function updateUsageStats(userId: string) {
  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    .toISOString().slice(0, 10);

  const { error } = await supabase
    .from("user_usage")
    .upsert({
      user_id: userId,
      period_start: currentMonth,
      period_end: nextMonth,
      videos_rendered: 1, // Увеличиваем счетчик
    }, {
      onConflict: "user_id,period_start,period_end",
      count: "exact",
    });

  if (error) {
    console.error("Error updating usage stats:", error);
    // Не прерываем выполнение, если статистика не обновилась
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserRenderResponse>
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
    const request: UserRenderRequest = req.body;
    
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

    // 6️⃣ Обновление статуса на "queued"
    await supabase
      .from("user_videos")
      .update({ 
        render_status: "queued",
        render_started_at: new Date().toISOString()
      })
      .eq("id", videoRecord.id);

    // 7️⃣ Запуск рендеринга
    console.log("🎬 Starting video render for user:", user.user_id);
    
    // В продакшне здесь будет добавление в Redis Queue
    // Пока что рендерим синхронно для демо
    try {
      // Обновляем статус на "rendering"
      await supabase
        .from("user_videos")
        .update({ render_status: "rendering" })
        .eq("id", videoRecord.id);

      const renderResult = await renderVideoLocally({
        composition: request.template_name,
        inputProps: remotionProps,
        videoId: videoRecord.id,
      });

      if (renderResult.type === "success") {
        // Обновляем запись с результатами
        await supabase
          .from("user_videos")
          .update({
            render_status: "completed",
            output_url: renderResult.publicUrl,
            output_path: renderResult.localPath,
            render_completed_at: new Date().toISOString(),
            render_progress: 100,
          })
          .eq("id", videoRecord.id);

        // Обновляем статистику
        await updateUsageStats(user.user_id);

        return res.status(200).json({
          success: true,
          video_id: videoRecord.id,
          message: "Video rendered successfully",
          render_status: "completed",
        });
      } else {
        throw new Error("Render failed");
      }
    } catch (renderError: any) {
      // Обновляем статус ошибки
      await supabase
        .from("user_videos")
        .update({
          render_status: "failed",
          error_message: renderError.message,
          render_completed_at: new Date().toISOString(),
        })
        .eq("id", videoRecord.id);

      throw renderError;
    }

  } catch (error: any) {
    console.error("❌ User video render failed:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
      render_status: "failed",
    });
  }
}