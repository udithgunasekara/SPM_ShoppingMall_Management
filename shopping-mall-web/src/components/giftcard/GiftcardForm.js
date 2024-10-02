import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { useGiftcardContext } from "../../context/GiftcardContext";

const GiftcardForm = ({
  isOpen,
  onClose,
  editingGiftcard,
}) => {
  const [formData, setFormData] = useState({
    store: "",
    price: "",
    validity: "",
    ischecked: false,
  });

  const [imageFile,setImageFile] = useState(null);
  const [imagePreview,setImagePreview] = useState(null);
  const { updateGiftCard,createGiftCard } = useGiftcardContext();
  // const [sendNotification, setSendNotification] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingGiftcard) {
        const giftcardData = {
          ...editingGiftcard,
          validity: editingGiftcard.validity
            ? new Date(editingGiftcard.validity.seconds * 1000)
                .toISOString()
                .split("T")[0] // Convert Timestamp to YYYY-MM-DD
            : "", // Default to empty if no validity
        };

        setFormData(giftcardData);
        setImagePreview(editingGiftcard.imageURL || null);
      } else {
        setFormData({ store: "", price: "", validity: "", ischecked: false });
        setImagePreview(null);
      }
    }
  }, [editingGiftcard, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, ischecked: e.target.checked });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    //create a preview 
    if(file){
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse the date string from the form data into a valid Date object
      const validityDate = new Date(formData.validity);
      console.log(validityDate);

      // Check if the date is valid
      if (isNaN(validityDate.getTime())) {
        throw new Error("Invalid date format");
      }
      // Convert the date to Firestore Timestamp
      const timestamp = Timestamp.fromDate(validityDate);

      if (editingGiftcard) {
        await updateGiftCard(editingGiftcard.id, {
          ...formData,
          validity: timestamp,
        },imageFile);        
      } else {
        await createGiftCard({
          store: formData.store,
          price: formData.price,
          validity: timestamp,
          ischecked: formData.ischecked,
        },imageFile);        
      }
      onClose();
    } catch (error) {
      console.error("Error submitting document: ", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border rounded-lg shadow-xl bg-white max-w-md w-full md:w-96 lg:w-[400px] transition-all duration-300 ease-in-out">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {editingGiftcard ? "Edit giftcard" : "Create New giftcard"}
          </h2>
          <p className="text-sm text-gray-500">
            Please fill out the form below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Promotion Name */}
          <div>
            <label
              htmlFor="store"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store name
            </label>
            <input
              type="text"
              name="store"
              value={formData.store}
              onChange={handleChange}
              placeholder="Enter store name"
              aria-label="store Name"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter the amount1"
              aria-label="Giftcard Amount"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="validity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Valid till
            </label>
            <input
              type="date"
              name="validity"
              value={formData.validity}
              onChange={handleChange}
              placeholder="Enter last valid date"
              aria-label="Valid date"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendNotification"
              checked={formData.ischecked}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="sendNotification"
              className="ml-2 block text-sm text-gray-900"
            >
              Send notification to loyalty point holders <br/>(once sent cannot be undone)
            </label>
          </div>

          {/* Current Image Preview */}
          <div className="mt-1">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Current Gift Card"
                className="w-full h-auto rounded-md mb-2"
              />
            )}
          </div>

          {/* Image File Input */}
          <div>
            <input
              type="file"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between space-x-3">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ease-in-out"
            >
              {editingGiftcard ? "Update Giftcard" : "Create Giftcard"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default GiftcardForm;
