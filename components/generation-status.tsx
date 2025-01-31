"use client";

import { useGeneration } from "@/contexts/GenerationContext";
import ProgressBar from "./progress-bar";

export default function GenerationStatus() {
  const { state } = useGeneration();
  const { generating, progress, status, error } = state;

  if (!generating) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80 z-50">
      <div className="mb-2 font-medium">视频生成中</div>
      <div className="mb-2">
        <ProgressBar progress={progress} status={status} />
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
    </div>
  );
}
