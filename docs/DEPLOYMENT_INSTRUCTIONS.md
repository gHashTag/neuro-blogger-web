# 🚀 ИНСТРУКЦИИ ПО ЗАПУСКУ ДЕМО-ВЕРСИИ

_"प्रारंभे वा परेऽभवे"_ - _"Каждое начало - это вечность"_

## 🎯 ЧТО ГОТОВО К ТЕСТИРОВАНИЮ

### ✅ **ГОТОВЫЕ КОМПОНЕНТЫ:**

1. **🎬 LipSyncTemplate** - полностью функциональный шаблон видео
2. **📊 Database Schema** - схема БД для пользовательских видео
3. **🔗 API Endpoints** - аутентифицированные эндпоинты рендеринга
4. **🎨 Video Studio UI** - интерфейс для создания видео
5. **🔐 Auth System** - интеграция с существующей системой пользователей

---

## 📋 ПОШАГОВАЯ НАСТРОЙКА

### **ШАГ 1: 🗄️ НАСТРОЙКА БАЗЫ ДАННЫХ**

1. **Откройте Supabase Dashboard** вашего проекта
2. **Перейдите в SQL Editor**
3. **Выполните схему** из файла `supabase-schema-video.sql`:

```bash
# Скопируйте и выполните содержимое файла:
cat supabase-schema-video.sql
```

**Результат:** Создадутся таблицы:

- ✅ `video_templates` - шаблоны видео
- ✅ `user_videos` - пользовательские видео
- ✅ `video_assets` - загруженные файлы
- ✅ `render_jobs` - очередь рендеринга
- ✅ `user_usage` - биллинг и лимиты

### **ШАГ 2: ☁️ НАСТРОЙКА STORAGE**

В Supabase создайте Buckets:

```sql
-- Выполните в Supabase SQL Editor:
INSERT INTO storage.buckets (id, name, public) VALUES
('user-avatars', 'user-avatars', true),
('user-covers', 'user-covers', true),
('user-music', 'user-music', false),
('user-backgrounds', 'user-backgrounds', true),
('rendered-videos', 'rendered-videos', false);
```

### **ШАГ 3: 🔧 ЗАПУСК ПРИЛОЖЕНИЯ**

```bash
# 1. Убедитесь что все зависимости установлены
pnpm install

# 2. Запустите в dev режиме с отключенной аутентификацией
pnpm dev:no-auth

# 3. В отдельном терминале запустите Remotion Studio
pnpm video:preview
```

### **ШАГ 4: 🧪 ТЕСТИРОВАНИЕ СИСТЕМЫ**

#### **4.1 Проверка базового рендеринга:**

```bash
# Откройте браузер:
http://localhost:3000/dev_user

# Должна загрузиться главная страница с mock пользователем neuro_sage
```

#### **4.2 Тестирование Video Studio:**

```bash
# Откройте Video Studio:
http://localhost:3000/video-studio

# Заполните форму и нажмите "Создать видео"
```

#### **4.3 Тестирование API напрямую:**

```bash
# Тест рендеринга через curl:
curl -X POST http://localhost:3000/api/video/user-render \
  -H "Content-Type: application/json" \
  -H "x-user-id: dev-user-id-12345" \
  -d '{
    "template_name": "LipSyncTemplate",
    "video_title": "Тестовое видео",
    "video_description": "Демо рендеринг",
    "user_assets": {},
    "config": {
      "mainText": "ТЕСТОВОЕ ВИДЕО",
      "musicVolume": 0.7
    }
  }'

# Проверка статуса:
curl "http://localhost:3000/api/video/render-status?video_id=VIDEO_ID" \
  -H "x-user-id: dev-user-id-12345"
```

---

## 🔍 TROUBLESHOOTING

### **❌ Проблема: Ошибка подключения к БД**

```bash
# Решение: Проверьте переменные окружения
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Убедитесь что они установлены в .env.local
```

### **❌ Проблема: Remotion не запускается**

```bash
# Решение: Установите зависимости Remotion
pnpm install @remotion/cli @remotion/renderer

# Проверьте что Chrome/Chromium установлен
which google-chrome || which chromium-browser
```

### **❌ Проблема: Файлы видео не найдены**

```bash
# Решение: Проверьте что test-assets на месте
ls -la public/test-assets/

# Должны быть файлы:
# - lip-sync.mp4
# - bg-video01-04.mp4
# - cover01.png
# - news.mp3
```

### **❌ Проблема: Ошибка рендеринга**

```bash
# Решение: Проверьте логи в терминале
# Убедитесь что папка public/temp-videos существует
mkdir -p public/temp-videos

# Проверьте права доступа
chmod 755 public/temp-videos
```

---

## 📊 МОНИТОРИНГ И ЛОГИ

### **Где смотреть логи:**

1. **Next.js сервер:** Terminal где запущен `pnpm dev:no-auth`
2. **Remotion Studio:** Terminal где запущен `pnpm video:preview`
3. **Supabase Dashboard:** Table Editor для просмотра записей в БД

### **Ключевые метрики:**

- ✅ Время рендеринга (должно быть < 5 минут для 30сек видео)
- ✅ Статус рендеринга в таблице `user_videos`
- ✅ Размер готовых файлов в `public/temp-videos/`

---

## 🎯 NEXT STEPS (Следующие этапы)

### **НЕДЕЛЯ 1: 📁 Asset Management**

```bash
# Создать API для загрузки файлов:
# - src/pages/api/assets/upload.ts
# - src/pages/api/assets/user-assets.ts

# Интегрировать Supabase Storage:
# - Мультипарт загрузка
# - Валидация файлов
# - Превью изображений
```

### **НЕДЕЛЯ 2: ⚡ Queue System**

```bash
# Установить Redis + Bull:
pnpm install bull redis ioredis @types/bull

# Создать воркеры:
# - src/utils/video/render-queue.ts
# - src/utils/video/render-worker.ts
```

### **НЕДЕЛЯ 3: 🎨 Enhanced UI**

```bash
# Интеграция Remotion Player:
# - Превью в реальном времени
# - Редактирование тайминга
# - Кастомные эффекты
```

### **НЕДЕЛЯ 4: ☁️ Production Deploy**

```bash
# Docker + Kubernetes:
# - Dockerfile для video workers
# - Redis cluster
# - Autoscaling
# - Monitoring
```

---

## 💡 ДЕМО СЦЕНАРИИ

### **СЦЕНАРИЙ 1: Базовый рендеринг**

1. Откройте `http://localhost:3000/video-studio`
2. Введите название: "Мое первое видео"
3. Измените текст: "ДОБРО ПОЖАЛОВАТЬ"
4. Нажмите "Создать видео"
5. Дождитесь завершения (2-5 минут)
6. Скачайте результат

### **СЦЕНАРИЙ 2: API интеграция**

1. Изучите `src/pages/api/video/user-render.ts`
2. Протестируйте через Postman/curl
3. Проверьте записи в Supabase
4. Мониторьте статус через `/render-status`

### **СЦЕНАРИЙ 3: Кастомизация шаблона**

1. Откройте `http://localhost:3001` (Remotion Studio)
2. Измените параметры в UI
3. Сохраните как новый шаблон
4. Протестируйте через Video Studio

---

## 🔐 БЕЗОПАСНОСТЬ

### **Dev режим (текущий):**

- ✅ Mock пользователь `neuro_sage`
- ✅ Отключенная аутентификация
- ✅ Локальное хранение файлов

### **Production режим (TODO):**

- 🔒 JWT токены через Supabase Auth
- 🔒 Rate limiting на API
- 🔒 Валидация загружаемых файлов
- 🔒 Encrypted хранение в облаке

---

## 📈 МЕТРИКИ УСПЕХА

### **Технические:**

- ⏱️ **Рендеринг:** < 5 минут для 30сек видео
- 🚀 **API Response:** < 500ms для статуса
- 💾 **Storage:** Эффективное сжатие видео
- 🔄 **Throughput:** 10+ одновременных рендеров

### **Пользовательские:**

- 👥 **Простота:** Создание видео за 5 минут
- 🎨 **Кастомизация:** 10+ настраиваемых параметров
- 📱 **Доступность:** Работа на мобильных устройствах
- ⭐ **Качество:** Профессиональный результат

---

## 🆘 ПОДДЕРЖКА

### **Если что-то не работает:**

1. 📖 Проверьте логи в терминале
2. 🔍 Проверьте БД в Supabase Dashboard
3. 🧪 Протестируйте API через curl
4. 📁 Убедитесь что все файлы на месте

### **Контакты:**

- 📧 Dev Team: ваша команда
- 📚 Документация: `VIDEO_DEPLOYMENT_ROADMAP.md`
- 🔧 Конфиг: `supabase-schema-video.sql`

---

## 🎉 ГОТОВО К ДЕМО!

_"यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः"_ - _"Где есть мастер йоги Кришна и лучник Партха..."_

**Ваша система видео рендеринга готова к демонстрации клиентам!** 🎬✨

**Запускайте, тестируйте, масштабируйте!** 🚀
