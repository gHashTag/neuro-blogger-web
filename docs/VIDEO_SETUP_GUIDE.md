# 🎬 Видео-Рендеринг в проекте 999-web

## ✅ Что интегрировано

### 🏗️ Структура проекта

- `src/remotion/` - Remotion композиции и конфигурация
- `src/video-templates/` - Шаблоны видео (LipSyncTemplate)
- `src/utils/video/` - Утилиты для рендеринга
- `src/pages/api/video/` - API эндпоинты для рендера
- `public/temp-videos/` - Выходные видеофайлы

### 🎯 Первый темплейт: LipSyncTemplate

Создан полнофункциональный темплейт с:

- 📸 **Обложка кавера** (2 секунды в начале)
- 🎤 **Lip-sync видео** (основное, начинается через 2с)
- 🎵 **Фоновая музыка** (с самого начала)
- 🎬 **Бэкграунд ролы** (меняются каждые 2 секунды, микшируются)
- ✨ **Анимации и эффекты** (fade-in, scale, градиенты)

## 🚀 Как использовать

### 1. Remotion Preview (Разработка)

```bash
# Запуск интерактивного превью
npx remotion preview src/remotion/index.tsx --port=3001
```

Откройте http://localhost:3001 для просмотра композиций в реальном времени.

### 2. Прямой рендеринг через CLI

```bash
# Рендер первого темплейта
npx remotion render src/remotion/index.tsx LipSyncTemplate output.mp4
```

### 3. Рендеринг через API

```typescript
// POST /api/video/render
{
  "composition": "LipSyncTemplate",
  "props": {
    "lipSyncVideo": "путь к lip-sync видео",
    "coverImage": "путь к обложке",
    "backgroundMusic": "путь к музыке",
    "backgroundVideos": ["путь1", "путь2", "путь3", "путь4"],
    "coverDuration": 2,
    "lipSyncDelay": 2,
    "backgroundVideoOpacity": 0.3,
    "musicVolume": 0.5
  },
  "videoId": "unique-id"
}
```

### 4. Тестовая страница

Откройте http://localhost:80/video-test для тестирования рендеринга через UI.

## 📁 Тестовые ассеты

Используемые файлы в `/public/test-assets/`:

- `lip-sync.mp4` - основное lip-sync видео
- `cover01.png` - обложка кавера
- `news.mp3` - фоновая музыка
- `bg-video01.mp4` до `bg-video04.mp4` - фоновые ролы

## 🎛️ Настройка темплейта

### Параметры LipSyncTemplate:

```typescript
interface LipSyncTemplateProps {
  lipSyncVideo: string; // Путь к основному видео
  coverImage: string; // Путь к обложке
  backgroundMusic: string; // Путь к музыке
  backgroundVideos: string[]; // Массив путей к фоновым роллам
  coverDuration: number; // Длительность показа обложки (сек)
  lipSyncDelay: number; // Задержка перед стартом lip-sync (сек)
  backgroundVideoOpacity: number; // Прозрачность фона (0-1)
  musicVolume: number; // Громкость музыки (0-1)
}
```

### Формат видео:

- **Разрешение**: 720x1280 (вертикальный для соцсетей)
- **FPS**: 30
- **Длительность**: 15 секунд (450 кадров)
- **Кодек**: H.264

## 🔧 Команды разработки

```bash
# Установка зависимостей
pnpm install

# Превью композиций
pnpm video:preview

# Прямой рендер
pnpm video:render

# Запуск dev сервера с API
pnpm dev

# Проверка типов
pnpm exec tsc --noEmit
```

## 🎨 Следующие шаги

1. **Создание новых темплейтов** - по образцу LipSyncTemplate
2. **Интеграция с AI** - автоматическая генерация контента
3. **Batch рендеринг** - массовое производство видео
4. **Cloud рендеринг** - использование Remotion Lambda/CloudRun
5. **UI для редактирования** - визуальный редактор параметров

## 🚨 Важные заметки

- Все статические файлы используют `staticFile()` из Remotion
- Рендеринг происходит локально через Node.js
- Выходные файлы сохраняются в `public/temp-videos/`
- Для продакшена рекомендуется cloud рендеринг
- **Исправлена проблема** "registerRoot() was called more than once" с помощью глобальной переменной

## 🐛 Решенные проблемы

### ❌ registerRoot() was called more than once

**Проблема**: В dev режиме Remotion выдавал ошибку повторной регистрации root компонента.

**Решение**: Добавлена защита с глобальной переменной `__REMOTION_ROOT_REGISTERED__`:

```typescript
if (!globalThis.__REMOTION_ROOT_REGISTERED__) {
  try {
    registerRoot(RemotionRoot);
    globalThis.__REMOTION_ROOT_REGISTERED__ = true;
  } catch (error) {
    console.warn("🎬 Remotion root already registered, skipping...");
  }
}
```

---

## 🎤 LIP-SYNC как ОСНОВА (Критическое обновление!)

### ✨ Ключевые изменения:

**🎯 Новая архитектура:**

- **Lip-sync - это ОСНОВА!** Все элементы подстраиваются под его длительность
- **Общая длительность** = `coverDuration + lip-sync длительность`
- **Фоновые видео** зацикливаются на всю длительность
- **Никаких задержек** - lip-sync начинается сразу после обложки

**🎛️ Редактируемый UI:**

- Добавлена **Zod schema** для всех параметров
- Поля теперь **редактируемые** в Remotion Studio
- Слайдеры для числовых значений
- Описания для каждого параметра

### 🏗️ Новая логика композиции:

```
⏱️ Timeline:
┌─ 0s ─┬─ coverDuration ─┬─ lip-sync длительность ─┐
│ Cover │     Lip-sync    │      (до конца)        │
└───────┴─────────────────┴───────────────────────┘
   📸        🎤 ОСНОВА           🎤 ОСНОВА

🎵 Музыка: ████████████████████████████████████
🎬 Фоновые: ████████████████████████████████████
   (зацикливаются каждые 3 сек)
```

**Примеры длительности:**

- Если lip-sync = 28.9с, cover = 2с → **ИТОГО: 30.9с**
- Если lip-sync = 45с, cover = 3с → **ИТОГО: 48с**

### 🎛️ Как редактировать в Studio:

1. Откройте `http://localhost:3001`
2. Все поля теперь **редактируемые**:
   - 🎤 `lipSyncVideo` - путь к основному видео
   - 📸 `coverImage` - путь к обложке
   - 🎵 `musicVolume` - громкость (0-1)
   - 🎨 `backgroundVideoOpacity` - прозрачность фона
   - ⏱️ `coverDuration` - длительность обложки

---

🕉️ **Мудрость**: _"सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज"_ - Как все дхармы находят прибежище в Кришне, так все элементы видео находят основу в lip-sync! 🎬✨
