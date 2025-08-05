// ⚙️ FrameConfig - Панель настроек кадра/композиции
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface FrameConfigProps {
  activeTemplate: "lipSync" | "promo" | "lottie";
  videoProps?: any;
  onPropsChange?: (props: any) => void;
  selectedAvatar?: any;
}

export default function FrameConfig({
  activeTemplate,
  videoProps,
  onPropsChange,
  selectedAvatar,
}: FrameConfigProps) {
  // State для различных настроек
  const [textContent, setTextContent] = useState("НОВАЯ МОДЕЛЬ GEMINI");
  const [backgroundColor, setBackgroundColor] = useState("#007AFF");
  const [duration, setDuration] = useState([1.0]);
  const [fontSize, setFontSize] = useState([32]);
  const [opacity, setOpacity] = useState([100]);
  const [animation, setAnimation] = useState("fadeIn");
  const [font, setFont] = useState("Outfit");

  // Настройки специфичные для шаблонов
  const getTemplateSettings = () => {
    switch (activeTemplate) {
      case "lipSync":
        return {
          title: "🎤 Настройки Lip Sync",
          sections: [
            {
              key: "lipSync",
              title: "Синхронизация губ",
              icon: "🎭",
            },
            {
              key: "background",
              title: "Фоновые видео",
              icon: "🎬",
            },
            {
              key: "cover",
              title: "Обложка",
              icon: "🖼️",
            },
          ],
        };
      case "promo":
        return {
          title: "🎯 Настройки Promo Video",
          sections: [
            {
              key: "content",
              title: "Контент",
              icon: "📝",
            },
            {
              key: "branding",
              title: "Брендинг",
              icon: "🎨",
            },
          ],
        };
      default:
        return {
          title: "✨ Настройки Lottie",
          sections: [
            {
              key: "animation",
              title: "Анимация",
              icon: "🎞️",
            },
          ],
        };
    }
  };

  const config = getTemplateSettings();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">{config.title}</h3>
        <Button size="sm" variant="outline" className="h-7 text-xs">
          Reset
        </Button>
      </div>

      {/* Settings Accordion */}
      <Accordion
        type="multiple"
        defaultValue={config.sections.map((s) => s.key)}
        className="w-full"
      >
        {/* General Settings */}
        <AccordionItem value="general">
          <AccordionTrigger className="text-sm py-2">
            <span className="flex items-center gap-2">
              ⚙️ <span>Общие настройки</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            {/* Text Content */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-xs font-medium">
                📝 Текст
              </Label>
              <Textarea
                id="text"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="text-sm min-h-[60px]"
                placeholder="Введите текст..."
              />
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label htmlFor="bgcolor" className="text-xs font-medium">
                🎨 Цвет фона
              </Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-8 rounded border"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 text-sm h-8"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                ⏱️ Длительность: {duration[0].toFixed(1)} сек
              </Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={0.5}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Template-specific sections */}
        {config.sections.map((section) => (
          <AccordionItem key={section.key} value={section.key}>
            <AccordionTrigger className="text-sm py-2">
              <span className="flex items-center gap-2">
                {section.icon} <span>{section.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {section.key === "lipSync" && (
                <>
                  {/* Lip Sync Video */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">🎥 Видео файл</Label>
                    <Select defaultValue="lip-sync.mp4">
                      <SelectTrigger className="text-sm h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lip-sync.mp4">
                          lip-sync.mp4
                        </SelectItem>
                        <SelectItem value="upload">
                          📁 Загрузить новое...
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Audio Sync */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      🎵 Аудио синхронизация
                    </Label>
                    <Select defaultValue="auto">
                      <SelectTrigger className="text-sm h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Автоматическая</SelectItem>
                        <SelectItem value="manual">Ручная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {section.key === "background" && (
                <>
                  {/* Background Videos */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      🎬 Фоновые видео
                    </Label>
                    <div className="space-y-1">
                      {[
                        "bg-video01.mp4",
                        "bg-video02.mp4",
                        "bg-video03.mp4",
                      ].map((video, i) => (
                        <div
                          key={video}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                        >
                          <input
                            type="checkbox"
                            defaultChecked={i < 2}
                            className="w-3 h-3"
                          />
                          <span className="flex-1">{video}</span>
                          <span className="text-gray-500">{3 + i}s</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {section.key === "cover" && (
                <>
                  {/* Cover Image */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      🖼️ Изображение обложки
                    </Label>
                    <Select defaultValue="cover01.png">
                      <SelectTrigger className="text-sm h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cover01.png">cover01.png</SelectItem>
                        <SelectItem value="upload">
                          📁 Загрузить новое...
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cover Duration */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      ⏱️ Длительность обложки: 0.5 сек
                    </Label>
                    <Slider
                      defaultValue={[0.5]}
                      min={0.5}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {section.key === "content" && (
                <>
                  {/* Font Size */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      📏 Размер шрифта: {fontSize[0]}px
                    </Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={12}
                      max={72}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Font Family */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">🔤 Шрифт</Label>
                    <Select value={font} onValueChange={setFont}>
                      <SelectTrigger className="text-sm h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Outfit">Outfit</SelectItem>
                        <SelectItem value="Bungee">Bungee</SelectItem>
                        <SelectItem value="Anton">Anton</SelectItem>
                        <SelectItem value="Rowdies">Rowdies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {section.key === "branding" && (
                <>
                  {/* Opacity */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      👻 Прозрачность: {opacity[0]}%
                    </Label>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Animation */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">🎭 Анимация</Label>
                    <Select value={animation} onValueChange={setAnimation}>
                      <SelectTrigger className="text-sm h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fadeIn">Появление</SelectItem>
                        <SelectItem value="slideUp">Снизу вверх</SelectItem>
                        <SelectItem value="zoomIn">Увеличение</SelectItem>
                        <SelectItem value="slideRight">
                          Слева направо
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button size="sm" variant="outline" className="flex-1">
          🔄 Сбросить
        </Button>
        <Button size="sm" className="flex-1">
          ✅ Применить
        </Button>
      </div>
    </div>
  );
}
