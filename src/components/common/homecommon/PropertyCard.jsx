// components/PropertyCard.jsx
import {
  Ruler,
  Bed,
  Bath,
  MapPin,
  IndianRupee,
  Home,
  Building2,
  Barcode,
  Wrench,
  Calendar,
  Clock,
  Sparkles,
  Crown,
  Briefcase,
  Heart,
  Share2,
  Phone,
  Mail,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const PropertyCard = ({ property }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Helper functions
  const isOffPlan = () => property?.category === "Off-Plan";
  const isCommercial = () => property?.category === "Commercial";
  const isRent = () => property?.offeringType === "Rent";

  const formatPrice = (price) => {
    if (!price) return "AED 0";
    return `AED ${Number(price).toLocaleString()}`;
  };

  const getStatusBadge = () => {
    if (isOffPlan()) {
      return { text: "OFF-PLAN", icon: <Calendar size={10} />, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
    }
    if (isRent()) {
      return { text: "FOR RENT", icon: <Clock size={10} />, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    }
    return { text: "FOR SALE", icon: <Sparkles size={10} />, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
  };

  const getPropertyTypeIcon = () => {
    if (isOffPlan()) return <Crown size={14} className="text-purple-400" />;
    if (isCommercial()) return <Briefcase size={14} className="text-blue-400" />;
    return <Home size={14} className="text-amber-400" />;
  };

  const getBadgeStyle = () => {
    if (isOffPlan()) return "bg-gradient-to-r from-purple-600 to-pink-600";
    if (isCommercial()) return "bg-gradient-to-r from-blue-600 to-cyan-600";
    return "bg-amber-500";
  };

  const statusBadge = getStatusBadge();
  const propertyTitle = property.propertyTitleEn || property.propertyname;
  const propertyType = property.propertytype || (isCommercial() ? "Commercial Space" : "Residential");
  const location = property.community || property.city || "Dubai";
  const agentName = property.agentId?.name || "Property Consultant";
  const agentImage = property.agentId?.profilePhoto || property.agentId?.profilePhotoUrl;
  const agentRating = property.agentId?.rating || 4.8;

  const handleCardClick = () => {
    navigate(`/property/${property._id}`, {
      state: { propertyData: property }
    });
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `🏢 *Property Inquiry - Homoget*\n\n` +
      `🏠 *Property:* ${propertyTitle}\n` +
      `💰 *Price:* ${formatPrice(property.price)}${isRent() && property.rentedPeriod ? `/${property.rentedPeriod?.toLowerCase().replace("per ", "") || "year"}` : ""}\n` +
      `📍 *Location:* ${location}\n` +
      `📐 *Area:* ${property.squarefoot?.toLocaleString()} sqft\n\n` +
      `I'm interested in this property. Please share more details.`
    );
    window.open(`https://wa.me/${property.agentId?.phone || "971500000000"}?text=${msg}`, "_blank");
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${property.agentId?.phone || "+971500000000"}`;
  };

  const handleEmail = (e) => {
    e.stopPropagation();
    const subject = `Inquiry: ${propertyTitle}`;
    window.location.href = `mailto:${property.agentId?.email || "info@homoget.ae"}?subject=${encodeURIComponent(subject)}`;
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!isWishlisted) {
      if (!wishlist.includes(property._id)) {
        wishlist.push(property._id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
    } else {
      const newWishlist = wishlist.filter(id => id !== property._id);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: propertyTitle,
        text: `Check out this property: ${propertyTitle}`,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`rounded-2xl overflow-hidden ${isDark ? "bg-[#161B26] border border-white/5" : "bg-white border border-slate-100 shadow-lg"} group cursor-pointer transition-all duration-300`}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={property.image?.length > 1}
          className="h-full w-full"
        >
          {property.image?.map((img, index) => (
            <SwiperSlide key={index}>
              <img 
                src={img} 
                alt={`${propertyTitle} - ${index + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Property Type Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1.5 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg tracking-wider flex items-center gap-1.5 ${getBadgeStyle()}`}>
            {getPropertyTypeIcon()}
            {propertyType}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1.5 backdrop-blur-md text-[9px] font-black uppercase rounded-lg border flex items-center gap-1.5 ${statusBadge.color}`}>
            {statusBadge.icon}
            {statusBadge.text}
          </span>
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <MapPin size={12} className="text-amber-400" />
          <span className="text-[10px] font-bold truncate max-w-[150px]">
            {location}, UAE
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5">
        <h3 className={`text-lg font-bold mb-2 truncate ${isDark ? "text-white" : "text-slate-800"}`}>
          {propertyTitle}
        </h3>

        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div>
            <p className="text-amber-500 text-lg font-black leading-tight">
              {formatPrice(property.price)}
              {isRent() && property.rentedPeriod && (
                <span className="text-xs text-gray-400 font-normal ml-1">
                  / {property.rentedPeriod?.toLowerCase().replace("per ", "") || "year"}
                </span>
              )}
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10">
            <p className="text-black dark:text-white text-[9px] font-bold uppercase tracking-wide">
              {property.category || "Residential"}
            </p>
          </div>
        </div>

        {/* Property Specs */}
        {isCommercial() ? (
          <div className="flex items-center gap-4 py-3 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Building2 size={14} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase">{propertyType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Ruler size={12} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase">{property.squarefoot?.toLocaleString() || 0} Sq.Ft</span>
            </div>
          </div>
        ) : isOffPlan() ? (
          <div className="flex items-center gap-4 py-3 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Calendar size={14} className="text-purple-500" />
              <span className="text-[10px] font-bold uppercase">Handover: {property.deliveryDate || "Q4 2026"}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 py-3 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Bed size={14} className="text-amber-500" />
              <span className="text-[10px] font-bold uppercase">{property.bedroom || 0} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Bath size={12} className="text-amber-500" />
              <span className="text-[10px] font-bold uppercase">{property.bathroom || 0} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Ruler size={12} className="text-amber-500" />
              <span className="text-[10px] font-bold uppercase">{property.squarefoot?.toLocaleString() || 0} Sq.Ft</span>
            </div>
          </div>
        )}

        {/* Agent Info Bar */}
        <div className="flex items-center gap-3 py-3 mt-2 border-t border-gray-100 dark:border-white/5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0">
            {agentImage ? (
              <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                {agentName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Listed by</p>
            <p className={`text-[11px] font-bold truncate ${isDark ? "text-white" : "text-slate-700"}`}>{agentName}</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={10} className="text-amber-500 fill-amber-500" />
              ))}
            </div>
            <span className="text-[9px] font-bold">{agentRating}</span>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex gap-3">
            <button
              onClick={handleWhatsApp}
              className="p-2 rounded-lg hover:bg-green-500/10 text-green-500 transition-colors"
              title="WhatsApp Agent"
            >
              <FaWhatsapp size={18} />
            </button>
            <button
              onClick={handleCall}
              className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
              title="Call Agent"
            >
              <Phone size={16} />
            </button>
            <button
              onClick={handleEmail}
              className="p-2 rounded-lg hover:bg-amber-500/10 text-amber-500 transition-colors"
              title="Email Agent"
            >
              <Mail size={16} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-gray-400 hover:text-amber-500 transition-colors"
              title="Share Property"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={handleWishlist}
              className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={16} fill={isWishlisted ? "#ef4444" : "none"} className={isWishlisted ? "text-red-500" : ""} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add missing Star import
import { Star } from "lucide-react";

export default PropertyCard;