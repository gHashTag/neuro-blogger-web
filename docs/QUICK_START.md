# 🚀 QUICK START GUIDE

_"सरलता परम सौन्दर्यम्"_ - _"Простота - высшая красота"_

---

## ⚡ ЗАПУСК ОДНОЙ КОМАНДОЙ

### **🎯 Главная команда:**

```bash
pnpm run dev:full
```

**Что запустится автоматически:**

- 🌐 Next.js приложение (порт 80)
- ⚡ Inngest Dev Server (порт 8288)
- 🎛️ Remotion Studio (порт 3001)
- 🏥 Health Check всех сервисов

---

## 🔗 БЫСТРЫЕ ССЫЛКИ

После запуска откройте в браузере:

- **🎬 Video Editor:** `http://localhost:80/video-editor`
- **⚡ Inngest Dashboard:** `http://localhost:8288`
- **🎛️ Remotion Studio:** `http://localhost:3001`

---

## 📋 БЫСТРЫЕ КОМАНДЫ

```bash
# 🚀 Запустить все сервисы
pnpm run dev:full

# 🏥 Проверить здоровье всех сервисов
pnpm run test:health-check

# 🛑 Остановить все сервисы
pnpm run dev:stop

# 🔧 Только Next.js с auth bypass
pnpm run dev

# 🔧 Только Next.js без auth bypass
pnpm run dev:no-auth
```

---

## 🧪 БЫСТРЫЙ ТЕСТ

1. **Запустите окружение:**

   ```bash
   pnpm run dev:full
   ```

2. **Откройте Video Editor:**

   ```
   http://localhost:80/video-editor
   ```

3. **Протестируйте рендеринг:**

   - Выберите "🎤 Lip Sync"
   - Введите название: "Test Video"
   - Нажмите "🚀 Экспорт через Inngest"
   - Следите за прогрессом в UI

4. **Мониторьте в Inngest:**
   ```
   http://localhost:8288
   ```

---

## 🐛 TROUBLESHOOTING

### **❌ Ошибка портов:**

```bash
# Остановить все и перезапустить
pnpm run dev:stop
pnpm run dev:full
```

### **❌ Сервисы не отвечают:**

```bash
# Проверить статус
pnpm run test:health-check

# Посмотреть логи
tail -f ./scripts/logs/nextjs.log
tail -f ./scripts/logs/inngest.log
tail -f ./scripts/logs/remotion.log
```

### **❌ Отсутствуют ассеты:**

```bash
# Проверить наличие файлов
ls -la public/test-assets/

# Должны быть:
# - lip-sync.mp4
# - cover01.png
# - news.mp3
# - bg-video01.mp4
# - bg-video02.mp4
# - bg-video03.mp4
# - bg-video04.mp4
```

---

## 📚 ПОЛНАЯ ДОКУМЕНТАЦИЯ

- **📋 План тестирования:** `TESTING_PLAN.md`
- **🔗 Inngest интеграция:** `INNGEST_INTEGRATION_GUIDE.md`
- **📊 Деплой roadmap:** `VIDEO_DEPLOYMENT_ROADMAP.md`
- **🎯 Краткий summary:** `PROMO_VIDEO_INTEGRATION_SUMMARY.md`

---

## 🎉 ГОТОВО!

После успешного запуска у вас будет:

- ✅ **Мощный Video Editor** с 3 типами шаблонов
- ✅ **Inngest очереди** для фонового рендеринга
- ✅ **Real-time мониторинг** прогресса
- ✅ **Remotion Studio** для редактирования композиций
- ✅ **Dev Auth Bypass** для быстрой отладки

_Ом Намах Шивая. Как одним движением руки мастер открывает все замки, так одна команда запускает всю мощь нашей платформы!_ 🗝️🚀✨
