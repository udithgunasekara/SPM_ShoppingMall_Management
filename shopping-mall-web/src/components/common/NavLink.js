import React from 'react';

const NavLink = ({ icon, text, tab, activeTab, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-2 rounded-lg ${activeTab === tab ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
  >
    {icon}
    <span className="ml-3">{text}</span>
  </button>
);

export default NavLink;