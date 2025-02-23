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

    // 先尝试简单查询
    const { data: simpleData, error: simpleError } = await supabase
      .from("videos")
      .select("*")
      .eq("user_email", userEmail)
      .eq("status", 1)  // 只返回状态为成功的视频
      .not("img_url", "is", null)  // 确保有URL
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
        updated_at
      `)
      .eq("user_email", userEmail)
      .eq("status", 1)
      .not("img_url", "is", null)
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
      user: userData || null
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