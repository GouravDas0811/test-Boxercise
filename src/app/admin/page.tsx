"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

interface TrialBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  time: string;
  goal: string;
  createdAt: Timestamp;
}

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<TrialBooking[]>([]);
  const [selectedClient, setSelectedClient] = useState<TrialBooking | null>(
    null
  );
  const [notes, setNotes] = useState("");
  const [milestone, setMilestone] = useState("");
  const [plan, setPlan] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, "trialBookings"));
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          name: docData.name,
          email: docData.email,
          phone: docData.phone,
          time: docData.time,
          goal: docData.goal,
          createdAt: docData.createdAt,
        } as TrialBooking;
      });
      setBookings(data);
    };

    fetchBookings();
  }, []);

  const handleSave = async () => {
    if (!selectedClient) return;

    try {
      await setDoc(doc(db, "clients", selectedClient.id), {
        name: selectedClient.name,
        email: selectedClient.email,
        plan,
        notes,
        milestones: milestone,
        updatedAt: Timestamp.now(),
      });

      alert("✅ Client info updated!");
      setSelectedClient(null);
      setPlan("");
      setNotes("");
      setMilestone("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update client");
    }
  };

  return (
    <section className="min-h-screen bg-gray-950 text-white p-20">
      <h1 className="text-3xl font-bold text-red-500 mb-6">
        📋 Trial Bookings
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-800 text-left text-sm uppercase">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Goal</th>
              <th className="px-4 py-2">Booked At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2">{b.name}</td>
                <td className="px-4 py-2">{b.email}</td>
                <td className="px-4 py-2">{b.phone}</td>
                <td className="px-4 py-2">{b.time}</td>
                <td className="px-4 py-2">{b.goal}</td>
                <td className="px-4 py-2 text-sm text-gray-400">
                  {b.createdAt?.toDate().toLocaleString() ?? "—"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedClient(b);
                      setNotes("");
                      setMilestone("");
                      setPlan("");
                    }}
                    className="text-blue-400 underline hover:text-blue-200"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-400">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-lg space-y-4 relative">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              📝 Update Client: {selectedClient.name}
            </h2>

            <input
              type="text"
              placeholder="Membership Plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Milestone (e.g., 5kg loss)"
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />

            <button
              onClick={handleSave}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 transition"
            >
              💾 Save Client Info
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
