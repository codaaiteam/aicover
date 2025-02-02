// app/api/videos/status/[uuid]/route.ts
import { respData, respErr } from "@/lib/resp";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs";

export async function GET(
  req: Request, 
  { params }: { params: { uuid: string } }
) {
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]) {
    return respErr("no auth");
  }

  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('uuid', params.uuid)
      .eq('user_email', user.emailAddresses[0].emailAddress)
      .single();

    if (error) throw error;

    return respData({
      status: data.status,
      url: data.img_url,
      error: data.error,
      description: data.img_description
    });
  } catch (error) {
    // 添加错误类型检查
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    return respErr(`Failed to get status: ${errorMessage}`);
  }
}