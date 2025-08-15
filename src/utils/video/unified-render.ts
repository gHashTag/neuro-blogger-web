// 🎬 UNIFIED VIDEO RENDER UTILITY
import path from 'path';
import fs from 'fs';

interface RenderConfig {
  renderType: 'test' | 'heygen' | 'custom';
  heygenVideoUrl?: string;
  inputProps?: {
    musicVolume?: number;
    coverDuration?: number;
    vignetteStrength?: number;
    colorCorrection?: number;
    [key: string]: any;
  };
}

interface RenderResult {
  videoUrl: string;
  fileSize: string;
  duration: number;
  renderTime?: number;
  metadata?: any;
}

// Нормализация путей к ассетам
function normalizeAssetPath(assetPath: string): string {
  if (!assetPath) return '';
  
  // Если это уже абсолютный URL или data URL
  if (assetPath.startsWith('http://') || 
      assetPath.startsWith('https://') || 
      assetPath.startsWith('data:')) {
    return assetPath;
  }
  
  // Если это относительный путь, преобразуем в абсолютный
  if (assetPath.startsWith('/')) {
    return `http://localhost:80${assetPath}`;
  }
  
  // Для локальных файлов
  if (assetPath.startsWith('./') || assetPath.startsWith('../')) {
    return path.resolve(process.cwd(), 'public', assetPath);
  }
  
  return assetPath;
}

// Мок функция для симуляции рендеринга
async function simulateRender(duration: number = 5000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration));
}

// Основная функция рендеринга
export async function renderVideo(config: RenderConfig): Promise<RenderResult> {
  console.log('🎬 === STARTING UNIFIED VIDEO RENDER ===');
  console.log('📋 Config:', config);
  
  const startTime = Date.now();
  const { renderType, heygenVideoUrl, inputProps = {} } = config;
  
  // Нормализуем URL видео
  const videoUrl = normalizeAssetPath(heygenVideoUrl || '/test-assets/lip-sync.mp4');
  console.log('📹 Normalized video URL:', videoUrl);
  
  // Генерируем уникальное имя для выходного файла
  const timestamp = Date.now();
  const outputFileName = `${renderType}-${timestamp}.mp4`;
  const outputPath = `/rendered-videos/${outputFileName}`;
  
  console.log('🎯 Output path:', outputPath);
  
  try {
    // Создаём директорию для результатов если её нет
    const outputDir = path.join(process.cwd(), 'public', 'rendered-videos');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('📁 Created output directory:', outputDir);
    }
    
    // В зависимости от типа рендера выполняем разную логику
    switch (renderType) {
      case 'test':
        console.log('🧪 TEST MODE RENDER');
        console.log('📊 Props:', inputProps);
        
        // Симулируем процесс рендеринга
        await simulateRender(2000);
        
        // В тестовом режиме просто копируем файл
        const testSourcePath = path.join(process.cwd(), 'public', 'test-assets', 'lip-sync.mp4');
        const testOutputPath = path.join(outputDir, outputFileName);
        
        if (fs.existsSync(testSourcePath)) {
          fs.copyFileSync(testSourcePath, testOutputPath);
          console.log('✅ Test file copied successfully');
        }
        
        break;
        
      case 'heygen':
        console.log('🎤 HEYGEN MODE RENDER');
        console.log('🎥 HeyGen video URL:', videoUrl);
        console.log('📊 Props:', inputProps);
        
        // Здесь должна быть интеграция с Remotion для реального рендеринга
        // Пока симулируем
        await simulateRender(3000);
        
        // Копируем тестовый файл как результат
        const heygenSourcePath = path.join(process.cwd(), 'public', 'test-assets', 'lip-sync.mp4');
        const heygenOutputPath = path.join(outputDir, outputFileName);
        
        if (fs.existsSync(heygenSourcePath)) {
          fs.copyFileSync(heygenSourcePath, heygenOutputPath);
          console.log('✅ HeyGen render simulated');
        }
        
        break;
        
      case 'custom':
        console.log('🎨 CUSTOM MODE RENDER');
        console.log('📊 Custom props:', inputProps);
        
        // Кастомная логика рендеринга
        await simulateRender(4000);
        
        break;
        
      default:
        throw new Error(`Unknown render type: ${renderType}`);
    }
    
    const endTime = Date.now();
    const renderTime = (endTime - startTime) / 1000;
    
    // Получаем информацию о файле
    const filePath = path.join(outputDir, outputFileName);
    let fileSize = '0';
    let duration = 30; // Дефолтная длительность
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      fileSize = (stats.size / (1024 * 1024)).toFixed(2); // В МБ
    }
    
    const result: RenderResult = {
      videoUrl: outputPath,
      fileSize: fileSize + ' MB',
      duration: duration,
      renderTime: renderTime,
      metadata: {
        renderType,
        timestamp,
        inputProps,
        originalVideo: heygenVideoUrl
      }
    };
    
    console.log('✅ === RENDER COMPLETED SUCCESSFULLY ===');
    console.log('📊 Result:', result);
    
    return result;
    
  } catch (error: any) {
    console.error('❌ Render failed:', error);
    throw error;
  }
}

// Вспомогательные функции
export function getAssetPath(filename: string, type: 'video' | 'audio' | 'image' = 'video'): string {
  const assetDirs = {
    video: 'test-assets',
    audio: 'test-assets',
    image: 'test-assets'
  };
  
  return path.join('/', assetDirs[type], filename);
}

export function validateAssets(assets: string[]): boolean {
  const publicDir = path.join(process.cwd(), 'public');
  
  for (const asset of assets) {
    const assetPath = path.join(publicDir, asset);
    if (!fs.existsSync(assetPath)) {
      console.error(`❌ Asset not found: ${assetPath}`);
      return false;
    }
  }
  
  return true;
}
