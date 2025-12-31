import { motion } from "framer-motion";
import { useState, useEffect, useContext, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement
} from "chart.js";
import {
  ReceiptIndianRupee, Users, Home, Plus, ChevronDown, Eye, Trash2,
  TrendingUp, CreditCard, Banknote, Target, Activity, IndianRupee,
  LayoutDashboard, Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import PermissionProtectedAction from "../../Authorization/PermissionProtectedActions";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement
);

const AgentDashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isDark = theme === 'dark';

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = monthOptions[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [recentOrder, setRecentOrder] = useState([]);
  const [stats, setStats] = useState({
    totalProperty: 0,
    totalUser: 0,
    totalRevenue: 0,
    totalSales: 0,
    totalBalance: 0
  });
  const [earningResultData, setEarningResultData] = useState([]);

  const colors = useMemo(() => ({
    background: isDark ? 'bg-slate-950' : 'bg-slate-50',
    card: isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200',
    text: isDark ? 'text-slate-100' : 'text-slate-900',
    subText: isDark ? 'text-slate-400' : 'text-slate-500',
    accent: 'from-blue-600 to-indigo-600'
  }), [isDark]);

  const getAdminstatusData = async () => {
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
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => { getAdminstatusData(); }, []);

  const totalIncome = useMemo(() => {
    const monthIndex = monthOptions.indexOf(selectedMonth) + 1;
    const match = earningResultData.find((e) => e._id?.month === monthIndex);
    return match?.totalEarnings || 0;
  }, [selectedMonth, earningResultData]);

  // --- Chart Logic for 0 Data ---
  const pieChartData = {
    labels: totalIncome > 0 ? ['Sales Income'] : ['No Earnings Recorded'],
    datasets: [{
      data: totalIncome > 0 ? [totalIncome] : [1],
      backgroundColor: totalIncome > 0 
        ? [isDark ? '#3b82f6' : '#2563eb'] 
        : [isDark ? '#1e293b' : '#e2e8f0'],
      borderWidth: 0,
      hoverOffset: totalIncome > 0 ? 10 : 0
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const val = totalIncome > 0 ? totalIncome : 0;
            return ` Income: ₹${val.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${colors.background}`}>
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className={`text-3xl font-black ${colors.text}`}>{user.role} Portal</h1>
            <p className={`${colors.subText} text-sm font-medium`}>Welcome back, {user.name} • Performance Track</p>
          </div>
        </div>

        <PermissionProtectedAction action="create" module={"Session Management"}>
          <button onClick={() => navigate("/add-session")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20">
            <Plus size={20} /> Add Session
          </button>
        </PermissionProtectedAction>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Balance" value={`₹${stats.totalBalance.toLocaleString()}`} icon={<IndianRupee />} isDark={isDark} />
        <StatCard title="Total Sales" value={`₹${stats.totalSales.toLocaleString()}`} icon={<TrendingUp />} isDark={isDark} />
        <StatCard title="Properties" value={stats.totalProperty} icon={<Home />} isDark={isDark} />
        <StatCard title="Customers" value={stats.totalUser} icon={<Users />} isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
        {/* Chart Card */}
        <div className={`xl:col-span-5 p-8 rounded-[2.5rem] border ${colors.card} shadow-xl relative overflow-hidden`}>
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-xl">Earnings Ring</h3>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`text-xs font-bold p-2.5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`}
            >
              {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="h-64 relative">
            <Pie data={pieChartData} options={pieOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-2xl font-black ${totalIncome === 0 ? colors.subText : colors.text}`}>
                ₹{totalIncome.toLocaleString()}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${colors.subText}`}>
                {selectedMonth}
              </span>
            </div>
          </div>
          {totalIncome === 0 && (
            <div className={`mt-6 p-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <Info size={16} className="text-blue-500" />
              <p className="text-[11px] font-medium opacity-70">No transactions recorded for this period.</p>
            </div>
          )}
        </div>

        {/* Breakdown Card */}
        <div className={`xl:col-span-7 p-8 rounded-[2.5rem] border ${colors.card} shadow-xl`}>
          <h3 className="font-bold text-xl mb-6">Revenue Analysis</h3>
          <div className={`p-6 rounded-3xl mb-6 ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'}`}>
            <p className={`text-xs uppercase tracking-widest font-bold mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Total Lifetime Revenue</p>
            <p className="text-3xl font-black">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="space-y-3">
             <AnalysisRow label="Direct Property Sales" value={stats.totalSales} total={stats.totalRevenue} isDark={isDark} />
             <AnalysisRow label="Other Commissions" value={0} total={stats.totalRevenue} isDark={isDark} />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className={`rounded-[2.5rem] border ${colors.card} shadow-2xl overflow-hidden`}>
        <div className="p-8 flex justify-between items-center border-b border-slate-800/10">
          <h3 className="font-bold text-xl">Recent Ledger</h3>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            {recentOrder.length} ENTRIES
          </span>
        </div>
        <div className="overflow-x-auto">
          {recentOrder.length > 0 ? (
            <table className="w-full text-left">
              <thead className={`text-[10px] uppercase tracking-widest ${colors.subText} border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <tr>
                  <th className="px-8 py-5">Property Details</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Method</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {recentOrder.map((t) => (
                  <tr key={t._id} className={`${isDark ? 'hover:bg-slate-800/20' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold">{t.propertyId?.propertyname || 'N/A'}</p>
                      <p className="text-[10px] opacity-50 uppercase">{t.propertyId?.city}</p>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-blue-500">
                      ₹{t.propertyId?.price?.toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2 opacity-70">
                         {t.paymentMethod === 'bank_transfer' ? <Banknote size={14}/> : <CreditCard size={14}/>}
                         <span className="text-xs capitalize">{t.paymentMethod?.replace('_', ' ')}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        t.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => navigate(`/agentlatestboking/${t._id}`)} className="p-2 hover:text-blue-500 transition-all"><Eye size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <div className="py-20 text-center opacity-30">
               <Activity size={48} className="mx-auto mb-4" />
               <p className="font-bold text-sm">NO RECENT TRANSACTIONS</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Reusable UI Components ---
const StatCard = ({ title, value, icon, isDark }) => (
  <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg`}>
    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{title}</p>
    <p className="text-xl font-black">{value || 0}</p>
  </div>
);

const AnalysisRow = ({ label, value, total, isDark }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-100'} flex items-center justify-between`}>
      <div>
        <p className="text-sm font-bold">{label}</p>
        <div className="w-32 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
      <p className="font-black text-sm">₹{value.toLocaleString()}</p>
    </div>
  );
};

export default AgentDashboard;