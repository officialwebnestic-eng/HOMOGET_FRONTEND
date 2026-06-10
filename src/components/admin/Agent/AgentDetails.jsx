import React, { useEffect, useState, useCallback } from 'react';
import { 
  User, MapPin, Phone, Mail, Calendar, Building2, 
  Award, Briefcase, Clock, Star, ChevronLeft,
  TrendingUp, Globe, ShieldCheck, BadgeCheck, CreditCard,
  Languages, FileText, Hash, Users, DollarSign, Heart,
  MessageCircle, Linkedin, Twitter, Facebook, Instagram,
  CheckCircle, AlertCircle, Crown, Diamond, Sparkles, Home
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import useGetAllAgent from './../../../hooks/useGetAllAgent';
import EmptyStateModel from '../../../model/EmptyStateModel';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_BASE_URL}/agents/${filename}`;
};

const getAvatarFallback = (name) => {
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "A";
  return `https://ui-avatars.com/api/?name=${initials}&background=C5A059&color=fff&bold=true`;
};

const AgentDetails = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [imageError, setImageError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const { agent, loading, error, getOneAgent } = useGetAllAgent();

  // Use a ref to track if the component is mounted and if already fetched
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    // Only fetch if we have an ID and haven't fetched yet
    if (id && !fetchedRef.current && !isFetching) {
      fetchedRef.current = true;
      setIsFetching(true);
      getOneAgent(id).finally(() => {
        setIsFetching(false);
      });
    }
  }, [id, getOneAgent, isFetching]);

  // Memoize formatted data to prevent re-calculations on every render
  const formattedData = React.useMemo(() => {
    if (!agent) return null;
    
    return {
      skills: (() => {
        if (!agent.skills) return [];
        if (Array.isArray(agent.skills)) return agent.skills;
        try {
          return agent.skills.replace(/[\\"[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);
        } catch (e) { 
          return []; 
        }
      })(),
      languages: (() => {
        if (!agent.languages) return [];
        if (Array.isArray(agent.languages)) return agent.languages;
        try {
          return agent.languages.replace(/[\\"[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);
        } catch (e) { 
          return []; 
        }
      })(),
      joiningDate: agent.joiningDate ? new Date(agent.joiningDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : 'Not provided',
      profileImageUrl: agent.profilePhotoUrl || getImageUrl(agent.profilePhoto) || getAvatarFallback(agent.name),
      stats: [
        { label: 'Properties Sold', value: agent.totalPropertiesSold || 0, icon: <Home size={14} /> },
        { label: 'Happy Clients', value: agent.happyClients || 128, icon: <Heart size={14} /> },
        { label: 'Years Experience', value: agent.experienceYears || 0, icon: <Clock size={14} /> },
        { label: 'Active Listings', value: agent.activeListings || 24, icon: <TrendingUp size={14} /> },
      ]
    };
  }, [agent]);

  // Show loading state
  if (loading || isFetching) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  // Show error or empty state
  if (error || !agent) {
    return (
      <div className={`p-8 min-h-screen ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
        <EmptyStateModel type="agents" message="Agent profile not found" customIcon={User} />
      </div>
    );
  }

  const { skills, languages, joiningDate, profileImageUrl, stats } = formattedData;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'} transition-all duration-300`}>
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-amber-500 transition-all"
        >
          <ChevronLeft size={12} /> Back to Directory
        </button>

        {/* Hero Section */}
        <div className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e]' : 'bg-white'} shadow-lg border ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
          
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              
              {/* Profile Image Section */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-xl ring-2 ring-amber-500/20">
                    <img
                      src={profileImageUrl}
                      className="w-full h-full object-cover"
                      alt={agent.name}
                      onError={(e) => {
                        e.target.src = getAvatarFallback(agent.name);
                        setImageError(true);
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-1.5 shadow-lg">
                    <BadgeCheck size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Agent Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {agent.name}
                  </h1>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                    agent.status === 'Active' 
                      ? 'bg-emerald-500/20 text-emerald-600' 
                      : 'bg-amber-500/20 text-amber-600'
                  }`}>
                    {agent.status || 'Active'}
                  </span>
                </div>
                
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                  {agent.role || 'Property Consultant'} • Agent ID: {agent.agentId || 'N/A'}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <ContactBadge icon={<Mail size={12} />} text={agent.email} isDark={isDark} />
                  <ContactBadge icon={<Phone size={12} />} text={agent.phone} isDark={isDark} />
                  <ContactBadge icon={<MapPin size={12} />} text={agent.city || agent.address?.split(',')[0] || 'Dubai'} isDark={isDark} />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {stats.map((stat, idx) => (
                    <div key={idx} className={`p-2 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="text-amber-500">{stat.icon}</div>
                        <p className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {stat.label}
                        </p>
                      </div>
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex-shrink-0 flex flex-row md:flex-col gap-2">
                <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 transition flex items-center gap-2 justify-center">
                  <MessageCircle size={12} /> Message
                </button>
                <button className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-2 justify-center ${
                  isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                  <Phone size={12} /> Call
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            <div className={`rounded-2xl p-5 ${isDark ? 'bg-[#161b26] border border-white/5' : 'bg-white shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <User size={14} className="text-amber-500" />
                </div>
                <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>About</h2>
              </div>
              <p className={`text-[12px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {agent.bio || `${agent.name} is a dedicated property consultant with ${agent.experienceYears || 0}+ years of experience in the Dubai real estate market.`}
              </p>
            </div>

            {/* Professional Details */}
            <div className={`rounded-2xl p-5 ${isDark ? 'bg-[#161b26] border border-white/5' : 'bg-white shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Briefcase size={14} className="text-blue-500" />
                </div>
                <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Professional Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Role" value={agent.role || 'Property Consultant'} isDark={isDark} />
                <DetailItem label="Experience" value={`${agent.experienceYears || 0} Years`} isDark={isDark} />
                <DetailItem label="Joining Date" value={joiningDate} isDark={isDark} />
                <DetailItem label="Visa Status" value={agent.visaStatus || 'Employment Visa'} isDark={isDark} />
                <DetailItem label="Languages" value={languages.join(', ') || 'English'} isDark={isDark} />
                <DetailItem label="Nationality" value={agent.nationality || 'UAE'} isDark={isDark} />
              </div>

              {/* Skills Tags */}
              {skills.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10">
                  <p className={`text-[9px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Skills & Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, i) => (
                      <span key={i} className={`px-2 py-1 rounded-lg text-[9px] font-medium ${
                        isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Regulatory Compliance */}
            <div className={`rounded-2xl p-5 ${isDark ? 'bg-[#161b26] border border-white/5' : 'bg-white shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck size={14} className="text-emerald-500" />
                </div>
                <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Regulatory Compliance</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Agent ID" value={agent.agentId || 'N/A'} isDark={isDark} />
                <DetailItem label="Emirates ID" value={agent.emiratesId || 'N/A'} isDark={isDark} />
                <DetailItem label="RERA License" value={agent.reraLicenseNumber || 'N/A'} isDark={isDark} />
                <DetailItem label="License Status" value={agent.reraLicenseStatus || 'Active'} isDark={isDark} />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Contact Card */}
            <div className={`rounded-2xl p-5 ${isDark ? 'bg-[#161b26] border border-white/5' : 'bg-white shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Phone size={14} className="text-amber-500" />
                </div>
                <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Contact Information</h2>
              </div>
              
              <div className="space-y-3">
                <ContactDetail icon={<Mail size={12} />} label="Email" value={agent.email} isDark={isDark} />
                <ContactDetail icon={<Phone size={12} />} label="Phone" value={agent.phone} isDark={isDark} />
                <ContactDetail icon={<MapPin size={12} />} label="Address" value={agent.address || 'Dubai, UAE'} isDark={isDark} />
              </div>

              {/* Social Links */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10">
                <p className={`text-[8px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Social Profiles</p>
                <div className="flex gap-2">
                  <SocialIcon icon={<Linkedin size={14} />} href="#" isDark={isDark} />
                  <SocialIcon icon={<Twitter size={14} />} href="#" isDark={isDark} />
                  <SocialIcon icon={<Facebook size={14} />} href="#" isDark={isDark} />
                  <SocialIcon icon={<Instagram size={14} />} href="#" isDark={isDark} />
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className={`rounded-2xl p-5 text-center ${isDark ? 'bg-[#161b26] border border-white/5' : 'bg-white shadow-sm'}`}>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>4.9 out of 5</p>
              <p className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Based on 128 client reviews</p>
              
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-center gap-2">
                  <Crown size={12} className="text-amber-500" />
                  <span className={`text-[9px] font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Top Rated Agent 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const ContactBadge = ({ icon, text, isDark }) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
    <span className="text-amber-500">{icon}</span>
    <span className={`text-[9px] font-medium truncate max-w-[150px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
      {text || 'N/A'}
    </span>
  </div>
);

const DetailItem = ({ label, value, isDark }) => (
  <div>
    <p className={`text-[8px] font-bold uppercase tracking-wider mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
      {label}
    </p>
    <p className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
      {value || 'Not specified'}
    </p>
  </div>
);

const ContactDetail = ({ icon, label, value, isDark }) => (
  <div className="flex items-start gap-2.5">
    <div className={`mt-0.5 ${isDark ? 'text-amber-500' : 'text-amber-500'}`}>{icon}</div>
    <div>
      <p className={`text-[8px] font-bold uppercase tracking-wider mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </p>
      <p className={`text-[10px] font-medium break-all ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

const SocialIcon = ({ icon, href, isDark }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
      isDark ? 'bg-white/10 text-slate-400 hover:bg-amber-500 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-amber-500 hover:text-white'
    }`}
  >
    {icon}
  </a>
);

export default AgentDetails;