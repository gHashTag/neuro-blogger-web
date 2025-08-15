import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

// 🎬 ГЕНЕРАТОР ЛИПСИНГА - ТЕСТОВАЯ ВЕРСИЯ
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["POST"],
    origin: ["http://localhost:80", "http://localhost:3000"],
    credentials: true,
  });

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    console.log('🎬 === LIPSYNC GENERATION REQUEST ===');
    console.log('📄 Request body:', req.body);

    const { avatar_id, text, script, voice_id, test } = req.body;
    const textContent = text || script || "Test video";

    if (!avatar_id || !textContent) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: avatar_id and text/script"
      });
    }

    // Генерируем уникальный ID для каждого запроса
    const timestamp = Date.now();
    const uniqueId = `lipsync_${timestamp}_${Math.random().toString(36).substring(7)}`;
    
    console.log('🚀 СОЗДАЁМ НОВОЕ ЛИПСИНГ ВИДЕО!');
    console.log('🆔 Уникальный ID:', uniqueId);
    console.log('📝 Текст для озвучки:', textContent);
    console.log('🎭 Аватар:', avatar_id);
    console.log('🎤 Голос:', voice_id || 'default');
    
    // Имитируем процесс генерации
    console.log('\n📢 ШАГ 1: Генерация TTS аудио...');
    console.log('   - Анализ текста: ' + textContent.length + ' символов');
    console.log('   - Выбран голос: ' + (voice_id || 'Milena (ru-RU)'));
    console.log('   ✅ Аудио создано: audio_' + uniqueId + '.mp3');
    
    console.log('\n👄 ШАГ 2: Анализ фонем и создание карты движений губ...');
    const words = textContent.split(' ');
    console.log('   - Слов в тексте: ' + words.length);
    console.log('   - Фонем обнаружено: ' + (textContent.length * 0.7).toFixed(0));
    console.log('   - Визем (форм губ): 14 типов');
    console.log('   ✅ Карта синхронизации создана');
    
    console.log('\n🎬 ШАГ 3: Создание видео с синхронизацией губ...');
    console.log('   - Базовое видео: ' + (avatar_id === 'josh_lite3_20230714' ? 'Josh Avatar' : avatar_id));
    console.log('   - Применение движений губ...');
    console.log('   - Синхронизация с аудио...');
    console.log('   ✅ Липсинг видео создано: video_' + uniqueId + '.mp4');
    
    console.log('\n🎨 ШАГ 4: Финальная обработка...');
    console.log('   - Разрешение: 720x1280');
    console.log('   - FPS: 30');
    console.log('   - Битрейт: 2500 kbps');
    console.log('   ✅ Финальное видео готово!');
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ ЛИПСИНГ УСПЕШНО СОЗДАН!');
    console.log('🆔 ID:', uniqueId);
    console.log('📝 Текст:', textContent.substring(0, 50) + '...');
    console.log('⏱️ Время генерации: ~5 сек (тестовый режим)');
    console.log('='.repeat(50));

    // В тестовом режиме возвращаем существующее видео, но с уникальными метаданными
    const response = {
      success: true,
      video_id: uniqueId,
      video_url: '/test-assets/lip-sync.mp4', // Используем тестовое видео
      status: "completed",
      message: "Липсинг видео создано (тестовый режим)",
      metadata: {
        id: uniqueId,
        text: textContent,
        voice: voice_id || 'Milena',
        avatar: avatar_id,
        generated_at: new Date().toISOString(),
        duration: 5.2,
        phonemes_count: Math.floor(textContent.length * 0.7),
        words_count: words.length,
        render_time: 5000,
        test_mode: true,
        note: "Это тестовая версия. В продакшн версии будет реальная генерация с ML моделями."
      }
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Ошибка генерации липсинга:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
