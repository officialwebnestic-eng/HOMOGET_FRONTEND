import React, { useState } from 'react';
import {
  Pencil, Trash2, Home, Tag, IndianRupee,
  Building2, Globe,
  Bath, Bed, Ruler, Layers, Barcode, Wrench
} from 'lucide-react';
import useGetPropertyBuyUserId from '../../../hooks/useGetPropertyBuyUserId';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { notfound } from '../../../ExportImages';

import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';
const PropertyDetailsAgent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    propertyname: "",
    price: "",
    city: "",
    state: "",
  });
  const navigate = useNavigate();
  const limit = 6;
  const { theme } = useTheme();

  const { propertyList, loading, error, pagination, deletePropertyById } = useGetPropertyBuyUserId(currentPage, limit, filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deletePropertyById(id);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updatepropertydetails/${id}`);
  };

  // Color schemes based on theme
  const colors = {
    background: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    cardBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    inputBg: theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-200 focus:border-blue-500',
    buttonPrimary: theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700',
    buttonDanger: theme === 'dark' ? 'bg-red-900/50 hover:bg-red-800/50 text-red-300' : 'bg-red-100 hover:bg-red-200 text-red-600',
    paginationActive: theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white',
    paginationInactive: theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700',
    paginationBorder: theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
    tagBg: theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
    iconColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-500',
    propertyPrice: theme === 'dark' ? 'text-blue-300' : 'text-blue-600',
    propertyDetails: theme === 'dark' ? 'text-gray-400' : 'text-gray-700',
    notFoundBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    notFoundText: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    notFoundSubtext: theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${colors.background}`}>
      <div className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${colors.cardBg} ${colors.cardBorder} border`}>
        <h2 className={`text-2xl font-bold mb-6 font-sans ${colors.textPrimary}`}>Property Portfolio</h2>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: "propertyname", placeholder: "Search by Property Name" },
            { name: "price", placeholder: "Search by Price" },
            { name: "city", placeholder: "Search by City" },
            { name: "state", placeholder: "Search by State" },
          ].map(({ name, placeholder }) => (
            <input
              key={name}
              type="text"
              name={name}
              placeholder={placeholder}
              value={filters[name]}
              onChange={handleFilterChange}
              className={`px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${colors.inputBg} ${colors.textPrimary}`}
            />
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}`}></div>
          </div>
        ) : error ? (
          <div className={`text-center py-12 rounded-lg shadow-md max-w-md mx-auto ${colors.notFoundBg}`}>
            <div className="flex flex-col items-center justify-center p-6">
              <img
                src={notfound}
                className={`w-64 h-64 object-contain mb-4 ${theme === 'dark' ? 'opacity-80' : 'opacity-90'
                  }`}
                alt="No Blog Available"
              />
              <p className={`text-sm ${colors.notFoundSubtext}`}>
                {error.message || 'Unable to load properties. Please try again later.'}
              </p>
            </div>
          </div>
        ) : propertyList.length === 0 ? (
          <div className={`text-center py-12 rounded-lg shadow-md max-w-md mx-auto ${colors.notFoundBg}`}>
            <div className="flex flex-col items-center justify-center p-6">
              <div className={`w-64 h-64 flex items-center justify-center mb-4 ${theme === 'dark' ? 'opacity-80' : 'opacity-90'}`}>
                <Home className={`w-32 h-32 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-medium mb-2 ${colors.notFoundText}`}>
                No Properties Listed
              </h3>
              <p className={`text-sm ${colors.notFoundSubtext}`}>
                You haven't listed any properties yet. Add your first property to get started.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyList.map((property) => (
                <div
                  key={property._id}
                  className={`border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${colors.cardBg} ${colors.cardBorder} hover:border-blue-400/50`}
                >
                  <Swiper
                    spaceBetween={10}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    loop={true}
                    modules={[Autoplay, Pagination]}
                    className="w-full h-56"
                  >
                    {property.image?.map((img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={img}
                          alt={`Property ${index}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-lg font-bold line-clamp-1 ${colors.textPrimary}`}>{property.propertyname}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${colors.tagBg}`}>
                        {property.listingtype}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className={`text-sm flex items-center gap-2 ${colors.propertyDetails}`}>
                        <Home className={`w-4 h-4 ${colors.iconColor}`} />
                        <span className="font-medium">{property.propertytype}</span>
                      </p>
                      <p className={`font-bold text-lg flex items-center gap-2 ${colors.propertyPrice}`}>
                        <IndianRupee className="w-5 h-5" />
                        {new Intl.NumberFormat('en-IN').format(property.price)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                      <div className={`flex items-center gap-2 ${colors.propertyDetails}`}>
                        <Building2 className="w-4 h-4" />
                        <span>{property.city}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${colors.propertyDetails}`}>
                        <Globe className="w-4 h-4" />
                        <span>{property.state}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${colors.propertyDetails}`}>
                        <Bath className="w-4 h-4" />
                        <span>{property.bathroom} Bath</span>
                      </div>
                      <div className={`flex items-center gap-2 ${colors.propertyDetails}`}>
                        <Bed className="w-4 h-4" />
                        <span>{property.bedroom} Bed</span>
                      </div>
                      <div className={`flex items-center gap-2 ${colors.propertyDetails}`}>
                        <Ruler className="w-4 h-4" />
                        <span>{property.squarefoot} sqft</span>
                      </div>
                      <div className={`flex items-center gap-2 ${colors.propertyDetails}`}>
                        <Layers className="w-4 h-4" />
                        <span>Floor {property.floor}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">

                      <PermissionProtectedAction action="update" module="Property Management">
                        <button
                          onClick={() => handleUpdate(property._id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${colors.buttonPrimary} text-white`}
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                      </PermissionProtectedAction>


                      <PermissionProtectedAction action="delete" module="Property Management">
                        <button
                          onClick={() => handleDelete(property._id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${colors.buttonDanger}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </PermissionProtectedAction>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-lg hover:bg-opacity-80 disabled:opacity-50 transition-colors duration-200 ${colors.paginationBorder} ${colors.paginationInactive}`}
                >
                  Previous
                </button>
                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 mx-1 rounded-lg transition-colors duration-200 ${currentPage === pageNum ? colors.paginationActive : colors.paginationInactive
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className={`px-4 py-2 border rounded-lg hover:bg-opacity-80 disabled:opacity-50 transition-colors duration-200 ${colors.paginationBorder} ${colors.paginationInactive}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailsAgent;