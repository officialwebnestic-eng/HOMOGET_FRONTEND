import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import { http } from '../../../axios/axios';

import { useTheme } from '../../../context/ThemeContext';
import { useToast } from "../../../model/SuccessToasNotification";


const UpdateBlog = () => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
   const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getBlogFromId(id);
  }, [id]);

  const getBlogFromId = async (id) => {
    try {
      const response = await http.get(`/getblog/${id}`);
      if (response.data.success === true) {
        const blogData = response.data.data;
        reset(blogData);

        if (blogData.image) {
          setFiles(
            Array.isArray(blogData.image)
              ? blogData.image.map((img) => ({ name: img, isUrl: true }))
              : []
          );
        }
      } else {
        addToast("Blog not found","error");
      }
    } catch (err) {
      addToast("Failed to fetch blog data","error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDelete = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerInput = () => inputRef.current.click();

const handleUpdateBlog = async (data) => {
  try {
    const updatedFormData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      updatedFormData.append(key, value);
    });

    // keep only file names for existing images
    const existingImages = [];
    files.forEach((file) => {
      if (file.isUrl) {
        // extract filename from URL
        const fileName = file.name.includes("https")
          ? file.name.split("/").pop()
          : file.name;
        existingImages.push(fileName);
      } else {
        updatedFormData.append("image", file); // multiple files
      }
    });

    // ✅ send each existing image separately
    existingImages.forEach((img) => updatedFormData.append("existingImages", img));

    const response = await http.put(`/updateblog/${id}`, updatedFormData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    if (response.data.success) {
      addToast("Blog updated successfully!", "success");
      navigate("/viewbloglist");
    } else {
      addToast(response.data.message || "Update failed", "error");
    }
  } catch (error) {
    addToast(error.response?.data?.message || error.message, "error");
  }
};


  return (
    <div className={`w-full mx-auto px-6 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl font-semibold mb-6">Update Blog</h1>
      <form
        onSubmit={handleSubmit(handleUpdateBlog)}
        className={`rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50 shadow-md'}`}
      >
        <div className="md:col-span-2">
          <div
            className={`border-2 border-dashed p-8 rounded-xl text-center transition cursor-pointer ${theme === 'dark' ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 hover:bg-gray-100'}`}
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
            <h3 className="text-lg font-semibold mt-2">
              Drag & drop or click to upload images
            </h3>
            <p className="text-sm opacity-70">Maximum 5 files, 3MB each</p>
          </div>

          {files.length > 0 && (
            <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'border border-green-600 bg-green-900 text-green-300' : 'border border-green-300 bg-green-50 text-green-700'}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">Files selected</div>
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="text-sm hover:underline"
                >
                  Clear All
                </button>
              </div>
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className={`border p-3 rounded-md flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                  >
                    <div>
                      <p className="font-semibold truncate max-w-[200px]">{file.name || "Uploaded file"}</p>
                      {file.size && (
                        <p className="text-xs opacity-60">{(file.size / 1024).toFixed(2)} KB</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Blog Fields */}
        {[
          { label: "Blog Title", name: "blogtitle", type: "text" },
          { label: "Blog Tags", name: "blogtags", type: "text" },
          { label: "Author Name", name: "blogauthor", type: "text" },
          { label: "Author ID", name: "blogauthorid", type: "text" },
          { label: "Blog Content", name: "blogcontent", type: "text" },
          { label: "Blog Summary", name: "blogsummary", type: "text" },

          { label: "Publish Date", name: "blogpublishdate", type: "date" },
          { label: "SEO Meta Title", name: "seometatitle", type: "text" },
          { label: "SEO Meta Description", name: "seometadiscription", type: "text" },
        ].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <input
              type={field.type}
              {...register(field.name, { required: `${field.label} is required` })}
              placeholder={field.label}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors[field.name] ? 'border-red-500 ring-red-400' : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-black focus:ring-blue-400'}`}
            />
            {errors[field.name] && <p className="text-xs text-red-600 mt-1">{errors[field.name]?.message}</p>}
          </div>
        ))}

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Blog Category</label>
          <select
            {...register("blogcategory", { required: "Please select blog category" })}
            defaultValue=""
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors.blogcategory ? 'border-red-500 ring-red-400' : theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-black focus:ring-blue-400'}`}
          >
            <option value="" disabled>Select category</option>
            {["Buying", "Selling", "Tips"].map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.blogcategory && <p className="text-xs text-red-600 mt-1">{errors.blogcategory.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            Update Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
