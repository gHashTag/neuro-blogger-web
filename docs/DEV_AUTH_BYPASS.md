# 🕉️ Dev Authentication Bypass - Отключение Аутентификации в Dev Режиме

## Обзор

Система **Dev Authentication Bypass** позволяет полностью отключить аутентификацию в режиме разработки, избавляя разработчиков от необходимости настройки Telegram ботов, Supabase и других сервисов.

## 🚀 Быстрый Запуск

### Способ 1: Команды npm/pnpm/bun

```bash
# С pnpm (рекомендуется)
pnpm dev:no-auth

# С npm
npm run dev:no-auth

# С bun
bun run bun:dev:no-auth
```

### Способ 2: Переменная окружения в .env.local

```bash
# Добавь в .env.local
NEXT_PUBLIC_DEV_AUTH_BYPASS=true

# Затем запусти обычную команду
pnpm dev
```

### Способ 3: Inline переменная

```bash
NEXT_PUBLIC_DEV_AUTH_BYPASS=true pnpm dev
```

## 🎭 Что происходит при включении Bypass

### Mock Пользователь

Автоматически создается виртуальный пользователь со следующими данными:

```javascript
{
  username: "dev_user",
  user_id: "dev-user-id-12345",
  workspace_id: "dev-workspace-id",
  workspace_name: "Dev Workspace",
  workspace_type: "development",
  first_name: "Dev",
  last_name: "User",
  photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
  is_owner: true
}
```

### Обходится аутентификация в:

- **useUser** хук - возвращает mock данные вместо localStorage
- **usePassport** хук - возвращает mock passport без GraphQL запросов
- **Layout** компонент - пользователь считается авторизованным
- **Защищенные страницы** - больше не требуют реальной авторизации

## 🛠️ Технические Детали

### Измененные файлы:

- `src/utils/constants.ts` - конфигурация и mock данные
- `src/hooks/useUser.ts` - добавлен dev bypass
- `src/hooks/usePassport.tsx` - добавлен dev bypass
- `package.json` - новые команды для запуска

### Логика проверки:

```javascript
// В constants.ts
export const DEV_AUTH_BYPASS =
  __DEV__ && process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true";

// В хуках
if (DEV_AUTH_BYPASS) {
  // Возвращаем mock данные
  return mockData;
}
// Иначе обычная логика
```

## 🔒 Безопасность

- ✅ Работает **ТОЛЬКО** в `NODE_ENV=development`
- ✅ Требует **явного** включения через переменную окружения
- ✅ В продакшене (`NODE_ENV=production`) автоматически отключается
- ✅ Не влияет на реальные данные в базе

## 🐛 Отладка

### Проверка статуса Bypass:

```javascript
// В браузере консоли
console.log("DEV_AUTH_BYPASS:", process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS);
console.log("NODE_ENV:", process.env.NODE_ENV);
```

### Если не работает:

1. Проверь переменную `NEXT_PUBLIC_DEV_AUTH_BYPASS=true` в .env.local
2. Убедись что `NODE_ENV=development`
3. Перезапуsti сервер разработки
4. Проверь консоль браузера на ошибки

## 🎯 Примеры Использования

### Разработка компонентов

```bash
# Запускай с bypass для быстрой разработки UI
pnpm dev:no-auth
```

### Тестирование без внешних зависимостей

```bash
# Избегай настройки Supabase/Telegram для быстрых тестов
bun run bun:dev:no-auth
```

### CI/CD пайплайны

```bash
# В GitHub Actions или других CI
NEXT_PUBLIC_DEV_AUTH_BYPASS=true npm run build
```

## 🔄 Отключение Bypass

### Временное отключение:

```bash
# Просто не используй :no-auth команды
pnpm dev
```

### Постоянное отключение:

```bash
# Удали или закомментируй в .env.local
# NEXT_PUBLIC_DEV_AUTH_BYPASS=true
```

---

_Ом Шанти. Пусть разработка будет быстрой, а код чистым._ 🙏✨
