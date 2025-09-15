import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6e9xkP836yeN3jHvMQbwIul7mw2Vf7UM",
  authDomain: "credora-auth.firebaseapp.com",
  projectId: "credora-auth",
  storageBucket: "credora-auth.firebasestorage.app",
  messagingSenderId: "1060713276855",
  appId: "1:1060713276855:web:6fec078dd017084bd5b432"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export const firebaseAuth = {
  // Sign in with Google using Firebase
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Return user data in the same format as our custom auth
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email!,
          name: user.displayName || user.email!,
          userType: 'tenant'
        },
        firebaseUser: user
      }
    } catch (error) {
      console.error('Firebase Google sign-in error:', error)
      throw error
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      console.error('Firebase sign-out error:', error)
      throw error
    }
  }
}
