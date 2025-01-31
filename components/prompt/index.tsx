"use client";

import { useAppContext } from "@/contexts/AppContext";
import { useGeneration } from "@/contexts/GenerationContext";
import ProgressBar from "../progress-bar";
import { toast } from "sonner";

export default function PromptInput() {
  const { setCovers } = useAppContext();
  const {
    state: { generating, progress, status, error, prompt },
    setGenerating,
    setProgress,
    setStatus,
    setError,
    setPrompt,
    resetState,
  } = useGeneration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    setProgress(0);
    setStatus("正在初始化...");
    setError("");

    try {
      const response = await fetch("/api/gen-cover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' && errorData !== null && 'message' in errorData 
          ? (errorData as { message: string }).message 
          : "Failed to generate video";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Define an interface for the expected response
      interface VideoGenerationResponse {
        video_url?: string;
        error?: string;
      }

      // Type assert the data to the defined interface
      const typedData = data as VideoGenerationResponse;
      
      if (typedData.video_url) {
        toast.success("视频生成成功");
        // Optionally handle successful video generation
        // For now, just reset the state
        resetState();
      } else {
        throw new Error("No video URL received");
      }
    } catch (err: any) {
      console.error("Video generation error:", err);
      setError(err.message || "视频生成失败");
      toast.error(err.message || "视频生成失败");
      setGenerating(false);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto mt-4 md:mt-16">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="mb-1 h-9 w-full rounded-md border border-solid border-primary px-3 py-6 text-sm text-[#333333] focus:border-primary"
          placeholder="输入要生成的视频描述"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={generating}
        />
        {generating ? (
          <div className="w-full mt-2">
            <ProgressBar progress={progress} />
            <p className="text-center mt-2 text-sm text-gray-600">{status}</p>
            {error && <p className="text-center mt-2 text-sm text-red-600">{error}</p>}
          </div>
        ) : (
          <button
            type="submit"
            className="relative right-0 top-[5px] w-full cursor-pointer rounded-md bg-primary border-primary px-6 py-2 text-center font-semibold text-white sm:absolute sm:right-[5px] sm:w-auto"
            disabled={generating || !prompt.trim()}
          >
            生成视频
          </button>
        )}
      </form>
    </div>
  );
}
