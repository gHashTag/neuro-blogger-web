// 📊 API: Проверка статуса рендеринга видео
// GET /api/video/render-status?video_id=uuid

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabase";
import { DEV_AUTH_BYPASS, DEV_MOCK_USER } from "../../../utils/constants";
import NextCors from "nextjs-cors";

export interface RenderStatusResponse {
  success: boolean;
  video_id?: string;
  status?: string;
  progress?: number;
  output_url?: string;
  error_message?: string;
  created_at?: string;
  render_started_at?: string;
  render_completed_at?: string;
  estimated_completion?: string;
  file_size?: number;
  duration_seconds?: number;
  queue_status?: string;
  worker_id?: string;
}

const headers = {
  "Content-Type": "application/json",
};

// 🔐 Получение пользователя из запроса
async function getAuthenticatedUser(req: NextApiRequest) {
  // 🕉️ Dev Authentication Bypass
  if (DEV_AUTH_BYPASS) {
    return {
      user_id: DEV_MOCK_USER.user_id,
      username: DEV_MOCK_USER.username,
    };
  }

  // В продакшне: извлекаем user_id из JWT токена
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    throw new Error("User ID required in x-user-id header");
  }

  return { user_id: userId };
}

// ⏱️ Расчет примерного времени завершения
function calculateEstimatedCompletion(
  status: string, 
  progress: number, 
  startedAt?: string
): string | null {
  if (status === "completed" || status === "failed") {
    return null; // Уже завершено
  }

  if (!startedAt || status === "pending" || status === "queued") {
    // Если еще не начался рендеринг, оцениваем время ожидания
    const estimatedWaitTime = 2 * 60 * 1000; // 2 минуты в очереди
    return new Date(Date.now() + estimatedWaitTime).toISOString();
  }

  if (status === "rendering" && progress > 0) {
    const started = new Date(startedAt).getTime();
    const elapsed = Date.now() - started;
    const estimatedTotal = (elapsed / progress) * 100;
    const remaining = estimatedTotal - elapsed;
    
    return new Date(Date.now() + remaining).toISOString();
  }

  // Дефолтная оценка - 5 минут
  const defaultEstimate = 5 * 60 * 1000;
  return new Date(Date.now() + defaultEstimate).toISOString();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RenderStatusResponse>
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
      error_message: "Method not allowed"
    });
  }

  try {
    // 1️⃣ Аутентификация
    const user = await getAuthenticatedUser(req);

    // 2️⃣ Валидация параметров
    const { video_id } = req.query;
    
    if (!video_id || typeof video_id !== "string") {
      return res.status(400).json({
        success: false,
        error_message: "video_id parameter is required"
      });
    }

    // 3️⃣ Получение информации о видео
    const { data: video, error } = await supabase
      .from("user_videos")
      .select(`
        id,
        render_status,
        render_progress,
        output_url,
        error_message,
        created_at,
        render_started_at,
        render_completed_at,
        file_size,
        duration_seconds,
        video_title,
        video_description
      `)
      .eq("id", video_id)
      .eq("user_id", user.user_id) // Проверяем, что видео принадлежит пользователю
      .single();

    if (error) {
      console.error("Error fetching video status:", error);
      return res.status(404).json({
        success: false,
        error_message: "Video not found or access denied"
      });
    }

    // 4️⃣ Проверка статуса в очереди рендеринга (если используется)
    let queueStatus = null;
    if (video.render_status === "queued" || video.render_status === "rendering") {
      // Опционально: проверяем статус в Redis/Bull queue
      try {
        const { data: renderJob } = await supabase
          .from("render_jobs")
          .select("job_status, progress_data, worker_id")
          .eq("video_id", video_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (renderJob) {
          queueStatus = renderJob;
        }
      } catch (queueError) {
        console.warn("Could not fetch queue status:", queueError);
      }
    }

    // 5️⃣ Расчет примерного времени завершения
    const estimatedCompletion = calculateEstimatedCompletion(
      video.render_status,
      video.render_progress || 0,
      video.render_started_at
    );

    // 6️⃣ Формирование ответа
    const response: RenderStatusResponse = {
      success: true,
      video_id: video.id,
      status: video.render_status,
      progress: video.render_progress || 0,
      ...(video.output_url && { output_url: video.output_url }),
      ...(video.error_message && { error_message: video.error_message }),
      created_at: video.created_at,
      ...(video.render_started_at && { render_started_at: video.render_started_at }),
      ...(video.render_completed_at && { render_completed_at: video.render_completed_at }),
      ...(estimatedCompletion && { estimated_completion: estimatedCompletion }),
      ...(video.file_size && { file_size: video.file_size }),
      ...(video.duration_seconds && { duration_seconds: video.duration_seconds }),
    };

    // 7️⃣ Добавляем дополнительную информацию из очереди
    if (queueStatus) {
      response.queue_status = queueStatus.job_status;
      response.worker_id = queueStatus.worker_id;
      
      // Если есть более актуальный прогресс из очереди
      if (queueStatus.progress_data?.progress && 
          queueStatus.progress_data.progress > (video.render_progress || 0)) {
        response.progress = queueStatus.progress_data.progress;
      }
    }

    console.log(`📊 Status check for video ${video_id}: ${video.render_status} (${response.progress}%)`);

    return res.status(200).json(response);

  } catch (error: any) {
    console.error("❌ Error checking render status:", error);
    
    return res.status(500).json({
      success: false,
      error_message: error.message || "Internal server error"
    });
  }
}

// 📊 Дополнительный эндпоинт для получения списка видео пользователя
export async function getUserVideos(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getAuthenticatedUser(req);
    
    const { 
      limit = 10, 
      offset = 0, 
      status,
      workspace_id 
    } = req.query;

    let query = supabase
      .from("user_videos")
      .select(`
        id,
        video_title,
        video_description,
        render_status,
        render_progress,
        output_url,
        created_at,
        render_completed_at,
        file_size,
        duration_seconds
      `)
      .eq("user_id", user.user_id)
      .order("created_at", { ascending: false });

    // Фильтры
    if (status && typeof status === "string") {
      query = query.eq("render_status", status);
    }

    if (workspace_id && typeof workspace_id === "string") {
      query = query.eq("workspace_id", workspace_id);
    }

    // Пагинация
    query = query.range(
      parseInt(offset as string), 
      parseInt(offset as string) + parseInt(limit as string) - 1
    );

    const { data: videos, error, count } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      videos: videos || [],
      total: count,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error_message: error.message
    });
  }
}