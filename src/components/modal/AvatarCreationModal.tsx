import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  //@ts-ignore
} from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import styled from "styled-components";
import { cn } from "@/utils/cn";
import { InputMultiline } from "../ui/input-multiline";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// 🎨 Styled Components
const CustomModalContent = styled(ModalContent)`
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border-radius: 15px;
  min-width: 600px;
  max-width: 800px;
`;

const GradientCard = styled(Card)`
  background: linear-gradient(
    135deg,
    hsl(var(--primary)) 0%,
    hsl(var(--secondary)) 100%
  );
  border: 1px solid hsl(var(--border));
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

// 📝 Types
interface AvatarCreationForm {
  method: "text" | "photo" | "video";
  prompt?: string;
  style: "realistic" | "animated" | "stylized";
  name: string;
  description?: string;
}

interface AvatarCreationModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onAvatarCreated: (avatar: any) => void;
}

// 🎭 Avatar Creation Steps
const CREATION_STEPS = [
  { id: 1, title: "Выбор метода", description: "Как создать аватара?" },
  { id: 2, title: "Настройка", description: "Детали аватара" },
  { id: 3, title: "Генерация", description: "Создание AI аватара" },
  { id: 4, title: "Результат", description: "Готовый аватар" },
];

const AVATAR_METHODS = [
  {
    id: "text",
    title: "🎨 Из Описания",
    description: "AI создаст аватара по вашему описанию",
    example: "Молодой программист в клетчатой рубашке...",
    recommended: true,
  },
  {
    id: "photo",
    title: "📸 Из Фото",
    description: "Загрузите 10-15 фотографий",
    example: "Лучший результат для личного аватара",
    recommended: false,
  },
  {
    id: "video",
    title: "🎬 Из Видео",
    description: "2-минутное видео для гипер-реалистичного аватара",
    example: "Максимальное качество и lip-sync",
    recommended: false,
  },
];

const STYLE_OPTIONS = [
  {
    id: "realistic",
    title: "🎯 Реалистичный",
    description: "Фотореалистичный стиль",
  },
  {
    id: "animated",
    title: "🎨 Анимированный",
    description: "Мультяшный стиль",
  },
  {
    id: "stylized",
    title: "✨ Стилизованный",
    description: "Художественный стиль",
  },
];

export function AvatarCreationModal({
  isOpen,
  onOpen,
  onOpenChange,
  onAvatarCreated,
}: AvatarCreationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const { control, handleSubmit, watch, setValue, getValues } =
    useForm<AvatarCreationForm>({
      defaultValues: {
        method: "text",
        style: "realistic",
        name: "",
        prompt: "",
        description: "",
      },
    });

  const selectedMethod = watch("method");
  const selectedStyle = watch("style");

  // 🎯 Navigation Functions
  const nextStep = () => {
    if (currentStep < CREATION_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetModal = () => {
    setCurrentStep(1);
    setIsGenerating(false);
    setGenerationProgress(0);
  };

  // 🚀 Avatar Generation Function
  const generateAvatar = async (data: AvatarCreationForm) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    nextStep(); // Переходим к шагу генерации

    try {
      console.log("🎨 Creating avatar with API:", data);

      // 🚀 Создание аватара через API
      const createResponse = await fetch("/api/avatar/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: data.method,
          name: data.name,
          description: data.description,
          style: data.style,
          prompt: data.prompt,
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Avatar creation failed: ${createResponse.statusText}`);
      }

      const createResult = await createResponse.json();

      if (!createResult.success) {
        throw new Error(createResult.error || "Avatar creation failed");
      }

      const avatarId = createResult.avatar.id;
      console.log("✅ Avatar creation started:", avatarId);

      // 🔄 Поллинг статуса генерации
      const pollStatus = async () => {
        try {
          const statusResponse = await fetch(`/api/avatar/status/${avatarId}`);

          if (!statusResponse.ok) {
            throw new Error(
              `Status check failed: ${statusResponse.statusText}`
            );
          }

          const statusResult = await statusResponse.json();

          if (!statusResult.success) {
            throw new Error(statusResult.error || "Status check failed");
          }

          const avatar = statusResult.avatar;
          console.log("📊 Avatar status:", avatar.status);

          // Обновляем прогресс на основе статуса
          switch (avatar.status) {
            case "processing":
              setGenerationProgress((prev) => Math.min(90, prev + 5));
              // Продолжаем поллинг
              setTimeout(pollStatus, 2000);
              break;

            case "ready":
              setGenerationProgress(100);
              // Переходим к результату
              setTimeout(() => {
                nextStep();
                onAvatarCreated(avatar);
              }, 1000);
              break;

            case "failed":
              throw new Error("Avatar generation failed");

            default:
              // Продолжаем поллинг для неизвестных статусов
              setTimeout(pollStatus, 2000);
              break;
          }
        } catch (pollError) {
          console.error("❌ Status polling failed:", pollError);
          throw pollError;
        }
      };

      // Начинаем поллинг через 2 секунды
      setTimeout(pollStatus, 2000);
    } catch (error) {
      console.error("❌ Avatar generation failed:", error);
      setIsGenerating(false);

      // Показываем ошибку пользователю (можно добавить state для error)
      alert(
        `Ошибка создания аватара: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`
      );

      // Возвращаемся к предыдущему шагу
      setCurrentStep(2);
    }
  };

  // 🎨 Render Step Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Выбор метода
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Выберите способ создания аватара:
              </h3>
              <div className="grid gap-4">
                {AVATAR_METHODS.map((method) => (
                  <GradientCard
                    key={method.id}
                    className={cn(
                      "p-4 cursor-pointer border-2 transition-all",
                      selectedMethod === method.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setValue("method", method.id as any)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground">
                            {method.title}
                          </h4>
                          {method.recommended && (
                            <Badge variant="secondary">Рекомендуем</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          {method.example}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 transition-all",
                          selectedMethod === method.id
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        )}
                      />
                    </div>
                  </GradientCard>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Настройка
        return (
          <div className="space-y-6">
            {/* Имя аватара */}
            <div>
              <Label htmlFor="name">Имя аватара *</Label>
              <div className="mt-2">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Укажите имя аватара" }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="Например: Мой Бизнес Аватар"
                      className={fieldState.error ? "border-red-500" : ""}
                    />
                  )}
                />
              </div>
            </div>

            {/* Промпт для текстового метода */}
            {selectedMethod === "text" && (
              <div>
                <Label htmlFor="prompt">Описание аватара *</Label>
                <div className="mt-2">
                  <Controller
                    name="prompt"
                    control={control}
                    rules={{ required: "Опишите аватара" }}
                    render={({ field, fieldState }) => (
                      <InputMultiline
                        {...field}
                        placeholder="Молодой IT-специалист в современной рубашке, сидящий в уютном офисе с мягким освещением. Дружелюбная улыбка, уверенный взгляд..."
                        className={fieldState.error ? "border-red-500" : ""}
                        rows={4}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {/* Стиль аватара */}
            <div>
              <Label>Стиль аватара</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {STYLE_OPTIONS.map((style) => (
                  <Card
                    key={style.id}
                    className={cn(
                      "p-3 cursor-pointer border-2 transition-all text-center",
                      selectedStyle === style.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setValue("style", style.id as any)}
                  >
                    <div className="text-lg mb-1">{style.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {style.description}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Описание (опционально) */}
            <div>
              <Label htmlFor="description">Дополнительные заметки</Label>
              <div className="mt-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <InputMultiline
                      {...field}
                      placeholder="Любые дополнительные детали или пожелания..."
                      rows={2}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 3: // Генерация
        return (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                🎨 Создаем ваш аватар...
              </h3>
              <p className="text-muted-foreground mb-6">
                Это может занять 2-3 минуты. HeyGen AI работает над созданием
                идеального аватара!
              </p>
            </div>

            <div className="space-y-4">
              <Progress value={generationProgress} className="w-full h-3" />
              <div className="text-sm text-muted-foreground">
                {generationProgress < 30 && "🎯 Анализируем ваше описание..."}
                {generationProgress >= 30 &&
                  generationProgress < 60 &&
                  "🎨 Генерируем внешность..."}
                {generationProgress >= 60 &&
                  generationProgress < 90 &&
                  "🎭 Создаем движения и мимику..."}
                {generationProgress >= 90 && "✨ Финальная обработка..."}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
              Прогресс: {Math.round(generationProgress)}%
            </div>
          </div>
        );

      case 4: // Результат
        return (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">🎉 Аватар готов!</h3>
              <p className="text-muted-foreground mb-6">
                Ваш AI аватар успешно создан и готов к использованию в видео!
              </p>
            </div>

            <GradientCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎭</span>
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold">{getValues("name")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {getValues("style")} • {getValues("method")}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    Готов к использованию
                  </Badge>
                </div>
              </div>
            </GradientCard>

            <div className="text-sm text-muted-foreground">
              💡 Совет: Теперь вы можете добавить этот аватар в любой видео
              шаблон!
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <MovingBorderButton onClick={onOpen} className="w-auto px-6">
        🎭 Создать AI Аватар
      </MovingBorderButton>

      <CustomModalContent>
        {(onClose: any) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between w-full">
                <span className="text-xl font-bold">
                  🎭 Создание AI Аватара
                </span>
                <Badge variant="outline">
                  Шаг {currentStep} из {CREATION_STEPS.length}
                </Badge>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-4 w-full">
                {CREATION_STEPS.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                          currentStep >= step.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {currentStep > step.id ? "✓" : step.id}
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-xs font-medium">{step.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < CREATION_STEPS.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-px",
                          currentStep > step.id ? "bg-primary" : "bg-border"
                        )}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </ModalHeader>

            <ModalBody className="px-6 py-4">{renderStepContent()}</ModalBody>

            <ModalFooter className="flex justify-between">
              <div>
                {currentStep > 1 && currentStep < 3 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={isGenerating}
                  >
                    ← Назад
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {currentStep < 2 && (
                  <Button onClick={nextStep} disabled={!getValues("method")}>
                    Далее →
                  </Button>
                )}

                {currentStep === 2 && (
                  <Button
                    onClick={handleSubmit(generateAvatar)}
                    disabled={
                      !getValues("name") ||
                      (selectedMethod === "text" && !getValues("prompt"))
                    }
                  >
                    🚀 Создать Аватар
                  </Button>
                )}

                {currentStep === 4 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetModal();
                        onClose();
                      }}
                    >
                      Закрыть
                    </Button>
                    <Button
                      onClick={() => {
                        resetModal();
                        // Здесь будет переход к созданию видео с аватаром
                        console.log("🎬 Navigate to video creation");
                        onClose();
                      }}
                    >
                      🎬 Создать Видео
                    </Button>
                  </>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </CustomModalContent>
    </Modal>
  );
}
