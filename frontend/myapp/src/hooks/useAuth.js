import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig'; // Ensure your Firebase config exports `auth`
import { onAuthStateChanged } from 'firebase/auth';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set to true if a user is signed in
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  return { isAuthenticated };
}

export default useAuth;