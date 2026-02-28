import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Search, Building2, Plus, Award, ShieldCheck, Mail, Phone, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";
import { http } from "../../../axios/axios";

const ViewAllDeveloperList = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme();
  const { addToast } = useToast();
  
  const isDark = theme === "dark";
  const brandGold = "#C5A059";

 const BaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000/";

  // 1. Fetch Logic
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

  // 2. Delete Logic
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

  // 3. Search Filter
  const filteredData = developers.filter(dev => 
    dev.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton UI for Loading State
  const TableSkeleton = () => (
    <div className="animate-pulse space-y-4 p-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`h-20 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
      ))}
    </div>
  );

  return (
    <div className={`p-6 md:p-10 min-h-screen transition-all duration-700 ${isDark ? "bg-[#0F1219]" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 size={20} style={{ color: brandGold }} />
              <h2 className={`text-3xl font-black italic tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>
                Developer <span style={{ color: brandGold }}>Portfolio.</span>
              </h2>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Partnership Management System</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="SEARCH REGISTRY..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full md:w-72 pl-12 pr-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all ${
                  isDark ? "bg-[#161B26] border-white/5 text-white focus:border-[#C5A059]/50" : "bg-white border-slate-200 focus:border-[#C5A059]"
                }`}
              />
            </div>
            <Link
              to="/createdeveloper"
              style={{ backgroundColor: brandGold }}
              className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl hover:scale-105 transition-all flex items-center gap-3"
            >
              <Plus size={16} /> Enroll New
            </Link>
          </div>
        </div>

        {/* Data Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all duration-500 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100"}`}
        >
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={isDark ? "bg-white/5" : "bg-slate-50"}>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Identity</th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Legal</th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Metrics</th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Status</th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-50"}`}>
                  <AnimatePresence>
                    {filteredData.map((dev) => (
                      <motion.tr
                        key={dev._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-[#C5A059]/5 transition-colors"
                      >
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-white p-2 border border-slate-100 flex items-center justify-center">
                              <img 
                                src={`${BaseUrl}/agents/${dev.companyLogo}`}
                                className="max-h-full max-w-full object-contain" 
                                alt="" 
                                onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=DEV'} 
                              />
                            </div>
                            <div>
                              <p className={`text-xs font-black uppercase tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{dev.companyName}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase">Est. {dev.establishedYear}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                              <Award size={12} style={{ color: brandGold }} /> RERA: {dev.reraRegistrationNumber}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                              <ShieldCheck size={12} /> LIC: {dev.tradeLicenseNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex flex-col">
                             <span className="text-[10px] font-black text-[#C5A059]">{dev.totalProjects}+ Projects</span>
                             <span className="text-[8px] font-bold text-slate-500 uppercase">{dev.developerType}</span>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                            dev.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          }`}>
                            {dev.status}
                          </span>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <Link to={`/updatedeveloper/${dev._id}`} className="p-3 rounded-xl bg-slate-500/5 text-slate-500 hover:text-[#C5A059] transition-all"><Pencil size={16} /></Link>
                            <button onClick={() => handleDelete(dev._id)} className="p-3 rounded-xl bg-slate-500/5 text-slate-500 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredData.length === 0 && !loading && (
                <div className="py-32 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                  No records found in registry
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ViewAllDeveloperList;