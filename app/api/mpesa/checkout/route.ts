import { NextResponse } from "next/server";
import axios from "axios";
import { serverClient } from "@/sanity/lib/serverClient";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, amount, user, cartItems } = body as {
      phone?: string;
      amount?: number;
      user?: UserInfo;
      cartItems?: CartItem[];
    };

    // ✅ Validate input
    if (
      !phone ||
      !amount ||
      !user?.id ||
      !user?.name ||
      !user?.email ||
      !cartItems?.length
    ) {
      console.error("❌ Missing field(s):", { phone, amount, user, cartItems });
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Normalize phone number
    const normalizedPhone = phone.startsWith("254")
      ? phone
      : `254${phone.replace(/^0/, "")}`;

    // ✅ Generate timestamp & password for M-PESA STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // ✅ Get OAuth token from Safaricom
    const tokenRes = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        auth: {
          username: process.env.MPESA_CONSUMER_KEY as string,
          password: process.env.MPESA_CONSUMER_SECRET as string,
        },
      }
    );

    const tokenData = tokenRes.data as { access_token: string };
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error("Failed to obtain M-Pesa access token.");

    // ✅ Send STK Push request
    const stkRes = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: normalizedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: normalizedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: user.name || "ConceptDash Order",
        TransactionDesc: `Payment for order by ${user.name}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const stkData = stkRes.data as Record<string, any>;
    console.log("✅ STK Push Response:", JSON.stringify(stkData, null, 2));

    // ❌ If STK Push failed
    if (stkData.errorCode || !stkData.CheckoutRequestID) {
      console.error("❌ M-PESA STK Push Error:", stkData);
      return NextResponse.json(
        {
          success: false,
          message: stkData.errorMessage || "Failed to initiate STK Push",
        },
        { status: 400 }
      );
    }

    // ✅ Create pending order in Sanity
    const orderNumber = crypto.randomUUID();

    const newOrder = {
      _type: "order",
      orderNumber,
      clerkUserId: user.id,
      customerName: user.name,
      email: user.email,
      stripePaymentIntentId: "mpesa-stk-pending",
      stripeCustomerId: normalizedPhone,
      totalPrice: amount,
      currency: "KES",
      amountDiscount: 0,
      checkoutRequestID: stkData.CheckoutRequestID, // ✅ used in callback
      products: cartItems.map((item) => ({
        _key: crypto.randomUUID(),
        product: { _type: "reference", _ref: item.id },
        quantity: item.quantity,
      })),
      status: "pending",
      orderDate: new Date().toISOString(),
      address: {
        name: user.name,
        city: "Nairobi",
        state: "Kenya",
        zip: "00100",
        address: "N/A",
      },
    };

    console.log("🧾 Creating order in Sanity:", JSON.stringify(newOrder, null, 2));

    const createdOrder = await serverClient.create(newOrder);

    console.log("✅ Order successfully saved in Sanity:", createdOrder._id);

    // ✅ Respond to client
    return NextResponse.json({
      success: true,
      message: "STK Push initiated successfully!",
      checkoutRequestID: stkData.CheckoutRequestID,
      merchantRequestID: stkData.MerchantRequestID,
      orderNumber,
    });
  } catch (error: any) {
    console.error("❌ STK Push / Order Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message:
          error.response?.data?.errorMessage ||
          error.message ||
          "Order saving failed, please retry.",
      },
      { status: 500 }
    );
  }
}
