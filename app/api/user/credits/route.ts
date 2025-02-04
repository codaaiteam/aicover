import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getUserCredits, getUserOrders } from "@/lib/supabase";
import { dynamic } from "@/app/route-segment-config";

export { dynamic };

export async function GET(req: Request) {
  try {
    const { userId, user } = auth();
    
    console.log('API auth state:', { 
      userId, 
      userEmail: user?.emailAddresses[0]?.emailAddress,
      headers: Object.fromEntries(req.headers.entries())
    });

    if (!userId || !user) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
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
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch user data" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
