import React, { useState } from 'react';
import EventsContent from '../components/events/EventsContent';
import EventForm from '../components/events/EventForm';

const Events = () => {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([
    { id: 1, name: 'Grand Opening', date: 'July 1, 2023', time: '10:00 AM - 6:00 PM', location: 'Main Plaza' }
  ]);

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
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
        setEvents={setEvents}
        events={events}
      />
    </div>
  );
};

export default Events;