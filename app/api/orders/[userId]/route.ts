import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

interface Context {
  params: { userId: string };
}

export async function GET(
  _req: Request,
  { params }: Context // destructure params here
) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const query = `*[_type == "order" && clerkUserId == $userId] | order(orderDate desc){
      _id,
      orderNumber,
      total,
      status,
      paymentMethod,
      orderDate,
      customerName,
      customerEmail,
      "items": items[] {
        name,
        price,
        quantity,
        "image": image.asset->url
      }
    }`;

    const orders = await client.fetch(query, { userId });

    const normalizedOrders = orders.map((order: any) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      date: order.orderDate,
      customer: {
        name: order.customerName || "Guest",
        email: order.customerEmail || "N/A",
        address: order.customer?.address || "N/A",
      },
      totalAmount: order.total || 0,
      status: order.status || "pending",
      paymentMethod: order.paymentMethod || "mpesa",
      items: order.items?.map((item: any) => ({
        name: item.name,
        image: item.image || "/placeholder.png",
        quantity: item.quantity,
        price: item.price,
      })) || [],
    }));

    return NextResponse.json({ orders: normalizedOrders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
