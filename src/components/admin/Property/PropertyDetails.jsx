import React, { useState } from 'react'
import {
  Eye, Pencil, Trash2, MapPin, Home, Tag, IndianRupee,
  Bed, Bath, Ruler, Layers, Building2, Globe, Barcode, Wrench,
  Search, Filter, ChevronLeft, ChevronRight
} from 'lucide-react'
import useGetAllProperty from '../../../hooks/useGetAllProperty'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useNavigate } from "react-router-dom"
import { useTheme } from '../../../context/ThemeContext'

const PropertyDetails = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    propertyname: "",
    price: "",
    bedroom: "",
    bathroom: "",
    squarefoot: "",
    floor: "",
    zipcode: "",
    propertytype: "",
    listingtype: "",
    state: "",
    city: "",
    aminities: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()
  const { theme } = useTheme()
  const limit = 6
  const { propertyList, loading, error, pagination, deletePropertyById } = useGetAllProperty(currentPage, limit, filters)

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
    setCurrentPage(1)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deletePropertyById(id)
    }
  }

  const handleUpdate = (id) => {
    navigate(`/updatepropertydetails/${id}`)
  }

  // Theme-based colors for property types
  const propertyTypeColors = {
    light: {
      'House': 'bg-blue-100 text-blue-800',
      'Apartment': 'bg-purple-100 text-purple-800',
      'Condo': 'bg-green-100 text-green-800',
      'Villa': 'bg-amber-100 text-amber-800',
      'Commercial': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    },
    dark: {
      'House': 'bg-blue-900/30 text-blue-300',
      'Apartment': 'bg-purple-900/30 text-purple-300',
      'Condo': 'bg-green-900/30 text-green-300',
      'Villa': 'bg-amber-900/30 text-amber-300',
      'Commercial': 'bg-red-900/30 text-red-300',
      'default': 'bg-gray-800 text-gray-300'
    }
  }

  // Theme-based colors for listing types
  const listingTypeColors = {
    light: {
      'Sale': 'bg-teal-100 text-teal-800',
      'Rent': 'bg-orange-100 text-orange-800',
      'Lease': 'bg-indigo-100 text-indigo-800',
      'default': 'bg-gray-100 text-gray-800'
    },
    dark: {
      'Sale': 'bg-teal-900/30 text-teal-300',
      'Rent': 'bg-orange-900/30 text-orange-300',
      'Lease': 'bg-indigo-900/30 text-indigo-300',
      'default': 'bg-gray-800 text-gray-300'
    }
  }

  const getPropertyTypeColor = (type) => {
    return propertyTypeColors[theme][type] || propertyTypeColors[theme].default
  }

  const getListingTypeColor = (type) => {
    return listingTypeColors[theme][type] || listingTypeColors[theme].default
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  // Theme styles configuration
  const themeStyles = {
    light: {
      background: 'bg-gradient-to-br from-gray-50 to-cyan-50',
      card: 'bg-white border-gray-100',
      text: {
        primary: 'text-gray-800',
        secondary: 'text-gray-600',
        tertiary: 'text-gray-500',
      },
      input: 'bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500',
      button: {
        primary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
        secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200',
        edit: 'bg-green-500 hover:bg-green-600 text-white',
        delete: 'bg-red-500 hover:bg-red-600 text-white'
      },
      icon: {
        primary: 'text-cyan-600',
        secondary: 'text-gray-400'
      },
      featureIcon: {
        bed: 'bg-blue-100 text-blue-600',
        bath: 'bg-green-100 text-green-600',
        ruler: 'bg-purple-100 text-purple-600',
        layers: 'bg-amber-100 text-amber-600'
      }
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800',
      card: 'bg-gray-800 border-gray-700',
      text: {
        primary: 'text-gray-100',
        secondary: 'text-gray-300',
        tertiary: 'text-gray-400',
      },
      input: 'bg-gray-700 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400 text-white placeholder-gray-400',
      button: {
        primary: 'bg-cyan-700 hover:bg-cyan-600 text-white',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600',
        edit: 'bg-green-700 hover:bg-green-600 text-white',
        delete: 'bg-red-700 hover:bg-red-600 text-white'
      },
      icon: {
        primary: 'text-cyan-400',
        secondary: 'text-gray-500'
      },
      featureIcon: {
        bed: 'bg-blue-900/30 text-blue-300',
        bath: 'bg-green-900/30 text-green-300',
        ruler: 'bg-purple-900/30 text-purple-300',
        layers: 'bg-amber-900/30 text-amber-300'
      }
    }
  }

  const currentTheme = themeStyles[theme]

  return (
    <div className={`min-h-screen p-4 md:p-6 ${currentTheme.background}`}>
           <div className={`rounded-xl shadow-lg mb-6 border p-4 sm:p-6 ${currentTheme.card}`}>
  {/* Header Section */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
    <div>
      <h2 className={`text-xl sm:text-2xl font-bold ${currentTheme.text.primary}`}>
        Property Details
      </h2>
      <p className={`text-sm ${currentTheme.text.tertiary} mt-1`}>
        {propertyList?.length || '0'} properties in our collection
      </p>
    </div>

    {/* Filters & Search */}
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors shadow-sm ${currentTheme.button.secondary}`}
      >
        <Filter size={16} className={currentTheme.icon.primary} />
        <span className={currentTheme.text.secondary}>Filters</span>
      </button>

      <div className="relative flex-1 min-w-[180px] sm:min-w-[240px] md:min-w-[200px]">
        <Search
          size={16}
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.icon.secondary}`}
        />
        <input
          type="text"
          name="propertyname"
          placeholder="Search properties..."
          value={filters.propertyname}
          onChange={handleFilterChange}
          className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 outline-none shadow-sm ${currentTheme.input}`}
        />
      </div>
    </div>
  </div>

  {/* Expanded Filters */}
  {showFilters && (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4 pt-4 border-t ${currentTheme.card}`}
    >
      {[
        { name: "price", placeholder: "Price", icon: <IndianRupee size={14} /> },
        { name: "bedroom", placeholder: "Bedrooms", icon: <Bed size={14} /> },
        { name: "bathroom", placeholder: "Bathrooms", icon: <Bath size={14} /> },
        { name: "squarefoot", placeholder: "Square Foot", icon: <Ruler size={14} /> },
        { name: "floor", placeholder: "Floor", icon: <Layers size={14} /> },
        { name: "zipcode", placeholder: "Zipcode", icon: <Barcode size={14} /> },
        { name: "propertytype", placeholder: "Property Type", icon: <Home size={14} /> },
        { name: "listingtype", placeholder: "Listing Type", icon: <Tag size={14} /> },
        { name: "city", placeholder: "City", icon: <Building2 size={14} /> },
        { name: "state", placeholder: "State", icon: <Globe size={14} /> },
        { name: "aminities", placeholder: "Amenities", icon: <Wrench size={14} /> },
      ].map(({ name, placeholder, icon }) => (
        <div key={name} className="relative">
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${currentTheme.icon.secondary}`}
          >
            {icon}
          </div>
          <input
            type="text"
            name={name}
            placeholder={placeholder}
            value={filters[name]}
            onChange={handleFilterChange}
            className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 outline-none shadow-sm ${currentTheme.input}`}
          />
        </div>
      ))}
      {/* Clear Filters Button */}
      <div className="flex items-end">
        <button
          onClick={() =>
            setFilters({
              propertyname: "",
              price: "",
              bedroom: "",
              bathroom: "",
              squarefoot: "",
              floor: "",
              zipcode: "",
              propertytype: "",
              listingtype: "",
              state: "",
              city: "",
              aminities: "",
            })
          }
          className={`w-full py-2 text-sm rounded-lg transition-colors shadow-sm ${currentTheme.button.secondary}`}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )}
</div>
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}



        {/* Property Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className={`rounded-xl shadow-lg p-8 text-center border ${currentTheme.card}`}>
            <p className="text-red-500 font-medium">Error loading properties. Please try again.</p>
          </div>
        ) : propertyList.length === 0 ? (
          <div className={`rounded-xl shadow-lg p-8 text-center border ${currentTheme.card}`}>
            <p className={currentTheme.text.secondary}>No properties found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyList.map((property) => (
                <div key={property._id} className={`rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border ${currentTheme.card}`}>
                  {/* Image Slider */}
                  <Swiper
                    spaceBetween={10}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={true}
                    modules={[Autoplay, Pagination]}
                    className="w-full h-48"
                  >
                    {property.image?.map((img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={img}
                          alt={`Property ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Property Details */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-xl font-bold ${currentTheme.text.primary}`}>{property.propertyname}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPropertyTypeColor(property.propertytype)}`}>
                        {property.propertytype}
                      </span>
                    </div>

                    <p className={`${currentTheme.text.secondary} text-sm mb-3 flex items-center gap-1`}>
                      <MapPin size={14} className={currentTheme.icon.primary} />
                      {property.city}, {property.state}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'} flex items-center`}>
                        <IndianRupee size={20} className="mr-1" />
                        {formatPrice(property.price)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getListingTypeColor(property.listingtype)}`}>
                        {property.listingtype}
                      </span>
                    </div>

                    {/* Property Features */}
                    <div className={`grid grid-cols-2 gap-3 text-sm mb-5 ${currentTheme.text.secondary}`}>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${currentTheme.featureIcon.bed}`}>
                          <Bed size={14} />
                        </div>
                        <span>{property.bedroom} Beds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${currentTheme.featureIcon.bath}`}>
                          <Bath size={14} />
                        </div>
                        <span>{property.bathroom} Baths</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${currentTheme.featureIcon.ruler}`}>
                          <Ruler size={14} />
                        </div>
                        <span>{property.squarefoot} sqft</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${currentTheme.featureIcon.layers}`}>
                          <Layers size={14} />
                        </div>
                        <span>Floor {property.floor}</span>
                      </div>
                    </div>

                    {/* Amenities */}
                   <div className="flex flex-wrap gap-2 mb-4">
                  {property.aminities &&
                    Array.isArray(property.aminities) &&
                    property.aminities.map((item, index) => {
                      try {
                        const parsed = JSON.parse(item);
                        const list = Array.isArray(parsed) ? parsed : [parsed];
                        return list.map((val, i) => (
                          <span
                            key={`${index}-${i}`}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {val}
                          </span>
                        ));
                      } catch {
                        return (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {item}
                          </span>
                        );
                      }
                    })}
                </div>
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdate(property._id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentTheme.button.edit}`}
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentTheme.button.delete}`}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
  <div className={`mt-8 rounded-xl shadow-lg p-4 border ${currentTheme.card}`}>
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      
      {/* Showing text */}
      <div className={`text-xs sm:text-sm text-center sm:text-left ${currentTheme.text.tertiary}`}>
        Showing{" "}
        <span className="font-medium">
          {(currentPage - 1) * limit + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min(currentPage * limit, pagination.totalItems)}
        </span>{" "}
        of{" "}
        <span className="font-medium">{pagination.totalItems}</span> properties
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
        
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 sm:px-4 py-2 flex items-center gap-1 text-xs sm:text-sm rounded-lg transition-colors ${currentTheme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ChevronLeft size={16} /> 
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 flex-wrap justify-center">
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
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm rounded-lg transition-colors ${
                  currentPage === pageNum
                    ? "bg-cyan-600 text-white"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))
          }
          disabled={currentPage === pagination.totalPages}
          className={`px-3 sm:px-4 py-2 flex items-center gap-1 text-xs sm:text-sm rounded-lg transition-colors ${currentTheme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
)}

          </>
        )}
      </div>
    </div>
  )
}

export default PropertyDetails