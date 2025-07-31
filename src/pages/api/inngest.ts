// 🔗 Inngest API Integration Endpoint
// Обслуживает Inngest функции через Next.js API

import { serve } from "inngest/next";
import { inngest } from "../../inngest/client";
import { 
  GenerateAIVideoData, 
  RenderVideoWithInngest, 
  CheckRenderStatus,
  CleanupOldVideos 
} from "../../inngest/functions";

// Создаём API endpoint для всех Inngest функций
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    GenerateAIVideoData,
    RenderVideoWithInngest,
    CheckRenderStatus,
    CleanupOldVideos,
  ],
});

// Экспортируем handlers для Next.js Pages Router
export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    return GET(req, res);
  } else if (req.method === "POST") {
    return POST(req, res);
  } else if (req.method === "PUT") {
    return PUT(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}