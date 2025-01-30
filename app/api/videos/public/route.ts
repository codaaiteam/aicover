import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    console.log("Fetching public videos...");
    
    // 检查数据库连接
    const { data: healthCheck, error: healthError } = await supabase.from("videos").select("count");
    if (healthError) {
      console.error("Database health check failed:", healthError);
      throw healthError;
    }
    
    // 获取最近的公共视频
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Database query failed:", error);
      throw error;
    }

    console.log("Successfully fetched videos:", data?.length || 0);
    
    return NextResponse.json({
      code: 0,
      data: data || [],
      message: "Success",
    });
  } catch (error: any) {
    console.error("Failed to fetch public videos:", {
      error: error.message,
      details: error.details,
      hint: error.hint
    });
    
    return NextResponse.json(
      {
        code: 1,
        message: "Failed to fetch public videos",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
