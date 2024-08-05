// src/app/utils/firebase/firebase.js
import { collection, getDocs } from "firebase/firestore";
import { startOfMonth, endOfMonth } from "date-fns";
import { db } from "@/config/firebase.js"; // Adjust the import path if necessary

export const fetchExpiringItems = async (userId) => {
  try {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    
    // Query items for the current user
    const q = query(
      collection(db, "items"),
      where("userId", "==", userId),
      where("expirationDate", ">=", start),
      where("expirationDate", "<=", end)
    );

    const querySnapshot = await getDocs(q);

    const expiringItems = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const expirationDate = new Date(data.expirationDate.seconds * 1000); // Convert Firestore timestamp to Date
      return { id: doc.id, ...data, expirationDate };
    });

    return expiringItems;
  } catch (error) {
    console.error("Error fetching expiring items: ", error);
    return [];
  }
};
