import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, ArrowRight, Play, Download } from "lucide-react";
import BackgroundBeams from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "@/utils/cn";

// 🎭 Types
interface Avatar {
  id: string;
  name: string;
  preview_image_url: string;
  preview_video_url?: string;
  style: "realistic" | "animated" | "stylized" | "business";
  gender?: "male" | "female" | "neutral" | "unknown";
  premium?: boolean;
  avatar_name?: string;
}

interface VideoGenerationData {
  avatar: Avatar | null;
  script: string;
  title: string;
  voice: string;
  language: string;
}

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: "male" | "female" | "neutral";
  preview_audio?: string;
  description?: string;
}

// 🎨 Avatar Hover Card Component
const AvatarCard = ({
  avatar,
  isSelected,
  onSelect,
}: {
  avatar: Avatar;
  isSelected: boolean;
  onSelect: (avatar: Avatar) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(avatar)}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden transition-all duration-500",
          "bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent",
          "border border-white/[0.1] backdrop-blur-sm",
          "shadow-2xl shadow-black/20",
          isSelected
            ? "ring-2 ring-primary/70 border-primary/50 shadow-primary/20 shadow-xl"
            : "hover:border-white/[0.25] hover:shadow-white/[0.05]",
          isHovered && "shadow-3xl transform-gpu"
        )}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.1] via-blue-500/[0.05] to-cyan-500/[0.1] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Selected indicator glow */}
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent animate-pulse" />
        )}

        {/* Spotlight Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-radial from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Avatar Image */}
        <div className="aspect-[3/4] relative overflow-hidden rounded-t-2xl">
          {!imageLoaded && !imageError && (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary/70" />
            </div>
          )}
          <Image
            src={avatar.preview_image_url}
            alt={avatar.name}
            fill={true}
            className={cn(
              "object-cover transition-all duration-500",
              "group-hover:scale-110 group-hover:brightness-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              console.log("🖼️ Image failed to load:", avatar.preview_image_url);
              setImageError(true);
              setImageLoaded(true);
            }}
            unoptimized={true}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Hover overlay with play button */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center"
              >
                <motion.div
                  className="flex items-center gap-3 text-white bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Play className="w-5 h-5 text-primary" />
                  <span className="font-medium">Предпросмотр</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selection indicator */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-3 right-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                  <motion.div
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar Info */}
        <div className="p-5 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-sm">
          <h3 className="font-semibold text-white mb-2 line-clamp-2 leading-tight">
            {avatar.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {avatar.style && (
              <Badge
                variant="secondary"
                className="text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-200"
              >
                {avatar.style}
              </Badge>
            )}
            {avatar.gender && (
              <Badge
                variant="outline"
                className="text-xs border-cyan-500/30 text-cyan-200 bg-cyan-500/10"
              >
                {avatar.gender}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 🎬 Main Component
export default function CreateAvatarVideo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoicesLoading, setIsVoicesLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [videoResult, setVideoResult] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [apiStatus, setApiStatus] = useState<
    "checking" | "available" | "unavailable"
  >("checking");
  const [activeAvatarTab, setActiveAvatarTab] = useState<
    "all" | "male" | "female" | "professional" | "custom"
  >("custom");

  const [formData, setFormData] = useState<VideoGenerationData>({
    avatar: null,
    script: "",
    title: "",
    voice: "81bb7c1a521442f6b812b2294a29acc1", // Dmitry - Professional (Russian)
    language: "ru-RU",
  });

  // 📝 Debug state changes
  useEffect(() => {
    console.log("🔄 Component state changed:", {
      avatarsCount: avatars.length,
      isLoading,
      currentStep,
      selectedAvatar: formData.avatar?.name,
    });
  }, [avatars, isLoading, currentStep, formData.avatar]);

  // 🎨 Debug render state for avatars
  useEffect(() => {
    if (currentStep === 1) {
      console.log("🎨 RENDER STEP 1: Avatars in render:", {
        count: avatars.length,
        isLoading,
        avatarNames: avatars.map((a) => a.name).slice(0, 5),
      });
    }
  }, [avatars, isLoading, currentStep]);

  // 📡 Load avatars and voices on mount
  useEffect(() => {
    console.log("🚀 Component mounted, checking API and loading data...");
    checkApiStatus();
    loadAvatars();
    loadVoices();
  }, []);

  // 🔍 Check HeyGen API Status
  const checkApiStatus = async () => {
    try {
      console.log("🔍 Checking HeyGen API status...");
      setApiStatus("checking");

      const response = await fetch("/api/test/heygen");
      const result = await response.json();

      console.log("📊 API Status Result:", result);

      // ✅ API считается доступным если аватары загружаются (основная функция)
      if (result.tests?.avatars_api === true) {
        setApiStatus("available");
        console.log("✅ HeyGen API is available (avatars working)");
      } else {
        setApiStatus("unavailable");
        console.error(
          "❌ HeyGen API unavailable - avatars not working:",
          result.error
        );
      }
    } catch (error) {
      console.error("❌ API status check failed:", error);
      setApiStatus("unavailable");
    }
  };

  // 🎭 Filter Avatars by Category
  const getFilteredAvatars = (avatars: Avatar[]) => {
    switch (activeAvatarTab) {
      case "male":
        const uniqueMale = new Map();
        avatars
          .filter((avatar) => avatar.gender === "male")
          .forEach((avatar) => {
            uniqueMale.set(avatar.id, avatar);
          });
        return Array.from(uniqueMale.values());
      case "female":
        const uniqueFemale = new Map();
        avatars
          .filter((avatar) => avatar.gender === "female")
          .forEach((avatar) => {
            uniqueFemale.set(avatar.id, avatar);
          });
        return Array.from(uniqueFemale.values());
      case "professional":
        return avatars.filter((avatar) => {
          const name = avatar.avatar_name?.toLowerCase() || "";
          return (
            name.includes("business") ||
            name.includes("professional") ||
            name.includes("office") ||
            name.includes("suit") ||
            name.includes("corporate") ||
            name.includes("formal") ||
            // Исключаем явно пользовательские аватары
            (!name.includes("исходник") &&
              !name.includes("финал") &&
              name !== "get")
          );
        });
      case "custom":
        // 🎯 СТРОГАЯ ФИЛЬТРАЦИЯ - только явные пользовательские
        const uniqueCustomAvatars = new Map();
        avatars.forEach((avatar) => {
          const name = avatar.avatar_name?.toLowerCase() || "";
          const isCustom =
            name.includes("исходник") ||
            name.includes("финал") ||
            name === "get" ||
            name.includes(".mp4") ||
            name.includes("upload") ||
            name.includes("пользователь");

          if (isCustom) {
            // 🔄 Дедупликация по ID (разные аватары могут иметь одинаковые имена)
            const key = avatar.id;
            if (!uniqueCustomAvatars.has(key)) {
              uniqueCustomAvatars.set(key, avatar);
            }
          }
        });
        return Array.from(uniqueCustomAvatars.values());
      default:
        // 🔄 Дедупликация всех аватаров по ID
        const uniqueAll = new Map();
        avatars.forEach((avatar) => {
          const key = avatar.id;
          if (!uniqueAll.has(key)) {
            uniqueAll.set(key, avatar);
          }
        });
        return Array.from(uniqueAll.values());
    }
  };

  // 🎯 Get Avatar Categories Stats
  const getAvatarStats = (avatars: Avatar[]) => {
    // 🎯 Подсчет уникальных мужских аватаров
    const uniqueMaleStats = new Map();
    avatars
      .filter((a) => a.gender === "male")
      .forEach((a) => {
        uniqueMaleStats.set(a.id, a);
      });
    const male = uniqueMaleStats.size;

    // 🎯 Подсчет уникальных женских аватаров
    const uniqueFemaleStats = new Map();
    avatars
      .filter((a) => a.gender === "female")
      .forEach((a) => {
        uniqueFemaleStats.set(a.id, a);
      });
    const female = uniqueFemaleStats.size;
    const professional = avatars.filter((a) => {
      const name = a.avatar_name?.toLowerCase() || "";
      return (
        name.includes("business") ||
        name.includes("professional") ||
        name.includes("office") ||
        name.includes("suit") ||
        name.includes("corporate") ||
        name.includes("formal") ||
        (!name.includes("исходник") &&
          !name.includes("финал") &&
          name !== "get")
      );
    }).length;
    // 🎯 Подсчет уникальных пользовательских аватаров
    const uniqueCustom = new Map();
    avatars.forEach((a) => {
      const name = a.avatar_name?.toLowerCase() || "";
      if (
        name.includes("исходник") ||
        name.includes("финал") ||
        name === "get" ||
        name.includes(".mp4") ||
        name.includes("upload") ||
        name.includes("пользователь") ||
        name.includes("custom")
      ) {
        const key = a.id;
        if (!uniqueCustom.has(key)) {
          uniqueCustom.set(key, a);
        }
      }
    });
    const custom = uniqueCustom.size;

    // 🔄 Общий счетчик с дедупликацией по ID
    const uniqueTotal = new Map();
    avatars.forEach((a) => {
      const key = a.id;
      if (!uniqueTotal.has(key)) {
        uniqueTotal.set(key, a);
      }
    });

    return { male, female, professional, custom, total: uniqueTotal.size };
  };

  const loadAvatars = async () => {
    console.log("🎯 === FRONTEND: Starting to load avatars ===");
    setIsLoading(true);
    try {
      console.log("📡 Making API request to /api/avatar/list");
      const response = await fetch("/api/avatar/list");
      console.log("📨 Response status:", response.status, response.statusText);

      const result = await response.json();
      console.log("📦 Raw API response:", result);
      console.log("📋 Response structure:", {
        success: result.success,
        avatars: result.avatars ? "Array present" : "No avatars array",
        avatarsLength: result.avatars?.length,
        total: result.total,
        keys: Object.keys(result),
      });

      if (result.success && result.avatars && Array.isArray(result.avatars)) {
        console.log(`📊 Received ${result.avatars.length} avatars from API`);
        console.log("🔍 First 3 raw avatars:", result.avatars.slice(0, 3));

        // Convert HeyGen V2 avatars to our simplified format - ONLY V2!
        console.log(
          "🔍 Raw avatar sample from API:",
          result.avatars.slice(0, 2)
        );

        // ✅ API уже делает маппинг, просто используем как есть
        const formattedAvatars: Avatar[] = result.avatars;

        console.log(`✅ Formatted ${formattedAvatars.length} avatars for UI`);
        console.log(
          "🎨 First 3 formatted avatars:",
          formattedAvatars.slice(0, 3)
        );
        console.log("🔄 Setting avatars in state...");
        setAvatars(formattedAvatars);
      } else {
        console.log("⚠️ No avatars received from API - Response details:", {
          success: result.success,
          hasAvatars: !!result.avatars,
          isArray: Array.isArray(result.avatars),
          fullResult: result,
        });
        setAvatars([]);
      }
    } catch (error) {
      console.error("❌ Error loading avatars:", error);
      setAvatars([]);
    } finally {
      console.log("🏁 Setting loading to false");
      setIsLoading(false);
    }
  };

  // 🎤 Load voices from HeyGen API
  const loadVoices = async () => {
    console.log("🎤 === FRONTEND: Starting to load voices ===");
    setIsVoicesLoading(true);
    try {
      console.log("📡 Making API request to /api/voices/list");
      const response = await fetch("/api/voices/list");
      console.log(
        "📨 Voices response status:",
        response.status,
        response.statusText
      );

      const result = await response.json();
      console.log("📦 Raw voices API response:", result);

      if (result.success && result.voices && Array.isArray(result.voices)) {
        console.log(`🎤 Received ${result.voices.length} voices from API`);
        console.log("🔍 First 3 voices:", result.voices.slice(0, 3));

        setVoices(result.voices);
        console.log("✅ Voices loaded successfully:", result.voices.length);

        // Set default voice if not already set
        if (!formData.voice && result.voices.length > 0) {
          const defaultVoice =
            result.voices.find((v: Voice) => v.gender === "male") ||
            result.voices[0];
          setFormData((prev) => ({
            ...prev,
            voice: defaultVoice.id,
          }));
          console.log("🎤 Set default voice:", defaultVoice.name);
        }
      } else {
        console.error("❌ Invalid voices response:", result);
        setVoices([]);
      }
    } catch (error) {
      console.error("❌ Error loading voices:", error);
      setVoices([]);
    } finally {
      console.log("🏁 Setting voices loading to false");
      setIsVoicesLoading(false);
    }
  };

  // 🎯 Generate Video with HeyGen API
  const generateVideo = async () => {
    if (!formData.avatar || !formData.script) return;

    console.log(
      "🚀 Starting HeyGen video generation with correct headers and payload..."
    );

    // Check API status before starting
    if (apiStatus === "unavailable") {
      alert("HeyGen API недоступен. Генерация видео невозможна.");
      return;
    }

    if (apiStatus === "checking") {
      alert("Проверяем статус API... Попробуйте через несколько секунд.");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep(4);

    try {
      console.log("🚀 Starting HeyGen video generation...");

      // Start video generation
      const generateResponse = await fetch("/api/video/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar_id: formData.avatar?.id || "",
          script: formData.script,
          title: formData.title || `AI Video ${Date.now()}`,
          voice: formData.voice,
          language: formData.language,
        }),
      });

      const generateResult = await generateResponse.json();
      console.log("📄 Generation response:", generateResult);

      if (!generateResult.success) {
        throw new Error(
          generateResult.error || "Failed to start video generation"
        );
      }

      const videoId = generateResult.video_id;
      console.log("✅ Video generation started, ID:", videoId);

      // 🔄 Poll for real completion status
      console.log("🔄 Starting real status polling...");
      setGenerationProgress(25);

      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/video/status/${videoId}`);
          const statusResult = await statusResponse.json();

          console.log("📊 Video status update:", statusResult);

          if (statusResult.success) {
            if (statusResult.status === "completed") {
              clearInterval(pollInterval);
              setGenerationProgress(100);

              // Set final result with real video URL
              setVideoResult({
                video_url:
                  statusResult.video_url ||
                  `https://app.heygen.com/share/${videoId}`,
                thumbnail:
                  statusResult.thumbnail_url ||
                  formData.avatar?.preview_image_url ||
                  "/avatars/placeholder.svg",
                duration: statusResult.duration || "00:45",
                created_at: new Date().toISOString(),
                title: formData.title,
                script: formData.script,
                avatar_name: formData.avatar?.name || "Unknown Avatar",
                heygen_video_id: videoId,
              });

              setIsGenerating(false);
              console.log("🎉 Video generation completed!");
            } else if (
              statusResult.status === "failed" ||
              statusResult.status === "error"
            ) {
              clearInterval(pollInterval);
              console.error("❌ Video generation failed:", statusResult.error);
              alert(
                `Ошибка генерации видео: ${
                  statusResult.error?.detail ||
                  statusResult.error?.message ||
                  "Неизвестная ошибка"
                }`
              );
              setIsGenerating(false);
            } else if (statusResult.status === "processing") {
              // Update progress for processing status
              const progress = Math.min(95, 25 + Math.random() * 50);
              setGenerationProgress(progress);
              console.log(`⏳ Video processing... ${Math.round(progress)}%`);
            }
          } else {
            console.warn("⚠️ Status check failed, retrying...");
          }
        } catch (error) {
          console.error("❌ Status check error:", error);
        }
      }, 3000); // Poll every 3 seconds

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isGenerating) {
          console.error("⏰ Video generation timeout");
          alert(
            "Генерация видео превысила лимит времени (5 минут). Проверьте статус позже."
          );
          setIsGenerating(false);
        }
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error("❌ Video generation failed:", error);
      setIsGenerating(false);

      // Show real error to user
      const errorMessage =
        (error as any) instanceof Error
          ? (error as Error).message
          : String(error);
      alert(`Ошибка генерации видео: ${errorMessage}`);
    }
  };

  // 🎥 Video Controls
  const playVideo = () => {
    if (videoResult?.video_url) {
      setShowVideoModal(true);
      setIsVideoPlaying(true);
    }
  };

  const downloadVideo = () => {
    if (videoResult?.video_url) {
      // Создаем временную ссылку для скачивания
      const link = document.createElement("a");
      link.href = videoResult.video_url;
      link.download = `${formData.title || "AI_Video"}_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setIsVideoPlaying(false);
  };

  // 🎨 Step Navigation
  const nextStep = () => setCurrentStep((prev) => Math.min(4, prev + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  // 📝 Step Content Renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <TextGenerateEffect
                words="Выберите AI Аватар"
                className="text-3xl font-bold text-white mb-4"
              />
              <p className="text-gray-300 max-w-2xl mx-auto">
                Выберите идеального аватара для вашего видео из нашей библиотеки
                профессиональных персонажей
              </p>
            </div>

            {isLoading ? (
              <motion.div
                className="flex flex-col items-center justify-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="relative">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-gray-300 text-lg font-medium">
                    Загружаем аватары...
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Подготавливаем коллекцию AI персонажей
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {avatars.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full opacity-60" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Аватары не загружены
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Возникла проблема при загрузке библиотеки аватаров.
                      Попробуйте еще раз.
                    </p>
                    <motion.button
                      onClick={loadAvatars}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-medium hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/25"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🔄 Повторить загрузку
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    {/* Avatar Tabs and Stats */}
                    <div className="space-y-6">
                      {/* Category Tabs */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          {
                            id: "custom",
                            label: "🎨 Пользовательские",
                            count: getAvatarStats(avatars).custom,
                          },
                          {
                            id: "all",
                            label: "Все",
                            count: getAvatarStats(avatars).total,
                          },
                          {
                            id: "male",
                            label: "👨 Мужчины",
                            count: getAvatarStats(avatars).male,
                          },
                          {
                            id: "female",
                            label: "👩 Женщины",
                            count: getAvatarStats(avatars).female,
                          },
                          {
                            id: "professional",
                            label: "💼 Профессиональные",
                            count: getAvatarStats(avatars).professional,
                          },
                        ].map((tab) => (
                          <motion.button
                            key={tab.id}
                            onClick={() => setActiveAvatarTab(tab.id as any)}
                            className={cn(
                              "px-4 py-2 rounded-xl font-medium transition-all duration-300",
                              "flex items-center gap-2",
                              activeAvatarTab === tab.id
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-xs",
                                  activeAvatarTab === tab.id
                                    ? "bg-primary/30 text-primary-foreground"
                                    : "bg-white/10 text-gray-400"
                                )}
                              >
                                {tab.count}
                              </Badge>
                            )}
                          </motion.button>
                        ))}
                      </div>

                      {/* Avatar count */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-medium text-white">
                            {activeAvatarTab === "all"
                              ? `Найдено ${avatars.length} аватаров`
                              : `Показано ${
                                  getFilteredAvatars(avatars).length
                                } из ${avatars.length} аватаров`}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-primary/10 border-primary/30 text-primary"
                          >
                            HeyGen API
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Avatar grid */}
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {getFilteredAvatars(avatars)
                        .slice(0, 30)
                        .map((avatar, index) => (
                          <motion.div
                            key={avatar.id}
                            variants={{
                              hidden: { opacity: 0, y: 20, scale: 0.9 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: {
                                  type: "spring",
                                  stiffness: 260,
                                  damping: 20,
                                },
                              },
                            }}
                          >
                            <AvatarCard
                              avatar={avatar}
                              isSelected={formData.avatar?.id === avatar.id}
                              onSelect={(avatar) =>
                                setFormData((prev) => ({ ...prev, avatar }))
                              }
                            />
                          </motion.div>
                        ))}
                    </motion.div>

                    {/* Load more button if there are more avatars */}
                    {getFilteredAvatars(avatars).length > 30 && (
                      <div className="text-center pt-8">
                        <motion.button
                          className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Показать еще аватаров (
                          {getFilteredAvatars(avatars).length - 30})
                        </motion.button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
              <TextGenerateEffect
                words="Создайте Сценарий"
                className="text-3xl font-bold text-white mb-4"
              />
              <p className="text-gray-300">
                Напишите текст, который будет произносить ваш аватар
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Selected Avatar Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  Выбранный аватар
                </h3>
                {formData.avatar && (
                  <div className="bg-white/[0.02] border border-white/[0.1] rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden relative">
                        <Image
                          src={formData.avatar.preview_image_url}
                          alt={formData.avatar.name}
                          fill={true}
                          className="object-cover"
                          unoptimized={true}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {formData.avatar.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {formData.avatar.style}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Script Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Название видео
                  </label>
                  <Input
                    placeholder="Введите название вашего видео"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="bg-white/[0.02] border-white/[0.1] text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Сценарий видео
                  </label>
                  <Textarea
                    placeholder="Привет! Меня зовут [Имя аватара]. Сегодня я расскажу вам о..."
                    value={formData.script}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        script: e.target.value,
                      }))
                    }
                    className="bg-white/[0.02] border-white/[0.1] text-white placeholder:text-gray-400 min-h-[200px] resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    {formData.script.length} символов (~
                    {Math.ceil(formData.script.length / 200)} сек.)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Голос {isVoicesLoading && "⏳"}
                    </label>
                    {isVoicesLoading ? (
                      <div className="w-full bg-white/[0.02] border border-white/[0.1] rounded-md px-3 py-2 text-gray-400">
                        Загрузка голосов...
                      </div>
                    ) : voices.length > 0 ? (
                      <select
                        value={formData.voice}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            voice: e.target.value,
                          }))
                        }
                        className="w-full bg-white/[0.02] border border-white/[0.1] rounded-md px-3 py-2 text-white"
                      >
                        {voices.map((voice) => (
                          <option key={voice.id} value={voice.id}>
                            {voice.name} (
                            {voice.gender === "male"
                              ? "👨"
                              : voice.gender === "female"
                              ? "👩"
                              : "🎭"}{" "}
                            {voice.language})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full bg-red-900/20 border border-red-500/30 rounded-md px-3 py-2 text-red-300 text-sm">
                        ⚠️ Голоса не загружены
                      </div>
                    )}

                    {/* Voice preview button */}
                    {voices.length > 0 && formData.voice && (
                      <div className="mt-2">
                        {(() => {
                          const selectedVoice = voices.find(
                            (v: Voice) => v.id === formData.voice
                          );
                          return selectedVoice?.preview_audio ? (
                            <button
                              type="button"
                              onClick={() => {
                                const audio = new Audio(
                                  selectedVoice.preview_audio
                                );
                                audio
                                  .play()
                                  .catch((e) =>
                                    console.log("Audio play failed:", e)
                                  );
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              🔊 Прослушать образец
                            </button>
                          ) : (
                            <span className="text-xs text-gray-500">
                              ✅ {selectedVoice?.name || "Выбран"}
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Язык
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                      className="w-full bg-white/[0.02] border border-white/[0.1] rounded-md px-3 py-2 text-white"
                    >
                      <option value="ru-RU">Русский</option>
                      <option value="en-US">English</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 max-w-2xl mx-auto text-center">
            <div>
              <TextGenerateEffect
                words="Подтвердите Детали"
                className="text-3xl font-bold text-white mb-4"
              />
              <p className="text-gray-300">
                Проверьте все настройки перед генерацией видео
              </p>
            </div>

            <Card className="bg-white/[0.02] border-white/[0.1] p-6">
              <div className="space-y-6">
                {/* Avatar Preview */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-lg overflow-hidden relative">
                    <Image
                      src={
                        formData.avatar?.preview_image_url ||
                        "/avatars/placeholder.svg"
                      }
                      alt={formData.avatar?.name || "Аватар"}
                      fill={true}
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-white">
                      {formData.avatar?.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formData.avatar?.style}
                    </p>
                  </div>
                </div>

                {/* Video Details */}
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <label className="text-xs text-gray-400">Название</label>
                    <p className="text-white">
                      {formData.title || "Без названия"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      Длительность
                    </label>
                    <p className="text-white">
                      ~{Math.ceil(formData.script.length / 200)} сек.
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Голос</label>
                    <p className="text-white">{formData.voice}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Язык</label>
                    <p className="text-white">{formData.language}</p>
                  </div>
                </div>

                {/* Script Preview */}
                <div className="text-left">
                  <label className="text-xs text-gray-400">Сценарий</label>
                  <div className="bg-black/20 rounded-lg p-3 mt-1 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-300">{formData.script}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 max-w-2xl mx-auto text-center">
            {isGenerating ? (
              <>
                <div>
                  <TextGenerateEffect
                    words="Генерируем Ваше Видео"
                    className="text-3xl font-bold text-white mb-4"
                  />
                  <p className="text-gray-300">
                    AI создает видео с вашим аватаром. Это может занять
                    несколько минут...
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    {Math.round(generationProgress)}% завершено
                  </p>

                  {/* Progress status */}
                  <div className="text-center">
                    {generationProgress < 30 && "🎭 Подготавливаем аватар..."}
                    {generationProgress >= 30 &&
                      generationProgress < 60 &&
                      "🎙️ Генерируем речь..."}
                    {generationProgress >= 60 &&
                      generationProgress < 90 &&
                      "🎬 Создаем видео..."}
                    {generationProgress >= 90 && "✨ Финальная обработка..."}
                  </div>
                </div>
              </>
            ) : videoResult ? (
              <>
                <div>
                  <TextGenerateEffect
                    words="Видео Готово!"
                    className="text-3xl font-bold text-white mb-4"
                  />
                  <p className="text-gray-300">
                    Ваше видео с AI аватаром успешно создано
                  </p>
                </div>

                <Card className="bg-white/[0.02] border-white/[0.1] p-6">
                  <div className="space-y-4">
                    {/* Video preview */}
                    <div
                      className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer"
                      onClick={playVideo}
                    >
                      {videoResult?.video_url ? (
                        <>
                          <video
                            className="w-full h-full object-cover"
                            poster={videoResult.thumbnail}
                            muted
                            playsInline
                          >
                            <source
                              src={videoResult.video_url}
                              type="video/mp4"
                            />
                          </video>

                          {/* Play overlay */}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all duration-300">
                            <motion.div
                              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Play className="w-8 h-8 text-white ml-1" />
                            </motion.div>
                          </div>

                          {/* Video info overlay */}
                          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                            <p className="text-white text-sm font-medium">
                              {videoResult.duration}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Play className="w-12 h-12 text-white mx-auto mb-2 opacity-60" />
                            <p className="text-gray-400">
                              Генерируем превью...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video info */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-400">Длительность</p>
                        <p className="text-white font-medium">
                          {videoResult.duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Аватар</p>
                        <p className="text-white font-medium">
                          {formData.avatar?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Размер</p>
                        <p className="text-white font-medium">1080p</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-white/10"
                        onClick={playVideo}
                        disabled={!videoResult?.video_url}
                      >
                        <Play className="w-4 h-4" />
                        Воспроизвести
                      </Button>
                      <Button
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        onClick={downloadVideo}
                        disabled={!videoResult?.video_url}
                      >
                        <Download className="w-4 h-4" />
                        Скачать
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  // 🔄 Can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.avatar !== null;
      case 2:
        return (
          formData.script.trim().length > 0 && formData.title.trim().length > 0
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Head>
        <title>Создать AI Видео с Аватаром | 999 Studio</title>
        <meta
          name="description"
          content="Создавайте профессиональные видео с AI аватарами за минуты"
        />
      </Head>

      {/* Background Effects */}
      <BackgroundBeams />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  AI Видео Студия
                </h1>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      apiStatus === "available"
                        ? "bg-green-500"
                        : apiStatus === "checking"
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      apiStatus === "available"
                        ? "text-green-400"
                        : apiStatus === "checking"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {apiStatus === "available"
                      ? "API Готов"
                      : apiStatus === "checking"
                      ? "Проверка..."
                      : "API Недоступен"}
                  </span>
                </div>
              </div>
              <p className="text-gray-400">Создавайте видео с AI аватарами</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    currentStep >= step
                      ? "bg-primary text-white"
                      : "bg-gray-700 text-gray-400"
                  )}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between max-w-4xl mx-auto mt-12">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад
              </Button>

              <div className="text-center text-gray-400 text-sm">
                Шаг {currentStep} из 3
              </div>

              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-2"
                >
                  Далее
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={generateVideo}
                  disabled={!canProceed() || isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "🚀"
                  )}
                  Создать Видео
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && videoResult?.video_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeVideoModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
              >
                ✕
              </button>

              {/* Video player */}
              <video
                className="w-full h-full"
                controls
                autoPlay={isVideoPlaying}
                poster={videoResult.thumbnail}
                onEnded={() => setIsVideoPlaying(false)}
              >
                <source src={videoResult.video_url} type="video/mp4" />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>

              {/* Video info overlay */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                <h3 className="text-white font-medium">
                  {formData.title || "AI Видео"}
                </h3>
                <p className="text-gray-300 text-sm">
                  {formData.avatar?.name} • {videoResult.duration}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
