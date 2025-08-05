import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HeyGenAvatar {
  avatar_id: string;
  avatar_name: string;
  preview_image_url: string;
  preview_video_url?: string;
  status: "ready" | "processing" | "failed";
  created_at: string;
}

interface HeyGenAvatarLibraryProps {
  onAvatarSelect: (avatar: any) => void;
}

export function HeyGenAvatarLibrary({
  onAvatarSelect,
}: HeyGenAvatarLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatars, setAvatars] = useState<HeyGenAvatar[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 📡 Загрузка списка аватаров
  const loadAvatars = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔍 Loading HeyGen avatars...");

      const response = await fetch("/api/avatar/list");

      if (!response.ok) {
        throw new Error(`Failed to load avatars: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to load avatars");
      }

      console.log(
        `✅ Loaded ${result.avatars.length} avatars:`,
        result.avatars
      );
      setAvatars(result.avatars);
    } catch (err) {
      console.error("❌ Error loading avatars:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Обработка выбора аватара
  const handleAvatarSelect = (heygenAvatar: HeyGenAvatar) => {
    console.log("🎭 Selected HeyGen avatar:", heygenAvatar);

    // Конвертируем в формат нашего приложения
    const avatar = {
      id: heygenAvatar.avatar_id,
      name: heygenAvatar.avatar_name,
      method: "heygen_preset",
      style: "realistic",
      status: "ready",
      heygen_avatar_id: heygenAvatar.avatar_id,
      thumbnail: heygenAvatar.preview_image_url,
      preview_video: heygenAvatar.preview_video_url,
      created_at: heygenAvatar.created_at,
      remotion_props: {
        avatarImageUrl: heygenAvatar.preview_image_url,
        lipSyncVideo:
          heygenAvatar.preview_video_url || "/test-assets/lip-sync.mp4",
      },
    };

    onAvatarSelect(avatar);
    setIsOpen(false);
  };

  // 🎨 Загрузка при открытии модала
  useEffect(() => {
    if (isOpen && avatars.length === 0) {
      loadAvatars();
    }
  }, [isOpen, avatars.length]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          🎭 HeyGen Библиотека
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎭 Библиотека HeyGen Аватаров
            {avatars.length > 0 && (
              <Badge variant="secondary">{avatars.length} доступно</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Выберите готовый аватар из библиотеки HeyGen
            </p>
            <Button
              onClick={loadAvatars}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "🔄 Обновить"
              )}
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && avatars.length === 0 ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Загружаем аватары...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-red-500 mb-2">❌ Ошибка загрузки</p>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button onClick={loadAvatars} size="sm">
                    🔄 Попробовать снова
                  </Button>
                </div>
              </div>
            ) : avatars.length === 0 ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    📭 Нет доступных аватаров
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Проверьте настройки HeyGen API
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {avatars.map((avatar) => (
                  <Card
                    key={avatar.avatar_id}
                    className="p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    {/* Preview Image */}
                    <div className="aspect-video mb-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
                      {avatar.preview_image_url ? (
                        <img
                          src={avatar.preview_image_url}
                          alt={avatar.avatar_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback для сломанных ссылок
                            const target = e.target as HTMLImageElement;
                            target.src = "/avatars/placeholder.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">🎭</span>
                        </div>
                      )}
                    </div>

                    {/* Avatar Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {avatar.avatar_name}
                        </h4>
                        <Badge
                          variant={
                            avatar.status === "ready" ? "default" : "secondary"
                          }
                          className="ml-2 text-xs"
                        >
                          {avatar.status === "ready" ? "✅" : "⏳"}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        ID: {avatar.avatar_id}
                      </div>

                      {avatar.preview_video_url && (
                        <div className="text-xs text-green-600">
                          🎥 Видео превью доступно
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HeyGenAvatarLibrary;
