// // // src/firebase.js

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBqy-eBb1XXL5JfkAR5kLVOYKobUk6mqSo",
//   authDomain: "pantry-tracker-b41cf.firebaseapp.com",
//   projectId: "pantry-tracker-b41cf",
//   storageBucket: "pantry-tracker-b41cf.appspot.com",
//   messagingSenderId: "1051719969097",
//   appId: "1:1051719969097:web:0531d75c3302f418795298",
//   measurementId: "G-58MTM5BT75"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// export const db = getFirestore(app);

// export { auth};

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqy-eBb1XXL5JfkAR5kLVOYKobUk6mqSo",
  authDomain: "pantry-tracker-b41cf.firebaseapp.com",
  projectId: "pantry-tracker-b41cf",
  storageBucket: "pantry-tracker-b41cf.appspot.com",
  messagingSenderId: "1051719969097",
  appId: "1:1051719969097:web:0531d75c3302f418795298",
  measurementId: "G-58MTM5BT75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
