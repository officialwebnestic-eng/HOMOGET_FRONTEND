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
  } from "lucide-react";
  import { motion } from "framer-motion";
  import { Swiper, SwiperSlide } from "swiper/react";
  import { Autoplay, Pagination } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/pagination";
  import { useTheme } from "../../../context/ThemeContext";
  
  const PropertyCard = ({ property }) => {
    const { theme } = useTheme();
  
    return (
      <motion.div
        className={`${
          theme === "dark" ? "bg-gray-600" : "bg-white"
        } rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl`}
        whileHover={{ rotateY: 10, rotateX: -5, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <Swiper
          spaceBetween={10}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          modules={[Autoplay, Pagination]}
          className="w-full h-30"
        >
          {property.image?.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`Property ${index}`} className="w-full h-60 object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
  
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-red-400 text-transparent bg-clip-text">
              {property.propertyname}
            </h2>
            <p className={`${theme === "dark" ? "text-white" : "text-black"} text-sm mb-1 flex items-center gap-1`}>
              <Home size={16} /> {property.propertytype}
            </p>
  
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Ruler className={`w-4 h-4 ${theme === "dark" ? "text-red-700" : "text-cyan-800"}`} />
                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{property.squareFeet}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className={`w-4 h-4 ${theme === "dark" ? "text-red-700" : "text-cyan-800"}`} />
                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{property.bedroom} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className={`w-4 h-4 ${theme === "dark" ? "text-yellow-700" : "text-cyan-800"}`} />
                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{property.bathroom} Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${theme === "dark" ? "text-red-700" : "text-cyan-800"}`} />
                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{property.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className={`w-4 h-4 ${theme === "dark" ? "text-lime-700" : "text-cyan-800"}`} />
                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{property.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Barcode className={`w-4 h-4 ${theme === "dark" ? "text-green-700" : "text-cyan-800"}`} />
                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{property.zipcode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className={`w-4 h-4 ${theme === "dark" ? "text-red-700" : "text-cyan-800"}`} />
                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>{property.aminities}</span>
              </div>
            </div>
  
            <p className={`${theme === "dark" ? "text-white" : "text-black"} text-sm mb-1`}>{property.description}</p>
  
            <div className="flex items-center gap-2 text-red-600 font-bold text-lg mb-4">
              <IndianRupee className="w-5 h-5" />
              <span>{property.price}</span>
            </div>
          </div>
  
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            {/* <button className="text-white bg-gradient-to-r from-cyan-400 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Property Details
            </button> */}
            <button  href="/bookings" className="text-white bg-gradient-to-r from-teal-400 to-teal-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  export default PropertyCard;
  