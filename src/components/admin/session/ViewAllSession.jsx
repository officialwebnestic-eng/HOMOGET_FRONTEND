import React, { useEffect, useState } from "react";
import { http } from "../../../axios/axios";
import { Search, User, Mail, Phone, MapPin, Calendar, Trash2, Video, Link } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import PermissionProtectedAction from "../../../Authorization/PermissionProtectedActions";

const ViewAllSession = () => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    clientemail: "",
    contactno: "",
    clientname: "",
    city: "",
    state: "",
  });

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await http.get("/getallsession", {
        params: filters,
      });
      setSessions(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await http.delete(`/deletesession/${id}`);
        fetchSessions();
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [filters]);

  // Theme classes
  const themeClasses = {
    light: {
      bg: "bg-gray-50",
      cardBg: "bg-white",
      text: "text-gray-800",
      secondaryText: "text-gray-500",
      border: "border-gray-200",
      inputBg: "bg-white",
      hover: "hover:bg-gray-100",
      shadow: "shadow-sm",
      button: "bg-indigo-600 hover:bg-indigo-700",
      deleteButton: "bg-red-100 hover:bg-red-200 text-red-600",
      placeholder: "placeholder-gray-400",
    },
    dark: {
      bg: "bg-gray-900",
      cardBg: "bg-gray-800",
      text: "text-gray-100",
      secondaryText: "text-gray-400",
      border: "border-gray-700",
      inputBg: "bg-gray-700",
      hover: "hover:bg-gray-700",
      shadow: "shadow-md",
      button: "bg-indigo-700 hover:bg-indigo-600",
      deleteButton: "bg-red-900 hover:bg-red-800 text-red-300",
      placeholder: "placeholder-gray-500",
    },
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  return (
    <div className={`p-4 md:p-6 max-w-7xl mx-auto min-h-screen transition-colors duration-300 ${currentTheme.bg}`}>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${currentTheme.text}`}>Session Management</h1>
          <p className={`mt-1 ${currentTheme.secondaryText}`}>View and manage all client sessions</p>
        </div>
        <a
          href="/createsession"
          className={`inline-flex items-center px-5 py-2 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'
            }`}
        >
          Create Session
        </a>
      </div>

      {/* Filter Section */}
      <div className={`p-5 rounded-xl ${currentTheme.shadow} mb-8 ${currentTheme.cardBg} ${currentTheme.border} border`}>
        <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${currentTheme.text}`}>
          <Search size={18} /> Filter Sessions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { field: "clientname", icon: <User size={16} className={currentTheme.secondaryText} />, label: "Client Name" },
            { field: "clientemail", icon: <Mail size={16} className={currentTheme.secondaryText} />, label: "Client Email" },
            { field: "contactno", icon: <Phone size={16} className={currentTheme.secondaryText} />, label: "Contact Number" },
            { field: "city", icon: <MapPin size={16} className={currentTheme.secondaryText} />, label: "City" },
            { field: "state", icon: <MapPin size={16} className={currentTheme.secondaryText} />, label: "State" },
          ].map(({ field, icon, label }) => (
            <div key={field} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
              </div>
              <input
                type="text"
                name={field}
                placeholder={label}
                value={filters[field]}
                onChange={handleChange}
                className={`pl-10 w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${currentTheme.inputBg
                  } ${currentTheme.border} border ${currentTheme.text} ${currentTheme.placeholder}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Session Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : sessions.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`rounded-xl p-6 ${currentTheme.shadow} border ${currentTheme.border} hover:shadow-md transition-all ${currentTheme.cardBg}`}
            >
              {/* Client Info */}
              <div className="flex items-start space-x-4 mb-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                  <User size={20} />
                </div>
                <div>
                  <h3 className={`font-semibold ${currentTheme.text}`}>{session.clientname}</h3>
                  <p className={`text-sm ${currentTheme.secondaryText}`}>{session.clientemail}</p>
                </div>
              </div>

              {/* Session Details */}
              <div className={`space-y-3 text-sm mb-6 ${currentTheme.text}`}>
                <div className="flex items-center">
                  <Phone size={14} className={`mr-2 ${currentTheme.secondaryText}`} />
                  <span>{session.contactno}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className={`mr-2 ${currentTheme.secondaryText}`} />
                  <span>{session.city}, {session.state}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className={`mr-2 ${currentTheme.secondaryText}`} />
                  <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                </div>
                {session.agentname && (
                  <div className={`pt-2 border-t ${currentTheme.border}`}>
                    <p className={`text-xs mb-1 ${currentTheme.secondaryText}`}>Assigned Agent</p>
                    <p>{session.agentname}</p>
                    {session.agentemail && (
                      <p className={`text-xs ${currentTheme.secondaryText}`}>{session.agentemail}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className={`flex justify-between items-center pt-4 border-t ${currentTheme.border}`}>
                
                {session.roomLink && (
                  <a
                    href={session.roomLink}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 text-white text-sm rounded-lg transition-colors ${currentTheme.button}`}
                  >
                    <Video size={16} /> Join Session
                  </a>
                )}


                <PermissionProtectedAction action="delete" module="Session Management">
                  <button
                    onClick={() => handleDelete(session._id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${currentTheme.deleteButton}`}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </PermissionProtectedAction>

              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={`p-8 rounded-xl ${currentTheme.shadow} text-center ${currentTheme.cardBg} ${currentTheme.border} border`}>
          <div className={`mb-4 ${currentTheme.secondaryText}`}>
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className={`text-lg font-medium ${currentTheme.text}`}>No sessions found</h3>
          <p className={`mt-2 ${currentTheme.secondaryText}`}>Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default ViewAllSession;