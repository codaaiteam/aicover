import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth, currentUser } from "@clerk/nextjs";
import { dynamic } from "@/app/route-segment-config";

export { dynamic };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user?.emailAddresses?.[0]) {
      return NextResponse.json(
        { code: 1, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userEmail = user.emailAddresses[0].emailAddress;
    console.log("User email:", userEmail);
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Attempting to query videos table...");

    // 检查视频状态分布
    const { data: statusData, error: statusError } = await supabase
      .from("videos")
      .select('status, count(*) as count')
      .eq("user_email", userEmail)
      .group('status');

    if (statusError) {
      console.error("Status check failed:", statusError);
    } else {
      console.log("Video status distribution:", statusData);
    }

    // 检查URL为空的视频
    const { data: nullUrlData, error: nullUrlError } = await supabase
      .from("videos")
      .select('status, count(*) as count')
      .eq("user_email", userEmail)
      .is('img_url', null)
      .group('status');

    if (nullUrlError) {
      console.error("Null URL check failed:", nullUrlError);
    } else {
      console.log("Videos with null URL by status:", nullUrlData);
    }

    // 先尝试简单查询
    const { data: simpleData, error: simpleError } = await supabase
      .from("videos")
      .select("*")
      .eq("user_email", userEmail)
      .order('created_at', { ascending: false })
      .limit(1000); // 设置一个较大的限制值确保能获取所有记录

    if (simpleError) {
      console.error("Simple query failed:", simpleError);
      console.error("Error details:", {
        message: simpleError.message,
        details: simpleError.details,
        hint: simpleError.hint
      });
      throw simpleError;
    }

    console.log("Found videos (simple query):", simpleData?.length || 0);

    // 如果简单查询成功，再尝试带用户信息的查询
    const { data, error } = await supabase
      .from("videos")
      .select(`
        id,
        uuid,
        user_email,
        img_description,
        img_size,
        img_url,
        llm_name,
        llm_params,
        status,
        created_at,
        updated_at,
        error
      `)
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Full query failed:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log("Found videos (full query):", data?.length || 0);

    // 如果需要用户信息，单独查询
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, nickname, avatar_url, credits")
      .eq("email", userEmail)
      .single();

    if (userError) {
      console.error("User query failed:", userError);
      console.error("Error details:", {
        message: userError.message,
        details: userError.details,
        hint: userError.hint
      });
    } else {
      console.log("User data:", userData);
    }

    // 组合视频和用户信息
    const videosWithUser = data?.map(video => ({
      ...video,
      user: userData || null,
      error_reason: video.error ? getErrorReason(video.error) : null
    }));

    return NextResponse.json({
      code: 0,
      data: videosWithUser || [],
      message: "Success",
    });

  } catch (error: any) {
    // 详细的错误日志
    console.error("Full error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      stack: error.stack
    });

    return NextResponse.json(
      {
        code: 1,
        message: "Failed to fetch recent videos",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
        details: process.env.NODE_ENV === "development" ? {
          code: error.code,
          details: error.details,
          hint: error.hint
        } : undefined
      },
      { status: 500 }
    );
  }
}

// 添加错误原因解析函数
function getErrorReason(error: string): string {
  if (!error) return '';
  
  // 内容安全相关错误
  if (error.includes('safety') || error.includes('policy') || error.includes('inappropriate')) {
    return 'safety';
  }
  
  // 生成超时
  if (error.includes('timeout')) {
    return 'timeout';
  }
  
  // 重复请求
  if (error.includes('rate') || error.includes('limit')) {
    return 'rateLimit';
  }
  
  // 提示词质量问题
  if (error.includes('prompt') || error.includes('invalid')) {
    return 'invalidPrompt';
  }
  
  return 'unknown';
}