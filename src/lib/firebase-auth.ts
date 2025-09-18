// Firebase authentication utilities
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Firebase config - Credora Firebase project
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD6e9xkP836yeN3jHvMQbwIul7mw2Vf7UM',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'credora-auth.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'credora-auth',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'credora-auth.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1060713276855',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1060713276855:web:6fec078dd017084bd5b432'
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