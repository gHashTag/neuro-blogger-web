// 🎭 Avatar Types для HeyGen интеграции

export interface AvatarCreationRequest {
  method: 'text' | 'photo' | 'video';
  name: string;
  description?: string;
  style: 'realistic' | 'animated' | 'stylized';
  
  // Для текстового метода
  prompt?: string;
  
  // Для фото метода
  photos?: File[];
  
  // Для видео метода
  video?: File;
}

export interface AvatarCreationResponse {
  success: boolean;
  avatar?: Avatar;
  error?: string;
  job_id?: string; // Для отслеживания прогресса
}

export interface Avatar {
  id: string;
  avatar_id?: string; // ✅ Добавил для HeyGen API (опционально)
  name: string;
  avatar_name?: string; // ✅ Добавил для HeyGen API
  method?: 'text' | 'photo' | 'video';
  style: 'realistic' | 'animated' | 'stylized' | 'business';
  status?: 'creating' | 'processing' | 'ready' | 'failed';
  
  // ✅ HeyGen API поля
  heygen_avatar_id?: string;
  heygen_voice_id?: string;
  gender?: "male" | "female" | "neutral" | "unknown";
  premium?: boolean;
  preview_image_url?: string;
  preview_video_url?: string;
  default_voice_id?: string | null;
  type?: string | null;
  tags?: string | null;
  
  // Файлы и превью
  thumbnail?: string;
  preview_video?: string;
  training_data?: {
    prompt?: string;
    photos?: string[];
    video?: string;
  };
  
  // Метаданные
  created_at: string;
  updated_at: string;
  user_id: string;
  
  // Для интеграции с Remotion
  remotion_props?: {
    lipSyncVideo: string;
    avatarImageUrl?: string;
    voiceSettings?: {
      voice_id: string;
      stability: number;
      similarity_boost: number;
    };
  };
}

export interface AvatarLook {
  id: string;
  avatar_id: string;
  name: string;
  prompt: string;
  image_url: string;
  heygen_look_id: string;
  created_at: string;
}

export interface AvatarGenerationJob {
  job_id: string;
  avatar_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  stage: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

// HeyGen API Response Types
export interface HeyGenAvatarResponse {
  code: number;
  message: string;
  data?: {
    avatar_id: string;
    status: string;
    avatar_url?: string;
    thumbnail_url?: string;
  };
}

export interface HeyGenVoiceResponse {
  code: number;
  message: string;
  data?: {
    voice_id: string;
    voice_url: string;
    status: string;
  };
}

// Для интеграции с Remotion видео шаблонами
export interface VideoTemplateWithAvatar {
  template_name: string;
  avatar: Avatar;
  custom_props: {
    // Базовые props из шаблона
    backgroundMusic?: string;
    musicVolume?: number;
    backgroundVideos?: string[];
    
    // Avatar-specific props
    lipSyncVideo: string;
    avatarVoiceId?: string;
    avatarStyle?: string;
    
    // Текст и контент
    scriptText?: string;
    coverImage?: string;
    coverDuration?: number;
  };
}

// Типы для управления аватарами в UI
export interface AvatarManagerState {
  avatars: Avatar[];
  selectedAvatar?: Avatar;
  isLoading: boolean;
  error?: string;
}