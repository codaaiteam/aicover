import { respData, respErr } from "@/lib/resp";
import { Cover } from "@/types/cover";
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
    const { description, negative_prompt } = await req.json();
    if (!description) {
      return respErr("invalid params");
    }

    const user_email = user.emailAddresses[0].emailAddress;

    const user_credits = await getUserCredits(user_email);
    if (!user_credits || user_credits.left_credits < 1) {
      return respErr("credits not enough");
    }

    // Generate video using FAL AI
    console.log("Generating video with prompt:", description);
    const videoUrl = await generateVideo(description, negative_prompt);
    console.log("Video generated:", videoUrl);
    
    // Upload to R2
    const fileName = `${genUuid()}-${encodeURIComponent(description)}`;
    console.log("Uploading to R2 with filename:", fileName);
    const r2Url = await uploadVideoToR2(videoUrl, fileName);
    console.log("Uploaded to R2:", r2Url);

    const created_at = new Date().toISOString();
    const cover: Cover = {
      user_email: user_email,
      img_description: description,
      img_size: "1920x1080", // Default video size
      img_url: r2Url,
      llm_name: "fal-ai/mochi-v1",
      llm_params: JSON.stringify({
        prompt: description,
        negative_prompt: negative_prompt,
        enable_prompt_expansion: true
      }),
      created_at: created_at,
      uuid: genUuid(),
      status: 1,
    };

    await insertCover(cover);

    return respData(cover);
  } catch (e) {
    console.log("gen video failed: ", e);
    return respErr("gen video failed");
  }
}
