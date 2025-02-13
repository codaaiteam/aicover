export interface GenerationSettings {
  enablePromptEnhancement: boolean;
  negativePrompt: string;
  seed?: number;
  customSeed: boolean;
}

export const defaultSettings: GenerationSettings = {
  enablePromptEnhancement: true,
  negativePrompt: "blurry, low quality, poor resolution, pixelated, low definition, compression artifacts, shaky footage, distorted, noise, grain, unstable, bad lighting, overexposed, underexposed",
  customSeed: false,
};
