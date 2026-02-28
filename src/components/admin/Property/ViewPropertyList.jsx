import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, MapPin, Sparkles, Crown, Briefcase, Building, Landmark } from 'lucide-react';
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

// Helper to determine brand icon based on mode
const getModeConfig = (mode) => {
    switch (mode) {
        case 'Luxury': return { icon: <Crown size={20} />, label: "Luxury Collection", color: "#C5A059" };
        case 'project': return { icon: <Landmark size={20} />, label: "Off-Plan Projects", color: "#6366f1" };
        case 'Commercial': return { icon: <Briefcase size={20} />, label: "Commercial Assets", color: "#0ea5e9" };
        case 'Rent': return { icon: <Building size={20} />, label: "Rental Registry", color: "#10b981" };
        default: return { icon: <Sparkles size={20} />, label: "Inventory Registry", color: "#C5A059" };
    }
};

const ViewPropertyList = ({ mode = "all" }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [showFilters, setShowFilters] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const config = getModeConfig(mode);
    
    // Initial Filter State based on Mode
    const [filters, setFilters] = useState({
        propertyname: "",
        price: "",
        bedroom: "",
        city: "",
        zipcode: "",
        propertytype: "",
        // Dynamic logic fields
        segment: mode === "Luxury" ? "Luxury" : "",
        propertyListingType: mode === "project" ? "project" : (mode === "all" ? "" : "property"),
        usageType: mode === "Commercial" ? "Commercial" : "",
        listingtype: (mode === "Rent" || mode === "Buy") ? mode : "",
    });

    // Re-sync filters if mode prop changes (navigation between pages)
    useEffect(() => {
        clearFilters();
    }, [mode]);

    const limit = 5;
    const { propertyList, loading, pagination, deletePropertyById } = useGetAllProperty(currentPage, limit, filters);
    const LoadingModel = useLoading({ type: "list", count: 3, showIcon: true });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            propertyname: "", price: "", bedroom: "", city: "", zipcode: "", propertytype: "",
            segment: mode === "Luxury" ? "Luxury" : "",
            propertyListingType: mode === "project" ? "project" : (mode === "all" ? "" : "property"),
            usageType: mode === "Commercial" ? "Commercial" : "",
            listingtype: (mode === "Rent" || mode === "Buy") ? mode : "",
        });
        setCurrentPage(1);
    };

    return (
        <div className={`p-4 md:p-8 min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0F1219]' : 'bg-slate-50'}`}>
            <div className={`max-w-7xl mx-auto rounded-[2.5rem] border overflow-hidden transition-all duration-500 shadow-2xl ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100'}`}>
                
                {/* Dynamic Header */}
                <div className={`p-8 md:p-10 border-b ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 rounded-2xl text-white shadow-lg shadow-amber-500/10" style={{ backgroundColor: config.color }}>
                                    {config.icon}
                                </div>
                                <h2 className={`text-3xl font-black tracking-tighter uppercase italic ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                                    {config.label.split(' ')[0]} <span style={{ color: config.color }}>{config.label.split(' ')[1]}.</span>
                                </h2>
                            </div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                {mode === "all" ? "Dubai Master Registry" : `Filtered by ${mode} segment`}
                            </p>
                        </div>

                        {/* Search & Filter Controls */}
                        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                                <input 
                                    name="propertyname"
                                    value={filters.propertyname}
                                    onChange={handleFilterChange}
                                    placeholder="Search in registry..."
                                    className={`w-full pl-12 pr-4 py-4 rounded-full border text-xs font-bold outline-none transition-all ${isDark ? 'bg-[#0F1219] border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`}
                                />
                            </div>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${isDark ? 'bg-[#161B26] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                                <Filter size={16} /> Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Registry Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-16 flex justify-center"><LoadingModel loading={true} /></div>
                    ) : propertyList.length === 0 ? (
                        <div className="p-20">
                             <EmptyStateModel 
                                type="properties"
                                title="No Assets Found"
                                message={`The ${mode} registry is currently empty.`}
                                onResetFilters={clearFilters}
                            />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`${isDark ? 'bg-white/5' : 'bg-slate-50/50'} text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]`}>
                                    <th className="px-10 py-5">Sanctuary Details</th>
                                    <th className="px-6 py-5">Classification</th>
                                    <th className="px-6 py-5">Valuation</th>
                                    <th className="px-10 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                                {propertyList.map((property) => (
                                    <tr key={property._id} className="group hover:bg-slate-500/5 transition-all">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border border-white/5">
                                                    <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3500 }} className="w-full h-full">
                                                        {property.image?.map((img, i) => (
                                                            <SwiperSlide key={i}><img src={img} className="w-full h-full object-cover" alt="" /></SwiperSlide>
                                                        ))}
                                                    </Swiper>
                                                </div>
                                                <div>
                                                    <h4 className={`font-black italic tracking-tighter text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>{property.propertyname}</h4>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                                                        <MapPin size={10} style={{ color: config.color }} /> {property.city}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[9px] font-black px-3 py-1 rounded-full border border-slate-700 text-slate-400 w-fit uppercase">
                                                    {property.propertytype}
                                                </span>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full text-white w-fit uppercase`} style={{ backgroundColor: config.color }}>
                                                    {property.listingtype}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-xl font-black tracking-tighter" style={{ color: config.color }}>
                                                AED {property.price.toLocaleString()}
                                            </div>
                                            {property.propertyListingType === 'project' && <span className="text-[9px] text-amber-500 font-black uppercase">Handover: {property.deliveryDate}</span>}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => navigate(`/updatepropertydetails/${property._id}`)} className="p-3 rounded-full bg-slate-800 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => deletePropertyById(property._id)} className="p-3 rounded-full bg-slate-800 text-rose-400 hover:bg-rose-400 hover:text-black transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewPropertyList;