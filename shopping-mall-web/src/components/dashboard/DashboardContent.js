import React from 'react';
import SalesChart from './SalesChart';

const DashboardContent = ({ setIsPromotionFormOpen, setIsEventFormOpen }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <SalesChart />
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
};

export default DashboardContent;