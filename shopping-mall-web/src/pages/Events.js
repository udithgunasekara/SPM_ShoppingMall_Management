import React, { useState, useEffect } from 'react';
import EventsContent from '../components/events/EventsContent';
import EventForm from '../components/events/EventForm';
import { useAppContext } from '../context/AppContext';
import ConfirmationModal from '../components/common/ConfirmationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Events = () => {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { events, fetchEvents, deleteEvent } = useAppContext();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents();
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [fetchEvents]);

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(deleteEventId);
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openConfirmDeleteModal = (id) => {
    setDeleteEventId(id);
    setIsConfirmModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <EventsContent
        events={events}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={openConfirmDeleteModal}
        setIsEventFormOpen={setIsEventFormOpen}
        isDeleting={isDeleting}
      />
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(null);
        }}
        editingEvent={editingEvent}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteEvent}
        message="Are you sure you want to delete this event?"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Events;