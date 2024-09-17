import React, { useState, useEffect } from "react";
import { useGiftcardContext } from "../../context/GiftcardContext";

const ReadGiftcard = ({ setIsGiftcardFormOpen, handleEditGiftcard }) => {
  const { giftCard, deleteGiftCard } = useGiftcardContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterdata, setFilterData] = useState([]);

  //search function
  useEffect(() => {
    if (searchTerm === "") {
      setFilterData(giftCard); // If no search term, display all data
    } else {
      const filtered = giftCard.filter(
        (item) =>
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.store?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilterData(filtered);
    }
  }, [searchTerm, giftCard]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Giftcard Management</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6 space-x-4">
          <input
            type="text"
            placeholder="Search Giftcard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          />
          <button
            onClick={() => setIsGiftcardFormOpen(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Add New Giftcard
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Store
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  validity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterdata.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.store}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.validity.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center space-x-2">
                    <button
                      onClick={() => handleEditGiftcard(item)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 hover:bg-blue-200 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGiftCard(item.id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 hover:bg-red-200 transition duration-300"
                    >
                      Delete
                    </button>
                    {/* <button onClick={() => generateAndDownloadPDF(promotion)} className="text-green-600 hover:text-green-800 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 hover:bg-green-200 transition duration-300">PDF</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ReadGiftcard;
