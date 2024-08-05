'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { FaHome, FaList, FaUtensils, FaUser, FaStore, FaSignOutAlt } from 'react-icons/fa';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [shoppingListCount, setShoppingListCount] = useState(0);
  const [pantryCount, setPantryCount] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [expiringItemsCount, setExpiringItemsCount] = useState(0);
  const router = useRouter();
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get user ID

  useEffect(() => {
    if (!userId) {
      router.push('/auth_login');
      return;
    }

    const fetchItems = async () => {
      try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const startOfMonthString = startOfMonth.toISOString().split('T')[0];
        const endOfMonthString = endOfMonth.toISOString().split('T')[0];

        const q = query(
          collection(db, 'items'),
          where('userId', '==', userId),
          where('expirationDate', '>=', startOfMonthString),
          where('expirationDate', '<=', endOfMonthString)
        );

        const querySnapshot = await getDocs(q);
        const itemsArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const expirationDate = new Date(data.expirationDate.seconds * 1000);
          return { id: doc.id, ...data, expirationDate };
        });

        setItems(itemsArray);
        setExpiringItemsCount(itemsArray.length);
      } catch (error) {
        console.error('Error fetching items: ', error);
      }
    };

    const fetchShoppingLists = async () => {
      try {
        const q = query(collection(db, 'shoppingLists'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const shoppingListsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShoppingLists(shoppingListsArray);

        const totalItemsCount = shoppingListsArray.reduce((acc, list) => acc + (list.items ? list.items.length : 0), 0);
        setShoppingListCount(totalItemsCount);
      } catch (error) {
        console.error('Error fetching shopping lists: ', error);
      }
    };

    const fetchPantryCount = async () => {
      try {
        const q = query(collection(db, 'items'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        setPantryCount(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching pantry count: ', error);
      }
    };

    const fetchRecipes = async () => {
      try {
        const q = query(collection(db, 'recipes'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const recipesArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecipes(recipesArray);
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      }
    };

    fetchItems();
    fetchShoppingLists();
    fetchPantryCount();
    fetchRecipes();
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
      <h1 className="text-4xl font-bold mb-4 text-orange-600">Welcome to Your Pantry Tracker!</h1>
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="p-4 bg-blue-200 rounded-lg shadow-md h-60 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Items Expiring This Month</h2>
          <p className="text-3xl font-bold mt-4">{expiringItemsCount} items</p>
          <ul className="flex-1 overflow-auto">
            {items.length > 0 ? (
              items.map(item => (
                <li key={item.id} className="p-2 border-b border-gray-200">{item.name} - {item.expirationDate.toDateString()}</li>
              ))
            ) : (
              <p>No items expiring this month.</p>
            )}
          </ul>
        </div>
        <div className="p-4 bg-green-200 rounded-lg shadow-md h-60 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Shopping List</h2>
          <p className="text-3xl font-bold mt-4">{shoppingListCount} items</p>
          <ul className="flex-1 overflow-auto">
            {shoppingLists.length > 0 ? (
              shoppingLists.map(list => (
                <li key={list.id} className="p-2 border-b border-gray-200">{list.listName}</li>
              ))
            ) : (
              <p>No shopping lists available.</p>
            )}
          </ul>
        </div>
        <div className="p-4 bg-yellow-200 rounded-lg shadow-md h-60 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Total Pantry Items</h2>
          <p className="text-3xl font-bold mt-4">{pantryCount} items</p>
        </div>
        <div className="p-4 bg-red-200 rounded-lg shadow-md h-60 flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-2">Recipes</h2>
          <ul className="flex-1 overflow-auto">
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <li key={recipe.id} className="p-2 border-b border-gray-200">{recipe.name}</li>
              ))
            ) : (
              <p>No recipes available right now.</p>
            )}
          </ul>
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-around">
        <button onClick={() => router.push("/home")} className="flex items-center">
          <FaHome className="mr-1" /> 
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
        <button onClick={() => router.push("/pantry")} className="flex items-center">
          <FaStore className="mr-1" /> 
        </button>
      </nav>
    </div>
  );
};

export default HomePage;
