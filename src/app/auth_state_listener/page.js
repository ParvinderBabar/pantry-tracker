'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation.js';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase'; 


const auth = getAuth();

export default function UserID() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUserId(user.uid);
        setUserName(user.displayName); // Get user's displayName
        console.log("User ID:", user.uid);
        console.log("User Name:", user.displayName);
      } else {
        // User is signed out
        setUserId(null);
        setUserName(null);
        router.push('/auth_login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      {userId ? (
        <div>
          <p>Welcome, {userName || 'User'}! (ID: {userId})</p>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
