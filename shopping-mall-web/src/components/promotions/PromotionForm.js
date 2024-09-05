import React, { useState, useEffect } from 'react';

const PromotionForm = ({ isOpen, onClose, editingPromotion, setPromotions, promotions }) => {
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

export default PromotionForm;