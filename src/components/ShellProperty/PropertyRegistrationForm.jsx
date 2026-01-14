import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, Ruler, Image as ImageIcon, 
  CheckCircle2, ChevronRight, ChevronLeft, Sparkles,
  Bed, Bath, Trash2
} from 'lucide-react';

// External modules
import { http } from '../../axios/axios';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import SuccessPropertyAdd from '../../model/SuccessPropertyAdd';

const PropertyRegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [showModel, setShowModel] = useState(false);
  const [images, setImages] = useState([]); // Native state to handle file previews
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // --- Design System (Increased Font Sizes) ---
  const ct = {
    bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
    card: isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200 shadow-xl',
    input: isDark ? 'bg-slate-800 border-white/10 text-white focus:border-amber-500' : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500',
    label: "text-sm font-black uppercase tracking-[0.15em] mb-2 text-amber-600", 
    inputText: "text-base font-medium",
    error: "text-red-500 text-xs font-bold mt-1 uppercase"
  };

  // --- React Hook Form Initialization ---
  const { 
    register, 
    handleSubmit, 
    trigger, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm({
    defaultValues: {
      propertyname: '', propertytype: '', address: '', bathroom: '',
      bedroom: '', city: '', state: '', floor: '', listingtype: '',
      price: '', squarefoot: '', status: '', zipcode: '', terms: false
    }
  });

  // --- Image Handling ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // --- Form Submission ---
  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    // Append text fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // Append images
    images.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await http.post('/addpropertybyuser', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setShowModel(true);
        reset();
        setImages([]);
        setStep(1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    }
  };

  // --- Step-wise Validation Logic ---
  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['propertyname', 'propertytype', 'listingtype'];
    if (step === 2) fieldsToValidate = ['bedroom', 'bathroom', 'squarefoot', 'address', 'city', 'state', 'zipcode'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(s => s + 1);
    else toast.error("Please fill all required fields");
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <div className={`min-h-screen ${ct.bg} pt-16 pb-10 px-6 transition-colors duration-700`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}  
        <div className="text-center mb-12">
          <h1 className={`text-5xl md:text-6xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Property <span className="text-amber-500 italic font-serif font-light">Registry</span>
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= num ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
              {num}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className={`md:col-span-8 p-10 rounded-[2rem] ${ct.card} border`}>
                  <div className="space-y-6">
                    <div>
                      <label className={ct.label}>Property Title</label>
                      <input 
                        {...register('propertyname', { required: "Title is required" })} 
                        className={`${ct.input} ${ct.inputText} w-full p-4 rounded-xl border outline-none`} 
                        placeholder="e.g., Luxury Villa" 
                      />
                      {errors.propertyname && <p className={ct.error}>{errors.propertyname.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={ct.label}>Category</label>
                        <select {...register('propertytype', { required: "Required" })} className={`${ct.input} w-full p-4 rounded-xl border outline-none`}>
                          <option value="">Select</option>
                          <option value="house">House</option>
                          <option value="apartment">Apartment</option>
                        </select>
                        {errors.propertytype && <p className={ct.error}>{errors.propertytype.message}</p>}
                      </div>
                      <div>
                        <label className={ct.label}>Listing Type</label>
                        <select {...register('listingtype', { required: "Required" })} className={`${ct.input} w-full p-4 rounded-xl border outline-none`}>
                          <option value="">Select</option>
                          <option value="For Sale">Sale</option>
                          <option value="For Rent">Rent</option>
                        </select>
                        {errors.listingtype && <p className={ct.error}>{errors.listingtype.message}</p>}
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={nextStep} className="mt-10 w-full py-4 bg-amber-500 text-black font-bold uppercase rounded-xl tracking-widest">Next Step</button>
                </div>
                <div className="md:col-span-4 flex flex-col gap-4">
                    <div className={`${ct.card} p-8 rounded-[2rem] border`}>
                        <Building2 className="text-amber-500 mb-4" />
                        <h3 className="font-bold text-lg mb-2 text-white">Identity</h3>
                        <p className="text-sm text-slate-400">Basic details help investors find your property faster.</p>
                    </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DETAILS */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className={`md:col-span-12 p-10 rounded-[2rem] ${ct.card} border`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className={ct.label}>Bedrooms</label>
                        <input type="number" {...register('bedroom', { required: true })} className={`${ct.input} w-full p-4 rounded-xl border`} />
                    </div>
                    <div>
                        <label className={ct.label}>Bathrooms</label>
                        <input type="number" {...register('bathroom', { required: true })} className={`${ct.input} w-full p-4 rounded-xl border`} />
                    </div>
                    <div>
                        <label className={ct.label}>Sq. Ft.</label>
                        <input type="number" {...register('squarefoot', { required: true })} className={`${ct.input} w-full p-4 rounded-xl border`} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <input placeholder="Full Address" {...register('address', { required: true })} className={`${ct.input} w-full p-4 rounded-xl border`} />
                    <div className="grid grid-cols-3 gap-4">
                      <input placeholder="City" {...register('city', { required: true })} className={`${ct.input} p-4 rounded-xl border`} />
                      <input placeholder="State" {...register('state', { required: true })} className={`${ct.input} p-4 rounded-xl border`} />
                      <input placeholder="Zip" {...register('zipcode', { required: true })} className={`${ct.input} p-4 rounded-xl border`} />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-10">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 border border-slate-700 text-white rounded-xl">Back</button>
                    <button type="button" onClick={nextStep} className="flex-[2] py-4 bg-amber-500 text-black font-bold rounded-xl">Continue</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: ASSETS & PRICE */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className={`md:col-span-7 p-10 rounded-[2rem] ${ct.card} border`}>
                  <label className={ct.label}>Upload Gallery</label>
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleImageChange} 
                    className="mb-6 block text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-amber-500/10 file:text-amber-500" 
                  />
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((file, i) => (
                      <div key={i} className="relative group">
                        <img src={URL.createObjectURL(file)} className="aspect-square w-full object-cover rounded-xl border border-white/10" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-500 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-5 space-y-6">
                  <div className={`${ct.card} p-8 rounded-[2rem] border`}>
                    <label className={ct.label}>Listing Price (₹)</label>
                    <input type="number" {...register('price', { required: true })} className="w-full bg-transparent text-4xl font-black text-amber-500 outline-none" placeholder="0.00" />
                    <div className="h-[1px] bg-white/10 my-6" />
                    <select {...register('status', { required: true })} className={`${ct.input} w-full p-4 rounded-xl border`}>
                      <option value="">Status</option>
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 p-4 bg-amber-500/10 rounded-xl">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" {...register('terms', { required: true })} className="mt-1" />
                      <p className="text-[11px] font-bold text-amber-500 uppercase tracking-tighter leading-tight">I confirm that all provided data is accurate.</p>
                    </div>
                    {errors.terms && <p className={ct.error}>Agreement is required</p>}
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 border border-slate-700 text-white rounded-xl font-bold">Back</button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-[2] py-4 bg-white text-black font-black uppercase rounded-xl disabled:opacity-50"
                    >
                      {isSubmitting ? "Processing..." : "Finish Registry"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {showModel && <SuccessPropertyAdd onClose={() => setShowModel(false)} />}
      </div>
    </div>
  );
};

export default PropertyRegistrationForm;