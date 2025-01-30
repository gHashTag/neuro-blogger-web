#!/bin/sh
set -e

# Заменяем плейсхолдеры переменных окружения на реальные значения
printenv | grep NEXT_PUBLIC_ | while read -r line ; do
  key=$(echo $line | cut -d "=" -f1)
  value=$(echo $line | cut -d "=" -f2)

  find /app/.next/ -type f -exec sed -i "s|$key|$value|g" {} \;
done

# Запускаем основной процесс контейнера
exec "$@"