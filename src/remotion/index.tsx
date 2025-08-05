import React from "react";
import { Composition, registerRoot, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  LipSyncTemplate,
  LipSyncTemplateProps,
} from "../video-templates/LipSyncTemplate";

// 🎛️ Упрощенная Zod Schema (только файлы из test-assets)
export const lipSyncTemplateSchema = z.object({
  // 🎤 Аватар (БАЗА - самый низ)
  lipSyncVideo: z.string().describe("🎤 Аватар lip-sync (БАЗА - самый низ)"),

  // 📸 Обложка
  coverImage: z.string().describe("📸 Обложка в начале"),

  // 🎵 Аудио
  backgroundMusic: z.string().describe("🎵 Фоновая музыка"),
  musicVolume: z.number().min(0).max(1).describe("🔊 Громкость музыки"),

  // 🎨 4 фоновых видео (полностью перекрывают аватар)
  backgroundVideos: z
    .array(z.string())
    .describe("🎬 4 BG видео (полностью перекрывают аватар)"),

  // ⏱️ Тайминг
  coverDuration: z
    .number()
    .min(0.5)
    .max(10)
    .describe("⏱️ Длительность обложки (сек)"),
  lipSyncDelay: z.number().min(0).max(10).describe("⏸️ НЕ ИСПОЛЬЗУЕТСЯ"),

  // ✨ Простые эффекты
  vignetteStrength: z.number().min(0).max(1).describe("🌟 Сила виньетки"),
  colorCorrection: z.number().min(0.5).max(2).describe("🎨 Цветокоррекция"),
});

// Конфигурация для первого темплейта
const defaultVideoConfig = {
  width: 720,
  height: 1280, // Вертикальный формат для соцсетей
  fps: 30,
  durationInFrames: 450, // Будет перезаписано в calculateMetadata
};

// 🎬 Функция для динамического определения длительности по lip-sync видео (ОСНОВА!)
const calculateDynamicMetadata = async ({
  props,
}: {
  props: LipSyncTemplateProps;
}) => {
  try {
    // LIP-SYNC - ЭТО ОСНОВА! Получаем его длительность
    const lipSyncDuration = await getAudioDurationInSeconds(props.lipSyncVideo);

    // Общая длительность = coverDuration + lip-sync длительность
    // Все остальные элементы подстраиваются под эту схему
    const totalDuration = props.coverDuration + lipSyncDuration;
    const durationInFrames = Math.ceil(totalDuration * defaultVideoConfig.fps);

    console.log(
      `🎬 [LIP-SYNC ОСНОВА] lip-sync: ${lipSyncDuration}s + cover: ${props.coverDuration}s = ИТОГО: ${totalDuration}s (${durationInFrames} frames)`
    );

    return {
      durationInFrames,
      fps: defaultVideoConfig.fps,
      width: defaultVideoConfig.width,
      height: defaultVideoConfig.height,
    };
  } catch (error) {
    console.warn("⚠️ Failed to get lip-sync duration, using default:", error);
    // Fallback к дефолтной длительности при ошибке
    return {
      durationInFrames: defaultVideoConfig.durationInFrames,
      fps: defaultVideoConfig.fps,
      width: defaultVideoConfig.width,
      height: defaultVideoConfig.height,
    };
  }
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LipSyncTemplate"
        component={LipSyncTemplate}
        durationInFrames={defaultVideoConfig.durationInFrames}
        fps={defaultVideoConfig.fps}
        width={defaultVideoConfig.width}
        height={defaultVideoConfig.height}
        defaultProps={{
          // 🎤 Аватар (БАЗА - самый низ)
          lipSyncVideo: staticFile("test-assets/lip-sync.mp4"),

          // 📸 Обложка
          coverImage: staticFile("test-assets/cover01.png"),

          // 🎵 Аудио
          backgroundMusic: staticFile("test-assets/news.mp3"),
          musicVolume: 0.5,

          // 🎨 4 BG видео (полностью перекрывают аватар)
          backgroundVideos: [
            staticFile("test-assets/bg-video01.mp4"),
            staticFile("test-assets/bg-video02.mp4"),
            staticFile("test-assets/bg-video03.mp4"),
            staticFile("test-assets/bg-video04.mp4"),
          ],

          // ⏱️ Тайминг
          coverDuration: 0.5,
          lipSyncDelay: 0, // НЕ ИСПОЛЬЗУЕТСЯ

          // ✨ Простые эффекты
          vignetteStrength: 0.7,
          colorCorrection: 1.2,
        }}
        calculateMetadata={calculateDynamicMetadata}
        schema={lipSyncTemplateSchema}
      />
    </>
  );
};

// 🎬 Регистрируем Root компонент для Remotion
// Защита от повторных регистраций с использованием глобальной переменной
declare global {
  var __REMOTION_ROOT_REGISTERED__: boolean | undefined;
}

if (!globalThis.__REMOTION_ROOT_REGISTERED__) {
  try {
    registerRoot(RemotionRoot);
    globalThis.__REMOTION_ROOT_REGISTERED__ = true;
  } catch (error) {
    // Игнорируем ошибку повторной регистрации
    console.warn("🎬 Remotion root already registered, skipping...");
  }
}
