import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { http } from "../../../axios/axios";
import { toast } from "react-toastify";
import { useToast } from "../../../model/SuccessToasNotification";
import {
  UploadCloud, X, Check, FileText, Calendar, Tag, User, Hash, Type, List
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const CreateBlog = () => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const { addToast } = useToast();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();


  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles.slice(0, 5 - prev.length)]);
  };


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles.slice(0, 5 - prev.length)]);
  };

  const handleDelete = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };


  const triggerInput = () => inputRef.current.click();


  const handleAddProperty = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      files.forEach((file) => formData.append("image", file));

      const response = await http.post("/createblog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        addToast(response.data.message || "Blog Created Successfully", "success");
        reset();
        setFiles([]);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} min-h-screen py-10 px-4`}>
      <div className="w-full mx-auto rounded-2xl shadow-xl p-6 md:p-10 bg-white dark:bg-gray-800">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <FileText size={32} className="text-red-600" /> Create New Blog Post
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mt-2">
            Share your knowledge and insights with our community
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleAddProperty)} className="space-y-10">
          
          {/* Upload Section */}
          <section className="p-6 rounded-xl border border-dashed   bg-gray-50 dark:bg-gray-700">
            <h2 className="flex items-center gap-2 mb-4 text-lg md:text-xl font-semibold text-indigo-600">
              <UploadCloud size={22} /> Cover Images
            </h2>
            <div
              className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
                files.length > 0
                  ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950"
                  : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600"
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
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100  rounded-full flex items-center justify-center mb-3">
                  <UploadCloud className="text-red-500" size={26} />
                </div>
                <p className="text-base font-medium">
                  {files.length > 0 ? "Add more images" : "Upload cover images"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Drag & drop or click to select (max 5)
                </p>
              </div>
            </div>

            {/* File Previews */}
            {files.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selected Files ({files.length}/5)
                  </span>
                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    <X size={14} className="text-red-600" /> Clear All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg p-2 flex items-center bg-white dark:bg-gray-700 shadow-sm"
                    >
                      <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-600">
                        {file.type.startsWith("image/") ? (
                          <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div className="ml-2 flex-1 truncate">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        onClick={() => handleDelete(index)}
                        className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Blog Info */}
          <section className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Type, label: "Blog Title", name: "blogtitle", placeholder: "Enter blog title" },
                { icon: Tag, label: "Blog Tags", name: "blogtags", placeholder: "e.g. tips, buying" },
                { icon: User, label: "Author Name", name: "blogauthor", placeholder: "Author's name" },
                { icon: Hash, label: "Author ID", name: "blogauthorid", placeholder: "Author's ID" },
              ].map(({ icon: Icon, label, name, placeholder }) => (
                <div key={name}>
                  <label className= " text-sm font-medium mb-1 flex items-center gap-2 text-gray-600">
                    <Icon size={16} className="text-red-600" /> {label}
                  </label>
                  <input
                    type="text"
                    {...register(name, { required: `${label} is required` })}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                      errors[name]
                        ? "border-red-300 focus:ring-red-200"
                        : theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-400"
                        : "border-gray-300 focus:ring-indigo-200"
                    }`}
                  />
                  {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name].message}</p>}
                </div>
              ))}

              {/* Publish Date */}
              <div>
                <label className=" text-sm font-medium mb-1 flex items-center gap-2 text-red-600">
                  <Calendar size={16}  className="text-red-500"/> Publish Date
                </label>
                <input
                  type="date"
                  {...register("blogpublishdate", { required: "Publish date is required" })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                    errors.blogpublishdate
                      ? "border-red-300 focus:ring-red-200"
                      : theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-400"
                      : "border-gray-300 focus:ring-indigo-200"
                  }`}
                />
                {errors.blogpublishdate && <p className="text-sm text-red-600 mt-1">{errors.blogpublishdate.message}</p>}
              </div>
            </div>

            {/* Category + Summary */}
            <div className="space-y-5">
              <div>
                <label className=" text-sm font-medium mb-1 flex items-center gap-2 text-gray-600">
                  <List size={16} className="text-red-600" /> Blog Category
                </label>
                <select
                  {...register("blogcategory", { required: "Please select blog category" })}
                  defaultValue=""
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Select category</option>
                  {["Buying Guide", "Selling Tips", "Market Trends", "Home Improvement", "Finance"].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.blogcategory && <p className="text-sm text-red-600 mt-1">{errors.blogcategory.message}</p>}
              </div>

              {[
                { name: "blogsummary", label: "Blog Summary", rows: 3 },
                { name: "seometatitle", label: "SEO Meta Title", rows: 1 },
                { name: "seometadiscription", label: "SEO Meta Description", rows: 2 },
              ].map(({ name, label, rows }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  {rows === 1 ? (
                    <input
                      type="text"
                      {...register(name)}
                      placeholder={label}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <textarea
                      {...register(name, name === "blogsummary" ? { required: `${label} is required` } : {})}
                      rows={rows}
                      placeholder={label}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  )}
                  {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name].message}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Blog Content */}
          <section className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm">
            <label className=" text-sm font-medium mb-2 flex items-center gap-2 text-red-600">
              <FileText size={16} className="textr-red" /> Blog Content
            </label>
            <textarea
              {...register("blogcontent", { required: "Blog content is required" })}
              rows={10}
              placeholder="Write your blog content here..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.blogcontent && <p className="text-sm text-red-600 mt-1">{errors.blogcontent.message}</p>}
          </section>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => { reset(); setFiles([]); }}
              className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <X size={16} className="inline-block mr-1" /> Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className= " px-2 lg:px-6  py-2 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? "Publishing..." : (<><Check size={18} /> Publish</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
