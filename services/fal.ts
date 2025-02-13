import { fal } from "@fal-ai/client";

export const getFalClient = () => {
  fal.config({
    credentials: process.env.FAL_KEY
  });
  return fal;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> => {
  let timeoutHandle: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms: ${errorMessage}`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle!);
    throw error;
  }
};

export const generateVideo = async (
  prompt: string, 
  negative_prompt: string = "blurry, low quality, poor resolution, pixelated, low definition, compression artifacts, shaky footage, distorted, noise, grain, unstable, bad lighting, overexposed, underexposed",
  seed?: number,
  enable_prompt_expansion?: boolean
) => {
  const client = getFalClient();
  let attempts = 0;
  const maxAttempts = 3;
  const timeoutMs = 300000; // 5 minutes
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Attempt ${attempts + 1} of ${maxAttempts} to generate video`);
      console.log("Prompt:", prompt);
      console.log("Negative prompt:", negative_prompt);
      console.log("Seed:", seed);
      console.log("Enable prompt expansion:", enable_prompt_expansion);
      
      const result = await withTimeout(
        client.subscribe("fal-ai/mochi-v1", {
          input: {
            prompt,
            negative_prompt,
            seed,
            enable_prompt_expansion
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              console.log("Generation progress:", update.logs.map((log) => log.message));
            }
          },
        }),
        timeoutMs,
        "Video generation timed out"
      );

      if (!result.data?.video?.url) {
        throw new Error("No video URL in response");
      }

      return result.data.video.url;
    } catch (error: any) {
      console.error(`Failed attempt ${attempts + 1}:`, error);
      attempts++;
      
      if (attempts === maxAttempts) {
        const errorMessage = error?.message || 'Unknown error';
        throw new Error(`Failed to generate video after ${maxAttempts} attempts: ${errorMessage}`);
      }
      
      // Wait before retrying
      await sleep(2000 * attempts); // Exponential backoff
    }
  }

  throw new Error("Failed to generate video");
};
