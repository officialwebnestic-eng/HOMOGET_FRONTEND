import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Phone, Mail, Calendar, Building2, 
  Award, Briefcase, Clock, Star, ChevronLeft,
  TrendingUp, Globe, ShieldCheck, BadgeCheck, CreditCard,
  Languages, FileText, Hash, Users, DollarSign, Heart,
  MessageCircle, Linkedin, Twitter, Facebook, Instagram,
  CheckCircle, AlertCircle, Crown, Diamond, Sparkles,
  PhoneCall, ExternalLink, Download, Share2, ThumbsUp, X, Loader2, Search
} from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";
import { FaWhatsapp } from 'react-icons/fa';
import { useToast } from '../../../model/SuccessToasNotification';
import { http } from '../../../axios/axios';

const UserAgentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === 'dark';

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const getImageUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    return `${API_BASE_URL}/agents/${filename}`;
  };

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await http.get(`/getpublicagent/${id}`, { withCredentials: true });
        if (response.data.success) {
          const agentData = response.data.data;
          // Add image URL
          agentData.profilePhotoUrl = getImageUrl(agentData.profilePhoto);
          setAgent(agentData);
        }
      } catch (error) {
        console.error('Error fetching agent:', error);
        addToast('Failed to load agent details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await http.post('/createrequest', {
        ...formData,
        agentId: agent._id
      });
      if (res.data.success) {
        setFormSuccess(true);
        addToast('Message Sent Successfully', 'success');
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess(false);
          setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        }, 2000);
      }
    } catch (err) {
      addToast('Failed to send inquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      return data.replace(/[\\"[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);
    } catch (e) { 
      return []; 
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="text-center">
          <User size={64} className="mx-auto text-slate-400 mb-4" />
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Agent Not Found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-amber-500 text-black rounded-xl font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Properties Sold', value: agent.totalPropertiesSold || 128, icon: <TrendingUp size={16} /> },
    { label: 'Happy Clients', value: agent.happyClients || 256, icon: <Heart size={16} /> },
    { label: 'Years Experience', value: agent.experienceYears || 8, icon: <Clock size={16} /> },
    { label: 'Active Listings', value: agent.activeListings || 24, icon: <Building2 size={16} /> },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Hero Section - Similar to Agent Support */}
      <section className="relative w-full h-[60vh] md:h-[65vh] flex items-center overflow-visible">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Luxury Property" 
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/50'}`} />
        </div>
        
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500 text-black mb-6 shadow-xl">
              <Crown size={14} />
              <span className="text-[10px] font-serif tracking-widest uppercase">Elite Agent</span>
            </div>
            
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-white`}>
              Meet Your <br />
              <span className="text-amber-500">Luxury Advisor</span>
            </h1>
          
            <p className={`max-w-2xl text-base md:text-lg font-light leading-relaxed mb-8 text-white/80`}>
              Connect with {agent.name}, a dedicated luxury property consultant specializing in premium 
              residential properties and high-yield investments in Dubai.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Agent Profile Card - Full Width Design */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-3xl overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}
        >
          {/* Cover Image */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-amber-500 to-orange-600">
            <div className="absolute inset-0 bg-black/20" />
          </div>
          
          {/* Profile Section */}
          <div className="relative px-6 pb-8">
            {/* Profile Image */}
            <div className="absolute -top-16 left-6">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-2xl rotate-6" />
                <img 
                  src={agent.profilePhotoUrl || agent.profilePhoto || `https://ui-avatars.com/api/?name=${agent.name}&background=C5A059&color=fff&size=150`}
                  className="relative w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                  alt={agent.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${agent.name}&background=C5A059&color=fff&size=150`;
                    setImageError(true);
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
              </div>
            </div>
            
            {/* Agent Name & Actions */}
            <div className="pt-20 pb-6 border-b border-slate-200 dark:border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {agent.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <BadgeCheck size={16} className="text-amber-500" />
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      RERA Certified • BRN: {agent.reraLicenseNumber || 'N/A'}
                    </span>
                  </div>
                </div>
                
              <div className="flex flex-wrap gap-2">
  <a
    href={`tel:${agent.phone}`}
    className="px-4 py-2 bg-amber-500 text-black font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-amber-600 transition-all"
  >
    <PhoneCall size={14} /> Call
  </a>
  
  <a
    href={`https://wa.me/${agent.phone?.replace(/\D/g, '')}`}
    target="_blank"
    rel="noreferrer"
    className="px-4 py-2 bg-green-600 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-green-700 transition-all"
  >
    <FaWhatsapp size={14} /> WhatsApp
  </a>
  
  <a
    href={`mailto:${agent.email}`}
    className="px-4 py-2 bg-blue-600 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-blue-700 transition-all"
  >
    <Mail size={14} /> Email
  </a>
  
  <button
    onClick={() => setIsModalOpen(true)}
    className="px-4 py-2 bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-700 transition-all"
  >
    <MessageCircle size={14} /> Message
  </button>
</div>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-200 dark:border-white/10">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex justify-center mb-2 text-amber-500">{stat.icon}</div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                </div>
              ))}
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
              
              {/* Left Column - Bio & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div>
                  <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <User size={18} className="text-amber-500" /> About
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {agent.bio || `${agent.name} is a dedicated luxury property consultant with over ${agent.experienceYears || 8} years of experience in the Dubai real estate market. Specializing in premium residential properties and high-yield investments, committed to providing exceptional service and expert guidance to clients seeking their dream homes or investment opportunities.`}
                  </p>
                </div>
                
                {/* Professional Details */}
                <div>
                  <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Briefcase size={18} className="text-amber-500" /> Professional Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem label="Designation" value={agent.role || 'Property Consultant'} isDark={isDark} />
                    <DetailItem label="Experience" value={`${agent.experienceYears || 8} Years`} isDark={isDark} />
                    <DetailItem label="Joining Date" value={formatDate(agent.joiningDate)} isDark={isDark} />
                    <DetailItem label="Visa Status" value={agent.visaStatus || 'Employment Visa'} isDark={isDark} />
                    <DetailItem label="Languages" value={formatList(agent.languages).join(', ') || 'English'} isDark={isDark} />
                    <DetailItem label="Location" value={agent.city || 'Dubai, UAE'} isDark={isDark} />
                  </div>
                </div>
                
                {/* Skills */}
                {agent.skills && agent.skills.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      <Award size={18} className="text-amber-500" /> Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formatList(agent.skills).map((skill, i) => (
                        <span key={i} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Contact & Info */}
              <div className="space-y-6">
                {/* Contact Card */}
                <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                  <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Phone size={16} className="text-amber-500" /> Contact Information
                  </h3>
                  <div className="space-y-3">
                    <ContactItem 
                      icon={<PhoneCall size={14} />} 
                      label="Phone" 
                      value={agent.phone} 
                      href={`tel:${agent.phone}`}
                      isDark={isDark}
                    />
                    <ContactItem 
                      icon={<Mail size={14} />} 
                      label="Email" 
                      value={agent.email} 
                      href={`mailto:${agent.email}`}
                      isDark={isDark}
                    />
                    <ContactItem 
                      icon={<MapPin size={14} />} 
                      label="Address" 
                      value={agent.address || 'Dubai, UAE'} 
                      isDark={isDark}
                    />
                  </div>
                </div>
                
                {/* Regulatory Info */}
                <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                  <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <ShieldCheck size={16} className="text-amber-500" /> Regulatory Information
                  </h3>
                  <div className="space-y-2">
                    <RegulatoryItem label="RERA License" value={agent.reraLicenseNumber || 'N/A'} isDark={isDark} />
                    <RegulatoryItem label="Emirates ID" value={agent.emiratesId || 'N/A'} isDark={isDark} />
                    <RegulatoryItem label="Agent ID" value={agent.agentId || 'N/A'} isDark={isDark} />
                  </div>
                </div>
                
                {/* Rating */}
                <div className={`p-5 rounded-2xl text-center ${isDark ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'}`}>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={18} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>4.9 out of 5</p>
                  <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Based on 128 client reviews</p>
                  <div className="mt-3 pt-3 border-t border-amber-500/20">
                    <div className="flex items-center justify-center gap-1.5">
                      <Crown size={12} className="text-amber-500" />
                      <span className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Top Rated Agent 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Consultation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border shadow-2xl ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
            >
              {formSuccess ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Request Sent!</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    We'll connect you with {agent?.name} shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white">
                      <img 
                        src={agent?.profilePhotoUrl || agent?.profilePhoto || `https://ui-avatars.com/api/?name=${agent?.name}&background=C5A059&color=fff`}
                        className="w-24 h-24 rounded-2xl mb-4 border-2 border-white/20"
                        alt={agent?.name}
                      />
                      <h3 className="text-xl font-bold mb-1">{agent?.name}</h3>
                      <p className="text-sm opacity-90 mb-4">{agent?.role || 'Property Consultant'}</p>
                      <div className="flex gap-2">
                        <a href={`tel:${agent?.phone}`} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition">
                          <PhoneCall size={16} />
                        </a>
                        <a href={`https://wa.me/${agent?.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition">
                          <FaWhatsapp size={16} />
                        </a>
                        <a href={`mailto:${agent?.email}`} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition">
                          <Mail size={16} />
                        </a>
                      </div>
                    </div>
                    
                    <div className="md:w-3/5 p-8">
                      <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-amber-500 transition">
                        <X size={20} />
                      </button>
                      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>Schedule Consultation</h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="First Name"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className={`p-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-800 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                          />
                          <input
                            type="text"
                            placeholder="Last Name"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className={`p-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-800 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                          />
                        </div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-800 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-800 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                        <textarea
                          rows="3"
                          placeholder="Tell us about your property requirements..."
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 resize-none ${isDark ? 'bg-slate-800 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <MessageCircle size={20} />}
                          {isSubmitting ? 'Sending...' : 'Send Consultation Request'}
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-components
const DetailItem = ({ label, value, isDark }) => (
  <div>
    <p className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
      {label}
    </p>
    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{value || 'N/A'}</p>
  </div>
);

const ContactItem = ({ icon, label, value, href, isDark }) => (
  <div className="flex items-start gap-3">
    <div className={`mt-0.5 ${isDark ? 'text-amber-500' : 'text-amber-500'}`}>{icon}</div>
    <div>
      <p className={`text-[8px] font-bold uppercase tracking-wider mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {label}
      </p>
      {href ? (
        <a href={href} className={`text-sm font-medium ${isDark ? 'text-white hover:text-amber-400' : 'text-slate-800 hover:text-amber-600'} transition-colors`}>
          {value}
        </a>
      ) : (
        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
      )}
    </div>
  </div>
);

const RegulatoryItem = ({ label, value, isDark }) => (
  <div className="flex justify-between items-center">
    <span className={`text-[9px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
    <span className={`text-[10px] font-mono font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>{value}</span>
  </div>
);

export default UserAgentDetails;