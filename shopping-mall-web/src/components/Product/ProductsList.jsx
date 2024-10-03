import React, { useEffect, useState, useRef } from "react";
import {
  getFirestore,
  collection,
  ref,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode"; // Import the barcode component
import { jsPDF } from "jspdf";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const barcodeRefs = useRef({}); // Create a ref object to hold barcode refs
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
    setSelectedProductImages(images);
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedProductImages([]);
    setSelectedImageIndex(0);
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
    if (!barcodeRefs.current[id]) {
      console.error(`Barcode ref for id ${id} is not defined`);
      return;
    }

    const svgElement = barcodeRefs.current[id].querySelector("svg"); // Get the SVG element from the Barcode component
    if (svgElement) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const scaleFactor = 2; // Adjust this value to resize the image
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${title}-barcode.png`;
        link.click();

        URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.title &&
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadProductList = () => {
    const doc = new jsPDF();

    // Add a title
    doc.setFontSize(20);
    doc.text("Product List", 14, 22);

    // Add column headers
    doc.setFontSize(12);
    const headers = ["Title", "Brand", "Category", "Stocks"];
    const data = filteredProducts.map((product) => [
      product.title,
      product.brand,
      product.category,
      product.stocks,
    ]);

    // Calculate the starting position for the table
    const startY = 30;

    // Draw the headers
    headers.forEach((header, index) => {
      doc.text(header, 14 + index * 40, startY);
    });

    // Draw the data rows
    data.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        doc.text(
          cell.toString(),
          14 + cellIndex * 40,
          startY + (rowIndex + 1) * 10
        );
      });
    });

    // Save the PDF
    doc.save("product-list.pdf");
  };

  const deleteProduct = (id) => {
    const productRef = doc(db, "Store Products", id);
    deleteDoc(productRef)
      .then(() => {
        console.log("Document successfully deleted!");
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Product List</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6 space-x-4">
          <input
            type="text"
            placeholder="Search Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          />
          <div className="pl-96">
            <div className="pl-64">
              <button
                onClick={downloadProductList}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                Download Report
              </button>
            </div>
          </div>
          <button
            onClick={() => navigate("/add")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
            Add New Product
          </button>
        </div>
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
              {filteredProducts.map((product) => (
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
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div
                      className="w-60 h-20"
                      ref={(el) => (barcodeRefs.current[product.id] = el)}>
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
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 hover:bg-red-200 transition duration-300">
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadBarcode(product.id, product.title)
                      }
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
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={showPreviousImage}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                Previous
              </button>
              <button
                onClick={showNextImage}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                Next
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
