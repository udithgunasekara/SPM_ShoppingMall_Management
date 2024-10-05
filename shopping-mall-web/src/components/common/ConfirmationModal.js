// components/common/ConfirmationModal.js
import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4" aria-label="Confirmation Message">
          {message}
        </h3>
        <div className="flex justify-between space-x-3">
          <button
            type="button"
            className="w-full py-2 px-4 border shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
            onClick={onConfirm}
            disabled={isLoading}
            aria-label="Confirm Action"
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
          <button
            type="button"
            className="w-full py-2 px-4 border shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
            onClick={onClose}
            aria-label="Cancel Action"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
