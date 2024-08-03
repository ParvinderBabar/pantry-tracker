// "use client";
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// const ShoppingListForm = () => {
//   const [username, setUsername] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [hash, setHash] = useState('');
//   const router = useRouter();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Redirect to the shopping list page with the inputs as query parameters
//     router.push(`/shopping-list?username=${username}&startDate=${startDate}&endDate=${endDate}&hash=${hash}`);
//   };

//   return (
//     <div className="flex flex-col min-h-screen p-4">
//       <h2 className="text-2xl font-bold mb-4 text-orange-600">Generate Shopping List</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700">Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="border border-gray-300 p-2 rounded w-full"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Start Date (yyyy-mm-dd):</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="border border-gray-300 p-2 rounded w-full"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">End Date (yyyy-mm-dd):</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="border border-gray-300 p-2 rounded w-full"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700">Private Hash:</label>
//           <input
//             type="text"
//             value={hash}
//             onChange={(e) => setHash(e.target.value)}
//             className="border border-gray-300 p-2 rounded w-full"
//             required
//           />
//         </div>
//         <button type="submit" className="bg-orange-600 text-white p-2 rounded">Generate Shopping List</button>
//       </form>
//     </div>
//   );
// };

// export default ShoppingListForm;
