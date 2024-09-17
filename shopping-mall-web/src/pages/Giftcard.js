import React, { useState } from 'react';
import ReadGiftcard from '../components/giftcard/ReadGiftcard';
import GiftcardForm from '../components/giftcard/GiftcardForm';
import { GiftcardProvider } from "../context/GiftcardContext";


const Giftcard = () => {
  const [isGiftcardFormOpen, setIsGiftcardFormOpen] = useState(false);
  const [editingGiftcard, setEditingGiftcard] = useState(null);
  const [giftcards, setGiftcards] = useState([]);
  

  const handleEditGiftcard = (giftcard) => {
    setEditingGiftcard(giftcard);
    setIsGiftcardFormOpen(true);
  };

  return (
    <GiftcardProvider>
      <div>
        <ReadGiftcard 
            setIsGiftcardFormOpen={setIsGiftcardFormOpen}
            handleEditGiftcard={handleEditGiftcard}
        />
        <GiftcardForm
          isOpen={isGiftcardFormOpen}
          onClose={() => {
          setIsGiftcardFormOpen(false);
          setEditingGiftcard(null);
          }}
          editingGiftcard={editingGiftcard}
        />
      </div>
    </GiftcardProvider>
  );
};
export default Giftcard;