// components/ScheduleAppointmentModal.jsx
import React, { useState } from 'react';
import { X, Calendar, Clock, Phone, Mail, User, Building2, MapPin, Send, Loader2, Home, Briefcase, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './SuccessToasNotification';
import LocationSearch from '../components/admin/Property/LocationSearch';
 import { http } from '../axios/axios';


const ScheduleAppointmentModal = ({ isOpen, onClose, isDark }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: '+971',
    phone: '',
    category: '',
    propertyType: '',
    location: '',
    date: '',
    time: '',
    message: '',
    inqueryType: 'consultation',
    offeringType: ''
  });

  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [errors, setErrors] = useState({});

  // Property type options based on category
  const resTypes = ["Apartments", "Bulk Units", "Bungalow", "Compound", "Duplex",
    "Hotel Apartment", "Penthouse", "Townhouse", "Villa", "Whole Building"];
  
  const commTypes = ["Business Center", "Coworking Space", "Factory", "Farm", "Full Floor",
    "Half Floor", "Labor Camp", "Land", "Office Space", "Retail", "Shop",
    "Showroom", "Staff Accommodation", "Warehouse", "Whole Building"];
  
  const offPlanTypes = ["Apartments", "Villas", "Townhouses", "Penthouses", "Land"];

  // Get property types based on selected category
  const getPropertyTypes = () => {
    if (formData.category === 'Commercial') return commTypes;
    if (formData.category === 'Off-Plan') return offPlanTypes;
    return resTypes;
  };

  const countryCodes = [
    { code: '+971', flag: '🇦🇪', country: 'UAE' },
    { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
    { code: '+974', flag: '🇶🇦', country: 'Qatar' },
    { code: '+965', flag: '🇰🇼', country: 'Kuwait' },
    { code: '+968', flag: '🇴🇲', country: 'Oman' },
    { code: '+973', flag: '🇧🇭', country: 'Bahrain' },
    { code: '+91', flag: '🇮🇳', country: 'India' },
    { code: '+44', flag: '🇬🇧', country: 'UK' },
    { code: '+1', flag: '🇺🇸', country: 'USA' },
    { code: '+61', flag: '🇦🇺', country: 'Australia' },
  ];

  const inquiryTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'sell', label: 'I want to Sell' },
    { value: 'rent_long', label: 'I want to Rent Out (Long Term)' },
    { value: 'rent_short', label: 'I want to Rent Out (Short Term)' },
    { value: 'buy', label: 'I want to Buy' },
    { value: 'valuation', label: 'Property Valuation' },
    { value: 'mortgage', label: 'Mortgage Inquiry' },
    { value: 'investment', label: 'Investment Advice' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset property type when category changes
    if (name === 'category') {
      setFormData(prev => ({ ...prev, propertyType: '' }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocationSelect = (location) => {
    if (location) {
      setSelectedLocationData(location);
      setFormData(prev => ({ ...prev, location: location.name }));
    } else {
      setSelectedLocationData(null);
      setFormData(prev => ({ ...prev, location: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{7,15}$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    if (!formData.inqueryType) newErrors.inqueryType = 'Inquiry type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getInquiryLabel = (value) => {
    const inquiry = inquiryTypes.find(i => i.value === value);
    return inquiry ? inquiry.label : value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: `${formData.phoneCode} ${formData.phone}`,
        category: formData.category,
        propertyType: formData.propertyType,
        location: formData.location,
        preferredDate: formData.date,
        preferredTime: formData.time,
        message: formData.message,
        inqueryType: formData.inqueryType,
        offeringType: formData.offeringType
      };

      const response = await http.post('/schedule-appointment', payload, { withCredentials: true });
      
      if (response.data.success) {
        addToast('Request submitted successfully! Our team will contact you shortly.', 'success');
        onClose();
        setFormData({
          name: '', email: '', phoneCode: '+971', phone: '', category: '',
          propertyType: '', location: '', date: '', time: '', message: '',
          inqueryType: 'consultation', offeringType: ''
        });
        setSelectedLocationData(null);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      addToast(error.response?.data?.message || 'Failed to submit request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm ${
    isDark ? 'bg-[#1A1F2B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
  }`;
  
  const labelClass = 'text-[10px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
              isDark ? 'bg-[#161B26]' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between p-5 border-b ${isDark ? 'border-white/10' : 'border-slate-100'} bg-inherit`}>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Schedule a Consultation
                </h2>
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-1">
                  Talk to our property experts
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-[9px] mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[9px] mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone with Country Code */}
              <div>
                <label className={labelClass}>Phone Number *</label>
                <div className="flex gap-2">
                  <div className="w-32 relative">
                    <select
                      name="phoneCode"
                      value={formData.phoneCode}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      {countryCodes.map((code) => (
                        <option key={code.code} value={code.code}>
                          {code.flag} {code.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="50 123 4567"
                    />
                  </div>
                </div>
                {errors.phone && <p className="text-red-500 text-[9px] mt-1">{errors.phone}</p>}
              </div>

              {/* Inquiry Type Dropdown */}
              <div>
                <label className={labelClass}>Inquiry Type *</label>
                <div className="relative">
                  <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <select
                    name="inqueryType"
                    value={formData.inqueryType}
                    onChange={handleChange}
                    className={`${inputClass} pl-10 appearance-none cursor-pointer`}
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.inqueryType && <p className="text-red-500 text-[9px] mt-1">{errors.inqueryType}</p>}
              </div>

              {/* Category Selection */}
              <div>
                <label className={labelClass}>Property Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'Residential', icon: <Home size={16} />, label: 'Residential' },
                    { value: 'Commercial', icon: <Building size={16} />, label: 'Commercial' },
                    { value: 'Off-Plan', icon: <Building2 size={16} />, label: 'Off-Plan' }
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'category', value: cat.value } })}
                      className={`p-2 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                        formData.category === cat.value
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                          : isDark ? 'border-white/10 text-slate-400 hover:border-amber-500/50' : 'border-slate-200 text-slate-600 hover:border-amber-500/50'
                      }`}
                    >
                      {cat.icon}
                      <span className="text-[9px] font-bold">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type Dropdown (conditional based on category) */}
              {formData.category && (
                <div>
                  <label className={labelClass}>Property Type</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className={`${inputClass} pl-10 appearance-none cursor-pointer`}
                    >
                      <option value="">Select Property Type</option>
                      {getPropertyTypes().map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Offering Type (for Rent Out inquiries) */}
              {(formData.inqueryType === 'rent_long' || formData.inqueryType === 'rent_short') && (
                <div>
                  <label className={labelClass}>Offering Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'Long Term', label: 'Long Term' },
                      { value: 'Short Term', label: 'Short Term' }
                    ].map((offer) => (
                      <button
                        key={offer.value}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'offeringType', value: offer.value } })}
                        className={`p-2 rounded-xl border transition-all ${
                          formData.offeringType === offer.value
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                            : isDark ? 'border-white/10 text-slate-400 hover:border-amber-500/50' : 'border-slate-200 text-slate-600 hover:border-amber-500/50'
                        }`}
                      >
                        <span className="text-[10px] font-bold">{offer.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Search */}
              <div>
                <label className={labelClass}>Preferred Location</label>
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  initialValue=""
                  isDark={isDark}
                  required={false}
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preferred Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={getTodayDate()}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Preferred Time</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={labelClass}>Additional Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your requirements..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={16} />}
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>

              <p className="text-[8px] text-center text-slate-400 mt-2">
                Our property consultant will contact you within 24 hours to respond to your request.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleAppointmentModal;