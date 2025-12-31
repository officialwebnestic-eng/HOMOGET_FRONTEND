import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, MapPin, IndianRupee, X, Building, LayoutGrid } from 'lucide-react';
import useGetAllProperty from './../../../hooks/useGetAllProperty';
import { useTheme } from '../../../context/ThemeContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../../model/EmptyStateModel';
import { useLoading } from '../../../model/LoadingModel';

const ViewPropertyList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [filters, setFilters] = useState({
        propertyname: "",
        price: "",
        bedroom: "",
        city: "",
        zipcode: "",
        propertytype: "",
    });

    const limit = 5;
    const { propertyList, loading, error, pagination, deletePropertyById } = useGetAllProperty(currentPage, limit, filters);
    const LoadingModel = useLoading({ type: "list", count: 3, showIcon: true });

    // Count active filters for badge notification
    const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ propertyname: "", price: "", bedroom: "", city: "", zipcode: "", propertytype: "" });
        setCurrentPage(1);
    };

    const getBadgeStyle = (type, value) => {
        const colors = {
            property: {
                House: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600',
                Apartment: isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600',
                Villa: isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
            },
            listing: {
                Sale: isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600',
                Rent: isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600',
            }
        };
        return colors[type][value] || (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600');
    };

    return (
        <div className={`p-4 md:p-8 min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className={`max-w-7xl mx-auto rounded-[2rem] border overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/40' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
                
                {/* Header Section */}
                <div className={`p-6 md:p-8 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                                    <Building size={20} />
                                </div>
                                <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Inventory</h2>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Manage and monitor {pagination?.totalItems || 0} listed properties</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    name="propertyname"
                                    value={filters.propertyname}
                                    onChange={handleFilterChange}
                                    placeholder="Search by title..."
                                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}
                                />
                            </div>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${showFilters ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : (isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}`}
                            >
                                <Filter size={18} />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Expandable Filter Grid */}
                    {showFilters && (
                        <div className={`mt-6 p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            {[
                                { label: 'Price (Max)', name: 'price', type: 'number' },
                                { label: 'Bedrooms', name: 'bedroom', type: 'number' },
                                { label: 'City', name: 'city', type: 'text' },
                                { label: 'Zipcode', name: 'zipcode', type: 'text' },
                            ].map((f) => (
                                <div key={f.name}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">{f.label}</label>
                                    <input 
                                        type={f.type} name={f.name} value={filters[f.name]} onChange={handleFilterChange}
                                        className={`w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                    />
                                </div>
                            ))}
                            <div className="lg:col-span-4 flex justify-end gap-2 mt-2">
                                <button onClick={clearFilters} className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">Reset All</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12"><LoadingModel loading={true} /></div>
                    ) : propertyList.length === 0 ? (
                        <EmptyStateModel title="No results found" message="Try adjusting your search or filters to find what you're looking for." />
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`${isDark ? 'bg-slate-800/30' : 'bg-slate-50/50'} text-slate-500 text-[11px] font-black uppercase tracking-widest`}>
                                    <th className="px-8 py-4">Property Info</th>
                                    <th className="px-6 py-4">Categorization</th>
                                    <th className="px-6 py-4">Pricing</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">Management</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                {propertyList.map((property) => (
                                    <tr key={property._id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/20' : 'hover:bg-slate-50/50'}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                                                    <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3000 }} pagination={{ clickable: true }} className="w-full h-full">
                                                        {property.image?.map((img, i) => (
                                                            <SwiperSlide key={i}><img src={img} className="w-full h-full object-cover" alt="" /></SwiperSlide>
                                                        ))}
                                                    </Swiper>
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{property.propertyname}</h4>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <MapPin size={12} className="text-indigo-500" />
                                                        {property.city}, {property.zipcode}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg w-fit uppercase tracking-tighter ${getBadgeStyle('property', property.propertytype)}`}>
                                                    {property.propertytype}
                                                </span>
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg w-fit uppercase tracking-tighter ${getBadgeStyle('listing', property.listingtype)}`}>
                                                    {property.listingtype}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`text-sm font-black flex items-center gap-0.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                <IndianRupee size={14} />
                                                {property.price.toLocaleString()}
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{property.squarefoot} Sqft</p>
                                        </td>
                                        <td className="px-6 py-5 hidden lg:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                                    <img src={property?.agentId?.profilePhoto || "https://ui-avatars.com/api/?name=" + property?.agentId?.name} alt="" />
                                                </div>
                                                <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{property?.agentId?.name || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PermissionProtectedAction action="update" model="Property Management">
                                                    <button onClick={() => navigate(`/updatepropertydetails/${property._id}`)} className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-emerald-400 hover:bg-emerald-500/10' : 'bg-slate-100 text-emerald-600 hover:bg-emerald-50'}`}>
                                                        <Pencil size={18} />
                                                    </button>
                                                </PermissionProtectedAction>
                                                <PermissionProtectedAction action="delete" model="Property Management">
                                                    <button onClick={() => deletePropertyById(property._id)} className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-rose-400 hover:bg-rose-500/10' : 'bg-slate-100 text-rose-600 hover:bg-rose-50'}`}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </PermissionProtectedAction>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer / Pagination */}
                <div className={`p-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Page {currentPage} of {pagination?.totalPages || 1}
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className={`p-3 rounded-xl border transition-all disabled:opacity-30 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: pagination?.totalPages || 0 }).map((_, i) => (
                                <button 
                                    key={i} onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400')}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button 
                            disabled={currentPage === pagination?.totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className={`p-3 rounded-xl border transition-all disabled:opacity-30 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPropertyList;