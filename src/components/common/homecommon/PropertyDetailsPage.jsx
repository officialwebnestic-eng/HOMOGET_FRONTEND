import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Ruler, Building2, ArrowLeft, Phone, X, Share2 } from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";
import useGetAllProperty from "../../../hooks/useGetAllProperty";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { propertyList, loading } = useGetAllProperty(1, 50, {});
  const [property, setProperty] = useState(null);

  useEffect(() => {
    if (propertyList?.length > 0) {
      const found = propertyList.find(p => p._id === id);
      setProperty(found);
    }
    window.scrollTo(0, 0);
  }, [id, propertyList]);

  if (loading || !property) return <div className="h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Hero Header */}
      <section className="relative h-[60vh] w-full">
        <img src={property.image?.[0]} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-10 left-10 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-amber-500 hover:text-black transition-all">
          <ArrowLeft size={24} />
        </button>
      </section>

      {/* Content same as your Modal UI */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className={`grid grid-cols-1 lg:grid-cols-11 rounded-[3rem] overflow-hidden border ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-2xl`}>
          
          <div className="lg:col-span-6 p-10">
            <h1 className={`text-5xl font-serif mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{property.propertyname}</h1>
            <p className="flex items-center text-amber-500 font-bold uppercase tracking-widest text-xs mb-8">
              <MapPin className="mr-2" /> {property.city}, UAE
            </p>

            <div className="grid grid-cols-4 gap-4 mb-10">
               <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl text-center">
                  <Bed className="mx-auto mb-2 text-amber-500" />
                  <p className="font-bold dark:text-white">{property.bedroom}</p>
                  <p className="text-[10px] uppercase opacity-50 dark:text-white">Beds</p>
               </div>
               {/* Add other stats same as your modal... */}
            </div>

            <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {property.description}
            </p>
          </div>

          <div className="lg:col-span-5 p-10 bg-amber-500 text-black">
             <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-70">Price</p>
             <h2 className="text-5xl font-serif mb-10">AED {property.price.toLocaleString()}</h2>
             <button className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
                Contact Broker
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;