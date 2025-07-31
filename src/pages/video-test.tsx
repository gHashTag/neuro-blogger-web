import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const VideoTest: React.FC = () => {
  const [isRendering, setIsRendering] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRenderVideo = async () => {
    setIsRendering(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/video/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          composition: "LipSyncTemplate",
          props: {
            lipSyncVideo: "/test-assets/lip-sync.mp4",
            coverImage: "/test-assets/cover01.png",
            backgroundMusic: "/test-assets/news.mp3",
            backgroundVideos: [
              "/test-assets/bg-video01.mp4",
              "/test-assets/bg-video02.mp4",
              "/test-assets/bg-video03.mp4",
              "/test-assets/bg-video04.mp4",
            ],
            coverDuration: 2,
            lipSyncDelay: 2,
            backgroundVideoOpacity: 0.3,
            musicVolume: 0.5,
          },
          videoId: `test-${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Render failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🎬 Video Rendering Test
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Lip-Sync Template Test
          </h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Template Configuration:</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>📸 Cover: cover01.png (2 seconds)</li>
              <li>🎤 Lip-sync: lip-sync.mp4 (starts at 2s)</li>
              <li>🎵 Music: news.mp3 (from start)</li>
              <li>🎬 Background: 4 videos rotating every 2s</li>
              <li>⏱️ Duration: 15 seconds total</li>
            </ul>
          </div>

          <Button
            onClick={handleRenderVideo}
            disabled={isRendering}
            className="w-full"
          >
            {isRendering ? (
              <>
                <Spinner size="sm" />
                <span className="ml-2">Rendering Video...</span>
              </>
            ) : (
              "🚀 Render Test Video"
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              ❌ Render Error
            </h3>
            <pre className="text-sm text-red-700 dark:text-red-300 overflow-auto">
              {error}
            </pre>
          </div>
        )}

        {result && (
          <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-4">
              ✅ Video Rendered Successfully!
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                <strong>Video ID:</strong> {result.videoId}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                <strong>Local Path:</strong> {result.localPath}
              </p>
            </div>

            <video
              controls
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              style={{ aspectRatio: "9/16" }}
            >
              <source src={result.videoUrl} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            🕉️ <strong>Dev Mode:</strong> Using local Remotion rendering with test assets
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoTest;