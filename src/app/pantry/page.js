"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "../../config/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useUser } from "../../Contexts/UserContexts";
import { FaHome, FaList, FaUtensils, FaUser, FaStore, FaSignOutAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { signOut } from 'firebase/auth';

const categories = ["Fridge", "Shelf", "Cleaning"]; 
const units = ["Liters", "Kg", "Grams", "Dozen"];

const Pantry = () => {
  const user = useUser();
  const router = useRouter();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "", category: "", imageUrl: "" });
  const [editItemId, setEditItemId] = useState(null);
  const [editItem, setEditItem] = useState({ name: "", quantity: "", unit: "", category: "", imageUrl: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [saveMessage, setSaveMessage] = useState("");
  const [file, setFile] = useState(null);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    try {
      let imageUrl = editItem.imageUrl;

      if (file) {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "items", editItemId), { ...editItem, imageUrl });

      setItems(prevItems =>
        prevItems.map(item => (item.id === editItemId ? { id: editItemId, ...editItem, imageUrl } : item))
      );

      setEditItemId(null);
      setEditItem({ name: "", quantity: "", unit: "", category: "", imageUrl: "" });
      setFile(null);
      setSaveMessage("Changes saved successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      setSaveMessage("Error saving changes.");
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
          <ul className="divide-y divide-gray-300 bg-white">
            {filteredItems.map(item => (
              <li key={item.id} className="py-2 flex items-center bg-white m-2">
                <div className="flex-shrink-0 w-16 h-16 mr-4 bg-white" >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 rounded"></div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p>Quantity: {item.quantity} {item.unit}</p>
                  <p>Category: {item.category}</p>
                </div>
                <button
                  onClick={() => { setEditItemId(item.id); setEditItem(item); }}
                  className="ml-4 text-blue-500"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={async () => {
                    await deleteDoc(doc(db, "items", item.id));
                    setItems(prevItems => prevItems.filter(i => i.id !== item.id));
                  }}
                  className="ml-4 text-red-500"
                >
                  <FaTrash size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {editItemId && (
          <div className="fixed top-0 left-0 w-full h-full bg-white z-50 p-6">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveChanges();
              }}
            >
              <div className="mb-4">
                <label className="block mb-2">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={editItem.name}
                  onChange={(e) => handleChange(e, setEditItem)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={editItem.quantity}
                  onChange={(e) => handleChange(e, setEditItem)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Unit</label>
                <select
                  name="unit"
                  value={editItem.unit}
                  onChange={(e) => handleChange(e, setEditItem)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Category</label>
                <select
                  name="category"
                  value={editItem.category}
                  onChange={(e) => handleChange(e, setEditItem)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditItemId(null)}
                className="ml-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
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

export default Pantry;
