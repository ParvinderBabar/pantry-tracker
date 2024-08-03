"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../config/firebase.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useUser } from "@/app/UserContext/page.js"; // Adjust the path accordingly
import { FaHome, FaList, FaUtensils, FaUser, FaStore } from 'react-icons/fa';

const Pantry = () => {
  const user = useUser();
  const router = useRouter();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "", category: "" });
  const [editItemId, setEditItemId] = useState(null);
  const [editItem, setEditItem] = useState({ name: "", quantity: "", unit: "", category: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      router.push('/auth_login');
      return;
    }

    const fetchItems = async () => {
      const q = query(collection(db, "items"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(fetchedItems);
    };

    fetchItems();
  }, [userId, router]);

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async () => {
    if (!userId) return;

    try {
      await addDoc(collection(db, "items"), { ...newItem, userId });
      setNewItem({ name: "", quantity: "", unit: "", category: "" });
      setSaveMessage("Item added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEditItem = (id) => {
    setEditItemId(id);
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setEditItem(itemToEdit);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await updateDoc(doc(db, "items", editItemId), editItem);
      setItems(prevItems => 
        prevItems.map(item => (item.id === editItemId ? { id: editItemId, ...editItem } : item))
      );
      setEditItemId(null);
      setEditItem({ name: "", quantity: "", unit: "", category: "" });
      setSaveMessage("Changes saved successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      setSaveMessage("Error saving changes.");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const filteredItems = items.filter(item =>
    (selectedCategory === "All" || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Pantry Items</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <nav className="flex space-x-4 mb-4">
          {["All", "Fridge", "Shelf", "Cleaning"].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`p-2 ${selectedCategory === category ? 'bg-orange-500 text-white' : 'bg-gray-200'} rounded`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {saveMessage && <p className="text-green-500 mb-4">{saveMessage}</p>}

      <div className="mb-4">
        <button
          onClick={() => router.push('/addItem')}
          className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Add Item
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => router.push('/recipes')}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Get Recipe Suggestions
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        filteredItems.map(item => (
          <div key={item.id} className="mb-4 p-4 border rounded shadow-sm">
            {editItemId === item.id ? (
              <>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editItem.name}
                    onChange={(e) => handleChange(e, setEditItem)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={editItem.quantity}
                    onChange={(e) => handleChange(e, setEditItem)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={editItem.unit}
                    onChange={(e) => handleChange(e, setEditItem)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editItem.category}
                    onChange={(e) => handleChange(e, setEditItem)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button
                  onClick={handleSaveChanges}
                  className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center mb-2">
                  <label className="w-24 font-semibold">Name:</label>
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center mb-2">
                  <label className="w-24 font-semibold">Quantity:</label>
                  <span>{item.quantity}</span>
                </div>
                <div className="flex items-center mb-2">
                  <label className="w-24 font-semibold">Unit:</label>
                  <span>{item.unit}</span>
                </div>
                <div className="flex items-center mb-2">
                  <label className="w-24 font-semibold">Category:</label>
                  <span>{item.category}</span>
                </div>
                <button
                  onClick={() => handleEditItem(item.id)}
                  className="mr-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))
      )}
      
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-around">
        <button onClick={() => router.push('/home')} className="text-gray-600 hover:text-orange-500">
          <FaHome size={24} />
        </button>
        <button onClick={() => router.push('/pantry')} className="text-gray-600 hover:text-orange-500">
          <FaList size={24} />
        </button>
        <button onClick={() => router.push('/recipes')} className="text-gray-600 hover:text-orange-500">
          <FaUtensils size={24} />
        </button>
        <button onClick={() => router.push('/profile')} className="text-gray-600 hover:text-orange-500">
          <FaUser size={24} />
        </button>
        <button onClick={() => router.push('/store')} className="text-gray-600 hover:text-orange-500">
          <FaStore size={24} />
        </button>
      </nav>
    </div>
  );
};

export default Pantry;
