import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDB } from "../../../../lib/firebaseAdmin";

/**
 * Razorpay webhook handler
 *
 * - Verifies x-razorpay-signature using RAZORPAY_WEBHOOK_SECRET
 * - Handles payment.captured events (idempotent)
 * - Writes to Firestore collections: 'purchases' and updates 'orders' if present
 *
 * Returns JSON only (no HTML) so client won't crash when parsing responses.
 */

type RazorpayWebhookEvent = {
  event?: string;
  payload?: {
    payment?: {
      entity?: Record<string, unknown>;
    };
  };
  [k: string]: unknown;
};

function hmacSha256(secret: string, payload: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text(); // raw body required for signature verification
    const headerSignature = req.headers.get("x-razorpay-signature") ?? "";

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

    if (!webhookSecret) {
      console.error("Razorpay webhook called but RAZORPAY_WEBHOOK_SECRET is not set.");
      // Return 200 so Razorpay doesn't keep retrying; log for operator action.
      return NextResponse.json(
        { ok: false, error: "Webhook secret not configured on server" },
        { status: 500 }
      );
    }

    // Verify signature
    const expected = hmacSha256(webhookSecret, rawBody);
    if (!headerSignature || headerSignature !== expected) {
      console.warn("Invalid webhook signature. expected:", expected, "received:", headerSignature);
      return NextResponse.json({ ok: false, error: "Invalid webhook signature" }, { status: 400 });
    }

    // Parse event
    let event: RazorpayWebhookEvent | null = null;
    try {
      event = rawBody ? (JSON.parse(rawBody) as RazorpayWebhookEvent) : null;
    } catch (err) {
      console.error("Failed to parse webhook JSON:", (err as Error).message);
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    // Only handle payment.captured for now
    if (event?.event === "payment.captured") {
      const payment = event.payload?.payment?.entity ?? null;

      // Basic type-safe extraction
      const paymentId =
        payment && typeof payment["id"] === "string" ? (payment["id"] as string) : null;
      const orderId =
        payment && typeof payment["order_id"] === "string" ? (payment["order_id"] as string) : null;
      const amount =
        payment && (typeof payment["amount"] === "number" || typeof payment["amount"] === "string")
          ? payment["amount"]
          : null;
      const currency = payment && typeof payment["currency"] === "string" ? payment["currency"] : null;

      // Log minimal info
      console.log("Webhook payment.captured:", { paymentId, orderId, amount, currency });

      // If adminDB not initialized, don't fail the webhook (just ack)
      if (!adminDB || typeof adminDB.collection !== "function") {
        console.warn("adminDB not initialized - skipping Firestore writes.");
        // Return 200 OK to webhook sender so they don't retry endlessly.
        return NextResponse.json(
          { ok: true, note: "Webhook verified but server firestore not initialized" },
          { status: 200 }
        );
      }

      // Idempotency: check if this paymentId already exists in purchases
      try {
        if (paymentId) {
          const existing = await adminDB
            .collection("purchases")
            .where("paymentId", "==", paymentId)
            .limit(1)
            .get();

          if (!existing.empty) {
            console.log("Payment already processed (idempotent). Skipping further processing:", paymentId);
            return NextResponse.json({ ok: true, idempotent: true }, { status: 200 });
          }
        }

        // If we have an orderId, try to find a matching order and update it to paid
        if (orderId) {
          const ordersQuery = await adminDB
            .collection("orders")
            .where("razorpayOrderId", "==", orderId)
            .limit(1)
            .get();

          if (!ordersQuery.empty) {
            const orderDoc = ordersQuery.docs[0];
            await orderDoc.ref.update({
              status: "paid",
              paymentId: paymentId ?? null,
              paidAt: new Date(),
              rawPayment: payment,
            });
            console.log("Updated order to paid:", orderDoc.id);
          } else {
            // no order found by razorpayOrderId — optionally try matching by receipt (if you store receipt)
            console.log("No matching order found for razorpayOrderId:", orderId);
          }
        }

        // Add a purchase record
        const purchaseData: Record<string, unknown> = {
          paymentId: paymentId ?? null,
          orderId: orderId ?? null,
          amount: amount ?? null,
          currency: currency ?? null,
          raw: payment,
          createdAt: new Date(),
        };

        await adminDB.collection("purchases").add(purchaseData);
        console.log("Inserted purchase record for payment:", paymentId);
      } catch (err) {
        console.error("Error while handling payment.captured webhook:", (err as Error).message);
        // Still return 200 so Razorpay won't keep retrying; log for operator debugging.
        return NextResponse.json(
          { ok: true, note: "Webhook verified but internal processing failed (logged)" },
          { status: 200 }
        );
      }
    }

    // For all other events, just acknowledge
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Unexpected webhook handler error:", (err as Error).message);
    // Return 500 JSON (Razorpay will retry). You can choose 200 to ack despite errors,
    // but 500 is useful while debugging so Razorpay retries and you can inspect server logs.
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
