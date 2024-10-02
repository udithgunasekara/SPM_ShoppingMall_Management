import React, { useEffect, useState, useRef } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode"; // Import the barcode component

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // State for the current image index
  const [selectedProductImages, setSelectedProductImages] = useState([]); // State for the selected product images
  const barcodeRefs = useRef({});
  const db = getFirestore();
  const navigate = useNavigate();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Store Products"));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  const updateProduct = (id) => {
    navigate(`/update-product/${id}`);
  };

  const handlePreviewImage = (images, index) => {
    setSelectedProductImages(images); // Set the selected product's images
    setSelectedImageIndex(index); // Set the index of the clicked image
  };

  const handleCloseModal = () => {
    setSelectedProductImages([]); // Close the modal by resetting the images
    setSelectedImageIndex(0); // Reset the index
  };

  const showNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === selectedProductImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedProductImages.length - 1 : prevIndex - 1
    );
  };

  const handleDownloadBarcode = (id, title) => {
    const svgElement = barcodeRefs.current[id].querySelector("svg"); // Get the SVG element from the Barcode component
    if (svgElement) {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Create an image from the SVG
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the SVG image on the canvas
        ctx.drawImage(img, 0, 0);

        // Convert canvas to PNG
        const pngUrl = canvas.toDataURL("image/png");

        // Create a download link
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${title}-barcode.png`;
        link.click();

        // Clean up URL object
        URL.revokeObjectURL(url);
      };

      // Set the image source to the SVG blob URL
      img.src = url;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Product List</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stocks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition duration-200 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stocks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {product.images.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="h-16 w-16 object-cover rounded-lg cursor-pointer"
                          onClick={() =>
                            handlePreviewImage(product.images, index)
                          } // Open image preview on click
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="w-60 h-20">
                      <Barcode
                        value={product.id}
                        width={0.7}
                        height={40}
                        fontSize={11}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center space-x-2">
                    <button
                      onClick={() => updateProduct(product.id)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 hover:bg-blue-200 transition duration-300">
                      Update
                    </button>
                    <button className="text-red-600 hover:text-red-800 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 hover:bg-red-200 transition duration-300">
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadBarcode(product.id, product.title)
                      } // Handle barcode download
                      className="text-green-600 hover:text-green-800 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 hover:bg-green-200 transition duration-300">
                      Bar Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedProductImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
            <img
              src={selectedProductImages[selectedImageIndex]}
              alt={`Product Image ${selectedImageIndex + 1}`}
              className="max-w-full h-auto mx-auto"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={showPreviousImage}
                className="text-gray-600 hover:text-gray-800 px-10 py-2 rounded-full text-xs font-semibold bg-gray-200 hover:bg-gray-200 transition duration-300">
                Previous
              </button>
              <button
                onClick={showNextImage}
                className="text-gray-600 hover:text-gray-800 px-10 py-2 rounded-full text-xs font-semibold bg-gray-200 hover:bg-gray-200 transition duration-300">
                Next
              </button>
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-5 text-red-100 hover:text-red-800 px-10 py-2 rounded-full text-xs font-semibold bg-red-800 hover:bg-red-200 transition duration-300">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
