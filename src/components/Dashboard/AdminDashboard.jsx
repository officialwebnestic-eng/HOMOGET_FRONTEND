import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line, Doughnut, Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { 
  Home, Users, IndianRupee, Eye, ReceiptIndianRupee, 
  Plus, MapPin, Clock, BarChart3, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Wallet, Activity,
  Building, Calendar, CheckCircle, XCircle, AlertCircle,
  DollarSign, ShoppingBag, UserPlus, Star, RefreshCw
} from "lucide-react";

// Components & Utils
import useGetAllAgent from "../../hooks/useGetAllAgent";
import useGetAllProperty from "../../hooks/useGetAllProperty";
import { http } from "../../axios/axios";
import { useTheme } from "../../context/ThemeContext";
import CreateSession from "../admin/session/CreateSession";
import { monthOptions } from "../../helpers/DashboardHelpers";

// Chart.js Registration
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler, ArcElement,
  BarElement
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler, ArcElement
);

const AdminDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { agentList = [] } = useGetAllAgent();
  const { propertyList = [] } = useGetAllProperty(1, 5, {});
  const isDark = theme === 'dark';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalProperties: 0, totalUsers: 0, revenue: 0, 
    totalSales: 0, pendingAppointments: 0, activeListing: 0,
    totalAgents: 0, monthlyGrowth: 0
  });
  const [earningResultData, setEarningResultData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [latestTransaction, setLatestTransaction] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[new Date().getMonth()]);
  const [chartPeriod, setChartPeriod] = useState('monthly'); // monthly, weekly, yearly

  const colors = useMemo(() => ({
    background: isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50',
    card: isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-200 shadow-sm',
    cardHover: isDark ? 'hover:bg-white/5' : 'hover:shadow-lg',
    text: isDark ? 'text-white' : 'text-slate-900',
    subText: isDark ? 'text-slate-400' : 'text-slate-500',
    accent: '#f59e0b',
    accentLight: 'rgba(245, 158, 11, 0.1)',
    chartLine: isDark ? 'rgba(245, 158, 11, 0.8)' : 'rgba(245, 158, 11, 0.8)'
  }), [isDark]);

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const { data } = await http.get("/getadmin", { withCredentials: true });
        if (data.success) {
          setAdminStats({
            totalProperties: data.totalProperties || 0,
            totalUsers: data.totalUsers || 0,
            revenue: data.revenue || 0,
            pendingAppointments: data.pendingAppoinments || 0,
            activeListing: data.activeListing || 0,
            totalSales: data.totalSales || 0,
            totalAgents: data.totalAgents || agentList.length,
            monthlyGrowth: data.monthlyGrowth || 12
          });
          setEarningResultData(data.earningsData?.result || []);
          setLatestTransaction(data.topTransactionList || []);
          setLocationData(data.mostelySalesLoaction || []);
          setRecentProperties(data.recentProperties || []);
        }
      } catch (error) { console.error(error); }
    };
    getAdminData();
  }, [agentList.length]);

  // Line Chart Data (Revenue Trends)
  const lineChartData = {
    labels: monthOptions,
    datasets: [{
      label: 'Revenue (AED)',
      data: monthOptions.map((_, i) => {
        const match = earningResultData.find(e => e._id?.month === i + 1);
        return match?.totalEarnings || 0;
      }),
      fill: true,
      borderColor: colors.accent,
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.canvas;
        const gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, colors.accentLight);
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        return gradient;
      },
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: colors.accent,
      pointBorderColor: isDark ? '#0a0a0c' : '#fff',
      pointBorderWidth: 2,
    }]
  };

  // Bar Chart Data (Monthly Sales)
  const barChartData = {
    labels: monthOptions.slice(0, 6),
    datasets: [{
      label: 'Properties Sold',
      data: monthOptions.slice(0, 6).map((_, i) => Math.floor(Math.random() * 50) + 20),
      backgroundColor: colors.accentLight,
      borderColor: colors.accent,
      borderWidth: 1,
      borderRadius: 8,
      barPercentage: 0.6,
    }]
  };

  // Pie Chart Data (Property Type Distribution)
  const pieChartData = {
    labels: ['Residential', 'Commercial', 'Off-Plan'],
    datasets: [{
      data: [65, 20, 15],
      backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6'],
      borderWidth: 0,
    }]
  };

  // Doughnut Chart Data (Monthly Target)
  const currentMonthIncome = useMemo(() => {
    const monthIndex = monthOptions.indexOf(selectedMonth) + 1;
    const match = earningResultData.find(e => e._id?.month === monthIndex);
    return match?.totalEarnings || 0;
  }, [selectedMonth, earningResultData]);

  const monthlyTarget = 500000;
  const targetPercentage = Math.min((currentMonthIncome / monthlyTarget) * 100, 100);

  const doughnutData = {
    labels: ['Achieved', 'Remaining'],
    datasets: [{
      data: [currentMonthIncome, Math.max(monthlyTarget - currentMonthIncome, 0)],
      backgroundColor: [colors.accent, isDark ? '#1e293b' : '#e2e8f0'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  // Stat Cards Data
  const statCards = [
    { title: "Total Revenue", value: `AED ${adminStats.revenue.toLocaleString()}`, icon: <Wallet size={22} />, trend: "+12.5%", color: "amber", suffix: "" },
    { title: "Properties Sold", value: adminStats.totalSales, icon: <ShoppingBag size={22} />, trend: "+8.2%", color: "blue", suffix: "" },
    { title: "Active Listings", value: adminStats.activeListing, icon: <Home size={22} />, trend: "+3.1%", color: "emerald", suffix: "" },
    { title: "Total Agents", value: adminStats.totalAgents, icon: <Users size={22} />, trend: "+5.4%", color: "purple", suffix: "" },
  ];

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text} p-4 lg:p-8 transition-colors duration-500`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-[9px] font-bold uppercase tracking-wider ${colors.subText}`}>Admin Control Panel</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Welcome back, <span style={{ color: colors.accent }}>Admin</span>
          </h1>
          <p className={`text-xs ${colors.subText} mt-1`}>Here's what's happening with your business today.</p>
        </div>
    
      </div>

      {/* STATS GRID - 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, idx) => (
          <StatCard key={idx} {...card} isDark={isDark} />
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Line Chart - Revenue Trend */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border ${colors.card}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold">Revenue Trend</h3>
              <p className={`text-[10px] ${colors.subText}`}>Monthly revenue performance</p>
            </div>
            <div className="flex gap-2">
              {['Monthly', 'Yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period.toLowerCase())}
                  className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                    chartPeriod === period.toLowerCase() 
                      ? 'bg-amber-500 text-white' 
                      : `${colors.subText} hover:bg-white/10`
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px]">
            <Line 
              data={lineChartData} 
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: { 
                  legend: { display: false },
                  tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: isDark ? '#fff' : '#000' }
                },
                scales: {
                  y: { 
                    grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                    ticks: { color: colors.subText, font: { size: 10 } }
                  },
                  x: { 
                    grid: { display: false },
                    ticks: { color: colors.subText, font: { size: 10 } }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Doughnut Chart - Monthly Target */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border ${colors.card}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold">Monthly Target</h3>
              <p className={`text-[10px] ${colors.subText}`}>Progress towards goal</p>
            </div>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-[10px] font-bold text-amber-500 outline-none border border-amber-500/20 rounded-lg px-2 py-1"
            >
              {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-32 h-32">
              <Doughnut 
                data={doughnutData} 
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black">{targetPercentage.toFixed(0)}%</span>
                <span className={`text-[7px] uppercase font-bold ${colors.subText}`}>Complete</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-amber-500">AED {currentMonthIncome.toLocaleString()}</p>
              <p className={`text-[9px] ${colors.subText}`}>of AED {monthlyTarget.toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" />
                <span className="text-[9px] text-emerald-500">+{((currentMonthIncome / monthlyTarget) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Bar Chart - Monthly Sales */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border ${colors.card}`}>
          <h3 className="text-base font-bold mb-4">Monthly Sales</h3>
          <div className="h-[250px]">
            <Bar 
              data={barChartData} 
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { 
                    grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                    ticks: { color: colors.subText, font: { size: 10 } }
                  },
                  x: { 
                    grid: { display: false },
                    ticks: { color: colors.subText, font: { size: 10 } }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Pie Chart - Property Distribution */}
        <div className={`lg:col-span-3 p-6 rounded-2xl border ${colors.card}`}>
          <h3 className="text-base font-bold mb-4">Property Distribution</h3>
          <div className="h-[200px] flex items-center justify-center">
            <Pie 
              data={pieChartData} 
              options={{
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'bottom', labels: { color: colors.subText, font: { size: 10 } } }
                }
              }} 
            />
          </div>
        </div>

        {/* Quick Stats - Agents Summary */}
        <div className={`lg:col-span-4 p-6 rounded-2xl border ${colors.card}`}>
          <h3 className="text-base font-bold mb-4">Team Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <UserPlus size={14} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Active Agents</p>
                  <p className="text-lg font-bold">{adminStats.totalAgents}</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-500">+5 this month</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Star size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Top Performers</p>
                  <p className="text-lg font-bold">8</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-500">4.8 ⭐ avg</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-purple-500/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Clock size={14} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Pending Approval</p>
                  <p className="text-lg font-bold">{adminStats.pendingAppointments}</p>
                </div>
              </div>
              <span className="text-[10px] text-amber-500">Awaiting review</span>
            </div>
          </div>
        </div>
      </div>

      {/* LATEST PROPERTY LISTINGS TABLE */}
      <div className={`rounded-2xl border ${colors.card} overflow-hidden mb-8`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold">Latest Property Listings</h3>
            <p className={`text-[10px] ${colors.subText}`}>Recently added properties</p>
          </div>
          <button 
            onClick={() => navigate('/propertylisting')}
            className="text-[10px] font-bold text-amber-500 hover:underline flex items-center gap-1"
          >
            View All <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[8px] font-bold uppercase tracking-wider ${colors.subText} border-b border-white/5`}>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {propertyList.slice(0, 5).map((property) => (
                <tr key={property._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={property.image?.[0]} 
                        alt={property.propertyname}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{property.propertyname}</p>
                        <p className="text-[9px] font-mono opacity-40">ID: {property._id?.slice(-8)}</p>
                      </div>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">
                      {property.propertytype || 'Property'}
                    </span>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-slate-500" />
                      <span className="text-xs">{property.city || 'Dubai'}</span>
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-amber-500">AED {property.price?.toLocaleString()}</p>
                   </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${
                      property.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-slate-500/10 text-slate-500'
                    }`}>
                      {property.status || 'Active'}
                    </span>
                   </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/property/${property._id}`)}
                      className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
                    >
                      <Eye size={14} />
                    </button>
                   </td>
                 </tr>
              ))}
              {propertyList.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No properties found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT TRANSACTIONS & TOP LOCATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Transactions */}
        <div className={`lg:col-span-7 rounded-2xl border ${colors.card} overflow-hidden`}>
          <div className="p-6 border-b border-white/5">
            <h3 className="text-base font-bold">Recent Transactions</h3>
            <p className={`text-[10px] ${colors.subText}`}>Latest property deals</p>
          </div>
          <div className="divide-y divide-white/5">
            {latestTransaction.slice(0, 4).map((t) => (
              <div key={t._id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <ReceiptIndianRupee size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.propertyId?.propertyname || 'Property'}</p>
                    <p className="text-[9px] font-mono opacity-40">Ref: {t.transactionId?.slice(-8) || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-500">AED {t.price?.toLocaleString()}</p>
                  <p className={`text-[9px] font-bold ${t.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {t.status || 'Pending'}
                  </p>
                </div>
              </div>
            ))}
            {latestTransaction.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                No transactions found
              </div>
            )}
          </div>
        </div>

        {/* Top Locations - Regional Sales */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border ${colors.card}`}>
          <h3 className="text-base font-bold mb-4">Top Performing Locations</h3>
          <div className="space-y-4">
            {locationData.length > 0 ? (
              locationData.slice(0, 4).map((loc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                      {loc.location?.city?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{loc.location?.city || 'Dubai'}</p>
                      <p className="text-[9px] text-slate-500">{loc.totalBookings || 0} deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-500">AED {loc.totalRevenue?.toLocaleString() || 0}</p>
                    <div className="w-20 h-1 bg-slate-200 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min((loc.totalRevenue / 10000000) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 opacity-50">
                <MapPin size={32} />
                <p className="text-[10px] font-bold uppercase mt-3">No location data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateSession isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

// Enhanced Stat Card Component
const StatCard = ({ title, value, icon, trend, color, isDark }) => {
  const isPositive = trend?.startsWith('+');
  const colorClasses = {
    amber: 'bg-amber-500/10 text-amber-500',
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-5 rounded-2xl border ${isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-200'} shadow-sm transition-all`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
          isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
        }`}>
          {trend}
        </span>
      </div>
      <div>
        <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
        <h4 className="text-xl font-bold mt-1">{value}</h4>
      </div>
    </motion.div>
  );  
};

export default AdminDashboard;