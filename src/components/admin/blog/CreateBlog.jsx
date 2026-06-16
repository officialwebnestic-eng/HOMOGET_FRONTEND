import React, { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { http } from "../../../axios/axios";
import { toast } from "react-toastify";
import { useToast } from "../../../model/SuccessToasNotification";
import {
  UploadCloud, X, Check, FileText, Calendar, Tag, User, Hash, List,
  Newspaper, Sparkles, Image, Clock, Eye, Save, Globe, Link2, Youtube,
  Facebook, Twitter, Linkedin, Instagram, Share2, Plus, Trash2
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const CreateBlog = () => {
  const [files, setFiles] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [content, setContent] = useState("");
  const inputRef = useRef(null);
  const featuredInputRef = useRef(null);
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      blogstatus: "published",
      blogpublishdate: new Date().toISOString().split('T')[0],
      videos: [{ type: "youtube", url: "", title: "" }],
      socialLinks: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        pinterest: "",
        whatsapp: "",
        telegram: ""
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "videos"
  });

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const remaining = 5 - files.length;
    setFiles((prev) => [...prev, ...droppedFiles.slice(0, remaining)]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const remaining = 5 - files.length;
    setFiles((prev) => [...prev, ...selectedFiles.slice(0, remaining)]);
  };

  const handleFeaturedImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
    }
  };

  const handleDelete = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerInput = () => inputRef.current.click();
  const triggerFeaturedInput = () => featuredInputRef.current.click();

  const handleAddProperty = async (data) => {
    if (files.length === 0) {
      addToast("Please upload at least one cover image", "error");
      return;
    }

    try {
      const formData = new FormData();
      
      // Append all form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "videos") {
            // Handle videos as JSON string
            formData.append(key, JSON.stringify(value));
          } else if (key === "socialLinks") {
            // Handle social links as JSON string
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      
      files.forEach((file) => formData.append("image", file));
      if (featuredImage) formData.append("featuredImage", featuredImage);
      formData.append("blogcontent", content);

      const response = await http.post("/createblog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        addToast(response.data.message || "Blog Created Successfully", "success");
        reset();
        setFiles([]);
        setFeaturedImage(null);
        setContent("");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    }
  };

  const categories = [
    "Luxury Living", "Investment Tips", "Market Updates", "Buyer Guides",
    "Real Estate News", "Developer Spotlight", "Off-Plan Projects", "Property Management"
  ];

  const statuses = [
    { value: "draft", label: "Draft", icon: <FileText size={12} /> },
    { value: "published", label: "Published", icon: <Globe size={12} /> },
    { value: "archived", label: "Archived", icon: <Archive size={12} /> }
  ];

  const videoTypes = [
    { value: "youtube", label: "YouTube", icon: <Youtube size={14} /> },
    { value: "vimeo", label: "Vimeo", icon: <Youtube size={14} /> },
    { value: "other", label: "Other", icon: <Link2 size={14} /> }
  ];

  const socialPlatforms = [
    { key: "facebook", label: "Facebook", icon: <Facebook size={14} />, placeholder: "https://facebook.com/your-post" },
    { key: "twitter", label: "Twitter/X", icon: <Twitter size={14} />, placeholder: "https://twitter.com/your-post" },
    { key: "linkedin", label: "LinkedIn", icon: <Linkedin size={14} />, placeholder: "https://linkedin.com/your-post" },
    { key: "instagram", label: "Instagram", icon: <Instagram size={14} />, placeholder: "https://instagram.com/your-post" },
    { key: "pinterest", label: "Pinterest", icon: <Share2 size={14} />, placeholder: "https://pinterest.com/your-post" },
    { key: "whatsapp", label: "WhatsApp", icon: <Share2 size={14} />, placeholder: "https://wa.me/your-post" },
    { key: "telegram", label: "Telegram", icon: <Share2 size={14} />, placeholder: "https://t.me/your-post" }
  ];

  return (
    <div className={`min-h-screen py-6 px-4 md:py-8 ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 mb-3">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500">Blog Creator</span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Create New <span className="text-amber-500">Blog Post</span>
          </h1>
          <p className={`text-xs md:text-sm max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Share your insights and expertise with our community through engaging blog posts
          </p>
        </div>

        <form onSubmit={handleSubmit(handleAddProperty)} className="space-y-6">
          
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Title Section */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Newspaper size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Blog Title</h3>
                    <p className="text-[10px] text-gray-500">Create an attention-grabbing title</p>
                  </div>
                </div>
                <input
                  type="text"
                  {...register("blogtitle", { required: "Blog title is required" })}
                  placeholder="e.g., The Future of Dubai Real Estate: 2025 Trends"
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 transition-all text-sm ${
                    errors.blogtitle
                      ? "border-red-400 focus:border-red-500"
                      : isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                      : "bg-white border-gray-200 text-gray-800 focus:border-amber-500"
                  }`}
                />
                {errors.blogtitle && <p className="text-xs text-red-500 mt-1">{errors.blogtitle.message}</p>}
              </div>

              {/* Content Editor - Simple Textarea */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <FileText size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Blog Content</h3>
                    <p className="text-[10px] text-gray-500">Write your amazing content here</p>
                  </div>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  placeholder="Write your blog content here..."
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 text-sm ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  }`}
                />
                {!content && <p className="text-xs text-red-500 mt-1">Blog content is required</p>}
              </div>

              {/* Videos Section - NEW */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                      <Youtube size={14} className="text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Video Links</h3>
                      <p className="text-[10px] text-gray-500">Add YouTube or Vimeo videos</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => append({ type: "youtube", url: "", title: "" })}
                    className="px-2 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all text-[10px] font-bold flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Video
                  </button>
                </div>
                
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className={`text-[9px] font-medium block mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Type</label>
                          <select
                            {...register(`videos.${index}.type`)}
                            className={`w-full px-2 py-1 rounded border text-xs ${
                              isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-200'
                            }`}
                          >
                            {videoTypes.map((type) => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className={`text-[9px] font-medium block mb-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Video URL</label>
                          <div className="flex items-center gap-1">
                            <input
                              {...register(`videos.${index}.url`)}
                              placeholder="https://youtube.com/watch?v=..."
                              className={`flex-1 px-2 py-1 rounded border text-xs ${
                                isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-200'
                              }`}
                            />
                            {fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          {...register(`videos.${index}.title`)}
                          placeholder="Video title (optional)"
                          className={`w-full px-2 py-1 rounded border text-xs ${
                            isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-200'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className={`text-xs text-center py-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      No videos added. Click "Add Video" to include videos.
                    </p>
                  )}
                </div>
              </div>

              {/* Social Media Links - NEW */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Share2 size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Social Media Links</h3>
                    <p className="text-[10px] text-gray-500">Add social share links for this blog</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {socialPlatforms.map((platform) => (
                    <div key={platform.key} className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-amber-500`}>
                        {platform.icon}
                      </div>
                      <input
                        {...register(`socialLinks.${platform.key}`)}
                        placeholder={platform.placeholder}
                        className={`flex-1 px-2 py-1.5 rounded border text-xs ${
                          isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Section */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Globe size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>SEO Optimization</h3>
                    <p className="text-[10px] text-gray-500">Improve your blog's visibility</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Meta Title
                    </label>
                    <input
                      type="text"
                      {...register("seometatitle")}
                      placeholder="SEO optimized title (60-70 characters)"
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                      maxLength="70"
                    />
                    <p className="text-[9px] text-gray-500 mt-1">{watch("seometatitle")?.length || 0}/70 characters</p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Meta Description
                    </label>
                    <textarea
                      {...register("seometadescription")}
                      rows="2"
                      placeholder="Brief description for search engines (150-160 characters)"
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                      maxLength="160"
                    />
                    <p className="text-[9px] text-gray-500 mt-1">{watch("seometadescription")?.length || 0}/160 characters</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Featured Image */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Image size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Featured Image</h3>
                    <p className="text-[10px] text-gray-500">Main thumbnail for the blog</p>
                  </div>
                </div>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all text-center ${
                    featuredImage
                      ? "border-green-400 bg-green-50 dark:bg-green-950"
                      : "border-gray-300 dark:border-gray-600 hover:border-amber-400"
                  }`}
                  onClick={triggerFeaturedInput}
                >
                  <input
                    type="file"
                    ref={featuredInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFeaturedImage}
                  />
                  {featuredImage ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(featuredImage)}
                        alt="Featured"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFeaturedImage(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Image size={32} className="mx-auto mb-1 text-gray-400" />
                      <p className="text-xs font-medium">Click to upload featured image</p>
                      <p className="text-[9px] text-gray-500 mt-1">Recommended: 1200x630px</p>
                    </>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <UploadCloud size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Gallery Images</h3>
                    <p className="text-[10px] text-gray-500">Upload up to 5 images</p>
                  </div>
                </div>
                <div
                  className={`border-2 border-dashed rounded-lg p-3 cursor-pointer transition-all text-center ${
                    files.length > 0
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-950"
                      : "border-gray-300 dark:border-gray-600 hover:border-amber-400"
                  }`}
                  onClick={triggerInput}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    type="file"
                    ref={inputRef}
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <UploadCloud size={24} className="mx-auto mb-1 text-gray-400" />
                  <p className="text-xs font-medium">Click or drag images here</p>
                  <p className="text-[9px] text-gray-500 mt-1">Max 5 images</p>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-[9px] text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button onClick={() => handleDelete(index)} className="p-1 hover:bg-red-500/10 rounded">
                          <X size={12} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Blog Settings */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Settings size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Blog Settings</h3>
                    <p className="text-[10px] text-gray-500">Configure your blog post</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Category */}
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <List size={12} className="inline mr-1" /> Category
                    </label>
                    <select
                      {...register("blogcategory", { required: "Category is required" })}
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.blogcategory && <p className="text-xs text-red-500 mt-1">{errors.blogcategory.message}</p>}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Tag size={12} className="inline mr-1" /> Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      {...register("blogtags")}
                      placeholder="e.g., real estate, dubai, investment"
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <User size={12} className="inline mr-1" /> Author Name
                    </label>
                    <input
                      type="text"
                      {...register("blogauthor", { required: "Author name is required" })}
                      placeholder="Full name"
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                    />
                    {errors.blogauthor && <p className="text-xs text-red-500 mt-1">{errors.blogauthor.message}</p>}
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Calendar size={12} className="inline mr-1" /> Publish Date
                    </label>
                    <input
                      type="date"
                      {...register("blogpublishdate", { required: "Publish date is required" })}
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Eye size={12} className="inline mr-1" /> Status
                    </label>
                    <div className="flex gap-2">
                      {statuses.map((status) => (
                        <label key={status.value} className="flex-1">
                          <input
                            type="radio"
                            value={status.value}
                            {...register("blogstatus")}
                            className="hidden peer"
                          />
                          <div className={`flex items-center justify-center gap-1 p-1.5 rounded-lg border cursor-pointer transition-all peer-checked:bg-amber-500 peer-checked:text-white text-xs ${
                            isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                          }`}>
                            {status.icon}
                            <span className="text-[10px] font-medium">{status.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <FileText size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Blog Summary</h3>
                    <p className="text-[10px] text-gray-500">Short description for preview</p>
                  </div>
                </div>
                <textarea
                  {...register("blogsummary", { required: "Summary is required" })}
                  rows="3"
                  placeholder="Write a compelling summary of your blog post..."
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  }`}
                  maxLength="200"
                />
                <p className="text-[9px] text-gray-500 mt-1">{watch("blogsummary")?.length || 0}/200 characters</p>
                {errors.blogsummary && <p className="text-xs text-red-500 mt-1">{errors.blogsummary.message}</p>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => { reset(); setFiles([]); setFeaturedImage(null); setContent(""); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-xs ${
                isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <X size={14} /> Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 text-xs"
            >
              {isSubmitting ? (
                <><Clock size={14} className="animate-spin" /> Publishing...</>
              ) : (
                <><Save size={14} /> Publish Blog</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Settings icon component
const Settings = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// Archive icon component
const Archive = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4v16h16V4H4zm2 2h12v12H6V6zm2 2h8v2H8V8z"/>
  </svg>
);

export default CreateBlog;