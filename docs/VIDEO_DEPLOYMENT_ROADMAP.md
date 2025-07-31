# 🚀 ROADMAP: Деплой системы видео рендеринга для клиентов

_"सर्वं खल्विदं ब्रह्म"_ - _"Всё это единое целое"_

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ

### ✅ ЧТО УЖЕ ГОТОВО:

- 🎬 **Remotion LipSyncTemplate** - полностью функциональный шаблон
- ⚡ **Local Video Rendering** - работает через `/api/video/render`
- 🗄️ **Supabase + GraphQL** - база данных и API
- 🔐 **User Authentication** - Telegram авторизация
- 🏢 **Workspace System** - пользователи, комнаты, задачи
- 📁 **Asset Files** - тестовые файлы в `public/test-assets/`

### 🎯 АРХИТЕКТУРА СИСТЕМЫ:

```
Users (Telegram Auth)
  ↓
Workspaces
  ↓
Rooms → Tasks → Video Templates → Rendered Videos
```

---

## 🚀 ROADMAP РАЗВЕРТЫВАНИЯ

## **PHASE 1: 📊 DATABASE SCHEMA (1-2 дня)**

### Новые таблицы в Supabase:

#### 1️⃣ `video_templates`

```sql
CREATE TABLE video_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name TEXT NOT NULL, -- "LipSyncTemplate", "NewsTemplate", etc.
  template_version TEXT DEFAULT '1.0',
  user_id UUID REFERENCES users(user_id),
  workspace_id UUID,
  is_public BOOLEAN DEFAULT false,
  config JSONB, -- Настройки шаблона (цвета, тексты, эффекты)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2️⃣ `user_videos`

```sql
CREATE TABLE user_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id),
  workspace_id UUID,
  room_id TEXT,
  task_id BIGINT,
  template_id UUID REFERENCES video_templates(id),

  video_title TEXT,
  video_description TEXT,
  render_status TEXT DEFAULT 'pending', -- pending, rendering, completed, failed
  render_progress INTEGER DEFAULT 0, -- 0-100%

  input_props JSONB, -- Параметры для рендеринга
  output_url TEXT, -- Ссылка на готовое видео
  output_path TEXT, -- Локальный путь

  render_started_at TIMESTAMP,
  render_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3️⃣ `video_assets`

```sql
CREATE TABLE video_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id),
  asset_type TEXT NOT NULL, -- 'avatar', 'background', 'music', 'cover'
  asset_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Путь в Supabase Storage
  file_size INTEGER,
  mime_type TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4️⃣ `render_jobs`

```sql
CREATE TABLE render_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES user_videos(id),
  job_status TEXT DEFAULT 'queued', -- queued, processing, completed, failed
  worker_id TEXT, -- ID воркера
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## **PHASE 2: 🔧 BACKEND APIs (2-3 дня)**

### 1️⃣ **API для пользовательского рендеринга**

#### `src/pages/api/video/user-render.ts`

```typescript
// POST /api/video/user-render
// Аутентифицированный эндпоинт для рендеринга пользовательских видео
{
  template_name: "LipSyncTemplate",
  user_assets: {
    lipSyncVideo: "user-uploaded-avatar.mp4",
    coverImage: "user-cover.png",
    backgroundMusic: "user-music.mp3",
    backgroundVideos: ["bg1.mp4", "bg2.mp4"]
  },
  config: {
    mainText: "ПЕРСОНАЛЬНЫЙ ТЕКСТ",
    musicVolume: 0.7,
    vignetteStrength: 0.5
  },
  workspace_id: "uuid",
  room_id?: "optional"
}
```

#### `src/pages/api/video/render-status.ts`

```typescript
// GET /api/video/render-status?video_id=uuid
// Проверка статуса рендеринга
{
  video_id: "uuid",
  status: "rendering",
  progress: 45,
  estimated_completion: "2024-02-15T10:30:00Z"
}
```

### 2️⃣ **Asset Management APIs**

#### `src/pages/api/assets/upload.ts`

```typescript
// POST /api/assets/upload
// Multipart upload с валидацией типов файлов
// Максимальные размеры: видео 100MB, аудио 20MB, изображения 10MB
```

#### `src/pages/api/assets/user-assets.ts`

```typescript
// GET /api/assets/user-assets?type=avatar
// Список загруженных пользователем ассетов
```

### 3️⃣ **Template Management APIs**

#### `src/pages/api/templates/save-config.ts`

```typescript
// POST /api/templates/save-config
// Сохранение пользовательской конфигурации шаблона
{
  template_name: "LipSyncTemplate",
  config: { /* пользовательские настройки */ },
  is_default: false
}
```

---

## **PHASE 3: 📁 ASSET MANAGEMENT (2-3 дня)**

### 1️⃣ **Supabase Storage Setup**

```
Buckets:
- user-avatars/ (публичный доступ)
- user-covers/ (публичный доступ)
- user-music/ (приватный доступ)
- user-backgrounds/ (публичный доступ)
- rendered-videos/ (приватный доступ)
```

### 2️⃣ **Upload Validation**

```typescript
const ALLOWED_TYPES = {
  avatar: ["video/mp4", "video/webm"],
  cover: ["image/png", "image/jpeg", "image/webp"],
  music: ["audio/mp3", "audio/wav", "audio/aac"],
  background: ["video/mp4", "video/webm"],
};

const MAX_SIZES = {
  avatar: 100 * 1024 * 1024, // 100MB
  cover: 10 * 1024 * 1024, // 10MB
  music: 20 * 1024 * 1024, // 20MB
  background: 100 * 1024 * 1024, // 100MB
};
```

### 3️⃣ **Asset Processing Pipeline**

- 🎬 **Видео**: проверка длительности, конвертация в MP4
- 🖼️ **Изображения**: ресайз, оптимизация
- 🎵 **Аудио**: нормализация громкости, конвертация в MP3

---

## **PHASE 4: 🎨 FRONTEND UI (3-4 дня)**

### 1️⃣ **Video Template Editor**

```
src/components/video/
├── TemplateEditor.tsx        # Основной редактор
├── AssetUploader.tsx         # Загрузка файлов
├── TemplatePreview.tsx       # Превью в реальном времени
├── ConfigPanel.tsx           # Панель настроек
└── RenderHistory.tsx         # История рендеров
```

### 2️⃣ **User Interface Flow**

```
1. Выбор шаблона (LipSyncTemplate)
2. Загрузка ассетов (аватар, обложка, музыка, BG видео)
3. Настройка параметров (текст, эффекты, тайминг)
4. Превью в Remotion Player
5. Запуск рендеринга
6. Отслеживание прогресса
7. Скачивание готового видео
```

### 3️⃣ **Real-time Updates**

```typescript
// WebSocket или Server-Sent Events для live статуса
useEffect(() => {
  const eventSource = new EventSource("/api/render/live-status");
  eventSource.onmessage = (event) => {
    const { video_id, progress, status } = JSON.parse(event.data);
    updateRenderProgress(video_id, progress, status);
  };
}, []);
```

---

## **PHASE 5: ⚡ PRODUCTION DEPLOYMENT (2-3 дня)**

### 1️⃣ **Queue System**

```bash
# Redis + Bull Queue
npm install bull redis ioredis @types/bull
```

#### `src/utils/video/render-queue.ts`

```typescript
import Bull from "bull";

const videoQueue = new Bull("video rendering", {
  redis: process.env.REDIS_URL,
});

videoQueue.process("render-video", async (job) => {
  const { video_id, composition, props } = job.data;

  // Обновляем статус
  await updateVideoStatus(video_id, "rendering");

  // Рендерим видео
  const result = await renderVideoLocally({ composition, inputProps: props });

  // Загружаем в Storage
  await uploadToSupabaseStorage(result.localPath, video_id);

  // Обновляем статус
  await updateVideoStatus(video_id, "completed");
});
```

### 2️⃣ **Docker Configuration**

```dockerfile
# Dockerfile.video-worker
FROM node:18-alpine

# Установка FFmpeg и Chrome для Remotion
RUN apk add --no-cache \
    ffmpeg \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
CMD ["npm", "run", "video:worker"]
```

### 3️⃣ **Kubernetes Deployment**

```yaml
# k8s/video-workers.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: video-workers
spec:
  replicas: 3
  selector:
    matchLabels:
      app: video-workers
  template:
    spec:
      containers:
        - name: video-worker
          image: your-registry/video-worker:latest
          resources:
            requests:
              cpu: "1000m"
              memory: "2Gi"
            limits:
              cpu: "2000m"
              memory: "4Gi"
          env:
            - name: REDIS_URL
              value: "redis://redis-service:6379"
            - name: SUPABASE_URL
              valueFrom:
                secretKeyRef:
                  name: supabase-secrets
                  key: url
```

### 4️⃣ **Monitoring & Analytics**

```typescript
// src/utils/monitoring/video-analytics.ts
export const trackVideoRender = async (data: {
  user_id: string;
  template_name: string;
  render_duration: number;
  file_size: number;
  success: boolean;
}) => {
  // Отправка в аналитику (PostHog, Mixpanel, etc.)
  await analytics.track("video_rendered", data);

  // Метрики производительности
  await metrics.histogram("video_render_duration", data.render_duration);
  await metrics.counter("video_renders_total").inc();
};
```

---

## **PHASE 6: 💰 BILLING & LIMITS (1-2 дня)**

### 1️⃣ **Usage Tracking**

```sql
CREATE TABLE user_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id),
  period_start DATE,
  period_end DATE,
  videos_rendered INTEGER DEFAULT 0,
  total_render_time INTEGER DEFAULT 0, -- в секундах
  storage_used BIGINT DEFAULT 0, -- в байтах
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2️⃣ **Plan Limits**

```typescript
const PLAN_LIMITS = {
  free: {
    videosPerMonth: 5,
    maxDuration: 60, // секунд
    storageGB: 1,
  },
  pro: {
    videosPerMonth: 100,
    maxDuration: 300,
    storageGB: 10,
  },
  enterprise: {
    videosPerMonth: 1000,
    maxDuration: 1800,
    storageGB: 100,
  },
};
```

---

## 📋 ПРИОРИТЕТНЫЕ ЗАДАЧИ

### **Неделя 1:**

1. ✅ Создать схему БД (video_templates, user_videos, video_assets)
2. ✅ API `/api/video/user-render` с аутентификацией
3. ✅ Supabase Storage для пользовательских ассетов

### **Неделя 2:**

4. ✅ Frontend UI для загрузки ассетов и настройки шаблонов
5. ✅ Интеграция с существующей системой workspace/rooms
6. ✅ Real-time статус рендеринга

### **Неделя 3:**

7. ✅ Queue система для масштабирования
8. ✅ Docker + K8s деплой
9. ✅ Monitoring и аналитика

### **Неделя 4:**

10. ✅ Billing интеграция и лимиты
11. ✅ Тестирование и оптимизация
12. ✅ Production запуск

---

## 🎯 КЛЮЧЕВЫЕ МЕТРИКИ УСПЕХА

- **📊 Performance**: Время рендеринга < 2 минут для видео 30 сек
- **📈 Scalability**: Поддержка 100+ одновременных рендеров
- **💾 Storage**: Эффективное управление пользовательскими ассетами
- **👥 UX**: Интуитивный интерфейс создания видео за < 5 минут
- **💰 Revenue**: Monetization через план подписки

---

_Ом Намах Шивая. Как семя содержит в себе могучее дерево, так этот roadmap содержит будущую империю персонализированного видео!_ 🌱🎬✨
