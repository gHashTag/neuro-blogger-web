// 🎬 Video Editor - Объединённый редактор видео
// Интеграция лучшего UX из Promo-Video-Beta с нашей архитектурой

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { VideoFrameProvider } from "../components/context/VideoFrameContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

// Компоненты
import ExportButton from "../components/video-editor/ExportButton";
import TrackList from "../components/video-editor/TrackList";
import RemotionPlayer from "../components/video-editor/RemotionPlayer";
import FrameConfig from "../components/video-editor/FrameConfig";
import { AvatarCreationModal } from "../components/modal/AvatarCreationModal";
import { AvatarManager } from "../components/video-editor/AvatarManager";
import { HeyGenAvatarLibrary } from "../components/video-editor/HeyGenAvatarLibrary";

export default function VideoEditor() {
  const [activeTemplate, setActiveTemplate] = useState<
    "lipSync" | "promo" | "lottie"
  >("promo");

  // 🎭 Avatar Management State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [createdAvatars, setCreatedAvatars] = useState<any[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null);
  const [currentVideoProps, setCurrentVideoProps] = useState<any>({});

  // 🎭 Avatar Creation Handler
  const handleAvatarCreated = (avatar: any) => {
    console.log("🎭 New avatar created:", avatar);
    setCreatedAvatars((prev) => [...prev, avatar]);

    // Автоматически выбираем созданный аватар
    setSelectedAvatar(avatar);

    // Автоматически переключаемся на lip-sync шаблон для аватара
    if (activeTemplate !== "lipSync") {
      setActiveTemplate("lipSync");
    }
  };

  // 🎭 Avatar Use Handler - интеграция с видео шаблоном
  const handleAvatarUse = (avatar: any) => {
    console.log("🎬 Using avatar in video:", avatar);

    // Обновляем props для Remotion шаблона
    const newVideoProps = {
      ...currentVideoProps,
      // Используем avatar данные в lip-sync шаблоне
      lipSyncVideo:
        avatar.remotion_props?.lipSyncVideo ||
        avatar.preview_video ||
        "/test-assets/lip-sync.mp4",
      avatarImageUrl: avatar.thumbnail,
      avatarName: avatar.name,
      avatarStyle: avatar.style,
    };

    setCurrentVideoProps(newVideoProps);
    setSelectedAvatar(avatar);

    // Переключаемся на lip-sync шаблон
    if (activeTemplate !== "lipSync") {
      setActiveTemplate("lipSync");
    }

    console.log("✅ Video props updated with avatar:", newVideoProps);
  };

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
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">
                      Создавайте профессиональные видео
                    </p>
                    {selectedAvatar && (
                      <Badge variant="outline" className="text-xs">
                        🎭 {selectedAvatar.name}
                      </Badge>
                    )}
                  </div>
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
                  <AvatarCreationModal
                    isOpen={isAvatarModalOpen}
                    onOpen={() => setIsAvatarModalOpen(true)}
                    onOpenChange={() => setIsAvatarModalOpen(false)}
                    onAvatarCreated={handleAvatarCreated}
                  />
                  <HeyGenAvatarLibrary onAvatarSelect={handleAvatarUse} />
                  {createdAvatars.length > 0 && (
                    <AvatarManager
                      avatars={createdAvatars}
                      selectedAvatar={selectedAvatar}
                      onAvatarSelect={setSelectedAvatar}
                      onAvatarUse={handleAvatarUse}
                    />
                  )}
                  <Button variant="outline">💾 Сохранить</Button>
                  <ExportButton
                    activeTemplate={activeTemplate}
                    videoProps={currentVideoProps}
                    selectedAvatar={selectedAvatar}
                  />
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
                  <TrackList
                    activeTemplate={activeTemplate}
                    selectedAvatar={selectedAvatar}
                  />
                </div>
              </div>

              {/* 🎥 Center Panel - Video Player */}
              <div className="col-span-3">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    🎥 Превью
                  </h3>
                  <RemotionPlayer
                    activeTemplate={activeTemplate}
                    videoProps={currentVideoProps}
                    selectedAvatar={selectedAvatar}
                  />
                </div>
              </div>

              {/* ⚙️ Right Panel - Frame Configuration */}
              <div className="col-span-2">
                <div className="bg-white rounded-lg shadow p-4">
                  <FrameConfig
                    activeTemplate={activeTemplate}
                    videoProps={currentVideoProps}
                    onPropsChange={setCurrentVideoProps}
                    selectedAvatar={selectedAvatar}
                  />
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
