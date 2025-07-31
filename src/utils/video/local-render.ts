import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface RenderOptions {
  composition: string;
  inputProps: any;
  videoId: string;
}

interface RenderResult {
  type: "success" | "error";
  publicUrl?: string;
  localPath?: string;
  error?: string;
}

export async function renderVideoLocally({
  composition,
  inputProps,
  videoId,
}: RenderOptions): Promise<RenderResult> {
  console.log("🏠 Starting LOCAL Remotion render...");
  console.log("🎯 Composition:", composition);
  console.log("🎯 Video ID:", videoId);
  console.log("🎯 Props:", JSON.stringify(inputProps, null, 2));

  try {
    // Создаем папку для временных видео, если её нет
    const tempDir = path.resolve("public/temp-videos");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log("📁 Created temp directory:", tempDir);
    }

    // Создаем временный файл с пропсами
    const propsFile = path.resolve(`public/temp-videos/${videoId}-props.json`);
    fs.writeFileSync(propsFile, JSON.stringify(inputProps, null, 2));
    console.log("📋 Props file created:", propsFile);

    // Путь к выходному файлу
    const outputLocation = path.resolve(`public/temp-videos/${videoId}.mp4`);
    console.log("📁 Output location:", outputLocation);

    // Используем Remotion CLI для рендера
    const command = `npx remotion render src/remotion/index.tsx ${composition} "${outputLocation}" --props="${propsFile}" --log=info`;

    console.log("🔧 Running command:", command);

    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 300000, // 5 минут таймаут
    });

    if (stderr && !stderr.includes("warn")) {
      console.warn("⚠️ Render warnings:", stderr);
    }

    console.log("📋 Render output:", stdout);

    // Проверяем, что файл создался
    if (!fs.existsSync(outputLocation)) {
      throw new Error("Video file was not created");
    }

    const stats = fs.statSync(outputLocation);
    console.log(`✅ Video created successfully! Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    // Удаляем временный файл с пропсами
    if (fs.existsSync(propsFile)) {
      fs.unlinkSync(propsFile);
      console.log("🗑️ Cleaned up props file");
    }

    return {
      type: "success",
      publicUrl: `/temp-videos/${videoId}.mp4`,
      localPath: outputLocation,
    };
  } catch (error) {
    console.error("❌ Local render failed:", error);

    // Очищаем временные файлы при ошибке
    const propsFile = path.resolve(`public/temp-videos/${videoId}-props.json`);
    if (fs.existsSync(propsFile)) {
      fs.unlinkSync(propsFile);
      console.log("🗑️ Cleaned up props file after error");
    }

    return {
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}