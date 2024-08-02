"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../config/firebase.js";
import { auth } from "../../config/firebase.js"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { FaHome, FaList, FaUtensils, FaUser, FaStore } from 'react-icons/fa';
import Image from "next/image";

const AddItem = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notification, setNotification] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "items"), {
        name,
        quantity,
        unit,
        category,
        location,
        expirationDate,
        notification,
        imageUrl: image ? URL.createObjectURL(image) : null,
      });
      setSaveMessage("Item added successfully!");
      router.push("/pantry"); // Redirect to pantry page after successful addition
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16"> {/* Added padding-bottom */}
      <div className="p-4 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg mt-6 flex-grow">
        <nav className="flex mb-6">
          <button
            onClick={() => router.push("/additem?mode=manual")}
            className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Manually
          </button>
          <button
            onClick={() => router.push("/additem?mode=scan")}
            className="flex-1 p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Scan Barcode
          </button>
        </nav>

        <h2 className="text-2xl font-bold mb-4">Add New Item</h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {image && <Image src={URL.createObjectURL(image)} alt="Item Image" width={100} height={100} />}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Quantity</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select a category</option>
            <option value="Fridge">Fridge</option>
            <option value="Shelf">Shelf</option>
            <option value="Cleaning">Cleaning</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select a location</option>
            <option value="Top Shelf">Top Shelf</option>
            <option value="Bottom Shelf">Bottom Shelf</option>
            <option value="Pantry">Pantry</option>
            <option value="Fridge">Fridge</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Expiration Date</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Notification</label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={notification}
              onChange={(e) => setNotification(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2">Enable Notification</span>
          </label>
        </div>

        <button
          onClick={handleSave}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-6"
        >
          Save Item
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-around border-t border-gray-200">
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

export default AddItem;
