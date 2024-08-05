"use client";
import React, { useState, useEffect } from 'react';
import { db } from "../../config/firebase.js";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { FaHome, FaList, FaUtensils, FaUser, FaStore, FaSignOutAlt } from 'react-icons/fa';

const fetchUserItems = async (userId) => {
  try {
    const q = query(collection(db, 'items'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => doc.data().name);
    return items;
  } catch (error) {
    console.error('Error fetching user items: ', error);
    return [];
  }
};

const fetchRecipes = async (ingredients) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY; // Access the API key from environment variable
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&number=5&apiKey=${apiKey}`
    );
    const data = await response.json();
    console.log('API Response:', data); // Debugging: Check the API response format
    return Array.isArray(data) ? data : []; // Ensure the data is an array
  } catch (error) {
    console.error('Error fetching recipes: ', error);
    return [];
  }
};

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState([]);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserId(currentUser.uid);
    } else {
      router.push('/auth_login');
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const getRecipes = async () => {
      const items = await fetchUserItems(userId);
      if (items.length > 0) {
        const recipesData = await fetchRecipes(items);
        setRecipes(recipesData);
      } else {
        setRecipes([]);
      }
    };

    getRecipes();
  }, [userId]);

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      router.push('/auth_login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/bg5.jpg)' }}>
      <div className="flex-1 p-4 w-full max-w-7xl mx-auto bg-white shadow-lg rounded-lg mt-6 relative">
        <button 
          onClick={handleSignOut} 
          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
        >
          <FaSignOutAlt size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Recipe Suggestions</h2>

        {recipes.length === 0 ? (
          <p className="text-gray-700">No recipes found. Please add some items to your pantry.</p>
        ) : (
          <ul className="space-y-4">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white">
                <h3 className="text-xl font-semibold text-orange-600">{recipe.title}</h3>
                <p className="text-gray-700">Ready in {recipe.readyInMinutes} minutes</p>
                <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Recipe</a>
                <img src={recipe.image} alt={recipe.title} className="mt-2 w-full h-48 object-cover rounded-md" />
                <div className="mt-2">
                  <h4 className="font-semibold text-orange-600">Used Ingredients:</h4>
                  <ul className="flex flex-wrap gap-2">
                    {recipe.usedIngredients?.map(ingredient => (
                      <li key={ingredient.id} className="flex items-center mt-1 bg-gray-100 p-2 rounded-md">
                        <img src={ingredient.image} alt={ingredient.name} className="w-12 h-12 object-cover mr-2 rounded-full" />
                        <span>{ingredient.name}</span>
                      </li>
                    ))}
                  </ul>
                  <h4 className="font-semibold text-orange-600 mt-2">Missed Ingredients:</h4>
                  <ul className="flex flex-wrap gap-2">
                    {recipe.missedIngredients?.map(ingredient => (
                      <li key={ingredient.id} className="flex items-center mt-1 bg-gray-100 p-2 rounded-md">
                        <img src={ingredient.image} alt={ingredient.name} className="w-12 h-12 object-cover mr-2 rounded-full" />
                        <span>{ingredient.name} ({ingredient.original})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
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

export default RecipeSuggestions;
