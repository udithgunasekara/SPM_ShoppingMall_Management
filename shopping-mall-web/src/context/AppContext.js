import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebaseConfig';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [promotions, setPromotions] = useState([]);

  // Fetch events from Firebase
  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
      return eventsData;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  };

  // Add new event
  const addEvent = async (newEvent) => {
    try {
      let imageUrl = null;
      if (newEvent.bannerImage) {
        const imageRef = ref(storage, `event-images/${newEvent.bannerImage.name}`);
        await uploadBytes(imageRef, newEvent.bannerImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const eventData = {
        ...newEvent,
        bannerImage: imageUrl,
      };

      const docRef = await addDoc(collection(db, "events"), eventData);
      const newEventWithId = { ...eventData, id: docRef.id };
      setEvents([...events, newEventWithId]);
      return newEventWithId;
    } catch (error) {
      console.error("Error adding event: ", error);
      throw error;
    }
  };

  // Update event
  const updateEvent = async (updatedEvent) => {
    try {
      let imageUrl = updatedEvent.bannerImage;
      if (updatedEvent.bannerImage instanceof File) {
        const imageRef = ref(storage, `event-images/${updatedEvent.bannerImage.name}`);
        await uploadBytes(imageRef, updatedEvent.bannerImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const eventData = {
        ...updatedEvent,
        bannerImage: imageUrl,
      };

      const eventRef = doc(db, "events", updatedEvent.id);
      await updateDoc(eventRef, eventData);
      setEvents(events.map(e => e.id === updatedEvent.id ? { ...eventData, id: updatedEvent.id } : e));
      return eventData;
    } catch (error) {
      console.error("Error updating event: ", error);
      throw error;
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    try {
      const eventToDelete = events.find(e => e.id === id);
      if (eventToDelete && eventToDelete.bannerImage) {
        const imageRef = ref(storage, eventToDelete.bannerImage);
        await deleteObject(imageRef);
      }

      const eventRef = doc(db, "events", id);
      await deleteDoc(eventRef);
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error("Error deleting event: ", error);
      throw error;
    }
  };

  // Fetch promotions from Firebase
  const fetchPromotions = async () => {
    try {
      const promotionsCollection = collection(db, "promotions");
      const promotionsSnapshot = await getDocs(promotionsCollection);
      const promotionsData = promotionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPromotions(promotionsData);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Add new promotion
  const addPromotion = async (newPromotion) => {
    try {
      let imageUrl = null;
      if (newPromotion.bannerImage) {
        const imageRef = ref(storage, `promotion-images/${newPromotion.bannerImage.name}`);
        await uploadBytes(imageRef, newPromotion.bannerImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const promotionData = {
        ...newPromotion,
        bannerImage: imageUrl,
      };

      const docRef = await addDoc(collection(db, "promotions"), promotionData);
      setPromotions([...promotions, { ...promotionData, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding promotion: ", error);
    }
  };

  // Update promotion
  const updatePromotion = async (updatedPromotion) => {
    try {
      let imageUrl = updatedPromotion.bannerImage;
      if (updatedPromotion.bannerImage instanceof File) {
        const imageRef = ref(storage, `promotion-images/${updatedPromotion.bannerImage.name}`);
        await uploadBytes(imageRef, updatedPromotion.bannerImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const promotionData = {
        ...updatedPromotion,
        bannerImage: imageUrl,
      };

      const promotionRef = doc(db, "promotions", updatedPromotion.id);
      await updateDoc(promotionRef, promotionData);
      setPromotions(promotions.map(p => p.id === updatedPromotion.id ? { ...promotionData, id: updatedPromotion.id } : p));
    } catch (error) {
      console.error("Error updating promotion: ", error);
    }
  };

  // Delete promotion
  const deletePromotion = async (id) => {
    try {
      const promotionToDelete = promotions.find(p => p.id === id);
      if (promotionToDelete && promotionToDelete.bannerImage) {
        const imageRef = ref(storage, promotionToDelete.bannerImage);
        await deleteObject(imageRef);
      }

      const promotionRef = doc(db, "promotions", id);
      await deleteDoc(promotionRef);
      setPromotions(promotions.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting promotion: ", error);
    }
  };

  return (
    <AppContext.Provider value={{
      events,
      fetchEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      promotions,
      fetchPromotions,
      addPromotion,
      updatePromotion,
      deletePromotion,
    }}>
      {children}
    </AppContext.Provider>
  );
};
