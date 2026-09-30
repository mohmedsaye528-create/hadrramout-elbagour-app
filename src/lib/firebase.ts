import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAAZ4ElkuAEq9yz8-VhFHU-SYa7cStS2X0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hadrramout-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hadrramout-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hadrramout-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "217376021296",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:217376021296:web:7fca2cbfafea099120c6f5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3E1M1LG66L",
};

const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "";

const app = initializeApp(firebaseConfig);
export const db = firestoreDatabaseId
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const BOOTSTRAPPED_ADMIN_EMAIL = 'mohmedsaye528@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return firebaseSignOut(auth);
}

// Defensive payload sanitizers matching firebase-blueprint.json & firestore.rules
export function clampString(val: string, minLen: number, maxLen: number, fallback = '-'): string {
  const trimmed = (val || '').trim();
  if (trimmed.length < minLen) {
    return fallback.slice(0, maxLen);
  }
  return trimmed.slice(0, maxLen);
}

export function sanitizeId(id: string): string {
  const cleaned = (id || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 120);
  return cleaned || `id_${Date.now()}`;
}

export function isValidPhoneFormat(phone: string): boolean {
  const trimmed = phone.trim();
  return trimmed.length >= 8 && trimmed.length <= 20 && /^[0-9+\-\s()]+$/.test(trimmed);
}
