import React, { useState, useRef } from "react";
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
  ArrowRight
} from "lucide-react";

export default function LandingPage() {
  // Hero Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Form State
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

  // Property Type Lists
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

  // Dynamic Property Type Picker
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

  // Hero Search Handlers
  const handleInputFocus = () => {
    setIsInputFocused(true);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    alert(`Searching for: ${searchQuery}`);
    setShowSuggestions(false);
  };

  const handleLocationSelect = (loc) => {
    setSearchQuery(loc.name);
    setShowSuggestions(false);
  };

  // Form Handlers
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Inquiry Data:", formData);
    setFormSubmitted(true);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-serif selection:bg-amber-500 selection:text-white">
      
      {/* ================= SECTION 1: HERO SECTION ================= */}
      <section className="relative w-full h-[45vh] md:h-[50vh] flex items-center overflow-visible bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover "
            alt="Luxury Dubai Real Estate"
          />
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

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-normal mb-3 text-white tracking-tight leading-tight">
              Acquire High-Yield <span className="text-amber-500 italic">Tax-Free Dubai Assets</span>
            </h1>

            <p className="max-w-xl text-xs md:text-sm leading-relaxed mb-6 text-slate-300 font-sans">
              Unlock off-market luxury penthouses, waterfront villas, and prime commercial floors.
            </p>

          
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 2: DESCRIPTION + FORM ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Description */}
          <div className="space-y-4 pt-2">
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-sans text-[10px] font-bold rounded-full uppercase tracking-wider">
              Institutional Advisory
            </span>
            <h2 className="text-2xl md:text-3xl font-normal text-slate-900 leading-tight">
              Tailored Portfolio Structuring for High-Net-Worth Investors
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Navigating Dubai's dynamic property market demands precision. We match your investment mandates with fully vetted assets offering maximum capital protection and tax-free rental returns.
            </p>
          </div>

          {/* Right Lead Capture Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm font-sans">
            {formSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Inquiry Confirmed</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  An advisor will provide tailored options matching your exact specifications shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-2 px-5 py-2 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-amber-500 hover:text-slate-950 transition-all"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Register Requirement</h3>
                  <p className="text-[11px] text-slate-500">
                    Get priority allocation, custom floor plans, and financial projections.
                  </p>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Full Name *</label>
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
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Email *</label>
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

                {/* Phone Input */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                  <div className="phone-input-light text-xs">
                    <PhoneInput
                      country={"ae"}
                      enableSearch={true}
                      searchPlaceholder="Search country..."
                      value={formData.phone}
                      onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
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

                {/* Role Type */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">I Am A *</label>
                  <div className="flex flex-wrap gap-1.5">
                    {userTypes.map((u) => (
                      <button
                        type="button"
                        key={u}
                        onClick={() => setFormData((prev) => ({ ...prev, userType: u }))}
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

                {/* Category Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Category</label>
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

                {/* Property Type Dropdown & Budget Entry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Property Type</label>
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
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Target Budget *</label>
                    <input
                      type="text"
                      name="budget"
                      required
                      placeholder="e.g. 3,500,000 AED"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Other Field */}
                {formData.propertyType === "Other" && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Specify Type *</label>
                    <input
                      type="text"
                      name="customPropertyType"
                      required
                      placeholder="e.g. Hotel Tower, Private Plot"
                      value={formData.customPropertyType}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Optional Description Field */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Specific Requirements <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Move-in timeline, preferred views..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send size={12} /> Request Private Portfolio
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ================= SECTION 3: PROBLEM VS SOLUTION ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-slate-100 rounded-2xl my-8 border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Problem Side */}
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

          {/* Solution Side */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold font-sans">
              <ShieldCheck size={12} /> Our Solution
            </div>
            <h3 className="text-xl font-normal text-slate-900 leading-snug">
              Direct Access & Verified Inventory
            </h3>
            <ul className="space-y-2 text-slate-600 text-xs font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                100% verified DLD-listed properties.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                Direct priority floor-plan allocation with top developers.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                End-to-end legal, escrow, and management services.
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ================= SECTION 4: SHOWCASE (IMAGE LEFT - DESC RIGHT) ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Villa Portfolio"
              className="w-full h-[260px] object-cover"
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
              Handpicked luxury villas and mansions across Palm Jumeirah and Dubai Hills for long-term equity growth.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: SHOWCASE (DESC LEFT - IMAGE RIGHT) ================= */}
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
              Full-floor Grade-A offices and retail hubs in DIFC and Business Bay generating high-yield income.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
              alt="Commercial Real Estate"
              className="w-full h-[260px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: SHOWCASE (IMAGE LEFT - DESC RIGHT) ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=1200&auto=format&fit=crop"
              alt="UAE Golden Visa Property"
              className="w-full h-[260px] object-cover"
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
              Property acquisitions over 2M AED qualify for residency. We manage the complete visa process.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: FINAL CALL TO ACTION (CTA) ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 my-6">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-500/30 font-sans">
              Start Your Journey
            </span>
            <h2 className="text-2xl md:text-4xl font-normal leading-tight">
              Ready to Expand Your Property Portfolio?
            </h2>
            <p className="text-slate-300 text-xs md:text-sm font-sans max-w-lg mx-auto">
              Schedule a confidential session with our advisors to receive off-market inventory and yield reports.
            </p>
            <div className="pt-2 flex items-center justify-center font-sans">
              <button
                onClick={() => window.scrollTo({ top: 350, behavior: "smooth" })}
                className="px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-all shadow-md flex items-center justify-center gap-2"
              >
                Claim VIP Allocation <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}