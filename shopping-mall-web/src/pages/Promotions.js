import React, { useState } from 'react';
import PromotionsContent from '../components/promotions/PromotionsContent';
import PromotionForm from '../components/promotions/PromotionForm';

const Promotions = () => {
  const [isPromotionFormOpen, setIsPromotionFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [promotions, setPromotions] = useState([
    { id: 1, name: 'Summer Sale', discount: '20%', duration: 'Jun 1 - Aug 31' }
  ]);

  const handleEditPromotion = (promotion) => {
    setEditingPromotion(promotion);
    setIsPromotionFormOpen(true);
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  return (
    <div>
      <PromotionsContent
        promotions={promotions}
        handleEditPromotion={handleEditPromotion}
        handleDeletePromotion={handleDeletePromotion}
        setIsPromotionFormOpen={setIsPromotionFormOpen}
      />
      <PromotionForm
        isOpen={isPromotionFormOpen}
        onClose={() => {
          setIsPromotionFormOpen(false);
          setEditingPromotion(null);
        }}
        editingPromotion={editingPromotion}
        setPromotions={setPromotions}
        promotions={promotions}
      />
    </div>
  );
};

export default Promotions;
