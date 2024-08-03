import { useState } from 'react';

const RecipeFinder = () => {
  const [pantryContents, setPantryContents] = useState('');
  const [recipes, setRecipes] = useState('');

  const handleFetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipeSuggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pantryContents }),
      });
      const data = await response.json();
      if (response.ok) {
        setRecipes(data.recipes);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <div>
      <h2>Recipe Finder</h2>
      <textarea
        value={pantryContents}
        onChange={(e) => setPantryContents(e.target.value)}
        placeholder="Enter pantry contents separated by commas..."
      />
      <button onClick={handleFetchRecipes}>Get Recipes</button>
      <div>
        <h3>Suggested Recipes:</h3>
        <pre>{recipes}</pre>
      </div>
    </div>
  );
};

export default RecipeFinder;
