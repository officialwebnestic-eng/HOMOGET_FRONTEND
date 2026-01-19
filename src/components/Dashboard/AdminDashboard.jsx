import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line, Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { 
  Home, Users, IndianRupee, Eye, ReceiptIndianRupee, 
  Plus, MapPin, Clock, BarChart3, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Wallet, Activity
} from "lucide-react";

// Components & Utils
import useGetAllAgent from "../../hooks/useGetAllAgent";
import { http } from "../../axios/axios";
import { useTheme } from "../../context/ThemeContext";
import CreateSession from "../admin/session/CreateSession";
 import { monthOptions } from "../../helpers/DashboardHelpers";

// Chart.js Registration
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler, ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, ArcElement
);

const AdminDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { agentList = [] } = useGetAllAgent();
  const isDark = theme === 'dark';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalProperties: 0, totalUsers: 0, revenue: 0, 
    totalSales: 0, pendingAppointments: 0, activeListing: 0
  });
  const [earningResultData, setEarningResultData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [latestTransaction, setLatestTransaction] = useState([]);
  
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[new Date().getMonth()]);

  const colors = useMemo(() => ({
    background: isDark ? 'bg-[#020617]' : 'bg-slate-50',
    card: isDark ? 'bg-slate-900/50 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm',
    text: isDark ? 'text-white' : 'text-slate-900',
    subText: isDark ? 'text-slate-400' : 'text-slate-500',
    accent: 'from-amber-400 to-orange-600',
    chartLine: isDark ? 'rgba(245, 158, 11, 0.5)' : 'rgba(217, 119, 6, 0.5)'
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
            totalSales: data.totalSales || 0
          });
          setEarningResultData(data.earningsData?.result || []);
          setLatestTransaction(data.topTransactionList || []);
          setLocationData(data.mostelySalesLoaction || []);
        }
      } catch (error) { console.error(error); }
    };
    getAdminData();
  }, []);

  // Line Chart Data (Revenue Trends)
  const lineChartData = {
    labels: monthOptions,
    datasets: [{
      label: 'Revenue',
      data: monthOptions.map((_, i) => {
        const match = earningResultData.find(e => e._id?.month === i + 1);
        return match?.totalEarnings || 0;
      }),
      fill: true,
      borderColor: '#f59e0b',
      backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#f59e0b',
    }]
  };

  // Doughnut Chart Data (Monthly Target)
  const currentMonthIncome = useMemo(() => {
    const monthIndex = monthOptions.indexOf(selectedMonth) + 1;
    const match = earningResultData.find(e => e._id?.month === monthIndex);
    return match?.totalEarnings || 0;
  }, [selectedMonth, earningResultData]);

  const doughnutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [currentMonthIncome, currentMonthIncome === 0 ? 1000 : currentMonthIncome * 0.2],
      backgroundColor: ['#f59e0b', isDark ? '#1e293b' : '#e2e8f0'],
      borderWidth: 0,
      cutout: '85%'
    }]
  };

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text} p-4 lg:p-10 transition-colors duration-500`}>
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-[10px] font-black uppercase tracking-widest ${colors.subText}`}>System Live</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
            Control <span className={`bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>Center</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`hidden md:block px-4 py-2 rounded-2xl border ${colors.card}`}>
            <p className="text-[10px] font-bold opacity-50 uppercase">Current Liquidity</p>
            <p className="text-sm font-black text-emerald-500">₹{adminStats.revenue.toLocaleString()}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-sm"
          >
            <Plus size={18} /> New Session
          </motion.button>
        </div>
      </header>

      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <GlassStatCard title="Total Revenue" value={`₹${adminStats.revenue.toLocaleString()}`} icon={<Wallet />} trend="+12.5%" color="amber" isDark={isDark} />
        <GlassStatCard title="Total Sales" value={adminStats.totalSales} icon={<Activity />} trend="+8.2%" color="blue" isDark={isDark} />
        <GlassStatCard title="Active Listings" value={adminStats.activeListing} icon={<Home />} trend="+3.1%" color="indigo" isDark={isDark} />
        <GlassStatCard title="Pending Tasks" value={adminStats.pendingAppointments} icon={<Clock />} trend="-2.4%" color="rose" isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        {/* REVENUE AREA CHART */}
        <div className={`lg:col-span-8 p-6 lg:p-8 rounded-[2rem] border ${colors.card}`}>
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black">Revenue Analytics</h3>
              <p className={`text-xs ${colors.subText}`}>Yearly financial progression</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <TrendingUp size={12} /> UP 14%
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <Line 
              data={lineChartData} 
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { display: false },
                  x: { grid: { display: false }, ticks: { color: isDark ? '#475569' : '#94a3b8', font: { size: 10, weight: 'bold' } } }
                }
              }} 
            />
          </div>
        </div>

        {/* MONTHLY TARGET DOUGHNUT */}
        <div className={`lg:col-span-4 p-8 rounded-[2rem] border ${colors.card} flex flex-col items-center justify-center text-center relative overflow-hidden`}>
          <div className="absolute top-6 left-6 text-left">
            <h3 className="font-black text-lg">Target</h3>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-amber-500 outline-none"
            >
              {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="w-48 h-48 relative mb-6">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black">₹{currentMonthIncome.toLocaleString()}</span>
              <span className={`text-[8px] uppercase tracking-[0.2em] font-black ${colors.subText}`}>Revenue</span>
            </div>
          </div>
          <p className={`text-xs font-medium px-6 ${colors.subText}`}>
            You have reached <span className="text-amber-500 font-black">84%</span> of your monthly goal.
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION: LOCATIONS & TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RECENT ACTIVITY TABLE */}
        <div className={`lg:col-span-8 rounded-[2rem] border ${colors.card} overflow-hidden`}>
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-black uppercase tracking-tighter">Live Transactions</h3>
            <button className="text-[10px] font-black bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-all">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[9px] font-black uppercase tracking-[0.2em] ${colors.subText} border-b border-white/5`}>
                  <th className="px-8 py-5">Asset</th>
                  <th className="px-8 py-5">Valuation</th>
                  <th className="px-8 py-5">Progress</th>
                  <th className="px-8 py-5 text-right">Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {latestTransaction.map((t) => (
                  <tr key={t._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Home size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black">{t.propertyId?.propertyname || 'Asset X'}</p>
                          <p className="text-[10px] font-mono opacity-40">#{t.transactionId?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-black text-amber-500">₹{t.price?.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-24">
                          <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-emerald-500">{t.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => navigate(`/viewalltransiondata/${t._id}`)} className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 transition-all">
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* REGIONAL PERFORMANCE */}
        <div className={`lg:col-span-4 p-8 rounded-[2rem] border ${colors.card}`}>
          <h3 className="text-lg font-black mb-8">Regional Sales</h3>
          <div className="space-y-6">
            {locationData.length > 0 ? (
              locationData.map((loc, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                      {loc.location.city[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black">{loc.location.city}</p>
                      <p className={`text-[10px] font-bold ${colors.subText}`}>{loc.totalBookings} Completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-amber-500">₹{loc.totalRevenue?.toLocaleString()}</p>
                    <div className="w-20 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <MapPin size={40} />
                <p className="text-[10px] font-black uppercase mt-4">Awaiting Data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateSession isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

// HIGH-END STAT CARD COMPONENT
const GlassStatCard = ({ title, value, icon, trend, color, isDark }) => {
  const colorMap = {
    amber: 'text-amber-500 bg-amber-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
    rose: 'text-rose-500 bg-rose-500/10',
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`p-6 rounded-[2rem] border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-xl relative overflow-hidden group`}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${colorMap[color].split(' ')[0].replace('text', 'bg')}`} />
      
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {trend}
        </span>
      </div>

      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1`}>{title}</p>
        <h4 className="text-2xl font-black">{value || 0}</h4>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;