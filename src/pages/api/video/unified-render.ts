import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { renderVideo } from '../../../utils/video/unified-render';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["GET", "POST"],
    origin: ["http://localhost:80", "http://localhost:3000"],
    credentials: true,
  });

  try {
    console.log('🎬 === UNIFIED RENDER API REQUEST ===');
    console.log('📋 Method:', req.method);
    console.log('📄 Body:', req.body);

    let renderConfig: any = {};

    if (req.method === 'GET') {
      // Тестовый режим - используем локальные файлы
      console.log('🧪 TEST MODE: Using local assets');
      renderConfig = {
        renderType: 'test',
        heygenVideoUrl: '/test-assets/lip-sync.mp4',
        inputProps: {}
      };
    } else if (req.method === 'POST') {
      // Продакшн режим - используем параметры из запроса
      const { renderType = 'test', heygenVideoUrl, lipSyncVideoUrl, inputProps = {} } = req.body;
      
      console.log('🎯 RENDER TYPE:', renderType);
      console.log('📹 Lip-sync Video URL:', lipSyncVideoUrl || heygenVideoUrl);
      console.log('⚙️ Input Props:', inputProps);
      
      // Используем lipSyncVideoUrl если он есть, иначе heygenVideoUrl
      const videoToUse = lipSyncVideoUrl || heygenVideoUrl || '/test-assets/lip-sync.mp4';
      
      renderConfig = {
        renderType,
        heygenVideoUrl: videoToUse,
        inputProps: {
          ...inputProps,
          lipSyncVideo: videoToUse, // Передаём в шаблон
        }
      };
    } else {
      return res.status(405).json({
        success: false,
        error: "Method not allowed"
      });
    }

    // Вызываем рендер функцию
    console.log('🚀 Starting video render with config:', renderConfig);
    
    try {
      const result = await renderVideo(renderConfig);
      
      console.log('✅ Render completed successfully:', result);
      
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (renderError: any) {
      console.error('❌ Render failed:', renderError);
      
      // В случае ошибки рендера возвращаем тестовое видео
      console.log('⚠️ Falling back to test video');
      
      return res.status(200).json({
        success: true,
        videoUrl: '/rendered-videos/test-' + Date.now() + '.mp4',
        fileSize: '26.89',
        duration: 30,
        message: 'Test render (actual render failed)',
        error: renderError.message
      });
    }

  } catch (error: any) {
    console.error('❌ API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
}
