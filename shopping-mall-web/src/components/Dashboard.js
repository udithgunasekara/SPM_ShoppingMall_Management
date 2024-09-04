import React, { useState, useEffect } from 'react';
import { FiMenu, FiSearch, FiBell, FiUser, FiPlus, FiCalendar, FiBarChart2, FiUsers, FiX } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [promotions, setPromotions] = useState([
    { id: 1, name: 'Summer Sale', discount: '20%', duration: 'Jun 1 - Aug 31' }
  ]);
  const [events, setEvents] = useState([
    { id: 1, name: 'Grand Opening', date: 'July 1, 2023', time: '10:00 AM - 6:00 PM', location: 'Main Plaza' }
  ]);
  const [isPromotionFormOpen, setIsPromotionFormOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const NavLink = ({ icon, text, tab }) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`flex items-center p-2 rounded-lg ${activeTab === tab ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </button>
  );

  const NavBar = () => (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-auto" src="https://via.placeholder.com/50" alt="Logo" />
            </div>
            {!isMobile && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink icon={<FiBarChart2 className="mr-2" />} text="Dashboard" tab="dashboard" />
                  <NavLink icon={<FiPlus className="mr-2" />} text="Promotions" tab="promotions" />
                  <NavLink icon={<FiCalendar className="mr-2" />} text="Events" tab="events" />
                  <NavLink icon={<FiBarChart2 className="mr-2" />} text="Reports" tab="reports" />
                  <NavLink icon={<FiUsers className="mr-2" />} text="User Management" tab="users" />
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-100 rounded-full py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
              </div>
              <button className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FiBell className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div>
                  <button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/50" alt="User" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {isMobile && isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink icon={<FiBarChart2 className="mr-2" />} text="Dashboard" tab="dashboard" />
            <NavLink icon={<FiPlus className="mr-2" />} text="Promotions" tab="promotions" />
            <NavLink icon={<FiCalendar className="mr-2" />} text="Events" tab="events" />
            <NavLink icon={<FiBarChart2 className="mr-2" />} text="Reports" tab="reports" />
            <NavLink icon={<FiUsers className="mr-2" />} text="User Management" tab="users" />
          </div>
        </div>
      )}
    </nav>
  );

  const DashboardContent = () => (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <Line data={chartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex space-x-4">
            <button onClick={() => setIsPromotionFormOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Add New Promotion
            </button>
            <button onClick={() => setIsEventFormOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
              Add New Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PromotionsContent = () => (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Promotions Management</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search promotions..."
            className="border rounded-lg px-4 py-2 w-64"
          />
          <button onClick={() => setIsPromotionFormOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Add New Promotion
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Discount</th>
              <th className="text-left p-2">Duration</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promotion) => (
              <tr key={promotion.id}>
                <td className="p-2">{promotion.name}</td>
                <td className="p-2">{promotion.discount}</td>
                <td className="p-2">{promotion.duration}</td>
                <td className="p-2">
                  <button onClick={() => handleEditPromotion(promotion)} className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                  <button onClick={() => handleDeletePromotion(promotion.id)} className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const EventsContent = () => (
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

  const PromotionForm = ({ isOpen, onClose, editingPromotion }) => {
    const [formData, setFormData] = useState({
      name: '',
      discount: '',
      duration: ''
    });

    useEffect(() => {
      if (editingPromotion) {
        setFormData(editingPromotion);
      } else {
        setFormData({ name: '', discount: '', duration: '' });
      }
    }, [editingPromotion]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingPromotion) {
        const updatedPromotions = promotions.map(p =>
          p.id === editingPromotion.id ? { ...p, ...formData } : p
        );
        setPromotions(updatedPromotions);
      } else {
        setPromotions([...promotions, { ...formData, id: Date.now() }]);
      }
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
            </h3>
            <form onSubmit={handleSubmit} className="mt-2 px-7 py-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Promotion Name"
                className="mb-3 px-3 py-2 border rounded-lg w-full"
              />
              <input
                type="text"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="Discount"
                className="mb-3 px-3 py-2 border rounded-lg w-full"
              />
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Duration"
                className="mb-3 px-3 py-2 border rounded-lg w-full"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {editingPromotion ? 'Update Promotion' : 'Add Promotion'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const EventForm = ({ isOpen, onClose, editingEvent }) => {
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

  const handleEditPromotion = (promotion) => {
    setEditingPromotion(promotion);
    setIsPromotionFormOpen(true);
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="pt-16">
        {activeTab === 'dashboard' && <DashboardContent />}
        {activeTab === 'promotions' && <PromotionsContent />}
        {activeTab === 'events' && <EventsContent />}
      </div>
      <PromotionForm
        isOpen={isPromotionFormOpen}
        onClose={() => {
          setIsPromotionFormOpen(false);
          setEditingPromotion(null);
        }}
        editingPromotion={editingPromotion}
      />
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(null);
        }}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default Dashboard;