import { useEffect, useState } from "react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Bed,
  Ruler,
  Bath,
  Phone,
  Mail,
  ArrowUpRight,
  Search,
  ArrowRight,
  Share2,
  Heart,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const AgentPropertyList = () => {
  const [latestProperty, setLatestProperty] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await http.get("/getlatestproperty");
        if (res.data.success) {
          setLatestProperty(res.data.data);
          setFilteredProperties(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = latestProperty;
    if (activeFilter !== "All") {
      result = result.filter(
        (p) =>
          p.listingtype === activeFilter ||
          p.propertyListingType === activeFilter.toLowerCase(),
      );
    }
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.propertyname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredProperties(result);
  }, [activeFilter, searchQuery, latestProperty]);

  // --- DUAL WHATSAPP LOGIC ---
  const handleWhatsAppAction = (e, property) => {
    e.stopPropagation();

    const emiratesNo = "971585852283";
    const agentNo =
      property.agentId?.phone?.replace(/\s+/g, "") || "971500000000";
    const agentName = property.agentId?.name || "N/A";

    const propDetails = `*Property:* ${property.propertyname}\n*Price:* ${property.currency} ${Number(property.price).toLocaleString()}\n*Location:* ${property.city}\n*Ref:* ${property._id}`;
    const agentDetails = `*Agent:* ${agentName}\n*Agent Contact:* ${property.agentId?.phone}`;

    // 1. Message for Emirates Management
    const msgToEmirates = encodeURIComponent(
      `*New Inquiry via Website*\n\n--- PROPERTY ---\n${propDetails}\n\n--- ASSIGNED AGENT ---\n${agentDetails}`,
    );

    // 2. Message for the Agent
    const msgToAgent = encodeURIComponent(
      `*Hello ${agentName},*\nI am interested in your listing:\n${propDetails}\nPlease provide more information.`,
    );

    // Step 1: Open Emirates Management Chat
    window.open(`https://wa.me/${emiratesNo}?text=${msgToEmirates}`, "_blank");

    // Step 2: Open Agent Chat after confirmation (to prevent browser blocking)
    setTimeout(() => {
      const notifyAgent = window.confirm(
        "Inquiry sent to Management. Would you like to notify Agent " +
          agentName +
          " directly as well?",
      );
      if (notifyAgent) {
        window.open(`https://wa.me/${agentNo}?text=${msgToAgent}`, "_blank");
      }
    }, 1000);
  };

  const handleCall = (e, phone) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleMail = (e, property) => {
    e.stopPropagation();
    const subject = encodeURIComponent(`Inquiry: ${property.propertyname}`);
    window.location.href = `mailto:info@homoget.ae?subject=${subject}`;
  };

  if (loading) return null;

  const cardBg = isDark
    ? "bg-[#11141B] border-white/5"
    : "bg-white border-slate-100 shadow-sm";

  return (
    <section
      className={`py-16 px-6 ${isDark ? "bg-[#0a0a0c]" : "bg-slate-50"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
            <h2
              className={`text-2xl md:text-4xl font-serif ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Latest <span className="text-amber-500 italic">Properties</span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/propertylisting")}
            className="px-8 py-3 bg-amber-500 text-white rounded-full text-xs font-bold flex items-center gap-3 hover:bg-black transition-all shadow-lg"
          >
            View All Properties <ArrowRight size={16} />
          </button>
        </div>

        {/* --- PROPERTY GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, idx) => (
              <motion.div
                layout
                key={property._id || idx}
                className={`group rounded-[2.5rem] border overflow-hidden transition-all hover:shadow-2xl ${cardBg} cursor-pointer`}
                onClick={() =>
                  navigate(`/property/${property._id}`, {
                    state: { propertyData: property },
                  })
                }
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={property.image?.[0]}
                    alt={property.propertyname}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute top-5 left-5 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-amber-500 text-[9px] font-black uppercase rounded-lg border border-amber-500/30">
                      {property.propertytype}
                    </span>
                    <span className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black uppercase rounded-lg shadow-lg">
                      {property.listingtype}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={12} className="text-amber-500 shrink-0" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">
                      {property.city}, UAE
                    </p>
                  </div>

                  <h3
                    className={`text-xl font-bold leading-tight mb-4 group-hover:text-amber-500 transition-colors truncate ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {property.propertyname}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-500/10 mb-6">
                    <div className="text-center border-r border-slate-500/10">
                      <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">
                        Beds
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Bed size={12} className="text-amber-500" />
                        <span
                          className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          {property.bedroom || "S"}
                        </span>
                      </div>
                    </div>
                    <div className="text-center border-r border-slate-500/10">
                      <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">
                        Baths
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Bath size={12} className="text-amber-500" />
                        <span
                          className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          {property.bathroom || 0}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">
                        Area
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Ruler size={12} className="text-amber-500" />
                        <span
                          className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          {property.squarefoot}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-tighter mb-0.5">
                        Premium Listing Price
                      </p>
                      <p className="text-2xl font-black text-amber-500 tracking-tighter">
                        <span className="text-[10px] mr-1">
                          {property.currency}
                        </span>
                        {Number(property.price).toLocaleString()}
                      </p>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all duration-500">
                      <ArrowUpRight size={24} />
                    </button>
                  </div>

                  {/* Quick Connect Bar - FIXED VISIBILITY (Removed translate-y classes) */}
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-white/5">
                    <div className="flex gap-4">
                      <button
                        onClick={(e) => handleWhatsAppAction(e, property)}
                        className="text-green-500 hover:scale-110 transition-transform"
                      >
                        <FaWhatsapp size={16} />
                      </button>
                      <button
                        onClick={(e) => handleCall(e, property.agentId?.phone)}
                        className="text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Phone size={16} />
                      </button>
                      <button
                        onClick={(e) => handleMail(e, property)}
                        className="text-blue-500 hover:scale-110 transition-transform"
                      >
                        <Mail size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <Share2
                        size={18}
                        className="text-gray-400 hover:text-amber-500 transition-colors"
                      />
                      <Heart
                        size={18}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- NO RESULTS --- */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-slate-500/20 rounded-[3rem]">
            <Search
              size={48}
              className="mx-auto text-slate-500 mb-4 opacity-20"
            />
            <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">
              No matching assets found
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgentPropertyList;
