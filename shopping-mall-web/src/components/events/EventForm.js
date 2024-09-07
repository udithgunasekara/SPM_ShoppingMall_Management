import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const EventForm = ({ isOpen, onClose, editingEvent }) => {
  const { addEvent, updateEvent } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    bannerImage: null,
    altText: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        ...editingEvent,
        date: editingEvent.date ? new Date(editingEvent.date).toISOString().split('T')[0] : '',
        time: editingEvent.time || '',
      });
      setImagePreview(editingEvent.bannerImage || null);
    } else {
      setFormData({
        name: '',
        date: '',
        time: '',
        location: '',
        bannerImage: null,
        altText: '',
      });
      setImagePreview(null);
    }
  }, [editingEvent]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'bannerImage' && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      alert("Please fill in the date and time correctly.");
      return;
    }

    const eventData = {
      ...formData,
      date: new Date(formData.date).toISOString(),  // Convert date to string format
    };

    if (editingEvent) {
      await updateEvent({ ...editingEvent, ...eventData });
    } else {
      await addEvent(eventData);
    }
    onClose(); // Close the form after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border rounded-lg shadow-xl bg-white max-w-md w-full md:w-96 lg:w-[450px] transition-all duration-300 ease-in-out">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
          <p className="text-sm text-gray-500">Please fill out the form below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name"
              aria-label="Event Name"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                aria-label="Event Date"
                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                aria-label="Event Time"
                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              aria-label="Event Location"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">Event Banner</label>
            <input
              type="file"
              name="bannerImage"
              accept="image/*"
              onChange={handleChange}
              aria-label="Upload event banner image"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Banner Preview" className="max-w-full h-auto mx-auto" />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="altText" className="block text-sm font-medium text-gray-700 mb-1">Banner Alt Text</label>
            <input
              type="text"
              name="altText"
              value={formData.altText}
              onChange={handleChange}
              placeholder="Enter alt text for banner image"
              aria-label="Banner Alt Text"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-between space-x-3">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ease-in-out"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
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

export default EventForm;
