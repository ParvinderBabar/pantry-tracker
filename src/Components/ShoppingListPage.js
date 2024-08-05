"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../config/firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { FaHome, FaList, FaUtensils, FaUser, FaStore, FaPlusCircle, FaEdit, FaTrash, FaMinus, FaPlus, FaCaretDown, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { useUser } from "../Contexts/UserContexts.js";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase.js";

const AddShoppingList = () => {
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 0 }]);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shoppingLists, setShoppingLists] = useState([]);
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [currentListId, setCurrentListId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState({});
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
    setItems([...items, { name: "", quantity: 0 }]);
  };

  const validateInputs = () => {
    if (!listName.trim()) {
      setErrorMessage("List name is required.");
      return false;
    }
    for (const item of items) {
      if (!item.name.trim()) {
        setErrorMessage("Each item must have a name.");
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const handleSave = async () => {
    if (!user || !user.uid) {
      console.error("User is not authenticated or user.uid is missing.");
      return;
    }

    if (!validateInputs()) {
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
      resetForm();
      fetchShoppingLists();
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      setSaveMessage("Failed to save shopping list. Please try again.");
    }
  };

  const resetForm = () => {
    setListName("");
    setItems([{ name: "", quantity: 0 }]);
    setIsCreatingNewList(false);
    setIsEditingList(false);
    setCurrentListId(null);
    setErrorMessage("");
    setSaveMessage("");
  };

  const handleQuantityChange = (index, increment) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(0, newItems[index].quantity + increment);
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

  const toggleCollapse = (id) => {
    setIsCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth_login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: 'url(/bg5.jpg)' }}>
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        <FaSignOutAlt size={20} />
      </button>
      <div className="relative">
        {isCreatingNewList && (
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 p-2 bg-gray-200 rounded-full shadow-md"
          >
            <FaArrowLeft />
          </button>
        )}
      </div>

      <div className="flex-grow p-4 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg mt-6">
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
              item.quantity >= 0 && (
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
              )
            ))}
            <button
              onClick={handleAddItem}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
            >
              Add Another Item
            </button>

            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

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
              className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 mb-4 flex items-center justify-center"
            >
              <FaPlusCircle className="mr-2" /> Create New List
            </button>
            {shoppingLists.length > 0 ? (
              <ul>
                {shoppingLists.map((list) => (
                  <li key={list.id} className="mb-4 p-4 border border-gray-300 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">{list.listName}</span>
                      <button onClick={() => handleEditList(list)} className="p-2 text-blue-500">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteList(list.id)} className="p-2 text-red-500">
                        <FaTrash />
                      </button>
                      <button onClick={() => toggleCollapse(list.id)} className="p-2 text-gray-500">
                        {isCollapsed[list.id] ? <FaCaretDown /> : <FaCaretDown />}
                      </button>
                    </div>
                    {isCollapsed[list.id] && (
                      <ul className="mt-2">
                        {list.items.map((item, index) => (
                          <li key={index} className="flex justify-between p-2 border-b border-gray-200">
                            <span>{item.name}</span>
                            <span>{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No shopping lists found. Create a new one to get started.</p>
            )}
          </>
        )}
          </div>
          <nav className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-around">
        <button onClick={() => router.push("/home")} className="flex items-center">
          <FaHome className="mr-1" /> 
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
        <button onClick={() => router.push("/pantry")} className="flex items-center">
          <FaStore className="mr-1" /> 
        </button>
      </nav>
    </div>
  );
};

export default AddShoppingList;
