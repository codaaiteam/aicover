import { respData, respErr } from "@/lib/resp";
import { Cover, GenerateCoverRequest } from "@/types/cover";
import { currentUser } from "@clerk/nextjs";
import { genUuid } from "@/lib";
import { getUserCredits } from "@/services/order";
import { insertCover } from "@/models/cover";
import { generateVideo } from "@/services/fal";
import { uploadVideoToR2 } from "@/services/r2";

export const maxDuration = 300; // 5 minutes timeout

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("no auth");
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body);
    
    const { description, negative_prompt } = body as GenerateCoverRequest;
    if (!description) {
      return respErr("invalid params: description is required");
    }

    const user_email = user.emailAddresses[0].emailAddress;
    console.log("User email:", user_email);

    const user_credits = await getUserCredits(user_email);
    console.log("User credits:", user_credits);
    
    if (!user_credits || user_credits.left_credits < 1) {
      return respErr("credits not enough");
    }

    // Generate video using FAL AI
    console.log("Generating video with prompt:", description);
    let videoUrl;
    try {
      videoUrl = await generateVideo(description, negative_prompt);
      console.log("Video generated:", videoUrl);
    } catch (error: any) {
      console.error("Failed to generate video:", error);
      return respErr(`Failed to generate video: ${error?.message || 'Unknown error'}`);
    }
    
    // Upload to R2
    let r2Url;
    try {
      const fileName = `${genUuid()}-${encodeURIComponent(description)}`;
      console.log("Uploading to R2 with filename:", fileName);
      r2Url = await uploadVideoToR2(videoUrl, fileName);
      console.log("Uploaded to R2:", r2Url);
    } catch (error: any) {
      console.error("Failed to upload to R2:", error);
      return respErr(`Failed to upload video: ${error?.message || 'Unknown error'}`);
    }

    const created_at = new Date().toISOString();
    const uuid = genUuid();
    const cover: Cover = {
      user_email: user_email,
      img_description: description,
      img_size: "1920x1080", // Default video size
      img_url: r2Url,
      llm_name: "fal-ai/mochi-v1",
      llm_params: JSON.stringify({
        prompt: description,
        negative_prompt: negative_prompt,
        seed: Math.floor(Math.random() * 1000000)
      }),
      created_at: created_at,
      uuid: uuid,
      status: 1, // 1: success
    };

    try {
      await insertCover(cover);
      console.log("Cover inserted into database");
    } catch (error: any) {
      console.error("Failed to insert cover:", error);
      return respErr(`Failed to save video: ${error?.message || 'Unknown error'}`);
    }

    return respData(cover);
  } catch (error: any) {
    console.error("Failed to process request:", error);
    return respErr(`Request failed: ${error?.message || 'Unknown error'}`);
  }
}
