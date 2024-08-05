'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase'; // Adjust the import path as needed
import { doc, setDoc } from 'firebase/firestore';

export default function Dashboard() {
  const router = useRouter();
  const [name, setName] = useState('User'); // Placeholder for user's name
  const [allergies, setAllergies] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      setName(user.displayName || 'User'); // Optionally set name if available
    }
    // else {
    //   console.error('User is not authenticated.');
    //   // Optionally redirect to login page if user is not authenticated
    //   router.push('/auth_login');
    // }
  }, [router]);

  const handleGetStarted = async () => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Save user responses to Firestore
      await setDoc(doc(db, 'users', userId), {
        name,
        allergies,
        dietaryRestrictions,
      }, { merge: true });

      // Navigate to home page
      router.push('/home');
    } catch (error) {
      console.error('Error saving user data: ', error);
    }
  };
   const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      router.push('/auth_login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100" style={{ backgroundImage: 'url(/bg6.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h1 className="text-4xl font-bold mb-4 font-bold text-orange-600">Hi {name}</h1>
      <p className="text-lg  font-semibold text-orange-600">Welcome to the Track Pantry app</p>.
       <p className="text-lg mb-6   text-orange-600"> your smart solution for managing your pantry, groceries, and recipes effortlessly!</p>.
     
              <p>Please let us know a bit about your food preferences:
             </p>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block mb-2 text-lg font-semibold">Do you have any food allergies?</label>
          <select
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select...</option>
            <option value="None">None</option>
            <option value="Peanuts">Peanuts</option>
            <option value="Shellfish">Shellfish</option>
            <option value="Dairy">Dairy</option>
            <option value="Gluten">Gluten</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-lg font-semibold">Do you have any dietary restrictions?</label>
          <select
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select...</option>
            <option value="None">None</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Paleo">Paleo</option>
            <option value="Keto">Keto</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          onClick={handleGetStarted}
          className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
