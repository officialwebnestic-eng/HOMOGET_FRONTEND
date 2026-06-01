import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { http } from '../../../axios/axios';
import { useTheme } from '../../../context/ThemeContext';
import { useToast } from "../../../model/SuccessToasNotification";
import { UploadCloud, X, Image, FileText, Calendar, Tag, User, Hash, Globe, Save, Trash2, Plus, Eye, Bold, Italic, AlignLeft, Link2 } from 'lucide-react';

const UpdateBlog = () => {
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === 'dark';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getBlogFromId(id);
  }, [id]);

  const getBlogFromId = async (id) => {
    setLoading(true);
    try {
      const response = await http.get(`/blog/${id}`);
      if (response.data.success === true) {
        const blogData = response.data.data;
        
        reset({
          blogtitle: blogData.blogtitle,
          blogtags: Array.isArray(blogData.blogtags) ? blogData.blogtags.join(', ') : blogData.blogtags,
          blogauthor: blogData.blogauthor,
          blogauthorid: blogData.blogauthorid,
          blogcontent: blogData.blogcontent,
          blogsummary: blogData.blogsummary,
          blogpublishdate: blogData.blogpublishdate?.split('T')[0] || '',
          seometatitle: blogData.seometatitle,
          seometadiscription: blogData.seometadiscription,
          blogcategory: blogData.blogcategory,
          blogstatus: blogData.blogstatus || 'draft'
        });
        
        setContent(blogData.blogcontent || '');
        
        if (blogData.image && blogData.image.length > 0) {
          const existing = blogData.image.map((img, idx) => ({
            id: idx,
            name: img.split('/').pop(),
            url: img,
            isExisting: true
          }));
          setExistingImages(existing);
        }
      } else {
        addToast("Blog not found", "error");
        navigate('/viewbloglist');
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      addToast("Failed to fetch blog data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles = droppedFiles.slice(0, 10 - (files.length + existingImages.length));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.slice(0, 10 - (files.length + existingImages.length));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDeleteNewFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (index, imageUrl) => {
    try {
      const fileName = imageUrl.split('/').pop();
      await http.delete(`/blog/image/${id}`, { data: { imageName: fileName } });
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      addToast("Image removed successfully", "success");
    } catch (error) {
      console.error("Error deleting image:", error);
      addToast("Failed to remove image", "error");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerInput = () => inputRef.current.click();

  const handleUpdateBlog = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value && key !== 'blogtags') {
          formData.append(key, value);
        }
      });
      
      if (data.blogtags) {
        const tags = data.blogtags.split(',').map(tag => tag.trim());
        formData.append('blogtags', JSON.stringify(tags));
      }
      
      formData.append('blogcontent', content);
      
      existingImages.forEach(img => {
        formData.append('existingImages', img.url.split('/').pop());
      });
      
      files.forEach((file) => {
        formData.append('image', file);
      });
      
      const response = await http.put(`/updateblog/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      
      if (response.data.success) {
        addToast("Blog updated successfully!", "success");
        navigate('/viewbloglist');
      } else {
        addToast(response.data.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      addToast(error.response?.data?.message || error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    "Luxury Living", "Investment Tips", "Market Updates", "Buyer Guides",
    "Real Estate News", "Developer Spotlight", "Off-Plan Projects", "Property Management"
  ];

  const statuses = [
    { value: "draft", label: "Draft", color: "yellow" },
    { value: "published", label: "Published", color: "green" },
    { value: "archived", label: "Archived", color: "red" }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 px-4 md:py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-6 md:mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Update <span className="text-amber-500">Blog Post</span>
          </h1>
          <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Edit your blog content and settings
          </p>
        </div>

        <form onSubmit={handleSubmit(handleUpdateBlog)} className="space-y-6">
          
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Title Section */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <FileText size={14} className="text-white" />
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
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Meta Title</label>
                    <input
                      type="text"
                      {...register("seometatitle")}
                      placeholder="SEO optimized title (60-70 characters)"
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                      maxLength="70"
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Meta Description</label>
                    <textarea
                      {...register("seometadiscription")}
                      rows="2"
                      placeholder="Brief description for search engines (150-160 characters)"
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                      maxLength="160"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Image Upload Section */}
              <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Image size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Images</h3>
                    <p className="text-[10px] text-gray-500">Upload or manage images</p>
                  </div>
                </div>
                
                {existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-2">Existing Images</p>
                    <div className="grid grid-cols-2 gap-2">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img.url} alt={img.name} className="w-full h-20 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(idx, img.url)}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer ${
                    files.length > 0
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-950"
                      : isDark
                      ? "border-gray-600 hover:border-amber-400"
                      : "border-gray-300 hover:border-amber-400"
                  }`}
                  onClick={triggerInput}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    ref={inputRef}
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <UploadCloud size={32} className="mx-auto mb-1 text-gray-400" />
                  <p className="text-xs font-medium">Click or drag images here</p>
                  <p className="text-[9px] text-gray-500 mt-1">Max 10 images</p>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                    <p className="text-xs font-medium">New Images ({files.length})</p>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-8 h-8 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-[9px] text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button onClick={() => handleDeleteNewFile(index)} className="p-1 hover:bg-red-500/10 rounded">
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
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
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

                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Tags (comma separated)</label>
                    <input
                      type="text"
                      {...register("blogtags")}
                      placeholder="e.g., real estate, dubai, investment"
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Author Name</label>
                    <input
                      type="text"
                      {...register("blogauthor", { required: "Author name is required" })}
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                    />
                    {errors.blogauthor && <p className="text-xs text-red-500 mt-1">{errors.blogauthor.message}</p>}
                  </div>

                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Publish Date</label>
                    <input
                      type="date"
                      {...register("blogpublishdate")}
                      className={`w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-amber-500 text-xs ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
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
                {errors.blogsummary && <p className="text-xs text-red-500 mt-1">{errors.blogsummary.message}</p>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/viewbloglist')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 text-xs ${
                isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 text-xs"
            >
              {submitting ? (
                <><div className="animate-spin rounded-full h-3 w-3 border-t-2 border-white"></div> Updating...</>
              ) : (
                <><Save size={14} /> Update Blog</>
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
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export default UpdateBlog;