import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface LipSyncTemplateProps {
  // 🎤 Основное видео (аватар - БАЗА)
  lipSyncVideo: string;

  // 📸 Обложка
  coverImage: string;

  // 🎵 Аудио
  backgroundMusic: string;
  musicVolume: number;

  // 🎨 4 фоновых слоя (полностью перекрывают аватар)
  backgroundVideos: string[];

  // ⏱️ Тайминг
  coverDuration: number;
  lipSyncDelay: number; // НЕ ИСПОЛЬЗУЕТСЯ

  // ✨ Простые эффекты
  vignetteStrength: number;
  colorCorrection: number;
}

export const LipSyncTemplate: React.FC<
  LipSyncTemplateProps & Record<string, unknown>
> = ({
  lipSyncVideo,
  coverImage,
  backgroundMusic,
  musicVolume,
  backgroundVideos,
  coverDuration,
  lipSyncDelay,
  vignetteStrength = 0.7,
  colorCorrection = 1.2,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  // 📊 ТАЙМИНГ ПЕРЕХОДОВ (аватар ↔ BG роллы)
  const totalDurationSeconds = durationInFrames / fps; // ~29 секунд
  const coverDurationFrames = coverDuration * fps;

  // 🎤 Аватар играет всегда (БАЗА)
  const lipSyncStartFrame = 0;
  const lipSyncDurationFrames = durationInFrames;

  // 🎬 ПЕРЕХОДЫ: Аватар → BG ролл → Аватар → BG ролл
  // После обложки (2с) начинаются переходы каждые ~5-7 секунд
  const transitionDuration = 5; // секунд на каждый BG ролл
  const transitionFrames = transitionDuration * fps;
  const gapDuration = 2; // секунд аватара между BG роллами
  const gapFrames = gapDuration * fps;

  // 🎨 Расчет времени для каждого BG ролла
  const bgSegments = [
    {
      name: "BG_01",
      video: backgroundVideos[0],
      startFrame: coverDurationFrames + gapFrames, // 2с + 2с = 4с
      durationFrames: transitionFrames, // 5с
    },
    {
      name: "BG_02",
      video: backgroundVideos[1],
      startFrame:
        coverDurationFrames + gapFrames + transitionFrames + gapFrames, // 4с + 5с + 2с = 11с
      durationFrames: transitionFrames, // 5с
    },
    {
      name: "BG_03",
      video: backgroundVideos[2],
      startFrame:
        coverDurationFrames + (gapFrames + transitionFrames) * 2 + gapFrames, // 18с
      durationFrames: transitionFrames, // 5с
    },
    {
      name: "BG_04",
      video: backgroundVideos[3],
      startFrame:
        coverDurationFrames + (gapFrames + transitionFrames) * 3 + gapFrames, // 25с
      durationFrames: Math.min(
        transitionFrames,
        durationInFrames -
          (coverDurationFrames + (gapFrames + transitionFrames) * 3 + gapFrames)
      ), // до конца
    },
  ];

  // Удалено: getCurrentBgSegment и currentBgSegment - теперь используются отдельные Sequence

  // 🎬 ПРОСТАЯ АНИМАЦИЯ: FULLSCREEN → ИСЧЕЗНОВЕНИЕ В ОДИН ШАГ
  const fadeStartFrame = Math.max(1, coverDurationFrames - fps * 0.3); // Минимум 1 кадр до конца
  const coverOpacity = interpolate(
    frame,
    [0, fadeStartFrame, coverDurationFrames],
    [1, 1, 0], // Видимая до конца, потом резко исчезает
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Масштаб: ОДИН В ОДИН → исчезновение
  const coverScale = interpolate(
    frame,
    [0, fadeStartFrame, coverDurationFrames],
    [1.0, 1.0, 0], // Начинаем 1:1, держим, потом сжимаемся в точку
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 🎭 АНИМАЦИИ И ПЕРЕХОДЫ

  // Удалено: getTransitionOpacity и bgOpacity - теперь используется локальная логика в каждом Sequence

  // 💫 Vignette эффект
  const vignetteOpacity = vignetteStrength;

  // 🎨 Color Correction
  const ccFilter = `brightness(${colorCorrection}) contrast(1.1) saturate(1.2)`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 🎵 НИЗ: Audio_01 - фоновая музыка */}
      <Audio src={backgroundMusic} volume={musicVolume} />

      {/* 🎤 БАЗА: Lip-sync видео (аватар) - САМЫЙ НИЖНИЙ ВИДЕО СЛОЙ */}
      <Sequence
        name="🎤 Аватар (БАЗА)"
        from={lipSyncStartFrame}
        durationInFrames={lipSyncDurationFrames}
      >
        <AbsoluteFill>
          <Video
            src={lipSyncVideo}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 🎬 BG РОЛЛЫ: Отдельные Sequence для каждого (видимы в Timeline) */}
      {bgSegments.map((segment, index) => {
        // УПРОЩЁННАЯ логика: просто показываем BG ролл в своё время
        const segmentOpacity = 1; // Всегда видимый когда активен

        return (
          <Sequence
            key={`bg-segment-${index}`}
            name={`🎬 ${segment.name}`}
            from={segment.startFrame}
            durationInFrames={segment.durationFrames}
          >
            <AbsoluteFill style={{ opacity: segmentOpacity }}>
              <Video
                src={segment.video}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: ccFilter, // Color Correction
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* 🌟 Vignette эффект (поверх BG видео) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* 📸 Cover (самый верх - поверх всего в начале) */}
      <Sequence
        name="📸 Обложка"
        from={0}
        durationInFrames={coverDurationFrames}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: coverOpacity,
            backgroundColor: `rgba(0, 0, 0, ${interpolate(
              coverOpacity,
              [0, 1],
              [0, 0.8] // Простой фон, зависящий от прозрачности
            )})`,
          }}
        >
          <Img
            src={coverImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Заполняет весь экран один в один
              transform: `scale(${coverScale})`,
              borderRadius: 0, // Без скругления - полный экран
            }}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
