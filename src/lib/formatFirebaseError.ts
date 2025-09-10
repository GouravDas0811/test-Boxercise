// lib/formatFirebaseError.ts
export function formatFirebaseError(err: unknown): string {
  if (!err) return "An unexpected error occurred.";

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string"
  ) {
    const code = (err as { code: string; message?: string }).code;
    const message = (err as { message?: string }).message;
    switch (code) {
      case "auth/user-not-found": return "No account found with this email.";
      case "auth/wrong-password": return "Incorrect password.";
      case "auth/invalid-email": return "Please enter a valid email address.";
      case "auth/email-already-in-use": return "Email already in use.";
      case "auth/popup-closed-by-user": return "Sign-in popup was closed.";
      default: return message || "Something went wrong.";
    }
  }

  return (typeof err === "object" && err !== null && "message" in err)
    ? (err as { message?: string }).message ?? String(err)
    : String(err);
}
