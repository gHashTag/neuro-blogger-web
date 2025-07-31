# 🎬 999-Web Video Platform

*"करावै सो भी होणो"* - *"Что задумано, то сбудется"*

**Современная платформа для создания персонализированных видео с аватарами, Telegram интеграцией и Remotion рендерингом.**

---

## 🚀 **БЫСТРЫЙ ЗАПУСК**

### **📋 Требования:**
- Node.js 18+
- pnpm (рекомендовано)
- Supabase аккаунт
- Telegram Bot токен (опционально)

### **⚡ Установка:**
```bash
# Clone repository
git clone https://github.com/your-repo/999-web.git
cd 999-web

# Install dependencies
pnpm install

# Start full development environment
pnpm run dev:full
```

### **🎛️ Доступные сервисы:**
- 🌐 **Main App**: http://localhost:80
- 🎬 **Video Editor**: http://localhost:80/video-editor  
- 🎛️ **Remotion Studio**: http://localhost:3001
- ⚡ **Inngest Dashboard**: http://localhost:8288

---

## 🎭 **ОСНОВНЫЕ ФУНКЦИИ**

### **🎬 Video Templates:**
- **LipSyncTemplate**: Создание видео с синхронизацией губ
- **Настраиваемые параметры**: музыка, фоны, эффекты
- **Без текстового слоя**: Чистая визуальная композиция

### **🤖 Telegram Integration:**
- Аутентификация через Telegram
- Bot команды для создания комнат
- WebApp интеграция

### **🎥 Video Rendering:**
- **Remotion** для программного создания видео
- **Inngest** для очередей рендеринга  
- **Local/Cloud** рендеринг

### **🗄️ Data Management:**
- **Supabase** PostgreSQL database
- **Apollo GraphQL** API
- **Real-time** subscriptions

---

## 📚 **ДОКУМЕНТАЦИЯ**

Вся документация находится в папке [`docs/`](./docs/):

- 🚀 [`DEPLOYMENT_PLAN.md`](./docs/DEPLOYMENT_PLAN.md) - План деплоя
- 🎬 [`VIDEO_SETUP_GUIDE.md`](./docs/VIDEO_SETUP_GUIDE.md) - Настройка видео
- 🔧 [`TESTING_PLAN.md`](./docs/TESTING_PLAN.md) - План тестирования
- ⚡ [`INNGEST_INTEGRATION_GUIDE.md`](./docs/INNGEST_INTEGRATION_GUIDE.md) - Inngest интеграция
- 🛠️ [`DEV_AUTH_BYPASS_PLAYRA.md`](./docs/DEV_AUTH_BYPASS_PLAYRA.md) - Dev режим

---

## 🛠️ **КОМАНДЫ РАЗРАБОТКИ**

```bash
# 🚀 Полное окружение (Next.js + Remotion + Inngest)
pnpm run dev:full

# 🛑 Остановить все сервисы  
pnpm run dev:stop

# 🏥 Проверка здоровья всех сервисов
pnpm run test:health-check

# 🎬 Только Remotion Studio
pnpm run video:preview

# 🎥 Рендеринг видео
pnpm run video:render

# 📦 Production build
pnpm build
```

---

## 🌊 **ТЕХНОЛОГИЧЕСКИЙ СТЕК**

### **Frontend:**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library

### **Backend:**
- **Supabase** - Database & Auth
- **Apollo GraphQL** - API layer
- **Inngest** - Background jobs

### **Video:**
- **Remotion** - Programmatic video creation
- **FFmpeg** - Video processing
- **100ms** - Video calls

### **Deployment:**
- **Vercel** - Hosting (recommended)
- **Docker** - Containerization
- **PM2** - Process management

---

## 🔧 **ENVIRONMENT VARIABLES**

```bash
# Copy example
cp .env.example .env.local

# Required variables:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
INNGEST_EVENT_KEY=your_inngest_key

# Development:
NEXT_PUBLIC_DEV_AUTH_BYPASS=true  # Skip auth in dev
```

---

## 🎯 **ROADMAP**

### **✅ Готово:**
- [x] Next.js приложение
- [x] Telegram auth интеграция
- [x] Remotion video templates
- [x] LipSyncTemplate (без текста)
- [x] Inngest background jobs
- [x] Video Editor UI

### **🔄 В разработке:**
- [ ] Production authentication
- [ ] Больше video templates
- [ ] Cloud video rendering
- [ ] Mobile optimization
- [ ] Analytics dashboard

### **🎯 Планы:**
- [ ] AI voice generation
- [ ] Advanced video effects  
- [ ] Multi-language support
- [ ] Enterprise features

---

## 🤝 **CONTRIBUTING**

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📱 **КОНТАКТЫ**

- **Telegram**: @neuro_sage
- **GitHub**: [999-web](https://github.com/your-repo/999-web)
- **Docs**: [./docs/](./docs/)

---

## 📄 **ЛИЦЕНЗИЯ**

MIT License - see [LICENSE](LICENSE) file for details.

---

*🕉️ "तत्त्वमसि" - "Ты есть То"*

**Создано с 💜 для будущего персонализированного контента**