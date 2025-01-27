import { fal } from "@fal-ai/client";

export const getFalClient = () => {
  fal.config({
    credentials: process.env.FAL_KEY
  });
  return fal;
};

export const generateVideo = async (prompt: string, negative_prompt: string = "") => {
  const client = getFalClient();
  
  const result = await client.subscribe("fal-ai/mochi-v1", {
    input: {
      prompt,
      negative_prompt,
      enable_prompt_expansion: true
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log("Generation progress:", update.logs.map((log) => log.message));
      }
    },
  });

  return result.data.video.url;
};
