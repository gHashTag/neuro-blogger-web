// 📋 TrackList - Список треков/слоев для видео редактора
import React from "react";
import { Button } from "../ui/button";

interface Track {
  id: string;
  name: string;
  type: "video" | "audio" | "image" | "text";
  duration: number;
  enabled: boolean;
}

interface TrackListProps {
  activeTemplate: "lipSync" | "promo" | "lottie";
  selectedAvatar?: any;
}

export default function TrackList({
  activeTemplate,
  selectedAvatar,
}: TrackListProps) {
  // Мок треки в зависимости от шаблона
  const getTracksForTemplate = (template: string): Track[] => {
    switch (template) {
      case "lipSync":
        return [
          {
            id: "1",
            name: "🎤 Lip-Sync Video",
            type: "video",
            duration: 15,
            enabled: true,
          },
          {
            id: "2",
            name: "🎵 Background Music",
            type: "audio",
            duration: 15,
            enabled: true,
          },
          {
            id: "3",
            name: "🖼️ Cover Image",
            type: "image",
            duration: 0.5,
            enabled: true,
          },
          {
            id: "4",
            name: "🎬 BG Video 1",
            type: "video",
            duration: 4,
            enabled: true,
          },
          {
            id: "5",
            name: "🎬 BG Video 2",
            type: "video",
            duration: 4,
            enabled: false,
          },
        ];
      case "promo":
        return [
          {
            id: "1",
            name: "📺 Main Video",
            type: "video",
            duration: 10,
            enabled: true,
          },
          {
            id: "2",
            name: "🎵 Soundtrack",
            type: "audio",
            duration: 10,
            enabled: true,
          },
          {
            id: "3",
            name: "📝 Title Text",
            type: "text",
            duration: 3,
            enabled: true,
          },
        ];
      default:
        return [
          {
            id: "1",
            name: "✨ Lottie Animation",
            type: "video",
            duration: 8,
            enabled: true,
          },
          {
            id: "2",
            name: "🎵 Background",
            type: "audio",
            duration: 8,
            enabled: true,
          },
        ];
    }
  };

  const tracks = getTracksForTemplate(activeTemplate);

  const getTypeIcon = (type: Track["type"]) => {
    switch (type) {
      case "video":
        return "🎬";
      case "audio":
        return "🎵";
      case "image":
        return "🖼️";
      case "text":
        return "📝";
      default:
        return "📄";
    }
  };

  const getTypeColor = (type: Track["type"]) => {
    switch (type) {
      case "video":
        return "bg-blue-50 border-blue-200";
      case "audio":
        return "bg-green-50 border-green-200";
      case "image":
        return "bg-purple-50 border-purple-200";
      case "text":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-600">
          Треки ({tracks.length})
        </h4>
        <Button size="sm" variant="outline" className="h-7 text-xs">
          + Добавить
        </Button>
      </div>

      {/* Список треков */}
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`
              p-3 rounded-lg border transition-all cursor-pointer
              ${
                track.enabled
                  ? getTypeColor(track.type)
                  : "bg-gray-50 border-gray-200 opacity-60"
              }
              hover:shadow-sm
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{getTypeIcon(track.type)}</span>
                <span className="text-xs font-medium text-gray-700">
                  #{index + 1}
                </span>
              </div>

              {/* Toggle */}
              <button
                className={`
                  w-4 h-4 rounded border-2 flex items-center justify-center text-xs
                  ${
                    track.enabled
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300"
                  }
                `}
              >
                {track.enabled && "✓"}
              </button>
            </div>

            {/* Track name */}
            <div className="text-sm font-medium text-gray-800 mb-1">
              {track.name}
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{track.duration}s</span>
              <div className="flex gap-1">
                <button className="w-5 h-5 text-gray-400 hover:text-gray-600 text-xs">
                  ⚙️
                </button>
                <button className="w-5 h-5 text-gray-400 hover:text-red-500 text-xs">
                  🗑️
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 transition-all"
                style={{ width: `${(track.duration / 15) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add new track button */}
      <Button
        variant="outline"
        className="w-full h-12 text-gray-500 border-dashed border-2"
      >
        + Перетащите файл или нажмите для добавления
      </Button>
    </div>
  );
}
