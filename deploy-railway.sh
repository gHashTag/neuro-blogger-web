#!/bin/bash

echo "🚂 Начинаем деплой на Railway..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Убедитесь, что вы в корневой директории проекта."
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo "❌ Ошибка: .env файл не найден."
    exit 1
fi

echo "📋 Загружаем переменные окружения в Railway..."

# Читаем .env файл и загружаем переменные
while IFS='=' read -r key value; do
    # Пропускаем пустые строки и комментарии
    if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
        # Удаляем пробелы
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        
        echo "  → Устанавливаем $key"
        railway variables --set "$key=$value"
    fi
done < .env

echo "✅ Переменные окружения загружены!"

# Проверяем наличие railway.json для настройки сборки
if [ ! -f "railway.json" ]; then
    echo "📝 Создаём railway.json..."
    cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
fi

# Добавляем railway.json в git
git add railway.json

# Проверяем статус git
if [[ -n $(git status -s) ]]; then
    echo "📦 Коммитим изменения..."
    git commit -m "Add Railway configuration"
fi

echo "🚀 Запускаем деплой..."
railway up

echo "✨ Деплой завершён!"
echo "🔗 Проверьте ваш проект: https://railway.com/project/$(railway status --json | jq -r .projectId)"
