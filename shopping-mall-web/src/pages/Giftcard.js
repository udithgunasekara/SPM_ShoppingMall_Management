import React, { useState } from 'react';
import { useEffect } from 'react';
import { collection, getDocs ,deleteDoc,doc} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import ReadGiftcard from '../components/giftcard/ReadGiftcard';
import GiftcardForm from '../components/giftcard/GiftcardForm';


const Giftcard = () => {
    const [isGiftcardFormOpen, setIsGiftcardFormOpen] = useState(false);
    const [editingGiftcard, setEditingGiftcard] = useState(null);
    const [giftcards, setGiftcards] = useState([]);

    //read data from firebase
    useEffect(() => {
        const fetchData = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "giftcard"));
            const dataarray = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
    
            setGiftcards(dataarray);
          } catch (error) {
            console.error("Error reading data: ", error);
          }
        };
    
        fetchData();
      }, []);
    
    const handleEditGiftcard = (giftcard) => {
        setEditingGiftcard(giftcard);
        setIsGiftcardFormOpen(true);
    };
    
    const handleDeleteGiftcard = async(id) => {
        try {
            await deleteDoc(doc(db, "giftcard", id));
            setGiftcards((prevGiftcards) => prevGiftcards.filter((giftcard) => giftcard.id !== id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
        
    };
    
    return (
        <div>
        <ReadGiftcard
            giftcards={giftcards}
            handleEditGiftcard={handleEditGiftcard}
            handleDeleteGiftcard={handleDeleteGiftcard}
            setIsGiftcardFormOpen={setIsGiftcardFormOpen}
        />
        <GiftcardForm
            isOpen={isGiftcardFormOpen}
            onClose={() => {
            setIsGiftcardFormOpen(false);
            setEditingGiftcard(null);
            }}
            editingGiftcard={editingGiftcard}
            setGiftcards={setGiftcards}
            giftcards={giftcards}
        />
        </div>
    );
};
export default Giftcard;