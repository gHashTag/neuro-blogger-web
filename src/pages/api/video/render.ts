import { NextApiRequest, NextApiResponse } from "next";
import { renderVideoLocally } from "../../../utils/video/local-render";
import { DEV_AUTH_BYPASS } from "../../../utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      composition = "LipSyncTemplate",
      props = {},
      videoId = `video-${Date.now()}`,
    } = req.body;

    console.log("🎬 Starting video render:", { composition, videoId });

    // 🕉️ Dev Authentication Bypass: упрощенная логика рендеринга
    if (DEV_AUTH_BYPASS) {
      console.log("🎭 DEV_AUTH_BYPASS: Using simplified video rendering");
    }

    const result = await renderVideoLocally({
      composition,
      inputProps: props,
      videoId,
    });

    if (result.type === "success") {
      return res.status(200).json({
        success: true,
        videoUrl: result.publicUrl,
        localPath: result.localPath,
        videoId,
      });
    } else {
      throw new Error("Render failed");
    }
  } catch (error) {
    console.error("❌ Video render failed:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}