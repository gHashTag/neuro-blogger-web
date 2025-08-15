import React, { useEffect, useRef, useState } from 'react';

interface LipSyncVisualizerProps {
  audioUrl?: string;
  text?: string;
  isPlaying?: boolean;
  onPhonemeChange?: (phoneme: string) => void;
}

// Фонемы для русского языка
const PHONEME_MOUTH_SHAPES: Record<string, { 
  width: number; 
  height: number; 
  shape: string;
  color?: string;
}> = {
  // Гласные
  'а': { width: 0.8, height: 0.9, shape: 'wide', color: '#FF6B6B' },
  'э': { width: 0.7, height: 0.6, shape: 'wide', color: '#FF7043' },
  'е': { width: 0.6, height: 0.5, shape: 'wide', color: '#FF8A65' },
  'и': { width: 0.4, height: 0.3, shape: 'narrow', color: '#FFAB91' },
  'ы': { width: 0.5, height: 0.4, shape: 'neutral', color: '#FFCCBC' },
  'о': { width: 0.6, height: 0.8, shape: 'round', color: '#FF5252' },
  'у': { width: 0.3, height: 0.7, shape: 'round', color: '#FF1744' },
  'ё': { width: 0.6, height: 0.8, shape: 'round', color: '#FF5252' },
  'ю': { width: 0.4, height: 0.7, shape: 'round', color: '#FF1744' },
  'я': { width: 0.7, height: 0.8, shape: 'wide', color: '#FF6B6B' },
  
  // Согласные
  'б': { width: 0.1, height: 0.1, shape: 'closed', color: '#E91E63' },
  'п': { width: 0.1, height: 0.1, shape: 'closed', color: '#E91E63' },
  'м': { width: 0.2, height: 0.1, shape: 'closed', color: '#F06292' },
  'в': { width: 0.4, height: 0.2, shape: 'teeth', color: '#F48FB1' },
  'ф': { width: 0.4, height: 0.2, shape: 'teeth', color: '#F48FB1' },
  'д': { width: 0.5, height: 0.3, shape: 'teeth', color: '#F8BBD0' },
  'т': { width: 0.5, height: 0.3, shape: 'teeth', color: '#F8BBD0' },
  'н': { width: 0.5, height: 0.4, shape: 'neutral', color: '#FCE4EC' },
  'з': { width: 0.4, height: 0.3, shape: 'teeth', color: '#F48FB1' },
  'с': { width: 0.4, height: 0.3, shape: 'teeth', color: '#F48FB1' },
  'л': { width: 0.5, height: 0.4, shape: 'neutral', color: '#FCE4EC' },
  'р': { width: 0.5, height: 0.5, shape: 'neutral', color: '#FCE4EC' },
  
  // Молчание
  '_': { width: 0.3, height: 0.2, shape: 'neutral', color: '#FFCDD2' }
};

const LipSyncVisualizer: React.FC<LipSyncVisualizerProps> = ({
  audioUrl,
  text = "Привет! Это демонстрация липсинга",
  isPlaying = false,
  onPhonemeChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [currentPhoneme, setCurrentPhoneme] = useState('_');
  const [phonemeSequence, setPhonemeSequence] = useState<Array<{ phoneme: string; duration: number }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeRef = useRef(0);

  // Преобразование текста в фонемы
  const textToPhonemes = (inputText: string) => {
    const result: Array<{ phoneme: string; duration: number }> = [];
    const cleanText = inputText.toLowerCase().replace(/[^а-яёa-z\s]/g, '');
    
    for (const char of cleanText) {
      if (char === ' ') {
        result.push({ phoneme: '_', duration: 150 });
      } else if (PHONEME_MOUTH_SHAPES[char]) {
        const isVowel = 'аэеиыоуёюя'.includes(char);
        result.push({ 
          phoneme: char, 
          duration: isVowel ? 200 : 100 
        });
      }
    }
    
    return result;
  };

  // Рисование рта
  const drawMouth = (ctx: CanvasRenderingContext2D, phoneme: string, progress: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Фон
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
    gradient.addColorStop(0, '#FFF3E0');
    gradient.addColorStop(1, '#FFE0B2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Лицо
    ctx.fillStyle = '#FFCCBC';
    ctx.strokeStyle = '#FFAB91';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Глаза
    ctx.fillStyle = '#424242';
    ctx.beginPath();
    ctx.arc(centerX - 40, centerY - 30, 12, 0, Math.PI * 2);
    ctx.arc(centerX + 40, centerY - 30, 12, 0, Math.PI * 2);
    ctx.fill();

    // Нос
    ctx.strokeStyle = '#FFAB91';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 10);
    ctx.lineTo(centerX - 10, centerY + 10);
    ctx.lineTo(centerX + 10, centerY + 10);
    ctx.stroke();

    // Рот
    const shape = PHONEME_MOUTH_SHAPES[phoneme] || PHONEME_MOUTH_SHAPES['_'];
    const mouthY = centerY + 40;
    const baseWidth = 80;
    const baseHeight = 60;
    
    const width = baseWidth * shape.width * progress;
    const height = baseHeight * shape.height * progress;
    
    ctx.fillStyle = shape.color || '#FF6B6B';
    ctx.strokeStyle = '#D32F2F';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    
    switch (shape.shape) {
      case 'wide':
        ctx.ellipse(centerX, mouthY, width/2, height/2, 0, 0, Math.PI * 2);
        break;
      case 'round':
        ctx.arc(centerX, mouthY, Math.min(width, height)/2, 0, Math.PI * 2);
        break;
      case 'narrow':
        ctx.ellipse(centerX, mouthY, width/2, height/3, 0, 0, Math.PI * 2);
        break;
      case 'closed':
        ctx.moveTo(centerX - width/2, mouthY);
        ctx.lineTo(centerX + width/2, mouthY);
        break;
      case 'teeth':
        ctx.ellipse(centerX, mouthY, width/2, height/3, 0, 0, Math.PI * 2);
        break;
      default:
        ctx.ellipse(centerX, mouthY, width/2, height/2, 0, 0, Math.PI * 2);
    }
    
    if (shape.shape !== 'closed') {
      ctx.fill();
    }
    ctx.stroke();

    // Внутренняя тень для глубины
    if (shape.shape !== 'closed') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(centerX, mouthY + height/4, width/3, height/4, 0, 0, Math.PI);
      ctx.fill();
    }

    // Язык для некоторых звуков
    if (shape.shape === 'wide' || shape.shape === 'neutral') {
      ctx.fillStyle = '#FF8A80';
      ctx.beginPath();
      ctx.ellipse(centerX, mouthY + height/3, width/4, height/5, 0, 0, Math.PI);
      ctx.fill();
    }

    // Текст с фонемой
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Звук: "${phoneme}"`, centerX, 30);
  };

  // Анимация
  const animate = (timestamp: number) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (isPlaying && phonemeSequence.length > 0) {
      const deltaTime = timestamp - timeRef.current;
      
      if (currentIndex < phonemeSequence.length) {
        const currentPhonemeData = phonemeSequence[currentIndex];
        
        if (deltaTime >= currentPhonemeData.duration) {
          setCurrentIndex(prev => prev + 1);
          timeRef.current = timestamp;
          
          if (currentIndex + 1 < phonemeSequence.length) {
            const nextPhoneme = phonemeSequence[currentIndex + 1].phoneme;
            setCurrentPhoneme(nextPhoneme);
            if (onPhonemeChange) {
              onPhonemeChange(nextPhoneme);
            }
          }
        }
        
        const progress = Math.min(deltaTime / currentPhonemeData.duration, 1);
        drawMouth(ctx, currentPhonemeData.phoneme, 0.8 + progress * 0.2);
      } else {
        // Сброс анимации
        setCurrentIndex(0);
        timeRef.current = timestamp;
      }
    } else {
      drawMouth(ctx, currentPhoneme);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Инициализация
  useEffect(() => {
    const sequence = textToPhonemes(text);
    setPhonemeSequence(sequence);
  }, [text]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, phonemeSequence, currentIndex]);

  // Обработка аудио
  useEffect(() => {
    if (audioUrl && canvasRef.current) {
      const audio = new Audio(audioUrl);
      audio.addEventListener('play', () => {
        setCurrentIndex(0);
        timeRef.current = performance.now();
      });
    }
  }, [audioUrl]);

  return (
    <div className="lip-sync-visualizer">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-gray-300 rounded-lg shadow-lg"
      />
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Текст: {text}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Фонем: {phonemeSequence.length} | Текущая: {currentPhoneme}
        </p>
      </div>
    </div>
  );
};

export default LipSyncVisualizer;
