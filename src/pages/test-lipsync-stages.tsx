import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Динамический импорт для избежания SSR проблем с canvas
const LipSyncVisualizer = dynamic(
  () => import('../components/LipSyncVisualizer'),
  { ssr: false }
);

interface StageResult {
  stage: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  data?: any;
  timestamp?: string;
}

const TestLipSyncStages: React.FC = () => {
  const [text, setText] = useState("Привет! Это тестовое видео для проверки липсинга. Система работает отлично!");
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stages, setStages] = useState<StageResult[]>([
    { stage: 'Генерация аудио (TTS)', status: 'pending', message: 'Ожидание запуска' },
    { stage: 'Создание липсинг видео', status: 'pending', message: 'Ожидание запуска' },
    { stage: 'Применение шаблона Remotion', status: 'pending', message: 'Ожидание запуска' },
    { stage: 'Финальный рендеринг', status: 'pending', message: 'Ожидание запуска' }
  ]);
  const [lipSyncResult, setLipSyncResult] = useState<any>(null);
  const [finalVideo, setFinalVideo] = useState<string>('');
  const [currentPhoneme, setCurrentPhoneme] = useState('_');
  
  // Обновление статуса этапа
  const updateStage = (index: number, status: StageResult['status'], message: string, data?: any) => {
    setStages(prev => {
      const newStages = [...prev];
      newStages[index] = {
        ...newStages[index],
        status,
        message,
        data,
        timestamp: new Date().toLocaleTimeString()
      };
      return newStages;
    });
  };

  // Запуск полного пайплайна
  const runFullPipeline = async () => {
    setIsRunning(true);
    setStages(stages.map(s => ({ ...s, status: 'pending', message: 'Ожидание запуска', data: undefined })));
    setLipSyncResult(null);
    setFinalVideo('');

    try {
      // Этап 1: Генерация липсинг видео (включает TTS)
      console.log('🎤 Этап 1: Генерация липсинг видео...');
      updateStage(0, 'running', 'Генерация аудио из текста...');
      updateStage(1, 'running', 'Создание видео с синхронизацией губ...');

      const lipSyncResponse = await fetch('/api/video/generate-lipsync-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!lipSyncResponse.ok) {
        const error = await lipSyncResponse.json();
        throw new Error(error.details || 'Ошибка генерации липсинга');
      }

      const lipSyncData = await lipSyncResponse.json();
      console.log('✅ Липсинг видео создано:', lipSyncData);
      
      updateStage(0, 'success', `Аудио сгенерировано (${lipSyncData.duration?.toFixed(2)}с)`, { 
        duration: lipSyncData.duration 
      });
      updateStage(1, 'success', `Видео создано: ${lipSyncData.frames} кадров, ${lipSyncData.phonemes} фонем`, { 
        videoUrl: lipSyncData.videoUrl,
        frames: lipSyncData.frames,
        phonemes: lipSyncData.phonemes
      });
      
      setLipSyncResult(lipSyncData);

      // Этап 2: Применение шаблона Remotion
      console.log('🎨 Этап 2: Применение шаблона...');
      updateStage(2, 'running', 'Применение эффектов и шаблона...');

      const templateResponse = await fetch('/api/video/unified-render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          inputVideoUrl: lipSyncData.videoUrl,
          templateName: 'LipSyncTemplate',
          options: {
            duration: lipSyncData.duration,
            effects: ['background', 'transitions', 'music']
          }
        })
      });

      if (!templateResponse.ok) {
        const error = await templateResponse.json();
        console.warn('⚠️ Шаблон не применен:', error);
        updateStage(2, 'error', 'Ошибка применения шаблона', error);
        // Используем исходное видео если шаблон не применился
        setFinalVideo(lipSyncData.videoUrl);
        updateStage(3, 'success', 'Используется оригинальное видео', { videoUrl: lipSyncData.videoUrl });
      } else {
        const templateData = await templateResponse.json();
        console.log('✅ Шаблон применен:', templateData);
        updateStage(2, 'success', 'Шаблон успешно применен', templateData);

        // Этап 3: Финальный рендеринг
        updateStage(3, 'running', 'Финальный рендеринг видео...');
        
        // Симуляция финального рендеринга
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const finalVideoUrl = templateData.videoUrl || lipSyncData.videoUrl;
        setFinalVideo(finalVideoUrl);
        updateStage(3, 'success', 'Видео готово!', { 
          videoUrl: finalVideoUrl,
          size: templateData.size || 'N/A'
        });
      }

      console.log('🎉 Пайплайн завершен успешно!');

    } catch (error) {
      console.error('❌ Ошибка в пайплайне:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      
      // Отмечаем текущий этап как ошибку
      const runningIndex = stages.findIndex(s => s.status === 'running');
      if (runningIndex !== -1) {
        updateStage(runningIndex, 'error', errorMessage);
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Тестирование только липсинга
  const testLipSyncOnly = async () => {
    setIsRunning(true);
    try {
      console.log('🧪 Тест только липсинга...');
      const response = await fetch('/api/video/generate-lipsync-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: "Тест липсинга" })
      });

      const data = await response.json();
      console.log('Результат теста:', data);
      alert(`Тест липсинга: ${data.success ? 'Успешно' : 'Ошибка'}\n${data.message || data.error}`);
    } catch (error) {
      console.error('Ошибка теста:', error);
      alert('Ошибка теста: ' + (error instanceof Error ? error.message : 'Unknown'));
    } finally {
      setIsRunning(false);
    }
  };

  // Статус бадж
  const StatusBadge: React.FC<{ status: StageResult['status'] }> = ({ status }) => {
    const colors = {
      pending: 'bg-gray-200 text-gray-700',
      running: 'bg-blue-500 text-white animate-pulse',
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white'
    };

    const icons = {
      pending: '⏸️',
      running: '⚙️',
      success: '✅',
      error: '❌'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status]}`}>
        {icons[status]} {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          🎬 Тестирование Липсинг Генератора
        </h1>

        {/* Панель управления */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📝 Настройки</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текст для липсинга:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isRunning}
              placeholder="Введите текст для генерации..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={runFullPipeline}
              disabled={isRunning || !text}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                isRunning || !text
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isRunning ? '⚙️ Выполняется...' : '🚀 Запустить полный пайплайн'}
            </button>

            <button
              onClick={testLipSyncOnly}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              🧪 Тест только липсинга
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 py-3 rounded-lg font-semibold bg-yellow-500 text-white hover:bg-yellow-600"
            >
              {isPlaying ? '⏸️ Пауза' : '▶️ Воспроизвести'} визуализацию
            </button>
          </div>
        </div>

        {/* Визуализатор липсинга */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">👄 Визуализация липсинга</h2>
          <div className="flex justify-center">
            <LipSyncVisualizer 
              text={text}
              isPlaying={isPlaying}
              onPhonemeChange={setCurrentPhoneme}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg">Текущая фонема: <span className="font-bold text-blue-600">{currentPhoneme}</span></p>
          </div>
        </div>

        {/* Этапы выполнения */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📊 Этапы выполнения</h2>
          
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{stage.stage}</h3>
                  <StatusBadge status={stage.status} />
                </div>
                
                <p className="text-gray-600 mb-2">{stage.message}</p>
                
                {stage.timestamp && (
                  <p className="text-xs text-gray-400">Время: {stage.timestamp}</p>
                )}
                
                {stage.data && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(stage.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Результаты */}
        {(lipSyncResult || finalVideo) && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">🎯 Результаты</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Липсинг видео */}
              {lipSyncResult && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Липсинг видео</h3>
                  <video 
                    controls 
                    className="w-full rounded-lg shadow-md"
                    src={lipSyncResult.videoUrl}
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    <p>📹 ID: {lipSyncResult.videoId}</p>
                    <p>⏱️ Длительность: {lipSyncResult.duration?.toFixed(2)}с</p>
                    <p>🎞️ Кадров: {lipSyncResult.frames}</p>
                    <p>🗣️ Фонем: {lipSyncResult.phonemes}</p>
                  </div>
                </div>
              )}

              {/* Финальное видео */}
              {finalVideo && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Финальное видео</h3>
                  <video 
                    controls 
                    className="w-full rounded-lg shadow-md"
                    src={finalVideo}
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    <p>✨ С примененными эффектами</p>
                    <p>📍 Путь: {finalVideo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLipSyncStages;
