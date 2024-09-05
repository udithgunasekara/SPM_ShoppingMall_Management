import React from 'react';

const EventsContent = ({ events, handleEditEvent, handleDeleteEvent, setIsEventFormOpen }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Events Management</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search events..."
            className="border rounded-lg px-4 py-2 w-64"
          />
          <button onClick={() => setIsEventFormOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
            Add New Event
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{event.name}</h3>
              <p className="text-sm text-gray-600 mb-2">Date: {event.date}</p>
              <p className="text-sm text-gray-600 mb-2">Time: {event.time}</p>
              <p className="text-sm text-gray-600 mb-2">Location: {event.location}</p>
              <button onClick={() => handleEditEvent(event)} className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
              <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsContent;