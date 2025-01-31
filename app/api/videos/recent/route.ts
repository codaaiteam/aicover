import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs";

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

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { code: 1, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching recent videos:", error);
      return NextResponse.json(
        { code: 2, message: "Failed to fetch videos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      code: 0, 
      data: data || [] 
    });
  } catch (error) {
    console.error("Unexpected error in recent videos route:", error);
    return NextResponse.json(
      { code: 3, message: "Internal server error" },
      { status: 500 }
    );
  }
}
