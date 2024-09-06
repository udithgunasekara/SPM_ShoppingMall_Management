import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../config/firebaseConfig';
import EventsContent from '../components/events/EventsContent';
import EventForm from '../components/events/EventForm';

const Events = () => {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const docRef = await addDoc(collection(db, "events"), newEvent);
      setEvents([...events, { id: docRef.id, ...newEvent }]);
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleUpdateEvent = async (updatedEvent) => {
    try {
      await updateDoc(doc(db, "events", updatedEvent.id), updatedEvent);
      setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  return (
    <div>
      <EventsContent
        events={events}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteEvent}
        setIsEventFormOpen={setIsEventFormOpen}
      />
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(null);
        }}
        editingEvent={editingEvent}
        onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
      />
    </div>
  );
};

export default Events;