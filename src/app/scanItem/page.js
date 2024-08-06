"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "react-camera-pro";
import { db, storage, collection, addDoc, ref, uploadBytes, getDownloadURL } from "../../config/firebase"; // Import only from your config
import { useUser } from "../../Contexts/UserContexts.js"; // Adjust import path
import { FaHome, FaList, FaUtensils, FaUser, FaStore } from 'react-icons/fa';

const ScanItem = () => {
  const [image, setImage] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const router = useRouter();
  const user = useUser();
  const cameraRef = useRef(null);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const imageSrc = cameraRef.current.getScreenshot();
      setImage(imageSrc);
      // handle image upload and saving to Firestore
      if (user && user.uid) {
        try {
          const imageRef = ref(storage, `images/${user.uid}/${Date.now()}.jpg`);
          const response = await fetch(imageSrc);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);
          const imageUrl = await getDownloadURL(imageRef);

          await addDoc(collection(db, "items"), {
            imageUrl,
            userId: user.uid,
            timestamp: new Date(),
          });

          setSaveMessage("Item added successfully!");
          router.push("/pantry");
        } catch (error) {
          console.error("Error uploading image: ", error);
          setSaveMessage("Failed to add item. Please try again.");
        }
      } else {
        console.error("User is not authenticated or user.uid is missing.");
        setSaveMessage("User is not authenticated. Please log in.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16" style={{ backgroundImage: 'url(/bg5.jpg)' }}>
      <div className="p-4 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg mt-6 flex-grow">
        <h2 className="text-2xl font-bold mb-4">Scan and Add Item</h2>
        <div className="mb-4">
          <Camera
            ref={cameraRef}
            onCapture={handleCapture}
            className="w-full h-64"
          />
        </div>
        {image && <img src={image} alt="Captured" className="w-full h-auto" />}
        <button
          onClick={handleCapture}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-6"
        >
          Capture and Save
        </button>
        {saveMessage && <p className="mt-4 text-green-500">{saveMessage}</p>}
      </div>
    </div>
  );
};

export default ScanItem;
