import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Фонемы для русского языка с формами рта
const PHONEME_MOUTH_SHAPES: Record<string, { width: number; height: number; shape: string }> = {
  // Гласные
  'а': { width: 0.8, height: 0.9, shape: 'wide' },
  'э': { width: 0.7, height: 0.6, shape: 'wide' },
  'е': { width: 0.6, height: 0.5, shape: 'wide' },
  'и': { width: 0.4, height: 0.3, shape: 'narrow' },
  'ы': { width: 0.5, height: 0.4, shape: 'neutral' },
  'о': { width: 0.6, height: 0.8, shape: 'round' },
  'у': { width: 0.3, height: 0.7, shape: 'round' },
  'ё': { width: 0.6, height: 0.8, shape: 'round' },
  'ю': { width: 0.4, height: 0.7, shape: 'round' },
  'я': { width: 0.7, height: 0.8, shape: 'wide' },
  
  // Согласные
  'б': { width: 0.1, height: 0.1, shape: 'closed' },
  'п': { width: 0.1, height: 0.1, shape: 'closed' },
  'м': { width: 0.2, height: 0.1, shape: 'closed' },
  'в': { width: 0.4, height: 0.2, shape: 'teeth' },
  'ф': { width: 0.4, height: 0.2, shape: 'teeth' },
  'д': { width: 0.5, height: 0.3, shape: 'teeth' },
  'т': { width: 0.5, height: 0.3, shape: 'teeth' },
  'н': { width: 0.5, height: 0.4, shape: 'neutral' },
  'з': { width: 0.4, height: 0.3, shape: 'teeth' },
  'с': { width: 0.4, height: 0.3, shape: 'teeth' },
  'л': { width: 0.5, height: 0.4, shape: 'neutral' },
  'р': { width: 0.5, height: 0.5, shape: 'neutral' },
  'ж': { width: 0.5, height: 0.4, shape: 'round' },
  'ш': { width: 0.5, height: 0.4, shape: 'round' },
  'щ': { width: 0.5, height: 0.4, shape: 'round' },
  'ч': { width: 0.4, height: 0.3, shape: 'round' },
  'ц': { width: 0.4, height: 0.3, shape: 'teeth' },
  'к': { width: 0.6, height: 0.5, shape: 'neutral' },
  'г': { width: 0.6, height: 0.5, shape: 'neutral' },
  'х': { width: 0.6, height: 0.5, shape: 'neutral' },
  'й': { width: 0.4, height: 0.3, shape: 'narrow' },
  
  // Молчание
  '_': { width: 0.3, height: 0.2, shape: 'neutral' }
};

// Преобразование текста в фонемы
function textToPhonemes(text: string): Array<{ phoneme: string; duration: number }> {
  const result: Array<{ phoneme: string; duration: number }> = [];
  const cleanText = text.toLowerCase().replace(/[^а-яёa-z\s]/g, '');
  
  for (const char of cleanText) {
    if (char === ' ') {
      result.push({ phoneme: '_', duration: 150 });
    } else if (PHONEME_MOUTH_SHAPES[char]) {
      // Гласные длиннее согласных
      const isVowel = 'аэеиыоуёюя'.includes(char);
      result.push({ 
        phoneme: char, 
        duration: isVowel ? 200 : 100 
      });
    }
  }
  
  return result;
}


// Генерация SVG кадра видео
function generateSVGFrame(phoneme: string, frameNumber: number): string {
  const mouthShape = PHONEME_MOUTH_SHAPES[phoneme as keyof typeof PHONEME_MOUTH_SHAPES] || PHONEME_MOUTH_SHAPES['_'];
  
  // Анимация
  const animationPhase = Math.sin(frameNumber * 0.2) * 0.1;
  const animatedWidth = mouthShape.width + animationPhase;
  const animatedHeight = mouthShape.height + animationPhase;
  
  const mouthWidth = 120 * animatedWidth;
  const mouthHeight = 80 * animatedHeight;
  const mouthX = 320;
  const mouthY = 300;
  
  // Генерируем форму рта
  let mouthPath = '';
  switch (mouthShape.shape) {
    case 'wide':
      mouthPath = `<ellipse cx="${mouthX}" cy="${mouthY}" rx="${mouthWidth/2}" ry="${mouthHeight/2}" fill="#FF6B6B" stroke="#D32F2F" stroke-width="3"/>`;
      break;
    case 'round':
      const radius = Math.min(mouthWidth, mouthHeight) / 2;
      mouthPath = `<circle cx="${mouthX}" cy="${mouthY}" r="${radius}" fill="#FF6B6B" stroke="#D32F2F" stroke-width="3"/>`;
      break;
    case 'narrow':
      mouthPath = `<ellipse cx="${mouthX}" cy="${mouthY}" rx="${mouthWidth/2}" ry="${mouthHeight/3}" fill="#FF6B6B" stroke="#D32F2F" stroke-width="3"/>`;
      break;
    case 'closed':
      mouthPath = `<line x1="${mouthX - mouthWidth/2}" y1="${mouthY}" x2="${mouthX + mouthWidth/2}" y2="${mouthY}" stroke="#D32F2F" stroke-width="3"/>`;
      break;
    case 'teeth':
      mouthPath = `
        <ellipse cx="${mouthX}" cy="${mouthY}" rx="${mouthWidth/2}" ry="${mouthHeight/3}" fill="#FF6B6B" stroke="#D32F2F" stroke-width="3"/>
        <line x1="${mouthX - mouthWidth/2}" y1="${mouthY}" x2="${mouthX + mouthWidth/2}" y2="${mouthY}" stroke="white" stroke-width="1"/>
      `;
      break;
    default:
      mouthPath = `<ellipse cx="${mouthX}" cy="${mouthY}" rx="${mouthWidth/2}" ry="${mouthHeight/2}" fill="#FF6B6B" stroke="#D32F2F" stroke-width="3"/>`;
  }
  
  // Добавляем язык для некоторых звуков
  let tongue = '';
  if (mouthShape.shape === 'wide' || mouthShape.shape === 'neutral') {
    tongue = `<ellipse cx="${mouthX}" cy="${mouthY + mouthHeight/3}" rx="${mouthWidth/4}" ry="${mouthHeight/5}" fill="#FF8A80"/>`;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
  <!-- Фон -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#E3F2FD" />
      <stop offset="100%" style="stop-color:#BBDEFB" />
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#bg)"/>
  
  <!-- Лицо -->
  <circle cx="320" cy="240" r="150" fill="#FFE0B2" stroke="#FFCC80" stroke-width="2"/>
  
  <!-- Глаза -->
  <circle cx="280" cy="200" r="15" fill="#424242"/>
  <circle cx="360" cy="200" r="15" fill="#424242"/>
  
  <!-- Нос -->
  <path d="M 320 220 L 310 250 L 330 250" stroke="#FFCC80" stroke-width="2" fill="none"/>
  
  <!-- Рот -->
  ${mouthPath}
  ${tongue}
  
  <!-- Текст с фонемой -->
  <text x="320" y="50" font-family="Arial" font-size="24" font-weight="bold" fill="#1976D2" text-anchor="middle">Звук: "${phoneme}"</text>
  
  <!-- Метка кадра -->
  <text x="320" y="460" font-family="Arial" font-size="16" fill="#757575" text-anchor="middle">Кадр: ${frameNumber}</text>
</svg>`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text = "Привет! Это тестовое видео для проверки липсинга. Система работает отлично!" } = req.body;
    
    console.log('🎬 Генерация липсинг видео...');
    console.log('📝 Текст:', text);
    
    // Создаем директории
    const outputDir = path.join(process.cwd(), 'public', 'generated-lipsync');
    const framesDir = path.join(outputDir, 'frames');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(framesDir, { recursive: true });
    
    // Преобразуем текст в фонемы
    const phonemes = textToPhonemes(text);
    console.log('🗣️ Фонемы:', phonemes.length);
    
    // Генерируем кадры
    console.log('🎨 Генерация кадров...');
    let frameNumber = 0;
    const fps = 24;
    const frames: string[] = [];
    
    for (const { phoneme, duration } of phonemes) {
      const frameCount = Math.max(1, Math.floor((duration / 1000) * fps));
      
      for (let i = 0; i < frameCount; i++) {
        const svgContent = generateSVGFrame(phoneme, frameNumber);
        const framePath = path.join(framesDir, `frame_${String(frameNumber).padStart(5, '0')}.svg`);
        await fs.writeFile(framePath, svgContent);
        frames.push(framePath);
        frameNumber++;
      }
    }
    
    console.log(`✅ Сгенерировано ${frameNumber} кадров`);
    
    // Создаем видео из кадров
    const videoId = `lipsync_${Date.now()}`;
    const videoPath = path.join(outputDir, `${videoId}.mp4`);
    
    console.log('🎥 Создание видео...');
    // Конвертируем SVG в видео через ffmpeg
    const ffmpegCommand = `ffmpeg -framerate ${fps} -pattern_type glob -i '${framesDir}/frame_*.svg' -c:v libx264 -pix_fmt yuv420p -y "${videoPath}"`;
    
    await execAsync(ffmpegCommand);
    
    // Очищаем временные кадры
    for (const frame of frames) {
      await fs.unlink(frame).catch(() => {});
    }
    
    // Генерируем аудио с TTS
    console.log('🎤 Генерация аудио...');
    const audioPath = path.join(outputDir, `${videoId}_audio.wav`);
    
    // Используем say для генерации речи на macOS
    const ttsCommand = `say -o "${audioPath}" --data-format=LEF32@22050 "${text}"`;
    await execAsync(ttsCommand).catch(async (error) => {
      // Если say не работает, создаем тишину
      console.log('⚠️ TTS недоступен, создаем тишину');
      const silenceCommand = `ffmpeg -f lavfi -i anullsrc=r=22050:cl=mono -t ${frameNumber / fps} -y "${audioPath}"`;
      await execAsync(silenceCommand);
    });
    
    // Объединяем видео и аудио
    console.log('🎬 Объединение видео и аудио...');
    const finalVideoPath = path.join(outputDir, `${videoId}_final.mp4`);
    const mergeCommand = `ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -shortest -y "${finalVideoPath}"`;
    
    await execAsync(mergeCommand);
    
    // Удаляем промежуточные файлы
    await fs.unlink(videoPath).catch(() => {});
    await fs.unlink(audioPath).catch(() => {});
    
    const publicPath = `/generated-lipsync/${videoId}_final.mp4`;
    
    console.log('✅ Липсинг видео готово:', publicPath);
    
    res.status(200).json({
      success: true,
      video_id: videoId,  // Используем snake_case как ожидает страница
      video_url: publicPath,  // Используем snake_case
      videoUrl: publicPath,  // Дублируем для совместимости
      duration: frameNumber / fps,
      frames: frameNumber,
      phonemes: phonemes.length,
      message: 'Липсинг видео успешно сгенерировано!'
    });
    
  } catch (error) {
    console.error('❌ Ошибка генерации липсинга:', error);
    res.status(500).json({ 
      error: 'Failed to generate lipsync video',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
