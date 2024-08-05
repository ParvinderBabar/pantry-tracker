'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { FaArrowLeft } from 'react-icons/fa';

const ExpiringItemsList = () => {
  const [expiringItems, setExpiringItems] = useState([]);
  const router = useRouter();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      router.push('/auth_login');
      return;
    }

    const fetchExpiringItems = async () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      try {
        const q = query(collection(db, 'items'),
          where('expirationDate', '<=', endOfMonth),
          where('expirationDate', '>=', startOfMonth),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const expiringItemsArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const expirationDate = new Date(data.expirationDate.seconds * 1000);
          return { id: doc.id, ...data, expirationDate };
        });
        setExpiringItems(expiringItemsArray);
      } catch (error) {
        console.error('Error fetching expiring items: ', error);
      }
    };

    fetchExpiringItems();
  }, [userId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <button
        onClick={() => router.push('/home')}
        className="absolute top-4 left-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <FaArrowLeft size={20} />
      </button>
      <h1 className="text-4xl font-bold mb-4 text-orange-600">Expiring Items</h1>
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
        {expiringItems.length > 0 ? (
          expiringItems.map(item => (
            <div key={item.id} className="p-4 bg-blue-200 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p>Expiration Date: {item.expirationDate.toDateString()}</p>
            </div>
          ))
        ) : (
          <p>No items expiring this month.</p>
        )}
      </div>
    </div>
  );
};

export default ExpiringItemsList;
