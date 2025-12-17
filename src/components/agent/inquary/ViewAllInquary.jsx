import React, { useContext, useEffect, useState } from 'react';
import { http } from '../../../axios/axios';
import { AuthContext } from '../../../context/AuthContext';
import { Search, Filter, Calendar, ChevronDown, ChevronUp, Mail, Phone, MessageSquare, Clock, Eye, UserPlus, X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import EmptyStateModel from '../../../model/EmptyStateModel';
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';

const ViewAllInquary = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const [contactData, setContactData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced theme-aware colors with modern gradient effects
  const statusConfig = {
    pending: {
      color: theme === 'dark' ? 'bg-gradient-to-r from-amber-900/80 to-yellow-900/80 text-amber-200 border-amber-700/50' : 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-400'
    },
    New: {
      color: theme === 'dark' ? 'bg-gradient-to-r from-cyan-900/80 to-blue-900/80 text-cyan-200 border-cyan-700/50' : 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-800 border-cyan-200',
      dot: 'bg-cyan-400'
    },
    Contacted: {
      color: theme === 'dark' ? 'bg-gradient-to-r from-blue-900/80 to-indigo-900/80 text-blue-200 border-blue-700/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200',
      dot: 'bg-blue-400'
    },
    Resolved: {
      color: theme === 'dark' ? 'bg-gradient-to-r from-emerald-900/80 to-green-900/80 text-emerald-200 border-emerald-700/50' : 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-400'
    },
    Followup: {
      color: theme === 'dark' ? 'bg-gradient-to-r from-purple-900/80 to-violet-900/80 text-purple-200 border-purple-700/50' : 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-800 border-purple-200',
      dot: 'bg-purple-400'
    },
    Rejected: {
      color: theme === 'dark' ? 'bg-gradient-to-r from-red-900/80 to-rose-900/80 text-red-200 border-red-700/50' : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200',
      dot: 'bg-red-400'
    }
  };

  const statusOptions = ['All', 'New', 'Contacted', 'Resolved', 'Followup', 'Rejected'];

  const getInquary = async () => {
    setLoading(true);
    try {
      const response = await http.get("/getcontact", {
        withCredentials: true
      });
      if (response.data?.success === true) {
        setContactData(response.data.data);
        setFilteredData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInquary();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (result.success) {
        setFilteredData(prev =>
          prev.map(item =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateFilter, contactData]);

  const applyFilters = () => {
    let result = [...contactData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(inquiry =>
        inquiry.name?.toLowerCase().includes(term) ||
        inquiry.email?.toLowerCase().includes(term) ||
        inquiry.phoneno?.toLowerCase().includes(term) ||
        inquiry.inquarytype?.toLowerCase().includes(term) ||
        inquiry.message?.toLowerCase().includes(term)
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter(inquiry => inquiry.status === statusFilter);
    }

    if (dateFilter) {
      result = result.filter(inquiry => inquiry.date === dateFilter);
    }

    setFilteredData(result);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDateFilter('');
    setFilteredData(contactData);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'} relative overflow-hidden`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'} blur-3xl transform translate-x-1/2 -translate-y-1/2`}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'} blur-3xl transform -translate-x-1/2 translate-y-1/2`}></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-white via-blue-200 to-purple-200' : 'from-gray-900 via-blue-600 to-purple-600'} bg-clip-text text-transparent mb-2`}>
                Customer Inquiries
              </h1>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage and track all customer inquiries
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} backdrop-blur-sm`}>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total: {contactData.length}
                </span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`group flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-600/50 text-white shadow-lg' : 'bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 border border-gray-200 text-gray-700 shadow-lg'} backdrop-blur-sm`}
              >
                <Filter size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                <span>Filters</span>
                {showFilters ?
                  <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform duration-300" /> :
                  <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform duration-300" />
                }
              </button>
            </div>
          </div>



          {/* Enhanced Filter Section */}
          {showFilters && (
            <div className={`relative p-6 rounded-2xl shadow-xl mb-8 border backdrop-blur-sm transition-all duration-500 ${theme === 'dark' ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/50'}`}>
              <button
                onClick={() => setShowFilters(false)}
                className={`absolute top-4 right-4 p-2 rounded-lg hover:rotate-90 transition-all duration-300 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X size={16} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enhanced Search Input */}
                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Search Inquiries
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className={`h-5 w-5 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 group-focus-within:text-blue-400' : 'text-gray-500 group-focus-within:text-blue-500'}`} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name, email, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-12 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300 placeholder-gray-500'} backdrop-blur-sm`}
                    />
                  </div>
                </div>

                {/* Enhanced Status Filter */}
                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Filter by Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white/70 border-gray-300'} backdrop-blur-sm`}
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option === 'All' ? 'All Statuses' : option}</option>
                    ))}
                  </select>
                </div>

                {/* Enhanced Date Filter */}
                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Filter by Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className={`h-5 w-5 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 group-focus-within:text-blue-400' : 'text-gray-500 group-focus-within:text-blue-500'}`} />
                    </div>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className={`pl-12 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white/70 border-gray-300'} backdrop-blur-sm`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filteredData.length} of {contactData.length} inquiries match your filters
                </div>
                <button
                  onClick={resetFilters}
                  className={`px-6 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Loading State */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-64">
              <div className={`animate-spin rounded-full h-16 w-16 border-4 border-transparent ${theme === 'dark' ? 'border-t-blue-400 border-r-purple-400' : 'border-t-blue-500 border-r-purple-500'}`}></div>
              <p className={`mt-4 text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading inquiries...
              </p>
            </div>
          )}

          {/* Enhanced Empty State */}
          {!loading && filteredData.length === 0 && (
            <EmptyStateModel
              type="Inquary"
              title="No inquiries match your search"
              message="Try adjusting your filters or search terms to see more results."
              showResetButton={true}
            />
          )}

          {/* Enhanced Inquiry Cards */}
          {!loading && filteredData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredData.map((inquiry) => {
                const statusStyle = statusConfig[inquiry.status] || statusConfig.pending;
                return (
                  <div
                    key={inquiry.id}
                    className={`group relative rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-800/60 border-gray-700/50 hover:border-gray-600/80' : 'bg-white/80 border-gray-200/50 hover:border-gray-300/80'}`}
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-1 group-hover:text-blue-500 transition-colors duration-300`}>
                            {inquiry.fullName || 'No Name'}
                          </h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                            {inquiry.inquarytype || 'General Inquiry'}
                          </p>
                        </div>
                        
                        <PermissionProtectedAction action="update" module="CustomerSupport Management">

                          <div className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border ${statusStyle.color} transition-all duration-300 hover:scale-105`}>
                            <div className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`}></div>
                            <select
                              value={inquiry.status || 'pending'}
                              onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                              className="bg-transparent border-none text-inherit focus:outline-none cursor-pointer appearance-none pr-4"
                            >
                              <option value="pending">Pending</option>
                              <option value="Connected">Connected</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </PermissionProtectedAction>



                      </div>

                      {/* Enhanced Contact Info */}
                      <div className="space-y-3">
                        <div className="flex items-center group/item">
                          <div className={`p-2 rounded-lg mr-3  transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700/50 group-hover/item:bg-blue-600/20' : 'bg-gray-100 group-hover/item:bg-blue-50'}`}>
                            <Mail className={`h-4  text-red-500  w-4 ${theme === 'dark' ? '  group-hover/item:text-blue-400' : 'text-gray-500 group-hover/item:text-blue-500'} transition-colors duration-300`} />
                          </div>
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300 group-hover/item:text-white' : 'text-gray-600 group-hover/item:text-gray-800'} transition-colors duration-300 truncate`}>
                            {inquiry.email || 'No email provided'}
                          </span>
                        </div>

                        <div className="flex items-center group/item">
                          <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700/50 group-hover/item:bg-green-600/20' : 'bg-gray-100 group-hover/item:bg-green-50'}`}>
                            <Phone className={`h-4 text-green-400 w-4 ${theme === 'dark' ? 'text-gray-400 group-hover/item:text-green-400' : 'text-gray-500 group-hover/item:text-green-500'} transition-colors duration-300`} />
                          </div>
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300 group-hover/item:text-white' : 'text-gray-600 group-hover/item:text-gray-800'} transition-colors duration-300`}>
                            {inquiry.phoneno || 'No phone provided'}
                          </span>
                        </div>

                        <div className="flex items-start group/item">
                          <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700/50 group-hover/item:bg-purple-600/20' : 'bg-gray-100 group-hover/item:bg-purple-50'}`}>
                            <MessageSquare className={`h-4 text-yellow-400 w-4 ${theme === 'dark' ? 'text-gray-400 group-hover/item:text-purple-400' : 'text-gray-500 group-hover/item:text-purple-500'} transition-colors duration-300`} />
                          </div>
                          <p className={`text-sm font-medium flex-1 ${theme === 'dark' ? 'text-gray-300 group-hover/item:text-white' : 'text-gray-600 group-hover/item:text-gray-800'} transition-colors duration-300 leading-relaxed`}>
                            "{inquiry.message || 'No message provided'}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Card Footer */}
                    <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'} backdrop-blur-sm`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs">
                          <Clock className={`h-3 w-3 mr-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {inquiry.date ? new Date(inquiry.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'Unknown date'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Enhanced Results Count */}
          {!loading && filteredData.length > 0 && (
            <div className={`mt-12 p-6 rounded-2xl text-center border backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/50 border-gray-200/50'}`}>
              <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Displaying <span className="font-bold text-blue-500">{filteredData.length}</span> of <span className="font-bold text-blue-500">{contactData.length}</span> total inquiries
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllInquary;