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