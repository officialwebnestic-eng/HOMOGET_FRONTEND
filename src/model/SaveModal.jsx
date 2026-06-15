// SaveModal.jsx
import React, { useState } from "react";
import { Heart, X, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const SaveModal = ({ property, onClose, isDark }) => {
  const [saved, setSaved] = useState(false);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyTitle = property?.propertyTitleEn || property?.propertyname || "Property";
  const price = property?.price ? `AED ${Number(property.price).toLocaleString()}` : "Contact for price";
  const propertyImage = property?.image?.[0] || null;

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  const handleSaveProperty = async () => {
    if (!phone) {
      toast.error("Please enter your WhatsApp number");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setSaved(true);
      toast.success("Property saved to your favorites!");
      setIsSubmitting(false);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
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
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-1.5 rounded-full transition-colors ${
            isDark ? "hover:bg-zinc-800 text-white/70" : "hover:bg-gray-100 text-gray-500"
          }`}
        >
          <X size={18} />
        </button>

        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row">
          
          {/* Left Side - Image */}
          <div className="md:w-2/5 relative bg-gradient-to-br from-amber-500 to-orange-500 p-6 flex flex-col items-center justify-center text-center">
            {propertyImage ? (
              <img 
                src={propertyImage} 
                alt={propertyTitle}
                className="w-full h-48 object-cover rounded-xl opacity-90"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <Heart size={48} className="text-white fill-white/30" />
              </div>
            )}
            
            <div className="mt-4">
              <h3 className="text-white font-bold text-lg mb-1">Save Property</h3>
              <p className="text-white/80 text-xs">Get exclusive updates</p>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <CheckCircle2 size={14} className="text-white" />
                <span>Unlock exclusive tools</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <CheckCircle2 size={14} className="text-white" />
                <span>Save & track properties</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <CheckCircle2 size={14} className="text-white" />
                <span>Price change alerts</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-3/5 p-6">
            {!saved ? (
              <>
                {/* Property Info */}
                <div className="mb-4 pb-3 border-b border-gray-100 dark:border-zinc-800">
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-wider">Property</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{propertyTitle}</p>
                  <p className="text-lg font-bold text-amber-500 mt-1">{price}</p>
                </div>

                {/* WhatsApp Number Input */}
                <div className="mb-4">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                    WhatsApp Number *
                  </label>
                  <PhoneInput
                    country={"ae"}
                    value={phone}
                    onChange={handlePhoneChange}
                    enableSearch={true}
                    searchPlaceholder="Search country"
                    inputClass={`!w-full !pl-12 !pr-3 !py-3 !text-sm !rounded-xl !border focus:!outline-none focus:!ring-2 focus:!ring-amber-500 ${
                      isDark 
                        ? "!bg-zinc-800 !border-zinc-700 !text-white" 
                        : "!bg-white !border-gray-200 !text-gray-900"
                    }`}
                    buttonClass={`!absolute !left-0 !top-0 !h-full !border-0 !bg-transparent ${
                      isDark ? "!text-white" : ""
                    }`}
                    dropdownClass={isDark ? "!bg-zinc-800 !text-white" : ""}
                    searchClass={isDark ? "!bg-zinc-800 !text-white" : ""}
                  />
                  <p className="text-[8px] text-slate-400 mt-1">
                    We'll send property updates to this WhatsApp number
                  </p>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={handleSaveProperty}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Heart size={16} className="fill-black" />
                  {isSubmitting ? "Saving..." : "Save Property"}
                  <ArrowRight size={16} />
                </button>

                {/* Terms */}
                <p className="text-[7px] text-center text-slate-400 mt-4">
                  By saving, you agree to our Terms & Conditions and Privacy Policy
                </p>
              </>
            ) : (
              // Success State
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h4 className="text-xl font-bold text-green-500">Saved!</h4>
                <p className="text-sm text-slate-400">
                  Property added to your favorites. We'll keep you updated!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-all text-sm"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;