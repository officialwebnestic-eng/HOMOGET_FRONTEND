import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, MapPin, IndianRupee } from 'lucide-react';
import useGetAllProperty from './../../../hooks/useGetAllProperty';
import { useTheme } from '../../../context/ThemeContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useNavigate } from 'react-router-dom';
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../../model/EmptyStateModel';
import { useLoading } from '../../../model/LoadingModel';

const ViewPropertyList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
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
    });
    const [showFilters, setShowFilters] = useState(false);
    const { theme } = useTheme();
    const limit = 5;
    const { propertyList, loading, error, pagination, deletePropertyById } = useGetAllProperty(currentPage, limit, filters);

  const LoadingModel = useLoading({ type: "list", count: 3, showIcon: true });

    const handleUpdate = (id) => {
        navigate(`/updatepropertydetails/${id}`);
    };
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

    // Theme-based colors for property types and listing types
    const propertyTypeColors = {
        light: {
            'House': 'bg-blue-100 text-blue-800',
            'Apartment': 'bg-purple-100 text-purple-800',
            'Condo': 'bg-green-100 text-green-800',
            'Land': 'bg-yellow-100 text-yellow-800',
            'Commercial': 'bg-red-100 text-red-800',
            'default': 'bg-gray-100 text-gray-800',
        },
        dark: {
            'House': 'bg-blue-900/30 text-blue-300',
            'Apartment': 'bg-purple-900/30 text-purple-300',
            'Condo': 'bg-green-900/30 text-green-300',
            'Land': 'bg-yellow-900/30 text-yellow-300',
            'Commercial': 'bg-red-900/30 text-red-300',
            'default': 'bg-gray-800 text-gray-300',
        },
    };

    const listingTypeColors = {
        light: {
            'Sale': 'bg-teal-100 text-teal-800',
            'Rent': 'bg-orange-100 text-orange-800',
            'Lease': 'bg-indigo-100 text-indigo-800',
            'default': 'bg-gray-100 text-gray-800',
        },
        dark: {
            'Sale': 'bg-teal-900/30 text-teal-300',
            'Rent': 'bg-orange-900/30 text-orange-300',
            'Lease': 'bg-indigo-900/30 text-indigo-300',
            'default': 'bg-gray-800 text-gray-300',
        },
    };

    const getPropertyTypeColor = (type) => {
        return propertyTypeColors[theme][type] || propertyTypeColors[theme].default;
    };

    const getListingTypeColor = (type) => {
        return listingTypeColors[theme][type] || listingTypeColors[theme].default;
    };

    // Theme styles
    const themeStyles = {
        light: {
            background: 'bg-gray-50',
            card: 'bg-white',
            border: 'border-gray-200',
            text: {
                primary: 'text-gray-900',
                secondary: 'text-gray-600',
                tertiary: 'text-gray-500',
            },
            input: 'bg-white border-gray-300 focus:border-cyan-500 focus:ring-cyan-500',
            button: {
                primary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
                secondary: 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300',
                danger: 'bg-red-600 hover:bg-red-700 text-white'
            },
            table: {
                header: 'from-cyan-600 to-teal-500',
                rowHover: 'hover:bg-gray-50',
                divider: 'divide-gray-200'
            },
            pagination: {
                active: 'bg-cyan-600 text-white',
                inactive: 'bg-white text-gray-700 hover:bg-gray-100'
            }
        },
        dark: {
            background: 'bg-gray-900',
            card: 'bg-gray-800',
            border: 'border-gray-700',
            text: {
                primary: 'text-gray-100',
                secondary: 'text-gray-300',
                tertiary: 'text-gray-400',
            },
            input: 'bg-gray-700 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400 text-white placeholder-gray-400',
            button: {
                primary: 'bg-cyan-700 hover:bg-cyan-600 text-white',
                secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600',
                danger: 'bg-red-700 hover:bg-red-600 text-white'
            },
            table: {
                header: 'from-gray-700 to-gray-600',
                rowHover: 'hover:bg-gray-700/50',
                divider: 'divide-gray-700'
            },
            pagination: {
                active: 'bg-cyan-600 text-white',
                inactive: 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }
        }
    };

    const currentTheme = themeStyles[theme];

    return (
        <div className={`p-4 md:p-6 w-full mx-auto ${currentTheme.background}`}>
            <div className={`rounded-xl shadow-sm border ${currentTheme.card} ${currentTheme.border} overflow-hidden`}>
                {/* Header Section */}
                <div className={` mb-4 border-b ${currentTheme.border}`}>
                    {/* Header: Title, total properties, filters & search */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500">
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold text-white">Property Management</h2>
                            <p className="text-sm text-cyan-200 mt-1">{propertyList.length || '0'} properties in total</p>
                        </div>
                        {/* Filters & Search */}
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto md:items-center">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${currentTheme.button.secondary}`}
                            >
                                <Filter size={16} />
                                <span>Filters</span>
                            </button>
                            {/* Search input */}
                            <div className="relative flex-1 min-w-[200px]">
                                <Search
                                    size={16}
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                                />
                                <input
                                    type="text"
                                    name="propertyname"
                                    placeholder="Search properties..."
                                    value={filters.propertyname}
                                    onChange={handleFilterChange}
                                    className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg focus:ring-2 outline-none ${currentTheme.input}`}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Expanded Filters (on small screens) */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">

                            <div>
                                <label className={`block text-xs font-medium mb-1 ${currentTheme.text.tertiary}`}>Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    placeholder="Price"
                                    value={filters.price}
                                    onChange={handleFilterChange}
                                    className={`w-full px-3 py-2 border text-sm rounded-lg focus:ring-2 ${currentTheme.input}`}
                                />

                            </div>
                            
                            <div>
                                <label className={`block text-xs font-medium mb-1 ${currentTheme.text.tertiary}`}>Price</label>
                                <input
                                    type="text"
                                    name="propertyname"
                                    placeholder="Property Name"
                                    value={filters.propertyname}
                                    onChange={handleFilterChange}
                                    className={`w-full px-3 py-2 border text-sm rounded-lg focus:ring-2 ${currentTheme.input}`}
                                />
                                
                            </div>
                            <div>
                                <label className={`block text-xs  font-medium mb-1 ${currentTheme.text.tertiary}`}>Bedrooms</label>
                                <input
                                    type="text"
                                    name="bedroom"
                                    placeholder="Bedrooms"
                                    value={filters.bedroom}
                                    onChange={handleFilterChange}
                                    className={`w-full px-3 py-2 text-sm  border rounded-lg focus:ring-2 ${currentTheme.input}`}
                                />
                            </div>
                                <div>
                                <label className={`block text-xs  font-medium mb-1 ${currentTheme.text.tertiary}`}>Bedrooms</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={filters.city}
                                    onChange={handleFilterChange}
                                    className={`w-full px-3 py-2 text-sm  border rounded-lg focus:ring-2 ${currentTheme.input}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-xs font-medium mb-1 ${currentTheme.text.tertiary}`}>Bathrooms</label>
                                <input
                                    type="text"
                                    name="bathroom"
                                    placeholder="Bathrooms"
                                    value={filters.bathroom}
                                    onChange={handleFilterChange}
                                    className={`w-full px-3 py-2 text-sm  border rounded-lg focus:ring-2 ${currentTheme.input}`}
                                />
                            </div>
                              <div>
                                <label className={`block text-xs font-medium mb-1 ${currentTheme.text.tertiary}`}>Bathrooms</label>
                                <input
                                    type="text"
                                    name="zipcode"
                                    placeholder="ZipCode"
                                    value={filters.zipcode}
                                    onChange={handleFilterChange}
                                    className={`w-full px-3 py-2 text-sm  border rounded-lg focus:ring-2 ${currentTheme.input}`}
                                />
                            </div>

                            <div className="sm:col-span-2 flex items-end">
                                <button
                                    onClick={() =>
                                        setFilters({
                                            propertyname: '',
                                            price: '',
                                            bedroom: '',
                                            bathroom: '',
                                            squarefoot: '',
                                            floor: '',
                                            zipcode: '',
                                            propertytype: '',
                                            listingtype: '',
                                            state: '',
                                            city: '',
                                            aminities: '',
                                        })
                                    }
                                    className={`w-full py-2 text-sm rounded-lg transition-colors ${currentTheme.button.secondary}`}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Property Table or Loading/Error/Empty */}
                {loading ? (
                      <LoadingModel loading={true} />
                ) : error ? (
                 <EmptyStateModel 
                  title="No Properties Found"
                     message="It seems like there are no properties available in your search criteria. Please try adjusting your filters or using a different search term."
                   
                 
                  >
                 </EmptyStateModel>
                ) : propertyList.length === 0 ? (
                    <div className={`p-8 text-center ${currentTheme.text.secondary}`}>
                        <p>No properties found matching your criteria.</p>
                    </div>
                ) : (
                    // Make table scrollable on small screens
                    <div className="overflow-x-auto min-w-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            {/* Table Header */}
                            <thead className={`bg-gradient-to-r ${currentTheme.table.header}`}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Property</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                                    {/* Location and Agent columns hidden on small screens */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Agent Name</th>
                                    {/* Details visible only on xl screens */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden xl:table-cell">Details</th>
                                    {/* Actions */}
                                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            {/* Table Body */}
                            <tbody className={`divide-y ${currentTheme.table.divider} ${currentTheme.card}`}>
                                {propertyList.map((property) => (
                                    <tr key={property._id} className={currentTheme.table.rowHover}>
                                        {/* Property Cell */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-3 min-w-[200px]">
                                                {/* Image carousel */}
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Swiper
                                                        spaceBetween={10}
                                                        slidesPerView={1}
                                                        loop={property.image?.length > 1}
                                                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                                                        pagination={{ clickable: true }}
                                                        className="w-full h-full"
                                                    >
                                                        {property.image?.map((img, idx) => (
                                                            <SwiperSlide key={idx}>
                                                                <img
                                                                    src={img}
                                                                    alt={`Property ${idx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                   
                                                                />
                                                            </SwiperSlide>
                                                        ))}
                                                    </Swiper>
                                                    {property.image?.length > 1 && (
                                                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">{property.image.length}</div>
                                                    )}
                                                </div>
                                                {/* Name & Location */}
                                                <div className="min-w-0">
                                                    <div className={`text-sm font-medium truncate ${currentTheme.text.primary}`}>
                                                        {property.propertyname}
                                                    </div>
                                                    <div className={`text-xs ${currentTheme.text.tertiary} flex items-center gap-1`}>
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate">{property.city}, {property.state}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Type & Listing Type */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-xs px-2 py-1 rounded-full w-fit ${getPropertyTypeColor(property.propertytype)}`}>
                                                    {property.propertytype}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full w-fit ${getListingTypeColor(property.listingtype)}`}>
                                                    {property.listingtype}
                                                </span>
                                            </div>
                                        </td>
                                        {/* Price */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                                <IndianRupee size={12} className="inline-block mr-1" />
                                                {property.price}
                                            </div>
                                        </td>
                                        {/* Location */}
                                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                            <div className={`text-sm ${currentTheme.text.primary}`}>{property.state}</div>
                                            <div className={`text-xs ${currentTheme.text.tertiary}`}>{property.zipcode}</div>
                                        </td>
                                        {/* Agent Name */}
                                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                            <div className={`text-sm ${currentTheme.text.primary}`}>{property?.agentId?.name}</div>
                                        </td>
                                        {/* Details - only on xl screens */}
                                        <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                                            <div className="grid grid-cols-2 gap-1 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <span className={`font-medium ${currentTheme.text.secondary}`}>Beds:</span>
                                                    <span className={`${theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'} px-2 py-0.5 rounded`}>
                                                        {property.bedroom}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className={`font-medium ${currentTheme.text.secondary}`}>Baths:</span>
                                                    <span className={`${theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'} px-2 py-0.5 rounded`}>
                                                        {property.bathroom}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className={`font-medium ${currentTheme.text.secondary}`}>Sq Ft:</span>
                                                    <span className={`${theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'} px-2 py-0.5 rounded`}>
                                                        {property.squarefoot}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className={`font-medium ${currentTheme.text.secondary}`}>Floor:</span>
                                                    <span className={`${theme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'} px-2 py-0.5 rounded`}>
                                                        {property.floor}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <PermissionProtectedAction action="update" model="Property Management">
                                                    <button
                                                        onClick={() => handleUpdate(property._id)}
                                                        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'text-green-400 hover:bg-gray-700/50' : 'text-green-600 hover:bg-green-50'}`}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                </PermissionProtectedAction>
                                                <PermissionProtectedAction action="delete" model="Property Management">
                                                    <button
                                                        onClick={() => handleDelete(property._id)}
                                                        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-gray-700/50' : 'text-red-600 hover:bg-red-50'}`}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </PermissionProtectedAction>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className={`px-4 md:px-6 py-3 border-t ${currentTheme.border} flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        {/* Pagination info */}
                        <div className={`text-sm ${currentTheme.text.tertiary}`}>
                            Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(currentPage * limit, pagination.totalItems)}</span> of{' '}
                            <span className="font-medium">{pagination.totalItems}</span> results
                        </div>
                        {/* Pagination controls */}
                        <div className="flex gap-2 flex-wrap justify-center md:justify-end w-full md:w-auto">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 flex items-center gap-1 text-sm rounded-md transition-colors ${currentTheme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>
                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
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
                                            className={`w-8 h-8 flex items-center justify-center text-sm rounded-md transition-colors ${currentPage === pageNum ? currentTheme.pagination.active : currentTheme.pagination.inactive}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                disabled={currentPage === pagination.totalPages}
                                className={`px-3 py-1.5 flex items-center gap-1 text-sm rounded-md transition-colors ${currentTheme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewPropertyList;