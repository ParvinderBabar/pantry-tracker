'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useRouter } from 'next/navigation';
import { FaHome, FaList, FaUtensils, FaUser, FaStore, FaSignOutAlt } from 'react-icons/fa';
import { getAuth, signOut } from 'firebase/auth';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [shoppingListCount, setShoppingListCount] = useState(0);
  const [pantryCount, setPantryCount] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [expiringItemsCount, setExpiringItemsCount] = useState(0); // New state for expiring items count
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const todayString = today.toISOString().split('T')[0];
        const nextWeekString = nextWeek.toISOString().split('T')[0];

        const q = query(
          collection(db, 'items'),
          where('expirationDate', '>=', todayString),
          where('expirationDate', '<=', nextWeekString)
        );

        const querySnapshot = await getDocs(q);
        const itemsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(itemsArray);

        // Calculate the number of expiring items
        setExpiringItemsCount(itemsArray.length);
      } catch (error) {
        console.error('Error fetching items: ', error);
      }
    };

    const fetchShoppingLists = async () => {
      try {
        const q = query(collection(db, 'shoppingLists'));
        const querySnapshot = await getDocs(q);

        const shoppingListsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShoppingLists(shoppingListsArray);

        // Calculate the total number of items in all shopping lists
        const totalItemsCount = shoppingListsArray.reduce((acc, list) => acc + (list.items ? list.items.length : 0), 0);
        setShoppingListCount(totalItemsCount);
      } catch (error) {
        console.error('Error fetching shopping lists: ', error);
      }
    };

    const fetchPantryCount = async () => {
      try {
        const q = query(collection(db, 'items')); // Assuming pantry items are stored in 'items'
        const querySnapshot = await getDocs(q);
        setPantryCount(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching pantry count: ', error);
      }
    };

    const fetchRecipes = async () => {
      try {
        const q = query(collection(db, 'recipes'));
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
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
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
          <h2 className="text-xl font-semibold mb-2">Items Expiring Soon</h2>
            <p className="text-3xl font-bold mt-4">{expiringItemsCount} items</p>
          <ul className="flex-1 overflow-auto">
            {items.length > 0 ? (
              items.map(item => (
                <li key={item.id} className="p-2 border-b border-gray-200">{item.name} - {item.expirationDate}</li>
              ))
            ) : (
              <p>No items expiring soon.</p>
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
          <h2 className="text-xl font-semibold mb-2">Monthly Budget</h2>
          <ul className="flex-1 overflow-auto">
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <li key={recipe.id} className="p-2 border-b border-gray-200">{recipe.name}</li>
              ))
            ) : (
              <p>No budget available right now.</p>
            )}
          </ul>
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-around">
        <button onClick={() => router.push('/home')} className="text-gray-600">
          <FaHome size={24} />
        </button>
        <button onClick={() => router.push('/pantry')} className="text-gray-600">
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
