"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/UserContext/page.js';
import { auth, db } from "@/config/firebase.js";
import { signOut } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FaHome, FaList, FaUtensils, FaUser, FaStore } from 'react-icons/fa';

const Profile = () => {
  const user = useUser();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  // const [foodPreference, setFoodPreference] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (user) {

      // Fetch user data from Firestore
      const fetchUserData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          console.log(user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setName(userData.displayName || '');
            setEmail(userData.email || '');
            setDob(userData.dob || '');
            // setFoodPreference(userData.foodPreference || '');
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  if (!user) return <p>Loading...</p>;

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      // Update user details in Firebase Authentication
      if (password) {
        await user.updatePassword(password);
      }

      // Update user details in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: name,
        email,
        dob,
        // foodPreference
      });

      setSaveMessage('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Failed to update profile. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth_login'); // Redirect to login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-orange-50" style={{ backgroundImage: 'url(/bg5.jpg)' }} >
      <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg flex-grow">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Profile</h2>

        {editing ? (
          <div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Food Preference</label>
              <input
                type="text"
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div> */}

            <button
              onClick={handleSave}
              className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 mt-4"
            >
              Save Changes
            </button>

            <button
              onClick={() => setEditing(false)}
              className="w-full p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mt-2"
            >
              Cancel
            </button>

          </div>
        ) : (
          <div>
            <p className="mb-2"><strong>Name:</strong> {name}</p>
            <p className="mb-2"><strong>Email:</strong> {email}</p>
            <p className="mb-2"><strong>Date of Birth:</strong> {dob}</p>
            {/* <p className="mb-2"><strong>Food Preference:</strong> {foodPreference}</p> */}
            <button
              onClick={handleEdit}
              className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 mt-4"
            >
              Edit Profile
            </button>
          </div>
        )}

        {saveMessage && <p className="mt-4 text-green-600">{saveMessage}</p>}

        <button
          onClick={handleSignOut}
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4"
        >
          Sign Out
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-2 flex justify-around border-t border-gray-200">
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

export default Profile;
