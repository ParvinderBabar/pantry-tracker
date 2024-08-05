// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // import { getFirestore } from "firebase/firestore";
// // import { getAuth } from "firebase/auth";

// // //  web app's Firebase configuration
// // const firebaseConfig = {
// //   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
// //   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
// //   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// //   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
// //   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// //   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);
// // export const auth = getAuth(app);
// // export const db = getFirestore(app);
// import { initializeApp } from "firebase/app";
// import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // Web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);



// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export { app };
// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };

// Optionally initialize Analytics if supported
isAnalyticsSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
  }
});
