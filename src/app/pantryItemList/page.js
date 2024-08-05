'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { FaHome, FaArrowLeft, FaList, FaUtensils, FaUser, FaStore, FaSignOutAlt } from 'react-icons/fa';

const PantryItemsList = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const router = useRouter();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      router.push('/auth_login');
      return;
    }

    const fetchPantryItems = async () => {
      try {
        const q = query(collection(db, 'items'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const pantryItemsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPantryItems(pantryItemsArray);
      } catch (error) {
        console.error('Error fetching pantry items: ', error);
      }
    };

    fetchPantryItems();
  }, [userId, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth_login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100" style={{ backgroundImage: 'url(/bg5.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        <FaSignOutAlt size={20} />
      </button>
      <button
        onClick={() => router.push('/home')}
        className="absolute top-4 left-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <FaArrowLeft size={20} />
      </button>
      <h1 className="text-4xl font-bold mb-4 text-orange-600">Pantry Items</h1>
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
        {pantryItems.length > 0 ? (
          pantryItems.map(item => (
            <div key={item.id} className="p-4 bg-blue-200 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold">{item.name}</h2>
            </div>
          ))
        ) : (
          <p>No items in the pantry.</p>
        )}
      </div>
      <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-around">
        <button onClick={() => router.push("/home")} className="flex items-center">
          <FaHome className="mr-1" /> 
        </button>
        <button onClick={() => router.push("/pantry")} className="flex items-center">
          <FaStore className="mr-1" /> 
        </button>
        <button onClick={() => router.push("/list")} className="flex items-center">
          <FaList className="mr-1" /> 
        </button>
        <button onClick={() => router.push("/recipes")} className="flex items-center">
          <FaUtensils className="mr-1" /> 
        </button>
        <button onClick={() => router.push("/profile")} className="flex items-center">
          <FaUser className="mr-1" /> 
        </button>
      </nav>
    </div>
  );
};

export default PantryItemsList;
