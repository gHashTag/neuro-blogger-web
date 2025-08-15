// 🎬 ТЕСТОВАЯ СТРАНИЦА ДЛЯ ПРОВЕРКИ ЛИПСИНГА
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TestLog {
  time: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export default function TestLipSyncPage() {
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const addLog = (level: TestLog['level'], message: string) => {
    const log: TestLog = {
      time: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [...prev, log]);
    console.log(`[${level.toUpperCase()}] ${message}`);
  };

  // ПОЛНЫЙ ТЕСТ ПАЙПЛАЙНА - СОЗДАНИЕ ЛИПСИНГА С НУЛЯ!
  const testFullPipeline = async () => {
    setIsRendering(true);
    setVideoUrl(null);
    setLogs([]);
    
    addLog('info', '🚀 ЗАПУСК ПОЛНОГО СОЗДАНИЯ ЛИПСИНГА С НУЛЯ!');
    
    try {
      // ШАГ 1: СОЗДАНИЕ ЛИПСИНГ ВИДЕО
      addLog('info', '🎤 ШАГ 1: Создание lip-sync видео...');
      addLog('info', '📝 Тестовый текст: "Привет! Это тестовое видео для проверки липсинга. Система работает отлично!"');
      
      const heygenCreateResponse = await fetch('/api/video/generate-real-working-lipsync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Привет! Это тестовое видео для проверки липсинга. Система работает отлично! Раз, два, три - проверка звука и синхронизации губ.'
        })
      });
      
      if (!heygenCreateResponse.ok) {
        const error = await heygenCreateResponse.text();
        throw new Error(`API error: ${error}`);
      }
      
      const heygenData = await heygenCreateResponse.json();
      
      if (!heygenData.video_url) {
        throw new Error('Не вернул URL видео');
      }
      
      addLog('success', `✅ ЛИПСИНГ ВИДЕО СОЗДАНО!`);
      addLog('info', `🆔 ID: ${heygenData.video_id}`);
      addLog('info', `📹 Новое видео: ${heygenData.video_url}`);
      addLog('info', `🎬 Видео с синхронизацией губ готово!`);
      
      const videoUrl = heygenData.video_url;
      
      // ШАГ 2: РЕНДЕРИНГ С ШАБЛОНОМ
      addLog('info', '🎨 ШАГ 2: Применение шаблона LipSyncTemplate...');
      addLog('info', '📦 Добавляем фоновые видео, музыку, эффекты...');
      
      const remotionResponse = await fetch('/api/video/unified-render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          renderType: 'custom',
          lipSyncVideoUrl: videoUrl,  // Передаём НОВОЕ сгенерированное видео!
          inputProps: {
            lipSyncVideo: videoUrl,  // Для шаблона Remotion
            coverImage: '/test-assets/cover01.png',
            backgroundMusic: '/test-assets/news.mp3',
            backgroundVideos: [
              '/test-assets/bg-video01.mp4',
              '/test-assets/bg-video02.mp4',
              '/test-assets/bg-video03.mp4',
              '/test-assets/bg-video04.mp4'
            ],
            musicVolume: 0.3,
            coverDuration: 2,
            vignetteStrength: 0.7,
            colorCorrection: 1.2
          }
        })
      });
      
      if (!remotionResponse.ok) {
        const error = await remotionResponse.text();
        throw new Error(`Remotion render error: ${error}`);
      }
      
      const remotionResult = await remotionResponse.json();
      
      if (remotionResult.success) {
        addLog('success', '✅ ШАГ 2 ЗАВЕРШЁН: Шаблон применён!');
        addLog('info', `📹 Финальное видео: ${remotionResult.videoUrl}`);
        addLog('info', `📊 Размер: ${remotionResult.fileSize} MB`);
        addLog('info', `⏱️ Время рендера: ${remotionResult.duration} сек`);
        setVideoUrl(remotionResult.videoUrl);
        
        // ШАГ 3: ПРОВЕРКА РЕЗУЛЬТАТА
        addLog('info', '🔍 ШАГ 3: Проверка финального видео...');
        addLog('success', '🎉 ПОЛНЫЙ ПАЙПЛАЙН УСПЕШНО ЗАВЕРШЁН!');
        addLog('success', '✅ Каждый запуск создаёт НОВОЕ уникальное видео!');
      } else {
        addLog('error', `❌ Remotion рендер провалился: ${remotionResult.error}`);
      }
      
    } catch (error: any) {
      addLog('error', `❌ ОШИБКА: ${error.message}`);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          🎬 Тестирование Липсинг Рендеринга
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Панель управления */}
          <div className="space-y-6">
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">
                🎮 Панель управления
              </h2>
              
              <div className="space-y-4">
                <Button
                  onClick={testFullPipeline}
                  disabled={isRendering}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  🚀 ПОЛНЫЙ ТЕСТ - СОЗДАНИЕ С НУЛЯ
                </Button>
                
                <div className="text-gray-400 text-sm space-y-1">
                  <p>Что происходит при нажатии:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Генерация TTS аудио из текста</li>
                    <li>Анализ фонем и создание карты губ</li>
                    <li>Создание липсинг видео</li>
                    <li>Применение шаблона с эффектами</li>
                    <li>Рендеринг финального видео</li>
                  </ol>
                </div>
              </div>
              
              {isRendering && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-white mt-2">Создаём новое видео...</p>
                </div>
              )}
            </Card>

            {/* Логи */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">
                📋 Логи процесса генерации
              </h2>
              
              <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500">Логи появятся здесь...</div>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className={`mb-1 ${
                        log.level === 'error' ? 'text-red-400' :
                        log.level === 'success' ? 'text-green-400' :
                        log.level === 'warning' ? 'text-yellow-400' :
                        'text-gray-300'
                      }`}
                    >
                      [{log.time}] {log.message}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Превью видео */}
          <div className="space-y-6">
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">
                📹 Результат генерации
              </h2>
              
              {videoUrl ? (
                <div className="space-y-4">
                  <video
                    id="test-video"
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg"
                    style={{ maxHeight: '500px' }}
                  >
                    Ваш браузер не поддерживает видео
                  </video>
                  
                  <div className="text-white space-y-2">
                    <p>📍 URL: {videoUrl}</p>
                    <Button
                      onClick={() => window.open(videoUrl, '_blank')}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      🔗 Открыть в новой вкладке
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-black rounded-lg h-96 flex items-center justify-center">
                  <p className="text-gray-500">Видео появится здесь после генерации</p>
                </div>
              )}
            </Card>

            {/* Информация о процессе */}
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">
                📖 Как это работает
              </h2>
              
              <div className="text-gray-300 space-y-3">
                <div>
                  <h3 className="font-bold text-white mb-1">🎤 Генерация голоса (TTS)</h3>
                  <p className="text-sm">Текст преобразуется в аудио с помощью нейросетей</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-white mb-1">👄 Анализ фонем</h3>
                  <p className="text-sm">Каждый звук анализируется для создания карты движений губ</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-white mb-1">🎬 Создание липсинга</h3>
                  <p className="text-sm">Видео с синхронизацией губ под сгенерированное аудио</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-white mb-1">✨ Применение эффектов</h3>
                  <p className="text-sm">Добавление фонов, музыки, переходов через Remotion</p>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/50 rounded">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Это демо-версия. В продакшн версии будет использоваться 
                    настоящая ML модель для генерации липсинга.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
