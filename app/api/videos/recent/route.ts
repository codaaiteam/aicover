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
      // console.log('No user email found')
      return NextResponse.json(
        { code: 1, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userEmail = user.emailAddresses[0].emailAddress;
    // console.log("Fetching videos for user:", userEmail);

    // 直接查询视频列表
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
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Database query error:", error);
      throw error;
    }


    // 返回成功响应
    return NextResponse.json({
      code: 0,
      data: data || []
    });
  } catch (err) {
    console.error("Error in GET /api/videos/recent:", err);
    return NextResponse.json(
      { 
        code: 1, 
        message: err instanceof Error ? err.message : "Failed to fetch videos" 
      },
      { status: 500 }
    );
  }
}