import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Maximize2,
  MapPin,
  Ruler,
  BedDouble,
  Bath,
  ArrowUpRight,
} from "lucide-react";

const galleryData = [
  {
    id: 1,
    title: "The Obsidian Villa",
    location: "Aspen, Colorado",
    category: "Villas",
    price: "$8,400,000",
    beds: 5,
    baths: 6,
    sqft: "6,200",
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Signature",
  },
  {
    id: 2,
    title: "Penthouse 71",
    location: "Upper East Side, NY",
    category: "Penthouses",
    price: "$12,000,000",
    beds: 3,
    baths: 4,
    sqft: "3,800",
    image:
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Rare Find",
  },
  // ... more data
];

const categories = [
  "All Residences",
  "Villas",
  "Penthouses",
  "Modern Houses",
  "Estates",
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("All Residences");

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* 1. Header Section: Editorial Style */}
      <header className="pt-24 pb-16 px-6 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-medium tracking-widest uppercase text-xs"
            >
              <span className="w-8 h-[1px] bg-amber-600 dark:bg-amber-500"></span>
              Portfolio 2025
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 dark:text-white leading-[1.1]">
              Exquisite <br />{" "}
              <span className="italic font-light text-slate-500">
                Architecture
              </span>
            </h1>
          </div>

          <p className="max-w-xs text-slate-500 dark:text-slate-400 text-sm leading-relaxed pb-2">
            Explore our curated selection of properties that embody the pinnacle
            of luxury, comfort, and sophisticated design.
          </p>
        </div>
      </header>

      {/* 2. Minimalist Filter Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 overflow-x-auto flex gap-8 items-center no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`whitespace-nowrap text-sm tracking-wide transition-all relative ${
                activeFilter === cat
                  ? "text-slate-900 dark:text-white font-semibold"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              {cat}
              {activeFilter === cat && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-[25px] left-0 right-0 h-[2px] bg-amber-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. The Grid: "The Gallery Look" */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {galleryData.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col"
              >
                {/* Image Card */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />

                  {/* Floating Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button className="p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-xl hover:bg-amber-600 hover:text-white transition-colors">
                      <Maximize2 size={20} />
                    </button>
                    <button className="p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-xl hover:bg-red-500 hover:text-white transition-colors">
                      <Heart size={20} />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="pt-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-serif text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                        <MapPin size={14} className="text-amber-600" />
                        {item.location}
                      </div>
                    </div>
                    <span className="text-lg font-light text-slate-900 dark:text-white">
                      {item.price}
                    </span>
                  </div>

                  {/* Property Specs Divider */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-medium">
                    <span className="flex items-center gap-1.5">
                      <BedDouble size={14} /> {item.beds}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath size={14} /> {item.baths}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ruler size={14} /> {item.sqft}
                    </span>
                    <ArrowUpRight className="ml-auto text-slate-300 dark:text-slate-700 group-hover:text-amber-600 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* 4. Minimalist Footer/CTA */}
      <footer className="bg-slate-50 dark:bg-slate-900/50 py-20 px-6 text-center">
        <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-6">
          Interested in a private viewing?
        </h2>
        <button className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-amber-700 dark:hover:bg-amber-500 transition-all rounded-sm shadow-2xl">
          Contact our Concierge
        </button>
      </footer>
    </div>
  );
};

export default Gallery;
