// 🔗 Inngest Client Configuration
// Создаём клиент для отправки и получения событий

import { Inngest } from "inngest";

// Создаём клиент для отправки и получения событий
export const inngest = new Inngest({
  id: "999-web-video-renderer",
  name: "999 Web Video Renderer",
  eventKey: process.env.INNGEST_EVENT_KEY,
  isDev: process.env.NODE_ENV !== "production",
});