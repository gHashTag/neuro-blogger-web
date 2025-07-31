# 🧪 ПЛАН ТЕСТИРОВАНИЯ INNGEST + PROMO-VIDEO ИНТЕГРАЦИИ

_"सर्वं ज्ञानेन पश्यति"_ - _"Все видится через знание"_

---

## 🎯 ЦЕЛЬ ТЕСТИРОВАНИЯ

Проверить полную интеграцию **Inngest Queue System** + **Promo-Video-Beta UI/UX** + **999-Web архитектуру** на всех уровнях:

- ⚡ **Inngest** - фоновые очереди и рендеринг
- 🎨 **Video Editor** - UI/UX и пользовательский опыт
- 🔗 **API Integration** - связка между компонентами
- 📊 **Real-time Monitoring** - статус и прогресс
- 🎬 **Video Rendering** - качество и производительность

---

## 🚀 БЫСТРЫЙ ЗАПУСК (ОДИН СКРИПТ)

### **Команда для запуска всего окружения:**

```bash
pnpm run dev:full
```

**Что запустится автоматически:**

- 🌐 **Next.js сервер** (порт 80) - основное приложение
- ⚡ **Inngest Dev Server** (порт 8288) - мониторинг очередей
- 🎛️ **Remotion Studio** (порт 3001) - редактор композиций
- 🗄️ **Supabase** - подключение к БД (автоматически)

---

## 📋 ПЛАН ТЕСТИРОВАНИЯ

### **PHASE 1: 🔧 ОКРУЖЕНИЕ И SETUP (5 минут)**

#### **Шаг 1.1: Проверка зависимостей**

```bash
# Проверка установки всех пакетов
pnpm install

# Проверка TypeScript
pnpm exec tsc --noEmit

# Проверка что test-assets на месте
ls -la public/test-assets/
```

#### **Шаг 1.2: Запуск окружения**

```bash
# Запуск всех сервисов одной командой
pnpm run dev:full
```

#### **Шаг 1.3: Проверка доступности сервисов**

```bash
# Автоматическая проверка всех endpoints
pnpm run test:health-check
```

**Ожидаемый результат:**

- ✅ Next.js: http://localhost:80 (200)
- ✅ Inngest UI: http://localhost:8288 (200)
- ✅ Remotion Studio: http://localhost:3001 (200)

---

### **PHASE 2: 🎬 UI/UX ТЕСТИРОВАНИЕ (10 минут)**

#### **Шаг 2.1: Video Editor доступность**

1. Откройте: `http://localhost:80/video-editor`
2. Проверьте отображение 3 табов шаблонов:
   - 🎭 Promo Video
   - 🎤 Lip Sync
   - ✨ Lottie

#### **Шаг 2.2: Template Switching**

1. Переключайтесь между шаблонами
2. Убедитесь что UI адаптируется
3. Проверьте что ExportButton меняет тип

#### **Шаг 2.3: Form Validation**

1. Попробуйте экспорт БЕЗ названия → должна быть ошибка
2. Введите название → кнопка должна активироваться
3. Проверьте placeholder текст для разных шаблонов

**Критерии успеха:**

- ✅ UI загружается без ошибок
- ✅ Табы переключаются плавно
- ✅ Формы валидируются корректно
- ✅ ExportButton реагирует на изменения

---

### **PHASE 3: ⚡ INNGEST INTEGRATION (15 минут)**

#### **Шаг 3.1: Inngest UI проверка**

1. Откройте: `http://localhost:8288`
2. Проверьте что видны 4 функции:
   - `GenerateAIVideoData`
   - `RenderVideoWithInngest`
   - `CheckRenderStatus`
   - `CleanupOldVideos`

#### **Шаг 3.2: Manual Event Trigger**

```bash
# Тест через curl (API)
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

#### **Шаг 3.3: Event Monitoring**

1. В Inngest UI должно появиться событие
2. Проверьте выполнение функции `RenderVideoWithInngest`
3. Отследите все шаги (steps) в функции
4. Убедитесь что статус меняется: `queued` → `rendering` → `completed`

**Критерии успеха:**

- ✅ API возвращает `{"success": true, "video_id": "..."}`
- ✅ Событие появляется в Inngest UI
- ✅ Функция выполняется без ошибок
- ✅ Создается запись в Supabase `user_videos`

---

### **PHASE 4: 🎥 VIDEO RENDERING (20 минут)**

#### **Шаг 4.1: LipSync Template Test**

1. В Video Editor выберите **"Lip Sync"**
2. Название: `"Test LipSync Video"`
3. Нажмите **"🚀 Экспорт через Inngest"**
4. Мониторьте прогресс в UI

#### **Шаг 4.2: Promo Video Template Test**

1. Переключитесь на **"Promo Video"**
2. Название: `"Test Promo Video"`
3. Запустите рендеринг
4. Сравните время выполнения с LipSync

#### **Шаг 4.3: Status Polling Test**

1. Проверьте что статус обновляется каждые 3 секунды
2. Progress bar должен показывать прогресс (0% → 100%)
3. Toast уведомления при завершении
4. Кнопка Download должна появиться

#### **Шаг 4.4: Video Quality Check**

1. Скачайте готовые видео
2. Проверьте длительность (должна соответствовать lip-sync.mp4: ~29 сек)
3. Проверьте качество рендеринга
4. Убедитесь что все слои правильно наложены

**Критерии успеха:**

- ✅ Рендеринг завершается за < 5 минут
- ✅ Прогресс отображается корректно
- ✅ Видео файлы создаются в `public/temp-videos/`
- ✅ Качество соответствует ожиданиям
- ✅ Все слои (аватар, BG роллы, текст) корректны

---

### **PHASE 5: 📊 DATABASE & API (10 минут)**

#### **Шаг 5.1: Supabase Records Check**

1. Откройте Supabase Dashboard
2. Таблица `user_videos` - проверьте записи рендеринга
3. Убедитесь что статусы обновляются корректно
4. Проверьте что `input_props` сохраняются правильно

#### **Шаг 5.2: Status API Test**

```bash
# Получите video_id из предыдущих тестов
curl "http://localhost:80/api/video/render-status?video_id=YOUR_VIDEO_ID" \
  -H "x-user-id: test-user-12345"
```

#### **Шаг 5.3: Error Handling Test**

```bash
# Тест с неправильными данными
curl -X POST http://localhost:80/api/video/render-inngest \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "",
    "video_title": ""
  }'
```

**Критерии успеха:**

- ✅ Записи в БД создаются и обновляются
- ✅ Status API возвращает актуальную информацию
- ✅ Error handling работает корректно
- ✅ Валидация входных данных функционирует

---

### **PHASE 6: 🚀 PERFORMANCE & LOAD (15 минут)**

#### **Шаг 6.1: Concurrent Rendering**

1. Запустите 3 рендеринга одновременно (разные шаблоны)
2. Проверьте что все выполняются параллельно
3. Мониторьте использование CPU/RAM
4. Убедитесь что очереди работают стабильно

#### **Шаг 6.2: Memory Management**

```bash
# Мониторинг процессов
top -p $(pgrep -f "next dev")
top -p $(pgrep -f "inngest")
```

#### **Шаг 6.3: File Cleanup**

1. Проверьте что временные файлы очищаются
2. Убедитесь что `public/temp-videos/` не переполняется
3. Проверьте логи на memory leaks

**Критерии успеха:**

- ✅ Параллельные рендеры не конфликтуют
- ✅ Memory usage стабильный
- ✅ Временные файлы очищаются
- ✅ Система не деградирует при нагрузке

---

### **PHASE 7: 🛡️ ERROR SCENARIOS (10 минут)**

#### **Шаг 7.1: Network Failures**

1. Отключите Inngest server во время рендеринга
2. Проверьте error handling
3. Перезапустите - убедитесь что recovery работает

#### **Шаг 7.2: Invalid Assets**

1. Удалите один из test-assets файлов
2. Запустите рендеринг
3. Проверьте что ошибка корректно обрабатывается

#### **Шаг 7.3: Database Issues**

1. Временно отключите Supabase
2. Попробуйте рендеринг
3. Убедитесь что пользователь получает понятную ошибку

**Критерии успеха:**

- ✅ Graceful degradation при ошибках
- ✅ Понятные сообщения об ошибках пользователю
- ✅ Система восстанавливается после устранения проблем
- ✅ Логи содержат достаточно информации для debug

---

## 📊 ФИНАЛЬНАЯ ПРОВЕРКА

### **✅ CHECKLIST УСПЕШНОСТИ:**

**🎨 UI/UX:**

- [ ] Video Editor загружается и работает
- [ ] Переключение шаблонов функционирует
- [ ] Forms validation корректная
- [ ] Export Button responsive

**⚡ Inngest:**

- [ ] Все 4 функции зарегистрированы
- [ ] События обрабатываются
- [ ] Status polling работает
- [ ] Error recovery функционирует

**🎬 Video Rendering:**

- [ ] LipSync шаблон рендерится
- [ ] Promo Video шаблон рендерится
- [ ] Lottie шаблон готов к тестированию
- [ ] Качество видео соответствует стандартам

**📊 Data & API:**

- [ ] Supabase интеграция работает
- [ ] API endpoints отвечают корректно
- [ ] Status API обновляется real-time
- [ ] Error handling robust

**🚀 Performance:**

- [ ] Время рендеринга < 5 минут
- [ ] Параллельные рендеры работают
- [ ] Memory usage стабильный
- [ ] File cleanup функционирует

---

## 🐛 TROUBLESHOOTING

### **Если что-то не работает:**

1. **🔍 Проверьте логи:**

   ```bash
   # Логи Next.js (Terminal 1)
   # Логи Inngest (Terminal 2)
   # Логи Remotion (Terminal 3)
   ```

2. **🔄 Перезапуск сервисов:**

   ```bash
   pnpm run dev:stop    # Остановить все
   pnpm run dev:full    # Запустить заново
   ```

3. **🧪 Health Check:**

   ```bash
   pnpm run test:health-check
   ```

4. **📞 Support:**
   - Проверьте документацию: `INNGEST_INTEGRATION_GUIDE.md`
   - Изучите схему БД: `supabase-schema-video.sql`
   - Проверьте roadmap: `VIDEO_DEPLOYMENT_ROADMAP.md`

---

## 🎯 КРИТЕРИИ ГОТОВНОСТИ К PRODUCTION

### **GREEN LIGHT (Готово к продакшну):**

- ✅ Все тесты проходят успешно
- ✅ Performance показатели в норме
- ✅ Error handling robust
- ✅ UI/UX полированный
- ✅ Documentation актуальная

### **YELLOW LIGHT (Нужны доработки):**

- ⚠️ Некоторые тесты нестабильные
- ⚠️ Performance требует оптимизации
- ⚠️ Error messages нуждаются в улучшении

### **RED LIGHT (Блокирующие проблемы):**

- ❌ Рендеринг не работает
- ❌ Inngest integration broken
- ❌ Database connectivity issues
- ❌ UI/UX unusable

---

## 🎉 ЗАКЛЮЧЕНИЕ

После прохождения всех фаз тестирования, у вас будет **полная уверенность** в том, что интеграция **Inngest + Promo-Video-Beta + 999-Web** работает корректно и готова к использованию!

**Время выполнения полного тестирования: ~1.5 часа**

_Ом Намах Шивая. Как мастер-ювелир проверяет каждую грань драгоценного камня, так тщательное тестирование раскрывает совершенство нашей интеграции!_ 💎🧪✨
