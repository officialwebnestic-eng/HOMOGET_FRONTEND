import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useTheme } from "../../../context/ThemeContext";
import {
  Upload,
  X,
  MapPin,
  Loader2,
  Sparkles,
  ShieldCheck,
  FileText,
  Wallet,
  Building2,
  Plus,
  Trash2,
  Search,
  Globe,
  Bed,
  Bath,
  Layers,
  Navigation,
  Home,
  Camera,
  CheckCircle2,
  User,
  Hash,
  Calendar,
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";

// Import Helpers
import { DUBAI_AREAS, AMENITIES } from "../../../helpers/AddPropertyHelpers";

const AddProperty = () => {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const { agentList = [] } = useGetAllAgent();
  const isDark = theme === "dark";

  // --- States ---
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [langTab, setLangTab] = useState("en");
  const [developers, setDevelopers] = useState([]);
  const [loadingDevs, setLoadingDevs] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const CURRENCIES = [
    "AED",
    "USD",
    "EUR",
    "GBP",
    "INR",
    "SAR",
    "QAR",
    "OMR",
    "KWD",
    "BHD",
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      permitType: "RERA",
      category: "Residential",
      offeringType: "Sale",
      propertyUnit: "Square Ft",
      currency: "AED",
      amenities: [],
      propertyAge: "Brand New",
      nearByLocations: [
        { locationName: "", distance: "", transportType: "Drive" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nearByLocations",
  });

  // --- Watchers ---
  const watchCategory = watch("category");
  const watchOffering = watch("offeringType");
  const watchPermit = watch("permitType");
  const watchAmenities = watch("amenities") || [];

  // --- Dynamic Enums ---
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
  ];

  // --- Data Fetching ---
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoadingDevs(true);
        const res = await http.get("/developers");
        if (res.data.success) setDevelopers(res.data.data);
      } catch (err) {
        console.error("Dev Fetch Error:", err);
      } finally {
        setLoadingDevs(false);
      }
    };
    fetchDevelopers();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const TOMTOM_KEY = "k4W9ISMQC3Ro9ivC9ZWSyHUVuaghvrAq";
      if (locationQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(locationQuery)}.json?key=${TOMTOM_KEY}&countrySet=AE&lat=25.2048&lon=55.2708&radius=50000&limit=10`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.results) return;
        const filtered = data.results.map((item) => ({
          id: item.id,
          name: item.poi?.name || item.address.freeformAddress,
          address: item.address.freeformAddress,
          community:
            item.address.municipalitySubdivision ||
            item.address.municipality ||
            "Dubai",
        }));
        setSuggestions(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    const debounce = setTimeout(fetchLocations, 400);
    return () => clearTimeout(debounce);
  }, [locationQuery]);

  const handleSelectLocation = (item) => {
    const fullAddress = `${item.name}, ${item.community}, Dubai`;
    setValue("address", fullAddress);
    setValue("community", item.community);
    setLocationQuery(fullAddress);
    setShowSuggestions(false);
  };

  const toggleAmenity = (amenity) => {
    const current = watchAmenities;
    setValue(
      "amenities",
      current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity],
    );
  };

  const onSubmit = async (data) => {
    if (files.length === 0)
      return addToast("Media Portfolio Required", "error");
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "object")
          formData.append(key, JSON.stringify(data[key]));
        else formData.append(key, data[key]);
      });
      files.forEach((file) => formData.append("image", file));
      formData.append("userType", "admin");

      const res = await http.post("/addproperty", formData);
      if (res.data.success) {
        addToast("Dubai Asset Live", "success");
        reset();
        setFiles([]);
        setLocationQuery("");
      }
    } catch (e) {
      addToast(e.response?.data?.message || "Sync Failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none focus:ring-1 focus:ring-amber-500 transition-all text-sm font-semibold ${isDark ? "bg-[#1A1F2B] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"}`;
  const labelClass =
    "text-[9px] font-bold uppercase text-slate-500 mb-1 block tracking-wider";
  const requiredStar = <span className="text-red-500 ml-0.5">*</span>;

  return (
    <div
      className={`min-h-screen pb-20 ${isDark ? "bg-[#0F1219]" : "bg-[#F8FAFC]"}`}
    >
      {/* MODERN HEADER */}
      <header
        className={`sticky top-0 z-[100] border-b backdrop-blur-md ${isDark ? "bg-[#0F1219]/90 border-white/5" : "bg-white/90 border-slate-200"}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="text-black" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase italic leading-none">
                Homoget <span className="text-amber-500">Dubai</span>
              </h1>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Real Estate Management
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-amber-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-amber-400 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Sparkles size={14} />
            )}
            {isSubmitting ? "Syncing..." : "Launch Asset"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-8">
        {/* 1. LICENSE & BROKERAGE */}
        <div
          className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}
        >
          <SectionHeader icon={<ShieldCheck />} title="License & Compliance" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>
                Permit Authority {requiredStar}
              </label>
              <select {...register("permitType")} className={inputClass}>
                <option value="RERA">RERA (Dubai)</option>
                <option value="DTC">DTC</option>
                <option value="DIFC">DIFC / JAFZA</option>
                <option value="None">None</option>
              </select>
            </div>
            {watchPermit === "RERA" && (
              <>
                <div>
                  <label className={labelClass}>
                    Trakheesi Number {requiredStar}
                  </label>
                  <input
                    {...register("trakheesiNumber")}
                    className={inputClass}
                    placeholder="Permit ID"
                  />
                </div>
              </>
            )}
            <div>
              <label className={labelClass}>
                Assigned Agent {requiredStar}
              </label>
              <select
                {...register("agentId", { required: true })}
                className={inputClass}
              >
                <option value="">Choose Broker...</option>
                {agentList?.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Owner Name</label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={14}
                />
                <input
                  {...register("ownerName")}
                  className={`${inputClass} pl-10`}
                  placeholder="Full Name"
                />
              </div>
            </div>
            <div className="border border-dashed border-amber-500/20 p-2 rounded-xl bg-amber-500/5">
              <label className={`${labelClass} text-amber-500 opacity-80`}>
                Developer Partner (Optional)
              </label>
              <select {...register("developerId")} className={inputClass}>
                <option value="">
                  {loadingDevs ? "Fetching..." : "Select Developer..."}
                </option>
                {developers.map((dev) => (
                  <option key={dev._id} value={dev._id}>
                    {dev.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div
          className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}
        >
          <SectionHeader icon={<Home />} title="Asset Classification" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Category {requiredStar}</label>
              <select {...register("category")} className={inputClass}>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                {/* <option value="Residential">Residential-secoundary</option>
                <option value="Commercial">Commercial-secoundary</option> */}
                <option value="Off-Plan">Off-Plan</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Offering {requiredStar}</label>
              <select {...register("offeringType")} className={inputClass}>
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Rental Period</label>

              <select {...register("rentedPeriod")} className={inputClass}>
                <option value="Per Year">Per Year</option>

                <option value="Per Month">Per Month</option>

                <option value="Per Week">Per Week</option>

                <option value="Per Day">Per Day</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Property Type {requiredStar}</label>
              <select
                {...register("propertytype", { required: true })}
                className={inputClass}
              >
                {(watchCategory === "Commercial" ? commTypes : resTypes).map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>

        {/* 3. PHYSICAL SPECIFICATIONS */}
        <div
          className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}
        >
          <SectionHeader icon={<Layers />} title="Physical specs" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className={labelClass}>Bedrooms {requiredStar}</label>
              <select {...register("bedroom")} className={inputClass}>
                {[...Array(21).keys()].map((i) => (
                  <option key={i} value={i}>
                    {i === 0 ? "Studio" : i + " BHK"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Bathrooms {requiredStar}</label>
              <select {...register("bathroom")} className={inputClass}>
                {[...Array(11).keys()].map((i) => (
                  <option key={i} value={i}>
                    {i} Baths
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Age</label>
              <select {...register("propertyAge")} className={inputClass}>
                <option value="Brand New">Brand New</option>
                <option value="1-2 Years">1-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5-10 Years">5-10 Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Size ({watch("propertyUnit")}) {requiredStar}
              </label>
              <input
                type="number"
                {...register("squarefoot", { required: true })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Unit / Suite No</label>
              <input
                {...register("unitNo")}
                className={inputClass}
                placeholder="e.g. 1201"
              />
            </div>
            <div>
              <label className={labelClass}>Parking Slots</label>
              <input
                type="number"
                {...register("parkingSlots")}
                className={inputClass}
                defaultValue={0}
              />
            </div>
            <div>
              <label className={labelClass}>Furnishing</label>
              <select {...register("furnishingType")} className={inputClass}>
                <option>Unfurnished</option>
                <option>Semi-Furnished</option>
                <option>Furnished</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Availability</label>
              <select {...register("availability")} className={inputClass}>
                <option value="">Select Availability</option>

                <option>Immediately</option>
                <option>Ready to Move</option>
                <option>Under Construction</option>
                <option>Coming Soon</option>
                <option>Pre-Launch</option>
                <option>New Launch</option>
                <option>Under Renovation</option>
                <option>Possession Soon</option>
                <option>Handover Soon</option>
                <option>Delayed</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. GEOGRAPHY */}
        <div
          className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}
        >
          <SectionHeader icon={<MapPin />} title="Geography & Hubs" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 relative">
              <label className={labelClass}>
                Global Address Search {requiredStar}
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  className={`${inputClass} pl-12`}
                  placeholder="Search Building or Area..."
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className={`absolute z-[110] w-full mt-1 border rounded-xl shadow-2xl overflow-hidden ${isDark ? "bg-[#1A1F2B] border-white/10" : "bg-white border-slate-200"}`}
                >
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectLocation(s)}
                      className={`px-4 py-3 cursor-pointer hover:bg-amber-500/10 border-b last:border-0 ${isDark ? "border-white/5" : "border-slate-100"}`}
                    >
                      <p className="text-xs font-bold uppercase">{s.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {s.community}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Community {requiredStar}</label>
              <select
                {...register("community", { required: true })}
                className={inputClass}
              >
                <option value="">Select Area...</option>
                {DUBAI_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className={labelClass}>Nearby Landmarks</label>
          <div className="space-y-4">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl items-end"
              >
                <div className="md:col-span-2">
                  <input
                    {...register(`nearByLocations.${index}.locationName`)}
                    placeholder="Landmark Name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <input
                    {...register(`nearByLocations.${index}.distance`)}
                    placeholder="Distance (e.g. 5 min)"
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-all w-fit"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append({
                  locationName: "",
                  distance: "",
                  transportType: "Drive",
                })
              }
              className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 tracking-widest"
            >
              <Plus size={14} /> Add Hub
            </button>
          </div>
        </div>

        {/* 5. CONTENT SECTIONS */}
        <div
          className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <SectionHeader icon={<Globe />} title="Bilingual Narrative" />
            <div className="flex bg-black/10 dark:bg-white/10 p-1 rounded-xl">
              {["en", "ar"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLangTab(l)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${langTab === l ? "bg-amber-500 text-black" : "text-slate-500"}`}
                >
                  {l === "en" ? "English" : "Arabic"}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={langTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>
                  {langTab === "en" ? "Asset Title" : "عنوان العقار"}{" "}
                  {requiredStar}
                </label>
                <input
                  {...register(
                    langTab === "en" ? "propertyTitleEn" : "propertyTitleAr",
                  )}
                  className={`${inputClass} ${langTab === "ar" ? "text-right font-arabic" : ""}`}
                  placeholder={langTab === "en" ? "e.g. Luxury Penthouse" : ""}
                />
              </div>
              <div>
                <label className={labelClass}>
                  {langTab === "en" ? "Description" : "الوصف التفصيلي"}{" "}
                  {requiredStar}
                </label>
                <textarea
                  rows={6}
                  {...register(
                    langTab === "en" ? "descriptionEn" : "descriptionAr",
                  )}
                  className={`${inputClass} ${langTab === "ar" ? "text-right font-arabic" : ""}`}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 6. VALUATION & MEDIA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}
          >
            <SectionHeader icon={<Wallet />} title="Asset Valuation" />
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Total Value {requiredStar}</label>
                <input
                  type="number"
                  {...register("price", { required: true })}
                  className={`${inputClass} text-xl font-black text-amber-500`}
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Currency {requiredStar}</label>
                  <select {...register("currency")} className={inputClass}>
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Price Unit</label>
                  <select {...register("priceUnit")} className={inputClass}>
                    <option>Total Price</option>
                    <option>Per Sq.Ft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}
          >
            <SectionHeader icon={<Camera />} title="Media Portfolio" />
            <div
              className="border-2 border-dashed border-slate-700/50 rounded-2xl p-8 text-center cursor-pointer hover:bg-amber-500/5 transition-all"
              onClick={() => document.getElementById("file-up").click()}
            >
              <Upload className="mx-auto mb-2 text-amber-500" size={24} />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Drop 4K Visuals Here {requiredStar}
              </p>
              <input
                id="file-up"
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={(e) =>
                  setFiles([...files, ...Array.from(e.target.files)])
                }
              />
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-xl overflow-hidden group border border-white/10"
                >
                  <img
                    src={URL.createObjectURL(f)}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFiles(files.filter((_, idx) => idx !== i))
                    }
                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                  >
                    <X className="text-white" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. AMENITIES */}
        <div
          className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}
        >
          <SectionHeader icon={<Sparkles />} title="LifeStyle & Facilities" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {AMENITIES.map((amenity) => {
              const isSelected = watchAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 ${isSelected ? "bg-amber-500 border-amber-500 text-black shadow-md" : "bg-black/5 dark:bg-white/5 border-transparent text-slate-500 hover:border-amber-500/30"}`}
                >
                  {isSelected ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                  <span className="text-[8px] font-black uppercase text-center">
                    {amenity}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. LINKS */}
        <div
          className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}
        >
          <SectionHeader icon={<Navigation />} title="Connectivity Links" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                360° Virtual Tour (Matterport)
              </label>
              <input
                {...register("virtualTour360")}
                className={inputClass}
                placeholder="URL Link"
              />
            </div>
            <div>
              <label className={labelClass}>Video Tour (YouTube/Vimeo)</label>
              <input
                {...register("videoTourLink")}
                className={inputClass}
                placeholder="URL Link"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
      {title}
    </h2>
  </div>
);

export default AddProperty;
