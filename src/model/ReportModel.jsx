// ReportModal.jsx
import React, { useState } from "react";
import { 
  X, 
  AlertTriangle, 
  Flag, 
  FileText, 
  User, 
  Mail, 
  MessageCircle,
  CheckCircle2,
  Loader2,
  Phone,
  Home,
  Calendar
} from "lucide-react";
import { toast } from "react-toastify";


const ReportModal = ({ property, onClose, isDark }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    name: "",
    email: "",
    phone: ""
  });

  const reportReasons = [
    { value: "fake_listing", label: "Fake / Misleading Listing", icon: <Flag size={14} /> },
    { value: "price_mismatch", label: "Price Mismatch", icon: <AlertTriangle size={14} /> },
    { value: "already_sold", label: "Property Already Sold/Rented", icon: <Home size={14} /> },
    { value: "wrong_info", label: "Wrong Information", icon: <FileText size={14} /> },
    { value: "scam_fraud", label: "Scam / Fraud Suspicion", icon: <AlertTriangle size={14} /> },
    { value: "duplicate", label: "Duplicate Listing", icon: <FileText size={14} /> },
    { value: "inappropriate", label: "Inappropriate Content", icon: <AlertTriangle size={14} /> },
    { value: "other", label: "Other", icon: <Flag size={14} /> }
  ];

  const propertyTitle = property?.propertyTitleEn || property?.propertyname || "Property";
  const propertyId = property?.refrenceNo || property?._id?.slice(-8).toUpperCase() || "N/A";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReport = async () => {
    if (!formData.reason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    if (!formData.description || formData.description.length < 10) {
      toast.error("Please provide a detailed description (minimum 10 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        propertyId: property._id,
        propertyTitle: propertyTitle,
        propertyRefNo: propertyId,
        reason: formData.reason,
        description: formData.description,
        reporterName: formData.name || "Anonymous",
        reporterEmail: formData.email || "Not provided",
        reporterPhone: formData.phone || "Not provided",
        reportedAt: new Date().toISOString()
      };

      // API call to submit report
      // const response = await http.post("/reports/submit", reportData);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Report submitted successfully! Our team will review it shortly.");
      setSubmitted(true);
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform scale-100 ${
        isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-gray-200"
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDark ? "border-zinc-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-500">Report Property</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                {propertyTitle}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}
          >
            <X size={18} className={isDark ? "text-white/70" : "text-gray-500"} />
          </button>
        </div>

        {!submitted ? (
          <>
            {/* Content */}
            <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Property Info */}
              <div className={`p-3 rounded-xl ${isDark ? "bg-red-500/5 border border-red-500/20" : "bg-red-50 border border-red-100"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-black uppercase tracking-wider text-red-500">Property ID</span>
                  <span className="text-xs font-mono font-medium">{propertyId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-wider text-red-500">Property Type</span>
                  <span className="text-xs font-medium">{property?.propertytype || "Property"}</span>
                </div>
              </div>

              {/* Warning Message */}
              <div className={`p-3 rounded-xl ${isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-200"}`}>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-relaxed">
                  ⚠️ Please provide accurate information. False reports may lead to account restrictions.
                </p>
              </div>

              {/* Report Reason */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Reason for Reporting *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {reportReasons.map((reason) => (
                    <button
                      key={reason.value}
                      onClick={() => setFormData(prev => ({ ...prev, reason: reason.value }))}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left ${
                        formData.reason === reason.value
                          ? "border-red-500 bg-red-500/10 text-red-500"
                          : isDark 
                            ? "border-zinc-700 hover:border-zinc-600 text-zinc-300" 
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <span className="text-red-500">{reason.icon}</span>
                      <span className="text-xs">{reason.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Detailed Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Please describe the issue in detail..."
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none ${
                    isDark 
                      ? "bg-zinc-800 border-zinc-700 text-white focus:border-red-500" 
                      : "bg-white border-gray-200 text-gray-900 focus:border-red-500"
                  }`}
                />
                <p className="text-[8px] text-slate-400 mt-1">
                  Minimum 10 characters. Provide as much detail as possible.
                </p>
              </div>

              {/* Your Information (Optional) */}
              <div className={`p-3 rounded-xl ${isDark ? "bg-zinc-800/50" : "bg-gray-50"}`}>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-3">
                  Your Information (Optional)
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[8px] text-slate-400 block mb-1">Your Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                          isDark 
                            ? "bg-zinc-800 border-zinc-700 text-white focus:border-red-500" 
                            : "bg-white border-gray-200 text-gray-900 focus:border-red-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] text-slate-400 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                          isDark 
                            ? "bg-zinc-800 border-zinc-700 text-white focus:border-red-500" 
                            : "bg-white border-gray-200 text-gray-900 focus:border-red-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] text-slate-400 block mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+971 XX XXX XXXX"
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                          isDark 
                            ? "bg-zinc-800 border-zinc-700 text-white focus:border-red-500" 
                            : "bg-white border-gray-200 text-gray-900 focus:border-red-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-5 border-t ${isDark ? "border-zinc-800" : "border-gray-100"}`}>
              <button
                onClick={handleSubmitReport}
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <Flag size={18} />
                    Submit Report
                  </>
                )}
              </button>
              <p className="text-[8px] text-center text-slate-400 mt-3">
                Our team will review your report within 24-48 hours. Thank you for helping keep our platform safe.
              </p>
            </div>
          </>
        ) : (
          // Success State
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h4 className="text-xl font-bold text-green-500">Report Submitted!</h4>
            <p className="text-sm text-slate-400">
              Thank you for your report. Our compliance team will review this property and take appropriate action within 24-48 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;