'use client';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase.js';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
const generateRecipePage = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();


  useEffect(() => {
    const fetchPantryItems = async () => {
      try {
        if (auth.currentUser) {
          const userUid = auth.currentUser.uid;
          const q = query(collection(db, 'users', userUid, 'pantryItems'));
          const querySnapshot = await getDocs(q);
          const itemsArray = querySnapshot.docs.map(doc => ({
            name: doc.data().name,
            quantity: doc.data().quantity,
            measurement: doc.data().measurement
          }));
          setPantryItems(itemsArray);
        }
      } catch (err) {
        console.error('Error fetching pantry items:', err);
        setError('Failed to fetch pantry items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPantryItems();
      } else {
        setPantryItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const generateRecipe = async (usePantryOnly) => {
    if (isGenerating) return; // Prevent multiple simultaneous calls
    setIsGenerating(true);
    setGenerating(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

      const response = await fetch('/api/generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ingredients: pantryItems.map(item => `${item.name} (${item.quantity} ${item.measurement})`).join(', '),
          usePantryOnly
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.recipe === 'Not enough ingredients') {
        setRecipe({ message: 'Not enough ingredients to make a recipe. Try adding more items to your pantry or generate any recipe!' });
      } else {
        const parsedRecipe = parseRecipe(data.recipe);
        setRecipe(parsedRecipe);
      }
    } catch (err) {
      console.error('Error generating recipe:', err);
      if ((err).name === 'AbortError') {
        setError('Recipe generation timed out. Please try again.');
      } else {
        setError('Failed to generate recipe. Please try again or generate any recipe.');
      }
    } finally {
      setGenerating(false);
      setTimeout(() => setIsGenerating(false), 1000);
    }
  };
const handleSignOut = async () => {
    try {
      
      router.push('/auth_login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  const parseRecipe = (recipeString) => {
    const lines = recipeString.split('\n').filter(line => line.trim() !== '');
    let parsedRecipe = {
      ingredients: [],
      instructions: []
    };

    let currentSection = '';

    for (const line of lines) {
      if (line.toLowerCase().includes('recipe:')) {
        parsedRecipe.name = line.split(':')[1].trim();
      } else if (line.toLowerCase().includes('difficulty:')) {
        parsedRecipe.difficulty = line.split(':')[1].trim();
      } else if (line.toLowerCase().includes('time:')) {
        parsedRecipe.time = line.split(':')[1].trim();
      } else if (line.toLowerCase().includes('servings:')) {
        parsedRecipe.servings = line.split(':')[1].trim();
      } else if (line.toLowerCase().includes('ingredients:')) {
        currentSection = 'ingredients';
      } else if (line.toLowerCase().includes('instructions:')) {
        currentSection = 'instructions';
      } else if (currentSection === 'ingredients' && line.trim().startsWith('•')) {
        parsedRecipe.ingredients.push(line.trim().substring(1).trim());
      } else if (currentSection === 'instructions' && /^\d+\./.test(line.trim())) {
        parsedRecipe.instructions.push(line.trim().replace(/^\d+\.\s*/, ''));
      } else if (!parsedRecipe.message) {
        parsedRecipe.message = line.trim();
      }
    }

    return parsedRecipe;
  };

  const addToShoppingCart = () => {
    if (recipe && recipe.ingredients) {
      const currentCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
      const newItems = recipe.ingredients.filter(item => !pantryItems.some(pantryItem => pantryItem.name === item.split(' (')[0]));
      const updatedCart = [...currentCart, ...newItems];
      localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('storage'));
      alert('Items added to shopping list!');
    }
  };

  const saveRecipe = async () => {
    if (recipe && auth.currentUser) {
      try {
        const userUid = auth.currentUser.uid;
        const recipeToSave = {
          name: recipe.name,
          difficulty: recipe.difficulty,
          time: recipe.time,
          servings: recipe.servings,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          createdAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, 'users', userUid, 'savedRecipes'), recipeToSave);
        console.log("Document written with ID: ", docRef.id);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000); // Clear success message after 3 seconds
      } catch (error) {
        console.error('Error saving recipe:', error);
        setError(`Failed to save recipe. Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      setError('No recipe to save or user not authenticated.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>AI RECIPE GENERATOR</h1>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div  className="min-h-screen"style={{ padding: '20px' , backgroundImage: 'url(/bg5.jpg)' }}>
        <h1 className='justify-center'>AI RECIPE GENERATOR</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: 'url(/bg7.jpg)' }}>
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        <FaSignOutAlt size={20} />
      </button>
      <div className="flex-1 p-4 w-full max-w-4xl mx-auto shadow-lg rounded-lg mt-6 justify-center items-center">
           <h1 className="text-2xl font-bold mb-4 mt-4 text-black justify-center items-center ">AI RECIPE GENERATOR</h1>
      <h2 className="text-2xl font-bold mb-4 text-black justify-center">Discover Tasty Recipes from Your Pantry with a Touch of AI Magic!</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px',color:'orange' }}>
        {/* <button 
          onClick={() => generateRecipe(true)}
          disabled={isGenerating || pantryItems.length === 0}
                     className="w-full sm:w-auto p-2 bg-orange-500 text-white rounded hover:bg-orange-600"

         
        >
          {isGenerating ? 'Generating...' : 'Generate Recipe from Pantry'}
        </button> */}
        <button 
          onClick={() => generateRecipe(false)}
          disabled={isGenerating}
                     className="w-full sm:w-auto p-2 bg-orange-500 text-white rounded hover:bg-orange-600"

        >
          {isGenerating ? 'Generating...' : 'Generate Any Recipe'}
        </button>
      </div>
      
      {recipe && (
        <div style={{ textAlign: 'center' }}>
          {recipe.message && (
            <p style={{ color: 'gray' }}>{recipe.message}</p>
          )}
          {recipe.name && (
            <>
              <h3>{recipe.name}</h3>
              <p>{`${recipe.difficulty} | ${recipe.time} | Serves: ${recipe.servings}`}</p>
              
              <h4 className="text-2xl font-bold mb-4 text-orange-600 justify-center items-center "> Ingredients:</h4>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              
              <h4 className="text-2xl font-bold mb-4 text-orange-600 justify-center items-center ">Instructions:</h4>
              <ol>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>

              <div style={{ marginTop: '20px' }}>
                <button 
                  onClick={addToShoppingCart}
                  style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Add Ingredients to Shopping Cart
                </button>
                <button 
                  onClick={saveRecipe}
                  style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  {saveSuccess ? 'Recipe Saved!' : 'Save Recipe'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
       </div>
   
    </div>
  );
};

export default generateRecipePage;
