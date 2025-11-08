import { NextResponse } from "next/server";
import stripe from "@/lib/stripe"; // ✅ your Stripe instance

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { success: false, message: "Missing session_id" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer"],
    });

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    console.error("Stripe session fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
