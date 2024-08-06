"use client";
import React, { useState, useEffect } from 'react';
import { db } from "../../config/firebase.js";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { FaHome, FaList, FaUtensils, FaUser, FaStore, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

const fetchUserItems = async (userId) => {
  try {
    const q = query(collection(db, 'items'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => doc.data());
    return items;
  } catch (error) {
    console.error('Error fetching user items: ', error);
    return [];
  }
};

const fetchRecipeDetails = async (recipeId) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe details: ', error);
    return null;
  }
};

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState([]);
  const [detailedRecipe, setDetailedRecipe] = useState(null);
  const [userId, setUserId] = useState("");
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
        await fetchRecipes(items);
      } else {
        setRecipes([]);
      }
    };

    getRecipes();
  }, [userId]);

  const fetchRecipes = async (inventory) => {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const ingredients = inventory.map(item => item.name).join(',');

    setLoadingRecipes(true);

    try {
      if (ingredients.trim() === '') {
        setSnackbarMessage('No items in your pantry to find recipes.');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`
      );

      if (response.data.length === 0) {
        setSnackbarMessage('No recipes found with the current ingredients.');
        setSnackbarSeverity('info');
      }

      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setSnackbarMessage('Error fetching recipes.');
      setSnackbarSeverity('error');
      setRecipes([]);
    } finally {
      setLoadingRecipes(false);
      setSnackbarOpen(true);
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

  const handleRecipeClick = async (recipeId) => {
    const recipeDetails = await fetchRecipeDetails(recipeId);
    setDetailedRecipe(recipeDetails);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDetailedRecipe(null);
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

        {loadingRecipes ? (
          <p className="text-gray-700">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p className="text-gray-700">No recipes found. Please add some items to your pantry.</p>
        ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
  <li key={recipe.id} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white">
    <img src={recipe.image} alt={recipe.title} className="w-full h-32 object-cover rounded-md" />
    <h3 className="text-xl font-semibold text-orange-600 mt-2">{recipe.title}</h3>
    
    <button 
      onClick={() => handleRecipeClick(recipe.id)} 
      className="bg-orange-500 text-white p-2 rounded-md mt-2 w-full hover:bg-orange-600"
    >
      View Recipe
    </button>
  </li>
))}

            
          </ul>
        )}

        {/* Snackbar for displaying messages */}
        {snackbarOpen && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${snackbarSeverity === 'success' ? 'bg-green-500' : snackbarSeverity === 'info' ? 'bg-orange-500' : 'bg-red-500'} text-white`}>
            {snackbarMessage}
            <button onClick={() => setSnackbarOpen(false)} className="ml-4 underline">Close</button>
          </div>
        )}
      </div>

      {/* Modal for recipe details */}
      {modalOpen && detailedRecipe && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl">
              &times;
            </button>
            <h2 className="text-2xl font-bold text-orange-600">{detailedRecipe.title}</h2>
            <img src={detailedRecipe.image} alt={detailedRecipe.title} className="mt-2 w-full h-48 object-cover rounded-md" />
            <p className="mt-4">{detailedRecipe.instructions}</p>

            {detailedRecipe?.usedIngredients?.length > 0 && (
              <>
                <h3 className="font-semibold text-orange-600 mt-4">Used Ingredients:</h3>
                <ul className="flex flex-wrap gap-2 mt-2">
                  {detailedRecipe.usedIngredients.map(ingredient => (
                    <li key={ingredient.id} className="flex items-center bg-gray-100 p-2 rounded-md">
                      <img src={ingredient.image} alt={ingredient.name} className="w-12 h-12 object-cover rounded-full mr-2" />
                      <span>{ingredient.name}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {detailedRecipe?.missedIngredients?.length > 0 && (
              <>
                <h3 className="font-semibold text-orange-600 mt-4">Missing Ingredients:</h3>
                <ul className="flex flex-wrap gap-2 mt-2">
                  {detailedRecipe.missedIngredients.map(ingredient => (
                    <li key={ingredient.id} className="flex items-center bg-gray-100 p-2 rounded-md">
                      <img src={ingredient.image} alt={ingredient.name} className="w-12 h-12 object-cover rounded-full mr-2" />
                      <span>{ingredient.name} ({ingredient.original})</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <a href={detailedRecipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="block mt-4 text-blue-500 hover:underline">
              View Full Recipe
            </a>
          </div>
        </div>
      )}

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

export default RecipeSuggestions;
