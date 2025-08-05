import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/types/avatar";
import { cn } from "@/utils/cn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AvatarManagerProps {
  avatars: Avatar[];
  selectedAvatar?: Avatar;
  onAvatarSelect: (avatar: Avatar) => void;
  onAvatarUse: (avatar: Avatar) => void;
}

export function AvatarManager({
  avatars,
  selectedAvatar,
  onAvatarSelect,
  onAvatarUse,
}: AvatarManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: Avatar["status"]) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-500">✅ Готов</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500">⏳ Создается</Badge>;
      case "creating":
        return <Badge className="bg-blue-500">🎨 Обработка</Badge>;
      case "failed":
        return <Badge className="bg-red-500">❌ Ошибка</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodEmoji = (method: Avatar["method"]) => {
    switch (method) {
      case "text":
        return "🎨";
      case "photo":
        return "📸";
      case "video":
        return "🎬";
      default:
        return "🎭";
    }
  };

  const getStyleEmoji = (style: Avatar["style"]) => {
    switch (style) {
      case "realistic":
        return "🎯";
      case "animated":
        return "🎨";
      case "stylized":
        return "✨";
      default:
        return "🎭";
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          🎭 Аватары
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {avatars.length}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎭 Менеджер Аватаров
            <Badge variant="outline">{avatars.length} аватаров</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] pr-2">
          {avatars.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-lg font-medium mb-2">Нет аватаров</h3>
              <p className="text-muted-foreground mb-4">
                Создайте первый аватар с помощью AI
              </p>
              <Button onClick={() => setIsDialogOpen(false)}>
                Создать Аватар
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {avatars.map((avatar) => (
                <Card
                  key={avatar.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all border-2",
                    selectedAvatar?.id === avatar.id
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => onAvatarSelect(avatar)}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar Preview */}
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center overflow-hidden">
                      {avatar.thumbnail ? (
                        <img
                          src={avatar.thumbnail}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">
                          {getMethodEmoji(avatar.method)}
                        </span>
                      )}
                    </div>

                    {/* Avatar Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium truncate pr-2">
                          {avatar.name}
                        </h4>
                        {getStatusBadge(avatar.status)}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>
                          {getMethodEmoji(avatar.method)} {avatar.method}
                        </span>
                        <span>•</span>
                        <span>
                          {getStyleEmoji(avatar.style)} {avatar.style}
                        </span>
                      </div>

                      {avatar.training_data?.prompt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {avatar.training_data.prompt}
                        </p>
                      )}

                      <div className="text-xs text-muted-foreground">
                        {new Date(avatar.created_at).toLocaleDateString(
                          "ru-RU"
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    {avatar.status === "ready" && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAvatarUse(avatar);
                          setIsDialogOpen(false);
                        }}
                      >
                        🎬 Использовать
                      </Button>
                    )}

                    {avatar.status === "processing" && (
                      <Button size="sm" variant="outline" disabled>
                        ⏳ Создается...
                      </Button>
                    )}

                    {avatar.status === "failed" && (
                      <Button size="sm" variant="outline" disabled>
                        ❌ Ошибка
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Здесь можно добавить функционал просмотра деталей
                        console.log("Show avatar details:", avatar);
                      }}
                    >
                      👁️ Детали
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Selected Avatar Info */}
        {selectedAvatar && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Выбран: {selectedAvatar.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {getMethodEmoji(selectedAvatar.method)}{" "}
                  {selectedAvatar.method} •{getStyleEmoji(selectedAvatar.style)}{" "}
                  {selectedAvatar.style} •
                  {getStatusBadge(selectedAvatar.status)}
                </p>
              </div>

              {selectedAvatar.status === "ready" && (
                <Button
                  onClick={() => {
                    onAvatarUse(selectedAvatar);
                    setIsDialogOpen(false);
                  }}
                >
                  🎬 Использовать в Видео
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
