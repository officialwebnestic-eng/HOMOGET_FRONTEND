import React, { useState, useEffect } from "react";
import { 
  Eye, Pencil, Trash2, Search, Building2, Plus, Award, 
  ShieldCheck, Mail, Phone, Globe, MapPin, Calendar, 
  Briefcase, Filter, File, FileText, FileCheck, X, 
  Download, ExternalLink, Building, User, Home, Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";
import { http } from "../../../axios/axios";

const ViewAllDeveloperList = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const { theme } = useTheme();
  const { addToast } = useToast();
  
  const isDark = theme === "dark";
  const brandColor = "#f59e0b";

  const BaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000";

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const response = await http.get("/developers");
      if (response.data.success) {
        setDevelopers(response.data.data);
      }
    } catch (error) {
      addToast("Failed to connect to Registry", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm removal from Corporate Registry?")) return;
    try {
      await http.delete(`/developers/${id}`);
      setDevelopers(prev => prev.filter(d => d._id !== id));
      addToast("Developer Deleted", "success");
    } catch (err) {
      addToast("Action Denied", "error");
    }
  };

  const handleViewDetails = (developer) => {
    setSelectedDeveloper(developer);
    setShowDetailsModal(true);
  };

  // ✅ Auto download PDF on button click
  const handleDownloadDocument = (docUrl, docName) => {
    if (!docUrl) {
      addToast("Document not available", "error");
      return;
    }

    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = `${BaseUrl}/developers/${docUrl}`;
      link.download = docName || docUrl.split('/').pop() || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast("Downloading document...", "success");
    } catch (error) {
      console.error("Download error:", error);
      addToast("Failed to download document", "error");
    }
  };

  const filteredData = developers.filter(dev => {
    const matchesSearch = dev.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.reraRegistrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.tradeLicenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.officialEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || dev.developerType === filterType;
    return matchesSearch && matchesFilter;
  });

  const developerTypes = [...new Set(developers.map(d => d.developerType).filter(Boolean))];
  
  const totalProjects = developers.reduce((sum, d) => sum + (d.totalProjects || 0), 0);
  const earliestYear = developers.length > 0 
    ? Math.min(...developers.map(d => d.establishedYear).filter(Boolean))
    : 2020;

  const TableSkeleton = () => (
    <div className="space-y-4 p-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`h-24 rounded-xl animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
      ))}
    </div>
  );

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (status === "Inactive") return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 lg:p-8 transition-colors duration-300 ${isDark ? "bg-[#0a0a0c]" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-amber-500/10">
                <Building2 size={20} className="text-amber-500" />
              </div>
              <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                Developer <span className="text-amber-500">Portfolio</span>
              </h2>
            </div>
            <p className={`text-[8px] md:text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {developers.length} Partners • RERA Certified
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, RERA, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none border transition-all focus:ring-1 focus:ring-amber-500 ${
                  isDark ? "bg-[#11141B] border-white/10 text-white placeholder:text-slate-500" : "bg-white border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  showFilters 
                    ? "bg-amber-500 text-black border-amber-500" 
                    : isDark ? "bg-[#11141B] border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                <Filter size={14} /> {filterType === "all" ? "All Types" : filterType}
              </button>
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg overflow-hidden z-50 ${
                      isDark ? "bg-[#11141B] border-white/10" : "bg-white border-slate-200"
                    }`}
                  >
                    <button
                      onClick={() => { setFilterType("all"); setShowFilters(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filterType === "all" ? "bg-amber-500/10 text-amber-500" : isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}
                    >
                      All Developers
                    </button>
                    {developerTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => { setFilterType(type); setShowFilters(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filterType === type ? "bg-amber-500/10 text-amber-500" : isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}
                      >
                        {type}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/createdeveloper"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all shadow-md"
            >
              <Plus size={14} /> Add Developer
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard title="Total Developers" value={developers.length} icon={<Building2 size={16} />} color="amber" isDark={isDark} />
          <StatCard title="Active Partners" value={developers.filter(d => d.status === "Active").length} icon={<ShieldCheck size={16} />} color="emerald" isDark={isDark} />
          <StatCard title="Total Projects" value={totalProjects} icon={<Briefcase size={16} />} color="blue" isDark={isDark} />
          <StatCard title="Est. Since" value={earliestYear} icon={<Calendar size={16} />} color="purple" isDark={isDark} />
        </div>

        {/* Developer Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border overflow-hidden shadow-sm ${isDark ? "bg-[#11141B] border-white/10" : "bg-white border-slate-200"}`}
        >
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className={`border-b ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                    <th className="px-4 md:px-6 py-4 text-left text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">Developer</th>
                    <th className="px-4 md:px-6 py-4 text-left text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">Contact</th>
                    <th className="px-4 md:px-6 py-4 text-left text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">Legal Info</th>
                    <th className="px-4 md:px-6 py-4 text-left text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">Portfolio</th>
                    <th className="px-4 md:px-6 py-4 text-left text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">Documents</th>
                    <th className="px-4 md:px-6 py-4 text-left text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 md:px-6 py-4 text-right text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-slate-100"}`}>
                  <AnimatePresence>
                    {filteredData.map((dev, idx) => (
                      <motion.tr
                        key={dev._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-amber-500/5 transition-colors"
                      >
                        {/* Developer Info */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-amber-500/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {dev.companyLogo && dev.companyLogo !== 'default-developer-logo.png' ? (
                                <img 
                                  src={`${BaseUrl}/developers/${dev.companyLogo}`}
                                  className="w-full h-full object-cover" 
                                  alt={dev.companyName}
                                  onError={(e) => e.target.src = ''} 
                                />
                              ) : (
                                <Building2 size={16} className="text-amber-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                                {dev.companyName}
                              </p>
                              <p className="text-[8px] md:text-[9px] text-slate-500">Est. {dev.establishedYear}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="space-y-1">
                            {dev.officialEmail && (
                              <div className="flex items-center gap-1.5 text-[9px] md:text-[10px]">
                                <Mail size={10} className="text-amber-500 flex-shrink-0" />
                                <span className={`truncate max-w-[120px] md:max-w-none ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                  {dev.officialEmail}
                                </span>
                              </div>
                            )}
                            {dev.contactNumber && (
                              <div className="flex items-center gap-1.5 text-[9px] md:text-[10px]">
                                <Phone size={10} className="text-amber-500 flex-shrink-0" />
                                <span className={isDark ? "text-slate-300" : "text-slate-600"}>{dev.contactNumber}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Legal Info */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Award size={10} className="text-amber-500 flex-shrink-0" />
                              <span className="text-[8px] md:text-[9px] font-mono text-slate-500 truncate max-w-[100px] md:max-w-none">
                                {dev.reraRegistrationNumber || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck size={10} className="text-amber-500 flex-shrink-0" />
                              <span className="text-[8px] md:text-[9px] font-mono text-slate-500 truncate max-w-[100px] md:max-w-none">
                                {dev.tradeLicenseNumber || "N/A"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Portfolio */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex flex-col">
                            <p className="text-sm font-bold text-amber-500">{dev.totalProjects || 0}+ Projects</p>
                            <p className="text-[8px] md:text-[9px] text-slate-500">{dev.developerType || "Private"}</p>
                          </div>
                        </td>

                        {/* Documents */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2">
                            {dev.contractDocument && (
                              <button
                                onClick={() => handleDownloadDocument(dev.contractDocument, `Contract_${dev.companyName}.pdf`)}
                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                                title="Download Contract Document"
                              >
                                <Download size={14} />
                              </button>
                            )}
                            {dev.otherDocument && (
                              <button
                                onClick={() => handleDownloadDocument(dev.otherDocument, `Other_${dev.companyName}.pdf`)}
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                                title="Download Other Document"
                              >
                                <Download size={14} />
                              </button>
                            )}
                            {!dev.contractDocument && !dev.otherDocument && (
                              <span className="text-[8px] text-slate-400">No documents</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 md:px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[7px] md:text-[8px] font-bold uppercase border ${getStatusColor(dev.status)}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${dev.status === "Active" ? "bg-emerald-500" : dev.status === "Inactive" ? "bg-rose-500" : "bg-amber-500"}`} />
                            {dev.status || "Active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 md:px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleViewDetails(dev)}
                              className={`p-1.5 md:p-2 rounded-lg transition-all ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
                              title="View Details"
                            >
                              <Eye size={14} className="text-slate-500 hover:text-amber-500" />
                            </button>
                            <Link 
                              to={`/updatedeveloper/${dev._id}`} 
                              className={`p-1.5 md:p-2 rounded-lg transition-all ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
                              title="Edit"
                            >
                              <Pencil size={14} className="text-slate-500 hover:text-amber-500" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(dev._id)} 
                              className={`p-1.5 md:p-2 rounded-lg transition-all ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
                              title="Delete"
                            >
                              <Trash2 size={14} className="text-slate-500 hover:text-rose-500" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          
          {filteredData.length === 0 && !loading && (
            <div className="py-16 md:py-20 text-center">
              <div className={`inline-flex p-4 rounded-full ${isDark ? "bg-white/5" : "bg-slate-100"} mb-4`}>
                <Building2 size={32} className="text-slate-400" />
              </div>
              <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>No developers found</p>
              <p className="text-[9px] md:text-[10px] text-slate-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ============================================= */}
      {/* DETAILS MODAL WITH SEPARATE SECTIONS */}
      {/* ============================================= */}
      <AnimatePresence>
        {showDetailsModal && selectedDeveloper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                isDark ? "bg-[#11141B] border border-white/10" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
                isDark ? "border-white/10 bg-[#11141B]" : "border-slate-200 bg-white"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10">
                    <Building2 size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                      {selectedDeveloper.companyName}
                    </h3>
                    <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">
                      {selectedDeveloper.developerType || "Private Developer"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={`p-2 rounded-lg transition-all ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* SECTION 1: COMPANY PROFILE */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Building size={16} className="text-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Profile</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Logo */}
                    <div className="flex flex-col items-center p-4 rounded-xl bg-amber-500/5">
                      {selectedDeveloper.companyLogo && selectedDeveloper.companyLogo !== 'default-developer-logo.png' ? (
                        <img 
                          src={`${BaseUrl}/developers/${selectedDeveloper.companyLogo}`}
                          alt={selectedDeveloper.companyName}
                          className="w-24 h-24 object-contain rounded-lg border border-slate-200 dark:border-white/10 p-2 bg-white"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/96?text=Logo'}
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-slate-200 dark:bg-white/5 flex items-center justify-center">
                          <Building2 size={32} className="text-slate-400" />
                        </div>
                      )}
                      <p className="text-xs font-medium mt-2">{selectedDeveloper.companyName}</p>
                    </div>

                    {/* Company Details */}
                    <div className="col-span-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase">Developer Type</p>
                          <p className="text-sm font-medium">{selectedDeveloper.developerType || "Private"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase">Established Year</p>
                          <p className="text-sm font-medium">{selectedDeveloper.establishedYear || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase">Total Projects</p>
                          <p className="text-sm font-medium">{selectedDeveloper.totalProjects || 0}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase">Status</p>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border ${getStatusColor(selectedDeveloper.status)}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${selectedDeveloper.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {selectedDeveloper.status || "Active"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: CONTACT INFORMATION */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={16} className="text-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Information</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                      <Mail size={16} className="text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase">Email</p>
                        <p className="text-sm">{selectedDeveloper.officialEmail || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                      <Phone size={16} className="text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase">Phone</p>
                        <p className="text-sm">{selectedDeveloper.contactNumber || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 md:col-span-2">
                      <MapPin size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase">Office Address</p>
                        <p className="text-sm">{selectedDeveloper.officeAddress || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: LEGAL & REGULATORY */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={16} className="text-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal & Regulatory</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                      <p className="text-[8px] text-slate-400 uppercase">RERA Registration Number</p>
                      <p className="text-sm font-mono font-medium">{selectedDeveloper.reraRegistrationNumber || "N/A"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                      <p className="text-[8px] text-slate-400 uppercase">Trade License Number</p>
                      <p className="text-sm font-mono font-medium">{selectedDeveloper.tradeLicenseNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: SPECIALIZATION */}
                {selectedDeveloper.specialization && selectedDeveloper.specialization.length > 0 && (
                  <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase size={16} className="text-amber-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Specialization</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedDeveloper.specialization.map((spec, i) => (
                        <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"
                        }`}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 5: COMPANY BIO */}
                {selectedDeveloper.details && (
                  <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Info size={16} className="text-amber-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Bio</h4>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5">
                      <p className="text-sm leading-relaxed">{selectedDeveloper.details}</p>
                    </div>
                  </div>
                )}

                {/* SECTION 6: DOCUMENTS */}
                {(selectedDeveloper.contractDocument || selectedDeveloper.otherDocument) && (
                  <div className="pb-2">
                    <div className="flex items-center gap-2 mb-4">
                      <File size={16} className="text-amber-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Documents</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedDeveloper.contractDocument && (
                        <button
                          onClick={() => handleDownloadDocument(selectedDeveloper.contractDocument, `Contract_${selectedDeveloper.companyName}.pdf`)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-md ${
                            isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <FileText size={20} className="text-blue-500" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium">Contract Document</p>
                            <p className="text-[8px] text-slate-400">Click to download PDF</p>
                          </div>
                          <Download size={16} className="text-blue-500 ml-4" />
                        </button>
                      )}
                      {selectedDeveloper.otherDocument && (
                        <button
                          onClick={() => handleDownloadDocument(selectedDeveloper.otherDocument, `Other_${selectedDeveloper.companyName}.pdf`)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-md ${
                            isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-emerald-500/10">
                            <FileCheck size={20} className="text-emerald-500" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium">Other Document</p>
                            <p className="text-[8px] text-slate-400">Click to download PDF</p>
                          </div>
                          <Download size={16} className="text-emerald-500 ml-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, isDark }) => {
  const colorClasses = {
    amber: "bg-amber-500/10 text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className={`p-3 md:p-4 rounded-xl border ${isDark ? "bg-[#11141B] border-white/10" : "bg-white border-slate-200"} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-1.5 md:p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>{title}</p>
      <p className="text-lg md:text-xl font-bold mt-0.5">{value}</p>
    </div>
  );
};

export default ViewAllDeveloperList;