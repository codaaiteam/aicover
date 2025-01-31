import { respData, respErr } from "@/lib/resp";
import { currentUser } from "@clerk/nextjs";
import { genUuid } from "@/lib";
import { getUserCredits } from "@/services/order";
import { generateVideo } from "@/services/fal";
import { uploadVideoToR2 } from "@/services/r2";

export const maxDuration = 300; // 5 minutes timeout

// Define an interface for the request body
interface GenerateVideoRequest {
  description?: string;
  negative_prompt?: string;
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("no auth");
  }

  try {
    const body = await req.json() as GenerateVideoRequest;
    console.log("Received request body:", body);
    
    const { description, negative_prompt } = body;
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
      r2Url = await uploadVideoToR2(videoUrl, fileName);
      console.log("Video uploaded to R2:", r2Url);
    } catch (error: any) {
      console.error("Failed to upload video:", error);
      return respErr(`Failed to upload video: ${error?.message || 'Unknown error'}`);
    }

    return respData({ 
      video_url: r2Url, 
      description 
    });
  } catch (error: any) {
    console.error("Video generation failed:", error);
    return respErr(`Video generation failed: ${error?.message || 'Unknown error'}`);
  }
}
