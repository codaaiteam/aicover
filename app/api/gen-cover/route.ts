import { respData, respErr } from "@/lib/resp";
import { Cover, GenerateCoverRequest } from "@/types/cover";
import { currentUser } from "@clerk/nextjs";
import { genUuid } from "@/lib";
import { getUserCredits } from "@/services/order";
import { insertCover } from "@/models/cover";
import { generateVideo } from "@/services/fal";
import { uploadVideoToR2 } from "@/services/r2";
import { supabase } from "@/lib/supabase";

export const maxDuration = 300;

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

    // 积分检查
    const credits = await getUserCredits(user_email);
    console.log("User credits:", credits);

    if (!credits || credits.left_credits < 1) {
      return respErr("credits not enough");
    }

    // 创建待处理的记录
    const uuid = genUuid();
    const video: Cover = {
      user_email,
      img_description: description,
      img_size: "1024x1024",
      img_url: '', // 先为空
      llm_name: "fal-ai/mochi-v1",
      llm_params: JSON.stringify({
        model: "fal-ai/mochi-v1",
        prompt: description,
        negative_prompt,
        seed: Math.floor(Math.random() * 1000000)
      }),
      created_at: new Date().toISOString(),
      uuid,
      status: 0 // 0: pending, 1: success, 2: failed
    };

    // 先插入待处理记录
    await insertCover(video);
    console.log("Pending video record inserted");

    // 扣除积分
    const newCredits = credits.total_credits - 1;
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('email', user_email);

    if (updateError) {
      console.error("Failed to update user credits:", updateError);
      // 如果扣除积分失败，删除记录并返回错误
      await supabase.from('videos').delete().eq('uuid', uuid);
      return respErr("Failed to update credits");
    }

    // 异步开始生成过程
    generateVideo(description, negative_prompt)
      .then(async (videoUrl) => {
        try {
          const fileName = `${uuid}-${encodeURIComponent(description)}.mp4`;
          const r2Url = await uploadVideoToR2(videoUrl, fileName);
          
          await supabase
            .from('videos')
            .update({ 
              status: 1,
              img_url: r2Url 
            })
            .eq('uuid', uuid);
            
          console.log("Video generation completed:", uuid);
        } catch (error) {
          console.error("Failed in upload phase:", error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          await supabase
            .from('videos')
            .update({ 
              status: 2,
              error: errorMessage 
            })
            .eq('uuid', uuid);
        }
      })
      .catch(async (error) => {
        console.error("Failed in generation phase:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        await supabase
          .from('videos')
          .update({ 
            status: 2,
            error: errorMessage 
          })
          .eq('uuid', uuid);
      });

    // 立即返回任务ID
    return respData({ uuid, status: 0 });

  } catch (error) {
    console.error("Failed to process request:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return respErr(`Request failed: ${errorMessage}`);
  }
}