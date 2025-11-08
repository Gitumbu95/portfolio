import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      orderNumber,
      total,
      paymentMethod,
      customerName,
      customerEmail,
      items,
    } = body;

    // Validate required fields
    if (!userId || !orderNumber || !total || !items?.length) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Sanity order document
    const orderDoc = {
      _type: "order",
      userId,
      orderNumber,
      total,
      paymentMethod,
      status: "pending",
      customer: {
        name: customerName,
        email: customerEmail,
      },
      items: items.map((item: any) => ({
        _type: "orderItem",
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      orderDate: new Date().toISOString(),
    };

    const createdOrder = await client.create(orderDoc);

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId: createdOrder._id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order", error: String(error) },
      { status: 500 }
    );
  }
}
