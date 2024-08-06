"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, collection, addDoc } from "../../config/firebase"; // Ensure this is correctly set up
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { useUser } from "../../Contexts/UserContexts.js"; // Adjust import path
import { FaHome, FaList, FaUtensils, FaUser, FaStore } from 'react-icons/fa';

// Categories and units arrays
const categories = ["Fridge", "Shelf", "Cleaning"];
const units = ["None", "Liters", "Kg", "Grams", "Dozen"];

const AddItem = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notification, setNotification] = useState(false);
  const [image, setImage] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const router = useRouter();
  const user = useUser();

  // Initialize Firebase Storage
  const storage = getStorage();

  const handleSave = async () => {
    if (!user || !user.uid) {
      console.error("User is not authenticated or user.uid is missing.");
      return;
    }

    // Validate expiration date
    const isValidDate = !isNaN(new Date(expirationDate).getTime());
    if (!isValidDate) {
      console.error("Invalid expiration date:", expirationDate);
      setSaveMessage("Invalid expiration date. Please enter a valid date.");
      return;
    }

    try {
      let imageUrl = null;

      if (image) {
        const imageRef = ref(storage, `images/${user.uid}/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "items"), {
        name,
        quantity,
        unit,
        category,
        location,
        expirationDate: new Date(expirationDate),
        notification,
        userId: user.uid,
        imageUrl,
      });

      setSaveMessage("Item added successfully!");
      router.push("/pantry");
    } catch (error) {
      console.error("Error adding document: ", error);
      setSaveMessage("Failed to add item. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16" style={{ backgroundImage: 'url(/bg5.jpg)' }}>
      <div className="p-4 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg mt-6 flex-grow">
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
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select a unit</option>
            {units.map((unitOption) => (
              <option key={unitOption} value={unitOption}>{unitOption}</option>
            ))}
          </select>
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
            {categories.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>{categoryOption}</option>
            ))}
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
        {saveMessage && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 border border-green-300 rounded">
            {saveMessage}
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

export default AddItem;
