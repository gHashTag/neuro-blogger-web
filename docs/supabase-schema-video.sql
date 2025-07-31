-- 🎬 SUPABASE SCHEMA UPDATE: Video Rendering System
-- Добавляем таблицы для пользовательского видео рендеринга

-- 1️⃣ Шаблоны видео (сохраняемые конфигурации пользователей)
CREATE TABLE video_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name TEXT NOT NULL, -- "LipSyncTemplate", "NewsTemplate", etc.
  template_version TEXT DEFAULT '1.0',
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  workspace_id UUID, -- может быть связан с workspace
  
  -- Публичность шаблона
  is_public BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false, -- системный шаблон по умолчанию
  
  -- Конфигурация шаблона (JSON)
  config JSONB NOT NULL, -- Все настройки: цвета, тексты, эффекты, тайминг
  
  -- Метаданные
  title TEXT,
  description TEXT,
  preview_url TEXT, -- Ссылка на превью шаблона
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_video_templates_user_id ON video_templates(user_id);
CREATE INDEX idx_video_templates_workspace_id ON video_templates(workspace_id);
CREATE INDEX idx_video_templates_public ON video_templates(is_public) WHERE is_public = true;

-- 2️⃣ Пользовательские видео (результаты рендеринга)
CREATE TABLE user_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Связи с системой
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  workspace_id UUID,
  room_id TEXT, -- связь с rooms table
  task_id BIGINT, -- связь с tasks
  template_id UUID REFERENCES video_templates(id) ON DELETE SET NULL,
  
  -- Метаданные видео
  video_title TEXT NOT NULL,
  video_description TEXT,
  
  -- Статус рендеринга
  render_status TEXT DEFAULT 'pending' CHECK (render_status IN (
    'pending', 'queued', 'rendering', 'completed', 'failed', 'cancelled'
  )),
  render_progress INTEGER DEFAULT 0 CHECK (render_progress >= 0 AND render_progress <= 100),
  
  -- Параметры рендеринга
  input_props JSONB NOT NULL, -- Все параметры для Remotion
  composition_name TEXT DEFAULT 'LipSyncTemplate',
  
  -- Результаты рендеринга
  output_url TEXT, -- Публичная ссылка на готовое видео
  output_path TEXT, -- Путь в Supabase Storage
  file_size BIGINT, -- Размер файла в байтах
  duration_seconds DECIMAL(10,3), -- Длительность видео
  
  -- Информация об ошибках
  error_message TEXT,
  error_details JSONB,
  
  -- Временные метки
  render_started_at TIMESTAMP WITH TIME ZONE,
  render_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_user_videos_user_id ON user_videos(user_id);
CREATE INDEX idx_user_videos_workspace_id ON user_videos(workspace_id);
CREATE INDEX idx_user_videos_room_id ON user_videos(room_id);
CREATE INDEX idx_user_videos_status ON user_videos(render_status);
CREATE INDEX idx_user_videos_created_at ON user_videos(created_at DESC);

-- 3️⃣ Пользовательские ассеты (загруженные файлы)
CREATE TABLE video_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Владелец
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  workspace_id UUID,
  
  -- Тип и метаданные файла
  asset_type TEXT NOT NULL CHECK (asset_type IN (
    'avatar', 'background', 'music', 'cover', 'voice', 'effect'
  )),
  asset_name TEXT NOT NULL,
  
  -- Файловая информация
  file_path TEXT NOT NULL, -- Путь в Supabase Storage
  file_url TEXT, -- Публичная ссылка (для превью)
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Метаданные медиа
  duration_seconds DECIMAL(10,3), -- Для видео/аудио
  width INTEGER, -- Для изображений/видео
  height INTEGER,
  
  -- Статус и доступность
  is_default BOOLEAN DEFAULT false, -- Системный ассет по умолчанию
  is_processed BOOLEAN DEFAULT false, -- Обработан ли файл
  processing_status TEXT DEFAULT 'uploaded' CHECK (processing_status IN (
    'uploaded', 'processing', 'processed', 'failed'
  )),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для поиска ассетов
CREATE INDEX idx_video_assets_user_id ON video_assets(user_id);
CREATE INDEX idx_video_assets_type ON video_assets(asset_type);
CREATE INDEX idx_video_assets_workspace_id ON video_assets(workspace_id);

-- 4️⃣ Очередь рендеринга (для мониторинга и управления)
CREATE TABLE render_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Связь с видео
  video_id UUID REFERENCES user_videos(id) ON DELETE CASCADE,
  
  -- Информация о задаче
  job_id TEXT UNIQUE, -- ID в Redis/Bull queue
  job_status TEXT DEFAULT 'queued' CHECK (job_status IN (
    'queued', 'active', 'completed', 'failed', 'delayed', 'stuck'
  )),
  
  -- Воркер информация
  worker_id TEXT,
  worker_hostname TEXT,
  
  -- Прогресс и результаты
  progress_data JSONB, -- Детальная информация о прогрессе
  result_data JSONB, -- Результаты выполнения
  error_message TEXT,
  error_stack TEXT,
  
  -- Временные метки
  queued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  
  -- Производительность
  attempt_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для мониторинга очереди
CREATE INDEX idx_render_jobs_video_id ON render_jobs(video_id);
CREATE INDEX idx_render_jobs_status ON render_jobs(job_status);
CREATE INDEX idx_render_jobs_worker ON render_jobs(worker_id);
CREATE INDEX idx_render_jobs_queued_at ON render_jobs(queued_at);

-- 5️⃣ Использование и биллинг
CREATE TABLE user_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Пользователь
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  
  -- Период
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Метрики использования
  videos_rendered INTEGER DEFAULT 0,
  total_render_time INTEGER DEFAULT 0, -- в секундах
  storage_used BIGINT DEFAULT 0, -- в байтах
  api_calls INTEGER DEFAULT 0,
  
  -- Лимиты плана
  plan_name TEXT DEFAULT 'free',
  videos_limit INTEGER DEFAULT 5,
  storage_limit BIGINT DEFAULT 1073741824, -- 1GB в байтах
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Уникальность периода для пользователя
  UNIQUE(user_id, period_start, period_end)
);

-- Индексы для биллинга
CREATE INDEX idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX idx_user_usage_period ON user_usage(period_start, period_end);

-- 🔧 TRIGGERS для автообновления updated_at

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Применяем к таблицам
CREATE TRIGGER update_video_templates_updated_at 
  BEFORE UPDATE ON video_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_videos_updated_at 
  BEFORE UPDATE ON user_videos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_assets_updated_at 
  BEFORE UPDATE ON video_assets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_render_jobs_updated_at 
  BEFORE UPDATE ON render_jobs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_usage_updated_at 
  BEFORE UPDATE ON user_usage 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 📊 INITIAL DATA: Создаем дефолтный шаблон

INSERT INTO video_templates (
  template_name,
  template_version,
  user_id,
  is_public,
  is_default,
  title,
  description,
  config
) VALUES (
  'LipSyncTemplate',
  '1.0',
  NULL, -- системный шаблон
  true,
  true,
  'Lip-Sync Avatar Template',
  'Создавайте персонализированные видео с вашим аватаром, фоновыми роллами, обложкой и музыкой',
  '{
    "lipSyncVideo": "test-assets/lip-sync.mp4",
    "coverImage": "test-assets/cover01.png", 
    "backgroundMusic": "test-assets/news.mp3",
    "musicVolume": 0.5,
    "backgroundVideos": [
      "test-assets/bg-video01.mp4",
      "test-assets/bg-video02.mp4",
      "test-assets/bg-video03.mp4", 
      "test-assets/bg-video04.mp4"
    ],
    "mainText": "НОВАЯ МОДЕЛЬ GEMINI",
    "coverDuration": 2,
    "vignetteStrength": 0.7,
    "colorCorrection": 1.2
  }'::jsonb
);

-- 🔒 RLS (Row Level Security) policies

-- video_templates: пользователи видят только свои + публичные
ALTER TABLE video_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own and public templates" ON video_templates
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert own templates" ON video_templates
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own templates" ON video_templates
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own templates" ON video_templates
  FOR DELETE USING (user_id = auth.uid());

-- user_videos: только свои видео
ALTER TABLE user_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own videos" ON user_videos
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own videos" ON user_videos
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own videos" ON user_videos
  FOR UPDATE USING (user_id = auth.uid());

-- video_assets: только свои ассеты
ALTER TABLE video_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assets" ON video_assets
  FOR SELECT USING (user_id = auth.uid() OR is_default = true);

CREATE POLICY "Users can insert own assets" ON video_assets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assets" ON video_assets
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own assets" ON video_assets
  FOR DELETE USING (user_id = auth.uid());

-- ✅ ГОТОВО! Схема базы данных для видео рендеринга настроена