import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, Pencil, Trash2, Search, Filter, ChevronLeft, 
  ChevronRight, IndianRupee, Download, MoreVertical, 
  CheckCircle2, Clock, AlertCircle, MapPin, User 
} from 'lucide-react';
import { http } from '../../../axios/axios';
import { useNavigate } from 'react-router-dom';
import { notfound } from '../../../ExportImages';
import { useTheme } from '../../../context/ThemeContext';

const GetAllTransaction = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    propertyname: '',
    price: '',
    agentName: '',
    paymentMethod: '',
    status: ''
  });

  

  const getAllTransaction = async () => {
    setLoading(true);
    try {
      const response = await http.get("/getalltransaction", { withCredentials: true });
      if (response.data.success) {
        setTransactionData(response.data.data);
      }
    } catch (err) {
      setError("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAllTransaction(); }, []);

  // Optimized Filter Logic
  const filteredData = useMemo(() => {
    return transactionData.filter(t => {
      return (
        t.propertyId?.propertyname?.toLowerCase().includes(filters.propertyname.toLowerCase()) &&
        (filters.price === '' || String(t.price).includes(filters.price)) &&
        (t.agentId?.agentName?.toLowerCase().includes(filters.agentName.toLowerCase()) || !filters.agentName) &&
        (t.status?.toLowerCase().includes(filters.status.toLowerCase()) || !filters.status)
      );
    });
  }, [filters, transactionData]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Defined here
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Header */}
        <div className={`mb-8 p-6 rounded-[2.5rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Transactions
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Monitoring {filteredData.length} financial activities
              </p>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  name="propertyname"
                  placeholder="Property search..."
                  value={filters.propertyname}
                  onChange={handleFilterChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${showFilters ? 'bg-indigo-600 text-white shadow-lg' : (isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')}`}
              >
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
              <select name="status" onChange={handleFilterChange} className={`px-4 py-2.5 rounded-xl border outline-none ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              <input name="agentName" placeholder="Agent Name" onChange={handleFilterChange} className={`px-4 py-2.5 rounded-xl border outline-none ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} />
              <input name="price" placeholder="Min Price" onChange={handleFilterChange} className={`px-4 py-2.5 rounded-xl border outline-none ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} />
              <button onClick={() => setFilters({propertyname:'', price:'', agentName:'', paymentMethod:'', status:''})} className="text-xs font-black uppercase text-indigo-500 text-left px-2">Clear All</button>
            </div>
          )}
        </div>

        {/* Data Table Container */}
        <div className={`rounded-[2rem] border overflow-hidden shadow-xl ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/40' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} text-slate-500`}>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Property & Type</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Price</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Agent</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Payment</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-6 py-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <img src={notfound} alt="notfound" className="w-40 mx-auto opacity-50 grayscale" />
                      <p className="text-slate-500 font-bold mt-4">No records found matching your criteria</p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr key={item._id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.propertyId?.propertyname}</span>
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{item.propertyId?.propertytype}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 text-indigo-600 font-black text-sm">
                          <IndianRupee size={12} />
                          {item.price?.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                            <User size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-500">{item.agentId?.agentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                          {item.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => navigate(`/viewalltransiondata/${item._id}`)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={`px-8 py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/30'}`}>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length}
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllTransaction;