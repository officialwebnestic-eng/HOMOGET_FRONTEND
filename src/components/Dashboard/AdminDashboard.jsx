import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { 
  Home, Users, IndianRupee, Eye, Trash2, ReceiptIndianRupee, 
  Plus, MapPin, Clock, ShieldCheck, ExternalLink, BarChart3 
} from "lucide-react";

// Components & Utils
import useGetAllAgent from "../../hooks/useGetAllAgent";
import { http } from "../../axios/axios";
import { useTheme } from "../../context/ThemeContext";
import CreateSession from "../admin/session/CreateSession";

// Chart.js Registration
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  BarElement, Title, Tooltip, Legend, Filler, ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, BarElement,
  Title, Tooltip, Legend, Filler, ArcElement
);

const AdminDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { agentList = [] } = useGetAllAgent();
  const isDark = theme === 'dark';

  // State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalProperties: 0, totalUsers: 0, revenue: 0, 
    totalSales: 0, pendingAppointments: 0, activeListing: 0
  });
  const [earningResultData, setEarningResultData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [latestTransaction, setLatestTransaction] = useState([]);
  
  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[new Date().getMonth()]);

  const colors = useMemo(() => ({
    background: isDark ? 'bg-slate-950' : 'bg-slate-50',
    card: isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200',
    text: isDark ? 'text-slate-100' : 'text-slate-900',
    subText: isDark ? 'text-slate-400' : 'text-slate-500',
    accent: 'from-amber-500 to-amber-700'
  }), [isDark]);

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
          totalSales: data.totalSales || 0
        });
        setEarningResultData(data.earningsData?.result || []);
        setLatestTransaction(data.topTransactionList || []);
        setLocationData(data.mostelySalesLoaction || []);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { getAdminData(); }, []);

  const currentMonthIncome = useMemo(() => {
    const monthIndex = monthOptions.indexOf(selectedMonth) + 1;
    const match = earningResultData.find(e => e._id?.month === monthIndex);
    return match?.totalEarnings || 0;
  }, [selectedMonth, earningResultData]);

  // --- EMPTY DATA HANDLING FOR PIE CHART ---
  const pieData = useMemo(() => {
    const hasData = currentMonthIncome > 0;
    return {
      labels: hasData ? ['Income', 'Target Remaining'] : ['No Data'],
      datasets: [{
        data: hasData ? [currentMonthIncome, currentMonthIncome * 0.1] : [1], // Use [1] to render the circle
        backgroundColor: hasData 
          ? [isDark ? '#f59e0b' : '#d97706', isDark ? '#1e293b' : '#f1f5f9']
          : [isDark ? '#334155' : '#e2e8f0'], // Grey color if 0
        borderWidth: 0,
        hoverOffset: hasData ? 10 : 0
      }]
    };
  }, [currentMonthIncome, isDark]);

  const pieOptions = {
    maintainAspectRatio: false,
    cutout: '80%',
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            if (currentMonthIncome === 0) return " Income: ₹0";
            return ` ${context.label}: ₹${context.raw.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text} p-4 md:p-8 transition-colors duration-500`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className={`text-4xl font-black bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
            Operations Hub
          </h1>
          <p className={`${colors.subText} font-medium mt-1`}>Real-time metrics for HomoGet Properties</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-amber-500/20 font-bold flex items-center gap-2"
        >
          <Plus size={20} /> Add Session
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        <StatCard title="Revenue" value={`₹${adminStats.revenue.toLocaleString()}`} icon={<IndianRupee />} color="text-amber-500" isDark={isDark} />
        <StatCard title="Sales" value={adminStats.totalSales} icon={<ReceiptIndianRupee />} color="text-blue-500" isDark={isDark} />
        <StatCard title="Listings" value={adminStats.activeListing} icon={<Home />} color="text-indigo-500" isDark={isDark} />
        <StatCard title="Users" value={adminStats.totalUsers} icon={<Users />} color="text-purple-500" isDark={isDark} />
        <StatCard title="Agents" value={agentList.length} icon={<Users />} color="text-emerald-500" isDark={isDark} />
        <StatCard title="Pending" value={adminStats.pendingAppointments} icon={<Clock />} color="text-rose-500" isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Performance Chart Card */}
        <div className={`lg:col-span-5 p-8 rounded-[2.5rem] border ${colors.card} shadow-xl relative overflow-hidden`}>
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="font-bold text-xl">Monthly Performance</h3>
              <p className={`text-xs ${colors.subText}`}>Revenue tracking</p>
            </div>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`text-xs font-bold p-2 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`}
            >
              {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="h-64 relative z-10">
            <Pie data={pieData} options={pieOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-2xl font-black ${currentMonthIncome === 0 ? colors.subText : ''}`}>
                ₹{currentMonthIncome.toLocaleString()}
              </span>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${colors.subText}`}>
                {currentMonthIncome === 0 ? 'No Earnings' : 'Income'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Locations Card */}
        <div className={`lg:col-span-7 p-8 rounded-[2.5rem] border ${colors.card} shadow-xl`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <MapPin className="text-amber-500" size={20} /> Sales by Region
            </h3>
            {locationData.length > 0 && <span className="text-[10px] font-black bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md">LIVE DATA</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {locationData.length > 0 ? (
              locationData.map((loc, i) => (
                <LocationItem key={i} loc={loc} isDark={isDark} colors={colors} />
              ))
            ) : (
              // Show skeleton/empty charts placeholders
              [1, 2, 3, 4].map((_, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-100'} flex items-center justify-between opacity-50`}>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-700/20 flex items-center justify-center text-xs">...</div>
                      <div className="h-3 w-20 bg-slate-700/20 rounded"></div>
                   </div>
                   <div className="h-3 w-10 bg-slate-700/20 rounded"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Transaction Table - Simplified for Redesign */}
      <div className={`rounded-[2.5rem] border ${colors.card} shadow-2xl overflow-hidden`}>
        <div className="p-8 border-b border-slate-800/10 flex justify-between items-center">
          <h3 className="font-bold text-xl">Recent Activity</h3>
          <button className="text-xs font-bold text-amber-600 hover:underline">View All Transactions</button>
        </div>
        <div className="overflow-x-auto">
          {latestTransaction.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[10px] uppercase tracking-widest ${colors.subText} border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <th className="px-8 py-4">Property</th>
                  <th className="px-8 py-4">ID</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {latestTransaction.map((t) => (
                  <tr key={t._id} className={`${isDark ? 'hover:bg-slate-800/20' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className="px-8 py-5 text-sm font-bold">{t.propertyId?.propertyname || 'N/A'}</td>
                    <td className="px-8 py-5 text-xs font-mono opacity-50">#{t.transactionId?.slice(-6)}</td>
                    <td className="px-8 py-5 font-black text-sm text-amber-600">₹{t.price?.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => navigate(`/viewalltransiondata/${t._id}`)} className="p-2 hover:text-amber-500 transition-colors"><Eye size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <BarChart3 className="text-slate-700 mb-4" size={48} />
              <p className="font-bold opacity-50 uppercase tracking-widest text-xs">No transactions recorded yet</p>
            </div>
          )}
        </div>
      </div>

      <CreateSession isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, icon, color, isDark }) => (
  <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg`}>
    <div className={`mb-4 w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${color}`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <p className={`text-[10px] font-bold uppercase tracking-widest opacity-50`}>{title}</p>
    <p className="text-xl font-black mt-1">{value || 0}</p>
  </motion.div>
);

const LocationItem = ({ loc, isDark, colors }) => (
  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'} flex items-center justify-between group`}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold uppercase">{loc.location.city[0]}</div>
      <div>
        <p className="font-bold text-sm">{loc.location.city}</p>
        <p className={`text-[10px] uppercase ${colors.subText}`}>{loc.location.state}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-black text-xs text-amber-600">₹{loc.totalRevenue?.toLocaleString() || 0}</p>
      <p className={`text-[10px] ${colors.subText}`}>{loc.totalBookings || 0} deals</p>
    </div>
  </div>
);

export default AdminDashboard;