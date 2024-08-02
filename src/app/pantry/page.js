"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../config/firebase.js";
import { FaHome, FaList, FaUtensils, FaUser, FaStore } from 'react-icons/fa';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Image from "next/image";

const Pantry = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: "",
  });
  const [editItemId, setEditItemId] = useState(null);
  const [editItem, setEditItem] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [saveMessage, setSaveMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsList);
    };

    fetchData();
  }, []);

  const handleChange = (e, setItem) => {
    const { name, value } = e.target;
    setItem(prevItem => ({ ...prevItem, [name]: value }));
  };

  const handleAddItem = () => {
    router.push("./addItem"); // Navigate to Add Item page
  };

  const handleEditItem = async (id) => {
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
    <div className="p-4 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg mt-6 sm:mt-8 md:mt-10 lg:mt-12">
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
        <nav className="flex space-x-4">
          {["All", "Fridge", "Shelf", "Cleaning"].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`p-2 ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {saveMessage && <p className="text-green-500 mb-4">{saveMessage}</p>}

      <div className="mb-4">
        <button
          onClick={handleAddItem}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        filteredItems.map((item) => (
          <div key={item.id} className="mb-4">
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
                  <span>
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <label className="w-24 font-semibold">Category:</label>
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Image src="/example.jpg" alt="Example Image" width={50} height={50} />
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
                <hr className="my-4" />
              </>
            )}
          </div>
        ))
      )}

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

export default Pantry;
