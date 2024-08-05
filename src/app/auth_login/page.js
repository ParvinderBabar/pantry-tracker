"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../config/firebase.js"; // Import from your Firebase config
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User ID:", userCredential.user.uid); // Log user ID

      setMessage("Logged in successfully! Redirecting to home...");
      setTimeout(() => {
        router.push("/home"); // Redirect to home page after successful login
      }, 1000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100" 
         style={{ backgroundImage: 'url(/bg1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Log In
          </button>
        </form>
        {message && <p className="mt-4 text-red-500">{message}</p>}
        <p className="mt-4">
          Don't have an account? <a href="/auth_signup" className="text-blue-500">Sign Up</a>
        </p>
        <p className="mt-4">
          Forgot your password? <a href="/auth_reset_password" className="text-blue-500">Reset Password</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
