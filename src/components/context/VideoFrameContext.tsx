// 🎬 Video Frame Context - Управление состоянием видео
// Аналог VideoFrameContext из Promo-Video-Beta проекта

"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// 🎯 Типы для видео кадров (из Promo-Video-Beta)
export interface VideoFrame {
  animation: string; // "fadeIn", "slideUp", "zoomIn", "slideRight"
  bgColor: string; // "#007AFF" или "linear-gradient(...)"
  duration: number; // в секундах
  fontFamily: string; // "Outfit", "Bungee", "Anton", "Rowdies"
  fontSize: number;
  image?: string; // путь к изображению
  sticker?: string; // URL эмодзи стикера
  stickerSize?: number;
  text: string;
  textColor: string; // "rgba(255,255,255,1)"
}

// 🎬 Основная структура видео данных
export interface VideoFrames {
  frameList: VideoFrame[];
  music: string; // путь к аудио файлу
  selectedFrame: number; // индекс выбранного кадра
  totalDuration: number; // общая длительность в секундах
  screenWidth: number; // ширина видео (720, 1280, 500)
  screenHeight: number; // высота видео (1280, 720, 500)
}

// 🎭 Тип контекста
interface VideoFrameContextType {
  videoFrames: VideoFrames | null;
  setVideoFrames: React.Dispatch<React.SetStateAction<VideoFrames | null>>;
  updateFrame: (frameIndex: number, updatedFrame: Partial<VideoFrame>) => void;
  addFrame: (frame: VideoFrame) => void;
  removeFrame: (frameIndex: number) => void;
  selectFrame: (frameIndex: number) => void;
  updateVideoSettings: (
    settings: Partial<Omit<VideoFrames, "frameList">>
  ) => void;
}

// 🎪 Создаём контекст
const VideoFrameContext = createContext<VideoFrameContextType | undefined>(
  undefined
);

// 🎬 Дефолтные данные видео
const defaultVideoFrames: VideoFrames = {
  frameList: [
    {
      animation: "fadeIn",
      bgColor: "#007AFF",
      duration: 1,
      fontFamily: "Outfit",
      fontSize: 48,
      image: "/footage.png",
      sticker: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif",
      stickerSize: 100,
      text: "НОВАЯ МОДЕЛЬ",
      textColor: "rgba(255,255,255,1)",
    },
    {
      animation: "slideUp",
      bgColor: "#FFD700",
      duration: 1.5,
      fontFamily: "Bungee",
      fontSize: 36,
      image: "/footage.png",
      sticker: "https://fonts.gstatic.com/s/e/notoemoji/latest/270f/512.gif",
      stickerSize: 80,
      text: "GEMINI 2.0",
      textColor: "rgba(0,0,0,1)",
    },
    {
      animation: "zoomIn",
      bgColor: "linear-gradient(to right, #FF0000, #FFFF00)",
      duration: 1,
      fontFamily: "Anton",
      fontSize: 42,
      image: "/footage.png",
      sticker: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4af/512.gif",
      stickerSize: 70,
      text: "ИННОВАЦИЯ",
      textColor: "rgba(255,0,0,1)",
    },
    {
      animation: "slideRight",
      bgColor: "#00FF00",
      duration: 1,
      fontFamily: "Rowdies",
      fontSize: 30,
      image: "/footage.png",
      sticker: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f3a5/512.gif",
      stickerSize: 90,
      text: "БУДУЩЕЕ",
      textColor: "rgba(0,255,0,1)",
    },
    {
      animation: "slideRight",
      bgColor: "#8B4513",
      duration: 1,
      fontFamily: "Outfit",
      fontSize: 30,
      image: "/footage.png",
      sticker: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f3a5/512.gif",
      stickerSize: 90,
      text: "УЖЕ ЗДЕСЬ",
      textColor: "rgba(0,0,255,1)",
    },
    {
      animation: "slideRight",
      bgColor: "linear-gradient(to bottom, #FF0000, #0000FF)",
      duration: 3.5,
      fontFamily: "Bungee",
      fontSize: 40,
      image: "/footage.png",
      sticker: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f3a5/512.gif",
      stickerSize: 90,
      text: "НОВАЯ ЭРА",
      textColor: "rgba(255,140,0,1)",
    },
  ],
  music: "test-assets/news.mp3",
  selectedFrame: 0,
  totalDuration: 9,
  screenWidth: 720,
  screenHeight: 1280,
};

// 🎭 Провайдер контекста
export function VideoFrameProvider({ children }: { children: ReactNode }) {
  const [videoFrames, setVideoFrames] = useState<VideoFrames | null>(
    defaultVideoFrames
  );

  // 🔄 Обновление отдельного кадра
  const updateFrame = (
    frameIndex: number,
    updatedFrame: Partial<VideoFrame>
  ) => {
    setVideoFrames((prev) => {
      if (!prev) return prev;

      const newFrameList = [...prev.frameList];
      newFrameList[frameIndex] = {
        ...newFrameList[frameIndex],
        ...updatedFrame,
      };

      // Пересчитываем общую длительность
      const newTotalDuration = newFrameList.reduce(
        (sum, frame) => sum + frame.duration,
        0
      );

      return {
        ...prev,
        frameList: newFrameList,
        totalDuration: newTotalDuration,
      };
    });
  };

  // ➕ Добавление нового кадра
  const addFrame = (frame: VideoFrame) => {
    setVideoFrames((prev) => {
      if (!prev) return prev;

      const newFrameList = [...prev.frameList, frame];
      const newTotalDuration = newFrameList.reduce(
        (sum, f) => sum + f.duration,
        0
      );

      return {
        ...prev,
        frameList: newFrameList,
        totalDuration: newTotalDuration,
      };
    });
  };

  // ➖ Удаление кадра
  const removeFrame = (frameIndex: number) => {
    setVideoFrames((prev) => {
      if (!prev || prev.frameList.length <= 1) return prev; // Оставляем минимум 1 кадр

      const newFrameList = prev.frameList.filter(
        (_, index) => index !== frameIndex
      );
      const newTotalDuration = newFrameList.reduce(
        (sum, frame) => sum + frame.duration,
        0
      );

      return {
        ...prev,
        frameList: newFrameList,
        totalDuration: newTotalDuration,
        selectedFrame: Math.min(prev.selectedFrame, newFrameList.length - 1),
      };
    });
  };

  // 👆 Выбор кадра
  const selectFrame = (frameIndex: number) => {
    setVideoFrames((prev) => {
      if (!prev) return prev;
      return { ...prev, selectedFrame: frameIndex };
    });
  };

  // ⚙️ Обновление общих настроек видео
  const updateVideoSettings = (
    settings: Partial<Omit<VideoFrames, "frameList">>
  ) => {
    setVideoFrames((prev) => {
      if (!prev) return prev;
      return { ...prev, ...settings };
    });
  };

  const contextValue: VideoFrameContextType = {
    videoFrames,
    setVideoFrames,
    updateFrame,
    addFrame,
    removeFrame,
    selectFrame,
    updateVideoSettings,
  };

  return (
    <VideoFrameContext.Provider value={contextValue}>
      {children}
    </VideoFrameContext.Provider>
  );
}

// 🪝 Хук для использования контекста
export function useVideoFrame() {
  const context = useContext(VideoFrameContext);
  if (context === undefined) {
    throw new Error("useVideoFrame must be used within a VideoFrameProvider");
  }
  return context;
}

// 🎬 Экспорт для совместимости
export { VideoFrameContext };
