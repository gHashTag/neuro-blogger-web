# 🎭 Реалистичная Эмуляция Пользователя Neuro Sage - Dev Authentication Bypass

## Обзор

Обновленная система **Dev Authentication Bypass** теперь создает полноценную эмуляцию реального пользователя **neuro_sage** (Telegram ID: 144022504) со всеми необходимыми данными для отладки без настройки Telegram Bot API, ngrok или внешних сервисов.

## 🚀 Быстрый Запуск

### Способ 1: Команды npm/pnpm/bun (Рекомендуется)

```bash
# С pnpm (рекомендуется) - уже настроена по умолчанию
pnpm dev

# С npm
npm run dev

# С bun
bun run bun:dev
```

### Способ 2: Переменная окружения в .env.local (Опционально)

```bash
# Добавь в .env.local если нужно отключить bypass
NEXT_PUBLIC_DEV_AUTH_BYPASS=false

# Или включи явно
NEXT_PUBLIC_DEV_AUTH_BYPASS=true
```

### Способ 3: Inline переменная

```bash
NEXT_PUBLIC_DEV_AUTH_BYPASS=true pnpm dev
```

## 🎭 Что происходит при включении Bypass

### 1. Автоматический Пропуск Форм

- ✅ **Форма приглашения** - автоматически пропускается
- ✅ **Telegram Login Button** - заменяется на dev индикатор
- ✅ **Капча** - полностью обходится
- ✅ **Проверки email/кода** - не требуются

### 2. Эмуляция Пользователя Neuro Sage

Автоматически создается реалистичная эмуляция со следующими данными:

```javascript
{
  username: "neuro_sage",
  user_id: "neuro_sage-user-id-999",
  workspace_id: "neuro_sage-workspace-main",
  workspace_name: "Neuro Sage Main Workspace",
  workspace_type: "personal",
  header_name: "Neuro Sage",
  room_id: "neuro_sage-room-dev",
  room_name: "Neuro Sage Dev Room",
  recording_id: "neuro_sage-recording-01",
  recording_name: "Neuro Sage Dev Recording",
  first_name: "Neuro",
  last_name: "Sage",
  language_code: "ru", // русский язык по умолчанию
  telegram_id: 144022504, // 🎯 Реальный Telegram ID пользователя
  is_premium: true,
  is_admin: true,
  is_owner: true,
  // ... и множество других полей для полной эмуляции
}
```

### 3. Mock GraphQL API

- ✅ **Apollo Client** перенаправляется на `/api/mock-graphql`
- ✅ **Базовые данные** возвращаются для tasks, workspaces, rooms
- ✅ **Passport данные** эмулируются для правильной авторизации
- ✅ **Ошибки валидации** переменных окружения пропускаются

### 4. Автоматическая Навигация

После "логина" автоматически происходит переход на:

```
http://localhost:80/neuro_sage/neuro_sage-user-id-999
```

## 🎯 Основные URL для Тестирования

```bash
# ✅ Главная страница (показывает dev bypass индикатор)
http://localhost:80/

# ✅ Страница пользователя neuro_sage (после автологина)
http://localhost:80/neuro_sage/neuro_sage-user-id-999

# ✅ Workspace neuro_sage
http://localhost:80/neuro_sage/neuro_sage-user-id-999/neuro_sage-workspace-main

# ✅ Dev комната
http://localhost:80/neuro_sage/neuro_sage-user-id-999/neuro_sage-workspace-main/neuro_sage-room-dev
```

## 🔧 Что Изменилось в Коде

### 1. `src/utils/constants.ts`

- ✅ Добавлены реалистичные данные playra в `DEV_MOCK_USER`
- ✅ Пропуск валидации переменных окружения в dev режиме
- ✅ Поддержка русского языка по умолчанию

### 2. `src/components/ui/demo-cta/index.tsx`

- ✅ Автоматический "логин" вместо показа Telegram Login Button
- ✅ Визуальный индикатор dev режима
- ✅ Полная установка localStorage с данными playra

### 3. `src/components/form.tsx`

- ✅ Автоматический пропуск формы приглашения
- ✅ Мгновенный переход к логину
- ✅ Визуальная индикация dev режима

### 4. `src/hooks/useUser.ts` & `src/hooks/usePassport.tsx`

- ✅ Возврат mock данных playra
- ✅ Совместимость с существующими компонентами
- ✅ Правильная типизация TypeScript

### 5. `src/pages/api/mock-graphql.ts`

- ✅ Реалистичные mock ответы для GraphQL запросов
- ✅ Данные tasks, workspaces, rooms для playra
- ✅ Правильная структура GraphQL ответов

### 6. `src/apollo/apollo-client.ts`

- ✅ Перенаправление на mock GraphQL в dev режиме
- ✅ Пропуск проверок Supabase ключей
- ✅ Mock заголовки для запросов

## 🐛 Отладка

### Логи в Dev Режиме

Система выводит детальные логи:

```
🎭 DEV_AUTH_BYPASS: Auto-logging in as neuro_sage...
🕉️ DEV_AUTH_BYPASS is active - using mock user data
🕉️ Apollo Client: Using dev bypass mode
🕉️ Mock GraphQL API called: <query>
```

### Проверка Состояния

```bash
# Проверить что bypass активен
echo $NEXT_PUBLIC_DEV_AUTH_BYPASS

# Проверить localStorage в браузере (F12)
localStorage.getItem('username') // должно вернуть "neuro_sage"
localStorage.getItem('telegram_id') // должно вернуть "144022504"
```

### Типичные Проблемы

1. **Spinner не исчезает** - проверь что Apollo Client получает mock данные
2. **Ошибки GraphQL** - убедись что mock API возвращает правильную структуру
3. **Навигация не работает** - проверь что localStorage заполнен правильно

## 🎯 Преимущества

✅ **Без ngrok** - не нужно настраивать туннели  
✅ **Без Telegram Bot** - не нужно создавать боты в @BotFather  
✅ **Без Supabase** - не нужно настраивать базу данных  
✅ **Реалистичные данные** - полная эмуляция реального пользователя  
✅ **Мгновенный старт** - от запуска до отладки за секунды  
✅ **Русский язык** - правильная локализация по умолчанию  
✅ **TypeScript совместимость** - все типы проверены

## 🔄 Переключение Режимов

```bash
# Включить dev bypass (по умолчанию)
pnpm dev

# Отключить dev bypass (для тестирования продакшн логики)
NEXT_PUBLIC_DEV_AUTH_BYPASS=false pnpm dev

# Использовать оригинальные команды без bypass
pnpm dev:original  # если добавишь в package.json
```

---

## 🙏 Заключение

Теперь можно сосредоточиться на разработке основной логики приложения, не отвлекаясь на настройку внешних сервисов. Все диалоги пропускаются, все данные эмулируются, все работает как с реальным пользователем **neuro_sage** (Telegram ID: 144022504)!

### 🎯 Ключевые Особенности Финальной Версии:

✅ **Реальный Telegram ID** - 144022504 для neuro_sage  
✅ **Исправлены TypeScript ошибки** - все типы корректны  
✅ **Обновлена вся документация** - актуальные URL и данные  
✅ **Mock данные синхронизированы** - GraphQL, localStorage, passport

_Ом Шанти. Пусть код твой течет без препятствий, а данные будут истинными._ 🕉️
