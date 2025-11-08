import { NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "@/sanity/lib/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover", // ✅ valid API version (adjust if needed)
});

export async function POST(req: Request) {
  try {
    const { groupedItems, metadata } = await req.json();

    if (!groupedItems?.length) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    // ✅ Generate order number
    const orderNumber = metadata.orderNumber || crypto.randomUUID();

    // ✅ Calculate total
    const totalAmount = groupedItems.reduce(
      (sum: number, { product, quantity }: any) => sum + product.price * quantity,
      0
    );

    // ✅ Create a pending order in Sanity
    const sanityOrder = await client.create({
      _type: "order",
      orderNumber,
      clerkUserId: metadata.clerkUserId || "guest",
      customerName: metadata.customerName || "Unknown",
      email: metadata.customerEmail || "unknown@conceptdash254.com",
      totalPrice: totalAmount,
      currency: "KES",
      amountDiscount: 0,
      paymentMethod: "card",
      status: "pending",
      orderDate: new Date().toISOString(),
      products: groupedItems.map(({ product, quantity }: any) => ({
        _key: product._id,
        product: { _type: "reference", _ref: product._id },
        quantity,
      })),
      address: metadata.address,
    });

    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: metadata.customerEmail,
      line_items: groupedItems.map(({ product, quantity }: any) => ({
        price_data: {
          currency: "kes",
          product_data: {
            name: product.name,
            images: [product.images?.[0]?.url || ""],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      })),
      metadata: {
        orderNumber,
        sanityOrderId: sanityOrder._id,
        clerkUserId: metadata.clerkUserId || "guest",
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderNumber=${orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    // ✅ Return checkout URL
    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error("🔥 Stripe Checkout Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
