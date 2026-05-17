import React, { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Upload, X, MapPin, Loader2, Sparkles, ShieldCheck, 
  Info, FileText, Landmark, Wallet, Bed, Bath, Ruler, 
  Image as ImageIcon, Home, Trash2, Plus, CheckCircle2,
  Globe, Building2, DollarSign, Camera,Layers
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";

// Import helpers
import { DUBAI_AREAS, AMENITIES } from "../../../helpers/AddPropertyHelpers";

const UpdateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Media States
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loadingDevs, setLoadingDevs] = useState(false);
  
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchAmenity, setSearchAmenity] = useState("");

  const inputRef = useRef(null);
  const IMAGE_BASE_URL = "http://localhost:3000/properties/";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      propertyTitleEn: "",
      propertyTitleAr: "",
      category: "Residential",
      propertytype: "",
      offeringType: "Sale",
      rentedPeriod: "Per Year",
      permitType: "RERA",
      trakheesiNumber: "",
      reraORN: "",
      brnNumber: "",
      bedroom: 0,
      bathroom: 0,
      totalFloor: "",
      squarefoot: "",
      unitNo: "",
      parkingSlots: 0,
      furnishingType: "Unfurnished",
      propertyAge: "Brand New",
      ownerName: "",
      availability: "Immediately",
      status: "Active",
      address: "",
      community: "",
      price: "",
      currency: "AED",
      cheques: "",
      descriptionEn: "",
      descriptionAr: "",
      videos: "",
      virtualTour360: "",
      videoTourLink: "",
      developerId: "",
      deliveryDate: "",
      completionPercentage: "",
      paymentPlan: "",
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nearByLocations",
  });

  const watchCategory = watch("category");
  const watchOffering = watch("offeringType");
  const watchPermit = watch("permitType");
  const watchAmenities = selectedAmenities;
  const watchListingType = watch("category"); // we'll use category to determine off-plan

  // Dynamic property types
  const resTypes = [
    "Apartments", "Bulk Units", "Bungalow", "Compound", "Duplex",
    "Hotel Apartment", "Penthouse", "Townhouse", "Villa", "Whole Building"
  ];
  const commTypes = [
    "Business Center", "Coworking Space", "Factory", "Farm", "Full Floor",
    "Half Floor", "Labor Camp", "Land", "Office Space", "Retail", "Shop",
    "Showroom", "Staff Accommodation", "Warehouse", "Whole Building"
  ];
  const offPlanTypes = ["Apartments", "Villas", "Townhouses", "Penthouses", "Land"];

  const getPropertyTypes = () => {
    if (watchCategory === "Commercial") return commTypes;
    if (watchCategory === "Off-Plan") return offPlanTypes;
    return resTypes;
  };

  // Fetch developers
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

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await http.get(`/getproperty/${id}`, { withCredentials: true });
        if (response.data.success) {
          const data = response.data.data;
          
          // Build form data matching AddPropertyByAgent fields
          const formData = {
            propertyTitleEn: data.propertyTitleEn || data.propertyname,
            propertyTitleAr: data.propertyTitleAr || "",
            category: data.category || (data.propertyListingType === "project" ? "Off-Plan" : "Residential"),
            propertytype: data.propertytype,
            offeringType: data.offeringType || (data.listingtype === "Rent" ? "Rent" : "Sale"),
            rentedPeriod: data.rentedPeriod || "Per Year",
            permitType: data.permitType || "RERA",
            trakheesiNumber: data.trakheesiNumber || "",
            reraORN: data.reraORN || "",
            brnNumber: data.brnNumber || "",
            bedroom: data.bedroom || 0,
            bathroom: data.bathroom || 0,
            totalFloor: data.totalFloor || "",
            squarefoot: data.squarefoot || "",
            unitNo: data.unitNo || "",
            parkingSlots: data.parkingSlots || 0,
            furnishingType: data.furnishingType || "Unfurnished",
            propertyAge: data.propertyAge || "Brand New",
            ownerName: data.ownerName || "",
            availability: data.availability || "Immediately",
            status: data.status || "Active",
            address: data.address || "",
            community: data.community || data.state || "",
            price: data.price || "",
            currency: data.currency || "AED",
            cheques: data.cheques || "",
            descriptionEn: data.descriptionEn || data.description,
            descriptionAr: data.descriptionAr || "",
            videos: data.videos || "",
            virtualTour360: data.virtualTour360 || "",
            videoTourLink: data.videoTourLink || "",
            developerId: data.developerId?._id || data.developerId || "",
            deliveryDate: data.deliveryDate || "",
            completionPercentage: data.completionPercentage || "",
            paymentPlan: data.paymentPlan || "",
            nearByLocations: data.nearByLocations && data.nearByLocations.length ? data.nearByLocations : [{ locationName: "", distance: "", transportType: "Drive" }],
          };
          
          reset(formData);
          setSelectedAmenities(Array.isArray(data.amenities) ? data.amenities : (Array.isArray(data.aminities) ? data.aminities : []));
          setExistingImages(data.image || []);
        } else {
          addToast("Failed to load property data", "error");
        }
      } catch (error) {
        console.error(error);
        addToast("Error loading property", "error");
      } finally {
        setLoadingData(false);
      }
    };
    fetchProperty();
  }, [id, reset, addToast]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const onSubmit = async (data) => {
    if (existingImages.length === 0 && newFiles.length === 0) {
      addToast("Property must have at least one image", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key === "nearByLocations" || key === "amenities") {
          formData.append(key, JSON.stringify(data[key]));
        } else if (typeof data[key] === "object") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      
      // Append amenities
      formData.append("amenities", JSON.stringify(selectedAmenities));
      
      // Handle images
      formData.append("existingImages", JSON.stringify(existingImages));
      newFiles.forEach(file => formData.append("image", file));
      
      formData.append("userType", "agent"); // or "admin" depending on context

      const response = await http.put(`/updateproperty/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      if (response.data.success) {
        addToast("Property updated successfully", "success");
        navigate("/propertydetailsagent");
      } else {
        addToast(response.data.message || "Update failed", "error");
      }
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || "Update failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none focus:ring-1 focus:ring-amber-500 transition-all text-sm font-semibold ${
    isDark ? 'bg-[#1A1F2B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
  }`;
  const labelClass = "text-[9px] font-bold uppercase text-slate-500 mb-1 block tracking-wider";
  const requiredStar = <span className="text-red-500 ml-0.5">*</span>;

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-[100] border-b backdrop-blur-md ${isDark ? 'bg-[#0F1219]/90 border-white/5' : 'bg-white/90 border-slate-200'}`}>
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
                Update Property
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-amber-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-amber-400 transition-all flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {isSubmitting ? "Updating..." : "Update Asset"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-8">
        {/* ===== SECTION 1: BASIC INFO ===== */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Home />} title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Property Title (English) {requiredStar}</label>
              <input {...register("propertyTitleEn", { required: true })} className={inputClass} placeholder="e.g., Luxury Penthouse with Burj View" />
              {errors.propertyTitleEn && <p className="text-red-500 text-[9px] mt-1">Required</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Property Title (Arabic)</label>
              <input {...register("propertyTitleAr")} className={`${inputClass} text-right font-arabic`} placeholder="عنوان العقار بالعربية" />
            </div>
            <div>
              <label className={labelClass}>Category {requiredStar}</label>
              <select {...register("category", { required: true })} className={inputClass}>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Off-Plan">Off-Plan</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Type {requiredStar}</label>
              <select {...register("propertytype", { required: true })} className={inputClass}>
                <option value="">Select Type</option>
                {getPropertyTypes().map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Offering Type {requiredStar}</label>
              <select {...register("offeringType", { required: true })} className={inputClass}>
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>
            {watchOffering === "Rent" && (
              <div>
                <label className={labelClass}>Rented Period {requiredStar}</label>
                <select {...register("rentedPeriod", { required: watchOffering === "Rent" })} className={inputClass}>
                  <option value="Per Year">Per Year</option>
                  <option value="Per Month">Per Month</option>
                  <option value="Per Week">Per Week</option>
                  <option value="Per Day">Per Day</option>
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>Status</label>
              <select {...register("status")} className={inputClass}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== SECTION 2: COMPLIANCE ===== */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<ShieldCheck />} title="License & Compliance" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Permit Authority {requiredStar}</label>
              <select {...register("permitType", { required: true })} className={inputClass}>
                <option value="RERA">RERA (Dubai)</option>
                <option value="DTC">DTC</option>
                <option value="DIFC">DIFC</option>
                <option value="JAFZA">JAFZA</option>
                <option value="None">None</option>
              </select>
            </div>
            {watchPermit === "RERA" && (
              <>
                <div>
                  <label className={labelClass}>Trakheesi Number</label>
                  <input {...register("trakheesiNumber")} className={inputClass} placeholder="Permit ID" />
                </div>
                <div>
                  <label className={labelClass}>RERA ORN</label>
                  <input {...register("reraORN")} className={inputClass} placeholder="ORN Number" />
                </div>
                <div>
                  <label className={labelClass}>BRN Number</label>
                  <input {...register("brnNumber")} className={inputClass} placeholder="BRN Number" />
                </div>
              </>
            )}
            <div>
              <label className={labelClass}>Owner Name</label>
              <input {...register("ownerName")} className={inputClass} placeholder="Full Name" />
            </div>
            {watchCategory === "Off-Plan" && (
              <div className="border border-dashed border-amber-500/20 p-3 rounded-xl bg-amber-500/5">
                <label className={`${labelClass} text-amber-500`}>Developer Partner</label>
                <select {...register("developerId")} className={inputClass}>
                  <option value="">{loadingDevs ? "Fetching..." : "Select Developer..."}</option>
                  {developers.map((dev) => (
                    <option key={dev._id} value={dev._id}>{dev.companyName}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ===== SECTION 3: SPECIFICATIONS ===== */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Layers />} title="Physical Specifications" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className={labelClass}>Bedrooms</label>
              <select {...register("bedroom")} className={inputClass}>
                {[...Array(21).keys()].map((i) => (
                  <option key={i} value={i}>{i === 0 ? "Studio" : i + " Beds"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <select {...register("bathroom")} className={inputClass}>
                {[...Array(11).keys()].map((i) => (
                  <option key={i} value={i}>{i} Baths</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Total Floors</label>
              <input type="number" {...register("totalFloor")} className={inputClass} placeholder="Floors" />
            </div>
            <div>
              <label className={labelClass}>Area (sqft) {requiredStar}</label>
              <input type="number" {...register("squarefoot", { required: true })} className={inputClass} placeholder="Size in sqft" />
            </div>
            <div>
              <label className={labelClass}>Unit/Suite No</label>
              <input {...register("unitNo")} className={inputClass} placeholder="e.g., 1201" />
            </div>
            <div>
              <label className={labelClass}>Parking Slots</label>
              <input type="number" {...register("parkingSlots")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Furnishing Type</label>
              <select {...register("furnishingType")} className={inputClass}>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Furnished">Furnished</option>
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
              <label className={labelClass}>Availability</label>
              <select {...register("availability")} className={inputClass}>
                <option value="Immediately">Immediately</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== SECTION 4: LOCATION ===== */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<MapPin />} title="Location & Geography" />
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Community {requiredStar}</label>
                <select {...register("community", { required: true })} className={inputClass}>
                  <option value="">Select Area...</option>
                  {DUBAI_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Full Address {requiredStar}</label>
                <input {...register("address", { required: true })} className={inputClass} placeholder="Complete Address" />
              </div>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>Nearby Locations</label>
              {fields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl items-end">
                  <div className="md:col-span-2">
                    <input {...register(`nearByLocations.${index}.locationName`, { required: true })} placeholder="Landmark Name" className={inputClass} />
                  </div>
                  <div>
                    <input {...register(`nearByLocations.${index}.distance`, { required: true })} placeholder="Distance (e.g., 5 min)" className={inputClass} />
                  </div>
                  <div>
                    <select {...register(`nearByLocations.${index}.transportType`)} className={inputClass}>
                      <option value="Drive">Drive</option>
                      <option value="Walk">Walk</option>
                      <option value="Metro">Metro</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => remove(index)} className="h-14 px-4 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => append({ locationName: "", distance: "", transportType: "Drive" })} className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 tracking-widest">
                <Plus size={14} /> Add Nearby Location
              </button>
            </div>
          </div>
        </div>

        {/* ===== SECTION 5: DESCRIPTION ===== */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <div className="flex justify-between items-center mb-6">
            <SectionHeader icon={<FileText />} title="Description" />
            {/* Language toggle – you can add if needed */}
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Description (English) {requiredStar}</label>
              <textarea rows={5} {...register("descriptionEn", { required: true })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description (Arabic)</label>
              <textarea rows={5} {...register("descriptionAr")} className={`${inputClass} text-right font-arabic`} />
            </div>
          </div>
        </div>

        {/* ===== SECTION 6: PRICING ===== */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Wallet />} title="Pricing & Valuation" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Price {requiredStar}</label>
              <input type="number" {...register("price", { required: true })} className={`${inputClass} text-xl font-black text-amber-500`} placeholder="0.00" />
            </div>
            <div>
              <label className={labelClass}>Currency {requiredStar}</label>
              <select {...register("currency")} className={inputClass}>
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
            {watchOffering === "Rent" && (
              <div>
                <label className={labelClass}>Number of Cheques</label>
                <select {...register("cheques")} className={inputClass}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8,9,10,12].map(c => <option key={c} value={c}>{c} Cheques</option>)}
                </select>
              </div>
            )}
            {watchCategory === "Off-Plan" && (
              <>
                <div>
                  <label className={labelClass}>Delivery Date</label>
                  <input {...register("deliveryDate")} className={inputClass} placeholder="Q4 2026" />
                </div>
                <div>
                  <label className={labelClass}>Completion %</label>
                  <input type="number" {...register("completionPercentage")} className={inputClass} placeholder="e.g., 45" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Payment Plan</label>
                  <textarea {...register("paymentPlan")} className={inputClass} rows={2} placeholder="e.g., 60/40 post-handover" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ===== SECTION 7: MEDIA ===== */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Camera />} title="Media Portfolio" />
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Existing Images</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10 bg-black/20">
                      <img src={`${IMAGE_BASE_URL}${img}`} className="w-full h-full object-cover" alt="existing" />
                      <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                  {existingImages.length === 0 && <p className="text-[10px] text-slate-500 col-span-3 text-center py-4">No images</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>Add New Images</label>
                <div onClick={() => inputRef.current.click()} className="border-2 border-dashed border-slate-700/50 rounded-2xl p-8 text-center cursor-pointer hover:bg-amber-500/5 transition-all">
                  <Upload className="mx-auto mb-2 text-amber-500" size={24} />
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Drop New Visuals Here</p>
                  <input type="file" ref={inputRef} multiple hidden accept="image/*" onChange={(e) => setNewFiles([...newFiles, ...Array.from(e.target.files)])} />
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {newFiles.map((f, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden group border border-white/10">
                      <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="new" />
                      <button type="button" onClick={() => setNewFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className={labelClass}>Video URL</label><input {...register("videos")} className={inputClass} placeholder="Video URL" /></div>
              <div><label className={labelClass}>Virtual Tour 360</label><input {...register("virtualTour360")} className={inputClass} placeholder="Matterport URL" /></div>
              <div><label className={labelClass}>Video Tour Link</label><input {...register("videoTourLink")} className={inputClass} placeholder="YouTube/Vimeo URL" /></div>
            </div>
          </div>
        </div>

        {/* ===== SECTION 8: AMENITIES ===== */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Sparkles />} title="Amenities & Facilities" />
          <div className="mb-5">
            <input type="text" placeholder="Search amenities..." value={searchAmenity} onChange={(e) => setSearchAmenity(e.target.value)} className={`w-full px-4 py-3 rounded-xl outline-none border text-sm font-medium transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-black"}`} />
          </div>
          <div className="max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {AMENITIES.filter(a => a.toLowerCase().includes(searchAmenity.toLowerCase())).map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 min-h-[90px] ${isSelected ? "bg-amber-500 border-amber-500 text-black shadow-md" : "bg-black/5 dark:bg-white/5 border-transparent text-slate-500 hover:border-amber-500/30"}`}>
                    {isSelected ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                    <span className="text-[10px] font-black uppercase text-center leading-tight">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">{React.cloneElement(icon, { size: 18 })}</div>
    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h2>
  </div>
);

export default UpdateProperty;