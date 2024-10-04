import React, { useState, useEffect } from "react";
import { useGiftcardContext } from "../../context/GiftcardContext";
import backgroundImage from "../../assets/images/wallhaven-kxkdp7.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dialog } from '@headlessui/react';

const ReadGiftcard = ({ setIsGiftcardFormOpen, handleEditGiftcard }) => {
  const { giftCard, deleteGiftCard } = useGiftcardContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterdata, setFilterData] = useState([]);


  //for delete confirmation
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [giftcardToDelete, setGiftcardToDelete] = useState(null);

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
 
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Giftcard Management", 14, 22);
    
    const tableColumn = ["Store", "Price", "Validity","shared", "Image"];
    const tableRows = [];

    filterdata.forEach((item) => {
      const rowData = [
        item.store,
        item.price,
        item.validity.toDate().toLocaleDateString(),
        item.ischecked ? "Shared" : "Not Shared",
        item.imageURL ? "Image Link" : "No image"
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 12, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
        4: { cellWidth: 40 }
      },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 4 && data.cell.raw === "Image Link") {
          data.cell.styles.textColor = [0, 0, 255]; // Blue color for hyperlinks
          data.cell.styles.fontStyle = 'bold';
        }
      },
      didDrawCell: function (data) {
        if (data.section === 'body' && data.column.index === 4 && data.cell.raw === "Image Link") {
          const item = filterdata[data.row.index];
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: item.imageURL });
        }
      }
    });

    doc.save("giftcard_management.pdf");
  };

  const handleDeleteClick = (item) => {
    setGiftcardToDelete(item); // Store the item to delete
    setIsDialogOpen(true); // Open the dialog
  };

  const confirmDelete = () => {
    if (giftcardToDelete) {
      deleteGiftCard(giftcardToDelete.id);
    }
    setIsDialogOpen(false); // Close the dialog after deletion
  };
  

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div
        className="flex-grow bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="min-h-screen w-full bg-black bg-opacity-50 p-6">
          <div className="container mx-auto bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">Giftcard Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6 space-x-4">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Search Giftcard..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-800 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsGiftcardFormOpen(true)}
                    // className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                    className="text-white hover:text-white px-4 py-3 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-900 transition duration-500"
                  >
                    Add New Giftcard git
                  </button> 

                  <button
                    onClick={generatePDF}
                    className="text-white hover:text-white px-4 py-3 rounded-full text-sm font-semibold bg-green-600 hover:bg-green-900 transition duration-500"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y table-auto divide-gray-800">
                  <thead className="bg-gray-900">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider"
                      >
                        Store
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider"
                      >
                        price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider"
                      >
                        validity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider"
                      >
                        Image
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y  divide-gray-900">
                    {filterdata.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-300 transition duration-300 ease-in-out"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-center text-base font-bold text-gray-900">
                          {item.store}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-base font-semibold text-gray-700">
                          {item.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center font-semibold text-base text-gray-700">
                          {item.validity.toDate().toLocaleDateString()}
                        </td>
                        {/* image column */}
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <div className="flex justify-center items-center">
                            {item.imageURL ? (
                              <img
                                src={item.imageURL}
                                alt={`${item.store} giftcard`}
                                className="h-16 w-16 object-cover rounded-md"
                              />
                            ) : (
                              <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-base flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handleEditGiftcard(item)}
                            className="text-blue-800 hover:text-white px-4 py-1 rounded-full text-sm font-semibold bg-blue-400 hover:bg-blue-700 transition duration-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="text-red-600 hover:text-white px-3 py-1 rounded-full text-sm font-semibold bg-red-300 hover:bg-red-600 transition duration-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* delete confirmation dialog */}
      {isDialogOpen && (
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75"
        >
          <div className="bg-white rounded-lg p-6 space-y-4">
            <Dialog.Title className="text-lg font-bold">Delete Giftcard</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this gift card? This action cannot be undone.
            </Dialog.Description>
            <div className="flex space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
export default ReadGiftcard;
