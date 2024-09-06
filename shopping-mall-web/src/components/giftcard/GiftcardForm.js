import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import ReadGiftcard from "./ReadGiftcard";
import { doc, updateDoc, addDoc,Timestamp } from "firebase/firestore";

const GiftcardForm = ({
  isOpen,
  onClose,
  editingGiftcard,
  setGiftcards,
  giftcards,
}) => {
  const [formData, setFormData] = useState({
    store: "",
    price: "",
    validity: "",
  });
  useEffect(() => {
    if (editingGiftcard) {

        const giftcardData = {
            ...editingGiftcard,
            validity: editingGiftcard.validity
              ? new Date(editingGiftcard.validity.seconds * 1000).toISOString().split('T')[0]  // Convert Timestamp to YYYY-MM-DD
              : "",  // Default to empty if no validity
          };

      setFormData(giftcardData);
    } else {
      setFormData({ store: "", price: "", validity: "" });
    }
  }, [editingGiftcard]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    console.log(e.target.value);
    
    
  };

  const formatdateToTimestamp = (e) => {
    const date = new Date(e.target.value);
    if (!isNaN(date)) {
      // Convert the date to a Firestore Timestamp
      setFormData({ ...formData, validity: Timestamp.fromDate(date) });
    } else {
      console.error("Invalid date");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

    // Parse the date string from the form data into a valid Date object
    const validityDate = new Date(formData.validity);
    console.log(validityDate);

    // Check if the date is valid
    if (isNaN(validityDate.getTime())) {
      throw new Error("Invalid date format");
    }
    // Convert the date to Firestore Timestamp
    const timestamp = Timestamp.fromDate(validityDate);

      if (editingGiftcard) {
        const giftcardDocRef = doc(db, "giftcard", editingGiftcard.id);
        await updateDoc(giftcardDocRef, {
            ...formData,validity:timestamp,
        });

        const updatedGiftcards = giftcards.map((p) =>
          p.id === editingGiftcard.id ? { ...p, ...formData,validity:timestamp } : p
        );
        setGiftcards(updatedGiftcards);
        // setFormData(updatedGiftcards);
      } else {
        const docRef = await addDoc(collection(db, "giftcard"), {
        store: formData.store,
        price: formData.price,
        validity: timestamp        
        });
        
        setGiftcards([...giftcards, {...formData,id:docRef.id,validity:timestamp} ]);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting document: ", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border rounded-lg shadow-xl bg-white max-w-md w-full md:w-96 lg:w-[400px] transition-all duration-300 ease-in-out">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {editingGiftcard ? "Edit giftcard" : "Create New giftcard"}
          </h2>
          <p className="text-sm text-gray-500">
            Please fill out the form below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Promotion Name */}
          <div>
            <label
              htmlFor="store"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store name
            </label>
            <input
              type="text"
              name="store"
              value={formData.store}
              onChange={handleChange}
              placeholder="Enter store name"
              aria-label="store Name"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter the amount1"
              aria-label="Giftcard Amount"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="validity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Valid till
            </label>
            <input
              type="date"
              name="validity"
              value={
                formData.validity
                  
              }
              onChange={handleChange}
              placeholder="Enter last valid date"
              aria-label="Valid date"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between space-x-3">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ease-in-out"
            >
              {editingGiftcard ? "Update Giftcard" : "Create Giftcard"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default GiftcardForm;
