interface GenerateImageOptions {
  prompt: string;
  negative_prompt?: string;
  width: number;
  height: number;
  seed?: number;
  steps?: number;
  style_preset?: string;
}

interface GenerateImageResult {
  success: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

interface FalApiError {
  message: string;
  code?: string;
  status?: number;
}

interface FalApiImage {
  url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  seed: number;
  num_inference_steps: number;
  guidance_scale: number;
  model: string;
  scheduler: string;
}

interface FalApiResponse {
  images: FalApiImage[];
  meta: {
    api_version: string;
    model: string;
    scheduler: string;
  };
}

export class Fal {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.FAL_API_KEY || "";
    this.baseUrl = "https://fal.run/api/v1";
  }

  async generateImage(options: GenerateImageOptions): Promise<GenerateImageResult> {
    try {
      const response = await fetch(`${this.baseUrl}/image/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Key ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt: options.prompt,
          negative_prompt: options.negative_prompt,
          width: options.width,
          height: options.height,
          seed: options.seed,
          steps: options.steps || 30,
          style_preset: options.style_preset,
          model: "stable-diffusion-xl",
          scheduler: "dpmsolver++",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          safety_checker: true,
          image_format: "jpeg",
          quality: 95,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as FalApiError;
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as FalApiResponse;
      
      if (!data.images?.[0]) {
        throw new Error("No image generated");
      }

      return {
        success: true,
        imageUrl: data.images[0].url,
        thumbnailUrl: data.images[0].thumbnail_url,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("FAL API error:", error.message);
        return {
          success: false,
          error: error.message,
        };
      }
      console.error("FAL API error:", error);
      return {
        success: false,
        error: "Failed to generate image",
      };
    }
  }
}
