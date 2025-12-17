import React, { useState, useEffect, useContext } from 'react';
import { http } from '../../axios/axios';
import { AuthContext } from '../../context/AuthContext';
import { CalendarDays, Clock, MapPin, StickyNote, Building2, AlertCircle, X, ChevronRight, Link as LinkIcon, User, RefreshCw, Home, Settings, Bell, Search, Calendar, Filter, MoreVertical, Info, Mail, Phone, Map } from 'lucide-react';

// Toast notification icons
const SuccessIcon = () => (
  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </div>
);

const ErrorIcon = () => (
  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  </div>
);

const InfoIcon = () => (
  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  </div>
);

const ShowUserAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  // Toast state and configuration
  const [toasts, setToasts] = useState([]);
  const toastTypes = {
    success: { 
      icon: <SuccessIcon />,
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-500',
      text: 'text-green-700'
    },
    error: { 
      icon: <ErrorIcon />,
      bg: 'bg-red-50',
      border: 'border-l-4 border-red-500',
      text: 'text-red-700'
    },
    info: { 
      icon: <InfoIcon />,
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-700'
    }
  };

  // Modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetailsAppointment, setSelectedDetailsAppointment] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await http.get('/getappoinmentbyuser', {
        withCredentials: true,
      });
      setAppointments(res.data?.data || []);
      addToast('Appointments refreshed successfully', 'success');
    } catch (error) {
      addToast('Failed to fetch appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newToast = {
      id,
      message,
      type,
      timestamp,
      duration,
      ...toastTypes[type] || toastTypes.info
    };
    
    setToasts(prev => [...prev, newToast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const openCancelModal = (appt) => {
    setSelectedAppointment(appt);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const openDetailsModal = (appt) => {
    setSelectedDetailsAppointment(appt);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDetailsAppointment(null);
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      addToast('Please provide a reason for cancellation', 'error');
      return;
    }
    try {
      await http.put(
        `/cancel/${selectedAppointment._id}`,
        { reason: cancelReason },
        { withCredentials: true }
      );
      addToast('Appointment canceled successfully', 'success');
      closeCancelModal();
      fetchAppointments();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to cancel appointment', 'error');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    // Filter by status
    if (filter !== 'all' && appt.status !== filter) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesProperty = appt.propertyId?.propertytype?.toLowerCase().includes(query);
      const matchesAddress = appt.propertyId?.address?.toLowerCase().includes(query);
      const matchesAgent = appt.agentId?.name?.toLowerCase().includes(query);
      const matchesNotes = appt.notes?.toLowerCase().includes(query);
      
      if (!(matchesProperty || matchesAddress || matchesAgent || matchesNotes)) return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 max-w-md w-full space-y-4">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`${toast.bg} ${toast.border} rounded-lg shadow-lg p-4 flex items-start animate-fadeIn`}
          >
            <div className="flex-shrink-0 mr-3">
              {toast.icon}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${toast.text}`}>{toast.message}</div>
              <div className="text-xs text-gray-500 mt-1">{toast.timestamp}</div>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

     

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="md:hidden">
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                <div className="ml-4 md:ml-0">
                  <h1 className="text-lg font-semibold text-gray-900">Appointment Manager</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <button className="p-1 rounded-full text-gray-500 hover:text-gray-700">
                    <Bell className="h-6 w-6" />
                  </button>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </div>
                
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || "User"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
                <p className="mt-1 text-gray-600">View and manage your property viewing appointments</p>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Appointments</option>
                   
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Filter className="h-4 w-4" />
                  </div>
                </div>
                <button
                  onClick={fetchAppointments}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <CalendarDays className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                    <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
                  </div>
                </div>
              </div>
           
              
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Properties</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {[...new Set(appointments.map(a => a.propertyId?._id))].length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <User className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Agents</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {[...new Set(appointments.map(a => a.agentId?._id))].length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="mt-3 text-lg font-medium text-gray-900">No appointments found</h2>
                <p className="mt-2 text-sm text-gray-500">
                  {filter === 'all' 
                    ? "You don't have any appointments scheduled yet." 
                    : `You don't have any ${filter} appointments.`}
                </p>
                <div className="mt-6">
                  <button
                    onClick={fetchAppointments}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Refresh Appointments
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-white overflow-hidden rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {appt.propertyId?.propertytype || 'Property Viewing'}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appt.status)}`}
                          >
                            {appt.status || 'pending'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {appt.status !== 'cancelled' && (
                            <button
                              onClick={() => openCancelModal(appt)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Cancel appointment"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => openDetailsModal(appt)}
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                            title="View details"
                          >
                            <Info className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-start">
                          <CalendarDays className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Date</p>
                            <p className="text-sm text-gray-900">{formatDate(appt.date)}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Clock className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Time</p>
                            <p className="text-sm text-gray-900">{formatTime(appt.time)}</p>
                          </div>
                        </div>

                        {appt.agentId && (
                          <div className="flex items-start">
                            <User className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-500">Agent</p>
                              <p className="text-sm text-gray-900">{appt.agentId.name}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {appt.propertyId && (
                        <div className="mt-5 pt-4 border-t border-gray-200">
                          <div className="flex items-center">
                            <Building2 className="flex-shrink-0 h-5 w-5 text-gray-400" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-500">Property</p>
                              <p className="text-sm text-gray-900">
                                {appt.propertyId.propertytype || 'Property'} - {appt.propertyId.address || ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 px-6 py-3 flex justify-between">
                      <div>
                        {appt.status === 'confirmed' && (
                          <span className="inline-flex items-center text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Confirmed
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => openDetailsModal(appt)}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        View details <ChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cancel Appointment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel your appointment for the property at <span className="font-medium">{selectedAppointment?.propertyId?.address}</span>? Please provide a reason below.
                      </p>
                      <textarea
                        className="mt-3 w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={4}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Reason for cancellation..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCancelSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm Cancellation
                </button>
                <button
                  type="button"
                  onClick={closeCancelModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedDetailsAppointment && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Appointment Details
                      </h3>
                      <button
                        onClick={closeDetailsModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900">{selectedDetailsAppointment.propertyId?.propertytype || 'Property Viewing'}</h4>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Date & Time</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(selectedDetailsAppointment.date)} at {formatTime(selectedDetailsAppointment.time)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDetailsAppointment.status)}`}>
                              {selectedDetailsAppointment.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Meeting Platform</p>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {selectedDetailsAppointment.meetingPlatform}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Reference ID</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedDetailsAppointment._id.substring(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Property Information</h4>
                          {selectedDetailsAppointment.propertyId && typeof selectedDetailsAppointment.propertyId === 'object' ? (
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-gray-500">Property Type</p>
                                <p className="text-sm font-medium text-gray-900">{selectedDetailsAppointment.propertyId.propertytype}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-sm font-medium text-gray-900">{selectedDetailsAppointment.propertyId.address}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="text-sm font-medium text-gray-900">₹{selectedDetailsAppointment.propertyId.price?.toLocaleString() || 'N/A'}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No property details available</p>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Agent Information</h4>
                          {selectedDetailsAppointment.agentId && typeof selectedDetailsAppointment.agentId === 'object' ? (
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-gray-500">Agent Name</p>
                                <p className="text-sm font-medium text-gray-900">{selectedDetailsAppointment.agentId.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Contact</p>
                                <div className="flex space-x-2">
                                  <a 
                                    href={`mailto:${selectedDetailsAppointment.agentId.email}`}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                                  >
                                    <Mail className="h-4 w-4 mr-1" /> Email
                                  </a>
                                  {selectedDetailsAppointment.agentId.phone && (
                                    <a 
                                      href={`tel:${selectedDetailsAppointment.agentId.phone}`}
                                      className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                                    >
                                      <Phone className="h-4 w-4 mr-1" /> Call
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No agent assigned</p>
                          )}
                        </div>
                      </div>
                      
                      {selectedDetailsAppointment.notes && (
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-900 mb-3">Additional Notes</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {selectedDetailsAppointment.notes}
                          </p>
                        </div>
                      )}
                      
                      {selectedDetailsAppointment.meetingLink && (
                        <div className="mt-6">
                          <a
                            href={selectedDetailsAppointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeDetailsModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowUserAppointment;