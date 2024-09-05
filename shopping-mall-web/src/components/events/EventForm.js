import React, { useState, useEffect } from 'react';

const EventForm = ({ isOpen, onClose, editingEvent, setEvents, events }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: ''
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData(editingEvent);
    } else {
      setFormData({ name: '', date: '', time: '', location: '' });
    }
  }, [editingEvent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      const updatedEvents = events.map(ev =>
        ev.id === editingEvent.id ? { ...ev, ...formData } : ev
      );
      setEvents(updatedEvents);
    } else {
      setEvents([...events, { ...formData, id: Date.now() }]);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-2 px-7 py-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Event Name"
              className="mb-3 px-3 py-2 border rounded-lg w-full"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mb-3 px-3 py-2 border rounded-lg w-full"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mb-3 px-3 py-2 border rounded-lg w-full"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="mb-3 px-3 py-2 border rounded-lg w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              {editingEvent ? 'Update Event' : 'Add Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;