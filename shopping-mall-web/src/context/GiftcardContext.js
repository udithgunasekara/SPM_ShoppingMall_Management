import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import { storage } from "../config/firebaseConfig";
import { ref, StorageErrorCode, uploadBytes,getDownloadURL, deleteObject } from "firebase/storage";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  Timestamp,
  query, where,
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
  const createGiftCard = async (giftCard,imageFile) => {
    try {
      let imageURL = "";
      if(imageFile){
        const storageRef = ref(storage, `giftcard-images/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);

        //get the url of the uploaded image
        imageURL = await getDownloadURL(snapshot.ref);
      }

      const docref = await addDoc(collection(db, "giftcard"), {...giftCard,imageURL});
      getGiftCards();
      if (giftCard.ischecked) {
        notifyEligibleCustomers({ ...giftCard, id: docref.id });
      }
    } catch (error) {
      console.log("error in creating new giftcard : " + error);
    }
  };

  //update an existing giftcard
  const updateGiftCard = async (id, updatedGiftcard , newImageFile) => {
    try {
      const giftcardDoc = doc(db, "giftcard", id);
      const giftcardSnapshot = await getDoc(giftcardDoc);
      console.log(newImageFile.name);

      let existingImageURL;
      let imageURL;
      //upload new image if it is provided
      if (giftcardSnapshot.data().imageURL) {
        existingImageURL = giftcardSnapshot.data().imageURL;
        imageURL = existingImageURL;
        console.log(existingImageURL)
      }
      

      if(newImageFile){
        const storageRef = ref(storage, `giftcard-images/${newImageFile.name}`);
        await uploadBytes(storageRef, newImageFile);
        imageURL = await getDownloadURL(storageRef);
        
        if(existingImageURL){
          const imageRef = ref(storage, existingImageURL);
          await deleteObject(imageRef);
        }
      }

      if (
        giftcardSnapshot.data().ischecked === false &&
        updatedGiftcard.ischecked === true
      ) {
        notifyEligibleCustomers(updatedGiftcard);
      }

      await updateDoc(giftcardDoc, {...updatedGiftcard,imageURL});
      getGiftCards();
    } catch (error) {
      console.log("error in updating giftcard : " + error);
    }
  };

  const notifyEligibleCustomers = async (giftcard) => {
    const loyaltyThreshold = 100;
    const eligibleCustomers = [];

    //fetch eligible customers
    const customerquery = collection(db, "users");
    const customerSnapshot = await getDocs(customerquery);

    customerSnapshot.forEach(async (doc) => {
      const customer = doc.data();
      if (customer.loyaltyPoints >= loyaltyThreshold) {
        eligibleCustomers.push({ ...customer, id: doc.id });

        //add notification to customer document
        const notificationref = collection(
          db,
          "notifications",
          doc.id,
          "notifications"
        );
        await addDoc(notificationref, {
          message: `new giftcard available from ${giftcard.store}`,
          giftCardId: giftcard.id,
          claimDeadline: Timestamp.fromDate(
            new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          ),
          claimed: false,
        });
      }
    });

    console.log("eligible customers : " + eligibleCustomers);
  };

  //delete an existing giftcard
  const deleteGiftCard = async (id) => {
    try {
      const giftcarDoc = doc(db, "giftcard", id);
      const giftcardSnapshot = await getDoc(giftcarDoc);
      try {
        const imageURL = giftcardSnapshot.data().imageURL;
        const imageRef = ref(storage, imageURL);
        await deleteObject(imageRef);
      } catch (error) {
        console.log("error in deleting image : " + error);
      }      
      await deleteDoc(giftcarDoc);
      await deleteUnclaimedGiftcardNotifications(id);
      
      getGiftCards();
    } catch (error) {
      console.log("error in deleting giftcard : " + error);
    }
  };

  const deleteUnclaimedGiftcardNotifications = async (giftCardId) => {
    try {
      console.log("Starting to delete unclaimed notifications for giftCardId:", giftCardId);
  
      // Step 1: Fetch all customers from the "users" collection
      const customersSnapshot = await getDocs(collection(db, "users")); // Ensure this matches your actual collection name
  
      if (customersSnapshot.empty) {
        console.log("No customers found in the users collection.");
        return;
      }
  
      console.log("Found customers:", customersSnapshot.docs.length);
  
      // Step 2: Iterate over each customer and check for unclaimed notifications
      for (const customerDoc of customersSnapshot.docs) {
        const customerId = customerDoc.id;  // This is the customer document ID
        console.log(`Checking notifications for customer: ${customerId}`);
  
        // Reference to the customer's notifications sub-collection
        const notificationsRef = collection(db, "notifications", customerId, "notifications");
  
        // Query for unclaimed notifications related to the specified gift card
        const q = query(notificationsRef, 
          where("giftCardId", "==", giftCardId),
          where("claimed", "==", false)
        );
  
        const notificationsSnapshot = await getDocs(q);
  
        if (notificationsSnapshot.empty) {
          console.log(`No unclaimed notifications found for customer: ${customerId}`);
        } else {
          console.log(`Found ${notificationsSnapshot.docs.length} unclaimed notifications for customer: ${customerId}`);
  
          // Step 3: Delete each unclaimed notification
          for (const notificationDoc of notificationsSnapshot.docs) {
            const notificationRef = doc(db, "notifications", customerId, "notifications", notificationDoc.id);
            await deleteDoc(notificationRef);
            console.log(`Notification ${notificationDoc.id} for customer ${customerId} deleted successfully`);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting unclaimed notifications: ", error);
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
