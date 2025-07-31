// 🎨 VIDEO STUDIO: Пользовательский интерфейс для создания видео
// Страница для клиентов: загрузка ассетов, настройка шаблонов, рендеринг

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

interface VideoAsset {
  type: "avatar" | "cover" | "music" | "background";
  file: File | null;
  url?: string;
  name?: string;
}

interface RenderConfig {
  mainText: string;
  musicVolume: number;
  vignetteStrength: number;
  colorCorrection: number;
  coverDuration: number;
}

interface RenderStatus {
  video_id?: string;
  status?: string;
  progress?: number;
  output_url?: string;
  error_message?: string;
  estimated_completion?: string;
}

export default function VideoStudio() {
  const router = useRouter();

  // State для ассетов
  const [assets, setAssets] = useState<{ [key: string]: VideoAsset }>({
    avatar: { type: "avatar", file: null },
    cover: { type: "cover", file: null },
    music: { type: "music", file: null },
    background1: { type: "background", file: null },
    background2: { type: "background", file: null },
    background3: { type: "background", file: null },
    background4: { type: "background", file: null },
  });

  // State для конфигурации
  const [config, setConfig] = useState<RenderConfig>({
    mainText: "НОВАЯ МОДЕЛЬ GEMINI",
    musicVolume: 0.5,
    vignetteStrength: 0.7,
    colorCorrection: 1.2,
    coverDuration: 2,
  });

  // State для рендеринга
  const [isRendering, setIsRendering] = useState(false);
  const [renderStatus, setRenderStatus] = useState<RenderStatus | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");

  // Обработка выбора файлов
  const handleFileSelect = (assetKey: string, file: File) => {
    setAssets((prev) => ({
      ...prev,
      [assetKey]: {
        ...prev[assetKey],
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      },
    }));
  };

  // Валидация файлов
  const validateFile = (file: File, type: string): boolean => {
    const validTypes: { [key: string]: string[] } = {
      avatar: ["video/mp4", "video/webm"],
      cover: ["image/png", "image/jpeg", "image/webp"],
      music: ["audio/mp3", "audio/wav", "audio/aac"],
      background: ["video/mp4", "video/webm"],
    };

    const maxSizes: { [key: string]: number } = {
      avatar: 100 * 1024 * 1024, // 100MB
      cover: 10 * 1024 * 1024, // 10MB
      music: 20 * 1024 * 1024, // 20MB
      background: 100 * 1024 * 1024, // 100MB
    };

    if (!validTypes[type]?.includes(file.type)) {
      alert(
        `Неподдерживаемый тип файла для ${type}. Разрешены: ${validTypes[
          type
        ]?.join(", ")}`
      );
      return false;
    }

    if (file.size > maxSizes[type]) {
      alert(
        `Файл слишком большой для ${type}. Максимум: ${Math.round(
          maxSizes[type] / 1024 / 1024
        )}MB`
      );
      return false;
    }

    return true;
  };

  // Запуск рендеринга
  const handleRender = async () => {
    if (!videoTitle.trim()) {
      alert("Введите название видео");
      return;
    }

    setIsRendering(true);
    setRenderStatus(null);

    try {
      // В реальной версии здесь будет загрузка файлов в Supabase Storage
      // Пока используем базовые ассеты для демо

      const renderRequest = {
        template_name: "LipSyncTemplate",
        video_title: videoTitle,
        video_description: videoDescription,
        user_assets: {
          // В демо версии используем дефолтные ассеты
          // В продакшне здесь будут пути к загруженным файлам
        },
        config,
      };

      console.log("🎬 Starting render with config:", renderRequest);

      const response = await fetch("/api/video/user-render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "demo-user-123", // В продакшне из auth токена
        },
        body: JSON.stringify(renderRequest),
      });

      const result = await response.json();

      if (result.success) {
        setRenderStatus({
          video_id: result.video_id,
          status: result.render_status,
          progress: 0,
        });

        // Начинаем поллинг статуса
        pollRenderStatus(result.video_id);
      } else {
        throw new Error(result.error || "Render failed");
      }
    } catch (error: any) {
      console.error("❌ Render error:", error);
      alert(`Ошибка рендеринга: ${error.message}`);
    } finally {
      setIsRendering(false);
    }
  };

  // Поллинг статуса рендеринга
  const pollRenderStatus = async (videoId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(
          `/api/video/render-status?video_id=${videoId}`,
          {
            headers: {
              "x-user-id": "demo-user-123",
            },
          }
        );

        const status = await response.json();

        if (status.success) {
          setRenderStatus(status);

          // Продолжаем поллинг если рендеринг не завершен
          if (
            status.status === "pending" ||
            status.status === "queued" ||
            status.status === "rendering"
          ) {
            setTimeout(poll, 2000); // Проверяем каждые 2 секунды
          }
        }
      } catch (error) {
        console.error("Error polling status:", error);
      }
    };

    poll();
  };

  // Компонент загрузки файла
  const FileUpload = ({
    assetKey,
    label,
    accept,
  }: {
    assetKey: string;
    label: string;
    accept: string;
  }) => {
    const asset = assets[assetKey];

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>

          {asset.url ? (
            <div className="mb-2">
              {asset.type === "cover" ? (
                <img
                  src={asset.url}
                  alt="Preview"
                  className="max-w-32 max-h-32 mx-auto rounded"
                />
              ) : (
                <div className="text-green-600 text-sm">✅ {asset.name}</div>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-sm mb-2">Файл не выбран</div>
          )}

          <input
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && validateFile(file, asset.type)) {
                handleFileSelect(assetKey, file);
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Video Studio - Создайте свое персональное видео</title>
        <meta
          name="description"
          content="Создавайте профессиональные видео с вашим аватаром"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎬 Video Studio
            </h1>
            <p className="text-xl text-gray-600">
              Создайте персональное видео с вашим аватаром
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Левая колонка: Загрузка и настройки */}
            <div className="space-y-6">
              {/* Метаданные видео */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  📝 Информация о видео
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название видео *
                    </label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Введите название вашего видео"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Описание (опционально)
                    </label>
                    <textarea
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="Краткое описание видео"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Загрузка ассетов */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  📁 Загрузка файлов
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FileUpload
                    assetKey="avatar"
                    label="🎤 Аватар (видео)"
                    accept="video/*"
                  />
                  <FileUpload
                    assetKey="cover"
                    label="📸 Обложка"
                    accept="image/*"
                  />
                  <FileUpload
                    assetKey="music"
                    label="🎵 Музыка"
                    accept="audio/*"
                  />
                  <FileUpload
                    assetKey="background1"
                    label="🎬 Фон 1"
                    accept="video/*"
                  />
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  💡 Если файл не загружен, будет использован файл по умолчанию
                </div>
              </div>

              {/* Настройки */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">⚙️ Настройки</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Основной текст
                    </label>
                    <input
                      type="text"
                      value={config.mainText}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          mainText: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Громкость музыки: {Math.round(config.musicVolume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.musicVolume}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          musicVolume: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Виньетка: {Math.round(config.vignetteStrength * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.vignetteStrength}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          vignetteStrength: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Длительность обложки: {config.coverDuration}с
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={config.coverDuration}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          coverDuration: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка: Превью и рендеринг */}
            <div className="space-y-6">
              {/* Превью */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">👁️ Превью</h2>

                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🎬</div>
                    <div>Превью появится здесь</div>
                    <div className="text-sm mt-1">
                      В будущей версии: интеграция с Remotion Player
                    </div>
                  </div>
                </div>
              </div>

              {/* Статус рендеринга */}
              {renderStatus && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    📊 Статус рендеринга
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Статус:</span>
                      <span
                        className={`font-medium ${
                          renderStatus.status === "completed"
                            ? "text-green-600"
                            : renderStatus.status === "failed"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {renderStatus.status}
                      </span>
                    </div>

                    {renderStatus.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
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
                      <div className="flex justify-between text-sm">
                        <span>Примерное завершение:</span>
                        <span>
                          {new Date(
                            renderStatus.estimated_completion
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    )}

                    {renderStatus.output_url && (
                      <div>
                        <a
                          href={renderStatus.output_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          📥 Скачать видео
                        </a>
                      </div>
                    )}

                    {renderStatus.error_message && (
                      <div className="text-red-600 text-sm">
                        Ошибка: {renderStatus.error_message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Кнопка рендеринга */}
              <div className="bg-white rounded-lg shadow p-6">
                <button
                  onClick={handleRender}
                  disabled={isRendering || !videoTitle.trim()}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    isRendering || !videoTitle.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isRendering ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⏳</span>
                      Рендеринг...
                    </>
                  ) : (
                    <>🚀 Создать видео</>
                  )}
                </button>

                <div className="mt-3 text-xs text-gray-500 text-center">
                  Примерное время рендеринга: 2-5 минут
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
