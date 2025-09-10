// src/app/api/razorpay/verify-order/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDB } from "../../../../lib/firebaseAdmin";

/**
 * Server runtime (ensure Node APIs like Buffer are available)
 */
export const runtime = "nodejs";

/**
 * Helper: compute HMAC-SHA256 (Razorpay signature)
 */
function hmacSha256(secret: string, payload: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * POST handler for verifying Razorpay payment signature.
 * Expects a JSON body with:
 *  - razorpay_order_id
 *  - razorpay_payment_id
 *  - razorpay_signature
 *
 * On successful verification, marks the order as paid in Firestore (if found)
 * or creates a minimal record in `purchases`.
 */
export async function POST(req: Request) {
  try {
    // Read raw body text because signature verification requires exact payload formation
    const raw = await req.text();

    // Try to parse JSON; return 400 if invalid
    let body: Record<string, unknown> = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch  {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const orderId = (body["razorpay_order_id"] ?? body["order_id"] ?? body["orderId"]) as
      | string
      | undefined;
    const paymentId = (body["razorpay_payment_id"] ?? body["payment_id"] ?? body["paymentId"]) as
      | string
      | undefined;
    const signature = (body["razorpay_signature"] ?? body["signature"]) as string | undefined;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature" },
        { status: 400 }
      );
    }

    // Server-side secret (must be set in .env.local or host env)
    const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
    if (!keySecret) {
      console.error("verify-order: RAZORPAY_KEY_SECRET not set");
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
    }

    // Build payload exactly as Razorpay expects
    const payload = `${orderId}|${paymentId}`;
    const expected = hmacSha256(keySecret, payload);

    // Debug logs (remove or reduce in production)
    console.log("verify-order: payload:", payload);
    console.log("verify-order: expected:", expected);
    console.log("verify-order: received:", signature);

    if (expected !== signature) {
      // Do not leak secrets; show only minimal details
      return NextResponse.json(
        { ok: false, error: "Invalid signature", details: { expected, received: signature } },
        { status: 400 }
      );
    }

    // Signature verified — mark in Firestore (if adminDB is available)
    try {
      if (adminDB) {
        // Try to find an existing order document by razorpayOrderId (adjust field name if different)
        const q = await adminDB.collection("orders").where("razorpayOrderId", "==", orderId).limit(1).get();
        if (!q.empty) {
          const doc = q.docs[0];
          await doc.ref.update({
            status: "paid",
            razorpayPaymentId: paymentId,
            paidAt: new Date(),
          });
          console.log(`verify-order: marked order ${doc.id} as paid`);
        } else {
          // If no order doc exists, create a minimal purchase record
          const added = await adminDB.collection("purchases").add({
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            createdAt: new Date(),
            status: "paid",
          });
          console.log(`verify-order: created purchase record ${added.id}`);
        }
      } else {
        console.warn("verify-order: adminDB not available, skipping Firestore write");
      }
    } catch (e) {
      // Firestore failure should not mark verification as failed for the payment itself.
      console.warn("verify-order: firestore write skipped/failed:", (e as Error).message);
    }

    // Success
    return NextResponse.json({ ok: true, verified: true }, { status: 200 });
  } catch (err) {
    console.error("verify-order unexpected:", (err as Error).message);
    return NextResponse.json({ ok: false, error: (err as Error).message ?? "Internal error" }, { status: 500 });
  }
}
