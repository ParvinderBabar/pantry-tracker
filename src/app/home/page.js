// app/home/page.js
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.js'; 
import { useRouter } from 'next/navigation';
import { FaHome, FaList, FaUtensils, FaUser, FaStore } from 'react-icons/fa';


const HomePage = () => {
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a reference to the collection
        const q = query(collection(db, 'yourCollectionName'), where('field', '==', 'value'));
        
        // Get the documents
        const querySnapshot = await getDocs(q);
        
        // Process the documents
        const itemsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(itemsArray);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Pantry Tracker!</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <h2 className="text-2xl font-semibold mb-4">In Your Pantry</h2>
        <div>
          <h3 className="text-xl font-semibold mb-2">Items Running Low</h3>
          {/* Display items running low */}
          <ul>
            {items.filter(item => item.status === 'Running Low').map(item => (
              <li key={item.id} className="p-2 border-b border-gray-200">{item.name}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Items Expiring Soon</h3>
          {/* Display items expiring soon */}
          <ul>
            {items.filter(item => item.status === 'Expiring Soon').map(item => (
              <li key={item.id} className="p-2 border-b border-gray-200">{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-around">
        <button onClick={() => router.push('/home')} className="text-gray-600">
          <FaHome size={24} />
        </button>
        <button onClick={() => router.push('./pantry')} className="text-gray-600">
          <FaStore size={24} />
        </button>
        <button onClick={() => router.push('/list')} className="text-gray-600">
          <FaList size={24} />
        </button>
        <button onClick={() => router.push('/recipes')} className="text-gray-600">
          <FaUtensils size={24} />
        </button>
        <button onClick={() => router.push('/profile')} className="text-gray-600">
          <FaUser size={24} />
        </button>
      </nav>
    </div>
  );
};

export default HomePage;
