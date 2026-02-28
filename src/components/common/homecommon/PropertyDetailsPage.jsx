import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  MapPin, Bed, Ruler, ArrowLeft, X, ShieldCheck, ExternalLink, 
  Home, IndianRupee, Bath, Barcode, Wrench, LayoutGrid, 
  Phone, Mail, MessageSquare, Calendar, Building2, Wallet2, 
  Map as MapIcon, ChevronRight, FileText, PlayCircle, Info, Sparkles, Boxes, Star, CheckCircle2, Search,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "../../../context/ThemeContext";
import useGetAllProperty from "../../../hooks/useGetAllProperty";
import { FiArrowRight } from 'react-icons/fi';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  
  const [property, setProperty] = useState(location.state?.propertyData || null);
  const [isNarrativeOpen, setIsNarrativeOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  const { propertyList = [] } = useGetAllProperty(1, 100, {});

  const filterFields = [
    { name: "state", label: "Location", icon: <MapPin size={14} /> },
    { name: "propertytype", label: "Type", icon: <Home size={14} /> },
    { name: "price", label: "Price", icon: <IndianRupee size={14} /> },
    { name: "bedroom", label: "Beds", icon: <Bed size={14} /> },
    { name: "city", label: "City", icon: <MapPin size={14} /> },
  ];


   const handleClickBooking = () => {
    navigate(`/bookings`)
  }

  useEffect(() => {
    if (!property && propertyList.length > 0) {
      const found = propertyList.find(p => p._id === id);
      if (found) setProperty(found);
    }
  }, [id, propertyList, property]);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const isProject = useMemo(() => property?.propertyListingType === "project", [property]);

  const filteredRelated = useMemo(() => {
    return propertyList
      .filter(p => p._id !== id)
      .filter(p => {
        const matchesSearch = p.propertyname.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
          if (!value || value === "All") return true;
          return String(p[key]) === String(value);
        });
        return matchesSearch && matchesFilters;
      })
      .slice(0, 3);
  }, [propertyList, id, searchQuery, activeFilters]);

  if (!property) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0c]">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#0a0a0c] text-white" : "bg-white text-slate-900"}`}>
      
      {/* 1. GALLERY HERO SECTION */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          src={property.image?.[activeImg]} 
          className="w-full h-full object-cover" 
          alt="Hero" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/20 to-transparent" />
        
        <button onClick={() => navigate(-1)} className="absolute top-10 left-6 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-amber-500 transition-all z-20">
          <ArrowLeft size={20} />
        </button>

        <div className="absolute bottom-12 left-6 md:left-20 right-6 z-20">
             <span className="px-4 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                {isProject ? "New Project Launch" : "Ready Property"}
             </span>
             <h1 className="text-4xl md:text-7xl font-serif text-white mb-4 leading-tight uppercase italic tracking-tighter">
                {property.propertyname}
             </h1>
             <p className="flex items-center text-white/80 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                <MapPin className="mr-2 text-amber-500" size={16} /> {property.address}
             </p>
        </div>
      </section>


 <button  onClick={ handleClickBooking} className="mt-8 px-10    ml-5  md:ml-10 py-4 bg-amber-500 text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                Book Now 
                </button>
      {/* MAIN CONTENT GRID */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">


          
          <div className="lg:col-span-8 space-y-16">
            
            {/* THUMBNAILS SECTION */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {property.image?.map((img, idx) => (
                <div key={idx} onClick={() => setActiveImg(idx)} className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${activeImg === idx ? 'border-amber-500 scale-95' : 'border-transparent opacity-60'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </div>
              ))}
            </div>

 {/* --- SPECIFICATIONS & PROPERTY DATA SECTION --- */}
<section className="space-y-10">

  <div className="mb-12 flex items-center gap-6">
    <div className="flex flex-col">
       <div className="flex items-center gap-2 mb-2">
         <div className="h-[1px] w-8 bg-amber-500"></div>
         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Informations</span>
       </div>
       <h2 className="text-3xl md:text-5xl font-serif italic text-neutral-900 dark:text-white leading-none">
         Key 
 <span className="text-amber-500">information</span> 
       </h2>
    </div>
  </div>
  
  {/* PRIMARY SPECS GRID (Dynamic based on Project vs Ready) */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {isProject ? (
      <>
        <SpecCard icon={<Calendar />} value={property.deliveryDate || "Q4 2026"} label="Handover" />
        <SpecCard icon={<Boxes />} value={property.propertytype} label="Category" />
        <SpecCard icon={<Sparkles />} value={property.segment || "Standard"} label="Segment" />
        <SpecCard icon={<MapIcon />} value={property.city} label="Location" />
      </>
    ) : (
      <>
        <SpecCard icon={<Bed />} value={property.bedroom || "Studio"} label="Beds" />
        <SpecCard icon={<Bath />} value={property.bathroom || "1"} label="Baths" />
        <SpecCard icon={<Ruler />} value={property.squarefoot} label="Sq.Ft" />
        <SpecCard icon={<LayoutGrid />} value={property.floor || "Mid Floor"} label="Floor" />
      </>
    )}
  </div>

  {/* SECONDARY TECHNICAL DETAILS (The 3x3 Grid you requested) */}
  <div className="space-y-4">
    {/* Row 1: Legal & Identity */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DataBox icon={<ShieldCheck />} label="Trakheesi Number" value={property.trakheesiNumber} />
      {isProject ? (
        <DataBox icon={<Barcode />} label="Project Number" value={property.projectNumber || "5529"} />
      ) : (
        <DataBox icon={<Building2 />} label="Property Status" value={property.propertystatus || "Ready"} />
      )}
      <DataBox icon={<Building2 />} label="RERA ORN" value={property.reraORN || "12345"} />
    </div>

    {/* Row 2: Timeline & Status */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DataBox icon={<Calendar />} label="Delivery Date" value={property.deliveryDate || "Immediate"} />
      <DataBox icon={<Layers />} label="Segment" value={property.segment || "Premium"} />
      <DataBox icon={<ShieldCheck />} label="RERA BRN" value={property.brnNumber || "55667"} />
    </div>

    {/* Row 3: Unit Specifics */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DataBox icon={<LayoutGrid />} label="Floor" value={property.floor || "N/A"} />
      <DataBox icon={<Bath />} label="Bathrooms" value={property.bathroom} />
      <DataBox icon={<Bed />} label="Bedrooms" value={property.bedroom || "Studio"} />
    </div>
  </div>

</section>
{/* --- END SECTION --- */}
<section className="mt-20 px-4 md:px-0 max-w-[1400px] mx-auto">
  
  {/* Header: Consistent with your Property Details style */}
  <div className="mb-12 flex items-center gap-6">
    <div className="flex flex-col">
       <div className="flex items-center gap-2 mb-4">
         <div className="h-[1px] w-8 bg-amber-500"></div>
         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 uppercase">Destination</span>
       </div>
       <h2 className="text-3xl md:text-5xl font-serif italic text-neutral-900 dark:text-white leading-none">
         Location <span className="text-amber-500">&</span> Nearby Attractions
       </h2>
    </div>
  </div>

  {/* 1. TOP CARDS: DISTRICT & ADDRESS */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
    
    {/* District / City Card - Matching your gray rounded box style */}
    <div className="p-10 rounded-[2.5rem] bg-[#F2F2F2] dark:bg-neutral-800 border border-black/5 dark:border-white/5 flex items-center justify-between shadow-sm">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">District / City</span>
        <span className="text-4xl font-black text-neutral-900 dark:text-white">
          {property.city || "Dubai"}
        </span>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
        <MapPin size={24} />
      </div>
    </div>

    {/* Full Address Card - Matching your gray rounded box style */}
    <div className="p-10 rounded-[2.5rem] bg-[#F2F2F2] dark:bg-neutral-800 border border-black/5 dark:border-white/5 flex items-center justify-between shadow-sm">
      <div className="flex flex-col flex-1 pr-4">
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Full Address</span>
        <span className="text-lg font-bold text-neutral-700 dark:text-slate-300 leading-tight truncate">
          {property.address || "Address not specified"}
        </span>
      </div>
      <a 
        href={property.locationMap}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white shadow-md hover:bg-amber-500 hover:text-black transition-all"
      >
        <FiArrowRight size={24} />
      </a>
    </div>

  </div>

  {/* 2. LARGE MAP SECTION */}
  <div className="relative w-full h-[600px] rounded-[3.5rem] overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-900 shadow-2xl">
    {property.locationMap ? (
      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        frameBorder="0"
        src={property.locationMap}
        allowFullScreen
        className="dark:grayscale dark:invert-[0.9] dark:contrast-[1.2] opacity-90"
      ></iframe>
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950">
        <MapPin size={48} className="text-amber-500/20 mb-4" />
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Map link not available</p>
      </div>
    )}

    {/* Navigation CTA Button Overlay */}
    <div className="absolute bottom-10 right-10">
      <a 
        href={property.locationMap}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-10 py-5 bg-amber-500 text-black text-[11px] font-black uppercase rounded-2xl shadow-2xl hover:bg-amber-400 transition-all active:scale-95"
      >
        Open Navigation
      </a>
    </div>
  </div>
</section>
            
            {/* 2. DEVELOPER SECTION WITH LOGO */}
          {
             isProject ? ( <section className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2">
                  <img src={property.developerLogo || "/emaar-logo.png"} alt="Developer" className="object-contain" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-50">Developer</p>
                  <h3 className="text-2xl font-serif italic text-amber-500">{property.developerName || "Emaar Properties"}</h3>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-[10px] uppercase opacity-40">Trakheesi No</p>
                <p className="font-bold text-amber-500 tracking-widest">{property.trakheesiNumber || "7122883301"}</p>
              </div>
            </section>
            ) :(

              
              <h1 className="text-4xl md:text-7xl font-serif text-white mb-4 leading-tight uppercase italic tracking-tighter">


                No Developer Found 
              </h1>
            )
          }

            {/* 3. ABOUT WITH POPUP */}
            <div className="p-10 rounded-[3rem] bg-gray-50 dark:bg-white/[0.03] border border-black/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5"><FileText size={100} /></div>
                <h3 className="text-2xl font-serif mb-6 flex items-center gap-3"><FileText className="text-amber-500" /> Narrative</h3>
                <p className="text-lg font-light leading-relaxed opacity-70 line-clamp-4 relative z-10">
                    {property.description}
                </p>
                <button onClick={() => setIsNarrativeOpen(true)} className="mt-8 px-10 py-4 bg-amber-500 text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  Show Full Narrative
                </button>
            </div>

            {/* 4. AMENITIES SECTION */}
            <div className="p-12 rounded-[4rem] bg-[#0a0a0c] text-white border border-white/5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 p-10 opacity-5"><Star size={200} /></div>
              <h3 className="text-3xl font-serif mb-12 relative z-10 italic">Premium <span className="text-amber-500">Amenities</span></h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 relative z-10">
                {property.aminities?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500 transition-colors">
                      <CheckCircle2 size={16} className="text-amber-500 group-hover:text-black" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. PAYMENT PLAN SECTION (OFF-PLAN SPECIFIC) */}
            {isProject && (
              <section className="space-y-6">
                <h3 className="text-3xl font-serif italic"><Wallet2 className="inline mr-3 text-amber-500"/> Payment Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-10 rounded-[2.5rem] bg-amber-500 text-black relative overflow-hidden group">
                    <p className="text-[10px] font-black uppercase opacity-60">On Booking</p>
                    <h4 className="text-5xl font-serif mt-2 italic">20%</h4>
                    <p className="text-xs font-bold mt-4 italic uppercase tracking-widest">Down Payment</p>
                    <Building2 className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" size={100} />
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 group">
                    <p className="text-[10px] font-black uppercase opacity-50">During Construction</p>
                    <h4 className="text-5xl font-serif mt-2 italic text-amber-500">80%</h4>
                    <p className="text-xs font-bold mt-4 italic uppercase tracking-widest">Post Handover</p>
                  </div>
                </div>
              </section>
            )}

            {/* MASTER PLAN SECTION */}
            {/* <section className="space-y-8">
               <h3 className="text-2xl font-serif flex items-center gap-3"><LayoutGrid className="text-amber-500" /> Community Master Plan</h3>
               <div className="aspect-video rounded-[3.5rem] overflow-hidden bg-gray-200 dark:bg-white/5 border border-white/10 shadow-2xl">
                  <img src={property.image?.[1] || property.image?.[0]} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Master Plan" />
               </div>
            </section> */}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              
              {/* AGENT CARD */}
              <div className="p-10 rounded-[3rem] bg-white dark:bg-neutral-900 border border-black/5 shadow-2xl text-center">
                <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden ring-4 ring-amber-500/20 mb-6">
                  <img src={property.agentId?.profilePhoto} className="w-full h-full object-cover" alt="Agent" />
                </div>
                <h4 className="text-2xl font-black uppercase italic tracking-tighter">{property.agentId?.name}</h4>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">{property.agentId?.role || "Luxury Advisor"}</p>
                
                <div className="space-y-3 mb-8">
                  <ContactItem icon={<MessageSquare size={16}/>} label="WhatsApp" value="Chat Now" isWhatsApp />
                  <ContactItem icon={<Phone size={16}/>} label="Direct Call" value={property.agentId?.phone} />
                </div>

                <button className="w-full py-6 bg-black dark:bg-amber-500 text-white dark:text-black rounded-3xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                  Request Information
                </button>
              </div>

              {/* ADS SECTION */}
              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-amber-400 to-orange-600 text-black relative overflow-hidden shadow-2xl group cursor-pointer">
                  <div className="relative z-10">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-[8px] font-black uppercase mb-4 inline-block">Partner Feature</span>
                    <h5 className="text-2xl font-serif leading-tight mb-2">Luxury Interior Design Consultation</h5>
                    <p className="text-xs font-medium opacity-80 mb-8">Exclusive complimentary session for {property.propertyname} owners.</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase border-b-2 border-black pb-1 w-fit">
                      Enquire Now <ExternalLink size={14}/>
                    </div>
                  </div>
                  <Sparkles size={130} className="absolute -bottom-8 -right-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
              </div>
            </div>
          </aside>
        </div>
      </div>





    

      {/* RELATED COLLECTIONS WITH FILTERS */}
      <section className="bg-gray-50 dark:bg-white/[0.02] py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 space-y-12">
            <h2 className="text-5xl font-serif">Similar <span className="text-amber-500 italic">Collections</span></h2>
            
            {/* DYNAMIC FILTER BAR */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-[3.5rem] shadow-2xl border border-white/5 flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[300px] flex items-center bg-gray-50 dark:bg-white/5 px-8 rounded-2xl border border-transparent focus-within:border-amber-500 transition-all">
                <Search className="text-amber-500 mr-3" size={20}/>
                <input className="bg-transparent w-full py-6 text-[10px] font-black uppercase tracking-widest outline-none" placeholder="Search property name..." onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-3">
                {filterFields.map((field) => (
                  <select key={field.name} onChange={(e) => setActiveFilters({...activeFilters, [field.name]: e.target.value})} className="bg-gray-50 dark:bg-white/5 px-6 py-5 rounded-xl text-[9px] font-black uppercase tracking-widest outline-none border border-transparent focus:border-amber-500 cursor-pointer">
                    <option value="">{field.label}</option>
                    <option value="All">All {field.label}</option>
                    {[...new Set(propertyList.map(item => item[field.name]))].filter(Boolean).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {filteredRelated.map(p => (
              <motion.div key={p._id} whileHover={{ y: -15 }} onClick={() => { navigate(`/property/${p._id}`, { state: { propertyData: p } }); window.scrollTo(0,0); }} className="bg-white dark:bg-neutral-900 rounded-[4rem] overflow-hidden border border-white/5 shadow-lg group cursor-pointer">
                <div className="h-80 overflow-hidden relative">
                  <img src={p.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Related" />
                  <div className="absolute top-8 left-8 px-5 py-2 bg-black/40 backdrop-blur-xl text-white text-[9px] font-black uppercase rounded-full border border-white/10">
                    {p.currency} {Number(p.price).toLocaleString()}
                  </div>
                </div>
                <div className="p-12">
                  <h4 className="text-2xl font-serif mb-6 group-hover:text-amber-500 transition-colors uppercase italic tracking-tighter">{p.propertyname}</h4>
                  <div className="flex justify-between items-center border-t border-white/5 pt-8">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2 text-[10px] font-black opacity-40 uppercase"><Bed size={16}/> {p.bedroom || '0'}</span>
                        <span className="flex items-center gap-2 text-[10px] font-black opacity-40 uppercase"><Ruler size={16}/> {p.squarefoot || '0'}</span>
                    </div>
                    <ArrowLeft className="rotate-180 text-amber-500 transition-all" size={24}/>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POPUP: NARRATIVE MODAL */}
      <AnimatePresence>
        {isNarrativeOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl bg-[#0d0d0f] rounded-[4rem] p-12 md:p-20 max-h-[85vh] overflow-y-auto border border-white/10">
                <button onClick={() => setIsNarrativeOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-amber-500 transition-colors"><X size={32}/></button>
                <div className="flex items-center gap-2 text-amber-500 mb-6"><Info size={20}/> <span className="text-[10px] font-black uppercase tracking-widest">Property Manifesto</span></div>
                <h2 className="text-4xl md:text-6xl font-serif mb-12 italic tracking-tighter text-balance">{property.propertyname}</h2>
                <div className="text-xl font-light opacity-80 whitespace-pre-line leading-relaxed text-balance">
                    {property.description}
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// COMPONENT HELPERS
const ContactItem = ({ icon, label, value, isWhatsApp }) => (
  <div className={`p-5 rounded-3xl flex items-center justify-between border ${isWhatsApp ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-gray-50 dark:bg-white/5 border-transparent'}`}>
    <div className="flex items-center gap-4">
      {icon}
      <div className="text-left">
        <p className="text-[8px] font-black uppercase opacity-40 tracking-widest">{label}</p>
        <p className="text-[12px] font-bold">{value}</p>
      </div>
    </div>
    <ChevronRight size={14} className="opacity-30" />
  </div>
);

const SpecCard = React.memo(({ icon, value, label }) => (
  <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-white/10 text-center hover:bg-amber-500 hover:text-black transition-all duration-500 group">
    <div className="text-amber-500 mb-4 flex justify-center group-hover:text-black transition-colors">{icon}</div>
    <p className="text-xl font-bold italic">{value || "---"}</p>
    <p className="text-[9px] font-black uppercase opacity-40 group-hover:text-black/50 tracking-widest">{label}</p>
  </div>
))

const DataBox = React.memo(({ icon, label, value }) => (
  <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-white/10">
    <div className="flex items-center gap-2 text-amber-500 mb-1">
      {React.cloneElement(icon, { size: 14 })}
      <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">{label}</span>
    </div>
    <p className="text-lg font-bold italic">{value || "N/A"}</p>
  </div>
));

export default PropertyDetailsPage;