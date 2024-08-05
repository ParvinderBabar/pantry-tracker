"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for Next.js
import { db } from "@/config/firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FaHome, FaList, FaUtensils, FaUser, FaStore, FaPlusCircle, FaEdit, FaTrash, FaMinus, FaPlus, FaCaretDown } from 'react-icons/fa';
import { useUser } from "@/app/UserContext/page"; // Adjust import path

const AddShoppingList = () => {
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 1 }]);
  const [saveMessage, setSaveMessage] = useState("");
  const [shoppingLists, setShoppingLists] = useState([]);
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [currentListId, setCurrentListId] = useState(null);
  const [isCollapsed,setIsCollapsed]=useState({}) 
    const router = useRouter();
    
  const user = useUser();

  useEffect(() => {
    if (user && user.uid) {
      fetchShoppingLists();
    }
  }, [user]);

  const fetchShoppingLists = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shoppingLists"));
      const lists = [];
      querySnapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });
      setShoppingLists(lists);
    } catch (error) {
      console.error("Error fetching shopping lists: ", error);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1 }]);
  };

  const handleSave = async () => {
    if (!user || !user.uid) {
      console.error("User is not authenticated or user.uid is missing.");
      return;
    }

    try {
      if (isEditingList && currentListId) {
        const listRef = doc(db, "shoppingLists", currentListId);
        await setDoc(listRef, {
          listName,
          items,
          userId: user.uid,
        });
        setSaveMessage("Shopping list updated successfully!");
      } else {
        await addDoc(collection(db, "shoppingLists"), {
          listName,
          items,
          userId: user.uid,
        });
        setSaveMessage("Shopping list added successfully!");
      }
      setIsCreatingNewList(false);
      setIsEditingList(false);
      setCurrentListId(null);
      fetchShoppingLists();
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      setSaveMessage("Failed to save shopping list. Please try again.");
    }
  };

  const handleQuantityChange = (index, increment) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, newItems[index].quantity + increment);
    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleDeleteList = async (id) => {
    try {
      await deleteDoc(doc(db, "shoppingLists", id));
      fetchShoppingLists();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEditList = (list) => {
    setIsEditingList(true);
    setIsCreatingNewList(true);
    setCurrentListId(list.id);
    setListName(list.listName);
    setItems(list.items);
  };

  return (
    <div className="flex flex-col min-h-screen pb-16" style={{ backgroundImage: 'url(/bg5.jpg)' }}>
      <div className="p-4 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg mt-6 flex-grow">
        {isCreatingNewList ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{isEditingList ? "Edit Shopping List" : "Add New Shopping List"}</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">List Name</label>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <h3 className="text-xl font-bold mb-2">Items</h3>
            {items.map((item, index) => (
              <div key={index} className="mb-4 flex items-center">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Item Name"
                  required
                />
                <div className="flex items-center ml-2">
                  <button onClick={() => handleQuantityChange(index, -1)} className="p-2 border border-gray-300 rounded">
                    <FaMinus />
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(index, 1)} className="p-2 border border-gray-300 rounded">
                    <FaPlus />
                  </button>
                </div>
                <button onClick={() => handleDeleteItem(index)} className="ml-2 p-2 text-red-500">
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddItem}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
            >
              Add Another Item
            </button>

            <button
              onClick={handleSave}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditingList ? "Update Shopping List" : "Save Shopping List"}
            </button>
            {saveMessage && <div className="text-center text-green-500 mt-4">{saveMessage}</div>}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Shopping Lists ({shoppingLists.length})</h2>
            <button
              onClick={() => setIsCreatingNewList(true)}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4 flex items-center justify-center"
            >
              <FaPlusCircle className="mr-2" /> Create New List
            </button>
            {shoppingLists.length > 0 ? (
              <ul>
                {shoppingLists.map((list) => (
                  <li key={list.id} className="mb-4 relative p-4 border border-gray-300 rounded bg-gray-100">
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <FaEdit className="text-blue-500 cursor-pointer" onClick={() => handleEditList(list)} />
                      <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDeleteList(list.id)} />
                    </div>
                    <h3 className="font-bold text-lg">{list.listName}</h3>
                    <div className="cursor-pointer" onClick={() => toggleCollapse(list.id)}>
                      <FaCaretDown className={`transition-transform ${isCollapsed[list.id] ? 'rotate-180' : ''}`} />
                    </div>
                    <div className={`${isCollapsed[list.id] ? 'hidden' : 'block'}`}>
                      <table className="w-full mt-2">
                        <thead>
                          <tr>
                            <th className="text-left">Item</th>
                            <th className="text-left">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No shopping lists found.</p>
            )}
          </>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-around border-t border-gray-200">
        <button onClick={() => router.push('/home')} className="text-gray-600">
          <FaHome size={24} />
        </button>
        <button onClick={() => router.push('/pantry')} className="text-gray-600">
          <FaStore size={24} />
        </button>
        <button onClick={() => router.push('/shopping')} className="text-gray-600">
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

export default AddShoppingList;
