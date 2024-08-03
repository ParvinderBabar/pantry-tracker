// "use client";
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// const fetchShoppingList = async (username, startDate, endDate, hash) => {
//   try {
//     const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY; // Access the API key from environment variable
//     const response = await fetch(
//       `https://api.spoonacular.com/mealplanner/${username}/shopping-list/${startDate}/${endDate}?apiKey=${apiKey}&hash=${hash}`
//     );
//     const data = await response.json();
//     console.log('API Response:', data); // Debugging: Check the API response format
//     return Array.isArray(data) ? data : [];
//   } catch (error) {
//     console.error('Error fetching shopping list: ', error);
//     return [];
//   }
// };

// const ShoppingList = () => {
//   const [shoppingList, setShoppingList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();
//   const { username, startDate, endDate, hash } = router.query;

//   useEffect(() => {
//     if (!username || !startDate || !endDate || !hash) {
//       setError('Missing required query parameters.');
//       setLoading(false);
//       return;
//     }

//     const getShoppingList = async () => {
//       try {
//         const data = await fetchShoppingList(username, startDate, endDate, hash);
//         setShoppingList(data);
//       } catch (error) {
//         setError('Failed to load shopping list');
//       } finally {
//         setLoading(false);
//       }
//     };

//     getShoppingList();
//   }, [username, startDate, endDate, hash]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="flex flex-col min-h-screen p-4">
//       <h2 className="text-2xl font-bold mb-4 text-orange-600">Shopping List</h2>
//       {shoppingList.length === 0 ? (
//         <p className="text-gray-700">No items found for the selected date range.</p>
//       ) : (
//         <ul className="space-y-4">
//           {shoppingList.map((item) => (
//             <li key={item.id} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white">
//               <h3 className="text-xl font-semibold text-orange-600">{item.name}</h3>
//               <p className="text-gray-700">Quantity: {item.quantity}</p>
//               <p className="text-gray-700">Unit: {item.unit}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ShoppingList;
