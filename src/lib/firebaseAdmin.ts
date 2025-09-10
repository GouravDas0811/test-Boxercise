// src/lib/firebaseAdmin.ts
import admin, { ServiceAccount } from "firebase-admin";

declare global {
  // allow hot-reload / module re-eval in dev without re-initializing
  var _firebaseAdminApp: admin.app.App | undefined;
}

if (!global._firebaseAdminApp) {
  try {
    /**
     * Priority:
     * 1) Environment vars: FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
     * 2) A single JSON string in FIREBASE_SERVICE_ACCOUNT (legacy)
     * 3) applicationDefault() (GCP / local ADC)
     */

    // read env vars
    const projectIdEnv = process.env.FIREBASE_PROJECT_ID;
    const clientEmailEnv = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKeyEnv = process.env.FIREBASE_PRIVATE_KEY;

    // Normalize: if privateKey contains literal "\n", convert to actual newlines
    if (typeof privateKeyEnv === "string") {
      privateKeyEnv = privateKeyEnv.replace(/\\n/g, "\n");
    }

    // Helper to build a cert containing both underscored and camelCase keys
    const buildCertFromEnv = (proj?: string, client?: string, pkey?: string): ServiceAccount | null => {
      if (!proj || !client || !pkey) return null;
      const cert: unknown = {
        // underscored keys (as present in the downloaded JSON)
        project_id: proj,
        client_email: client,
        private_key: pkey,

        // camelCase keys (what admin SDK also accepts)
        projectId: proj,
        clientEmail: client,
        privateKey: pkey,
      };
      return cert as ServiceAccount;
    };

    let initialized = false;

    const envCert = buildCertFromEnv(projectIdEnv, clientEmailEnv, privateKeyEnv);
    if (envCert) {
      global._firebaseAdminApp = admin.initializeApp({
        credential: admin.credential.cert(envCert),
      });
      console.log("✅ Firebase Admin initialized from discrete env vars");
      initialized = true;
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // FIREBASE_SERVICE_ACCOUNT: JSON string (legacy single env var)
      try {
        const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        const certFromJson = buildCertFromEnv(
          parsed.project_id ?? parsed.projectId,
          parsed.client_email ?? parsed.clientEmail,
          parsed.private_key ?? parsed.privateKey
        );
        if (!certFromJson) throw new Error("FIREBASE_SERVICE_ACCOUNT missing required keys");
        global._firebaseAdminApp = admin.initializeApp({
          credential: admin.credential.cert(certFromJson),
        });
        console.log("✅ Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT JSON");
        initialized = true;
      } catch (e) {
        console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:", (e as Error).message);
        // fall through to applicationDefault
      }
    }

    if (!initialized) {
      // 3) fallback
      global._firebaseAdminApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.log("✅ Firebase Admin initialized with applicationDefault()");
    }
  } catch (err) {
    // Avoid printing secrets in logs
    console.error("❌ Failed to initialize firebase-admin:", (err as Error).message);
  }
}

const app = global._firebaseAdminApp!;
export const adminDB = app.firestore();
export const adminAuth = app.auth();
export default app;
