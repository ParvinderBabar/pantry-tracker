"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../config/firebase.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useUser } from "@/Contexts/UserContexts.js"; // Adjust the path accordingly
import { FaHome, FaList, FaUtensils, FaUser, FaStore ,FaSignOutAlt} from 'react-icons/fa';
import { signOut } from 'firebase/auth';

const categories = ["Fridge", "Shelf", "Cleaning"]; 
const units = [ "Liters", "Kg", "Grams", "Dozen"];

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth_login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const filteredItems = items.filter(item =>
    (selectedCategory === "All" || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: 'url(/bg5.jpg)' }}>
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        <FaSignOutAlt size={20} />
      </button>

      <div className="flex-1 p-4 w-full max-w-4xl mx-auto shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Pantry Items</h2>

        {/* Item count display */}
        <p className="text-lg mb-4">Total Items: {items.length}</p>

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
          <nav className="flex flex-wrap gap-2 mb-4">
            {["All", ...categories].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-2 ${selectedCategory === category ? 'bg-orange-500 text-white' : 'bg-gray-300'} rounded`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        {saveMessage && <p className="text-orange-500 mb-4">{saveMessage}</p>}

        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => router.push('/addItem')}
            className="w-full sm:w-auto p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Item
          </button>
          <button
            onClick={() => router.push('/recipes')}
            className="w-full sm:w-auto p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Get Recipe Suggestions
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="mb-4 p-4 shadow-sm bg-white rounded">
              {editItemId === item.id ? (
                <>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editItem.name}
                      onChange={(e) => handleChange(e, setEditItem)}
                      className="w-full p-2 border rounded"
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
                    <select
                      name="unit"
                      value={editItem.unit}
                      onChange={(e) => handleChange(e, setEditItem)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Select a unit</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Category</label>
                    <select
                      name="category"
                      value={editItem.category}
                      onChange={(e) => handleChange(e, setEditItem)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleSaveChanges}
                    className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Unit:</strong> {item.unit}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <button
                    onClick={() => handleEditItem(item.id)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
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

export default Pantry;
