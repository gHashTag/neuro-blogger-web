// 🎬 Inngest Functions для рендеринга видео
// Интеграция с нашей Supabase архитектурой

import { inngest } from "./client";
import { supabase } from "../utils/supabase";
import { renderVideoLocally } from "../utils/video/local-render";
import { DEV_AUTH_BYPASS } from "../utils/constants";

// 🎨 Функция для AI генерации контента (будущее развитие)
export const GenerateAIVideoData = inngest.createFunction(
  { id: "generate-ai-video-data", name: "Generate AI Video Data" },
  { event: "ai/generate-video-data" },
  async ({ event, step }) => {
    try {
      const { prompt, videoId, userId } = event.data;

      console.log("🤖 Starting AI generation for video:", videoId);

      // В будущем здесь будет интеграция с AI моделью
      const generateVideoData = await step.run(
        "Generate AI Video Data",
        async () => {
          // Пока возвращаем mock данные
          return {
            frameList: [
              {
                animation: "fadeIn",
                bgColor: "#007AFF",
                duration: 1,
                fontFamily: "Outfit",
                fontSize: 48,
                text: prompt || "AI Generated Content",
                textColor: "rgba(255,255,255,1)",
              },
            ],
            music: "test-assets/news.mp3",
            totalDuration: 3,
            screenWidth: 720,
            screenHeight: 1280,
          };
        }
      );

      // Обновляем запись в нашей Supabase таблице
      const updateRecord = await step.run("Update video record", async () => {
        console.log("🔄 Updating video status to 'processing'");
        
        const { data, error } = await supabase
          .from("user_videos")
          .update({
            input_props: generateVideoData,
            render_status: "processing",
          })
          .eq("id", videoId)
          .eq("user_id", userId)
          .select();

        if (error) {
          throw new Error(`Failed to update video record: ${error.message}`);
        }

        return data;
      });

      return updateRecord;
    } catch (error) {
      console.error("🔥 AI Generation Failed:", error);
      
      // Обновляем статус на failed
      await supabase
        .from("user_videos")
        .update({ render_status: "failed", error_message: error instanceof Error ? error.message : String(error) })
        .eq("id", event.data.videoId);
      
      throw error;
    }
  }
);

// 🎬 Основная функция рендеринга видео
export const RenderVideoWithInngest = inngest.createFunction(
  { 
    id: "render-video-with-inngest", 
    name: "Render Video with Inngest",
    // Таймаут для долгих рендеров
    concurrency: { limit: 3 },
  },
  { event: "render/video" },
  async ({ event, step }) => {
    console.log("🚀 Inngest video render started!");
    console.log("📥 Event data received:", JSON.stringify(event.data, null, 2));

    try {
      const {
        videoId,
        userId,
        composition = "LipSyncTemplate",
        inputProps,
        templateType = "lipSync",
      } = event.data;

      // Валидация
      if (!videoId || !userId) {
        throw new Error("❌ videoId and userId are required");
      }

      console.log(`🎬 Starting render for video: ${videoId}, user: ${userId}`);

      // 1️⃣ Обновляем статус в БД
      await step.run("Update status to rendering", async () => {
        const { error } = await supabase
          .from("user_videos")
          .update({
            render_status: "rendering",
            render_started_at: new Date().toISOString(),
            render_progress: 0,
          })
          .eq("id", videoId)
          .eq("user_id", userId);

        if (error) {
          throw new Error(`Failed to update status: ${error.message}`);
        }

        console.log("✅ Status updated to 'rendering'");
      });

      // 2️⃣ Рендерим видео
      const renderResult = await step.run("Render video", async () => {
        console.log("🎥 Starting video render with Remotion...");
        console.log("🎯 Composition:", composition);
        console.log("🎯 Template type:", templateType);
        console.log("🎯 Input props:", JSON.stringify(inputProps, null, 2));

        // Используем наш существующий локальный рендерер
        // В продакшне здесь будет Cloud Run/Lambda
        return await renderVideoLocally({
          composition,
          inputProps,
          videoId,
        });
      });

      // 3️⃣ Обрабатываем результат
      if (renderResult.type === "success") {
        console.log("✅ Render success:", renderResult.publicUrl);

        // Обновляем статус на completed
        await step.run("Update final status", async () => {
          const { error } = await supabase
            .from("user_videos")
            .update({
              render_status: "completed",
              output_url: renderResult.publicUrl,
              output_path: renderResult.localPath,
              render_completed_at: new Date().toISOString(),
              render_progress: 100,
            })
            .eq("id", videoId)
            .eq("user_id", userId);

          if (error) {
            throw new Error(`Failed to update final status: ${error.message}`);
          }

          console.log("✅ Video render completed successfully");
        });

        // 4️⃣ Опционально: отправка уведомления пользователю
        await step.run("Send notification", async () => {
          // В будущем здесь может быть email/push уведомление
          console.log("📧 Notification sent to user:", userId);
        });

        return { 
          success: true, 
          videoUrl: renderResult.publicUrl,
          videoId,
        };
      } else {
        throw new Error(`Render failed: ${renderResult.type}`);
      }

    } catch (error) {
      console.error("🚨 Render Failed:", error);
      console.error("🚨 Error stack:", error instanceof Error ? error.stack : "No stack trace");

      // Обновляем статус на failed
      try {
        await supabase
          .from("user_videos")
          .update({
            render_status: "failed",
            error_message: error instanceof Error ? error.message : String(error),
            render_completed_at: new Date().toISOString(),
          })
          .eq("id", event.data?.videoId)
          .eq("user_id", event.data?.userId);
      } catch (dbError) {
        console.error("🚨 Failed to update database status:", dbError);
      }

      throw error;
    }
  }
);

// 🔄 Функция для проверки статуса рендеринга (опционально)
export const CheckRenderStatus = inngest.createFunction(
  { id: "check-render-status", name: "Check Render Status" },
  { event: "render/check-status" },
  async ({ event, step }) => {
    const { videoId, userId } = event.data;

    const statusCheck = await step.run("Check video status", async () => {
      const { data, error } = await supabase
        .from("user_videos")
        .select("render_status, render_progress, output_url, error_message")
        .eq("id", videoId)
        .eq("user_id", userId)
        .single();

      if (error) {
        throw new Error(`Failed to check status: ${error.message}`);
      }

      return data;
    });

    console.log(`📊 Status check for video ${videoId}:`, statusCheck);
    return statusCheck;
  }
);

// 🧹 Функция очистки старых видео (cron job)
export const CleanupOldVideos = inngest.createFunction(
  { id: "cleanup-old-videos", name: "Cleanup Old Videos" },
  { cron: "0 2 * * *" }, // Каждый день в 2:00
  async ({ step }) => {
    console.log("🧹 Starting cleanup of old videos...");

    const cleanup = await step.run("Cleanup old videos", async () => {
      // Удаляем видео старше 30 дней
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from("user_videos")
        .delete()
        .lt("created_at", thirtyDaysAgo.toISOString())
        .select("id, output_path");

      if (error) {
        console.error("Failed to cleanup videos:", error);
        return { deleted: 0, error: error.message };
      }

      // TODO: Также удалить физические файлы из storage
      
      console.log(`🗑️ Cleaned up ${data?.length || 0} old videos`);
      return { deleted: data?.length || 0 };
    });

    return cleanup;
  }
);