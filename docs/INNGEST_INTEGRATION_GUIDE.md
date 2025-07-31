# 🔗 INNGEST INTEGRATION GUIDE

_"कर्मयोगी फलासक्ति न करोति"_ - _"Действуй без привязанности к результату"_

## 🎯 ЧТО ИНТЕГРИРОВАНО

### ✅ **ГОТОВЫЕ КОМПОНЕНТЫ:**

1. **🔗 Inngest Client** (`src/inngest/client.ts`)
2. **⚡ Inngest Functions** (`src/inngest/functions.ts`):
   - `GenerateAIVideoData` - AI генерация контента
   - `RenderVideoWithInngest` - основной рендеринг видео
   - `CheckRenderStatus` - проверка статуса
   - `CleanupOldVideos` - очистка старых видео (cron)
3. **🔗 API Integration** (`src/pages/api/inngest.ts`)
4. **🎬 User Render API** (`src/pages/api/video/render-inngest.ts`)
5. **🎨 Video Editor UI** (`src/pages/video-editor.tsx`)
6. **🚀 Export Button** (`src/components/video-editor/ExportButton.tsx`)
7. **📊 Video Context** (`src/components/context/VideoFrameContext.tsx`)

---

## 🚀 ЗАПУСК И ТЕСТИРОВАНИЕ

### **ШАГ 1: 🔧 Настройка Environment Variables**

Добавьте в `.env.local`:

```bash
# Inngest Configuration
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# Для dev можно оставить пустыми
# Inngest будет работать в dev режиме автоматически
```

### **ШАГ 2: 🏃‍♂️ Запуск Серверов**

Откройте **3 терминала**:

#### **Терминал 1: Next.js приложение**

```bash
pnpm dev

# Приложение запустится на http://localhost:80
```

#### **Терминал 2: Inngest Dev Server**

```bash
pnpm inngest:dev

# Inngest UI запустится на http://localhost:8288
```

#### **Терминал 3: Remotion Studio (опционально)**

```bash
pnpm video:preview

# Remotion Studio на http://localhost:3001
```

### **ШАГ 3: 🧪 Тестирование через UI**

1. **Откройте Video Editor:**

   ```
   http://localhost:80/video-editor
   ```

2. **Выберите тип шаблона:**

   - 🎬 Promo Video
   - 🎤 Lip Sync
   - ✨ Lottie

3. **Введите название видео** и нажмите **"🚀 Экспорт через Inngest"**

4. **Мониторьте процесс:**
   - Статус обновляется автоматически
   - Прогресс бар показывает прогресс
   - Уведомления через toast

### **ШАГ 4: 📊 Мониторинг в Inngest UI**

Откройте **Inngest Dev UI:** `http://localhost:8288`

Вы увидите:

- ✅ **Functions:** Список зарегистрированных функций
- 📈 **Events:** События и их выполнение
- 🔍 **Logs:** Детальные логи выполнения
- ⏱️ **Timeline:** Временная шкала выполнения

---

## 🧪 ТЕСТОВЫЕ СЦЕНАРИИ

### **СЦЕНАРИЙ 1: 🎬 Promo Video рендеринг**

```bash
# 1. Выберите "Promo Video" в UI
# 2. Введите название: "Test Promo Video"
# 3. Нажмите "Экспорт"
# 4. Проверьте в Inngest UI выполнение функции "RenderVideoWithInngest"
# 5. Дождитесь статуса "completed"
# 6. Скачайте видео
```

### **СЦЕНАРИЙ 2: 🎤 Lip Sync рендеринг**

```bash
# 1. Выберите "Lip Sync" в UI
# 2. Введите название: "Test Lip Sync Video"
# 3. Нажмите "Экспорт"
# 4. Проверьте использование нашего существующего LipSyncTemplate
# 5. Скачайте готовое видео
```

### **СЦЕНАРИЙ 3: 📊 API тестирование через curl**

```bash
# Тест Inngest рендеринга:
curl -X POST http://localhost:80/api/video/render-inngest \
  -H "Content-Type: application/json" \
  -H "x-user-id: dev-user-id-12345" \
  -d '{
    "template_name": "LipSyncTemplate",
    "template_type": "lipSync",
    "video_title": "API Test Video",
    "config": {
      "mainText": "API ТЕСТ",
      "musicVolume": 0.7
    }
  }'

# Проверка статуса:
curl "http://localhost:80/api/video/render-status?video_id=VIDEO_ID" \
  -H "x-user-id: dev-user-id-12345"
```

---

## 🔍 TROUBLESHOOTING

### **❌ Ошибка: "Inngest functions not found"**

**Решение:**

```bash
# 1. Проверьте что Inngest dev server запущен:
pnpm inngest:dev

# 2. Проверьте что функции регистрируются:
curl http://localhost:80/api/inngest

# 3. Перезапустите Next.js:
pnpm dev
```

### **❌ Ошибка: "Database connection failed"**

**Решение:**

```bash
# 1. Убедитесь что Supabase переменные настроены:
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. Проверьте что схема БД создана:
# Выполните supabase-schema-video.sql
```

### **❌ Ошибка: "Render failed in Inngest"**

**Решение:**

```bash
# 1. Проверьте логи в Inngest UI (http://localhost:8288)
# 2. Убедитесь что test-assets существуют:
ls -la public/test-assets/

# 3. Проверьте права доступа к папке temp-videos:
mkdir -p public/temp-videos
chmod 755 public/temp-videos
```

### **❌ Ошибка: "Event not triggered"**

**Решение:**

```bash
# 1. Проверьте что API endpoint доступен:
curl -X POST http://localhost:80/api/inngest

# 2. Проверьте что клиент Inngest настроен:
# Посмотрите логи в терминале Next.js

# 3. Убедитесь что событие отправляется:
# Проверьте Network tab в браузере
```

---

## 📊 МОНИТОРИНГ И ЛОГИ

### **Где смотреть логи:**

1. **Next.js сервер:** Terminal с `pnpm dev`
2. **Inngest функции:** `http://localhost:8288` → Functions → конкретная функция
3. **Database:** Supabase Dashboard → Table Editor → `user_videos`
4. **Browser Console:** F12 → Console для frontend логов

### **Ключевые метрики:**

- ✅ **Время рендеринга:** < 5 минут для 30сек видео
- ✅ **Статус обновления:** каждые 3 секунды
- ✅ **Успешность:** 95%+ рендеров завершаются успешно
- ✅ **Размер очереди:** < 10 задач одновременно

---

## 🔄 WORKFLOW ДИАГРАММА

```
👤 USER
  ↓ 1. Выбирает шаблон
🎨 Video Editor UI
  ↓ 2. Нажимает "Экспорт"
🔗 /api/video/render-inngest
  ↓ 3. Создает запись в БД
🗄️ Supabase (user_videos)
  ↓ 4. Отправляет событие
⚡ Inngest Client
  ↓ 5. Запускает функцию
🎬 RenderVideoWithInngest
  ↓ 6. Вызывает рендеринг
🎥 renderVideoLocally()
  ↓ 7. Создает видео
📁 public/temp-videos/
  ↓ 8. Обновляет статус
🗄️ Supabase (completed)
  ↓ 9. Поллинг статуса
📊 /api/video/render-status
  ↓ 10. Показывает ссылку
💾 Download Video
```

---

## 🚀 NEXT STEPS

### **Готово для production:**

- ✅ Базовая Inngest интеграция
- ✅ Очереди и фоновые задачи
- ✅ Статус мониторинг
- ✅ UI для управления

### **TODO для production:**

- ⏳ Cloud Run/Lambda рендеринг
- ⏳ Drizzle ORM интеграция
- ⏳ Расширенные Remotion композиции
- ⏳ AI генерация контента
- ⏳ Музыкальные ассеты

---

## 🎉 ГОТОВО К ДЕМО!

**Ваша Inngest интеграция готова к тестированию!**

**Команды для быстрого старта:**

```bash
# Terminal 1
pnpm dev

# Terminal 2
pnpm inngest:dev

# Откройте браузер
http://localhost:80/video-editor
```

_Ом Намах Шивая. Как река течет к океану, так ваши видео теперь плавно проходят через очереди Inngest к завершению!_ 🌊🎬✨
