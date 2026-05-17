// AgentDashboard.jsx - corrected version
import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from "chart.js";
import {
  Users, Home, Plus, CreditCard, Banknote, 
  Activity, ArrowUpRight, Wallet, Loader2, Award, Star, Trophy, Target,
  TrendingUp, TrendingDown, Calendar, Clock, CheckCircle, 
  Building, MapPin, DollarSign, Percent, UserCheck, Briefcase,
  Zap, Sparkles, Crown, Medal, Gem, Shield, Eye, Bell, Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import PermissionProtectedAction from "../../Authorization/PermissionProtectedActions";
import { monthOptions, fullMonths } from "../../helpers/DashboardHelpers";
import userGetPropertyByUser from "../../hooks/useGetPropertybyUser";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
);

const AgentDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isDark = theme === 'dark';

  // State for property listing pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(fullMonths[new Date().getMonth()]);
  const [recentOrder, setRecentOrder] = useState([]);
  const [stats, setStats] = useState({
    totalProperty: 0, totalUser: 0, totalRevenue: 0, totalSales: 0, totalBalance: 0,
    totalClients: 0, totalAppointments: 0, conversionRate: 0
  });
  const [earningResultData, setEarningResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch agent's own properties using the hook
  const { propertyList, pagination, loading: propsLoading, deletePropertyById, refetch } = userGetPropertyByUser(currentPage, 10, {
    propertyname: searchTerm,
    city: selectedCity,
    bedroom: bedroomFilter,
  });

  const colors = useMemo(() => ({
    background: isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50',
    card: isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-200 shadow-sm',
    cardHover: isDark ? 'hover:border-amber-500/30' : 'hover:shadow-lg',
    text: isDark ? 'text-white' : 'text-slate-900',
    subText: isDark ? 'text-slate-400' : 'text-slate-500',
    accent: '#f59e0b',
    accentLight: 'rgba(245, 158, 11, 0.1)',
  }), [isDark]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await http.get("/agentstatus", { withCredentials: true });
        if (data) {
          setStats({
            totalProperty: data.totalProperty || 0,
            totalUser: data.totalUsers || 0,
            totalSales: data.totalRevenue?.totalSales || 0,
            totalRevenue: data.totalRevenue?.totalRevenue || 0,
            totalBalance: data.totalRevenue?.totalBalance || 0,
            totalClients: data.totalClients || 0,
            totalAppointments: data.totalAppointments || 12,
            conversionRate: data.conversionRate || 68,
          });
          setRecentOrder(data.recentOrder || []);
          setRecentActivities(data.recentActivities || []);
          setEarningResultData(data.monthelyIncom?.result || []);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    getData();
  }, []);

  const currentMonthIncome = useMemo(() => {
    const monthIndex = fullMonths.indexOf(selectedMonth) + 1;
    const match = earningResultData.find((e) => e._id?.month === monthIndex);
    return match?.totalEarnings || 0;
  }, [selectedMonth, earningResultData]);

  const lineData = {
    labels: monthOptions,
    datasets: [{
      label: 'Revenue (AED)',
      data: monthOptions.map((_, i) => {
        const match = earningResultData.find(e => e._id?.month === i + 1);
        return match?.totalEarnings || 0;
      }),
      borderColor: colors.accent,
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.canvas;
        const gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, colors.accentLight);
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: colors.accent,
      pointBorderColor: isDark ? '#0a0a0c' : '#fff',
      pointBorderWidth: 2,
    }]
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Properties Sold',
      data: [12, 19, 15, 17, 14, 23],
      backgroundColor: colors.accentLight,
      borderColor: colors.accent,
      borderWidth: 1,
      borderRadius: 8,
    }]
  };

  const doughnutData = {
    labels: ['Achieved', 'Target'],
    datasets: [{
      data: [currentMonthIncome || 1, Math.max(500000 - (currentMonthIncome || 0), 0)],
      backgroundColor: [colors.accent, isDark ? '#1e293b' : '#e2e8f0'],
      borderWidth: 0,
      cutout: '75%',
    }]
  };

  const monthlyTarget = 500000;
  const targetPercentage = Math.min((currentMonthIncome / monthlyTarget) * 100, 100);

  if (loading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors.background}`}>
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text} p-4 md:p-8 transition-colors duration-500`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-[9px] font-bold uppercase tracking-wider ${colors.subText}`}>Active Session</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, <span style={{ color: colors.accent }}>{user?.name ? user.name.split(' ')[0] : (user?.firstname || 'Agent')}</span>
          </h1>
          <p className={`text-xs ${colors.subText} mt-1`}>Here's your performance overview for today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className={`p-2.5 rounded-xl border ${colors.card} hover:text-amber-500 transition-all`}>
            <Bell size={18} />
          </button>
          <button className={`p-2.5 rounded-xl border ${colors.card} hover:text-amber-500 transition-all`}>
            <Settings size={18} />
          </button>
          <PermissionProtectedAction action="create" module={"Session Management"}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/add-session")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all"
            >
              <Plus size={14} /> Add Session
            </motion.button>
          </PermissionProtectedAction>
        </div>
      </div>

{/* STATS GRID - 4 colored cards per row */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <StatCard 
    title="Total Balance" 
    value={`AED ${stats.totalBalance.toLocaleString()}`} 
    icon={<Wallet size={20} />} 
    trend="+12.5%" 
    color="amber" 
    isDark={isDark} 
  />
  <StatCard 
    title="Revenue Flow" 
    value={`AED ${stats.totalSales.toLocaleString()}`} 
    icon={<TrendingUp size={20} />} 
    trend="+8.2%" 
    color="emerald" 
    isDark={isDark} 
  />
  <StatCard 
    title="Properties" 
    value={stats.totalProperty} 
    icon={<Home size={20} />} 
    trend="+3" 
    color="blue" 
    isDark={isDark} 
  />
  <StatCard 
    title="Active Clients" 
    value={stats.totalUser} 
    icon={<Users size={20} />} 
    trend="+12" 
    color="purple" 
    isDark={isDark} 
  />
</div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className={`lg:col-span-7 p-6 rounded-2xl border ${colors.card}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold">Revenue Overview</h3>
              <p className={`text-[10px] ${colors.subText}`}>Monthly earnings performance</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <TrendingUp size={12} /> +14% vs last year
              </span>
            </div>
          </div>
          <div className="h-[280px]">
            <Line data={lineData} options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff' } },
              scales: {
                y: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: colors.subText, font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: colors.subText, font: { size: 10 } } }
              }
            }} />
          </div>
        </div>

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
              {fullMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-32 h-32">
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black">{targetPercentage.toFixed(0)}%</span>
                <span className={`text-[7px] uppercase font-bold ${colors.subText}`}>Achieved</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-amber-500">AED {currentMonthIncome.toLocaleString()}</p>
              <p className={`text-[9px] ${colors.subText}`}>of AED {monthlyTarget.toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" />
                <span className="text-[9px] text-emerald-500">+{targetPercentage.toFixed(0)}%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10">
            <div className="flex justify-between text-[9px]">
              <span className={colors.subText}>Total Portfolio Revenue</span>
              <span className="font-bold text-amber-500">AED {stats.totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className={`lg:col-span-7 p-6 rounded-2xl border ${colors.card}`}>
          <h3 className="text-base font-bold mb-4">Monthly Sales</h3>
          <div className="h-[250px]">
            <Bar data={barData} options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: colors.subText, font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: colors.subText, font: { size: 10 } } }
              }
            }} />
          </div>
        </div>

        <div className={`lg:col-span-5 p-6 rounded-2xl border ${colors.card}`}>
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <Award size={16} className="text-amber-500" /> Recent Achievements
          </h3>
          <div className="space-y-4">
            <AchievementItem icon={<Trophy size={14} className="text-yellow-500" />} title="Top Performer" description="Ranked #1 in sales this quarter" date="This month" isDark={isDark} />
            <AchievementItem icon={<Star size={14} className="text-purple-500" />} title="Client Favorite" description="Received 25+ five-star reviews" date="Last week" isDark={isDark} />
            <AchievementItem icon={<Zap size={14} className="text-emerald-500" />} title="Fast Closer" description="Closed 3 deals in 7 days" date="2 days ago" isDark={isDark} />
          </div>
        </div>
      </div>

      {/* MY PROPERTIES SECTION (from API) */}
      <div className={`rounded-2xl border ${colors.card} overflow-hidden mb-8`}>
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="text-base font-bold">My Properties</h3>
            <p className={`text-[9px] ${colors.subText} mt-0.5`}>Properties listed by you</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`px-3 py-1.5 text-[10px] rounded-lg border ${colors.card}`}
            />
            <button onClick={() => navigate("/addproperty")} className="flex items-center gap-1 text-[9px] font-bold text-amber-500 hover:underline">
              <Plus size={12} /> Add New
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {propsLoading ? (
            <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-amber-500" size={24} /></div>
          ) : propertyList.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[8px] font-bold uppercase tracking-wider ${colors.subText} border-b`}>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody>
                {propertyList.map((prop) => (
                  <tr key={prop._id} className="border-b border-slate-200 dark:border-white/10 hover:bg-amber-500/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={prop.image?.[0]} alt={prop.propertyname} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium">{prop.propertyname}</p>
                          <div className="flex items-center gap-1"><MapPin size={8} className="text-slate-400" /><span className="text-[9px] text-slate-500">{prop.city}</span></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-[9px] font-bold px-2 py-1 bg-amber-500/10 rounded">{prop.propertytype}</span></td>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-amber-500">AED {prop.price?.toLocaleString()}</span></td>
                    <td className="px-6 py-4"><span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${prop.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{prop.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => navigate(`/updatepropertydetails/${prop._id}`)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-amber-500 transition"><Eye size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center"><Building size={32} className="mx-auto mb-2 opacity-30" /><p className="text-[10px] opacity-50">No properties listed yet</p></div>
          )}
        </div>
        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            <button disabled={pagination.page <= 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 rounded bg-slate-100 dark:bg-white/5 text-xs">Prev</button>
            <span className="text-xs">Page {pagination.page} of {pagination.totalPages}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 rounded bg-slate-100 dark:bg-white/5 text-xs">Next</button>
          </div>
        )}
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className={`rounded-2xl border ${colors.card} overflow-hidden mb-8`}>
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="text-base font-bold">Recent Transactions</h3>
            <p className={`text-[9px] ${colors.subText} mt-0.5`}>Latest property deals and activities</p>
          </div>
          <span className={`text-[8px] font-bold px-2 py-1 rounded-lg ${colors.subText} bg-slate-100 dark:bg-white/5`}>{recentOrder.length} Entries</span>
        </div>
        <div className="overflow-x-auto">
          {recentOrder.length > 0 ? (
            <table className="w-full text-left">
              <thead><tr className={`text-[8px] font-bold uppercase tracking-wider ${colors.subText} border-b`}>
                <th className="px-6 py-4">Property</th><th className="px-6 py-4">Client</th><th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Payment</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Action</th>
              </tr></thead>
              <tbody>
                {recentOrder.map((t, idx) => (
                  <tr key={t._id} className="border-b hover:bg-amber-500/5">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Home size={16} className="text-amber-500" /></div><div><p className="text-sm font-medium">{t.propertyId?.propertyname || 'Asset'}</p><p className="text-[9px] text-slate-500">{t.propertyId?.city}</p></div></div></td>
                    <td className="px-6 py-4"><p className="text-xs font-medium">{t.userId?.name || 'Guest'}</p><p className="text-[9px] text-slate-500">{t.userId?.email}</p></td>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-amber-500">AED {t.propertyId?.price?.toLocaleString()}</span></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-[9px]">{t.paymentMethod === 'bank_transfer' ? <Banknote size={12} /> : <CreditCard size={12} />}<span>{t.paymentMethod?.replace('_', ' ') || 'N/A'}</span></div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1.5"><Calendar size={10} /><span>{new Date(t.createdAt).toLocaleDateString()}</span></div></td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-bold ${t.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{t.status === 'confirmed' ? <CheckCircle size={10} /> : <Clock size={10} />}{t.status || 'Pending'}</span></td>
                    <td className="px-6 py-4 text-right"><button onClick={() => navigate(`/agentlatestboking/${t._id}`)} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-amber-500 transition"><Eye size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center"><Activity size={40} className="mx-auto mb-4 opacity-20" /><p className="text-[10px] font-bold uppercase opacity-30">No recent transactions</p></div>
          )}
        </div>
      </div>

      {/* BOTTOM TIPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TipCard icon={<Sparkles size={18} />} title="Pro Tip" description="Follow up with leads within 24 hours for 5x higher conversion rate." color="amber" isDark={isDark} />
        <TipCard icon={<TrendingUp size={18} />} title="Market Insight" description="Property prices in Dubai Marina increased by 8% this quarter." color="blue" isDark={isDark} />
        <TipCard icon={<Calendar size={18} />} title="Upcoming" description="3 site visits scheduled for this week. Prepare your portfolio." color="purple" isDark={isDark} />
      </div>
    </div>
  );
};

// Enhanced Stat Card Component with colored background (supports all colors)
const StatCard = ({ title, value, icon, trend, color, isDark }) => {
  const isPositive = trend?.startsWith('+');
  
  // Full color palette (including orange and teal)
  const colorConfig = {
    amber: {
      bg: isDark ? 'bg-amber-500/20' : 'bg-amber-50',
      border: 'border-amber-200 dark:border-amber-500/30',
      iconBg: 'bg-amber-500 text-white',
      text: 'text-amber-600 dark:text-amber-400',
      trend: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
    },
    emerald: {
      bg: isDark ? 'bg-emerald-500/20' : 'bg-emerald-50',
      border: 'border-emerald-200 dark:border-emerald-500/30',
      iconBg: 'bg-emerald-500 text-white',
      text: 'text-emerald-600 dark:text-emerald-400',
      trend: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
    },
    blue: {
      bg: isDark ? 'bg-blue-500/20' : 'bg-blue-50',
      border: 'border-blue-200 dark:border-blue-500/30',
      iconBg: 'bg-blue-500 text-white',
      text: 'text-blue-600 dark:text-blue-400',
      trend: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
    },
    purple: {
      bg: isDark ? 'bg-purple-500/20' : 'bg-purple-50',
      border: 'border-purple-200 dark:border-purple-500/30',
      iconBg: 'bg-purple-500 text-white',
      text: 'text-purple-600 dark:text-purple-400',
      trend: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
    },
    orange: {
      bg: isDark ? 'bg-orange-500/20' : 'bg-orange-50',
      border: 'border-orange-200 dark:border-orange-500/30',
      iconBg: 'bg-orange-500 text-white',
      text: 'text-orange-600 dark:text-orange-400',
      trend: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
    },
    teal: {
      bg: isDark ? 'bg-teal-500/20' : 'bg-teal-50',
      border: 'border-teal-200 dark:border-teal-500/30',
      iconBg: 'bg-teal-500 text-white',
      text: 'text-teal-600 dark:text-teal-400',
      trend: 'bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400'
    }
  };

  // Fallback to amber if color is not found (prevents crash)
  const config = colorConfig[color] || colorConfig.amber;

  return (
    <motion.div 
      whileHover={{ y: -3, scale: 1.02 }}
      className={`p-5 rounded-xl border transition-all duration-300 shadow-sm ${config.bg} ${config.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl shadow-md ${config.iconBg}`}>
          {icon}
        </div>
        <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${config.trend}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {title}
        </p>
        <p className={`text-xl font-bold mt-1 truncate ${config.text}`}>
          {value}
        </p>
      </div>
    </motion.div>
  );
};

// Achievement Item (unchanged)
const AchievementItem = ({ icon, title, description, date, isDark }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
    <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5">{icon}</div>
    <div className="flex-1"><p className="text-sm font-semibold">{title}</p><p className="text-[9px] text-slate-500">{description}</p></div>
    <p className="text-[8px] font-medium text-slate-400">{date}</p>
  </div>
);

// Tip Card (unchanged)
const TipCard = ({ icon, title, description, color, isDark }) => {
  const colorClasses = {
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };
  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]} ${isDark ? 'bg-opacity-5' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <span className="text-xs font-bold">{title}</span>
      </div>
      <p className="text-[10px] opacity-70 leading-relaxed">{description}</p>
    </div>
  );
};

export default AgentDashboard;