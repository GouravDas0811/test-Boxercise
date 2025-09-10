// lib/authActions.ts
import { auth } from "../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent! Check your inbox." };
  } catch (error: unknown) {
    console.error("Password reset error:", error);
    let message = "An unknown error occurred.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message };
  }
}
