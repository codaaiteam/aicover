import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 获取最近的公共视频（例如最近10个）
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({
      code: 0,
      data,
      message: "Success",
    });
  } catch (error) {
    console.error("Failed to fetch public videos:", error);
    return NextResponse.json(
      {
        code: 1,
        message: "Failed to fetch public videos",
      },
      { status: 500 }
    );
  }
}
