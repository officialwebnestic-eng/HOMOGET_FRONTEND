import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { 
  MapPin, Home, IndianRupee, Ruler, Bed, Bath, Barcode, Wrench, ChevronDown, 
  Crown, Phone, Mail, Share2, Heart 
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import useGetAllProperty from "../hooks/useGetAllProperty";

const Rent = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // --- 1. FILTER CONFIGURATION ---
  const filterFields = [
    { name: "city", label: "City", icon: <MapPin size={14} /> },
    { name: "propertytype", label: "Type", icon: <Home size={14} /> },
    { name: "price", label: "Price", icon: <IndianRupee size={14} /> },
    { name: "squarefoot", label: "Area", icon: <Ruler size={14} /> },
    { name: "bedroom", label: "Beds", icon: <Bed size={14} /> },
    { name: "bathroom", label: "Baths", icon: <Bath size={14} /> },
    { name: "floor", label: "Floor", icon: <Barcode size={14} /> },
    { name: "state", label: "Location", icon: <MapPin size={14} /> },
    { name: "aminities", label: "Amenities", icon: <Wrench size={14} /> },
  ];

  const [filters, setFilters] = useState({
    listingtype: "For Rent", 
    propertyListingType: "property",
    city: "",
    propertytype: "",
    price: "",
    squarefoot: "",
    bedroom: "",
    bathroom: "",
    floor: "",
    state: "",
    aminities: ""
  });

  // Fetching Data
  const { propertyList = [], loading } = useGetAllProperty(1, 20, filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. DUAL WHATSAPP LOGIC ---
  const handleWhatsAppAction = (e, property) => {
    e.stopPropagation();

    const emiratesNo = "971585852283";
    const agentNo = property.agentId?.phone?.replace(/\s+/g, '') || "971500000000";
    const agentName = property.agentId?.name || "the Agent";
    
    const propDetails = `*Property:* ${property.propertyname}\n*Price:* AED ${Number(property.price).toLocaleString()}\n*Location:* ${property.city}\n*Ref:* ${property._id}`;
    const agentDetails = `*Agent:* ${agentName}\n*Contact:* ${property.agentId?.phone}`;

    // Message 1: Emirates Management
    const msgToEmirates = encodeURIComponent(
      `*Rental Inquiry Alert*\n\n--- PROPERTY ---\n${propDetails}\n\n--- ASSIGNED AGENT ---\n${agentDetails}`
    );

    // Message 2: Specific Agent
    const msgToAgent = encodeURIComponent(
      `Hello ${agentName}, I am interested in renting: ${property.propertyname}.\n\nReference: ${property._id}`
    );

    // Trigger Step 1
    window.open(`https://wa.me/${emiratesNo}?text=${msgToEmirates}`, "_blank");

    // Trigger Step 2 (Optional/Delayed)
    setTimeout(() => {
      if (window.confirm(`Management notified. Send direct message to agent ${agentName}?`)) {
        window.open(`https://wa.me/${agentNo}?text=${msgToAgent}`, "_blank");
      }
    }, 1000);
  };

  const handleCall = (e, phone) => {
    e.stopPropagation();
    window.location.href = `tel:${phone || "+971585852283"}`;
  };

  const handleMail = (e, property) => {
    e.stopPropagation();
    window.location.href = `mailto:info@homoget.ae?subject=Rental Inquiry: ${property.propertyname}`;
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Luxury Rental" />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/60'}`} />
        </div>
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500 text-black mb-8 shadow-xl">
              <Crown size={14} />
              <span className="text-[10px] font-serif tracking-widest uppercase">Premium Acquisition</span>
            </div>
            
            <h1 className={`text-4xl md:text-6xl leading-[0.8] font-serif tracking-tighter mb-8 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Rent <br />
              <span className="text-amber-500 font-serif italic font-light">Collection</span>
            </h1>

            <p className={`max-w-2xl text-lg md:text-xl font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              The most prestigious Rental Properties in the real estate market. 
              We curate high-yield residential and commercial Rental properties.
            </p>
          </motion.div>
        </div>
      </section>


      
      {/* --- FILTERS --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-13 relative z-30">
        <div className={`w-full p-8 rounded-[3rem] border shadow-2xl backdrop-blur-xl ${isDark ? 'bg-neutral-900/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filterFields.map((field) => (
              <div key={field.name} className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">{field.icon}</div>
                <select
                  name={field.name} value={filters[field.name]} onChange={handleFilterChange}
                  className={`w-full pl-10 pr-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none outline-none border cursor-pointer transition-all ${isDark ? 'bg-black/50 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-100 text-black focus:border-amber-500'}`}
                >
                  <option value="">{field.label}</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                </select>
                <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            ))}
            <button className="bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl py-4 hover:bg-amber-400 transition-all shadow-lg">
              Apply All
            </button>
          </div>
        </div>
      </div>

      {/* --- LISTINGS GRID --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24">
        {loading && <div className="text-center py-20 text-amber-500 font-black animate-pulse">CONNECTING TO DATABASE...</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {!loading && propertyList.map((property) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`group rounded-[3rem] overflow-hidden border transition-all duration-500 ${isDark ? 'bg-neutral-950 border-white/5' : 'bg-white border-slate-200'}`}
            >
              <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => navigate(`/property/${property._id}`)}>
                <img src={property.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase border border-white/20">{property.city}</div>
              </div>

              <div className="p-10">
                <div className="flex justify-between items-start mb-4">
                  <h4 className={`text-2xl font-black truncate max-w-[60%] ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.propertyname}</h4>
                  <div className="text-amber-500 text-right">
                    <p className="text-xl font-black">AED {Number(property.price).toLocaleString()}</p>
                    <p className="text-[8px] font-bold uppercase opacity-50">/ Year</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/5 mb-8">
                  <div className="flex items-center gap-2">
                    <Bed className="text-amber-500" size={16}/>
                    <span className="text-[10px] font-black text-slate-500 uppercase">{property.bedroom} Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="text-amber-500" size={16}/>
                    <span className="text-[10px] font-black text-slate-500 uppercase">{property.squarefoot} Sqft</span>
                  </div>
                </div>

                {/* --- QUICK CONNECT BAR (DESIGN REQUEST) --- */}
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-white/5">
                  <div className="flex gap-4">
                    <button
                      onClick={(e) => handleWhatsAppAction(e, property)}
                      className="text-green-500 hover:scale-125 transition-transform"
                    >
                      <FaWhatsapp size={20} />
                    </button>
                    <button
                      onClick={(e) => handleCall(e, property.agentId?.phone)}
                      className="text-amber-500 hover:scale-125 transition-transform"
                    >
                      <Phone size={18} />
                    </button>
                    <button
                      onClick={(e) => handleMail(e, property)}
                      className="text-blue-500 hover:scale-125 transition-transform"
                    >
                      <Mail size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <Share2 size={18} className="text-gray-400 hover:text-amber-500 cursor-pointer transition-colors" />
                    <Heart size={18} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rent;