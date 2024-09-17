import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiBarChart2, FiPlus, FiCalendar, FiUsers } from 'react-icons/fi';

const NavBar = ({ isMobile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
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
                  <Link to="/" className={`text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-gray-900 text-white' : ''}`}>
                    <FiBarChart2 className="mr-2" />
                    Dashboard
                  </Link>
                  <Link to="/promotions" className={`text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/promotions' ? 'bg-gray-900 text-white' : ''}`}>
                    <FiPlus className="mr-2" />
                    Promotions
                  </Link>
                  <Link to="/events" className={`text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/events' ? 'bg-gray-900 text-white' : ''}`}>
                    <FiCalendar className="mr-2" />
                    Events
                  </Link>                  
                  <Link to="/users" className={`text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/users' ? 'bg-gray-900 text-white' : ''}`}>
                    <FiUsers className="mr-2" />
                    User Management
                  </Link>
                  <Link to="/giftcard" className={`text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/giftcard' ? 'bg-gray-900 text-white' : ''}`}>
                    <FiUsers className="mr-2" />
                    Gift card
                  </Link>
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
            <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              <FiBarChart2 className="mr-2" />
              Dashboard
            </Link>
            <Link to="/promotions" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/promotions' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              <FiPlus className="mr-2" />
              Promotions
            </Link>
            <Link to="/events" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/events' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              <FiCalendar className="mr-2" />
              Events
            </Link>
            <Link to="/reports" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/reports' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              <FiBarChart2 className="mr-2" />
              Reports
            </Link>
            <Link to="/users" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/users' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              <FiUsers className="mr-2" />
              User Management
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
