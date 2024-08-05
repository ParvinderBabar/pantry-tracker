// utils/fetchRecipe.js

export const fetchRecipe = async (ingredients, preferences) => {
    try {
        const response = await fetch('/generateRecipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients, preferences }),
        });

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Attempt to parse the response as JSON
        const text = await response.text(); // Get the response as text
        try {
            const data = JSON.parse(text); // Attempt to parse the text as JSON
            return data.recipe; // Assuming data.recipe is the desired output
        } catch (jsonError) {
            console.error('Failed to parse JSON:', jsonError);
            return null;
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
};
