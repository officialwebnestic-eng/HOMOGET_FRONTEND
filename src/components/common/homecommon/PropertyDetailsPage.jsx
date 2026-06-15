import React, { useEffect, useState, useRef,useCallback  } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  ArrowLeft,
  Navigation,
  CalendarCheck,
  FileText,
  MoveUpRight,
  ShieldCheck,
  Loader2,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  Bed,
  Bath,
  Ruler,
  Building,
  Crown,
  Sparkles,
  Briefcase,
  Home,
  Clock,
  Calendar,
  User,
  Star,
  Heart,
  Share2,
  PlayCircle,
  Video,
  Filter,
  Grid3x3,
  LayoutList ,
  BadgeCheck,
  CheckCircle2 ,
  Eye,
  Fingerprint,
  Award,
  Camera
   
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";
import AmenitiesSection from "../../common/homecommon/AmenitiesSection.jsx";
import NearbyLocations from "../../../helpers/NearbyLocations.jsx";
import { http } from "../../../axios/axios";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation as SwiperNav } from "swiper/modules";
import PropertyCard from "../homecommon/PropertyCard.jsx";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import GeospatialMap from "../../../helpers/GeospatialMap.jsx";
import RelatedAssets from "../RelatedAssets .jsx";
import FilterSidebar from "../../common/FilterSidebar.jsx"
 import SortBar from "../homecommon/SortBar .jsx"
  import LocationSearch from "../../../components/admin/Property/LocationSearch.jsx"
import ShareModal from "../../../model/ShareModal.jsx";
import CurrencyDisplay from "./CurrencyDisplay.jsx";

// Helper functions for property type detection
const isOffPlan = (property) => {
  return property?.category === "Off-Plan" || property?.propertyListingType === "project";
};

const isCommercial = (property) => {
  return property?.category === "Commercial";
};

const isRent = (property) => {
  return property?.offeringType === "Rent";
};

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const lastIdRef = useRef(null);
   const [relatedProperties, setRelatedProperties] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
    // Filter states for related properties
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedLocation, setSelectedLocation] = useState(null);
const [showShareModal, setShowShareModal] = useState(false);
    const [filters, setFilters] = useState({
      category: "",
      offeringType: "",
      propertytype: "",
      minPrice: "",
      maxPrice: "",
    });
    
const [showImageGallery, setShowImageGallery] = useState(false);
const [galleryStartIndex, setGalleryStartIndex] = useState(0);
const [galleryViewMode, setGalleryViewMode] = useState('grid'); // 'grid' or 'slider'


const openGallery = (startIndex) => {
  setGalleryStartIndex(startIndex);
  setGalleryViewMode('grid'); // Start with grid view
  setShowImageGallery(true);
};

// Add this function to handle image click in grid
const handleImageClick = (index) => {
  setGalleryStartIndex(index);
  setGalleryViewMode('slider'); // Switch to slider view
};
  

  const [property, setProperty] = useState(
    location.state?.propertyData || null,
  );
  const [loading, setLoading] = useState(!location.state?.propertyData);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (
        property &&
        property._id === id &&
        typeof property.agentId === "object"
      ) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await http.get(`/getpropertybyid/${id}`);
        if (response.data.success) {
          setProperty(response.data.data);
        }

      } catch (error) {
        toast.error("Error synchronizing asset data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      if (lastIdRef.current !== id) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        lastIdRef.current = id;
      }
      fetchProperty();
    }
  }, [id]);





  const fetchRelatedProperties = useCallback(async () => {
    if (!property) return;
    
    setRelatedLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("category", property.category);
      params.append("offeringType", property.offeringType);
      params.append("limit", 20);
      params.append("excludeId", property._id);
      
      if (filters.propertytype) params.append("propertytype", filters.propertytype);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (sortBy === "price_low") params.append("sort", "price_asc");
      if (sortBy === "price_high") params.append("sort", "price_desc");
      if (sortBy === "newest") params.append("sort", "newest");
      if (selectedLocation?.name) params.append("locationName", selectedLocation.name);
      
      const response = await http.get(`/related?${params.toString()}`);
      if (response.data.success) {
        setRelatedProperties(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching related properties:", error);
    } finally {
      setRelatedLoading(false);
    }
  }, [property, filters, sortBy, selectedLocation]);

  useEffect(() => {
    if (property) {
      fetchRelatedProperties();
    }
  }, [property, fetchRelatedProperties]);
  // Format price function
  const formatPrice = (price, unit) => {
    const num = Number(price);
    if (isNaN(num)) return "On Request";
    return `AED ${num.toLocaleString()} ${unit && unit !== "Total Amount" ? `/ ${unit}` : ""}`;
  };

  // Handle WhatsApp
const handleWhatsApp = () => {
  const managementNo = "971585852283";
  const agentNo = property?.agentId?.phone?.replace(/\s+/g, "") || "971500000000";
  const propertyTitle = property?.propertyTitleEn || property?.propertyname || "Property";
  const price = property?.price ? `AED ${Number(property.price).toLocaleString()}` : "Contact for price";
  const pricePeriod = isRent(property) && property?.rentedPeriod 
    ? `/${property?.rentedPeriod?.toLowerCase().replace("per ", "") || "year"}` 
    : "";
  const location = property?.community || property?.city || property?.locationName || "Dubai";
  const area = property?.squarefoot ? `${property.squarefoot.toLocaleString()} sqft` : "N/A";
  const bedroom = property?.bedroom || 0;
  const bathroom = property?.bathroom || 0;
  const propertyType = property?.propertytype || property?.category || "Property";
  const referenceNo = property?.refrenceNo || property?._id?.slice(-8) || "N/A";
  const propertyUrl = `${window.location.origin}/property/${property?._id}`;
  
  const msg = encodeURIComponent(
    `🏢 *Property Inquiry - Homoget*\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🏠 *PROPERTY DETAILS*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `• Title: ${propertyTitle}\n` +
    `• Reference: ${referenceNo}\n` +
    `• Type: ${propertyType}\n` +
    `• Price: ${price}${pricePeriod}\n` +
    `• Location: ${location}\n` +
    `• Bedrooms: ${bedroom}\n` +
    `• Bathrooms: ${bathroom}\n` +
    `• Area: ${area}\n` +
    `• Link: ${propertyUrl}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *CLIENT MESSAGE*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `I'm interested in this property and would like to schedule a viewing.\n\n` +
    `Please contact me with more details and availability.\n\n` +
    `Best regards`
  );
  
  // Send to management first
  window.open(`https://wa.me/${managementNo}?text=${msg}`, "_blank");
  
  // Send to agent after 1 second
  setTimeout(() => {
    window.open(`https://wa.me/${agentNo}?text=${msg}`, "_blank");
  }, 1000);
};
  // Handle Call
  const handleCall = () => {
    if (property?.agentId?.phone) {
      window.location.href = `tel:${property.agentId.phone}`;
    }
  };


const handleEmail = () => {
  const propertyTitle = property?.propertyTitleEn || property?.propertyname || 'Property';
  const price = property?.price ? `AED ${property.price.toLocaleString()}` : 'Contact for price';
  const location = property?.city || property?.community || property?.locationName || 'Dubai';
  const bedroom = property?.bedroom || 0;
  const bathroom = property?.bathroom || 0;
  const area = property?.squarefoot ? `${property.squarefoot.toLocaleString()} sqft` : 'N/A';
  const propertyType = property?.propertytype || property?.category || 'Property';
  const referenceNo = property?.refrenceNo || property?._id?.slice(-8) || 'N/A';
  const propertyUrl = `${window.location.origin}/property/${property?._id}`;
  
  const subject = encodeURIComponent(`Inquiry: ${propertyTitle}`);
  
  const body = encodeURIComponent(
    `Hello ${agent?.name || 'Agent'},%0A%0A` +
    `I'm interested in the following property and would like more information:%0A%0A` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
    `🏠 PROPERTY DETAILS%0A` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
    `• Title: ${propertyTitle}%0A` +
    `• Reference: ${referenceNo}%0A` +
    `• Type: ${propertyType}%0A` +
    `• Price: ${price}%0A` +
    `• Location: ${location}%0A` +
    `• Bedrooms: ${bedroom}%0A` +
    `• Bathrooms: ${bathroom}%0A` +
    `• Area: ${area}%0A` +
    `• Link: ${propertyUrl}%0A%0A` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
    `👤 MY CONTACT DETAILS%0A` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
    `Please contact me to schedule a viewing or for more information.%0A%0A` +
    `Best regards,%0A` +
    `[Your Name]%0A` +
    `[Your Phone Number]`
  );
  
  window.location.href = `mailto:${agent?.email}?subject=${subject}&body=${body}`;
};
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-[#050505]" : "bg-white"}`}>
        <Loader2 className="animate-spin text-amber-500" size={30} />
      </div>
    );
  }

    const isQRValid = property.dldExpiryDate ? new Date(property.dldExpiryDate) > new Date() : false;


  

  if (!property) return null;

  const propertyTitle = property.propertyTitleEn || property.propertyname;
  const locationName = property.community || property.city || "Dubai";
  const agentName = property.agentId?.name || "Property Consultant";
  const agentImage = property.agentId?.profileImage || property.agentId?.profilePhoto;
  const images = property.image || [];
  const videos = property.videos || property.videoTourLink;
  const virtualTour = property.virtualTour360;
  const isOffPlanProperty = isOffPlan(property);
  const isCommercialProperty = isCommercial(property);
  const isRentalProperty = isRent(property);
  const isDark = theme === "dark";


   // Handle location select for filtering
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setFilters(prev => ({ ...prev, locationName: location.name }));
  };

  // Get status badge
  const getStatusBadge = () => {
    if (isOffPlanProperty) {
      return { text: "OFF-PLAN", icon: <Calendar size={12} />, color: "bg-purple-500" };
    }
    if (isRentalProperty) {
      return { text: "FOR RENT", icon: <Clock size={12} />, color: "bg-blue-500" };
    }
    return { text: "FOR SALE", icon: <Sparkles size={12} />, color: "bg-amber-500" };
  };


  // Combine all media items
  const mediaItems = [
    ...images.map(img => ({ type: 'image', url: img })),
    ...(videos ? [{ type: 'video', url: videos }] : []),
    ...(virtualTour ? [{ type: '360', url: virtualTour }] : [])
  ];

  const statusBadge = getStatusBadge();
  const handleSlideTo = (swiperInstance, index) => {
  if (swiperInstance) {
    swiperInstance.autoplay.stop(); // Stops the autoplay loop
    swiperInstance.slideTo(index);  // Shifts directly to your image index
  }
};

const [controlledSwiper, setControlledSwiper] = useState(null);
  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-white text-black"}`}>

      {/* 1. ARCHITECTURAL HERO (with Swiper Gallery) */}

{/* 1. HERO SECTION - Two Column Grid Layout */}
{/* 1. HERO SECTION - Two Column Grid Layout (Fixed - No Duplicate Images) */}
<section className="relative w-full">
  <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[50vh] lg:h-[75vh] gap-2 p-2 bg-black/5 dark:bg-zinc-900/20">
    
    {/* Left Column - Main Image Slider (3/5 width) */}
    <div className="lg:col-span-3 relative h-[45vh] lg:h-full overflow-hidden rounded-xl bg-zinc-900 shadow-inner">
      {images.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, SwiperNav]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="h-full w-full"
          onSwiper={(swiper) => {
            window.heroSwiper = swiper;
          }}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div 
                className="relative w-full h-full cursor-pointer"
                onClick={() => openGallery(idx)}
              >
                <img 
                  src={img} 
                  className="w-full h-full object-cover" 
                  alt={`${propertyTitle} - Image ${idx + 1}`} 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <Building size={64} className="text-white/20" />
        </div>
      )}
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-[10px] font-medium text-white/80 hover:text-amber-500 transition-all bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <ArrowLeft size={14} /> Back
      </button>
      
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-20">
        <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusBadge.color} text-white shadow-lg`}>
          {statusBadge.icon} {statusBadge.text}
        </span>
      </div>
    </div>

    {/* Right Column - Small Image Grid (2/5 width) - FIXED: Start from index 1 to avoid duplicate */}
    <div className="lg:col-span-2 h-[35vh] lg:h-full">
      <div className="grid grid-cols-2 gap-2 h-full content-stretch">
        {[...Array(4)].map((_, idx) => {
          // ✅ FIX: Start from index 1 instead of 0 to avoid duplicate with main slider
          const targetImageIndex = idx + 1;
          const hasImage = images[targetImageIndex];
          const isLastSlot = idx === 3;
          const hasMoreImages = images.length > 5; // Changed to 5 because we start from index 1

          // Case 1: Slot has a valid thumbnail image
          if (hasImage && !(isLastSlot && hasMoreImages)) {
            return (
              <div 
                key={idx} 
                onClick={() => {
                  if (window.heroSwiper) {
                    window.heroSwiper.autoplay.stop();
                    window.heroSwiper.slideTo(targetImageIndex);
                  }
                }}
                className="relative h-full overflow-hidden rounded-lg cursor-pointer group bg-zinc-800 min-h-[60px]"
              >
                <img 
                  src={hasImage} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={`Thumbnail preview ${targetImageIndex + 1}`} 
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            );
          }

          // Case 2: Last slot with remaining extra overflow images (MORE BUTTON)
          if (isLastSlot && hasMoreImages) {
            return (
              <div 
                key={idx}
                onClick={() => openGallery(5)}
                className="relative h-full overflow-hidden rounded-lg cursor-pointer group bg-zinc-800 min-h-[60px]"
              >
                <img 
                  src={images[5] || images[4]} 
                  className="w-full h-full object-cover filter blur-[2px] brightness-75" 
                  alt="View more compilation preview" 
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-colors group-hover:bg-black/70">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-white text-sm font-bold">+{images.length - 5} more</span>
                </div>
              </div>
            );
          }

          // Case 3: Empty Placeholder layout fallback
          return (
            <div 
              key={`empty-${idx}`} 
              className="h-full rounded-lg bg-gray-200/40 dark:bg-zinc-800/40 flex items-center justify-center border border-dashed border-gray-300 dark:border-zinc-700 min-h-[60px]"
            >
              <Building size={20} className="text-gray-400/50 dark:text-zinc-600" />
            </div>
          );
        })}
      </div>
    </div>

  </div>
</section>

{/* Image Gallery Modal - Grid & Slider Combined */}
{showImageGallery && (
  <div 
    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg"
    onClick={(e) => {
      if (e.target === e.currentTarget) setShowImageGallery(false);
    }}
  >
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (galleryViewMode === 'slider') {
                setGalleryViewMode('grid');
              } else {
                setShowImageGallery(false);
              }
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="text-white font-medium">
            {galleryViewMode === 'slider' ? 'Full Screen View' : `All Images (${images.length})`}
          </span>
        </div>
        
        <button
          onClick={() => setShowImageGallery(false)}
          className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {galleryViewMode === 'grid' ? (
          // Grid View - Show all images in a responsive grid
          <div className="p-4 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleImageClick(idx)}
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group bg-zinc-800"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={`${propertyTitle} - ${idx + 1}`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                    {idx + 1}/{images.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Slider View - Full screen slideshow
          <div className="relative w-full h-full">
            <Swiper
              modules={[Autoplay, Pagination, SwiperNav]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              initialSlide={galleryStartIndex}
              className="h-full w-full"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="flex items-center justify-center h-full p-8">
                    <img 
                      src={img} 
                      className="max-w-full max-h-full object-contain" 
                      alt={`${propertyTitle} - Image ${idx + 1}`} 
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Image Counter in Slider View */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm z-10">
              {galleryStartIndex + 1} / {images.length}
            </div>
            
            {/* Back to Grid Button in Slider View */}
            <button
              onClick={() => setGalleryViewMode('grid')}
              className="absolute top-20 left-4 z-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm flex items-center gap-2 transition-all"
            >
              <Grid3x3 size={16} />
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}

{/* 2. PERSISTENT TRANSACTION BAR */}
<div className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5">
    
    {/* Main Row - Flex column on mobile, row on tablet+ */}
    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center gap-3 sm:gap-4">
      
      {/* Left Section - Price and Property Type */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full sm:w-auto">
        {/* Price */}
   <CurrencyDisplay 
  price={property.price} 
  period={isRent(property) ? property.rentedPeriod : null}
  currency={property?.currency || "AED"}
  isDark={theme === "dark"}
  priceClassName="text-lg font-black leading-tight"
  periodClassName="text-xs text-gray-400 font-normal"
/>

        {/* Property Type - Hidden on mobile */}
        <div className="hidden sm:block">
          <p className="text-[8px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold mb-0.5">
            Property Type
          </p>
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-200">
            {property.propertytype || "Property"}
          </p>
        </div>
        
        {/* Mobile Property Type - Small badge for mobile */}
        <div className="sm:hidden">
          <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">
            {property.propertytype || "Property"}
          </span>
        </div>
      </div>
      
      {/* Right Section - Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-md shadow-md hover:shadow-lg"
        >
          <FaWhatsapp size={12} smSize={14} className="text-white" />
          <span className="hidden xs:inline">WhatsApp</span>
          <span className="xs:hidden">WhatsApp</span>
        </button>
        
        {/* Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-md shadow-md hover:shadow-lg"
        >
          <Share2 size={12} smSize={14} className="text-white" />
          <span className="hidden xs:inline">Share</span>
          <span className="xs:hidden">Share</span>
        </button>
        
        {/* Booking Button */}
        <button
          onClick={() => navigate(`/bookings/${id}`, { state: { propertyData: property } })}
          className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-black px-3 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-md shadow-lg hover:shadow-xl"
        >
          <CalendarCheck size={12} smSize={14} />
          <span className="hidden sm:inline">Report </span>
          <span className="sm:hidden">Book</span>
        </button>
      </div>
    </div>
    
    {/* Property Specs Bar - Below buttons on mobile, integrated on desktop */}
    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6 md:gap-8">
        {/* Bedrooms */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10">
            <Bed size={14} smSize={16} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Beds</p>
            <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">{property.bedroom || 0}</p>
          </div>
        </div>
        
        {/* Bathrooms */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10">
            <Bath size={14} smSize={16} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Baths</p>
            <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">{property.bathroom || 0}</p>
          </div>
        </div>
        
        {/* Area */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10">
            <Ruler size={14} smSize={16} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Area</p>
            <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">
              {property.squarefoot?.toLocaleString()} <span className="text-xs font-normal">sqft</span>
            </p>
          </div>
        </div>
        
        {/* Additional Info - Reference Number (Optional) */}
        {property.refrenceNo && (
          <div className="hidden md:flex items-center gap-1.5 ml-auto">
            <p className="text-[8px] text-zinc-400 uppercase tracking-wider">Ref No.</p>
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{property.refrenceNo}</p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>


      {/* ===== SECTION 2: GALLERY SECTION (THUMBNAILS BELOW) =====
     {mediaItems.length > 1 && (
  <section className="py-16 px-6 md:px-12 border-b border-gray-200 dark:border-gray-800">
    <div className="max-w-7xl mx-auto">
      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 mb-6 md:mb-10 flex items-center gap-2">
        <div className="w-1 h-8 bg-amber-500"></div>
        Gallery
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
        {mediaItems.map((item, idx) => (
          <div
            key={idx}
            className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group"
            onClick={() => setActiveImageIndex(idx)}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : item.type === 'video' ? (
              <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                <PlayCircle size={48} className="text-amber-500 mb-2" />
                <span className="text-xs text-white">Video Tour</span>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                <Video size={48} className="text-amber-500 mb-2" />
                <span className="text-xs text-white">360 Tour</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
          </div>
        ))}
      </div>
    </div>
  </section>
)} */}

      {/* 3. CORE CONTENT GRID */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-10   md:space-y-16">
{/* Description Section */}
{/* Description Section */}
<section>
  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 mb-6 md:mb-10 flex items-center gap-2">
    <FileText size={12} /> Property Description
  </h3>
  
  <p className="text-sm md:text-xl font-serif max-w-3xl">
    {property.descriptionEn?.length > 200 
      ? `${property.descriptionEn.substring(0, 200)}...` 
      : property.descriptionEn
    }
  </p>
  
  {property.descriptionEn?.length > 200 && (
    <button
      onClick={() => setShowFullDesc(true)}
      className="mt-4 text-amber-500 text-sm font-bold hover:underline flex items-center gap-1"
    >
      Read Full Description <ArrowRight size={12} />
    </button>
  )}
</section>

{/* Ultra Compact Version */}
{showFullDesc && (
  <div 
    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    onClick={(e) => e.target === e.currentTarget && setShowFullDesc(false)}
  >
    <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-xl">
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-zinc-800">
        <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Full Description
        </h3>
        <button onClick={() => setShowFullDesc(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-5 overflow-y-auto max-h-[70vh]">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          {property.descriptionEn}
        </p>
      </div>
      
      {/* Simple Footer */}
      <div className="px-4 py-2.5 bg-gray-50 dark:bg-zinc-800/50 flex justify-end">
        <button onClick={() => setShowFullDesc(false)} className="text-xs text-gray-500 hover:text-gray-700">
          Close
        </button>
      </div>
    </div>
  </div>
)}

   {/* Amenities */}
          {property.amenities?.length > 0 && (
            <section>
              <AmenitiesSection amenities={property.amenities} />
            </section>
          )}
 <GeospatialMap property={property} isDark={true} />
   
          
       

          <NearbyLocations property={property} isDark={isDark} />
          {/* Technical Specs - CONDITIONAL based on property type */}
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 mb-8 md:mb-12 flex items-center gap-2">
              <ShieldCheck size={12} /> Technical Specifications
            </h3>

            {isOffPlanProperty ? (
              // Off-Plan Specific Details
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
                <SpecItem label="Handover Date" value={property.deliveryDate || "Q4 2026"} />
                <SpecItem label="Developer" value={property.developerId?.companyName || "Premium Developer"} />
                <SpecItem label="Owner Name" value={`${property.ownerName || "N/A"}`} />
                <SpecItem label="Completion" value={`${property.completionPercentage || 65}%`} />
                <SpecItem label="Total Area" value={`${property.squarefoot?.toLocaleString()} Sq.Ft`} />
                <SpecItem label="Property Type" value={property.propertytype} />
                <SpecItem label="category" value={property.category} />
                <SpecItem label="offeringType" value={property.offeringType} />
                <SpecItem label="rentedPeriod" value={property.rentedPeriod} />
                <SpecItem label="permitType" value={property.permitType} />
                <SpecItem label="trakheesiNumber" value={property.trakheesiNumber} />
                <SpecItem label="reraORN" value={property.reraORN} />
                <SpecItem label="brnNumber" value={property.brnNumber} />

                <SpecItem label="District" value={property.city} />
              </div>
            ) : isCommercialProperty ? (
              // Commercial Property Specs
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
                <SpecItem label="Property Type" value={property.propertytype || "Commercial Space"} />
                <SpecItem label="Total Area" value={`${property.squarefoot?.toLocaleString()} Sq.Ft`} />
                <SpecItem label="Owner Name" value={`${property.ownerName || "N/A"}`} />


                <SpecItem label="Parking Slots" value={property.parkingSlots || 0} />
                <SpecItem label="Furnishing" value={property.furnishingType || "Unfurnished"} />
                <SpecItem label="District" value={property.city} />
                <SpecItem label="Property Type" value={property.propertytype} />
                <SpecItem label="category" value={property.category} />
                <SpecItem label="offeringType" value={property.offeringType} />
                <SpecItem label="rentedPeriod" value={property.rentedPeriod} />
                <SpecItem label="permitType" value={property.permitType} />
                <SpecItem label="Availability" value={property.availability || "Immediately"} />

              </div>
            ) : (
              // Residential Property Specs
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
                <SpecItem label="Bedrooms" value={property.bedroom || 0} />
                <SpecItem label="Bathrooms" value={property.bathroom || 0} />
                <SpecItem label="Total Area" value={`${property.squarefoot?.toLocaleString()} Sq.Ft`} />
                <SpecItem label="Parking Slots" value={property.parkingSlots || 0} />
                <SpecItem label="Furnishing" value={property.furnishingType || "Unfurnished"} />
                <SpecItem label="Owner Name" value={`${property.ownerName || "N/A"}`} />

                <SpecItem label="Property Type" value={property.propertytype} />
                <SpecItem label="category" value={property.category} />
                <SpecItem label="offeringType" value={property.offeringType} />
                <SpecItem label="rentedPeriod" value={property.rentedPeriod} />
                <SpecItem label="permitType" value={property.permitType} />
                <SpecItem label="District" value={property.city} />
                <SpecItem label="Availability" value={property.availability || "Immediately"} />
              </div>
            )}
          </section>

          {/* Off-Plan Progress Bar */}
          {isOffPlanProperty && property.completionPercentage && (
            <section className="p-6 md:p-8 border border-purple-500/20 bg-purple-500/5 rounded-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 mb-6">Construction Progress</h3>
              <div className="mb-2 flex justify-between text-sm">
                <span>Overall Completion</span>
                <span className="text-purple-500 font-bold">{property.completionPercentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${property.completionPercentage}%` }} />
              </div>
              {property.paymentPlan && (
                <p className="mt-4 text-sm text-purple-400">{property.paymentPlan}</p>
              )}
            </section>
          )}

          {/* Rental Payment Terms */}
          {isRentalProperty && property.cheques && (
            <section className="p-2 md:p-4 border border-blue-500/20 bg-blue-500/5 rounded-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-6">Payment Terms</h3>
              <div className="grid grid-cols-2 gap-6">
                <SpecItem label="Number of Cheques" value={`${property.cheques} Cheques`} />
                <SpecItem label="Rented Period" value={property.rentedPeriod || "Per Year"} />
                <SpecItem label="Property Type" value={property.propertytype} />
                <SpecItem label="category" value={property.category} />
                <SpecItem label="offeringType" value={property.offeringType} />
                <SpecItem label="rentedPeriod" value={property.rentedPeriod} />
                <SpecItem label="permitType" value={property.permitType} />

              </div>



            </section>
          )}



          {/* DLD QR CODE SECTION - Prominent Display */}
{/* DLD QR & Regulatory Information Section - Two Column Layout */}
<div className={`p-6 rounded-2xl ${isDark ? "bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30" : "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"}`}>
  
  {/* Two Column Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {/* RIGHT COLUMN - Regulatory Information */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={14} className="text-amber-500" />
        <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">Regulatory Info</p>
      </div>

      <div className="space-y-2">
        {/* Reference Number */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-[8px] text-slate-400 uppercase tracking-wider">Reference</span>
          <span className="text-[10px] font-mono font-medium">{property.refrenceNo || property._id?.slice(-8).toUpperCase() || "N/A"}</span>
        </div>

        {/* Listed Date / Days ago */}
        <div className="flex justify-between items-center">
          <span className="text-[8px] text-slate-400 uppercase tracking-wider">Listed</span>
          <span className="text-[10px]">
            {property.createdAt ? `${Math.ceil((new Date() - new Date(property.createdAt)) / (1000 * 60 * 60 * 24))} days ago` : "N/A"}
          </span>
        </div>

    

        {/* Agency Name */}
        <div className="flex justify-between items-center">
          <span className="text-[8px] text-slate-400 uppercase tracking-wider">Agent  Name</span>
          <span className="text-[10px] font-medium truncate max-w-[140px] text-right">
            {property.agentId?.name || "N/A"}
          </span>
        </div>

        {/* Zone / Area */}
        <div className="flex justify-between items-center">
          <span className="text-[8px] text-slate-400 uppercase tracking-wider">Zone Name</span>
          <span className="text-[10px]">{property.zoneName || "N/A"}</span>
        </div>

        {/* Agent License */}
        <div className="flex justify-between items-center pt-1 border-t border-zinc-500/10">
          <span className="text-[8px] text-slate-400 uppercase tracking-wider">Agent License</span>
          <span className="text-[10px] font-mono text-amber-500">{property.agentId?.agentLicense || property.agentId?.reraLicenseNumber || "N/A"}</span>
        </div>
      </div>
    </div>
    
    {/* LEFT COLUMN - QR Code & Trakheesi */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <BadgeCheck size={16} className="text-green-500" />
        <p className="text-[10px] font-black uppercase tracking-widest text-green-600">DLD Verified</p>
        {property.dldExpiryDate && (
          <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold ml-auto ${isQRValid ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
            {isQRValid ? "Active" : "Expired"}
          </div>
        )}
      </div>

      {/* QR Code */}
      <div className="flex justify-center py-2">
        {property.dldQRCode ? (
          <div className="relative group">
            <div className={`w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-2 ${isQRValid ? "border-green-500" : "border-red-500/50"}`}>
              <img 
                src={property.dldQRCode} 
                alt="DLD QR Code" 
                className="w-full h-full object-cover"
                onClick={() => window.open(property.dldQRCode, '_blank')}
              />
            </div>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center border-2 border-dashed">
            <QrCode size={28} className="text-gray-400" />
            <p className="text-[7px] text-gray-500 mt-1">No QR</p>
          </div>
        )}
      </div>

      {/* Trakheesi / Permit Number */}
      <div className="flex justify-between items-center pt-2 mt-2 border-t border-green-500/20">
        <span className="text-[8px] text-slate-400 uppercase tracking-wider">DLD PERMIT No.</span>
        <span className="text-[10px] font-mono font-medium">{property.trakheesiNumber || "N/A"}</span>
      </div>

    
    </div>

 

  </div>
</div>




        </div>




       {/* RIGHT COLUMN (Agent Sidebar & Compliance) */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">

            {/* Agent Card */}
          <div className={`p-2 rounded-2xl ${isDark ? "bg-zinc-900/50 border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-6">
    Representative
  </h4>
  <div className="flex items-center gap-3 mb-3">
    <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
      {agentImage ? (
        <img src={agentImage} className="w-full h-full object-cover" alt={agentName} />
      ) : (
        agentName.charAt(0).toUpperCase()
      )}
    </div>
    <div>
      <p className="text-lg font-bold uppercase tracking-tight">{agentName}</p>
      <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">
        Luxury Property Specialist
      </p>
      <div className="flex items-center gap-1 mt-1">
        <Star size={12} className="text-amber-500 fill-amber-500" />
        <span className="text-xs">4.9 (128 reviews)</span>
      </div>
    </div>
  </div>

  <div className=" pt-4 border-t border-zinc-500/10">
    {/* Phone */}
    <button onClick={handleCall} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors">
      <Phone size={14} className="text-amber-500" />
      <span className="text-sm">{property.agentId?.phone || "Contact Available"}</span>
    </button>
    
    {/* Email */}
    <button onClick={handleEmail} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors">
      <Mail size={14} className="text-amber-500" />
      <span className="text-sm">{property.agentId?.email || "Email Available"}</span>
    </button>
    
    {/* City/Location */}
    <div className="flex items-center gap-3 p-3">
      <Globe size={14} className="text-amber-500" />
      <span className="text-sm">{property.agentId?.address || "Dubai"}, UAE</span>
    </div>
    
 
    
    {/* RERA License Number (BRN Number) */}
    <div className="flex items-center gap-3 p-3">
      <BadgeCheck size={14} className="text-amber-500" />
      <div className="flex flex-col">
        <span className="text-[8px] text-slate-400 uppercase tracking-wider">RERA License / BRN</span>
        <span className="text-sm font-mono font-medium">{property.agentId?.reraLicenseNumber || property.brnNumber || "N/A"}</span>
      </div>
    </div>
    
    {/* Language Spoken */}
    <div className="flex items-center gap-3 p-3">
      <Globe size={14} className="text-amber-500" />
      <div className="flex flex-col">
        <span className="text-[8px] text-slate-400 uppercase tracking-wider">Languages</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {property.agentId?.languages && property.agentId.languages.length > 0 ? (
            property.agentId.languages.map((lang, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                {lang}
              </span>
            ))
          ) : (
            <span className="text-sm">English, Arabic</span>
          )}
        </div>
      </div>
    </div>
  </div>

 <div className="mt-6 flex gap-3">
  <button onClick={handleWhatsApp} className="flex-1 flex items-center justify-center gap-2 py-3  bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all">
    <FaWhatsapp size={16} /> WhatsApp
  </button>
  <button onClick={handleCall} className="flex-1 py-3  bg-amber-500 text-black text-sm font-bold hover:bg-amber-600 transition-all">
    Call Now
  </button>
  <button onClick={handleEmail} className="flex-1 flex items-center justify-center gap-2 py-3  bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all">
    <Mail size={16} /> Email
  </button>
</div>
</div>

        

            {/* Off-Plan Details Section (if applicable) */}
            {property.category === "Off-Plan" && (
              <div className={`p-6 rounded-2xl ${isDark ? "bg-zinc-900/50 border border-white/10" : "bg-gray-50 border border-gray-200"}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Building size={14} className="text-purple-500" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-purple-500">Off-Plan Details</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-500/10">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">Off-Plan Type</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-500">
                      {property.offPlanType || "Direct"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-500/10">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">Delivery Date</span>
                    <span className="text-xs font-mono">{property.deliveryDate ? new Date(property.deliveryDate).toLocaleDateString() : "N/A"}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-500/10">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">Completion</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${property.completionPercentage || 0}%` }} />
                      </div>
                      <span className="text-xs font-bold">{property.completionPercentage || 0}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">Payment Plan</span>
                    <span className="text-xs font-mono">{property.paymentPlan || "Standard"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Note */}
            <div className={`p-4 rounded-xl ${isDark ? "bg-amber-500/5 border border-amber-500/20" : "bg-amber-50 border border-amber-100"}`}>
              <div className="flex items-start gap-2">
                <Award size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-[9px] text-slate-500 leading-relaxed">
                  All legal documentation for this property has been verified and pre-screened by the Homoget compliance team.
                </p>
              </div>
            </div>

          </div>
        </aside>
      </main>

            



      
    {/* RELATED PROPERTIES SECTION with Filters */}
        <section className={`py-16 px-6 md:px-12 ${isDark ? "bg-black/40" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto">
            {/* Header with Filters */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 flex items-center gap-2">
                  <div className="w-1 h-8 bg-amber-500"></div>
                  Similar Properties You Might Like
                </h3>
                <p className="text-sm opacity-60 mt-2">
                  {relatedProperties.length} properties available
                </p>
              </div>
              
              {/* Location Search */}
              <div className="w-full md:w-80">
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  initialValue=""
                  isDark={isDark}
                  required={false}
                />
              </div>
              
              {/* Sort and View Options */}
              <div className="flex items-center gap-3">
                <SortBar sortBy={sortBy} setSortBy={setSortBy} isDark={isDark} />
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-xl transition-all ${showFilters ? "bg-amber-500 text-black" : isDark ? "bg-white/10 text-white" : "bg-gray-200 text-black"}`}
                >
                  <Filter size={18} />
                </button>
                
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-amber-500 text-black" : isDark ? "bg-white/10 text-white" : "bg-gray-200 text-black"}`}
                >
                  <Grid3x3 size={18} />
                </button>
                
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-amber-500 text-black" : isDark ? "bg-white/10 text-white" : "bg-gray-200 text-black"}`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
            </div>
  
            {/* Filter Sidebar */}
            <FilterSidebar
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              filters={filters}
              onFilterChange={setFilters}
              isDark={isDark}
            />
  
            {/* Related Properties Grid */}
            {relatedLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-amber-500" size={40} />
              </div>
            ) : relatedProperties.length > 0 ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {relatedProperties.map((prop) => (
                  <PropertyCard
                    key={prop._id}
                    property={prop}
                    onClick={() => navigateToProperty(prop._id)}
                    viewMode={viewMode}
                    isDark={isDark}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 rounded-2xl ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                <Building size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No similar properties found</p>
                <p className="text-sm opacity-60 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </section>
        {showShareModal && (
  <ShareModal 
    property={property} 
    onClose={() => setShowShareModal(false)} 
    isDark={isDark} 
  />
)}
    </div>

    
  );
};
const SpecItem = ({ label, value }) => {
  if (!value && value !== 0) return null;

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {label}
      </p>
      <p className="text-base md:text-xl font-serif tracking-tighter ">
        {value}
      </p>
    </div>

    
  );
};

export default PropertyDetailsPage;