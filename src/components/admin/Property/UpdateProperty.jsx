import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { http } from "../../../axios/axios";
import { 
  UploadCloud, X, MapPin, Home, Tag, IndianRupee, 
  Bed, Bath, Ruler, Layers, ShieldCheck, CheckCircle 
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";

const UpdateProperty = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { id } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPropertyFromId(id);
    // Cleanup function to prevent memory leaks from URL.createObjectURL
    return () => {
      files.forEach(file => {
        if (!file.isUrl) URL.revokeObjectURL(file.preview);
      });
    };
  }, [id]);

  const getPropertyFromId = async (id) => {
    try {
      const response = await http.get(`/getproperty/${id}`);
      if (response.data.success) {
        const data = response.data.data;
        reset(data);
        if (data.image) {
          setFiles(
            Array.isArray(data.image)
              ? data.image.map((img) => ({ name: img, isUrl: true }))
              : []
          );
        }
      }
    } catch {
      addToast("Failed to fetch property data", "error");
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      isUrl: false
    }));
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDelete = (index) => {
    const fileToDelete = files[index];
    if (!fileToDelete.isUrl) URL.revokeObjectURL(fileToDelete.preview);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateProperty = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));

      const existingImages = files.filter(f => f.isUrl).map(f => f.name);
      const newFiles = files.filter(f => !f.isUrl);

      newFiles.forEach((file) => formData.append("image", file));
      formData.append("existingImages", JSON.stringify(existingImages));

      const response = await http.put(`/updateproperty/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        addToast("Property updated successfully!", "success");
        navigate("/propertydetails");
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper for input styles
  const inputClass = (name) => `
    w-full border px-4 py-2.5 rounded-xl outline-none transition-all
    ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}
    ${errors[name] ? 'border-rose-500 ring-1 ring-rose-500' : 'focus:ring-2 focus:ring-indigo-500'}
  `;

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className={`max-w-5xl mx-auto rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>Edit Property</h2>
            <p className="text-slate-500 text-sm font-medium">Update listing details and media</p>
          </div>
          <CheckCircle className="text-indigo-500" size={32} />
        </div>

        <form onSubmit={handleSubmit(handleUpdateProperty)} className="p-8 space-y-8">
          
          {/* Media Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Property Media</label>
            <div 
              className={`border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer
              ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-indigo-500' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'}`}
              onClick={() => inputRef.current.click()}
            >
              <UploadCloud size={48} className="text-indigo-500 mb-3" />
              <p className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (Max 3MB per file)</p>
              <input type="file" ref={inputRef} multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group shadow-sm">
                  <img 
                    src={file.isUrl ? file.name : file.preview} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    alt="Preview" 
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                    className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  {file.isUrl && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-indigo-600 text-[8px] font-black text-white uppercase rounded">Live</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Property Title</label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input {...register("propertyname", { required: true })} className={`${inputClass("propertyname")} pl-12`} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Price (INR)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="number" {...register("price", { required: true })} className={`${inputClass("price")} pl-12`} />
              </div>
            </div>

            {/* Compact Specs Grid */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-6 rounded-3xl bg-slate-100/50 dark:bg-slate-800/30">
              {[
                { label: 'Beds', name: 'bedroom', icon: <Bed size={16} /> },
                { label: 'Baths', name: 'bathroom', icon: <Bath size={16} /> },
                { label: 'Sqft', name: 'squarefoot', icon: <Ruler size={16} /> },
                { label: 'Floor', name: 'floor', icon: <Layers size={16} /> }
              ].map(spec => (
                <div key={spec.name}>
                  <div className="flex items-center gap-2 text-slate-500 mb-1.5">
                    {spec.icon} <span className="text-[10px] font-black uppercase tracking-tighter">{spec.label}</span>
                  </div>
                  <input type="number" {...register(spec.name)} className={inputClass(spec.name)} />
                </div>
              ))}
            </div>

            {/* Dropdowns */}
            {[
              { label: "Type", name: "propertytype", options: ["House", "Apartment", "Land/Plot"] },
              { label: "Listing", name: "listingtype", options: ["Rent", "Sale", "Lease"] },
              { label: "Status", name: "status", options: ["Ready to Move", "Under Construction"] }
            ].map((field) => (
              <div key={field.name}>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{field.label}</label>
                <select {...register(field.name)} className={inputClass(field.name)}>
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Location Section */}
          <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center gap-2 mb-4 text-indigo-500">
              <MapPin size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Location Details</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input placeholder="City" {...register("city")} className={inputClass("city")} />
              <input placeholder="State" {...register("state")} className={inputClass("state")} />
              <input placeholder="Zip Code" {...register("zipcode")} className={inputClass("zipcode")} />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/30 transition-all disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Update Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProperty;