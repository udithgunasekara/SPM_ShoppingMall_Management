import React, { useState, useEffect } from 'react';

const EventForm = ({ isOpen, onClose, editingEvent, setEvents, events }) => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        bannerImage: null,
        altText: ''
    });

    useEffect(() => {
        if (editingEvent) {
            setFormData(editingEvent);
        } else {
            setFormData({ name: '', date: '', time: '', location: '', bannerImage: null, altText: '' });
        }
    }, [editingEvent]);

    const handleChange = (e) => {
        if (e.target.name === 'bannerImage') {
            setFormData({...formData, bannerImage: e.target.files[0] });
        } else {
            setFormData({...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingEvent) {
            const updatedEvents = events.map(ev =>
                ev.id === editingEvent.id? {...ev,...formData } : ev
            );
            setEvents(updatedEvents);
        } else {
            setEvents([...events, {...formData, id: Date.now() }]);
        }
        onClose();
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
                    {/* Event Name */}
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

                    {/* Event Date and Time */}
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

                    {/* Event Location */}
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

                    {/* Banner Image */}
                    <div>
                        <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">Event Banner</label>
                        <input
                            type="file"
                            name="bannerImage"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleChange}
                            aria-label="Upload event banner image"
                            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required={editingEvent ? false : true}
                        />
                        {formData.bannerImage && (
                            <div className="mt-2">
                                <img src={URL.createObjectURL(formData.bannerImage)} alt="Banner Preview" className="max-w-full h-auto mx-auto" />
                            </div>
                        )}
                    </div>

                    {/* Alt Text */}
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

                    {/* Buttons */}
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
