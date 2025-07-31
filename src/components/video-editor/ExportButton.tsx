// 🚀 Export Button - Кнопка экспорта с Inngest интеграцией
// Адаптированная версия из Promo-Video-Beta

"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DownloadIcon,
  Loader2,
  Sparkles,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useVideoFrame } from "../context/VideoFrameContext";
import { toast } from "sonner";

interface ExportButtonProps {
  activeTemplate: "lipSync" | "promo" | "lottie";
}

interface RenderStatus {
  video_id?: string;
  status?: string;
  progress?: number;
  output_url?: string;
  error_message?: string;
  estimated_completion?: string;
}

export default function ExportButton({ activeTemplate }: ExportButtonProps) {
  const { videoFrames } = useVideoFrame();
  const [loading, setLoading] = useState(false);
  const [renderStatus, setRenderStatus] = useState<RenderStatus | null>(null);
  const [templateType, setTemplateType] = useState(activeTemplate);
  const [videoTitle, setVideoTitle] = useState("");

  // Синхронизируем templateType с activeTemplate
  useEffect(() => {
    setTemplateType(activeTemplate);
  }, [activeTemplate]);

  // Подготовка данных для разных типов шаблонов
  const prepareRenderData = () => {
    const baseData = {
      template_name: getCompositionName(),
      template_type: templateType,
      video_title:
        videoTitle ||
        `${templateType} видео ${new Date().toLocaleDateString()}`,
      video_description: `Видео создано с шаблоном ${templateType}`,
    };

    switch (templateType) {
      case "promo":
      case "lottie":
        return {
          ...baseData,
          video_frames: videoFrames,
        };

      case "lipSync":
        return {
          ...baseData,
          config: {
            mainText: "НОВАЯ МОДЕЛЬ GEMINI",
            musicVolume: 0.5,
            vignetteStrength: 0.7,
            colorCorrection: 1.2,
            coverDuration: 2,
          },
          user_assets: {
            // Используем дефолтные ассеты
          },
        };

      default:
        return baseData;
    }
  };

  // Получение имени композиции
  const getCompositionName = () => {
    switch (templateType) {
      case "promo":
        return "promoVideo";
      case "lottie":
        return "lottiePromoVideo";
      case "lipSync":
        return "LipSyncTemplate";
      default:
        return "promoVideo";
    }
  };

  // 🚀 Запуск рендеринга через Inngest
  const handleRender = async () => {
    if (!videoTitle.trim()) {
      toast.error("Введите название видео");
      return;
    }

    setLoading(true);
    setRenderStatus(null);

    try {
      const renderData = prepareRenderData();

      console.log("🎬 Starting Inngest render:", renderData);

      const response = await fetch("/api/video/render-inngest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "dev-user-id-12345", // В продакшне из auth токена
        },
        body: JSON.stringify(renderData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Рендеринг запущен! Проверяйте статус ниже.");

        setRenderStatus({
          video_id: result.video_id,
          status: "queued",
          progress: 0,
        });

        // Начинаем поллинг статуса
        startStatusPolling(result.video_id);
      } else {
        throw new Error(result.error || "Render failed");
      }
    } catch (error: any) {
      console.error("❌ Render error:", error);
      toast.error(`Ошибка рендеринга: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 📊 Поллинг статуса рендеринга
  const startStatusPolling = async (videoId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(
          `/api/video/render-status?video_id=${videoId}`,
          {
            headers: {
              "x-user-id": "dev-user-id-12345",
            },
          }
        );

        const status = await response.json();

        if (status.success) {
          setRenderStatus(status);

          // Уведомления о смене статуса
          if (status.status === "completed") {
            toast.success("🎉 Видео готово! Можно скачивать.");
          } else if (status.status === "failed") {
            toast.error("❌ Рендеринг не удался");
          }

          // Продолжаем поллинг если рендеринг не завершен
          if (
            status.status === "pending" ||
            status.status === "queued" ||
            status.status === "rendering"
          ) {
            setTimeout(poll, 3000); // Проверяем каждые 3 секунды
          }
        }
      } catch (error) {
        console.error("Error polling status:", error);
      }
    };

    poll();
  };

  // 🎨 Иконка статуса
  const getStatusIcon = () => {
    switch (renderStatus?.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "rendering":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-gray-600" />;
    }
  };

  // 🎨 Цвет статуса
  const getStatusColor = () => {
    switch (renderStatus?.status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "rendering":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      {/* Template Type Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          🎭 Тип шаблона
        </label>
        <Select
          value={templateType}
          onValueChange={(v) => setTemplateType(v as any)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="promo">🎬 Promo Video</SelectItem>
            <SelectItem value="lipSync">🎤 Lip Sync Avatar</SelectItem>
            <SelectItem value="lottie">✨ Lottie Animation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Video Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          📝 Название видео
        </label>
        <input
          type="text"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder={`Введите название для ${templateType} видео`}
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Export Button */}
      <Button
        onClick={handleRender}
        disabled={loading || !videoTitle.trim()}
        className="w-full flex gap-2 items-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        🚀 Экспорт через Inngest
      </Button>

      {/* Render Status */}
      {renderStatus && (
        <div className="border rounded-lg p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">📊 Статус рендеринга</span>
            {getStatusIcon()}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Статус:</span>
              <span className={`font-medium ${getStatusColor()}`}>
                {renderStatus.status}
              </span>
            </div>

            {renderStatus.progress !== undefined && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Прогресс:</span>
                  <span>{renderStatus.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${renderStatus.progress}%` }}
                  />
                </div>
              </div>
            )}

            {renderStatus.estimated_completion && (
              <div className="flex justify-between text-xs">
                <span>Завершение:</span>
                <span>
                  {new Date(
                    renderStatus.estimated_completion
                  ).toLocaleTimeString()}
                </span>
              </div>
            )}

            {renderStatus.error_message && (
              <div className="text-red-600 text-xs">
                Ошибка: {renderStatus.error_message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Download Button */}
      {renderStatus?.output_url && (
        <Button
          onClick={() => window.open(renderStatus.output_url)}
          className="w-full flex gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <DownloadIcon className="h-4 w-4" />
          📥 Скачать видео
        </Button>
      )}

      {/* Info Note */}
      <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
        💡 <strong>Inngest Queue:</strong> Рендеринг выполняется в фоновом
        режиме. Время рендеринга: ~2-5 минут в зависимости от сложности.
      </div>
    </div>
  );
}
