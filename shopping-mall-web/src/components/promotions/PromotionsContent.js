import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAppContext } from '../../context/AppContext';

const PromotionsContent = ({ handleEditPromotion, handleDeletePromotion, setIsPromotionFormOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfDownloadProgress, setPdfDownloadProgress] = useState(0);

  const { promotions } = useAppContext();  // Get promotions from context

  useEffect(() => {
    console.log('Promotions updated:', promotions);
  }, [promotions]);

  const handlePreviewImage = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const generateAndDownloadPDF = async (promotion) => {
    try {
      setPdfDownloadProgress(10); // Start progress
      const doc = new jsPDF();

      // Set fonts
      doc.setFont("helvetica", "bold");

      // Add header
      doc.setFontSize(24);
      doc.setTextColor(41, 128, 185); // Blue color
      doc.text('Promotion Details', 105, 20, { align: 'center' });

      // Add promotion details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black color
      doc.setFont("helvetica", "normal");

      const details = [
        ['Name', promotion.name],
        ['Discount', `${promotion.discount}%`],
        ['Duration', promotion.duration],
      ];

      doc.autoTable({
        startY: 30,
        head: [['Property', 'Value']],
        body: details,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      setPdfDownloadProgress(50); // Midway progress

      // Add image (if available)
      if (promotion.bannerImage) {
        const imgData = await fetch(promotion.bannerImage)
          .then((res) => res.blob());

        const base64 = await convertBlobToBase64(imgData);
        const imgProps = doc.getImageProperties(base64);
        const imgWidth = doc.internal.pageSize.getWidth() - 40;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        doc.addImage(base64, 'JPEG', 20, doc.lastAutoTable.finalY + 10, imgWidth, imgHeight);
      }

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} - Generated by Your App`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' },
        );
      }

      setPdfDownloadProgress(80); // Near completion

      // Download PDF
      const blob = await doc.output('blob');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `promotion_${promotion.id}.pdf`;
      link.click();
      setPdfDownloadProgress(100); // Complete
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setPdfDownloadProgress(0);
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const filteredPromotions = promotions.filter((promotion) =>
    promotion?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Promotions Management</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6 space-x-4">
          <input
            type="text"
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          />
          <button
            onClick={() => setIsPromotionFormOpen(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Add New Promotion
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromotions.map((promotion) => (
                <tr
                  key={promotion.id}
                  className="hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {promotion.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.discount}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.bannerImage && (
                      <img
                        src={promotion.bannerImage}
                        alt="Banner Thumbnail"
                        className="w-24 h-16 object-cover cursor-pointer"
                        onClick={() => handlePreviewImage(promotion.bannerImage)}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center space-x-2">
                    <button
                      onClick={() => handleEditPromotion(promotion)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 hover:bg-blue-200 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 hover:bg-red-200 transition duration-300"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => generateAndDownloadPDF(promotion)}
                      className="text-green-600 hover:text-green-800 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 hover:bg-green-200 transition duration-300"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <Modal onClose={handleCloseModal}>
          <img src={selectedImage} alt="Banner Preview" className="max-w-full h-auto mx-auto" />
        </Modal>
      )}

      {/* Progress indicator for PDF download */}
      {pdfDownloadProgress > 0 && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          PDF Download Progress: {pdfDownloadProgress.toFixed(2)}%
        </div>
      )}
    </div>
  );
};

export default PromotionsContent;
