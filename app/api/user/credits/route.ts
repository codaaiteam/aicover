import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getUserCredits, getUserOrders } from "@/models/order";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    
    console.log('API auth state:', { 
      userId, 
      userEmail: user?.emailAddresses[0]?.emailAddress,
      headers: Object.fromEntries(req.headers.entries())
    });

    if (!userId || !user) {
      return new NextResponse(
        JSON.stringify({ error: "Please sign in to continue" }), 
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
