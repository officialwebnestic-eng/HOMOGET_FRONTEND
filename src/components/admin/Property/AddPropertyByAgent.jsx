import React, { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { AuthContext } from "../../../context/AuthContext";
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
  Layers,
  Home,
  Camera,
  CheckCircle2,
  Hash,
  DollarSign,
  FileCheck,
  UserCheck,
  Building,
  QrCode,
  ChevronRight,
  ChevronLeft,
  Save,
  Calendar,
  Clock,
  AlertCircle
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";
import { AMENITIES } from "../../../helpers/AddPropertyHelpers";
import LocationSearch from "./LocationSearch";

const AddPropertyByAgent = () => {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const { user } = useContext(AuthContext);
  const isDark = theme === "dark";

  // --- States ---
  const [files, setFiles] = useState([]);
  const [offPlanDocuments, setOffPlanDocuments] = useState([]);
  const [ownerDocuments, setOwnerDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [langTab, setLangTab] = useState("en");
  const [developers, setDevelopers] = useState([]);
  const [loadingDevs, setLoadingDevs] = useState(false);
  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [searchAmenity, setSearchAmenity] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [dldQRFile, setDldQRFile] = useState(null);
  const [dldQRPreview, setDldQRPreview] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check if user is freelancer
  const isFreelancer = user?.role?.toLowerCase() === 'freelancer';

  const filteredAmenities = AMENITIES.filter((item) =>
    item.toLowerCase().includes(searchAmenity.toLowerCase())
  );

  const CURRENCIES = ["AED", "USD", "EUR", "GBP", "INR", "SAR", "QAR", "OMR", "KWD", "BHD"];

  // Generate Reference Number
  const generateReferenceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `HMG-${year}-${random}`;
  };

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
      trakheesiNumber: "",
      refrenceNo: generateReferenceNumber(),
      locationName: "",
      locationAddress: "",
      locationPlaceId: "",
      locationLat: "",
      locationLng: "",
      locationType: "",
      displayAddress: "",
      address: "",
      coordinates: {},
      nearByLocations: [{ locationName: "", distance: "", transportType: "Drive" }],
      nearByProjects: [],
      offPlanType: "Direct",
      deliveryDate: "",
      completionPercentage: "",
      paymentPlan: "",
      offPlanNocNumber: "",
      offPlanPermitNumber: "",
      offPlanSecondaryNocNumber: "",
      offPlanSecondaryPermitNumber: "",
      originalOffPlanPermitNumber: "",
      assignmentContractNumber: "",
      ownerIdNumber: "",
      ownerEmiratesId: "",
      ownerPassportNumber: "",
      ownerVisaCopy: "",
      dldQRCode: "",
      dldExpiryDate: "",
      listingStartDate: new Date().toISOString().split('T')[0],
      listingEndDate: "",
      zoneName: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nearByLocations",
  });

  const watchCategory = watch("category");
  const watchOffering = watch("offeringType");
  const watchPermit = watch("permitType");
  const watchAmenities = watch("amenities") || [];
  const isOffPlan = watchCategory === "Off-Plan";
  const watchOffPlanType = watch("offPlanType");

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

  const formSteps = [
    { id: "basic", label: "Basic Info", icon: <Home size={16} /> },
    { id: "listing", label: "Listing Period", icon: <Calendar size={16} /> },
    { id: "compliance", label: "Compliance", icon: <ShieldCheck size={16} /> },
    { id: "specs", label: "Specifications", icon: <Layers size={16} /> },
    { id: "location", label: "Location", icon: <MapPin size={16} /> },
    { id: "offplan", label: "Off-Plan", icon: <Building size={16} />, condition: isOffPlan },
    { id: "documents", label: "Documents", icon: <FileText size={16} /> },
    { id: "dld", label: "DLD QR", icon: <QrCode size={16} /> },
    { id: "media", label: "Media", icon: <Camera size={16} /> },
    { id: "amenities", label: "Amenities", icon: <Sparkles size={16} /> },
    { id: "pricing", label: "Pricing", icon: <DollarSign size={16} /> },
  ];

  const visibleSteps = formSteps.filter(step => step.condition !== false);
  const totalSteps = visibleSteps.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      const element = document.getElementById(visibleSteps[currentStep + 1].id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const element = document.getElementById(visibleSteps[currentStep - 1].id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

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

  const handleLocationSelect = (location) => {
    if (location) {
      setSelectedLocationData(location);
      setValue("locationId", location.id || location.location_id);
      setValue("locationPath", location.path || `${location.id}`);
      setValue("locationName", location.name);
      setValue("locationAddress", location.title);
      setValue("locationPlaceId", location.location_id);
      setValue("locationLat", location.coordinates?.lat);
      setValue("locationLng", location.coordinates?.lon);
      setValue("locationType", location.type);
      
      const displayAddr = location.title || location.subtitle || `${location.name}, Dubai`;
      setValue("displayAddress", displayAddr);
      setValue("address", displayAddr);
      
      if (location.coordinates) {
        setValue("coordinates", location.coordinates);
      }
      
      addToast(`Location selected: ${location.name || location.title}`, "success");
    } else {
      setSelectedLocationData(null);
      setValue("locationId", "");
      setValue("locationPath", "");
      setValue("locationName", "");
      setValue("locationAddress", "");
      setValue("locationPlaceId", "");
      setValue("locationLat", "");
      setValue("locationLng", "");
      setValue("locationType", "");
      setValue("displayAddress", "");
      setValue("address", "");
      setValue("coordinates", "");
    }
  };

  const handleDldQRUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDldQRFile(file);
      const previewUrl = URL.createObjectURL(file);
      setDldQRPreview(previewUrl);
      addToast("DLD QR Code uploaded successfully", "success");
    }
  };

  const removeDldQR = () => {
    setDldQRFile(null);
    if (dldQRPreview) {
      URL.revokeObjectURL(dldQRPreview);
      setDldQRPreview(null);
    }
    setValue("dldQRCode", "");
  };

  const handleOffPlanDocumentUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setOffPlanDocuments(prev => [...prev, ...selectedFiles]);
  };

  const handleOwnerDocumentUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setOwnerDocuments(prev => [...prev, ...selectedFiles]);
  };

  const removeOffPlanDocument = (index) => {
    setOffPlanDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removeOwnerDocument = (index) => {
    setOwnerDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    const current = watchAmenities;
    setValue(
      "amenities",
      current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity]
    );
  };

  const onSubmit = async (data) => {
    if (files.length === 0) {
      addToast("Media Portfolio Required", "error");
      return;
    }
    
    if (!data.locationName && !data.displayAddress) {
      addToast("Please select a valid location from the search", "error");
      return;
    }
    
    if (!user?.id) {
      addToast("User not authenticated", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // ✅ Approval logic based on user role
      const requiresApproval = isFreelancer;
      
      const payload = {
        propertyTitleEn: data.propertyTitleEn,
        propertyTitleAr: data.propertyTitleAr || "",
        price: Number(data.price),
        currency: data.currency,
        category: data.category,
        propertytype: data.propertytype,
        offeringType: data.offeringType,
        rentedPeriod: data.rentedPeriod || "",
        cheques: data.cheques ? Number(data.cheques) : undefined,
        developerId: data.developerId || null,
        agentId: user.id,
        permitType: data.permitType,
        trakheesiNumber: data.trakheesiNumber || "",
        reraORN: data.reraORN || "",
        brnNumber: data.brnNumber || "",
        ownerName: data.ownerName || "",
        bedroom: Number(data.bedroom) || 0,
        bathroom: Number(data.bathroom) || 0,
        totalFloor: data.totalFloor ? Number(data.totalFloor) : undefined,
        squarefoot: Number(data.squarefoot),
        unitNo: data.unitNo || "",
        parkingSlots: Number(data.parkingSlots) || 0,
        furnishingType: data.furnishingType || "Unfurnished",
        propertyAge: data.propertyAge || "Brand New",
        availability: data.availability || "Immediately",
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr || "",
        locationName: data.locationName || "",
        locationAddress: data.locationAddress || data.displayAddress || "",
        locationPlaceId: data.locationPlaceId || "",
        locationLat: data.locationLat ? Number(data.locationLat) : null,
        locationLng: data.locationLng ? Number(data.locationLng) : null,
        locationType: data.locationType || "",
        displayAddress: data.displayAddress || "",
        address: data.address || data.displayAddress || "",
        coordinates: data.coordinates || {},
        amenities: data.amenities || [],
        nearByLocations: data.nearByLocations || [],
        videos: data.videos || "",
        virtualTour360: data.virtualTour360 || "",
        videoTourLink: data.videoTourLink || "",
        refrenceNo: data.refrenceNo,
        userType: isFreelancer ? 'freelancer' : 'agent',
        // Approval workflow fields
        requiresApproval: requiresApproval,
        isApproved: !requiresApproval,
        submittedAt: new Date().toISOString(),
        // Off-Plan fields
        offPlanType: isOffPlan ? data.offPlanType : undefined,
        deliveryDate: data.deliveryDate || "",
        completionPercentage: data.completionPercentage ? Number(data.completionPercentage) : null,
        paymentPlan: data.paymentPlan || "",
        offPlanNocNumber: data.offPlanNocNumber || "",
        offPlanPermitNumber: data.offPlanPermitNumber || "",
        offPlanSecondaryNocNumber: data.offPlanSecondaryNocNumber || "",
        offPlanSecondaryPermitNumber: data.offPlanSecondaryPermitNumber || "",
        originalOffPlanPermitNumber: data.originalOffPlanPermitNumber || "",
        assignmentContractNumber: data.assignmentContractNumber || "",
        ownerIdNumber: data.ownerIdNumber || "",
        ownerEmiratesId: data.ownerEmiratesId || "",
        ownerPassportNumber: data.ownerPassportNumber || "",
        ownerVisaCopy: data.ownerVisaCopy || "",
        dldExpiryDate: data.dldExpiryDate || "",
        listingStartDate: data.listingStartDate || new Date().toISOString().split('T')[0],
        listingEndDate: data.listingEndDate || "",
        zoneName: data.zoneName || "",
      };
      
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null && payload[key] !== "") {
          if (typeof payload[key] === "object") {
            formData.append(key, JSON.stringify(payload[key]));
          } else {
            formData.append(key, payload[key]);
          }
        }
      });
      
      files.forEach((file) => formData.append("image", file));
      offPlanDocuments.forEach((doc) => formData.append("offPlanDocuments", doc));
      ownerDocuments.forEach((doc) => formData.append("ownerDocuments", doc));
      
      if (dldQRFile) {
        formData.append("dldQRCode", dldQRFile);
      }
      
      const res = await http.post("/addproperty", formData, { withCredentials: true });
      
      if (res.data.success) {
        const successMessage = requiresApproval 
          ? "Property submitted for admin approval. You will be notified once approved."
          : "Property Added Successfully";
        addToast(successMessage, "success");
        
        reset();
        setFiles([]);
        setOffPlanDocuments([]);
        setOwnerDocuments([]);
        setDldQRFile(null);
        setDldQRPreview(null);
        setSelectedLocationData(null);
        setValue("refrenceNo", generateReferenceNumber());
        setCurrentStep(0);
      }
    } catch (e) {
      console.error("Submission error:", e);
      addToast(e.response?.data?.message || "Failed to add property", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all text-sm font-medium ${
    isDark ? "bg-[#1A1F2B] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
  }`;
  const labelClass = "text-[10px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider";
  const requiredStar = <span className="text-red-500 ml-0.5">*</span>;

  return (
    <div className={`min-h-screen ${isDark ? "bg-gradient-to-br from-[#0F1219] via-[#0F1219] to-[#1a1f2e]" : "bg-gradient-to-br from-[#F8FAFC] via-[#F8FAFC] to-[#f1f5f9]"}`}>
      
      {/* Freelancer Warning Banner */}
      {isFreelancer && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-auto max-w-2xl">
          <div className="px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-md flex items-center gap-3 shadow-lg">
            <AlertCircle size={16} className="text-amber-500" />
            <p className="text-[11px] font-medium text-amber-500">
              ⚡ Freelancer Mode: Your property will be submitted for admin approval before publishing.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 border-b backdrop-blur-xl transition-all duration-300 z-30 ${isDark ? "bg-[#0F1219]/95 border-white/5" : "bg-white/95 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-3 md:py-0 md:h-20">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="text-white w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div>
                <h1 className="text-sm md:text-lg font-black uppercase italic leading-none tracking-tight">
                  Homoget <span className="text-amber-500">Dubai</span>
                </h1>
                <p className="hidden sm:block text-[7px] md:text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">
                  Agent Portal • Add Property
                </p>
              </div>
            </div>

            <div className={`hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl ${isDark ? "bg-amber-500/5 border border-amber-500/20" : "bg-amber-50 border border-amber-200"}`}>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Hash size={14} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[8px] uppercase font-bold text-slate-500 tracking-wider">Reference Number</p>
                <p className="text-sm font-mono font-bold text-amber-500">{watch("refrenceNo") || "Auto-generated"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="group relative px-4 md:px-6 lg:px-8 py-2 md:py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {isSubmitting ? <Loader2 className="animate-spin w-3 h-3 md:w-4 md:h-4" /> : <Save className="w-3 h-3 md:w-4 md:h-4" />}
                <span className="hidden xs:inline">{isSubmitting ? "Syncing..." : "Launch Asset"}</span>
                <span className="xs:hidden">{isSubmitting ? "Sync" : "Launch"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Step {currentStep + 1} of {totalSteps}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`p-2 rounded-lg transition-all ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500/20'} ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === totalSteps - 1}
                className={`p-2 rounded-lg transition-all ${currentStep === totalSteps - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500/20'} ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="flex gap-1">
            {visibleSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex-1 h-1 rounded-full transition-all ${
                  idx <= currentStep ? 'bg-amber-500' : isDark ? 'bg-white/10' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className={`hidden lg:block w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <div className={`sticky top-24 rounded-xl p-3 ${isDark ? 'bg-[#161B26]/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} shadow-lg border ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
              <div className="space-y-1">
                {visibleSteps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      setCurrentStep(idx);
                      const element = document.getElementById(step.id);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      currentStep === idx
                        ? "bg-amber-500 text-black shadow-md"
                        : isDark
                          ? "hover:bg-white/10 text-slate-400"
                          : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep === idx
                        ? "bg-black text-amber-500"
                        : isDark ? "bg-white/20 text-slate-300" : "bg-slate-200 text-slate-600"
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium">{step.label}</span>
                    {step.id === "offplan" && isOffPlan && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Form Content */}
          <div className="flex-1 space-y-6">
            {/* SECTION 1: BASIC INFO */}
            <div id="basic" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<Home />} title="Basic Information" currentStep={currentStep} stepIndex={0} />
              
              <div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4 items-end p-4 rounded-xl bg-gradient-to-br from-amber-500/[0.03] to-transparent border border-amber-500/10">
                <div className="lg:col-span-4">
                  <label className={`${labelClass} flex items-center gap-1.5 mb-2`}>
                    <Hash size={14} className="text-amber-500" />
                    Reference Number {requiredStar}
                  </label>
                  <input {...register("refrenceNo", { required: true })} className={`${inputClass} w-full font-mono tracking-wider`} readOnly />
                  {errors.refrenceNo && <p className="text-red-500 text-[9px] mt-1">Required</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Property Title (English) {requiredStar}</label>
                  <input {...register("propertyTitleEn", { required: true })} className={inputClass} />
                  {errors.propertyTitleEn && <p className="text-red-500 text-[9px] mt-1">Required</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Property Title (Arabic)</label>
                  <input {...register("propertyTitleAr")} className={`${inputClass} text-right`} dir="rtl" />
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
                    {getPropertyTypes().map((t) => (<option key={t} value={t}>{t}</option>))}
                  </select>
                  {errors.propertytype && <p className="text-red-500 text-[9px] mt-1">Required</p>}
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
              </div>
            </div>

            {/* LISTING DATES SECTION */}
            <div id="listing" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<Calendar />} title="Listing Period" currentStep={currentStep} stepIndex={1} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Listing Start Date</label>
                  <input type="date" {...register("listingStartDate")} className={inputClass} />
                  <p className="text-[8px] text-slate-400 mt-1">Date when the property becomes available</p>
                </div>
                <div>
                  <label className={labelClass}>Listing End Date</label>
                  <input type="date" {...register("listingEndDate")} className={inputClass} />
                  <p className="text-[8px] text-slate-400 mt-1">Leave empty for no expiry</p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-medium text-slate-500">Listing Status:</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    watch("listingEndDate") && new Date(watch("listingEndDate")) < new Date()
                      ? "bg-red-500/20 text-red-500"
                      : "bg-green-500/20 text-green-500"
                  }`}>
                    {watch("listingEndDate") && new Date(watch("listingEndDate")) < new Date() ? "Expired" : "Active"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[8px] text-slate-400">Period:</span>
                  <span className="text-[8px] font-mono">
                    {watch("listingStartDate") 
                      ? new Date(watch("listingStartDate")).toLocaleDateString() 
                      : "Not set"} 
                    {watch("listingEndDate") 
                      ? ` → ${new Date(watch("listingEndDate")).toLocaleDateString()}` 
                      : " → No expiry"}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: COMPLIANCE */}
            <div id="compliance" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<ShieldCheck />} title="License & Compliance" currentStep={currentStep} stepIndex={2} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <div>
                    <label className={labelClass}>PERMIT Number</label>
                    <input {...register("trakheesiNumber")} className={inputClass} />
                  </div>
                )}
                <div>
                  <label className={labelClass}>Owner Name</label>
                  <input {...register("ownerName")} className={inputClass} />
                </div>
                {watchCategory === "Off-Plan" && (
                  <div>
                    <label className={`${labelClass} text-amber-500`}>Developer Partner</label>
                    <select {...register("developerId")} className={inputClass}>
                      <option value="">{loadingDevs ? "Fetching..." : "Select Developer..."}</option>
                      {developers.map((dev) => (<option key={dev._id} value={dev._id}>{dev.companyName}</option>))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: SPECIFICATIONS */}
            <div id="specs" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<Layers />} title="Physical Specifications" currentStep={currentStep} stepIndex={3} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Bedrooms</label>
                  <select {...register("bedroom")} className={inputClass}>
                    {[...Array(21).keys()].map((i) => (<option key={i} value={i}>{i === 0 ? "Studio" : i}</option>))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bathrooms</label>
                  <select {...register("bathroom")} className={inputClass}>
                    {[...Array(11).keys()].map((i) => (<option key={i} value={i}>{i}</option>))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Total Floors</label>
                  <input type="number" {...register("totalFloor")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Area (sqft) {requiredStar}</label>
                  <input type="number" {...register("squarefoot", { required: true })} className={inputClass} />
                  {errors.squarefoot && <p className="text-red-500 text-[9px] mt-1">Required</p>}
                </div>
                <div>
                  <label className={labelClass}>Unit/Suite No</label>
                  <input {...register("unitNo")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Parking Slots</label>
                  <input type="number" {...register("parkingSlots")} className={inputClass} defaultValue={0} />
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

            {/* SECTION 4: LOCATION */}
            <div id="location" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<MapPin />} title="Location" currentStep={currentStep} stepIndex={4} />
              
              <LocationSearch 
                onLocationSelect={handleLocationSelect}
                initialValue=""
                isDark={isDark}
                error={errors.locationName?.message}
                required={true}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Display Address {requiredStar}</label>
                  <input {...register("displayAddress", { required: true })} className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Full Address {requiredStar}</label>
                  <input {...register("address", { required: true })} className={inputClass} />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <label className={labelClass}>Nearby Locations</label>
                {fields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-xl items-end">
                    <div className="md:col-span-2">
                      <input {...register(`nearByLocations.${index}.locationName`)} placeholder="Landmark Name" className={inputClass} />
                    </div>
                    <div>
                      <input {...register(`nearByLocations.${index}.distance`)} placeholder="Distance (e.g., 5 min)" className={inputClass} />
                    </div>
                    <div>
                      <select {...register(`nearByLocations.${index}.transportType`)} className={inputClass}>
                        <option value="Drive">Drive</option>
                        <option value="Walk">Walk</option>
                        <option value="Metro">Metro</option>
                      </select>
                    </div>
                    <button type="button" onClick={() => remove(index)} className="h-12 px-3 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => append({ locationName: "", distance: "", transportType: "Drive" })} className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 hover:gap-3 transition-all">
                  <Plus size={14} /> Add Nearby Location
                </button>
              </div>
            </div>

            {/* OFF-PLAN DETAILS SECTION */}
            {isOffPlan && (
              <div id="offplan" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
                <SectionHeader icon={<Building />} title="Off-Plan Details" currentStep={currentStep} stepIndex={5} />
                
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                  <label className={`${labelClass} text-purple-500`}>Off-Plan Type {requiredStar}</label>
                  <select {...register("offPlanType", { required: true })} className={inputClass}>
                    <option value="Direct">Direct</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Resale">Resale</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>

                {watchOffPlanType === "Direct" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Off-Plan NOC Number</label>
                      <input {...register("offPlanNocNumber")} className={inputClass} placeholder="e.g., DLD-NOC-2024-00123" />
                    </div>
                    <div>
                      <label className={labelClass}>Off-Plan Permit Number</label>
                      <input {...register("offPlanPermitNumber")} className={inputClass} placeholder="e.g., RERA-OPP-2024-456" />
                    </div>
                  </div>
                )}

                {(watchOffPlanType === "Secondary" || watchOffPlanType === "Resale" || watchOffPlanType === "Assignment") && (
                  <div className="space-y-5">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Info size={14} className="text-amber-500" />
                        <span className="text-xs font-bold text-amber-500">Original Developer Details</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Original Off-Plan Permit Number</label>
                          <input {...register("originalOffPlanPermitNumber")} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Assignment Contract Number</label>
                          <input {...register("assignmentContractNumber")} className={inputClass} />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Secondary NOC Number</label>
                        <input {...register("offPlanSecondaryNocNumber")} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Secondary Permit Number</label>
                        <input {...register("offPlanSecondaryPermitNumber")} className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t border-purple-500/20">
                  <div>
                    <label className={labelClass}>Delivery Date</label>
                    <input type="date" {...register("deliveryDate")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Completion %</label>
                    <input type="number" {...register("completionPercentage")} className={inputClass} placeholder="65" step="5" />
                  </div>
                  <div>
                    <label className={labelClass}>Payment Plan</label>
                    <select {...register("paymentPlan")} className={inputClass}>
                      <option value="">Select Payment Plan</option>
                      <option value="50/50">50/50 Post Handover</option>
                      <option value="60/40">60/40 Post Handover</option>
                      <option value="70/30">70/30 Post Handover</option>
                      <option value="80/20">80/20 Post Handover</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS SECTION */}
            <div id="documents" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<FileText />} title="Documents" currentStep={currentStep} stepIndex={isOffPlan ? 6 : 5} />
              
              {isOffPlan && watchOffPlanType === "Direct" && (
                <div className={`mb-6 p-5 rounded-xl ${isDark ? 'bg-purple-500/5 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <FileCheck size={18} className="text-purple-500" />
                    <h3 className="text-sm font-bold">Off-Plan Documents (NOC & Permit)</h3>
                  </div>
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    offPlanDocuments.length > 0 ? "border-purple-400 bg-purple-50 dark:bg-purple-950" : "border-gray-300"
                  }`} onClick={() => document.getElementById("offPlanDocsInput")?.click()}>
                    <input id="offPlanDocsInput" type="file" multiple className="hidden" onChange={handleOffPlanDocumentUpload} />
                    <Upload size={28} className="mx-auto mb-1 text-gray-400" />
                    <p className="text-xs">Upload NOC, Permit, Escrow documents</p>
                  </div>
                  {offPlanDocuments.length > 0 && (
                    <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                      {offPlanDocuments.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-700">
                          <span className="text-xs truncate">{doc.name}</span>
                          <button onClick={() => removeOffPlanDocument(idx)} className="text-red-500"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(watchOffPlanType === "Secondary" || watchOffPlanType === "Resale" || watchOffPlanType === "Assignment") && (
                <div className={`p-5 rounded-xl ${isDark ? 'bg-blue-500/5 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <UserCheck size={18} className="text-blue-500" />
                    <h3 className="text-sm font-bold">Secondary Market Documents</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Owner ID Number</label><input {...register("ownerIdNumber")} className={inputClass} /></div>
                    <div><label className={labelClass}>Emirates ID</label><input {...register("ownerEmiratesId")} className={inputClass} /></div>
                    <div><label className={labelClass}>Passport Number</label><input {...register("ownerPassportNumber")} className={inputClass} /></div>
                    <div><label className={labelClass}>Visa Copy Number</label><input {...register("ownerVisaCopy")} className={inputClass} /></div>
                  </div>
                  <div className="mt-4">
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      ownerDocuments.length > 0 ? "border-blue-400 bg-blue-50 dark:bg-blue-950" : "border-gray-300"
                    }`} onClick={() => document.getElementById("ownerDocsInput")?.click()}>
                      <input id="ownerDocsInput" type="file" multiple className="hidden" onChange={handleOwnerDocumentUpload} />
                      <Upload size={28} className="mx-auto mb-1 text-gray-400" />
                      <p className="text-xs">Upload assignment deed, secondary NOC, and owner documents</p>
                    </div>
                    {ownerDocuments.length > 0 && (
                      <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                        {ownerDocuments.map((doc, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-700">
                            <span className="text-xs truncate">{doc.name}</span>
                            <button onClick={() => removeOwnerDocument(idx)} className="text-red-500"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* DLD QR CODE SECTION */}
            <div id="dld" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<QrCode />} title="DLD QR Code" currentStep={currentStep} stepIndex={7} />
            
              <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <QrCode size={18} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>DLD Verified QR Code</h3>
                    <p className="text-[9px] text-slate-500">Upload official Dubai Land Department QR code</p>
                  </div>
                </div>
                
                <div>
                  <label className={labelClass}>DLD QR Expiry Date</label>
                  <input type="date" {...register("dldExpiryDate")} className={inputClass} />
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Zone Name</label>
                  <input type="text" {...register("zoneName")} className={inputClass} placeholder="e.g., Dubai Marina, Downtown Dubai" />
                </div>
                
                <div className="mt-4">
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    dldQRPreview ? "border-green-400 bg-green-50 dark:bg-green-950" : "border-gray-300 dark:border-gray-600 hover:border-green-400"
                  }`} onClick={() => document.getElementById("dldQRInput")?.click()}>
                    <input id="dldQRInput" type="file" accept="image/*" className="hidden" onChange={handleDldQRUpload} />
                    {dldQRPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={dldQRPreview} alt="DLD QR" className="w-20 h-20 object-contain" />
                        <p className="text-xs font-medium text-green-600">✓ QR Code uploaded</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeDldQR(); }} className="text-xs text-red-500">Remove</button>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-xs font-medium">Click to upload DLD QR Code</p>
                        <p className="text-[9px] text-gray-500 mt-1">PNG, JPG, JPEG (Max 2MB)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION SECTION */}
            <div className={`p-6 md:p-8 rounded-2xl border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <div className="flex justify-between items-center mb-5">
                <SectionHeader icon={<FileText />} title="Description" currentStep={currentStep} stepIndex={isOffPlan ? 8 : 6} />
                <div className="flex gap-1 p-1 rounded-lg bg-black/10 dark:bg-white/10">
                  {["en", "ar"].map((l) => (
                    <button key={l} type="button" onClick={() => setLangTab(l)} className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${langTab === l ? "bg-amber-500 text-black" : "text-slate-500"}`}>
                      {l === "en" ? "English" : "العربية"}
                    </button>
                  ))}
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={langTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <textarea rows={5} {...register(langTab === "en" ? "descriptionEn" : "descriptionAr", { required: true })} className={inputClass} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* MEDIA SECTION */}
            <div id="media" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<Camera />} title="Media" currentStep={currentStep} stepIndex={isOffPlan ? 9 : 7} />
              <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-amber-500/5 transition-all" onClick={() => document.getElementById("file-up")?.click()}>
                <Upload className="mx-auto mb-2 text-amber-500" size={28} />
                <p className="text-[10px] font-bold uppercase">Drop Images Here {requiredStar}</p>
                <input id="file-up" type="file" multiple hidden accept="image/*" onChange={(e) => setFiles([...files, ...Array.from(e.target.files || [])])} />
              </div>
              {files.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {files.map((f, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group border">
                      <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <X className="text-white" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div><label className={labelClass}>Video URL</label><input {...register("videos")} className={inputClass} placeholder="https://youtube.com/..." /></div>
                <div><label className={labelClass}>Virtual Tour 360</label><input {...register("virtualTour360")} className={inputClass} placeholder="Matterport URL" /></div>
                <div><label className={labelClass}>Video Tour Link</label><input {...register("videoTourLink")} className={inputClass} /></div>
              </div>
            </div>

            {/* AMENITIES SECTION */}
            <div id="amenities" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<Sparkles />} title="Amenities" currentStep={currentStep} stepIndex={isOffPlan ? 10 : 8} />
              <input type="text" placeholder="Search amenities..." value={searchAmenity} onChange={(e) => setSearchAmenity(e.target.value)} className={inputClass} />
              <div className="max-h-80 overflow-y-auto mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {filteredAmenities.map((amenity) => {
                    const isSelected = watchAmenities.includes(amenity);
                    return (
                      <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-[10px] font-medium ${
                        isSelected ? "bg-amber-500 border-amber-500 text-black" : isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                      }`}>
                        {isSelected ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PRICING SECTION */}
            <div id="pricing" className={`p-6 md:p-8 rounded-2xl border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
              <SectionHeader icon={<Wallet />} title="Pricing" currentStep={currentStep} stepIndex={isOffPlan ? 11 : 9} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Price {requiredStar}</label>
                  <input type="number" {...register("price", { required: true })} className={`${inputClass} text-lg font-bold text-amber-500`} />
                  {errors.price && <p className="text-red-500 text-[9px] mt-1">Required</p>}
                </div>
                <div>
                  <label className={labelClass}>Currency {requiredStar}</label>
                  <select {...register("currency")} className={inputClass}>
                    {CURRENCIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                {watchOffering === "Rent" && (
                  <div>
                    <label className={labelClass}>Number of Cheques</label>
                    <select {...register("cheques")} className={inputClass}>
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((c) => (<option key={c} value={c}>{c} Cheques</option>))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Form Navigation Buttons */}
            <div className="flex justify-between pt-6 pb-12">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  currentStep === 0 
                    ? 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-700' 
                    : 'bg-amber-500 text-black hover:bg-amber-600'
                }`}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              {currentStep === totalSteps - 1 ? (
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {isSubmitting ? "Submitting..." : "Submit Property"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-amber-500 text-black hover:bg-amber-600 transition-all flex items-center gap-2"
                >
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        .scroll-mt-24 {
          scroll-margin-top: 100px;
        }
      `}</style>
    </div>
  );
};

const SectionHeader = ({ icon, title, currentStep, stepIndex }) => (
  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-amber-500/20">
    <div className="p-2 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-lg text-amber-500">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h2>
      <div className="w-12 h-0.5 bg-amber-500 mt-1"></div>
    </div>
    {currentStep !== undefined && stepIndex !== undefined && currentStep !== stepIndex && (
      <div className="ml-auto">
        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center">
          <ChevronRight size={12} className="text-slate-400" />
        </div>
      </div>
    )}
  </div>
);

export default AddPropertyByAgent;