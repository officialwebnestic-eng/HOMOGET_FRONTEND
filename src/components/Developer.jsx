import React, { useState } from 'react';
import { Building2, Home, MapPin, CheckCircle2, ArrowUpRight, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const developersData = [
  {
    id: 1,
    name: "Emaar Properties",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Emaar_Properties_logo.svg/1200px-Emaar_Properties_logo.svg.png",
    cover: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800",
    projects: 150,
    area: "Downtown Dubai",
    status: "Master Developer",
    description: "The global real estate developer behind Burj Khalifa and Dubai Mall."
  },
  {
    id: 2,
    name: "DAMAC Properties",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/DAMAC_Properties_logo.svg/1200px-DAMAC_Properties_logo.svg.png",
    cover: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
    projects: 85,
    area: "Dubai Marina",
    status: "Private Developer",
    description: "Luxury real estate developer offering residential, leisure and commercial properties."
  }
];

const Developer = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtering logic
  const filteredDevs = developersData.filter(dev =>
    dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section with Input at Justify End */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Authorized <span className="text-amber-500">Developers</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
              Explore the masterminds behind Dubai's iconic skyline.
            </p>
          </div>

          {/* INPUT FIELD IN JUSTIFY END */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Search developers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm dark:text-white shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Developer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredDevs.map((dev) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={dev.id}
                whileHover={{ y: -10 }}
                className="group bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                {/* Cover Image & Logo Overlay */}
                <div className="relative h-48">
                  <img src={dev.cover} alt={dev.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute -bottom-6 left-6 p-2 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl">
                    <div className="h-16 w-16 flex items-center justify-center p-2">
                      <img src={dev.logo} alt="brand" className="max-h-full object-contain" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    {dev.status}
                  </div>
                </div>

                {/* Content */}
                <div className="pt-10 p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <CheckCircle2 size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">DLD Verified</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                    {dev.name}
                  </h3>
                  
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {dev.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 my-6 py-4 border-y border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Projects</p>
                        <p className="text-sm font-bold dark:text-white">{dev.projects}+</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Main Area</p>
                        <p className="text-sm font-bold dark:text-white truncate">{dev.area}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <button className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 group/btn hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white transition-all">
                    View Projects
                    <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Empty State */}
        {filteredDevs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">No developers found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Developer;