import { NextResponse } from "next/server";
import { adminDB, adminAuth } from "../../../lib/firebaseAdmin"; // Using your admin file
import { Timestamp } from "firebase-admin/firestore";

/**
 * POST /api/bookings
 * Securely creates a new booking for the authenticated user.
 * Expects a JSON body with: { category: string, planId: string, trainerId: string, sessionAt: string }
 * sessionAt must be a full ISO string (e.g., "2025-11-20T14:00:00Z")
 */
export async function POST(request: Request) {
  // 1. Authenticate the user
  const authorization = request.headers.get("Authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized. No token provided." }, { status: 401 });
  }

  const idToken = authorization.split("Bearer ")[1];
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Unauthorized. Invalid token." }, { status: 401 });
  }

  const userId = decodedToken.uid;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. User ID not found in token." }, { status: 401 });
  }

  // 2. Parse the request body
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  
  const { category, planId, trainerId, sessionAt } = body;

  if (!category || !planId || !trainerId || !sessionAt) {
    return NextResponse.json({ error: "Missing required fields: category, planId, trainerId, sessionAt." }, { status: 400 });
  }

  // Convert the ISO string from the client into a Firebase Timestamp
  let sessionAtTimestamp: Timestamp;
  try {
    sessionAtTimestamp = Timestamp.fromDate(new Date(sessionAt));
  } catch (error) {
    return NextResponse.json({ error: "Invalid sessionAt date format. Must be an ISO string." }, { status: 400 });
  }

  try {
    const bookingsRef = adminDB.collection("bookings");

    // 3. CRITICAL: Check for double bookings
    // This is the check your frontend couldn't do.
    const conflictingBookingQuery = bookingsRef
      .where("trainerId", "==", trainerId)
      .where("sessionAt", "==", sessionAtTimestamp)
      .where("status", "==", "upcoming"); // Only check against *active* upcoming bookings

    const snapshot = await conflictingBookingQuery.get();

    if (!snapshot.empty) {
      // A booking already exists for this trainer at this time!
      console.warn(`Conflict: User ${userId} tried to book trainer ${trainerId} at ${sessionAt}, but it's taken.`);
      return NextResponse.json({ error: "This slot is already booked by another user. Please choose another time." }, { status: 409 }); // 409 Conflict
    }

    // 4. Create the new booking document
    const newBookingDoc = {
      userId,
      trainerId,
      planId,
      category,
      sessionAt: sessionAtTimestamp,
      status: "upcoming",
      createdAt: Timestamp.now(),
      notes: null, // Add other fields as needed
    };

    const docRef = await bookingsRef.add(newBookingDoc);

    console.log(`Success: Booking ${docRef.id} created for user ${userId}.`);

    // 5. Return a successful response
    return NextResponse.json({ id: docRef.id, ...newBookingDoc }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Internal server error. Could not create booking." }, { status: 500 });
  }
}