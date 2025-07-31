// 🎬 Video Editor - Объединённый редактор видео
// Интеграция лучшего UX из Promo-Video-Beta с нашей архитектурой

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { VideoFrameProvider } from "../components/context/VideoFrameContext";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

// Компоненты
import ExportButton from "../components/video-editor/ExportButton";
// import TrackList from "../components/video-editor/TrackList";
// import RemotionPlayer from "../components/video-editor/RemotionPlayer";
// import FrameConfig from "../components/video-editor/FrameConfig";

export default function VideoEditor() {
  const [activeTemplate, setActiveTemplate] = useState<
    "lipSync" | "promo" | "lottie"
  >("promo");

  return (
    <>
      <Head>
        <title>Video Editor - Создайте профессиональное видео</title>
        <meta
          name="description"
          content="Мощный редактор видео с AI и Remotion"
        />
      </Head>

      <VideoFrameProvider>
        <div className="min-h-screen bg-gray-50">
          {/* 📊 Header */}
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    🎬 Video Editor
                  </h1>
                  <p className="text-sm text-gray-500">
                    Создавайте профессиональные видео
                  </p>
                </div>

                {/* Template Selector */}
                <Tabs
                  value={activeTemplate}
                  onValueChange={(value: string) =>
                    setActiveTemplate(value as "lipSync" | "promo" | "lottie")
                  }
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="promo">🎭 Promo Video</TabsTrigger>
                    <TabsTrigger value="lipSync">🎤 Lip Sync</TabsTrigger>
                    <TabsTrigger value="lottie">✨ Lottie</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline">💾 Сохранить</Button>
                  <ExportButton activeTemplate={activeTemplate} />
                </div>
              </div>
            </div>
          </div>

          {/* 🎛️ Main Editor Layout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400 text-lg">ℹ️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Новый мощный редактор!</strong> Выберите тип шаблона
                    выше и создавайте профессиональные видео с AI и Remotion.
                  </p>
                </div>
              </div>
            </div>

            {/* Editor Grid Layout (аналог из Promo-Video-Beta) */}
            <div className="grid grid-cols-6 gap-6">
              {/* 📋 Left Panel - Track List */}
              <div className="col-span-1">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">📋 Треки</h3>
                  {/* <TrackList activeTemplate={activeTemplate} /> */}

                  {/* Временный заглушка */}
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="p-2 bg-gray-50 rounded border text-sm"
                      >
                        Кадр {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 🎥 Center Panel - Video Player */}
              <div className="col-span-3">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    🎥 Превью
                  </h3>
                  {/* <RemotionPlayer activeTemplate={activeTemplate} /> */}

                  {/* Временная заглушка */}
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">🎬</div>
                      <div>Remotion Player</div>
                      <div className="text-sm mt-1">
                        Активный шаблон: <strong>{activeTemplate}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="mt-4 flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📺 Формат видео
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                        <option value="9:16">9:16 (Вертикальное)</option>
                        <option value="16:9">16:9 (Горизонтальное)</option>
                        <option value="1:1">1:1 (Квадрат)</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        🎵 Фоновая музыка
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                        <option>News Theme</option>
                        <option>Upbeat</option>
                        <option>Corporate</option>
                        <option>Chill</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ⚙️ Right Panel - Frame Configuration */}
              <div className="col-span-2">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    ⚙️ Настройки кадра
                  </h3>
                  {/* <FrameConfig activeTemplate={activeTemplate} /> */}

                  {/* Временная заглушка */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📝 Текст
                      </label>
                      <input
                        type="text"
                        defaultValue="НОВАЯ МОДЕЛЬ GEMINI"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        🎨 Цвет фона
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          defaultValue="#007AFF"
                          className="w-12 h-8 rounded"
                        />
                        <input
                          type="text"
                          defaultValue="#007AFF"
                          className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ⏱️ Длительность: 1.0 сек
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        defaultValue="1"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        🎭 Анимация
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                        <option>fadeIn</option>
                        <option>slideUp</option>
                        <option>zoomIn</option>
                        <option>slideRight</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        🔤 Шрифт
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                        <option>Outfit</option>
                        <option>Bungee</option>
                        <option>Anton</option>
                        <option>Rowdies</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 📊 Timeline (будущее развитие) */}
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📊 Timeline</h3>
              <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">
                  Временная шкала (в разработке)
                </span>
              </div>
            </div>
          </div>
        </div>
      </VideoFrameProvider>
    </>
  );
}
