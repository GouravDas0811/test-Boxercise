// src/app/api/razorpay/create-order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.warn("Razorpay keys missing in env. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
}

const razorpay = new Razorpay({
  key_id: key_id || "rzp_test_XLtaOHnSOv5yr1",
  key_secret: key_secret || "JsdkI4qW5hXc0xOYkGDy9vGO",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // expected: { amount } in INR (number). We'll convert to paise.
    const amountInINR = Number(body?.amount);
    if (!amountInINR || Number.isNaN(amountInINR) || amountInINR <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const amountPaise = Math.round(amountInINR * 100); // Razorpay expects paise

    const orderOptions = {
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1, // auto-capture
    };

    const order = await razorpay.orders.create(orderOptions);
    // order contains id, amount, currency, etc.
    return NextResponse.json({ ok: true, order });
  } catch (err: unknown) {
    console.error("create-order error:", err);
    return NextResponse.json({ ok: false, error: (err instanceof Error ? err.message : String(err)) }, { status: 500 });
  }
}
