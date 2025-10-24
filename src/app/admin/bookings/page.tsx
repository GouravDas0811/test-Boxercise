"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from "firebase/firestore";
import toast from "react-hot-toast";
import { format } from "date-fns";

/**
 * AdminBookingsPage
 * - Shows all bookings (collection: "bookings")
 * - Allows admin to add/update meetingLink on blur of the input
 *
 * Note: this file lives at app/admin/bookings/page.tsx, so it imports db using "../../../lib/firebase"
 */

type Booking = {
  id: string;
  userEmail?: string;
  userId?: string;
  sessionAt: Date;
  meetingLink?: string | null;
  status: string;
  category?: string;
  plan?: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to bookings collection (ordered by sessionAt desc)
    try {
      const q = query(collection(db, "bookings"), orderBy("sessionAt", "desc"));
      const unsub = onSnapshot(q, (snap) => {
        const arr: Booking[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as Booking;
          // sessionAt might be a Firestore Timestamp, a JS Date or a string; normalize to Date
          let sessionAt = new Date();
          if (data.sessionAt && typeof data.sessionAt === "object" && "toDate" in data.sessionAt && typeof data.sessionAt.toDate === "function") {
            sessionAt = data.sessionAt.toDate();
          } else if (data.sessionAt instanceof Date) {
            sessionAt = data.sessionAt;
          } else {
            try {
              sessionAt = new Date(data.sessionAt);
            } catch {
              sessionAt = new Date();
            }
          }

          arr.push({
            id: docSnap.id,
            userEmail: data.userEmail ?? data.userId ?? undefined,
            userId: data.userId ?? undefined,
            sessionAt,
            meetingLink: data.meetingLink ?? null,
            status: data.status ?? "upcoming",
            category: data.category ?? undefined,
            plan: data.plan ?? undefined,
          });
        });
        setBookings(arr);
        setLoading(false);
      });
      return () => unsub();
    } catch (err) {
      console.error("admin bookings subscribe error:", err);
      setLoading(false);
    }
  }, []);

  const saveLink = async (id: string, link: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), {
        meetingLink: link && link.trim().length > 0 ? link.trim() : null,
        updatedAt: serverTimestampIfAvailable(),
      });
      toast.success("Meeting link updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update link.");
    }
  };

  // helper: use serverTimestamp if firestore has it in scope — we can't import serverTimestamp twice here,
  // so fetch function to attach an approximate marker (optional).
  function serverTimestampIfAvailable() {
    try {
      // dynamic import would be overkill: return undefined so updateDoc doesn't set this field if not available
      // In most projects serverTimestamp is imported from firebase/firestore; if you want it, import at top:
      // import { serverTimestamp } from "firebase/firestore";
      // and return serverTimestamp();
      return undefined;
    } catch {
      return undefined;
    }
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: Manage Bookings</h1>

      {loading ? (
        <div className="bg-gray-800 p-4 rounded">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-800 p-4 rounded">No bookings found.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="font-semibold">{format(b.sessionAt, "PPP p")}</div>
                  <div className="text-xs text-gray-400">User: {b.userEmail ?? b.userId ?? "—"}</div>
                  <div className="text-xs text-gray-400">Category: {b.category ?? "-"}</div>
                  <div className="text-xs text-gray-400">Plan: {b.plan ?? "-"}</div>
                  <div className="text-xs text-gray-400">Status: {b.status}</div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    defaultValue={b.meetingLink ?? ""}
                    placeholder="https://meet.google.com/..."
                    className="px-2 py-1 rounded bg-gray-900 text-white w-full md:w-80"
                    onBlur={(e) => saveLink(b.id, e.target.value)}
                  />
                  <a
                    href={b.meetingLink ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-2 rounded text-sm ${b.meetingLink ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 opacity-60 cursor-not-allowed"}`}
                    onClick={(e) => {
                      if (!b.meetingLink) e.preventDefault();
                    }}
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
