/**
 * Formats Firebase error messages into human-readable strings.
 */
export function formatFirebaseError(error: any): string {
  if (!error) return 'An unknown error occurred.';
  
  const errorCode = error.code || '';
  const errorMessage = error.message || '';

  switch (errorCode) {
    // Auth Errors
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in popup was closed before completion.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/requires-recent-login':
      return 'This action requires you to sign in again for security.';
    
    // Firestore Errors
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'unavailable':
      return 'The service is temporarily unavailable. Please try again later.';
    case 'not-found':
      return 'The requested resource was not found.';
    case 'already-exists':
      return 'This resource already exists.';
    
    default:
      // If it's a JSON string from our handleFirestoreError
      if (typeof errorMessage === 'string' && errorMessage.startsWith('{')) {
        try {
          const parsed = JSON.parse(errorMessage);
          if (parsed.error && parsed.error.includes('Missing or insufficient permissions')) {
            return 'Security Error: You do not have permission to access or modify this data.';
          }
          return parsed.error || 'A database error occurred.';
        } catch (e) {
          // Fallback if parsing fails
        }
      }
      
      // Clean up standard Firebase error messages (e.g., "Firebase: Error (auth/...)")
      return errorMessage.replace('Firebase: ', '').replace(/Error \((.*?)\)\.?/, '$1').toUpperCase();
  }
}
