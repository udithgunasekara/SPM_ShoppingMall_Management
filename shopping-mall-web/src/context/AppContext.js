import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [promotions, setPromotions] = useState([]);
  const [events, setEvents] = useState([]);

  // Promotions management
  const addPromotion = (newPromotion) => {
    setPromotions([...promotions, { ...newPromotion, id: Date.now() }]);
  };

  const updatePromotion = (updatedPromotion) => {
    setPromotions(promotions.map(p => p.id === updatedPromotion.id ? updatedPromotion : p));
  };

  const deletePromotion = (id) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  // Events management
  const addEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now() }]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      promotions, addPromotion, updatePromotion, deletePromotion,
      events, addEvent, updateEvent, deleteEvent
    }}>
      {children}
    </AppContext.Provider>
  );
};