import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  MapPin, Bed, Ruler, ArrowLeft, Search, X, 
  ShieldCheck, Star, ArrowRight, ExternalLink, 
  Bath, LayoutGrid, CheckCircle2, Info, Boxes, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "../../../context/ThemeContext";
import useGetAllProperty from "../../../hooks/useGetAllProperty";
import { useToast } from '../../../model/SuccessToasNotification';
import { http } from '../../../axios/axios';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const lastIdRef = useRef(null);
  
  // --- STATES ---
  const [property, setProperty] = useState(location.state?.propertyData || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: "", lastName: "", email: "", phone: "", message: "" 
    
  });


  // Search Engine States for Related Section
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const { propertyList = [] } = useGetAllProperty(1, 100, {});

  // --- ADS DATA ---
  const dummyAds = useMemo(() => [
    { title: "Golden Visa Expert", description: "Secure 10-year residency with property investments above AED 2M.", mediaUrl: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1",redirectUrl: "/property/5f8d9d1d7c5d8a1c1b5b2a2b" },
    { title: "0% Commission Deals", description: "Exclusive luxury inventory in Business Bay. Direct developer pricing.", mediaUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",redirectUrl: "/property/5f8d9d1d7c5d8a1c1b5b2a2b" },
  ], []);

  // --- EFFECTS ---
  useEffect(() => {
    if (lastIdRef.current !== id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      lastIdRef.current = id;
    }
    if (!property && propertyList.length > 0) {
      const found = propertyList.find(p => p._id === id);
      if (found) setProperty(found);
    }
  }, [id, propertyList, property]);

  useEffect(() => {
    const timer = setInterval(() => setActiveAdIndex(p => (p + 1) % dummyAds.length), 6000);
    return () => clearInterval(timer);
  }, [dummyAds.length]);

  // --- API HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Using property.agentId if available, otherwise fallback to a dummy ID
      const agentId = property?.agentId || "65f1234567890"; 
      const res = await http.post("/createrequest", { ...formData, agentId });
      
      if (res.data.success) {
        addToast("Message Sent Successfully", "success");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
        setTimeout(() => setIsModalOpen(false), 2000);
      }
    } catch (err) {
      addToast("Failed to send inquiry", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RELATED LOGIC ---
  const filteredRelated = useMemo(() => {
    if (!property || !propertyList.length) return [];
    return propertyList.filter(item => 
      item._id !== id && 
      item.city?.toLowerCase() === property.city?.toLowerCase() &&
      (filterType === "All" || item.propertytype === filterType) &&
      (item.propertyname?.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 3);
  }, [propertyList, property, id, searchQuery, filterType]);

  if (!property) return <div className="h-screen flex items-center justify-center bg-[#0a0a0c] text-amber-500 font-black tracking-widest">LOADING ASSET...</div>;

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#0a0a0c] text-white" : "bg-gray-50 text-gray-900"}`}>
      
      {/* 1. SECTION: HERO (Cinematic) */}
      <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          src={property.image?.[0]} className="w-full h-full object-cover" alt="Hero" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/20 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-10 left-10 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-amber-500 transition-all z-20">
          <ArrowLeft size={20} />
        </button>
        <div className="absolute bottom-16 left-6 md:left-20 max-w-5xl">
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-8xl font-serif text-white mb-4 leading-tight">
            {property.propertyname}
          </motion.h1>
          <p className="flex items-center text-amber-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">
            <MapPin className="mr-2" size={16} /> {property.address}, {property.city}
          </p>
        </div>
      </section>

      {/* --- CONTENT HUB --- */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: PROPERTY DETAILS */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* 2. SECTION: GALLERY */}
            <div className="space-y-6">
              <h3 className="text-2xl font-serif flex items-center gap-3">
                <LayoutGrid size={22} className="text-amber-500"/> Property Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.image?.slice(0, 5).map((img, i) => (
                  <div key={i} className={`overflow-hidden rounded-[2rem] bg-white/5 ${i === 0 ? "md:col-span-2 md:row-span-2 h-[450px]" : "h-52"}`}>
                    <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Gallery" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. SECTION: DESCRIPTION */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-amber-500"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">The Narrative</span>
              </div>
              <p className="text-2xl leading-relaxed opacity-80 font-light border-l-2 border-amber-500/30 pl-8 italic">
                {property.description}
              </p>
            </div>

            {/* 4. SECTION: PROPERTY TYPE & SPECS */}
            <div className="space-y-8">
              <h3 className="text-2xl font-serif">Asset Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Type", val: property.propertytype, icon: <Boxes /> },
                  { label: "Bedrooms", val: property.bedroom, icon: <Bed /> },
                  { label: "Bathrooms", val: property.bathroom || '4', icon: <Bath /> },
                  { label: "Area", val: `${property.squarefoot} sqft`, icon: <Ruler /> }
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] bg-gray-100 dark:bg-white/5 border border-black/5 text-center hover:border-amber-500/30 transition-all">
                    <div className="text-amber-500 mb-4 flex justify-center">{stat.icon}</div>
                    <p className="text-xl font-bold">{stat.val}</p>
                    <p className="text-[9px] font-black uppercase opacity-40 tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. SECTION: AMENITIES */}
            <div className="p-12 rounded-[3.5rem] bg-[#0a0a0c] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5"><Star size={150} /></div>
              <h3 className="text-3xl font-serif mb-10 relative z-10">Premium Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 relative z-10">
                {property.aminities?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-wider opacity-70">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. SECTION: TRAKHEESI & INFO */}
            <div className="p-10 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10 space-y-10">
              <div className="flex items-center gap-3">
                <Info className="text-amber-500" size={24} />
                <h3 className="text-2xl font-serif">Regulatory Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-1">Trakheesi Permit</p>
                  <p className="text-lg font-bold text-amber-500">{property.trakheesiNumber || "DLD-712839-2026"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-1">Ownership</p>
                  <p className="text-lg font-bold">Freehold</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-1">Status</p>
                  <p className="text-lg font-bold uppercase">{property.status}</p>
                </div>
              </div>
              
              <div className="pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center font-serif text-2xl text-black">N</div>
                  <div>
                    <h4 className="font-serif text-xl">Neha Elite</h4>
                    <p className="text-[10px] font-black uppercase opacity-50">Elite Portfolio Manager</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto px-10 py-5 bg-black dark:bg-amber-500 text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                  Request Call Back
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY ADS */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Curated Offers</span>
                <div className="flex gap-1.5">
                  {dummyAds.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${activeAdIndex === i ? "w-6 bg-amber-500" : "w-1 bg-gray-700"}`} />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAdIndex}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="rounded-[3rem] overflow-hidden bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-2xl"
                >
                  <div className="h-56 overflow-hidden">
                    <img src={dummyAds[activeAdIndex].mediaUrl} className="w-full h-full object-cover" alt="Ad" />
                  </div>
                  <div className="p-10">
                    <h4 className="text-2xl font-serif mb-4 leading-tight">{dummyAds[activeAdIndex].title}</h4>
                    <p className="text-sm opacity-60 leading-relaxed mb-8">{dummyAds[activeAdIndex].description}</p>
                    <Link  to ={dummyAds[activeAdIndex].redirectUrl} className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-black transition-all">
                      Learn More <ExternalLink size={14} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-neutral-900 to-[#1a1a1e] text-white border border-white/5 overflow-hidden group">
                   <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">Mortgage Advisory</p>
                   <h5 className="text-lg font-serif mb-2 italic">Finance Your Asset</h5>
                   <p className="text-xs text-white/40 leading-relaxed">Get pre-approved in 48 hours via our banking partners.</p>
                   <TrendingUp className="mt-4 opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* RELATED SECTION WITH HERO SEARCH */}
      <section className="bg-gray-100 dark:bg-white/[0.02] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif">Related <span className="text-amber-500 italic">Collections</span></h2>
            
            {/* SEARCH BAR (Hero Style) */}
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-[2.5rem] shadow-xl border border-black/5 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] flex items-center bg-gray-100 dark:bg-white/5 px-6 rounded-2xl border border-transparent focus-within:border-amber-500 transition-all">
                <Search className="text-amber-500" size={18}/>
                <input 
                  className="bg-transparent w-full p-4 text-xs font-bold outline-none" 
                  placeholder="Filter by name or neighborhood..." 
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-100 dark:bg-white/5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border-r-8 border-transparent"
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredRelated.map(p => (
              <motion.div 
                key={p._id} whileHover={{ y: -10 }} 
                onClick={() => navigate(`/property/${p._id}`, { state: { propertyData: p } })}
                className="bg-white dark:bg-neutral-900 rounded-[3rem] overflow-hidden border border-black/5 shadow-sm group cursor-pointer"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={p.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-full">AED {Number(p.price).toLocaleString()}</div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-serif mb-4">{p.propertyname}</h4>
                  <div className="flex gap-4 text-[9px] font-black uppercase opacity-40">
                    <span className="flex items-center gap-1"><Bed size={12}/>{p.bedroom} Beds</span>
                    <span className="flex items-center gap-1"><Ruler size={12}/>{p.squarefoot} Sqft</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENT INQUIRY MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-w-2xl w-full bg-white dark:bg-neutral-900 rounded-[3rem] p-12 text-center shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-amber-500"><X size={24}/></button>
              <h2 className="text-3xl font-serif mb-2 uppercase">Request Briefing</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-8">Direct connection with Neha Elite</p>
              
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-white/5 outline-none text-xs font-bold" placeholder="First Name" />
                  <input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-white/5 outline-none text-xs font-bold" placeholder="Last Name" />
                </div>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-white/5 outline-none text-xs font-bold" placeholder="Email Address" />
                <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-white/5 outline-none text-xs font-bold" placeholder="WhatsApp / Contact Number" />
                <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-white/5 outline-none text-xs font-bold h-32 resize-none" placeholder="Message..." />
                
                <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl disabled:opacity-50 transition-all">
                  {isSubmitting ? "TRANSMITTING..." : "SUBMIT INQUIRY"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetailsPage;