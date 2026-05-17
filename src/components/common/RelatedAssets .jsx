// components/RelatedAssets.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bed, Bath, Ruler, ArrowRight, Building, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { http } from "../../axios/axios";

const RelatedAssets = ({ currentProperty, isDark, limit = 3 }) => {
  const navigate = useNavigate();
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProperties = async () => {
      if (!currentProperty) return;
      
      setLoading(true);
      try {
        // Build filters based on current property
        const filters = {};
        
        // Primary filter: Same category (Residential, Commercial, Off-Plan)
        if (currentProperty.category) {
          filters.category = currentProperty.category;
        }
        
        // Secondary filter: Same offering type (Rent/Sale)
        if (currentProperty.offeringType) {
          filters.offeringType = currentProperty.offeringType;
        }
        
        // Tertiary filter: Same city/community
        if (currentProperty.city) {
          filters.city = currentProperty.city;
        }
        
        // For residential: similar bedroom count range
        if (currentProperty.category === "Residential" && currentProperty.bedroom) {
          const bedroom = currentProperty.bedroom;
          filters.bedroom_gte = Math.max(0, bedroom - 1);
          filters.bedroom_lte = bedroom + 1;
        }
        
        // For off-plan: similar developer or handover year
        if (currentProperty.category === "Off-Plan" && currentProperty.developerId) {
          filters.developerId = currentProperty.developerId._id;
        }
        
        // For commercial: similar property type
        if (currentProperty.category === "Commercial" && currentProperty.propertytype) {
          filters.propertytype = currentProperty.propertytype;
        }
        
        // Price range filter (within 30% up or down)
        if (currentProperty.price) {
          const price = currentProperty.price;
          filters.price_gte = Math.max(0, price * 0.7);
          filters.price_lte = price * 1.3;
        }
        
        // Build query string
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', (limit + 1).toString());
        
        Object.keys(filters).forEach(key => {
          if (filters[key] && filters[key] !== "") {
            queryParams.append(key, filters[key]);
          }
        });
        
        const response = await http.get(`/getallproperty?${queryParams}`);
        
        if (response.data.success) {
          // Filter out the current property and limit results
          let filtered = response.data.data.filter(p => p._id !== currentProperty._id);
          filtered = filtered.slice(0, limit);
          setRelatedProperties(filtered);
        }
      } catch (error) {
        console.error("Error fetching related properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProperties();
  }, [currentProperty, limit]);

  const handlePropertyClick = (property) => {
    navigate(`/property/${property._id}`, {
      state: { propertyData: property },
      scroll: true
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatPrice = (price, offeringType, rentedPeriod) => {
    const num = Number(price);
    if (isNaN(num)) return "On Request";
    const formatted = `AED ${num.toLocaleString()}`;
    if (offeringType === "Rent" && rentedPeriod) {
      const period = rentedPeriod.toLowerCase().replace("per ", "");
      return `${formatted} / ${period}`;
    }
    return formatted;
  };

  if (loading) {
    return (
      <div className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-amber-500"></div>
              <h2 className="text-2xl font-bold">Similar Properties</h2>
            </div>
          </div>
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-amber-500" size={32} />
          </div>
        </div>
      </div>
    );
  }

  if (relatedProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6 md:px-12 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-amber-500"></div>
            <h2 className="text-2xl font-bold">Similar Properties You May Like</h2>
          </div>
          <button
            onClick={() => navigate("/propertylisting", { 
              state: { 
                filters: {
                  category: currentProperty?.category,
                  offeringType: currentProperty?.offeringType,
                  city: currentProperty?.city
                }
              } 
            })}
            className="flex items-center gap-2 text-amber-500 text-sm font-semibold hover:underline"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProperties.map((property) => {
            const propertyTitle = property.propertyTitleEn || property.propertyname;
            const locationName = property.community || property.city || "Dubai";
            const images = property.image || [];
            
            return (
              <div
                key={property._id}
                onClick={() => handlePropertyClick(property)}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  isDark 
                    ? "bg-zinc-900 border border-white/10 hover:border-amber-500/30" 
                    : "bg-white border border-gray-200 hover:border-amber-500/30"
                }`}
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  {images.length > 0 ? (
                    <Swiper
                      modules={[Autoplay]}
                      spaceBetween={0}
                      slidesPerView={1}
                      autoplay={{ delay: 3000, disableOnInteraction: false }}
                      className="h-full w-full"
                    >
                      {images.slice(0, 3).map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={img}
                            alt={`${propertyTitle} - ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Building size={48} className="text-gray-600" />
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1.5 bg-amber-500 text-black text-xs font-bold">
                      {formatPrice(property.price, property.offeringType, property.rentedPeriod)}
                    </span>
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase">
                      {property.propertytype || property.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className={`text-lg font-bold mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {propertyTitle}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <MapPin size={12} className="text-amber-500 flex-shrink-0" />
                    <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {locationName}, UAE
                    </span>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {property.bedroom > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Bed size={14} className="text-amber-500" />
                        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {property.bedroom}
                        </span>
                      </div>
                    )}
                    {property.bathroom > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Bath size={14} className="text-amber-500" />
                        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {property.bathroom}
                        </span>
                      </div>
                    )}
                    {property.squarefoot > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Ruler size={14} className="text-amber-500" />
                        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {property.squarefoot.toLocaleString()} sqft
                        </span>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Quick Contact */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const msg = encodeURIComponent(
                        `Hi, I'm interested in your property: ${propertyTitle}\nPrice: ${formatPrice(property.price, property.offeringType, property.rentedPeriod)}\nLocation: ${locationName}`
                      );
                      window.open(`https://wa.me/971585852283?text=${msg}`, "_blank");
                    }}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-all"
                  >
                    <FaWhatsapp size={16} /> Inquire Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedAssets;