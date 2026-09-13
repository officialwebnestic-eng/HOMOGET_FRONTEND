import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Crown,
  Search,
  X,
  MapPin,
  Loader2,
  Send,
  CheckCircle2,
  Building2,
  ShieldCheck,
  TrendingUp,
  Key,
  AlertTriangle,
  ArrowRight,
  Calendar,
} from "lucide-react";
import useInquiry from "../../hooks/useInquiry";

// ============================================
// Budget parser — mirrors backend logic
// ============================================
const parseBudgetPreview = (input) => {
  if (!input) return null;
  const str = String(input).trim().toUpperCase();
  const currencyMatch = str.match(/(AED|USD|EUR|GBP|INR)/);
  const currency = currencyMatch ? currencyMatch[1] : "AED";
  const mult = (t) =>
    /M|MILLION/.test(t) ? 1_000_000 : /K|THOUSAND/.test(t) ? 1_000 : 1;
  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n) +
    " " +
    currency;

  const range = str.match(
    /([\d.,]+)\s*([KM]?)\s*[-–TO]+\s*([\d.,]+)\s*([KM]?)/i
  );
  if (range) {
    const min = parseFloat(range[1].replace(/,/g, "")) * mult(range[2]);
    const max = parseFloat(range[3].replace(/,/g, "")) * mult(range[4]);
    return `${fmt(min)} – ${fmt(max)}`;
  }

  const single = str.match(/([\d.,]+)\s*([KM]?)/i);
  if (single) {
    const val = parseFloat(single[1].replace(/,/g, "")) * mult(single[2]);
    return fmt(val);
  }
  return null;
};

// ============================================
// Mock location suggestions (hero search)
// ============================================
const MOCK_LOCATIONS = [
  { name: "Palm Jumeirah", area: "Dubai" },
  { name: "Downtown Dubai", area: "Dubai" },
  { name: "Dubai Marina", area: "Dubai" },
  { name: "Business Bay", area: "Dubai" },
  { name: "Dubai Hills Estate", area: "Dubai" },
  { name: "Jumeirah Golf Estates", area: "Dubai" },
  { name: "DIFC", area: "Dubai" },
  { name: "Emirates Hills", area: "Dubai" },
  { name: "Saadiyat Island", area: "Abu Dhabi" },
  { name: "Al Barari", area: "Dubai" },
];

// ============================================
// Landing Page
// ============================================
export default function LandingPage() {
  // ---- Hero search state ----
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null); // ⭐ ref to scroll to form

  // ---- Form state ----
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    userType: "Buyer",
    category: "Residential",
    propertyType: "Apartments",
    customPropertyType: "",
    budget: "",
    description: "",
  });

  // ---- Hook ----
  const { create, loading, error } = useInquiry(
    {},
    {
      autoFetch: false,
      onSuccess: () => {
        setFormSubmitted(true);
        scrollToForm();
      },
    }
  );

  // ============================================
  // ⭐ Central Scroll-to-Form handler
  //    Used by all "Book" buttons
  // ============================================
  const scrollToForm = () => {
    if (!formRef.current) return;
    // Compute offset so form appears ~80px from top
    const top =
      formRef.current.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // ============================================
  // Property Type Lists
  // ============================================
  const resTypes = [
    "Apartments",
    "Bulk Units",
    "Bungalow",
    "Compound",
    "Duplex",
    "Hotel Apartment",
    "Penthouse",
    "Townhouse",
    "Villa",
    "Whole Building",
    "Other",
  ];
  const commTypes = [
    "Business Center",
    "Coworking Space",
    "Factory",
    "Farm",
    "Full Floor",
    "Half Floor",
    "Labor Camp",
    "Land",
    "Office Space",
    "Retail",
    "Shop",
    "Showroom",
    "Staff Accommodation",
    "Warehouse",
    "Whole Building",
    "Other",
  ];
  const offPlanTypes = [
    "Apartments",
    "Villas",
    "Townhouses",
    "Penthouses",
    "Land",
    "Other",
  ];
  const userTypes = ["Buyer", "Seller", "Investor", "Tenant", "Agent / Broker"];

  const getPropertyTypeOptions = () => {
    switch (formData.category) {
      case "Commercial":
        return commTypes;
      case "Off-Plan":
        return offPlanTypes;
      default:
        return resTypes;
    }
  };

  // ============================================
  // Hero Search Handlers
  // ============================================
  const handleInputFocus = () => {
    setIsInputFocused(true);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setFormData((prev) => ({
      ...prev,
      description: prev.description
        ? `${prev.description} | Searching for: ${searchQuery}`
        : `Searching for: ${searchQuery}`,
    }));
    scrollToForm();
    setShowSuggestions(false);
  };

  const handleLocationSelect = (loc) => {
    setSearchQuery(loc.name);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredLocations = MOCK_LOCATIONS.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================
  // Form Handlers
  // ============================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (cat) => {
    const defaultType =
      cat === "Commercial"
        ? commTypes[0]
        : cat === "Off-Plan"
        ? offPlanTypes[0]
        : resTypes[0];
    setFormData((prev) => ({
      ...prev,
      category: cat,
      propertyType: defaultType,
      customPropertyType: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create({
      ...formData,
      budget: formData.budget,
    });
  };

  const handleReset = () => {
    setFormSubmitted(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      userType: "Buyer",
      category: "Residential",
      propertyType: "Apartments",
      customPropertyType: "",
      budget: "",
      description: "",
    });
  };

  const budgetPreview = parseBudgetPreview(formData.budget);

  // ============================================
  // Reusable Book Button
  // ============================================
  const BookButton = ({ label = "Book a Consultation", variant = "primary", className = "" }) => {
    const baseCls =
      "inline-flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider rounded-lg transition-all shadow-sm font-sans";
    const styles =
      variant === "primary"
        ? "px-5 py-2.5 bg-amber-500 text-slate-950 hover:bg-amber-400"
        : variant === "dark"
        ? "px-5 py-2.5 bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950"
        : "px-4 py-2 bg-white text-slate-900 border border-slate-300 hover:border-amber-500 hover:text-amber-600";
    return (
      <button
        type="button"
        onClick={scrollToForm}
        className={`${baseCls} ${styles} ${className}`}
      >
        <Calendar size={13} />
        {label}
      </button>
    );
  };

  // ============================================
  // Render
  // ============================================
  return (
    <div className="w-full bg-slate-50 text-slate-800 font-serif selection:bg-amber-500 selection:text-white">
      {/* =====================================================
          SECTION 1: HERO
      ===================================================== */}
      <section className="relative w-full h-[45vh] md:h-[55vh] flex items-center overflow-visible bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Luxury Dubai Real Estate"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 backdrop-blur-md">
              <Crown size={12} />
              <span className="text-[10px] font-semibold tracking-wide uppercase font-sans">
                Ultra-Prime Dubai Real Estate
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-normal mb-3 text-white tracking-tight leading-tight max-w-2xl">
              Acquire High-Yield{" "}
              <span className="text-amber-500 italic">
                Tax-Free Dubai Assets
              </span>
            </h1>

            <p className="max-w-xl text-xs md:text-sm leading-relaxed mb-6 text-slate-300 font-sans">
              Unlock off-market luxury penthouses, waterfront villas, and prime
              commercial floors with direct developer allocations.
            </p>

            {/* Hero Search */}
            <div ref={containerRef} className="relative max-w-xl font-sans">
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-2xl border border-white/20">
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search size={16} className="text-slate-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search area, building, or community..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    className="w-full py-2 bg-transparent outline-none text-xs md:text-sm text-slate-800 placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center gap-1.5"
                >
                  Search <ArrowRight size={12} />
                </button>
              </div>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && filteredLocations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-30"
                  >
                    {filteredLocations.slice(0, 6).map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => handleLocationSelect(loc)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 text-left transition-colors"
                      >
                        <MapPin
                          size={14}
                          className="text-amber-500 flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {loc.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {loc.area}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ⭐ BOOK BUTTON #1 — Hero */}
            <div className="mt-4">
              <BookButton label="Book a Consultation" variant="primary" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SECTION 2: DESCRIPTION + FORM
      ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ---- Left: Description ---- */}
          <div className="space-y-4 pt-2">
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-sans text-[10px] font-bold rounded-full uppercase tracking-wider">
              Institutional Advisory
            </span>
            <h2 className="text-2xl md:text-3xl font-normal text-slate-900 leading-tight">
              Tailored Portfolio Structuring for High-Net-Worth Investors
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Navigating Dubai's dynamic property market demands precision. We
              match your investment mandates with fully vetted assets offering
              maximum capital protection and tax-free rental returns.
            </p>

            {/* Trust markers */}
            <div className="grid grid-cols-2 gap-3 pt-4 font-sans">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900">
                    DLD Verified
                  </p>
                  <p className="text-[10px] text-slate-500">
                    100% verified listings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900">
                    High Yield
                  </p>
                  <p className="text-[10px] text-slate-500">
                    6–9% rental returns
                  </p>
                </div>
              </div>
            </div>

            {/* ⭐ BOOK BUTTON #2 — under trust markers */}
            <div className="pt-2">
              <BookButton label="Book a Session" variant="dark" />
            </div>
          </div>

          {/* ---- Right: Form (with ref for scroll) ---- */}
          <div
            ref={formRef}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm font-sans scroll-mt-20"
          >
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Inquiry Confirmed
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  An advisor will provide tailored options matching your exact
                  specifications within 24 hours.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-5 py-2 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-amber-500 hover:text-slate-950 transition-all"
                >
                  Submit Another Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Register Requirement
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Get priority allocation, custom floor plans, and financial
                    projections.
                  </p>
                </div>

                {/* ---- Name & Email ---- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* ---- Phone ---- */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Phone Number *
                  </label>
                  <div className="phone-input-light text-xs">
                    <PhoneInput
                      country={"ae"}
                      enableSearch={true}
                      searchPlaceholder="Search country..."
                      value={formData.phone}
                      onChange={(phone) =>
                        setFormData((prev) => ({ ...prev, phone }))
                      }
                      containerStyle={{ width: "100%" }}
                      inputStyle={{
                        width: "100%",
                        height: "36px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "0.5rem",
                        color: "#1e293b",
                        fontSize: "0.75rem",
                        paddingLeft: "48px",
                      }}
                      buttonStyle={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: "0.5rem 0 0 0.5rem",
                      }}
                    />
                  </div>
                </div>

                {/* ---- Role ---- */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    I Am A *
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {userTypes.map((u) => (
                      <button
                        type="button"
                        key={u}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, userType: u }))
                        }
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all ${
                          formData.userType === u
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ---- Category ---- */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <div className="flex bg-slate-200 p-0.5 rounded-lg">
                    {["Residential", "Commercial", "Off-Plan"].map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${
                          formData.category === cat
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ---- Property Type + Budget ---- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-amber-500"
                    >
                      {getPropertyTypeOptions().map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Target Budget *
                    </label>
                    <input
                      type="text"
                      name="budget"
                      required
                      placeholder="e.g. 2-3M AED or 500K-1M"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500"
                    />
                    {budgetPreview && (
                      <p className="mt-1 text-[10px] text-emerald-700 font-semibold">
                        ✓ Interpreted: {budgetPreview}
                      </p>
                    )}
                    <p className="mt-0.5 text-[9px] text-slate-400">
                      Flexible: "2-3", "2-3M", "500K-1M USD", "3,500,000 AED"
                    </p>
                  </div>
                </div>

                {/* ---- Other Property Type ---- */}
                {formData.propertyType === "Other" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Specify Type *
                    </label>
                    <input
                      type="text"
                      name="customPropertyType"
                      required
                      placeholder="e.g. Hotel Tower, Private Plot"
                      value={formData.customPropertyType}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-amber-500"
                    />
                  </motion.div>
                )}

                {/* ---- Description ---- */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Specific Requirements{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Move-in timeline, preferred views, financing needs..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* ---- Error ---- */}
                {error && (
                  <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[11px] font-semibold">
                    {error}
                  </div>
                )}

                {/* ---- Submit ---- */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={12} /> Request Private Portfolio
                    </>
                  )}
                </button>

                <p className="text-[9px] text-slate-400 text-center">
                  By submitting, you agree to be contacted by our advisory team.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 3: PROBLEM VS SOLUTION
      ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-slate-100 rounded-2xl my-8 border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Problem */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold font-sans">
              <AlertTriangle size={12} /> Market Pain Points
            </div>
            <h3 className="text-xl md:text-2xl font-normal text-slate-900 leading-snug">
              Opaque Pricing & Unverified Listings
            </h3>
            <ul className="space-y-2 text-slate-600 text-xs font-sans">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                Inaccurate online listings and inflated price figures.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                Unregulated brokers pitching low-yield units.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                Missing direct developer VIP allocations.
              </li>
            </ul>
          </div>

          {/* Solution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold font-sans">
              <ShieldCheck size={12} /> Our Solution
            </div>
            <h3 className="text-xl font-normal text-slate-900 leading-snug">
              Direct Access & Verified Inventory
            </h3>
            <ul className="space-y-2 text-slate-600 text-xs font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className="text-emerald-600 mt-0.5 flex-shrink-0"
                />
                100% verified DLD-listed properties.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className="text-emerald-600 mt-0.5 flex-shrink-0"
                />
                Direct priority floor-plan allocation with top developers.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className="text-emerald-600 mt-0.5 flex-shrink-0"
                />
                End-to-end legal, escrow, and management services.
              </li>
            </ul>
          </div>
        </div>

        {/* ⭐ BOOK BUTTON #3 — Problem/Solution CTA */}
        <div className="mt-6 flex justify-center">
          <BookButton label="Book Free Consultation" variant="primary" />
        </div>
      </section>

      {/* =====================================================
          SECTION 4: SHOWCASE — Waterfront Villas
      ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Villa Portfolio"
              className="w-full h-[260px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="space-y-3">
            <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center">
              <Building2 size={16} />
            </div>
            <h3 className="text-xl md:text-2xl font-normal text-slate-900">
              Prime Waterfront & Golf Communities
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs font-sans">
              Handpicked luxury villas and mansions across Palm Jumeirah and
              Dubai Hills for long-term equity growth.
            </p>
            {/* ⭐ BOOK BUTTON #4 — Showcase 1 */}
            <div className="pt-2">
              <BookButton label="Book a Viewing" variant="outline" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 5: SHOWCASE — Commercial
      ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-slate-50 border-t border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3 order-2 lg:order-1">
            <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <h3 className="text-xl md:text-2xl font-normal text-slate-900">
              Institutional Commercial Portfolios
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs font-sans">
              Full-floor Grade-A offices and retail hubs in DIFC and Business
              Bay generating high-yield income.
            </p>
            {/* ⭐ BOOK BUTTON #5 — Showcase 2 */}
            <div className="pt-2">
              <BookButton label="Book Commercial Advisory" variant="outline" />
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
              alt="Commercial Real Estate"
              className="w-full h-[260px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 6: SHOWCASE — Golden Visa
      ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=1200&auto=format&fit=crop"
              alt="UAE Golden Visa Property"
              className="w-full h-[260px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="space-y-3">
            <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center">
              <Key size={16} />
            </div>
            <h3 className="text-xl md:text-2xl font-normal text-slate-900">
              UAE 10-Year Golden Visa Streamlining
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs font-sans">
              Property acquisitions over 2M AED qualify for residency. We manage
              the complete visa process end-to-end.
            </p>
            {/* ⭐ BOOK BUTTON #6 — Showcase 3 */}
            <div className="pt-2">
              <BookButton label="Book Visa Consultation" variant="outline" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECTION 7: FINAL CTA
      ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 my-6">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-500/30 font-sans">
              Start Your Journey
            </span>
            <h2 className="text-2xl md:text-4xl font-normal leading-tight">
              Ready to Expand Your Property Portfolio?
            </h2>
            <p className="text-slate-300 text-xs md:text-sm font-sans max-w-lg mx-auto">
              Schedule a confidential session with our advisors to receive
              off-market inventory and yield reports.
            </p>
            {/* ⭐ BOOK BUTTON #7 — Final CTA (existing button — kept and routed) */}
            <div className="pt-2 flex items-center justify-center font-sans">
              <button
                onClick={scrollToForm}
                className="px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-all shadow-md flex items-center justify-center gap-2"
              >
                Claim VIP Allocation <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-3 font-sans">
          <div className="flex items-center gap-2">
            <Crown size={14} className="text-amber-500" />
            <span className="text-[11px] font-bold text-slate-800">
              Ultra-Prime Realty
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            © {new Date().getFullYear()} Ultra-Prime Realty. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}