import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { http } from "../../../axios/axios";
import { toast } from "react-toastify";
import { useToast } from "../../../model/SuccessToasNotification";

const UpdateProperty = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { id } = useParams();

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
      } else {
        toast.error("Property not found");
      }
    } catch {
      toast.error("Failed to fetch property data");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
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

  const triggerInput = () => inputRef.current.click();

  const handleUpdateProperty = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const existingImages = [];
      const newFiles = [];

      files.forEach((file) => {
        if (file.isUrl) {
          existingImages.push(file);
        } else {
          newFiles.push(file);
        }
      });

      newFiles.forEach((file) => formData.append("image", file));
      formData.append("existingImages", JSON.stringify(existingImages));

      const response = await http.put(`/updateproperty/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        addToast("Property updated successfully!", "success");
        navigate("/propertydetails");
      } else {
        addToast(response.data.message || "Update failed", "error");
      }
    } catch (error) {
      addToast(error.response?.data?.message || error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-8">Update Property</h2>
      <form
        onSubmit={handleSubmit(handleUpdateProperty)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Image Upload & Preview */}
        <div className="border-4 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={triggerInput}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <i className="ri-upload-cloud-2-line text-5xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-600 text-center mb-2">
              Drag & Drop or Click to Upload Images
            </p>
            <p className="text-xs text-gray-400 mb-4">Max 5 files, 3MB each</p>
            <input
              type="file"
              ref={inputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Preview Uploaded and Existing Images */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {files.map((file, index) => {
              const imageUrl = file.isUrl
                ? file.name // server image URL
                : URL.createObjectURL(file); // local preview
              return (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden"
                >
                  <img
                    src={imageUrl}
                    alt={`property-${index}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    onClick={() => handleDelete(index)}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            { label: "Property Name", name: "propertyname" },
            { label: "Price", name: "price" },
            { label: "Bedroom", name: "bedroom" },
            { label: "Bathroom", name: "bathroom" },
            { label: "Square Foot", name: "squarefoot" },
            { label: "Floor", name: "floor" },
            { label: "Zip Code", name: "zipcode" },
            { label: "Address", name: "address" },
          ].map((field, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="mb-1 font-medium">{field.label}</label>
              <input
                type="text"
                placeholder={field.label}
                {...register(field.name, {
                  required: `${field.label} is required`,
                })}
                className={`border px-3 py-2 rounded-lg focus:outline-none ${
                  errors[field.name]
                    ? "border-red-600 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors[field.name] && (
                <p className="text-red-600 text-sm">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}

          {/* Dropdown Fields */}
          {[
            {
              label: "Property Type",
              name: "propertytype",
              options: ["House", "Apartment", "Land/Plot"],
            },
            {
              label: "Listing Type",
              name: "listingtype",
              options: ["Rent", "Sale", "Lease", "Investment"],
            },
            {
              label: "State",
              name: "state",
              options: [
                "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
                "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
                "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
                "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
                "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
              ],
            },
            {
              label: "City",
              name: "city",
              options: [
                "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata",
                "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna",
                "Vadodara", "Ludhiana", "Faridabad",
              ],
            },
            {
              label: "Amenities",
              name: "aminities",
              options: ["Power BackUp", "24/7 Water Supply", "Internet/Wifi", "Lift", "CCTV"],
            },
            {
              label: "Status",
              name: "status",
              options: ["Ready to Move", "Under Construction"],
            },
          ].map((field, idx) => (
            <div key={idx} className="mb-4">
              <label className="block mb-1 font-medium">{field.label}</label>
              <select
                {...register(field.name, {
                  required: `Please select ${field.label.toLowerCase()}`,
                })}
                className={`w-full border px-3 py-2 rounded-lg focus:outline-none ${
                  errors[field.name]
                    ? "border-red-600 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors[field.name] && (
                <p className="text-red-600 text-sm">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProperty;
