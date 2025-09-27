// Firebase authentication utilities
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Firebase config - Bredora Firebase project
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
};

// Initialize Firebase only on client side
let app: any;
let auth: any;
let googleProvider: any;

if (typeof window !== 'undefined') {
  // Client-side initialization
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export const signInWithEmail = async (email: string, password: string) => {
  if (typeof window === 'undefined' || !auth) {
    return {
      user: null,
      error: 'Firebase not available on server side',
    };
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      },
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Authentication failed',
    };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  if (typeof window === 'undefined' || !auth) {
    return {
      user: null,
      error: 'Firebase not available on server side',
    };
  }
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return {
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      },
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Registration failed',
    };
  }
};

export const signOut = async () => {
  if (typeof window === 'undefined' || !auth) {
    return { error: 'Firebase not available on server side' };
  }
  
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Sign out failed' };
  }
};

export const signInWithGoogle = async () => {
  if (typeof window === 'undefined' || !auth || !googleProvider) {
    return {
      user: null,
      error: 'Firebase not available on server side',
    };
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerId: 'google.com'
      },
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Google sign-in failed',
    };
  }
};

// Firebase auth object for compatibility
export const firebaseAuth = {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut
};