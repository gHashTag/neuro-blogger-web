# 🎬 Настройка HeyGen API для липсинга

## ⚠️ Текущий статус
Ваш текущий API ключ от **5 февраля 2024** скорее всего истёк.

## 🔑 Как получить новый ключ:

1. **Войдите в HeyGen:**
   ```
   https://app.heygen.com/
   ```

2. **Перейдите в настройки API:**
   ```
   https://app.heygen.com/settings?nav=API
   ```

3. **Создайте новый API ключ:**
   - Нажмите "Create API Key"
   - Скопируйте ключ (он показывается только один раз!)

4. **Обновите ключ в `.env`:**
   ```env
   # НЕ в base64, а прямой ключ!
   NEXT_PUBLIC_HEYGEN_API_KEY=ваш_новый_ключ_без_кодирования
   ```

## ✅ Что уже готово в системе:

### 1. **API endpoint готов:** `/api/video/heygen-generate`
- Принимает текст
- Создаёт липсинг видео через HeyGen
- Возвращает URL готового видео

### 2. **Интеграция с Remotion:**
- Новое видео автоматически передаётся в шаблон
- Применяются эффекты и фоны
- Создаётся финальное видео

### 3. **Тестовая страница:** http://localhost:80/test-lipsync
- Полный пайплайн от текста до видео
- Детальные логи процесса
- Предпросмотр результата

## 🚀 После получения ключа:

1. Обновите `.env`
2. Перезапустите сервер
3. Откройте http://localhost:80/test-lipsync
4. Нажмите "🚀 ПОЛНЫЙ ТЕСТ"

## 📝 Пример запроса к API:

```bash
curl -X POST http://localhost:80/api/video/heygen-generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello! This is a test video.",
    "avatar_id": "josh_lite3_20230714",
    "voice_id": "en-US-JennyNeural"
  }'
```

## 🎯 Альтернативные решения (пока нет ключа):

### 1. **Локальная генерация:**
```bash
curl -X POST http://localhost:80/api/video/generate-real-lipsync \
  -H "Content-Type: application/json" \
  -d '{"text": "Тест липсинга"}'
```

### 2. **D-ID API:**
- Регистрация: https://www.d-id.com/
- Похожий функционал
- Есть бесплатный тариф

### 3. **Wav2Lip (бесплатно):**
```bash
# Установка
git clone https://github.com/Rudrabha/Wav2Lip.git
cd Wav2Lip
pip install -r requirements.txt

# Скачать модель
wget 'https://iiitaphyd-my.sharepoint.com/personal/radrabha_m_research_iiit_ac_in/_layouts/15/download.aspx?share=EdjI7bZlgApMqsVoEUUXpLsBxqXbn5z8VTmoxp55YNDcIA' -O 'checkpoints/wav2lip_gan.pth'
```

## 💡 Проверка статуса HeyGen:

После обновления ключа проверьте:
```bash
# Проверка аватаров
curl -X GET "https://api.heygen.com/v1/avatar.list" \
  -H "X-Api-Key: ВАШ_НОВЫЙ_КЛЮЧ"

# Проверка голосов
curl -X GET "https://api.heygen.com/v1/voice.list" \
  -H "X-Api-Key: ВАШ_НОВЫЙ_КЛЮЧ"
```

## ✅ Система полностью готова!
Просто нужен актуальный API ключ от HeyGen.
