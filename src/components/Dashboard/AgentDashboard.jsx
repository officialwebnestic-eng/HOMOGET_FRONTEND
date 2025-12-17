import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import {
  ReceiptIndianRupee,
  Users,
  Home,
  Plus,
  ArrowUpRight,
  ChevronDown,
  User,
  Eye,
  Trash2,
  TrendingUp,
  CreditCard,
  Banknote,
  Calendar,
  Target,
  Award,
  Activity,
  IndianRupee
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import PermissionProtectedAction from "../../Authorization/PermissionProtectedActions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AgentDashboard = () => {
  const { theme } = useTheme();
  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get current month for initial render
  const currentMonth = monthOptions[new Date().getMonth()];
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedUserMonth, setSelectedUserMonth] = useState("March");
  const [recentOrder, setRecentOrder] = useState([]);
  const [totalPendingProperty, setTotalPendingProperty] = useState(0);
  const [totalproperty, setTotalProperty] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [eraningResultData, setEarningResultData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const colors = {
    background: theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    cardBg: theme === 'dark' ? 'bg-slate-800/50 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl',
    cardBorder: theme === 'dark' ? 'border-slate-700/50' : 'border-white/20',
    textPrimary: theme === 'dark' ? 'text-slate-100' : 'text-slate-800',
    textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
    tableHeader: theme === 'dark' ? 'bg-slate-800/60' : 'bg-slate-50/60',
    tableRowHover: theme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50',
    inputBg: theme === 'dark' ? 'bg-slate-800/60 border-slate-600/50' : 'bg-white/60 border-slate-200/50',
    selectBg: theme === 'dark' ? 'bg-slate-800/80 border-slate-600/50 text-white' : 'bg-white/80 border-slate-200/50',
    chartTextColor: theme === 'dark' ? '#E2E8F0' : '#334155',
    chartGridColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  };

  const getAdminstatusData = async () => {
    try {
      const response = await http.get("/agentstatus", {
        withCredentials: true
      });

      const data = response.data;
      if (data) {
        setTotalProperty(data.totalProperty || 0);
        setTotalUser(data.totalUsers || 0);
        setTotalSales(data.totalRevenue?.totalSales || 0);
        setTotalRevenue(data.totalRevenue?.totalRevenue || 0);
        setTotalBalance(data.totalRevenue?.totalBalance || 0);
        setRecentOrder(data.recentOrder || []);
        setTotalPendingProperty(data.totalPendingProperty || 0);
        setEarningResultData(data.monthelyIncom?.result || []);
      }
    } catch (error) {
      console.log("Error fetching admin status data:", error);
    }
  };

  useEffect(() => {
    getAdminstatusData();
  }, []);

  const generateChartData = (month) => {
    const monthIndex = monthOptions.indexOf(month) + 1;
    const selected = eraningResultData.find((entry) => entry._id?.month === monthIndex);

    if (!selected) {
      return { sales: [0] };
    }

    return {
      sales: [selected.totalEarnings || 0],
    };
  };

  const { sales } = generateChartData(selectedMonth);
  const totalIncome = sales[0];

  const handleViewDetails = (id) => {
    navigate(`/agentlatestboking/${id}`);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await http.delete(`/transactions/${id}`, {
          withCredentials: true
        });
        getAdminstatusData();
        toast.success("Transaction deleted successfully");
      } catch (error) {
        toast.error("Failed to delete transaction");
        console.error("Error deleting transaction:", error);
      }
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-500 ${colors.background}`}>
      {/* Floating Header with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.cardBg} rounded-2xl shadow-xl border ${colors.cardBorder} p-6 mb-8`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'bg-gradient-to-r from-blue-100 to-purple-100'}`}>
              <Activity className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
                {user.role} Dashboard
              </h1>
              <p className={`${colors.textSecondary} mt-1`}>Welcome back! Here's your performance overview</p>
            </div>
          </div>
          
          <PermissionProtectedAction action="create" module={"Session Management"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl`}
              onClick={() => navigate("/add-session")}
            >
              <Plus className="w-5 h-5" />
              Add Session
            </motion.button>
          </PermissionProtectedAction>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Properties",
            count: totalproperty || 0,
        
            icon: <Home className="w-7 h-7" />,
            gradient: theme === 'dark' ? 'from-emerald-600/20 to-emerald-800/20' : 'from-emerald-50 to-emerald-100',
            iconColor: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
            textColor: theme === 'dark' ? 'text-emerald-100' : 'text-emerald-800',
            permission: { action: "view", module: "total property" }
          },
          {
            title: "Total Sales",
            count: totalSales || 0,
            
            icon: <TrendingUp className="w-7 h-7" />,
            gradient: theme === 'dark' ? 'from-blue-600/20 to-blue-800/20' : 'from-blue-50 to-blue-100',
            iconColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
            textColor: theme === 'dark' ? 'text-blue-100' : 'text-blue-800',
            permission: { action: "view", module: "total sales" }
          },
          {
            title: "Users",
            count: totalUser || 0,
            
            icon: <Users className="w-7 h-7" />,
            gradient: theme === 'dark' ? 'from-purple-600/20 to-purple-800/20' : 'from-purple-50 to-purple-100',
            iconColor: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
            textColor: theme === 'dark' ? 'text-purple-100' : 'text-purple-800',
            permission: { action: "view", module: "total user" }
          },
          {
            title: "TotalBalance",
            count: totalBalance || 0,
            
            icon: <IndianRupee className="w-7 h-7" />,
            gradient: theme === 'dark' ? 'from-red-600/20 to-red-800/20' : 'from-red-50 to-red-100',
            iconColor: theme === 'dark' ? 'text-red-400' : 'text-white-600',
            textColor: theme === 'dark' ? 'text-white-100' : 'text-white-800',
            permission: { action: "view", module: "total user" }
          },
          
        ].map((stat, i) => (
          <PermissionProtectedAction
            key={i}
            action={stat.permission.action}
            module={stat.permission.module}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${colors.cardBg} border ${colors.cardBorder} rounded-2xl shadow-xl p-6 relative overflow-hidden group`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
              

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconColor} bg-white/10`}>
                    {stat.icon}
                  </div>
                
                </div>
                
                <h3 className={`text-sm font-medium ${stat.textColor} mb-2`}>{stat.title}</h3>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.count.toLocaleString()}
                </p>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
            </motion.div>
          </PermissionProtectedAction>
        ))}
      </div>

      {/* Charts Section with Enhanced Design */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Monthly Earnings Chart */}
        <PermissionProtectedAction action="view" module={"monthely Earnings"}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${colors.cardBg} p-8 rounded-2xl shadow-xl border ${colors.cardBorder} relative overflow-hidden`}
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                <div>
                  <h2 className={`text-2xl font-bold ${colors.textPrimary} mb-2`}>Monthly Earnings</h2>
                  <p className={`${colors.textSecondary}`}>Sales Performance Overview</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      className={`appearance-none pl-4 pr-10 py-3 rounded-xl text-sm font-medium cursor-pointer ${colors.selectBg} border transition-all hover:shadow-md focus:ring-2 focus:ring-blue-500/20`}
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                    <ReceiptIndianRupee className="w-5 h-5" />
                    <span className="font-bold text-lg">₹{totalIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="h-80 relative">
                <Pie
                  data={{
                    labels: ['Sales Income'],
                    datasets: [{
                      data: [totalIncome],
                      backgroundColor: [
                        theme === 'dark' ? 
                          'rgba(16, 185, 129, 0.8)' : 
                          'rgba(52, 211, 153, 0.8)'
                      ],
                      borderWidth: 0,
                      hoverOffset: 8
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          color: colors.chartTextColor,
                          usePointStyle: true,
                          padding: 25,
                          font: { size: 14, weight: '600' },
                          generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                              return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                return {
                                  text: `${label}: ₹${value.toLocaleString()}`,
                                  fillStyle: theme === 'dark' ? '#10B981' : '#059669',
                                  strokeStyle: 'transparent',
                                  pointStyle: 'circle'
                                };
                              });
                            }
                            return [];
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
                        titleColor: theme === 'dark' ? '#E2E8F0' : '#1E293B',
                        bodyColor: theme === 'dark' ? '#CBD5E1' : '#475569',
                        borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                        borderWidth: 1,
                        padding: 16,
                        cornerRadius: 12,
                        displayColors: false,
                        callbacks: {
                          label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ₹${value.toLocaleString()}`;
                          }
                        }
                      },
                    },
                    cutout: '60%',
                    radius: '90%'
                  }}
                />
                
                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-sm ${colors.textSecondary} mb-1`}>Total Sales</div>
                    <div className={`text-xl font-bold ${colors.textPrimary}`}>
                      ₹{totalIncome.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </PermissionProtectedAction>

        {/* Revenue Breakdown with Enhanced Design */}
        <PermissionProtectedAction action="view" module={"Revenue Breakdown "}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-gradient-to-br ${theme === 'dark' ? 'from-slate-800 via-slate-800/90 to-slate-900' : 'from-white via-slate-50 to-slate-100'} p-8 rounded-2xl shadow-xl border ${colors.cardBorder} relative overflow-hidden`}
          >
            {/* Animated Background */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className={`absolute top-0 right-0 w-40 h-40 ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'} rounded-full blur-3xl animate-pulse`}></div>
              <div className={`absolute bottom-0 left-0 w-32 h-32 ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-2xl animate-pulse delay-1000`}></div>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className={`text-2xl font-bold ${colors.textPrimary} mb-2`}>Revenue Breakdown</h2>
                  <p className={`${colors.textSecondary}`}>Monthly performance analysis</p>
                </div>
                <div className="relative">
                  <select
                    className={`appearance-none pl-4 pr-10 py-3 rounded-xl text-sm font-medium cursor-pointer ${colors.selectBg} border transition-all hover:shadow-md`}
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-xl p-6 mb-8 border ${theme === 'dark' ? 'border-blue-500/20' : 'border-blue-200/50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${colors.textSecondary} text-sm mb-1`}>Total Revenue</p>
                    <p className={`text-3xl font-bold ${colors.textPrimary}`}>₹{totalRevenue.toLocaleString()}</p>
                  </div>
                
                </div>
              </div>

              {/* Revenue Sources */}
              <div className="space-y-4">
                {[
                  { name: "Property Sales", value: totalSales, color: "emerald" },

                ].map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`flex justify-between items-center p-4 rounded-xl ${colors.cardBg} border ${colors.cardBorder} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full bg-${source.color}-500 shadow-lg`}></div>
                      <span className={`font-medium ${colors.textPrimary}`}>{source.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${colors.textPrimary}`}>₹{source.value.toLocaleString()}</span>
                   
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </PermissionProtectedAction>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Transaction History - Takes 2/3 width */}
        <div className="xl:col-span-2">
          <PermissionProtectedAction action="view" module={"transaction history"}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${colors.cardBg} p-8 rounded-2xl shadow-xl border ${colors.cardBorder}`}
            >
              <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 p-6 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <h2 className={`text-2xl font-bold ${colors.textPrimary}`}>Transaction History</h2>
                </div>
                <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-white/50'} ${colors.textSecondary}`}>
                  {recentOrder.length} transactions
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
                  <thead className={`${colors.tableHeader} backdrop-blur-sm`}>
                    <tr>
                      {['Property', 'Transaction', 'Amount', 'Method', 'Status', 'Agent', 'Actions'].map((header, i) => (
                        <th
                          key={i}
                          scope="col"
                          className={`px-6 py-4 text-left text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wider`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-slate-200/30 dark:divide-slate-700/30 ${colors.cardBg}`}>
                    {recentOrder?.map((transaction) => (
                      <motion.tr
                        key={transaction._id}
                        whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(248, 250, 252, 0.5)' }}
                        className={`${colors.tableRowHover} transition-all duration-200`}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                              <Home className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-semibold ${colors.textPrimary} line-clamp-1`}>
                                {transaction.propertyId?.propertyname || 'N/A'}
                              </div>
                              <div className={`text-xs ${colors.textSecondary}`}>
                                {transaction.propertyId?.city}, {transaction.propertyId?.state}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-sm font-mono ${colors.textPrimary}`}>#{transaction._id.slice(0, 8)}</div>
                          <div className={`text-xs ${colors.textSecondary}`}>
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`text-sm font-bold ${colors.textPrimary}`}>
                            ₹{new Intl.NumberFormat('en-IN').format(transaction.propertyId?.price)}
                          </div>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {transaction.paymentMethod === 'credit_card' ? (
                              <>
                                <CreditCard className={`h-4 w-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                                <span className={`text-sm ${colors.textSecondary}`}>Card</span>
                              </>
                            ) : transaction.paymentMethod === 'bank_transfer' ? (
                              <>
                                <Banknote className={`h-4 w-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                                <span className={`text-sm ${colors.textSecondary}`}>Transfer</span>
                              </>
                            ) : (
                              <span className={`text-sm ${colors.textSecondary} capitalize`}>
                                {transaction.paymentMethod}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`px-3 py-1.5 inline-flex text-xs leading-4 font-semibold rounded-full 
                          ${transaction.status === "confirmed" ?
                              (theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-800 border border-emerald-200') :
                              transaction.status === "pending" ?
                                (theme === 'dark' ? 'bg-amber-900/50 text-amber-300 border border-amber-500/20' : 'bg-amber-100 text-amber-800 border border-amber-200') :
                                (theme === 'dark' ? 'bg-red-900/50 text-red-300 border border-red-500/20' : 'bg-red-100 text-red-800 border border-red-200')}`}
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                              {transaction.agentId?.avatar ? (
                                <img
                                  src={transaction.agentId.avatar}
                                  alt="Agent"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className={`h-5 w-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                              )}
                            </div>
                            <div className="ml-3">
                              <div className={`text-sm font-medium ${colors.textPrimary} line-clamp-1`}>
                                {transaction.agentId?.name || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewDetails(transaction._id)}
                              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300 hover:text-blue-400' : 'hover:bg-slate-100 text-slate-500 hover:text-blue-600'} transition-all duration-200`}
                              title="View details"
                            >
                         <Eye className="h-4 w-4" />
                            </motion.button>
                         <PermissionProtectedAction action="delete" module="Payment Management">
                             <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteTransaction(transaction._id)}
                              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300 hover:text-red-400' : 'hover:bg-slate-100 text-slate-500 hover:text-red-600'} transition-all duration-200`}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                         </PermissionProtectedAction>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </PermissionProtectedAction>
        </div>

        {/* Achievements Section */}
        <div className="xl:col-span-1">
          <PermissionProtectedAction action="view" module={"Achievements"}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${colors.cardBg} p-8 rounded-2xl shadow-xl border ${colors.cardBorder} h-full relative overflow-hidden`}
            >
              {/* Background Effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                      <Target className="w-6 h-6" />
                    </div>
                    <h2 className={`text-xl font-bold ${colors.textPrimary}`}>Achievements</h2>
                  </div>
                  <div className="relative">
                    <select
                      className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-medium cursor-pointer ${colors.selectBg} border`}
                      value={selectedUserMonth}
                      onChange={(e) => setSelectedUserMonth(e.target.value)}
                    >
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 mb-8 relative">
                    <Pie
                      data={{
                        labels: ["Achieved", "Pending"],
                        datasets: [{
                          data: [totalSales || 0, totalPendingProperty || 0],
                          backgroundColor: [
                            theme === 'dark' ? '#6EE7B7' : '#10B981',
                            theme === 'dark' ? '#93C5FD' : '#3B82F6'
                          ],
                          borderWidth: 0,
                          hoverOffset: 6
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
                            titleColor: theme === 'dark' ? '#E2E8F0' : '#1E293B',
                            bodyColor: theme === 'dark' ? '#CBD5E1' : '#475569',
                            borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                          }
                        },
                        cutout: '70%'
                      }}
                    />
                    
                    {/* Center Achievement Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Award className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <div className={`text-xs ${colors.textSecondary}`}>Performance</div>
                        <div className={`text-lg font-bold ${colors.textPrimary}`}>
                          {totalproperty > 0 ? Math.round((totalSales / totalproperty)) : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className={`flex justify-between items-center p-4 rounded-xl ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50'} border ${theme === 'dark' ? 'border-emerald-500/20' : 'border-emerald-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-500'}`}></div>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-100' : 'text-emerald-800'}`}>Target Achieved</span>
                      </div>
                      <span className={`font-bold ${theme === 'dark' ? 'text-emerald-100' : 'text-emerald-800'}`}>
                        {totalSales} / {totalproperty}
                      </span>
                    </div>
                    
                    <div className={`flex justify-between items-center p-4 rounded-xl ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-blue-500/20' : 'border-blue-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>Pending</span>
                      </div>
                      <span className={`font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>
                        {totalPendingProperty} / {totalproperty}
                      </span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="w-full mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                    <h3 className={`text-sm font-semibold ${colors.textPrimary} mb-4`}>This Month</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {totalSales}
                        </div>
                        <div className={`text-xs ${colors.textSecondary}`}>Closed Deals</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                          ₹{(totalRevenue)}
                        </div>
                        <div className={`text-xs ${colors.textSecondary}`}>Revenue</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </PermissionProtectedAction>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;