import React from 'react';

const PromotionsContent = ({ promotions, handleEditPromotion, handleDeletePromotion, setIsPromotionFormOpen }) => {
  return (
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
};

export default PromotionsContent;