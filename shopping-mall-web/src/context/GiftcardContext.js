import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  addDoc
} from "firebase/firestore";

const GiftcardContext = createContext();

export const useGiftcardContext = () => {
  return useContext(GiftcardContext);
};

export const GiftcardProvider = ({ children }) => {
  const [giftCard, setGiftCard] = useState([]);

  //get all giftcards from the server
  const getGiftCards = async () => {
    try {
      const giftcardCollection = collection(db, "giftcard");
      const giftCardSnapshot = await getDocs(giftcardCollection);
      const giftCardList = giftCardSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGiftCard(giftCardList);
    } catch (error) {
      console.error("error in fetching all giftcard : " + error);
    }
  };

  //CREATE NEW GIFTCARD
  const createGiftCard = async (giftCard) => {
    try {
      await addDoc(collection(db, "giftcard"), giftCard);
      getGiftCards();
    } catch (error) {
      console.log("error in creating new giftcard : " + error);
    }
  };

  //update an existing giftcard
  const updateGiftCard = async (id, updatedGiftcard) => {
    try {
      const giftcarDoc = doc(db, "giftcard", id);
      await updateDoc(giftcarDoc, updatedGiftcard);
      getGiftCards();
    } catch (error) {
      console.log("error in updating giftcard : " + error);
    }
  };

  //delete an existing giftcard
  const deleteGiftCard = async (id) => {
    try {
      const giftcarDoc = doc(db, "giftcard", id);
      await deleteDoc(giftcarDoc);
      getGiftCards();
    } catch (error) {
      console.log("error in deleting giftcard : " + error);
    }
  };

  useEffect(() => {
    getGiftCards();
  }, []);

  const values = {
    giftCard,
    createGiftCard,
    updateGiftCard,
    deleteGiftCard,
  };

  return (
    <GiftcardContext.Provider value={values}>
      {children}
    </GiftcardContext.Provider>
  );
};
