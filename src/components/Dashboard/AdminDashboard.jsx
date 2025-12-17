import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";

import Pagination from "../common/Paginations";

import useGetAllAgent from "../../hooks/useGetAllAgent";
import { http } from "../../axios/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from "chart.js";
import { Home, Users, IndianRupee, Eye, Trash2, ReceiptIndianRupee, Plus, TrendingUp, MapPin, Clock, Star, ArrowRight } from "lucide-react";
import CreateSession from "../admin/session/CreateSession";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import EmptyStateModel from "../../model/EmptyStateModel";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);



const AdminDashboard = () => {
  const { theme } = useTheme();

  const { agentList } = useGetAllAgent();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [totalproperty, setTotalProperty] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [pendingAppoiments, setPendigAppoinments] = useState(0);
  const [earningResultData, setEarningResultData] = useState([]);
  const [locationData, setLocationData] = useState([]);

  const [latestTransaction, setLatestTransaction] = useState([]);
  const [activeListing, setActiveListing] = useState(0);
  const navigate = useNavigate();

  // State to hold chart data
  const [chartData, setChartData] = useState({ income: 0, })

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getCurrentMonthName = () => monthOptions[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName());

  const colors = {
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    cardBg: theme === 'dark' ? 'bg-slate-800/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl',
    cardBorder: theme === 'dark' ? 'border-slate-700/50' : 'border-white/30',
    textPrimary: theme === 'dark' ? 'text-slate-100' : 'text-slate-800',
    textSecondary: theme === 'dark' ? 'text-slate-400' : 'text-slate-600',
    inputBg: theme === 'dark' ? 'bg-slate-700/50 border-slate-600/50 backdrop-blur-sm' : 'bg-white/70 border-slate-200/50 backdrop-blur-sm',
    buttonPrimary: `bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl`,
    buttonSecondary: theme === 'dark' ? 'bg-slate-700/50 hover:bg-slate-600/50 backdrop-blur-sm' : 'bg-white/50 hover:bg-white/70 backdrop-blur-sm',
    tableHeader: theme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm' : 'bg-slate-50/50 backdrop-blur-sm',
    tableRowHover: theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50',
    chartTextColor: theme === 'dark' ? '#E2E8F0' : '#334155',
    chartGridColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  };

  // Fetch admin data
  const getAdminData = async () => {
    try {
      const response = await http.get("/getadmin", { withCredentials: true });
      const data = response.data;

      if (data.success === true) {
        setTotalProperty(data.totalProperties);
        setTotalUser(data.totalUsers);
        setTotalRevenue(data.revenue);
        setPendigAppoinments(data.pendingAppoinments);
        setActiveListing(data.activeListing);
        setTotalSales(data.totalSales);
        setEarningResultData(data.earningsData?.result || {});
        setLatestTransaction(data.topTransactionList || []);
        setLocationData(
          data.mostelySalesLoaction?.map(item => ({
            id: item.location.city + item.location.state,
            state: item.location.state,

            city: item.location.city,
            totalBookings: item.totalBookings ?? 0,
            sales: item.totalRevenue ?? 0
          })) || []
        );

      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);
  

  const generateChartData = (month) => {
    const monthIndex = monthOptions.indexOf(month) + 1;
    const selected = earningResultData.find((entry) => entry._id?.month === monthIndex);
    if (!selected) return { income: 0, expenses: 0 };
    const total = selected.totalEarnings || 0;
    return {
      income: total,
    };
  };

  useEffect(() => {
    const data = generateChartData(selectedMonth);
    setChartData(data);
  }, [earningResultData, selectedMonth]);

  const { income } = chartData;

  const pieChartData = {
    labels: ['Income'],
    datasets: [{
      data: [income],
      backgroundColor: [
        theme === 'dark' ? 'rgba(245, 87, 108, 0.8)' : 'rgba(118, 75, 162, 0.8)',
      ],
      borderColor: 'transparent',
      borderWidth: 0,
      cutout: '75%',


    }]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: colors.chartTextColor,
          font: {
            size: 14,
            weight: '600',
            family: 'Inter, system-ui, sans-serif'
          },
          padding: 30,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 15,
          boxHeight: 15
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#ffffff' : '#0f172a',
        bodyColor: theme === 'dark' ? '#e2e8f0' : '#475569',
        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
        borderWidth: 1,
        padding: 20,
        cornerRadius: 16,
        titleFont: {
          size: 15,
          weight: '700'
        },
        bodyFont: {
          size: 14,
          weight: '600'
        },
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? Math.round((value / total) * 100) : 0;
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };


  const handleViewDetails = (id) => {
    navigate(`/viewalltransiondata/${id}`);
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-500 ${colors.background}`}>
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-20 right-20 w-64 h-64 rounded-full opacity-20 ${theme === 'dark' ? 'bg-purple-500' : 'bg-blue-400'} blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-10 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-purple-400'} blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
   <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 mb-8 relative"
>
  {/* Left Section */}
  <div className="text-center md:text-left">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
      Admin Dashboard
    </h1>
    <p className={`text-base sm:text-lg mt-2 ${colors.textSecondary}`}>
      Welcome back! Here's what's happening today.
    </p>
  </div>

  {/* Right Section - Button */}
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center justify-center gap-2 sm:gap-3 ${colors.buttonPrimary} text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-2xl shadow-2xl transition-all duration-300 w-full md:w-auto`}
    onClick={() => setIsModalOpen(true)}
  >
    <Plus className="w-5 h-5" />
    <span className="text-sm sm:text-base">Add Session</span>
  </motion.button>

  {/* Modal Component */}
  <CreateSession isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
</motion.div>


      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
        {[
          {
            title: "Properties",
            count: totalproperty,
            icon: <Home size={24}  className="text-blue-800" />,
            gradient: 'from-blue-500 via-blue-600 to-indigo-600',
            bg: theme === 'dark' ? 'from-blue-900/30 to-indigo-900/30' : 'from-blue-50 to-indigo-100',
            iconBg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
            change: '+12%'
          },
          {
            title: "Active Listings",
            count: activeListing,
            icon: <Home size={24} className=" text-teal-800" />,
            gradient: 'from-green-500 via-emerald-500 to-teal-600',
            bg: theme === 'dark' ? 'from-green-900/30 to-teal-900/30' : 'from-green-50 to-teal-100',
            iconBg: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
            change: '+7%'
          },
          {
            title: "Agents",
            count: agentList.length,
            icon: <Users size={24} className="text-teal-800" />,
            gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
            bg: theme === 'dark' ? 'from-emerald-900/30 to-cyan-900/30' : 'from-emerald-50 to-cyan-100',
            iconBg: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
            change: '+8%'
          },
          {
            title: "Users",
            count: totalUser,
            icon: <Users size={24}  className="text-orange-800"/>,
            gradient: 'from-amber-500 via-orange-500 to-red-500',
            bg: theme === 'dark' ? 'from-amber-900/30 to-red-900/30' : 'from-amber-50 to-red-100',
            iconBg: theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100',
            change: '+15%'
          },
          {
            title: "Pending Appointments",
            count: pendingAppoiments,
            icon: <Clock size={24} className="text-orange-800" />,
            gradient: 'from-orange-500 via-red-500 to-pink-500',
            bg: theme === 'dark' ? 'from-orange-900/30 to-pink-900/30' : 'from-orange-50 to-pink-100',
            iconBg: theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100',
            change: '+5%'
          },
          {
            title: "Revenue",
            count: `₹${totalRevenue?.toLocaleString()}`,
            icon: <IndianRupee size={24} className="text-purple-800" />,
            gradient: 'from-purple-500 via-pink-500 to-red-500',
            bg: theme === 'dark' ? 'from-purple-900/30 to-red-900/30' : 'from-purple-50 to-red-100',
            iconBg: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
            change: '+23%'
          },
          {
            title: "Sales",
            count: totalSales?.toLocaleString(),
            icon: <ReceiptIndianRupee size={24} className="text-cyan-800"/>,
            gradient: 'from-cyan-500 via-blue-500 to-purple-500',
            bg: theme === 'dark' ? 'from-cyan-900/30 to-purple-900/30' : 'from-cyan-50 to-purple-100',
            iconBg: theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100',
            change: '+18%'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative p-6 rounded-3xl shadow-xl border ${colors.cardBorder} ${colors.cardBg} bg-gradient-to-br ${stat.bg} overflow-hidden group transition-all duration-300`}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-600 ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : ''}`}>
                  {stat.change}
                </div>
              </div>

              <div>
                <p className={`text-sm font-medium ${colors.textSecondary} mb-1`}>{stat.title}</p>
                <p className={`text-2xl font-bold ${colors.textPrimary}`}>{stat.count}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8  ">
        {/* Enhanced Pie Chart Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border ${colors.cardBorder} ${colors.cardBg} min-h-[400px] max-h-[85vh] flex flex-col relative overflow-hidden`}
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4 sm:gap-6">
            <div className="relative z-10">
              <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${colors.textPrimary} mb-1 sm:mb-2`}>
                Monthly Performance
              </h2>
              <p className={`text-sm sm:text-base ${colors.textSecondary}`}>
                Income for {selectedMonth}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mt-2 md:mt-0 relative z-10">
              {/* Month Selector */}
              <select
                className={`px-3 py-2 sm:p-3 rounded-xl text-sm sm:text-base focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${colors.inputBg} ${colors.textPrimary} shadow-lg`}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {monthOptions.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>

              {/* Income Badge */}
              <div className={`text-base sm:text-lg lg:text-xl font-bold flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-600'}`}>
                <IndianRupee size={18} className="mr-1" />
                {income.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>

            {/* Center Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <TrendingUp className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                <p className={`text-xs sm:text-sm font-semibold ${colors.textSecondary}`}>Total Income</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border ${colors.cardBorder} ${colors.cardBg} min-h-[400px] max-h-[80vh] flex flex-col relative overflow-hidden`}
        >
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-16 sm:translate-y-20 -translate-x-16 sm:-translate-x-20"></div>

          {/* Header */}
          <div className="mb-4 sm:mb-6 relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${colors.textPrimary}`}>Top Performing Cities</h2>
            </div>
            <p className={`text-sm sm:text-base ${colors.textSecondary}`}>Cities with highest sales performance</p>
          </div>

          {/* City List */}
          <div className="overflow-y-auto flex-1 mt-3 sm:mt-4 relative z-10 custom-scrollbar">
            {locationData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className={`p-3 sm:p-4 rounded-full ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100'} mb-3 sm:mb-4`}>
                  <MapPin className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.textSecondary}`} />
                </div>
                <EmptyStateModel
                  type="No Data Available"
                  title="No Location Match"
                  message="Try adjusting your location or price range to see more results."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locationData.map((loc, index) => (
                  <motion.div
                    key={loc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 sm:p-4 rounded-2xl ${theme === 'dark' ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-white/50 hover:bg-white/80'} backdrop-blur-sm border ${theme === 'dark' ? 'border-slate-600/30' : 'border-slate-200/50'} transition-all duration-300 cursor-pointer group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-base sm:text-lg shadow-lg">
                          {loc.city.charAt(0)}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl group-hover:animate-pulse"></div>
                        </div>
                        <div className="truncate max-w-[160px] sm:max-w-[200px] md:max-w-[240px]">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <p className={`text-base sm:text-lg font-bold ${colors.textPrimary} truncate`}>{loc.city}</p>
                            <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} fill="currentColor" />
                          </div>
                          <p className={`text-xs sm:text-sm ${colors.textSecondary} mb-0.5 sm:mb-1 truncate`}>{loc.state}</p>
                          <div className="flex items-center gap-2 sm:gap-4 text-xs">
                            <span className={`px-2 py-0.5 sm:px-2 sm:py-1 rounded-full ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                              ₹{(loc.sales ?? 0).toLocaleString()}
                            </span>
                            <span className={`px-2 py-0.5 sm:px-2 sm:py-1 rounded ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                              {loc.totalBookings ?? 0} bookings
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Enhanced Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl border ${colors.cardBorder} ${colors.cardBg} relative overflow-hidden`}
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Header */}
        <div
          className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4 p-4 sm:p-6 rounded-2xl ${theme === "dark"
              ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20"
              : "bg-gradient-to-r from-blue-50 to-purple-50"
            } border ${theme === "dark" ? "border-blue-800/30" : "border-blue-200/50"
            }`}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-xl ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"
                  }`}
              >
                <Clock
                  className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}
                />
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold ${colors.textPrimary}`}>
                Recent Transactions
              </h2>
            </div>
            <p className={`text-sm sm:text-base ${colors.textSecondary}`}>
              Latest property purchases and deals
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
          <table className="min-w-full text-sm sm:text-base">
            <thead
              className={`${colors.tableHeader} border-b border-slate-200/50 dark:border-slate-700/50`}
            >
              <tr>
                {["Property", "Transaction ID", "Amount", "Method", "Status", "Agent", "Actions"].map(
                  (header, idx) => (
                    <th
                      key={header}
                      className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${colors.textSecondary} `}
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-slate-200/50 dark:divide-slate-700/50 ${colors.cardBg}`}
            >
              <AnimatePresence>
                {latestTransaction.map((transaction, index) => (
                  <motion.tr
                    key={transaction._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${colors.tableRowHover} transition-all duration-200`}
                  >
                    {/* Property */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                          <Home className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <div className={`text-xs sm:text-sm font-bold ${colors.textPrimary}`}>
                            {transaction.propertyId?.propertyname || "N/A"}
                          </div>
                          <div
                            className={`text-[10px] sm:text-xs ${colors.textSecondary} flex items-center gap-1`}
                          >
                            <MapPin className="w-3 h-3" />
                            {transaction.propertyId?.city}, {transaction.propertyId?.state}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Transaction ID */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className={`text-xs sm:text-sm font-mono font-medium ${colors.textPrimary}`}>
                        {transaction.transactionId || "N/A"}...
                      </div>
                      <div className={`text-[10px] sm:text-xs ${colors.textSecondary}`}>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className={`text-xs sm:text-sm font-bold ${colors.textPrimary} flex items-center`}>
                        <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {transaction.price?.toLocaleString()}
                      </div>
                    </td>

                    {/* Method */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div
                        className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${theme === "dark"
                            ? "bg-slate-700/50 text-slate-300"
                            : "bg-slate-100 text-slate-700"
                          } font-medium`}
                      >
                        {transaction.paymentMethod === "credit_card"
                          ? "Credit Card"
                          : transaction.paymentMethod === "bank_transfer"
                            ? "Bank Transfer"
                            : transaction.paymentMethod}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 sm:px-3 py-1.5 inline-flex text-[10px] sm:text-xs leading-5 font-bold rounded-full ${transaction.status === "completed"
                            ? theme === "dark"
                              ? "bg-green-900/50 text-green-300 border border-green-700/50"
                              : "bg-green-100 text-green-800 border border-green-200"
                            : transaction.status === "pending"
                              ? theme === "dark"
                                ? "bg-amber-900/50 text-amber-300 border border-amber-700/50"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                              : theme === "dark"
                                ? "bg-red-900/50 text-red-300 border border-red-700/50"
                                : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>

                    {/* Agent (hidden on mobile) */}
                    <td className=" md:table-cell  px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {transaction.agentId?.profilePhoto?.length > 0 ? (
                          <img
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md"
                            src={`${transaction.agentProfilePhotoUrl}`}
                            alt={transaction.agentId.name}
                          />
                        ) : (
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600 shadow-md">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                        )}
                        <div className={`ml-2 sm:ml-3 text-xs sm:text-sm font-semibold ${colors.textPrimary}`}>
                          {transaction.agentId?.name || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Actions (hidden on mobile) */}
                    <td className=" md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewDetails(transaction._id)}
                          className={`p-2 rounded-xl ${theme === "dark"
                              ? "hover:bg-slate-700 text-slate-300 hover:text-indigo-400"
                              : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                            } transition-all duration-200 shadow-md hover:shadow-lg`}
                          title="View details"
                        >
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded-xl ${theme === "dark"
                              ? "hover:bg-slate-700 text-slate-300 hover:text-red-400"
                              : "hover:bg-slate-100 text-slate-500 hover:text-red-600"
                            } transition-all duration-200 shadow-md hover:shadow-lg`}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <div
            className={`px-3 py-2 sm:p-2 rounded-2xl ${theme === "dark" ? "bg-slate-700/30" : "bg-slate-100/50"
              } backdrop-blur-sm`}
          >
            <Pagination />
          </div>
        </div>
      </motion.div>


      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? 'rgba(71, 85, 105, 0.2)' : 'rgba(148, 163, 184, 0.2)'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(99, 102, 241, 0.5)'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(139, 92, 246, 0.7)' : 'rgba(99, 102, 241, 0.7)'};
        }
      `}</style>
    </div>
  );
};

// Helper function for marker color
const getMarkerColor = (sales) => {
  if (sales > 1000) return "#ef4444";
  if (sales > 800) return "#f97316";
  if (sales > 600) return "#eab308";
  return "#22c55e";
};

export default AdminDashboard;