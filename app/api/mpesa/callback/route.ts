import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("✅ M-PESA CALLBACK RECEIVED:", JSON.stringify(body, null, 2));

    const callback = body?.Body?.stkCallback;
    if (!callback) {
      console.error("❌ Invalid callback format");
      return NextResponse.json(
        { success: false, message: "Invalid callback format" },
        { status: 400 }
      );
    }

    const resultCode = callback.ResultCode;
    const resultDesc = callback.ResultDesc;
    const checkoutRequestID = callback.CheckoutRequestID;

    // ✅ Extract metadata safely
    const meta = callback.CallbackMetadata?.Item || [];
    const amount =
      meta.find((i: any) => i.Name === "Amount")?.Value || 0;
    const mpesaReceipt =
      meta.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value || "N/A";
    const phoneNumber =
      meta.find((i: any) => i.Name === "PhoneNumber")?.Value?.toString() || "N/A";
    const transactionDate =
      meta.find((i: any) => i.Name === "TransactionDate")?.Value || "";

    console.log("📦 Parsed Callback Data:", {
      resultCode,
      resultDesc,
      amount,
      mpesaReceipt,
      phoneNumber,
      checkoutRequestID,
    });

    // ✅ Locate order via CheckoutRequestID
    const targetOrder = await serverClient.fetch(
      `*[_type == "order" && checkoutRequestID == $id][0]`,
      { id: checkoutRequestID }
    );

    if (!targetOrder) {
      console.error("❌ No matching order found for this callback.");
      return NextResponse.json(
        { success: false, message: "Order not found for this transaction." },
        { status: 404 }
      );
    }

    // ✅ Successful Payment
    if (resultCode === 0) {
      await serverClient
        .patch(targetOrder._id)
        .set({
          status: "paid",
          stripePaymentIntentId: mpesaReceipt,
          stripeCustomerId: phoneNumber,
          orderDate: new Date().toISOString(),
          mpesaDetails: {
            receipt: mpesaReceipt,
            phoneNumber,
            amount,
            transactionDate,
          },
        })
        .commit();

      console.log(`🎉 Order ${targetOrder._id} marked as PAID.`);

      return NextResponse.json({
        success: true,
        message: "✅ Payment confirmed and order marked as PAID.",
        orderId: targetOrder._id,
        receipt: mpesaReceipt,
      });
    }

    // ⚠️ Failed Payment
    console.warn("⚠️ Payment failed or cancelled:", resultDesc);

    await serverClient
      .patch(targetOrder._id)
      .set({
        status: "failed",
        mpesaDetails: {
          statusMessage: resultDesc,
          phoneNumber,
          transactionDate,
        },
      })
      .commit();

    return NextResponse.json({
      success: false,
      message: resultDesc || "Payment failed or cancelled.",
    });
  } catch (error: any) {
    console.error("❌ M-PESA CALLBACK ERROR:", error.response?.data || error.message || error);
    return NextResponse.json(
      { success: false, message: "Server error processing callback." },
      { status: 500 }
    );
  }
}
