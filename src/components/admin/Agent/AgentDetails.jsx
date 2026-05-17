import React, { useEffect } from 'react';
import { 
  User, MapPin, Phone, Mail, Calendar, Building2, 
  Award, Briefcase, Clock, Star, IndianRupee, ChevronLeft,
  TrendingUp, Globe, ShieldCheck
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import useGetAllAgent from './../../../hooks/useGetAllAgent';
import EmptyStateModel from '../../../model/EmptyStateModel';

const AgentDetails = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const { agent, loading, error, getOneAgent } = useGetAllAgent();

  useEffect(() => {
    if (id) getOneAgent(id);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f4f7fe]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ff8a00] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="p-10 min-h-screen bg-[#f4f7fe]">
        <EmptyStateModel type="agents" message="Agent profile not found" customIcon={User} />
      </div>
    );
  }

  // FIXED: Logic to clean the ["\"Skill Name\""] formatting from your database
  const formatList = (data) => {
    if (!data) return [];
    try {
      const str = Array.isArray(data) ? data.join(',') : data;
      return str.replace(/[\\"[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);
    } catch (e) { return []; }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fe] p-4 md:p-8 transition-all">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#ff8a00] transition-all mb-2"
        >
          <ChevronLeft size={14} strokeWidth={3} /> Back to Dashboard
        </button>

        {/* --- TOP PROFILE BANNER (Matches Ahmed Khan Screenshot) --- */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#4f46e5] via-[#9333ea] to-[#db2777] shadow-xl shadow-indigo-100/50">
          <div className="relative p-10 flex flex-col md:flex-row items-center gap-10">
            
            {/* Profile Photo with Interactive Border */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-[6px] border-white/20 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <img
                  src={agent.profilePhoto || 'https://via.placeholder.com/150'}
                  className="w-full h-full rounded-full object-cover"
                  alt={agent.name}
                />
              </div>
              <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#00d084] border-[4px] border-white shadow-lg flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
              </div>
            </div>

            {/* Core Identity Info */}
            <div className="flex-1 text-center md:text-left text-white">
              <div className="inline-block px-5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/10">
                {agent.status || 'Active'}
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase mb-1">{agent.name}</h1>
              <p className="text-xl font-medium text-white/70 mb-8">{agent.role || 'Portfolio Strategy Manager'}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <ContactPill icon={<Mail />} text={agent.email} />
                <ContactPill icon={<Phone />} text={agent.phone} />
                <ContactPill icon={<MapPin />} text={`${agent.city || 'Dubai'}, UAE`} />
              </div>
            </div>

          
          </div>
        </div>

        {/* --- MAIN CONTENT CARDS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* PERSONAL BIO CARD */}
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-11 h-11 bg-orange-50 rounded-2xl flex items-center justify-center">
                <User className="text-[#ff8a00]" size={22} />
              </div>
              <h2 className="text-xl font-black tracking-tight text-[#1a1a1e] uppercase">Personal Bio</h2>
            </div>

            <div className="space-y-8 flex-1">
              <InfoRow icon={<Calendar />} label="Date of Birth" value={agent.dateOfBirth || 'Not provided'} />
              <InfoRow icon={<Globe />} label="Nationality" value={agent.nationality || 'Not provided'} />
              <InfoRow icon={<MapPin />} label="Full Address" value={agent.address || 'Al Barsha 1, Dubai, UAE'} />
              
              <div className="pt-8 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Award size={14} className="text-[#ff8a00]" /> Expertise & Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {formatList(agent.skills).map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-[#f4f7fe] text-[10px] font-black text-blue-500 uppercase rounded-xl border border-blue-50 transition-all hover:bg-blue-500 hover:text-white">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COMPANY & REGULATORY OVERVIEW */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Building2 className="text-blue-500" size={22} />
              </div>
              <h2 className="text-xl font-black tracking-tight text-[#1a1a1e] uppercase">Company Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-8">
                <DataBox icon={<Briefcase />} label="Current Designation" value={agent.designation || 'Not specified'} />
                <DataBox icon={<TrendingUp />} label="Experience" value={`${agent.experienceYears || 0} Years`} />
                <DataBox icon={<Calendar />} label="Joining Date" value={agent.joiningDate ? new Date(agent.joiningDate).toLocaleDateString() : 'Not provided'} />
                <DataBox icon={<ShieldCheck />} label="RERA License" value={agent.reraLicenseNumber || 'N/A'} />
              </div>
              
              <div className="space-y-8">
                <div className="flex flex-col gap-6">
                    <DataBox icon={<IndianRupee />} label="Current Salary" value={agent.currentSalary ? `₹${agent.currentSalary}` : 'Not disclosed'} />
                    <DataBox icon={<Globe />} label="Languages" value={formatList(agent.languages).join(' • ') || 'English'} />
                </div>
                
                {/* Account Balance Display */}
                <div className="mt-4 p-8 rounded-[2rem] bg-gradient-to-br from-[#f4f7fe] to-[#eff3ff] border border-white flex items-center gap-6 shadow-inner">
                   <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-md">
                     <Star className="text-[#ff8a00]" fill="#ff8a00" size={22} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Balance</p>
                     <p className="text-3xl font-black text-[#1a1a1e] tracking-tighter">₹{agent.balance || 0}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PRIVATE SUB-COMPONENTS ---

const ContactPill = ({ icon, text }) => (
  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-default">
    {React.cloneElement(icon, { size: 14, className: "text-[#ff8a00]" })}
    <span className="text-xs font-bold">{text || 'N/A'}</span>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-5 group">
    <div className="text-slate-300 transition-colors group-hover:text-[#ff8a00]">{React.cloneElement(icon, { size: 20 })}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold text-[#1a1a1e] text-sm leading-tight">{value}</p>
    </div>
  </div>
);

const DataBox = ({ icon, label, value }) => (
  <div className="flex items-center gap-5 group">
    <div className="w-11 h-11 rounded-2xl bg-[#f4f7fe] text-slate-400 flex items-center justify-center group-hover:bg-[#ff8a00] group-hover:text-white transition-all shadow-sm">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[16px] font-black text-[#1a1a1e] tracking-tight leading-tight">{value}</p>
    </div>
  </div>
);

export default AgentDetails;