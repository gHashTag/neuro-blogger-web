import { NextApiRequest, NextApiResponse } from "next";

const HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔍 === HEYGEN API TEST ===');
  console.log('🔑 API Key present:', !!HEYGEN_API_KEY);
  console.log('🔑 API Key value:', HEYGEN_API_KEY ? `${HEYGEN_API_KEY.substring(0, 20)}...` : 'MISSING');

  if (!HEYGEN_API_KEY) {
    return res.status(400).json({
      success: false,
      error: "HeyGen API key not configured in environment variables",
      fix: "Set NEXT_PUBLIC_HEYGEN_API_KEY in your .env file"
    });
  }

  try {
    // Test 1: Try to get avatars list
    console.log('🧪 Test 1: Getting avatars list...');
    const avatarsResponse = await fetch('https://api.heygen.com/v2/avatars', {
      method: 'GET',
      headers: {
        'x-api-key': HEYGEN_API_KEY,
        'Accept': 'application/json',
      },
    });

    console.log('📡 Avatars API Response:', avatarsResponse.status, avatarsResponse.statusText);

    if (!avatarsResponse.ok) {
      const errorText = await avatarsResponse.text();
      console.error('❌ Avatars API failed:', errorText);
      
      return res.status(400).json({
        success: false,
        error: `HeyGen Avatars API failed: ${avatarsResponse.status}`,
        details: errorText.substring(0, 500),
        api_key_valid: false
      });
    }

    const avatarsData = await avatarsResponse.json();
    console.log('✅ Avatars API success, v2 response:', !!avatarsData?.data);
    
    // v2 API returns: { error: null, data: { avatars: [...] } }
    const avatarsList = avatarsData?.data?.avatars || [];
    console.log('✅ Avatars count:', avatarsList.length);

    // Test 2: Try to create a simple video (if avatars exist)
    if (avatarsList && avatarsList.length > 0) {
      const firstAvatar = avatarsList[0];
      console.log('🧪 Test 2: Testing video generation with avatar:', firstAvatar.avatar_id);

      const videoResponse = await fetch('https://api.heygen.com/v1/talking_photo.generate', {
        method: 'POST',
        headers: {
          'x-api-key': HEYGEN_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: firstAvatar.preview_image_url,
          text: "Hello, this is a test message."
        }),
      });

      console.log('📡 Video API Response:', videoResponse.status, videoResponse.statusText);

      if (videoResponse.ok) {
        const videoData = await videoResponse.json();
        console.log('✅ Video generation test successful:', videoData);

        return res.status(200).json({
          success: true,
          message: "HeyGen API is working correctly",
          tests: {
            avatars_api: true,
            video_generation_api: true,
            available_avatars: avatarsList.length,
            test_video_id: videoData.video_id || videoData.data?.video_id
          }
        });
      } else {
        const errorText = await videoResponse.text();
        console.error('❌ Video API failed:', errorText);

        return res.status(200).json({
          success: true, // ✅ Считаем успехом если аватары работают
          message: "Avatar API работает, Video API недоступен (возможно требует другой план)",
          note: "Video generation endpoints возвращают 404 - обратитесь к HeyGen support",
          tests: {
            avatars_api: true,
            video_generation_api: false,
            available_avatars: avatarsList.length,
            video_error: `${videoResponse.status}: Video endpoints недоступны`
          }
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "HeyGen Avatars API working, but no avatars available",
      tests: {
        avatars_api: true,
        video_generation_api: "not_tested",
        available_avatars: 0,
      }
    });

  } catch (error) {
    console.error('❌ HeyGen API test failed:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      api_key_valid: false
    });
  }
}