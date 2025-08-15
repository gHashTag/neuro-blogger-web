#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Фонемы для русского языка
const PHONEME_MOUTH_SHAPES = {
  'а': { width: 0.8, height: 0.9, shape: 'wide' },
  'е': { width: 0.6, height: 0.5, shape: 'wide' },
  'и': { width: 0.4, height: 0.3, shape: 'narrow' },
  'о': { width: 0.6, height: 0.8, shape: 'round' },
  'у': { width: 0.3, height: 0.7, shape: 'round' },
  'п': { width: 0.1, height: 0.1, shape: 'closed' },
  'р': { width: 0.5, height: 0.5, shape: 'neutral' },
  'в': { width: 0.4, height: 0.2, shape: 'teeth' },
  'т': { width: 0.5, height: 0.3, shape: 'teeth' },
  'л': { width: 0.5, height: 0.4, shape: 'neutral' },
  'с': { width: 0.4, height: 0.3, shape: 'teeth' },
  'н': { width: 0.5, height: 0.4, shape: 'neutral' },
  'г': { width: 0.6, height: 0.5, shape: 'neutral' },
  '_': { width: 0.3, height: 0.2, shape: 'neutral' }
};

// Преобразование текста в фонемы
function textToPhonemes(text) {
  const result = [];
  const cleanText = text.toLowerCase().replace(/[^а-яёa-z\s]/g, '');
  
  for (const char of cleanText) {
    if (char === ' ') {
      result.push({ phoneme: '_', duration: 150 });
    } else if (PHONEME_MOUTH_SHAPES[char]) {
      const isVowel = 'аеиоуыэюя'.includes(char);
      result.push({ 
        phoneme: char, 
        duration: isVowel ? 200 : 100 
      });
    }
  }
  
  return result;
}

// Генерация SVG кадра
function generateSVGFrame(phoneme, frameNumber) {
  const shape = PHONEME_MOUTH_SHAPES[phoneme] || PHONEME_MOUTH_SHAPES['_'];
  
  const animationPhase = Math.sin(frameNumber * 0.2) * 0.1;
  const mouthWidth = 120 * (shape.width + animationPhase);
  const mouthHeight = 80 * (shape.height + animationPhase);
  const mouthX = 320;
  const mouthY = 300;
  
  let mouthPath = '';
  switch (shape.shape) {
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
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
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
  
  <!-- Текст -->
  <text x="320" y="50" font-family="Arial" font-size="24" font-weight="bold" fill="#1976D2" text-anchor="middle">Звук: "${phoneme}"</text>
  <text x="320" y="460" font-family="Arial" font-size="16" fill="#757575" text-anchor="middle">Кадр: ${frameNumber}</text>
</svg>`;
}

async function main() {
  const text = process.argv[2] || "Привет! Тест липсинга";
  
  console.log('🎬 ЗАПУСК ГЕНЕРАЦИИ ЛИПСИНГА');
  console.log('📝 Текст:', text);
  
  try {
    // Создаем директории
    const outputDir = path.join(process.cwd(), 'public', 'generated-lipsync');
    const framesDir = path.join(outputDir, 'frames-test');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(framesDir, { recursive: true });
    
    // Генерируем фонемы
    const phonemes = textToPhonemes(text);
    console.log(`🗣️ Фонем: ${phonemes.length}`);
    console.log('Фонемы:', phonemes.map(p => p.phoneme).join(' '));
    
    // Генерируем кадры
    console.log('🎨 Генерация кадров...');
    let frameNumber = 0;
    const fps = 24;
    const frames = [];
    
    for (const { phoneme, duration } of phonemes) {
      const frameCount = Math.max(1, Math.floor((duration / 1000) * fps));
      
      for (let i = 0; i < frameCount; i++) {
        const svgContent = generateSVGFrame(phoneme, frameNumber);
        const framePath = path.join(framesDir, `frame_${String(frameNumber).padStart(5, '0')}.svg`);
        await fs.writeFile(framePath, svgContent);
        frames.push(framePath);
        frameNumber++;
        
        if (frameNumber % 10 === 0) {
          process.stdout.write(`\r🎨 Кадр ${frameNumber}...`);
        }
      }
    }
    
    console.log(`\n✅ Сгенерировано ${frameNumber} кадров`);
    
    // Создаем видео
    const videoId = `lipsync_test_${Date.now()}`;
    const videoPath = path.join(outputDir, `${videoId}.mp4`);
    
    console.log('🎥 Создание видео из SVG кадров...');
    
    // Конвертируем SVG в видео
    const ffmpegCommand = `ffmpeg -framerate ${fps} -pattern_type glob -i '${framesDir}/frame_*.svg' -c:v libx264 -pix_fmt yuv420p -y "${videoPath}" 2>/dev/null`;
    
    try {
      await execAsync(ffmpegCommand);
      console.log('✅ Видео создано:', videoPath);
    } catch (error) {
      console.log('⚠️ Ошибка ffmpeg, пробуем альтернативный метод...');
      
      // Альтернативный метод: конвертируем SVG в PNG сначала
      console.log('🔄 Конвертация SVG в PNG...');
      const pngDir = path.join(outputDir, 'frames-png');
      await fs.mkdir(pngDir, { recursive: true });
      
      for (let i = 0; i < frames.length; i++) {
        const svgPath = frames[i];
        const pngPath = path.join(pngDir, `frame_${String(i).padStart(5, '0')}.png`);
        
        // Используем ImageMagick если доступен
        try {
          await execAsync(`convert "${svgPath}" "${pngPath}" 2>/dev/null`);
        } catch (e) {
          // Если ImageMagick недоступен, пропускаем
          console.log('⚠️ ImageMagick недоступен');
          break;
        }
        
        if ((i + 1) % 10 === 0) {
          process.stdout.write(`\r🔄 Конвертация ${i + 1}/${frames.length}...`);
        }
      }
      
      console.log('\n🎥 Создание видео из PNG...');
      const pngCommand = `ffmpeg -framerate ${fps} -i ${pngDir}/frame_%05d.png -c:v libx264 -pix_fmt yuv420p -y "${videoPath}" 2>/dev/null`;
      await execAsync(pngCommand);
    }
    
    // Очистка временных файлов
    console.log('🧹 Очистка временных файлов...');
    for (const frame of frames) {
      await fs.unlink(frame).catch(() => {});
    }
    
    // Статистика
    const stats = await fs.stat(videoPath);
    const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
    const durationSec = (frameNumber / fps).toFixed(2);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ЛИПСИНГ УСПЕШНО СГЕНЕРИРОВАН!');
    console.log('='.repeat(50));
    console.log(`📹 Видео: ${videoPath}`);
    console.log(`⏱️ Длительность: ${durationSec} сек`);
    console.log(`🎞️ Кадров: ${frameNumber}`);
    console.log(`📦 Размер: ${sizeInMB} MB`);
    console.log(`🗣️ Фонем: ${phonemes.length}`);
    console.log('='.repeat(50));
    
    // Генерируем тестовое аудио
    console.log('\n🎤 Генерация аудио...');
    const audioPath = path.join(outputDir, `${videoId}_audio.wav`);
    
    try {
      // macOS TTS
      await execAsync(`say -o "${audioPath}" --data-format=LEF32@22050 "${text}" 2>/dev/null`);
      console.log('✅ Аудио создано с TTS');
    } catch (e) {
      // Создаем тишину если TTS недоступен
      await execAsync(`ffmpeg -f lavfi -i anullsrc=r=22050:cl=mono -t ${durationSec} -y "${audioPath}" 2>/dev/null`);
      console.log('✅ Создано пустое аудио');
    }
    
    // Объединяем видео и аудио
    const finalPath = path.join(outputDir, `${videoId}_final.mp4`);
    console.log('🎬 Объединение видео и аудио...');
    
    await execAsync(`ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -shortest -y "${finalPath}" 2>/dev/null`);
    
    console.log('\n✅ ФИНАЛЬНОЕ ВИДЕО:', finalPath);
    console.log('🌐 URL:', `/generated-lipsync/${path.basename(finalPath)}`);
    
  } catch (error) {
    console.error('\n❌ ОШИБКА:', error.message);
    process.exit(1);
  }
}

// Запуск
main();
