import { respData, respErr } from "@/lib/resp";
import { Cover, GenerateCoverRequest } from "@/types/cover";
import { currentUser } from "@clerk/nextjs";
import { genUuid } from "@/lib";
import { getUserCredits } from "@/services/order";
import { insertCover } from "@/models/cover";
import { generateVideo } from "@/services/fal";
import { uploadVideoToR2 } from "@/services/r2";
import { supabase } from "@/lib/supabase";

export const maxDuration = 300; // 5 minutes timeout

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]) {
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

    // 获取用户积分信息
    const credits = await getUserCredits(user_email);
    console.log("User credits:", credits);

    if (!credits || credits.left_credits < 1) {
      return respErr("credits not enough");
    }

    // 生成视频
    console.log("Generating video with prompt:", description);
    let videoUrl;
    try {
      videoUrl = await generateVideo(description, negative_prompt);
      console.log("Video generated:", videoUrl);
    } catch (error: any) {
      console.error("Failed to generate video:", error);
      return respErr(`Failed to generate video: ${error?.message || 'Unknown error'}`);
    }

    // 上传到 R2
    let r2Url;
    try {
      const uuid = genUuid();
      const fileName = `${uuid}-${encodeURIComponent(description)}.mp4`;
      console.log("Uploading to R2 with filename:", fileName);
      r2Url = await uploadVideoToR2(videoUrl, fileName);
      console.log("Uploaded to R2:", r2Url);

      const video: Cover = {
        user_email,
        img_description: description,
        img_size: "1024x1024",
        img_url: r2Url,
        llm_name: "fal-ai/mochi-v1",
        llm_params: JSON.stringify({
          model: "fal-ai/mochi-v1",
          prompt: description,
          negative_prompt,
          seed: Math.floor(Math.random() * 1000000)
        }),
        created_at: new Date().toISOString(),
        uuid,
        status: 1
      };

      // 插入视频记录
      await insertCover(video);
      console.log("Video record inserted into database");

      // 更新用户积分
      const newCredits = credits.total_credits - 1;
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('email', user_email);

      if (updateError) {
        console.error("Failed to update user credits:", updateError);
        // 即使更新积分失败，我们仍然返回成功，因为视频已经生成
      }

      return respData(video);

    } catch (error: any) {
      console.error("Failed to process video:", error);
      return respErr(`Failed to process video: ${error?.message || 'Unknown error'}`);
    }

  } catch (error: any) {
    console.error("Failed to process request:", error);
    return respErr(`Request failed: ${error?.message || 'Unknown error'}`);
  }
}