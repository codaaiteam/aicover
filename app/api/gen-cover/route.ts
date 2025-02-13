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
  try {
    // 1. 检查用户认证
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]) {
      return respErr("no auth");
    }
    const user_email = user.emailAddresses[0].emailAddress;
    console.log("Processing request for user:", user_email);

    // 2. 验证请求内容
    const body = await req.json();
    const { 
      description, 
      negative_prompt, 
      seed, 
      enable_prompt_expansion 
    } = body as GenerateCoverRequest;
    if (!description) {
      return respErr("invalid params: description is required");
    }

    // 3. 生成UUID先
    const uuid = genUuid();

    // 4. 创建视频记录
    const video: Cover = {
      user_email,
      img_description: description,
      img_size: "1024x1024",
      img_url: '',
      llm_name: "fal-ai/mochi-v1",
      llm_params: JSON.stringify({
        model: "fal-ai/mochi-v1",
        prompt: description,
        negative_prompt,
        seed: seed || Math.floor(Math.random() * 1000000),
        enable_prompt_expansion
      }),
      created_at: new Date().toISOString(),
      uuid,
      status: 0
    };

    // 5. 数据库操作 - 使用 supabase 事务
    const { data: userCredits, error: creditsError } = await supabase
      .from('users')
      .select('credits')
      .eq('email', user_email)
      .single();

    if (creditsError) {
      console.error('Failed to get user credits:', creditsError);
      return respErr("Failed to check credits");
    }

    if (!userCredits || userCredits.credits < 1) {
      return respErr("Not enough credits");
    }

    // 6. 执行插入和更新操作
    const { error: insertError } = await supabase
      .from('videos')
      .insert([video]);

    if (insertError) {
      console.error('Failed to insert video record:', insertError);
      return respErr("Failed to create video record");
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: userCredits.credits - 1 })
      .eq('email', user_email);

    if (updateError) {
      console.error('Failed to update credits:', updateError);
      // 回滚 - 删除之前插入的记录
      await supabase.from('videos').delete().eq('uuid', uuid);
      return respErr("Failed to update credits");
    }

    // 7. 开始异步生成
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
          console.error("Generation phase error:", error);
          await supabase
            .from('videos')
            .update({ 
              status: 2,
              error: error instanceof Error ? error.message : 'Unknown error'
            })
            .eq('uuid', uuid);
        }
      })
      .catch(async (error) => {
        console.error("Generation error:", error);
        await supabase
          .from('videos')
          .update({ 
            status: 2,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('uuid', uuid);
      });

    // 8. 立即返回任务ID
    return respData({ uuid, status: 0 });

  } catch (error) {
    console.error("Request error:", error);
    return respErr(error instanceof Error ? error.message : 'Request failed');
  }
}