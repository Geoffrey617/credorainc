// Firebase authentication utilities
export const signInWithEmail = async (email: string, password: string) => {
  // Mock Firebase auth - replace with actual Firebase implementation
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        uid: 'mock-uid',
        email,
        displayName: email.split('@')[0],
      },
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  // Mock Firebase auth - replace with actual Firebase implementation
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        uid: 'mock-uid',
        email,
        displayName: email.split('@')[0],
      },
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
};

export const signOut = async () => {
  // Mock Firebase auth - replace with actual Firebase implementation
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Sign out failed' };
  }
};

export const signInWithGoogle = async () => {
  // Mock Google sign-in - replace with actual Firebase implementation
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        uid: 'google-mock-uid',
        email: 'user@gmail.com',
        displayName: 'Google User',
        photoURL: 'https://via.placeholder.com/150',
        providerId: 'google.com'
      },
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Google sign-in failed',
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