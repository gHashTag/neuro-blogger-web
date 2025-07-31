# 🎯 ФИНАЛЬНЫЙ ПЛАН ТЕСТИРОВАНИЯ

_"परीक्षितम् धर्म स्थापयति"_ - _"Проверенное устанавливает истину"_

---

## 🚀 ЕДИНЫЙ СКРИПТ ЗАПУСКА

### **✅ ГОТОВО: Запуск одной командой**

```bash
# 🎯 ГЛАВНАЯ КОМАНДА - запускает ВСЁ ОКРУЖЕНИЕ
pnpm run dev:full
```

**Что происходит автоматически:**

1. 🔍 **Проверка портов** - убеждается что 80, 8288, 3001 свободны
2. 🌐 **Next.js сервер** - запускается с DEV_AUTH_BYPASS на порту 80
3. ⚡ **Inngest Dev Server** - запускается на порту 8288
4. 🎛️ **Remotion Studio** - запускается на порту 3001
5. 🏥 **Health Check** - проверяет доступность всех сервисов
6. 📊 **Логирование** - создает логи в `./scripts/logs/`
7. 🔄 **Мониторинг** - следит за процессами и перезапускает при сбоях

---

## 📋 ДОСТУПНЫЕ КОМАНДЫ

```bash
# 🚀 Запуск всех сервисов
pnpm run dev:full

# 🏥 Проверка здоровья
pnpm run test:health-check

# 🛑 Остановка всех сервисов
pnpm run dev:stop

# 🔧 Отдельные команды
pnpm run dev              # Next.js с auth bypass
pnpm run dev:no-auth      # Next.js без auth bypass
pnpm run inngest:dev      # Только Inngest
pnpm run video:preview    # Только Remotion Studio
```

---

## 🧪 ПЛАН ТЕСТИРОВАНИЯ (После запуска dev:full)

### **PHASE 1: 🔍 Проверка окружения (2 минуты)**

```bash
# Автоматически выполняется при запуске dev:full
# Если нужно проверить отдельно:
pnpm run test:health-check
```

**Ожидаемый результат:**

```
🎉 ALL SYSTEMS HEALTHY! Ready for development.

🌐 Next.js Server:       ✅  http://localhost:80
⚡ Inngest Dashboard:    ✅  http://localhost:8288
🎛️ Remotion Studio:      ✅  http://localhost:3001
🗄️ Database:             ✅  Supabase Connectivity
📁 Test Assets:          ✅  Required video/audio files
```

### **PHASE 2: 🎬 UI/UX Тестирование (5 минут)**

1. **Откройте Video Editor:**

   ```
   http://localhost:80/video-editor
   ```

2. **Проверьте переключение шаблонов:**

   - 🎭 Promo Video
   - 🎤 Lip Sync
   - ✨ Lottie

3. **Проверьте ExportButton:**
   - Валидация названия видео
   - Изменение placeholder текста
   - Активация/деактивация кнопки

### **PHASE 3: ⚡ Inngest Integration (10 минут)**

1. **Мониторинг Inngest:**

   ```
   http://localhost:8288
   ```

   Должны быть видны функции:

   - `GenerateAIVideoData`
   - `RenderVideoWithInngest`
   - `CheckRenderStatus`
   - `CleanupOldVideos`

2. **API тест через curl:**

   ```bash
   curl -X POST http://localhost:80/api/video/render-inngest \
     -H "Content-Type: application/json" \
     -H "x-user-id: test-user-12345" \
     -d '{
       "template_name": "LipSyncTemplate",
       "template_type": "lipSync",
       "video_title": "API Test Video",
       "config": {
         "mainText": "ТЕСТ API",
         "musicVolume": 0.8
       }
     }'
   ```

3. **Проверка в Inngest UI:**
   - Событие появляется в списке
   - Функция `RenderVideoWithInngest` выполняется
   - Все шаги (steps) проходят успешно

### **PHASE 4: 🎥 Video Rendering (15 минут)**

1. **LipSync Template Test:**

   - Выберите "🎤 Lip Sync"
   - Название: "Test LipSync Video"
   - Запустите рендеринг
   - Проследите прогресс: `queued` → `rendering` → `completed`

2. **Promo Video Template Test:**

   - Выберите "🎭 Promo Video"
   - Название: "Test Promo Video"
   - Запустите рендеринг
   - Сравните время выполнения

3. **Status Monitoring:**

   - Progress bar обновляется каждые 3 секунды
   - Toast уведомления работают
   - Download кнопка появляется при завершении

4. **Quality Check:**
   - Скачайте готовые видео
   - Проверьте длительность (~29 сек для LipSync)
   - Убедитесь в качестве рендеринга

### **PHASE 5: 📊 Database & API (5 минут)**

1. **Supabase Records:**

   - Откройте Supabase Dashboard
   - Проверьте таблицу `user_videos`
   - Убедитесь что записи создаются и обновляются

2. **Status API Test:**
   ```bash
   # Используйте video_id из предыдущих тестов
   curl "http://localhost:80/api/video/render-status?video_id=YOUR_VIDEO_ID" \
     -H "x-user-id: test-user-12345"
   ```

---

## 🎯 БЫСТРЫЕ СЦЕНАРИИ

### **🚀 Сценарий 1: Быстрая проверка (3 минуты)**

```bash
# 1. Запуск
pnpm run dev:full

# 2. Откройте браузер
open http://localhost:80/video-editor

# 3. Быстрый рендер
# - LipSync шаблон
# - Название "Quick Test"
# - Экспорт
```

### **⚡ Сценарий 2: API тестирование (5 минут)**

```bash
# 1. API запрос
curl -X POST http://localhost:80/api/video/render-inngest \
  -H "Content-Type: application/json" \
  -H "x-user-id: api-test" \
  -d '{"template_name": "LipSyncTemplate", "template_type": "lipSync", "video_title": "API Test"}'

# 2. Мониторинг в Inngest UI
open http://localhost:8288

# 3. Проверка статуса
curl "http://localhost:80/api/video/render-status?video_id=RETURNED_ID" \
  -H "x-user-id: api-test"
```

### **🎛️ Сценарий 3: Remotion Studio (5 минут)**

```bash
# 1. Откройте Remotion Studio
open http://localhost:3001

# 2. Выберите LipSyncTemplate
# 3. Измените параметры в UI
# 4. Проверьте превью
# 5. Рендер через Studio
```

---

## 📊 КРИТЕРИИ УСПЕХА

### **✅ GREEN LIGHT (Всё отлично):**

- Health check показывает все ✅
- Video Editor загружается за < 3 секунд
- Рендеринг завершается за < 5 минут
- API отвечает за < 500ms
- UI responsive и без ошибок
- Inngest UI показывает все функции

### **⚠️ YELLOW LIGHT (Есть проблемы):**

- Некоторые сервисы медленно отвечают
- Рендеринг занимает > 5 минут
- Периодические ошибки в логах
- UI глюки или медленная загрузка

### **❌ RED LIGHT (Критические ошибки):**

- Health check показывает ❌
- Сервисы не запускаются
- Рендеринг не работает
- API возвращает 500 ошибки
- TypeScript compilation errors

---

## 🛠️ TROUBLESHOOTING

### **❌ Проблема: "Port already in use"**

```bash
# Решение:
pnpm run dev:stop     # Остановить все
lsof -ti:80 | xargs kill -9   # Force kill порт 80
pnpm run dev:full     # Перезапустить
```

### **❌ Проблема: "Inngest не отвечает"**

```bash
# Решение:
pkill -f inngest      # Убить процессы Inngest
pnpm inngest:dev      # Запустить отдельно
# Или полный перезапуск:
pnpm run dev:stop && pnpm run dev:full
```

### **❌ Проблема: "Видео не рендерятся"**

```bash
# Проверить ассеты:
ls -la public/test-assets/

# Проверить логи:
tail -f ./scripts/logs/nextjs.log
tail -f ./scripts/logs/inngest.log

# Проверить БД:
# Supabase Dashboard → user_videos table
```

### **❌ Проблема: "Health check fails"**

```bash
# Детальная диагностика:
pnpm run test:health-check

# Проверить процессы:
ps aux | grep -E "(next|inngest|remotion)"

# Проверить порты:
lsof -i :80,:8288,:3001
```

---

## 📁 ФАЙЛОВАЯ СТРУКТУРА

```
999-web/
├── scripts/
│   ├── dev-full.sh       # 🚀 Главный скрипт запуска
│   ├── dev-stop.sh       # 🛑 Скрипт остановки
│   ├── health-check.sh   # 🏥 Проверка здоровья
│   ├── logs/             # 📊 Логи сервисов
│   │   ├── nextjs.log
│   │   ├── inngest.log
│   │   └── remotion.log
│   └── pids/             # 📍 PID файлы процессов
├── src/
│   ├── inngest/          # ⚡ Inngest интеграция
│   ├── components/video-editor/  # 🎨 UI компоненты
│   └── pages/
│       ├── video-editor.tsx      # 🎬 Главный редактор
│       └── api/video/            # 🔗 API endpoints
└── public/test-assets/   # 📁 Тестовые ассеты
```

---

## 🎉 ФИНАЛЬНАЯ ПРОВЕРКА

После прохождения всех тестов, у вас должно быть:

- ✅ **Стабильное окружение** - все сервисы работают
- ✅ **Функциональный Video Editor** - 3 типа шаблонов
- ✅ **Работающие Inngest очереди** - фоновый рендеринг
- ✅ **Real-time мониторинг** - статус и прогресс
- ✅ **Качественный рендеринг** - видео создаются корректно

**🎯 Время полного тестирования: 30-60 минут**  
**🚀 Результат: Production-ready интеграция!**

_Ом Намах Шивая. Как хорошо настроенный инструмент создает прекрасную музыку, так наша отлично протестированная система создает безупречные видео!_ 🎼🎬✨
