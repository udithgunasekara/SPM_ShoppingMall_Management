import { useEffect, useState } from "react";
import React from "react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";

const AddProduct = () => {
  // State variables for each field
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Received ID in AddProduct: ", id);

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [sizes, setSizes] = useState([]);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [stocks, setStocks] = useState("");
  const [colors, setColors] = useState([]);
  const [material, setMaterial] = useState("");

  // Initialize Firestore and Storage
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!id) return; // Exit if id is not available

        const docRef = doc(db, "Store Products", id);
        const docSnap = await getDoc(docRef);

        console.log("Document Running");

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setBrand(data.brand || "");
          setSizes(data.sizes || []);
          setPrice(data.price || "");
          setCategory(data.category || "");
          setDescription(data.description || "");
          setStocks(data.stocks || "");
          setColors(data.colors || []);
          setMaterial(data.material || "");

          // Fetch images
          const imageUrls = await Promise.all(
            (data.images || []).map(async (imagePath) => {
              const imageRef = ref(storage, `Products/${imagePath}`);
              return await getDownloadURL(imageRef);
            })
          );
          setImages(imageUrls);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting product: ", error);
      }
    };

    fetchProductData();
  }, [id, db, storage]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload images to Firebase Storage and get download URLs
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `Products/${image.name}`);
          await uploadBytes(storageRef, image);
          return await getDownloadURL(storageRef);
        })
      );

      const productData = {
        title,
        brand,
        sizes,
        price,
        category,
        description,
        images: imageUrls,
        stocks,
        colors,
        material,
        updatedAt: new Date(), // Add a timestamp for updates
      };

      if (id) {
        // Update existing product
        const docRef = doc(db, "Store Products", id);
        await updateDoc(docRef, productData);
        alert("Product updated successfully!");
        navigate("/productList");
      } else {
        // Add new product
        await addDoc(collection(db, "Store Products"), {
          ...productData,
          createdAt: new Date(), // Add a timestamp for new products
        });
        alert("Product added successfully!");
        navigate("/productList");
      }
    } catch (error) {
      console.error("Error saving product: ", error);
      alert("Failed to save product.");
    }
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    setSizes((prevSizes) => {
      if (prevSizes.includes(size)) {
        // Remove size if already selected
        return prevSizes.filter((s) => s !== size);
      } else {
        // Add size if not selected
        return [...prevSizes, size];
      }
    });
  };

  // Handle color selection
  const handleColorChange = (color) => {
    setColors((prevColors) => {
      if (prevColors.includes(color)) {
        return prevColors.filter((c) => c !== color);
      } else {
        return [...prevColors, color];
      }
    });
  };

  return (
    // relative top-20 mx-auto p-5 border rounded-lg shadow-xl bg-white max-w-md w-full md:w-96 lg:w-[450px] transition-all duration-300 ease-in-out

    <div class="relative top-2 mx-auto p-5 border rounded-lg shadow-xl bg-white max-w-md w-full md:w-96 lg:w-[450px] transition-all duration-300 ease-in-out">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          {" "}
          {id ? "Update Product" : "Add New Product"}
        </h2>
        <p class="text-sm text-gray-500">
          {id ? "Please update the product" : "Please fill out the form below"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Title */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter product title"
              required
            />
          </div>

          {/* Brand */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter brand"
              required
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sizes
          </label>
          <div className="flex justify-around space-x-4">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-800 font-medium">{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
          {/* Price */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter price"
              required
            />
          </div>
        </div>

        {/* Colors */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Colors
          </label>
          <div className="flex justify-around space-x-4">
            {["Red", "Blue", "Green", "Black", "White"].map((color) => (
              <label key={color} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={colors.includes(color)}
                  onChange={() => handleColorChange(color)}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-800 font-medium">{color}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter product description"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Stock Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              value={stocks}
              onChange={(e) => setStocks(e.target.value)}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter stocks"
              required
            />
          </div>

          {/* Material */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter material"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter product"
              required
            />
          </div>
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500"
          />
        </div>

        {/* Submit Button */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ease-in-out">
            {id ? "Update Product" : "Add Product"}
          </button>
          <button
            onClick={() => navigate("/productList")}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 ease-in-out">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
