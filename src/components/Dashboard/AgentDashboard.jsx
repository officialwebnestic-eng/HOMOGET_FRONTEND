import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from "chart.js";
import {
  Users, Home, Plus, CreditCard, Banknote, 
  Activity, ArrowUpRight, Wallet, Loader2, Award, Star, Trophy, Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import PermissionProtectedAction from "../../Authorization/PermissionProtectedActions";
import { monthOptions, fullMonths } from "../../helpers/DashboardHelpers";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
);

const AgentDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isDark = theme === 'dark';

  const [selectedMonth, setSelectedMonth] = useState(fullMonths[new Date().getMonth()]);
  const [recentOrder, setRecentOrder] = useState([]);
  const [stats, setStats] = useState({
    totalProperty: 0, totalUser: 0, totalRevenue: 0, totalSales: 0, totalBalance: 0
  });
  const [earningResultData, setEarningResultData] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = useMemo(() => ({
    background: isDark ? 'bg-[#020617]' : 'bg-slate-50',
    card: isDark ? 'bg-slate-900/50 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm',
    text: isDark ? 'text-white' : 'text-slate-900',
    subText: isDark ? 'text-slate-400' : 'text-slate-500',
    accent: 'from-amber-400 to-orange-600',
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
          });
          setRecentOrder(data.recentOrder || []);
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
      label: 'Revenue',
      data: monthOptions.map((_, i) => {
        const match = earningResultData.find(e => e._id?.month === i + 1);
        return match?.totalEarnings || 0;
      }),
      borderColor: '#f59e0b',
      backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#f59e0b',
    }]
  };

  const doughnutData = {
    labels: ['Income', 'Remaining'],
    datasets: [{
      data: [currentMonthIncome || 1, currentMonthIncome === 0 ? 1000 : currentMonthIncome * 0.15],
      backgroundColor: ['#f59e0b', isDark ? '#1e293b' : '#f1f5f9'],
      borderWidth: 0,
      cutout: '85%',
    }]
  };

  if (loading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors.background}`}>
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text} p-4 lg:p-10 transition-colors duration-500`}>
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-[10px] font-black uppercase tracking-widest ${colors.subText}`}>Agent Status: Online</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
            Agent <span className={`bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>Hub</span>
          </h1>
          <p className={`${colors.subText} mt-1 text-sm font-medium`}>
             Welcome, {user?.name ? user.name.split(' ')[0] : (user?.firstname || 'Partner')} • Performance Analytics
          </p>
        </div>
        
        <PermissionProtectedAction action="create" module={"Session Management"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/add-session")}
            className="bg-white text-black px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-sm"
          >
            <Plus size={18} /> Add Session
          </motion.button>
        </PermissionProtectedAction>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <PermissionProtectedAction action="view" module={"total Revenue"}>
            <GlassStatCard title="Total Balance" value={`₹${stats.totalBalance.toLocaleString()}`} icon={<Wallet />} color="amber" isDark={isDark} />
        </PermissionProtectedAction>

        <PermissionProtectedAction action="view" module={"total sales"}>
            <GlassStatCard title="Revenue Flow" value={`₹${stats.totalSales.toLocaleString()}`} icon={<Activity />} color="blue" isDark={isDark} />
        </PermissionProtectedAction>

        <PermissionProtectedAction action="view" module={"total property"}>
            <GlassStatCard title="Units Managed" value={stats.totalProperty} icon={<Home />} color="indigo" isDark={isDark} />
        </PermissionProtectedAction>

        <PermissionProtectedAction action="view" module={"total user"}>
            <GlassStatCard title="Active Clients" value={stats.totalUser} icon={<Users />} color="rose" isDark={isDark} />
        </PermissionProtectedAction>
      </div>

      <PermissionProtectedAction action="view" module={"monthely Earnings"}>
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        {/* REVENUE LINE CHART */}
        <div className={`lg:col-span-8 p-6 lg:p-8 rounded-[2rem] border ${colors.card}`}>
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black">Earning Overview</h3>
              <p className={`text-xs ${colors.subText}`}>Performance tracking by month</p>
            </div>
            <div className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">
              Live Feed
            </div>
          </div>
          <div className="h-[300px]">
            <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: isDark ? '#475569' : '#94a3b8', font: { size: 10, weight: 'bold' } } } } }} />
          </div>
        </div>

        {/* TARGET DOUGHNUT CHART */}
        <div className={`lg:col-span-4 p-8 rounded-[2rem] border ${colors.card} flex flex-col items-center justify-center text-center relative overflow-hidden`}>
          <div className="absolute top-6 left-6 text-left">
            <h3 className="font-black text-lg">Goal Hub</h3>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-amber-500 outline-none cursor-pointer"
            >
              {fullMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="w-48 h-48 relative mb-6">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black">₹{currentMonthIncome.toLocaleString()}</span>
              <span className={`text-[8px] uppercase tracking-[0.2em] font-black ${colors.subText}`}>Captured</span>
            </div>
          </div>
          <p className={`text-xs font-medium px-6 ${colors.subText}`}>
            Total Portfolio Revenue: <span className="text-amber-500 font-black">₹{stats.totalRevenue.toLocaleString()}</span>
          </p>
        </div>
      </div>
     </PermissionProtectedAction>

      {/* ACHIEVEMENTS SECTION - NEWLY ADDED */}
      <PermissionProtectedAction action="view" module={"Achievements"}>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-indigo-500" size={24} />
            <h3 className="text-xl font-black uppercase tracking-tighter">Milestone Achievements</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AchievementCard 
              icon={<Trophy className="text-yellow-500" />} 
              title="Top Seller" 
              desc="Reached ₹1M in total sales" 
              progress={Math.min((stats.totalSales / 1000000) * 100, 100)}
              isDark={isDark}
            />
            <AchievementCard 
              icon={<Star className="text-purple-500" />} 
              title="Portfolio Pro" 
              desc="Managed 10+ properties" 
              progress={Math.min((stats.totalProperty / 10) * 100, 100)}
              isDark={isDark}
            />
            <AchievementCard 
              icon={<Target className="text-emerald-500" />} 
              title="Client Magnet" 
              desc="Acquired 50+ active users" 
              progress={Math.min((stats.totalUser / 50) * 100, 100)}
              isDark={isDark}
            />
          </div>
        </div>
      </PermissionProtectedAction>

      {/* RECENT ACTIVITY TABLE */}
      <PermissionProtectedAction action="view" module={"transaction history"}>
      <div className={`rounded-[2rem] border ${colors.card} overflow-hidden shadow-2xl`}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-black uppercase tracking-tighter">Acquisition Ledger</h3>
          <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{recentOrder.length} Entries Found</span>
        </div>
        <div className="overflow-x-auto">
          {recentOrder.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[9px] font-black uppercase tracking-[0.2em] ${colors.subText} border-b border-white/5`}>
                  <th className="px-8 py-5">Property Descriptor</th>
                  <th className="px-8 py-5">Valuation</th>
                  <th className="px-8 py-5">Payment</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrder.map((t) => (
                  <tr key={t._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Home size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black">{t.propertyId?.propertyname || 'Property Asset'}</p>
                          <p className="text-[10px] font-bold opacity-30 uppercase">{t.propertyId?.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-black text-amber-500">₹{t.propertyId?.price?.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-[10px] font-black opacity-60">
                         {t.paymentMethod === 'bank_transfer' ? <Banknote size={14}/> : <CreditCard size={14}/>}
                         <span className="uppercase">{t.paymentMethod?.replace('_', ' ')}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                        t.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${t.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {t.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                    <PermissionProtectedAction action="view" module={"Revenue Breakdown"}>
                        <button onClick={() => navigate(`/agentlatestboking/${t._id}`)} className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 transition-all text-white">
                        <ArrowUpRight size={16} />
                      </button>
                    </PermissionProtectedAction>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-24 text-center">
              <Activity size={40} className="mx-auto mb-4 opacity-10" />
              <p className="text-[10px] font-black uppercase opacity-20 tracking-widest">No activity in records</p>
            </div>
          )}
        </div>
      </div>
      </PermissionProtectedAction>
    </div>
  );
};

// ACHIEVEMENT CARD COMPONENT
const AchievementCard = ({ icon, title, desc, progress, isDark }) => (
  <div className={`p-5 rounded-3xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-lg`}>
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 rounded-2xl bg-slate-500/10">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-sm font-black">{title}</p>
        <p className="text-[10px] opacity-50 font-medium">{desc}</p>
      </div>
    </div>
    <div className="w-full h-1.5 bg-slate-500/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-indigo-500"
      />
    </div>
    <p className="text-[9px] font-black mt-2 text-right opacity-40">{Math.round(progress)}% Complete</p>
  </div>
);

// GLASS STAT CARD COMPONENT
const GlassStatCard = ({ title, value, icon, color, isDark }) => {
  const colorMap = {
    amber: 'text-amber-500 bg-amber-500/10 shadow-amber-500/5',
    blue: 'text-blue-500 bg-blue-500/10 shadow-blue-500/5',
    indigo: 'text-indigo-500 bg-indigo-500/10 shadow-indigo-500/5',
    rose: 'text-rose-500 bg-rose-500/10 shadow-rose-500/5',
  };
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-xl relative overflow-hidden group transition-all`}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity ${colorMap[color].split(' ')[0].replace('text', 'bg')}`} />
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1`}>{title}</p>
        <h4 className="text-2xl font-black">{value || 0}</h4>
      </div>
    </motion.div>
  );
};

export default AgentDashboard;