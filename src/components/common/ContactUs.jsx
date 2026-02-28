import React from "react";
import { useForm } from "react-hook-form";
import { http } from "../../axios/axios";
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Clock, Building, 
  Facebook, Twitter, Instagram, Linkedin, 
  Headphones, Send, ArrowRight 
} from "lucide-react";
import { useToast } from "../../model/SuccessToasNotification";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

const ContactUs = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await http.post("/contact", data);
      if (response.data.success) {
        addToast("Message received. Our advisor will call you shortly.", 'success');
        navigate("/");
      }
    } catch (error) {
      addToast("Connection error. Please try again.", 'error');
    }
  };

  const colors = {
    brand: "#C5A059", // Dubai Gold
    cardBg: isDark ? "bg-slate-900/80" : "bg-white",
    textPrimary: isDark ? "text-white" : "text-slate-900",
    textSecondary: isDark ? "text-slate-400" : "text-slate-600",
    border: isDark ? "border-slate-800" : "border-slate-200",
    input: isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* --- CINEMATIC HERO SECTION --- */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Dubai Skyline"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-slate-950/90 via-slate-950/70 to-slate-950' : 'from-white/80 via-white/40 to-slate-50'}`} />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-6">
              Concierge Support
            </span>
            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-6 ${colors.textPrimary}`}>
              Let’s Talk <span className="text-amber-600 italic font-serif">Luxury.</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-lg md:text-xl ${colors.textSecondary}`}>
              Whether you're looking for a waterfront villa or a high-yield investment, our specialists are ready to guide you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Information Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-4 ${colors.cardBg} backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border ${colors.border}`}
          >
            <div className="mb-10">
              <h3 className="text-2xl font-black mb-2 tracking-tight">Our Atelier</h3>
              <p className="text-sm text-amber-600 font-bold uppercase tracking-widest">Dubai, UAE</p>
            </div>

            <div className="space-y-8">
              {[
                { icon: MapPin, title: "Location", detail: "HOMOGET PROPERTIES, Business Bay, Dubai, UAE", color: "text-amber-500" },
                { icon: Phone, title: "Private Line", detail: "+971 4 XXX XXXX", color: "text-emerald-500" },
                { icon: Mail, title: "Inquiries", detail: "concierge@homoget.ae", color: "text-blue-500" },
                { icon: Clock, title: "Availability", detail: "Mon-Sat: 09:00 - 18:00", color: "text-purple-500" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className={`w-12 h-12 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'} flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{item.title}</h4>
                    <p className={`text-sm font-bold ${colors.textPrimary}`}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-slate-800/50">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Digital Presence</h4>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-slate-800 hover:bg-amber-600' : 'bg-slate-200 hover:bg-amber-600'} hover:text-white`}>
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-8 ${colors.cardBg} backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] shadow-2xl border ${colors.border}`}
          >
            <div className="mb-12">
              <div className="flex items-center gap-3 text-amber-600 mb-4">
                <Headphones size={20} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Request a Private Consultation</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter">How can we assist?</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Form fields with refined styling */}
              {[
                { id: "fullName", label: "Full Name", type: "text", placeholder: "e.g. Alexander Sterling", req: "Name required" },
                { id: "email", label: "Email Address", type: "email", placeholder: "alex@example.com", req: "Email required" },

                // info@homoget.ae
                // +971585852283
                { id: "phoneno", label: "Phone Number", type: "tel", placeholder: "+971 XX XXX XXXX", req: "Contact required" }
              ].map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{field.label}</label>
                  <input
                    {...register(field.id, { required: field.req })}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`p-4 rounded-xl border outline-none transition-all focus:ring-1 focus:ring-amber-500/50 ${colors.input} ${errors[field.id] ? 'border-red-500' : 'focus:border-amber-500'}`}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Inquiry Category</label>
                <select
                  {...register("inquarytype", { required: "Select a type" })}
                  className={`p-4 rounded-xl border outline-none transition-all ${colors.input} focus:border-amber-500`}
                >
                  <option value="Buying/Selling">Luxury Acquisition</option>
                  <option value="Home Loan">Mortgage Advisory</option>
                  <option value="Property Visit">VIP Viewing Request</option>
                  <option value="Rental">High-end Leasing</option>
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Your Requirements</label>
                <textarea
                  {...register("message")}
                  placeholder="Describe your ideal property or investment goals..."
                  rows="4"
                  className={`p-4 rounded-xl border outline-none transition-all ${colors.input} focus:border-amber-500 resize-none`}
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-12 py-5 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? "Transmitting..." : (
                    <>
                      Secure Consultation <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* --- MAP SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-20 p-4 rounded-[3rem] ${colors.cardBg} border ${colors.border} shadow-2xl`}
        >
          <div className="rounded-[2.5rem] overflow-hidden grayscale active:grayscale-0 transition-all duration-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115511.23849182046!2d55.19777595304193!3d25.19484852028637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502516ac20a!2sBusiness%20Bay%20-%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Homoget Dubai Office"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;