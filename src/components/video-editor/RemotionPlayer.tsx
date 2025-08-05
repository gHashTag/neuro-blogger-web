// ▶️ RemotionPlayer - Плеер для превью видео композиций
import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

interface RemotionPlayerProps {
  activeTemplate: "lipSync" | "promo" | "lottie";
  videoProps?: any;
  selectedAvatar?: any;
}

export default function RemotionPlayer({
  activeTemplate,
  videoProps,
  selectedAvatar,
}: RemotionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [duration] = useState(150); // 5 секунд при 30 FPS
  const [volume, setVolume] = useState(50);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((frame: number[]) => {
    setCurrentFrame(frame[0]);
  }, []);

  const handleVolumeChange = useCallback((vol: number[]) => {
    setVolume(vol[0]);
  }, []);

  const formatTime = (frame: number) => {
    const seconds = Math.floor(frame / 30);
    const frames = frame % 30;
    return `${seconds.toString().padStart(2, "0")}:${frames
      .toString()
      .padStart(2, "0")}`;
  };

  const getTemplatePreview = () => {
    switch (activeTemplate) {
      case "lipSync":
        return {
          title: "🎤 Lip Sync Template",
          description: "Синхронизация губ с аудио",
          thumbnail: "🎭",
          color: "from-blue-500 to-purple-600",
        };
      case "promo":
        return {
          title: "🎯 Promo Video Template",
          description: "Промо-видео для продуктов",
          thumbnail: "🚀",
          color: "from-green-500 to-blue-500",
        };
      default:
        return {
          title: "✨ Lottie Animation",
          description: "Анимированная графика",
          thumbnail: "🎨",
          color: "from-pink-500 to-yellow-500",
        };
    }
  };

  const preview = getTemplatePreview();

  return (
    <div className="space-y-4">
      {/* Video Preview Area */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        {/* Gradient background with template info */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-br ${preview.color} 
          flex items-center justify-center
        `}
        >
          <div className="text-center text-white">
            <div className="text-6xl mb-4">{preview.thumbnail}</div>
            <h3 className="text-xl font-bold mb-2">{preview.title}</h3>
            <p className="text-sm opacity-80">{preview.description}</p>
            <div className="mt-4 text-xs opacity-60">
              Frame: {currentFrame} / {duration}
            </div>
          </div>
        </div>

        {/* Play overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <Button
              size="lg"
              className="rounded-full w-16 h-16 text-2xl"
              onClick={handlePlayPause}
            >
              ▶️
            </Button>
          </div>
        )}

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-30">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${(currentFrame / duration) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatTime(currentFrame)}</span>
            <span>Timeline</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[currentFrame]}
            onValueChange={handleSeek}
            max={duration}
            step={1}
            className="w-full"
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Previous frame */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
            >
              ⏮️
            </Button>

            {/* Play/Pause */}
            <Button size="sm" onClick={handlePlayPause} className="w-12">
              {isPlaying ? "⏸️" : "▶️"}
            </Button>

            {/* Next frame */}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setCurrentFrame(Math.min(duration, currentFrame + 1))
              }
            >
              ⏭️
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 w-32">
            <span className="text-xs">🔊</span>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-gray-500 w-8">{volume}%</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="flex justify-between">
            <span>🎬 Template: {activeTemplate}</span>
            <span>📐 1920×1080</span>
            <span>🎞️ 30 FPS</span>
            <span>⏱️ {Math.ceil(duration / 30)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
