
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { format, differenceInCalendarDays } from "date-fns";
import { useSearchParams } from "next/navigation";

import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
  DocumentData,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";

/* ---------- helpers ---------- */
function toDate(
  val: Timestamp | { seconds: number } | Date | string | number | undefined | null
): Date {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if ((val as Timestamp)?.toDate && typeof (val as Timestamp).toDate === "function")
    return (val as Timestamp).toDate();
  if (typeof val === "object" && typeof (val as { seconds?: number }).seconds === "number")
    return new Date((val as { seconds: number }).seconds * 1000);
  if (typeof val === "string" || typeof val === "number") return new Date(val as string | number);
  return new Date();
}

/* ---------- types ---------- */

type UserProfile = {
  uid: string;
  name?: string;
  email?: string;
  photoURL?: string | null;
  plan?: string;
  role?: string;
  createdAt?: Timestamp | { seconds: number } | Date;
  lastLoginAt?: Timestamp | { seconds: number } | Date;
  phone?: string;
  city?: string;
  // Extended profile fields (optional)
  dob?: string; // yyyy-mm-dd
  gender?: "male" | "female" | "other" | string;
  heightCm?: number | null;
  currentWeightKg?: number | null;
  fitnessGoal?: string;
  activityLevel?: string;
  workoutLocation?: string;
  dietPreference?: string;
  foodRestrictions?: string;
  waterIntakeL?: number | null;
  sleepHours?: number | null;
  medicalConditions?: string;
  medications?: string;
  targetWeightKg?: number | null;
};

type Booking = {
  id: string;
  userId: string;
  sessionAt: Timestamp | { seconds: number } | Date | string | number;
  status: "upcoming" | "completed" | "cancelled" | "used";
  createdAt?: Timestamp | { seconds: number } | Date | string | number;
  trainer?: string | null;
  notes?: string | null;
  plan?: string;
  category?: string;
};

type ActivePlanShape = {
  id: string;
  title: string;
  price: number;
  startedAt: Date;
  expiresAt: Date;
  payment?: {
    id?: string | null;
    orderId?: string | null;
    method?: string;
    verified?: boolean;
  };
};

/* ---------- constants ---------- */

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

/* ---------- component ---------- */

export default function UserDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("schedule") !== null ? "schedule" : "profile") as
    | "profile"
    | "schedule"
    | "upcoming"
    | "history";

  const [selectedTab, setSelectedTab] = useState<"profile" | "schedule" | "upcoming" | "history">(
    initialTab
  );

  // Auth & user
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  // Active plan state (read from users/{uid}.activePlan)
  const [activePlan, setActivePlan] = useState<ActivePlanShape | null>(null);

  // Scheduler state

  const [category, setCategory] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [slotLoading, setSlotLoading] = useState(false);

  // Bookings
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [history, setHistory] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Purchases (optional) — we display them in Profile so 'purchases' is used.
  const [purchases, setPurchases] = useState<
    { id: string; planTitle?: string; price?: number; startedAt?: Date; expiresAt?: Date }[]
  >([]);

  /* ========== slots ========== */
  const generateSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    const [sH, sM] = start.split(":").map(Number);
    const [eH, eM] = end.split(":").map(Number);

    const startTime = new Date();
    startTime.setHours(sH, sM, 0, 0);

    const endTime = new Date();
    endTime.setHours(eH < sH ? eH + 24 : eH, eM, 0, 0);

    while (startTime < endTime) {
      slots.push(
        startTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      startTime.setTime(startTime.getTime() + 60 * 60 * 1000);
    }

    return slots;
  };

  const morningSlots = generateSlots("06:00", "12:00");
  const eveningSlots = generateSlots("16:00", "21:00");

  const getToday = (): string => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  /* ========== auth & data listeners ========== */
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/signin");
        return;
      }
      setFirebaseUser(u);
    });
    return () => unsubAuth();
  }, [router]);

  // user doc snapshot: profile + activePlan
  useEffect(() => {
    if (!firebaseUser) return;

    setLoadingProfile(true);
    const userRef = doc(db, "users", firebaseUser.uid);

    const unsub = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          const raw = snap.data() as DocumentData;

          // Build profile object (merge known fields)
          const userProfile: UserProfile = {
            uid: firebaseUser.uid,
            name:
              (raw.profile?.fullName as string) ??
              (raw.name as string) ??
              firebaseUser.displayName ??
              undefined,
            email: (raw.profile?.email as string) ?? (raw.email as string) ?? firebaseUser.email ?? undefined,
            photoURL: (raw.photoURL as string) ?? firebaseUser.photoURL ?? null,
            plan: (raw.activePlan?.title as string) ?? (raw.plan as string) ?? undefined,
            role: (raw.role as string) ?? undefined,
            createdAt: raw.createdAt ?? undefined,
            lastLoginAt: raw.lastLoginAt ?? undefined,
            phone: raw.phone ?? undefined,
            city: raw.city ?? undefined,
            // profile nested fields
            dob: raw.profile?.dob ?? raw.dob ?? undefined,
            gender: raw.profile?.gender ?? undefined,
            heightCm: raw.profile?.heightCm ?? undefined,
            currentWeightKg: raw.profile?.currentWeightKg ?? undefined,
            fitnessGoal: raw.profile?.fitnessGoal ?? undefined,
            activityLevel: raw.profile?.activityLevel ?? undefined,
            workoutLocation: raw.profile?.workoutLocation ?? undefined,
            dietPreference: raw.profile?.dietPreference ?? undefined,
            foodRestrictions: raw.profile?.foodRestrictions ?? undefined,
            waterIntakeL: raw.profile?.waterIntakeL ?? undefined,
            sleepHours: raw.profile?.sleepHours ?? undefined,
            medicalConditions: raw.profile?.medicalConditions ?? undefined,
            medications: raw.profile?.medications ?? undefined,
            targetWeightKg: raw.profile?.targetWeightKg ?? undefined,
          };

          setProfile(userProfile);

          // activePlan: normalize timestamps if present
          if (raw.activePlan) {
            const ap = raw.activePlan as Record<string, unknown>;

            const startedAtRaw = ap.startedAt as
              | Timestamp
              | { seconds: number }
              | Date
              | string
              | undefined;
            const expiresAtRaw = ap.expiresAt as
              | Timestamp
              | { seconds: number }
              | Date
              | string
              | undefined;

            const startedAt = toDate(startedAtRaw);
            const expiresAt = toDate(expiresAtRaw);

            const apRecord = ap as Record<string, unknown>;

            const apShape: ActivePlanShape = {
              id: typeof apRecord.id === "string" ? apRecord.id : String(apRecord.id ?? ""),
              title:
                typeof apRecord.title === "string"
                  ? apRecord.title
                  : typeof apRecord.planTitle === "string"
                  ? apRecord.planTitle
                  : "",
              price:
                typeof apRecord.price === "number"
                  ? apRecord.price
                  : Number(apRecord.price ?? 0),
              startedAt,
              expiresAt,
              payment:
                apRecord.payment && typeof apRecord.payment === "object"
                  ? {
                      id: String((apRecord.payment as Record<string, unknown>).id ?? ""),
                      orderId: String((apRecord.payment as Record<string, unknown>).orderId ?? ""),
                      method: String((apRecord.payment as Record<string, unknown>).method ?? "razorpay"),
                      verified: Boolean((apRecord.payment as Record<string, unknown>).verified ?? false),
                    }
                  : undefined,
            };

            setActivePlan(apShape);
          } else {
            setActivePlan(null);
          }
        } else {
          // no doc exists: fallback minimal profile
          setProfile({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName ?? undefined,
            email: firebaseUser.email ?? undefined,
            photoURL: firebaseUser.photoURL ?? null,
          });
          setActivePlan(null);
        }

        setLoadingProfile(false);
      },
      (err) => {
        console.error("user snapshot error:", err);
        toast.error("Failed to load profile.");
        setLoadingProfile(false);
      }
    );

    return () => unsub();
  }, [firebaseUser]);

  // bookings listener
  useEffect(() => {
    if (!firebaseUser) return;
    setBookingsLoading(true);

    const bookingsCol = collection(db, "bookings");
    const q = query(bookingsCol, where("userId", "==", firebaseUser.uid), orderBy("sessionAt", "asc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const up: Booking[] = [];
        const hist: Booking[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as DocumentData;
          const b: Booking = {
            id: docSnap.id,
            userId: String(data.userId ?? firebaseUser.uid),
            sessionAt: data.sessionAt ?? data.sessionAt,
            status: (data.status as Booking["status"]) ?? "upcoming",
            createdAt: data.createdAt ?? undefined,
            trainer: data.trainer ?? null,
            notes: data.notes ?? null,
            plan: data.plan ?? undefined,
            category: data.category ?? undefined,
          };
          if (b.status === "upcoming") up.push(b);
          else hist.push(b);
        });
        setUpcoming(up);
        setHistory(hist);
        setBookingsLoading(false);
      },
      (err) => {
        console.error("bookings snapshot error:", err);
        toast.error("Failed to load bookings.");
        setBookingsLoading(false);
      }
    );

    return () => unsub();
  }, [firebaseUser]);

  // load purchase history once (optional)
  useEffect(() => {
    if (!firebaseUser) return;
    (async () => {
      try {
        const purchasesQ = query(
          collection(db, "purchases"),
          where("userId", "==", firebaseUser.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(purchasesQ);
        const arr = snap.docs.map((d) => {
          const data = d.data() as DocumentData;
          const startedAt = data.startedAt ? toDate(data.startedAt) : undefined;
          const expiresAt = data.expiresAt ? toDate(data.expiresAt) : undefined;
          return {
            id: d.id,
            planTitle: String(data.planTitle ?? ""),
            price: Number(data.price ?? 0),
            startedAt,
            expiresAt,
          };
        });
        setPurchases(arr);
      } catch (err) {
        console.warn("Failed to load purchases:", err);
      }
    })();
  }, [firebaseUser]);

  /* ---------- helpers ---------- */

  const isSlotBookable = (slot: Date) => {
    const now = new Date();
    if (slot.getTime() <= now.getTime()) return false;
    if (slot.getTime() - now.getTime() < EIGHT_HOURS_MS) return false;
    const conflict = upcoming.find((b) => {
      const bDate = toDate(b.sessionAt);
      return bDate && Math.abs(bDate.getTime() - slot.getTime()) < 45 * 60 * 1000;
    });
    if (conflict) return false;
    return true;
  };

  const handleBooking = async (): Promise<void> => {
    if (!firebaseUser) {
      toast.error("Please sign in to confirm your booking.");
      router.push("/signin");
      return;
    }
    if (!category || !selectedDate || !timeSlot) {
      toast.error("Please complete all selections before booking.");
      return;
    }

    const slotDate = new Date(`${selectedDate} ${timeSlot}`);
    if (!isSlotBookable(slotDate)) {
      toast.error("This slot is not available.");
      return;
    }

    setSlotLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: firebaseUser.uid,
        category,
        sessionAt: slotDate,
        status: "upcoming",
        trainer: null,
        notes: null,
        createdAt: serverTimestamp(),
      });
      toast.success(`🎉 Booking confirmed for ${format(slotDate, "PPP p")}`);
      setSelectedTab("upcoming");
    } catch (err) {
      console.error("booking error:", err);
      toast.error("Booking failed. Try again.");
    } finally {
      setSlotLoading(false);
    }
  };

  const handleCancel = async (b: Booking) => {
    if (!firebaseUser) return;
    const bookingRef = doc(db, "bookings", b.id);
    const sessionDate = toDate(b.sessionAt);
    const now = new Date();
    const diff = sessionDate.getTime() - now.getTime();

    try {
      if (diff >= EIGHT_HOURS_MS) {
        await updateDoc(bookingRef, {
          status: "cancelled",
          lastUpdatedAt: serverTimestamp(),
        });
        toast.success("Booking cancelled.");
      } else {
        await updateDoc(bookingRef, {
          status: "used",
          lastUpdatedAt: serverTimestamp(),
        });
        toast("Too late to cancel — marked as used.", { icon: "⚠️" });
      }
    } catch (err) {
      console.error("cancel error:", err);
      toast.error("Failed to update booking.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out");
      router.push("/");
    } catch {
      toast.error("Sign out failed.");
    }
  };

  /* ---------- Profile form helpers ---------- */

  function setProfileField<K extends keyof UserProfile>(key: K, value: UserProfile[K]): void {
    setProfile((prev) => {
      if (!prev) {
        // create minimal profile object
        return { uid: firebaseUser!.uid, [key]: value } as UserProfile;
      }
      return { ...prev, [key]: value };
    });
  }

  async function handleSaveProfile(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!firebaseUser || !profile) {
      toast.error("Please sign in to save profile.");
      return;
    }
    try {
      // Save under users/{uid}.profile (merge)
      await setDoc(
        doc(db, "users", firebaseUser.uid),
        {
          profile: {
            fullName: profile.name ?? null,
            dob: profile.dob ?? null,
            gender: profile.gender ?? null,
            heightCm: profile.heightCm ?? null,
            currentWeightKg: profile.currentWeightKg ?? null,
            fitnessGoal: profile.fitnessGoal ?? null,
            activityLevel: profile.activityLevel ?? null,
            workoutLocation: profile.workoutLocation ?? null,
            dietPreference: profile.dietPreference ?? null,
            foodRestrictions: profile.foodRestrictions ?? null,
            waterIntakeL: profile.waterIntakeL ?? null,
            sleepHours: profile.sleepHours ?? null,
            medicalConditions: profile.medicalConditions ?? null,
            medications: profile.medications ?? null,
            targetWeightKg: profile.targetWeightKg ?? null,
          },
        },
        { merge: true }
      );
      toast.success("Profile saved.");
    } catch (err) {
      console.error("save profile error:", err);
      toast.error("Failed to save profile. Try again.");
    }
  }

  /* ---------- small subviews ---------- */

  const renderActivePlanBlock = () => {
    if (!activePlan) {
      return (
        <div className="p-4 border rounded-2xl bg-gray-800">
          <h3 className="text-lg font-semibold">No active plan</h3>
          <p className="text-sm text-gray-300">Choose a plan from the Membership page to get started.</p>
        </div>
      );
    }

    const now = new Date();
    const daysLeft = differenceInCalendarDays(activePlan.expiresAt, now);
    const expired = daysLeft < 0;

    return (
      <div className="p-4 border rounded-2xl bg-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">{activePlan.title}</h3>
            <div className="text-sm text-gray-300">Price: ₹{activePlan.price}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Started</div>
            <div className="font-medium">{activePlan.startedAt.toLocaleDateString()}</div>
            <div className="text-xs text-gray-400 mt-2">Expires</div>
            <div className="font-medium">{activePlan.expiresAt.toLocaleDateString()}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className={`text-lg font-semibold ${expired ? "text-red-400" : "text-green-400"}`}>
            {expired ? "Expired" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
          </div>
          <div className="text-xs mt-2 text-gray-300">
            {activePlan.payment?.verified ? "Payment verified" : "Payment not verified"}
          </div>
        </div>
      </div>
    );
  };

  const ProfileView = () => (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 p-6 rounded-2xl shadow-md">
      {/* top: existing small profile summary (unchanged UI) */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
          {profile?.name?.[0] || (profile?.email?.[0] ?? "U").toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{profile?.name || "Anonymous"}</h2>
          <p className="text-sm text-gray-300">{profile?.email}</p>
          <p className="text-sm text-gray-300">Plan: {profile?.plan ?? "free"}</p>
        </div>
        <div className="ml-auto">
          <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded">
            Sign out
          </button>
        </div>
      </div>

      {/* Active plan block below the header */}
      <div className="mt-6">{renderActivePlanBlock()}</div>

      {/* Profile form with requested fields (keeps UI styling minimal and consistent) */}
      <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <div className="text-sm text-gray-300">Full Name</div>
            <input
              value={profile?.name ?? ""}
              onChange={(e) => setProfileField("name", e.target.value || undefined)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
              placeholder="Your full name"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-300">Age / Date of Birth</div>
            <input
              type="date"
              value={profile?.dob ?? ""}
              onChange={(e) => setProfileField("dob", e.target.value || undefined)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <div className="text-sm text-gray-300">Gender</div>
            <select
              value={profile?.gender ?? ""}
              onChange={(e) => setProfileField("gender", (e.target.value as UserProfile["gender"]) || undefined)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            <div className="text-sm text-gray-300">Height (cm)</div>
            <input
              type="number"
              value={profile?.heightCm ?? ""}
              onChange={(e) => setProfileField("heightCm", e.target.value ? Number(e.target.value) : null)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
              min={0}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <div className="text-sm text-gray-300">Current Weight (kg)</div>
            <input
              type="number"
              value={profile?.currentWeightKg ?? ""}
              onChange={(e) => setProfileField("currentWeightKg", e.target.value ? Number(e.target.value) : null)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
              min={0}
            />
          </label>

          <label>
            <div className="text-sm text-gray-300">Goal Weight (kg)</div>
            <input
              type="number"
              value={profile?.targetWeightKg ?? ""}
              onChange={(e) => setProfileField("targetWeightKg", e.target.value ? Number(e.target.value) : null)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
              min={0}
            />
          </label>
        </div>

        <h3 className="text-lg font-semibold mt-4">💪 Goals & Fitness</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <div className="text-sm text-gray-300">Fitness Goal</div>
            <select
              value={profile?.fitnessGoal ?? ""}
              onChange={(e) => setProfileField("fitnessGoal", e.target.value || undefined)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
            >
              <option value="">Select goal</option>
              <option value="fat-loss">Fat loss</option>
              <option value="muscle-gain">Muscle gain</option>
              <option value="general-fitness">General fitness</option>
              <option value="endurance">Endurance</option>
              <option value="sports-performance">Sports performance</option>
            </select>
          </label>

          <label>
            <div className="text-sm text-gray-300">Activity Level</div>
            <select
              value={profile?.activityLevel ?? ""}
              onChange={(e) => setProfileField("activityLevel", e.target.value || undefined)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
            >
              <option value="">Select</option>
              <option value="sedentary">Sedentary</option>
              <option value="lightly-active">Lightly active</option>
              <option value="active">Active</option>
              <option value="very-active">Very active</option>
            </select>
          </label>
        </div>

        <label className="block">
          <div className="text-sm text-gray-300">Preferred Workout Location</div>
          <select
            value={profile?.workoutLocation ?? ""}
            onChange={(e) => setProfileField("workoutLocation", e.target.value || undefined)}
            className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
          >
            <option value="">Select</option>
            <option value="home">Home</option>
            <option value="gym">Gym</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </label>

        <h3 className="text-lg font-semibold mt-4">🍎 Nutrition & Lifestyle</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <div className="text-sm text-gray-300">Diet Preference</div>
            <select
              value={profile?.dietPreference ?? ""}
              onChange={(e) => setProfileField("dietPreference", e.target.value || undefined)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
            >
              <option value="">Select</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-veg</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </label>

          <label>
            <div className="text-sm text-gray-300">Water Intake (litres/day)</div>
            <input
              type="number"
              step="0.1"
              value={profile?.waterIntakeL ?? ""}
              onChange={(e) => setProfileField("waterIntakeL", e.target.value ? Number(e.target.value) : null)}
              className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
              min={0}
            />
          </label>
        </div>

        <label>
          <div className="text-sm text-gray-300">Food Restrictions or Allergies</div>
          <input
            value={profile?.foodRestrictions ?? ""}
            onChange={(e) => setProfileField("foodRestrictions", e.target.value || undefined)}
            className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
            placeholder="e.g. peanuts, lactose, gluten"
          />
        </label>

        <label>
          <div className="text-sm text-gray-300">Sleep Duration per night (hrs)</div>
          <input
            type="number"
            step="0.1"
            value={profile?.sleepHours ?? ""}
            onChange={(e) => setProfileField("sleepHours", e.target.value ? Number(e.target.value) : null)}
            className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
            min={0}
          />
        </label>

        <h3 className="text-lg font-semibold mt-4">❤️ Health & Medical</h3>
        <label>
          <div className="text-sm text-gray-300">Medical Conditions / Past Injuries</div>
          <input
            value={profile?.medicalConditions ?? ""}
            onChange={(e) => setProfileField("medicalConditions", e.target.value || undefined)}
            className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
            placeholder="e.g. diabetes, back pain"
          />
        </label>

        <label>
          <div className="text-sm text-gray-300">Current Medications or Supplements</div>
          <input
            value={profile?.medications ?? ""}
            onChange={(e) => setProfileField("medications", e.target.value || undefined)}
            className="mt-1 w-full rounded px-3 py-2 bg-gray-900 text-white"
            placeholder="e.g. metformin, protein powder"
          />
        </label>

        <div className="flex gap-3 items-center mt-3">
          <button type="submit" className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold">
            Save Profile
          </button>

          <button
            type="button"
            onClick={() => {
              // reload profile doc to reset form values
              if (!firebaseUser) return;
              (async () => {
                setLoadingProfile(true);
                try {
                  const userRef = doc(db, "users", firebaseUser.uid);
                  const snap = await getDoc(userRef);
                  if (snap.exists()) {
                    const raw = snap.data() as DocumentData;
                    const storedProfile = (raw.profile as DocumentData) ?? {};
                    setProfile((prev) => ({
                      ...(prev ?? { uid: firebaseUser.uid }),
                      name: storedProfile.fullName ?? storedProfile.name ?? prev?.name,
                      dob: storedProfile.dob ?? prev?.dob,
                      gender: storedProfile.gender ?? prev?.gender,
                      heightCm: storedProfile.heightCm ?? prev?.heightCm,
                      currentWeightKg: storedProfile.currentWeightKg ?? prev?.currentWeightKg,
                      fitnessGoal: storedProfile.fitnessGoal ?? prev?.fitnessGoal,
                      activityLevel: storedProfile.activityLevel ?? prev?.activityLevel,
                      workoutLocation: storedProfile.workoutLocation ?? prev?.workoutLocation,
                      dietPreference: storedProfile.dietPreference ?? prev?.dietPreference,
                      foodRestrictions: storedProfile.foodRestrictions ?? prev?.foodRestrictions,
                      waterIntakeL: storedProfile.waterIntakeL ?? prev?.waterIntakeL,
                      sleepHours: storedProfile.sleepHours ?? prev?.sleepHours,
                      medicalConditions: storedProfile.medicalConditions ?? prev?.medicalConditions,
                      medications: storedProfile.medications ?? prev?.medications,
                      targetWeightKg: storedProfile.targetWeightKg ?? prev?.targetWeightKg,
                    }));
                    toast.success("Profile reloaded.");
                  } else {
                    toast("No profile saved yet.");
                  }
                } catch (err) {
                  console.error("reload profile error:", err);
                  toast.error("Failed to reload profile.");
                } finally {
                  setLoadingProfile(false);
                }
              })();
            }}
            className="px-3 py-2 rounded bg-gray-700"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Purchase History (uses purchases state so ESLint won't flag it as unused) */}
      <div className="mt-6 bg-gray-800 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold mb-3">Purchase History</h3>
        {purchases.length === 0 ? (
          <p className="text-sm text-gray-300">No purchases found.</p>
        ) : (
          <ul className="space-y-2">
            {purchases.map((p) => (
              <li key={p.id} className="text-sm border-b border-gray-700 pb-2">
                <div className="flex justify-between">
                  <span>{p.planTitle}</span>
                  <span>₹{p.price}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {p.startedAt?.toLocaleDateString() ?? "—"} → {p.expiresAt?.toLocaleDateString() ?? "—"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );

  const ScheduleView = () => (
    <div className="space-y-6">

      {/* Category Selection */}
      <div className="bg-[#111827] rounded-xl p-4 shadow space-y-3">
        <h3 className="text-xl font-semibold mb-2">Select Category</h3>
        {[
          "🥊 Boxing Fitness",
          "💪 Strength and Muscle Building",
          "🧘 Hatha Yoga",
          "🛠️ Posture Correction & Rehab",
          "🤸 Calisthenics & Bodyweight Training",
          "🍽️ Nutrition Coaching",
        ].map((type) => (
          <div
            key={type}
            onClick={() => setCategory(type)}
            className={`cursor-pointer border p-3 rounded-lg ${category === type ? "border-blue-500 bg-gray-800" : "border-gray-700"}`}
          >
            <p className="font-semibold">{type}</p>
          </div>
        ))}
      </div>

      {/* Date & Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] rounded-xl p-4 shadow space-y-3">
          <label htmlFor="date" className="text-xl font-semibold mb-2 block">
            Select Date
          </label>
          <input id="date" type="date" min={getToday()} className="w-full p-3 rounded-md bg-gray-800 text-white" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

        <div className="bg-[#111827] rounded-xl p-4 shadow space-y-3">
          <h3 className="text-xl font-semibold mb-2">Pick a Time Slot</h3>
          <p className="text-sm font-semibold text-gray-400 mb-2">🌅 Morning Shift</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {morningSlots.map((slot) => (
              <button key={slot} onClick={() => setTimeSlot(slot)} className={`py-2 rounded text-sm ${timeSlot === slot ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
                {slot}
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-gray-400 mb-2">🌙 Evening Shift</p>
          <div className="grid grid-cols-4 gap-2">
            {eveningSlots.map((slot) => (
              <button key={slot} onClick={() => setTimeSlot(slot)} className={`py-2 rounded text-sm ${timeSlot === slot ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}>
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary + Confirm */}
      <div className="bg-[#111827] rounded-xl p-4 shadow space-y-3">
        <h3 className="text-xl font-semibold mb-2">Booking Summary</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li><strong>Category:</strong> {category || "Not selected"}</li>
          <li><strong>Date:</strong> {selectedDate || "Not selected"}</li>
          <li><strong>Time:</strong> {timeSlot || "Not selected"}</li>
        </ul>
        <button onClick={handleBooking} disabled={slotLoading} className="w-full py-2 rounded text-white font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 hover:opacity-90 transition">
          {slotLoading ? "Booking..." : "Book Session Now"}
        </button>
      </div>
    </div>
  );

  const UpcomingView = () => (
    <div className="space-y-4">
      {bookingsLoading ? <div className="bg-gray-800 p-4 rounded">Loading bookings...</div> : upcoming.length === 0 ? <div className="bg-gray-800 p-4 rounded">No upcoming bookings.</div> : upcoming.map((b) => {
        const sessionDate = toDate(b.sessionAt);
        return (
          <div key={b.id} className="bg-gray-800 p-4 rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{format(sessionDate, "PPP p")}</div>
              <div className="text-xs text-gray-400">Plan: {b.plan ?? "-"}</div>
              <div className="text-xs text-gray-400">Category: {b.category ?? "-"}</div>
            </div>
            <button onClick={() => handleCancel(b)} className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm">Cancel</button>
          </div>
        );
      })}
    </div>
  );

  const HistoryView = () => (
    <div className="space-y-4">
      {bookingsLoading ? <div className="bg-gray-800 p-4 rounded">Loading history...</div> : history.length === 0 ? <div className="bg-gray-800 p-4 rounded">No past bookings.</div> : history.map((b) => {
        const sessionDate = toDate(b.sessionAt);
        return (
          <div key={b.id} className="bg-gray-800 p-4 rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{format(sessionDate, "PPP p")}</div>
              <div className="text-xs text-gray-400">Status: {b.status}</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loadingProfile) {
    return (
      <main className="min-h-screen bg-[#020817] text-white px-4 md:px-10 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  /* ---------- main render ---------- */
  return (
    <main className="min-h-screen bg-[#020817] text-white px-4 md:px-10 py-20">
      <motion.h1 initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Your Dashboard
      </motion.h1>

      <div className="max-w-6xl mx-auto">
        <div className="flex gap-2 justify-center mb-6">
          <button onClick={() => setSelectedTab("profile")} className={`px-4 py-2 rounded ${selectedTab === "profile" ? "bg-yellow-400 text-black" : "bg-gray-800"}`}>Profile</button>
          <button onClick={() => setSelectedTab("schedule")} className={`px-4 py-2 rounded ${selectedTab === "schedule" ? "bg-yellow-400 text-black" : "bg-gray-800"}`}>Schedule</button>
          <button onClick={() => setSelectedTab("upcoming")} className={`px-4 py-2 rounded ${selectedTab === "upcoming" ? "bg-yellow-400 text-black" : "bg-gray-800"}`}>Upcoming</button>
          <button onClick={() => setSelectedTab("history")} className={`px-4 py-2 rounded ${selectedTab === "history" ? "bg-yellow-400 text-black" : "bg-gray-800"}`}>History</button>
        </div>

        <div className="space-y-6">
          {selectedTab === "profile" && <ProfileView />}
          {selectedTab === "schedule" && <ScheduleView />}
          {selectedTab === "upcoming" && <UpcomingView />}
          {selectedTab === "history" && <HistoryView />}
        </div>
      </div>
    </main>
  );
}

