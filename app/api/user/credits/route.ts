import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getUserCredits, getUserOrders } from "@/lib/supabase";

export const dynamic = 'force-dynamic';  // Explicitly mark as dynamic

export async function GET() {
  try {
    const { userId, user } = auth();

    console.log('API auth state:', { 
      userId, 
      userEmail: user?.emailAddresses[0]?.emailAddress
    });

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const userEmail = user.emailAddresses[0].emailAddress;
    const [credits, orders] = await Promise.all([
      getUserCredits(userEmail),
      getUserOrders(userEmail)
    ]);

    console.log('User data:', { credits, orders });

    return NextResponse.json({ credits, orders });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" }, 
      { status: 500 }
    );
  }
}
