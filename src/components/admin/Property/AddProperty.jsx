import React, { useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { http } from "../../../axios/axios";
import { AuthContext } from "../../../context/AuthContext";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useTheme } from "../../../context/ThemeContext";
import { Eye, Upload, X, Home, DollarSign, Bed, Ruler, Building2, MapPin, Map, HandCoins, Mail, Phone, Loader, Plus, User, IndianRupee } from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 3;

const AddProperty = () => {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { agentList } = useGetAllAgent();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const { theme } = useTheme();
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const propertyType = watch("propertytype");

  const themeClasses = {
    light: {
      bg: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-800",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      input: "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500",
      button: {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-white hover:bg-gray-50 text-gray-700 border-gray-300",
        danger: "bg-red-600 hover:bg-red-700 text-white"
      },
      header: "bg-gradient-to-r from-blue-600 to-indigo-700",
      sectionBorder: "border-gray-200",
      fileUpload: files.length > 0
        ? "border-blue-200 bg-blue-50"
        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50",
      agentCard: "bg-white border-gray-200",
      agentText: "text-gray-800",
      agentSubtext: "text-gray-500",
      icon: "text-gray-400",
      checkbox: "text-blue-600 focus:ring-blue-500 border-gray-300",
      previewBorder: "border-gray-200",
      previewBg: "bg-gray-800/80",
      previewText: "text-white",
      previewSubtext: "text-gray-300",
      status: {
        Active: "text-green-700 bg-green-100",
        Inactive: "text-yellow-700 bg-yellow-100",
        Pending: "text-red-700 bg-red-100",
        default: "text-gray-700 bg-gray-100"
      },
      link: {
        primary: "text-blue-600 hover:text-blue-500",
        secondary: "text-gray-600 hover:text-gray-500"
      }
    },
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-white",
      textSecondary: "text-gray-300",
      border: "border-gray-700",
      input: "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500",
      button: {
        primary: "bg-blue-700 hover:bg-blue-600 text-white",
        secondary: "bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600",
        danger: "bg-red-700 hover:bg-red-600 text-white"
      },
      header: "bg-gradient-to-r from-blue-800 to-indigo-900",
      sectionBorder: "border-gray-700",
      fileUpload: files.length > 0
        ? "border-blue-800 bg-blue-900/20"
        : "border-gray-600 hover:border-blue-500 hover:bg-blue-900/20",
      agentCard: "bg-gray-800 border-gray-700",
      agentText: "text-white",
      agentSubtext: "text-gray-400",
      icon: "text-gray-400",
      checkbox: "text-blue-500 focus:ring-blue-500 border-gray-600",
      previewBorder: "border-gray-600",
      previewBg: "bg-gray-800/80",
      previewText: "text-white",
      previewSubtext: "text-gray-300",
      status: {
        Active: "text-green-300 bg-green-900",
        Inactive: "text-yellow-300 bg-yellow-900",
        Pending: "text-red-300 bg-red-900",
        default: "text-gray-300 bg-gray-700"
      },
      link: {
        primary: "text-blue-400 hover:text-blue-300",
        secondary: "text-gray-400 hover:text-gray-300"
      }
    }
  };

  const currentTheme = themeClasses[theme];

  const handleAgentChange = (e) => {
    const agent = agentList.find((a) => a._id === e.target.value);
    setSelectedAgent(agent);
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleFiles = (newFiles) => {
    const validFiles = [];
    const invalidFiles = [];

    Array.from(newFiles).forEach((file) => {
      if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
        invalidFiles.push(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB`);
      } else if (!file.type.startsWith("image/")) {
        invalidFiles.push(`${file.name} is not an image file`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      addToast(`Invalid files: ${invalidFiles.join(", ")}`, "error");
    }

    if (validFiles.length + files.length > MAX_FILES) {
      addToast(`Maximum ${MAX_FILES} images allowed`, "error");
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDelete = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleAddProperty = async (data) => {
    if (files.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      files.forEach((file, index) => {
        formData.append(`image`, file);
      });

      if (selectedAgent?._id) {
        formData.append("agentId", selectedAgent._id);
      }

      formData.append("aminities", JSON.stringify(selectedAmenities));

      const response = await http.post("/addproperty", formData, {
        headers: {
          "Content-Type": "multipart/form-data",

        },
        withCredentials: true
      });

      if (response.data.success) {
        addToast(response.data.message || "Property Added Succcessfully", "success");
        reset();
        setFiles([]);
        setSelectedAgent(null);
        setSelectedAmenities([]);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    } catch (error) {

      addToast(error.response?.data?.message || "Failed to add property", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const amenities = [
    'Swimming Pool', 'Garden', 'Garage', 'Security',
    'Parking', 'Elevator', 'Furnished', 'Air Conditioning',
    'WiFi', 'Balcony', 'Gym', 'Pet Friendly'
  ];

  const inputFields = [
    { label: "Property Name", name: "propertyname", icon: <Home className="h-5 w-5" /> },
    { label: "Price", name: "price", icon: < IndianRupee className="h-5 w-5" />, type: "number" },
    { label: "Bedrooms", name: "bedroom", icon: <Bed className="h-5 w-5" />, type: "number" },
    { label: "Bathrooms", name: "bathroom", icon: <Bed className="h-5 w-5" />, type: "number" },
    { label: "Area (sq.ft)", name: "squarefoot", icon: <Ruler className="h-5 w-5" />, type: "number" },
    { label: "Floor", name: "floor", icon: <Building2 className="h-5 w-5" />, type: "number" },
    { label: "Zip Code", name: "zipcode", icon: <MapPin className="h-5 w-5" /> },
    { label: "Property Address", name: "address", icon: <Map className="h-5 w-5" /> },
    { label: "Year Built", name: "yearBuilt", icon: <Building2 className="h-5 w-5" />, type: "number" },
    { label: "Total Floors", name: "totalFloors", icon: <Building2 className="h-5 w-5" />, type: "number" },
  ];

  const selectFields = [
    {
      label: "Property Type",
      name: "propertytype",
      options: ["House", "Apartment", "Villa", "Land/Plot", "Commercial"],
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Listing Type",
      name: "listingtype",
      options: ["Rent", "Sale", "Lease", "Investment"],
      icon: <HandCoins className="h-5 w-5" />,
    },
    {
      label: "Status",
      name: "status",
      options: ["Ready to Move", "Under Construction", "New Launch"],
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: "City",
      name: "city",
      options: ["Noida", "Lucknow", "Delhi", "Mumbai", "Bangalore", "Shahjahanpur"],
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      label: "State",
      name: "state",
      options: ["Uttar Pradesh", "Punjab", "Maharashtra", "Karnataka", "Delhi"],
      icon: <Map className="h-5 w-5" />,
    },
    {
      label: "Furnishing",
      name: "furnishing",
      options: ["Furnished", "Semi-Furnished", "Unfurnished"],
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Facing",
      name: "facing",
      options: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"],
      icon: <MapPin className="h-5 w-5" />,
    },
  ];

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${currentTheme.bg}`}>
      <div className={`max-w-7xl mx-auto rounded-xl shadow-lg overflow-hidden ${currentTheme.card}`}>

        <div className={`px-6 py-4 ${currentTheme.header}`}>
          <h2 className="text-2xl font-bold text-white">Add New Property</h2>
          <p className="text-blue-200">Fill in the details below to list your property</p>
        </div>

        <form onSubmit={handleSubmit(handleAddProperty)} className="p-6 space-y-8">

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-3"></div>
              <h3 className={`text-xl font-semibold ${currentTheme.text}`}>Property Images</h3>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${currentTheme.fileUpload}`}
              onClick={() => inputRef.current.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(Array.from(e.dataTransfer.files));
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="max-w-md mx-auto">
                <Upload className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                <h4 className={`text-lg font-medium mb-1 ${currentTheme.text}`}>
                  {files.length > 0 ? 'Add more images' : 'Upload property images'}
                </h4>
                <p className={`text-sm mb-2 ${currentTheme.textSecondary}`}>
                  Drag & drop images here or click to browse
                </p>
                <p className={`text-xs ${currentTheme.textSecondary}`}>
                  JPG, PNG (Max {MAX_FILES} images, {MAX_FILE_SIZE_MB}MB each)
                </p>
              </div>
              <input
                type="file"
                ref={inputRef}
                multiple
                hidden
                accept="image/*"
                onChange={(e) => handleFiles(Array.from(e.target.files))}
              />
            </div>


            {files.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {files.map((file, index) => (
                    <div key={index} className={`relative group rounded-lg overflow-hidden border h-32 ${currentTheme.previewBorder}`}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className={`absolute top-2 right-2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity ${currentTheme.previewBg}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className={`text-xs truncate ${currentTheme.previewText}`}>{file.name}</p>
                        <p className={`text-xs ${currentTheme.previewSubtext}`}>
                          {(file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className={`text-xs mt-2 ${currentTheme.textSecondary}`}>
                  {files.length} of {MAX_FILES} files uploaded
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Property Details - 23 fields in responsive grid */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-3"></div>
              <h3 className={`text-xl font-semibold ${currentTheme.text}`}>Property Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Input fields */}
              {inputFields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className={`block text-sm font-medium ${currentTheme.text}`}>
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {React.cloneElement(field.icon, { className: currentTheme.icon })}
                    </div>
                    <input
                      type={field.type || "text"}
                      {...register(field.name, { required: `${field.label} is required` })}
                      className={`pl-10 w-full rounded-md border shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 ${errors[field.name] ? "border-red-500" : currentTheme.input
                        } ${currentTheme.text}`}
                      placeholder={field.label}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
                  )}
                </div>
              ))}

              {/* Select fields */}
              {selectFields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className={`block text-sm font-medium ${currentTheme.text}`}>
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {React.cloneElement(field.icon, { className: currentTheme.icon })}
                    </div>
                    <select
                      {...register(field.name, { required: `${field.label} is required` })}
                      className={`pl-10 w-full rounded-md border shadow-sm py-2 pr-3 focus:ring-blue-500 focus:border-blue-500 ${errors[field.name] ? "border-red-500" : currentTheme.input
                        } ${currentTheme.text}`}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Amenities */}
          {(propertyType === 'House' || propertyType === 'Apartment' || propertyType === 'Villa') && (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-3"></div>
                <h3 className={`text-xl font-semibold ${currentTheme.text}`}>Amenities</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      id={`amenity-${amenity}`}
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className={`h-4 w-4 rounded focus:ring-blue-500 ${currentTheme.checkbox}`}
                    />
                    <label htmlFor={`amenity-${amenity}`} className={`ml-2 text-sm ${currentTheme.text}`}>
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Agent Selection */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className={`w-1.5 h-8 rounded-full mr-3 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Assign Agent
              </h3>
            </div>

            <div className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={`block text-sm   font-medium ${currentTheme.text}`}>
                    Select Agent
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${currentTheme.icon}`} />
                    </div>
                    <select
                      onChange={handleAgentChange}
                      className={`pl-10 w-full rounded-md border shadow-sm py-2 pr-3 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.input} ${currentTheme.text}`}
                      defaultValue=""
                    >
                      <option value="" disabled className={currentTheme.textSecondary}>
                        Select an agent
                      </option>
                      {agentList?.map((agent) => (
                        <option
                          key={agent._id}
                          value={agent._id}
                          className={currentTheme.text}
                        >
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedAgent && (
                  <div className={`rounded-lg p-4 border ${currentTheme.agentCard}`}>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={selectedAgent.profilePhoto || "https://randomuser.me/api/portraits/men/42.jpg"}
                          alt="Agent"
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                      </div>
                      <div>
                        <h4 className={`font-medium ${currentTheme.agentText}`}>
                          {selectedAgent.name}
                        </h4>
                        <p className={`text-sm ${currentTheme.agentSubtext}`}>
                          {selectedAgent.role || "Property Agent"}
                        </p>
                        <div className="flex space-x-2 mt-1">
                          <a
                            href={`mailto:${selectedAgent.email}`}
                            className={`text-sm flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                              }`}
                          >
                            <Mail className="h-4 w-4 mr-1" /> Email
                          </a>
                          {selectedAgent.phone && (
                            <a
                              href={`tel:${selectedAgent.phone}`}
                              className={`text-sm flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                                }`}
                            >
                              <Phone className="h-4 w-4 mr-1" /> Call
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-3"></div>
              <h3 className={`text-xl font-semibold ${currentTheme.text}`}>Description</h3>
            </div>

            <div className="space-y-1">
              <label className={`block text-sm font-medium ${currentTheme.text}`}>Property Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={5}
                className={`w-full rounded-md border shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? "border-red-500" : currentTheme.input
                  } ${currentTheme.text}`}
                placeholder="Describe the property features, location advantages, and other details..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div
            className={`pt-6 border-t flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0 ${currentTheme.sectionBorder}`}
          >
            {/* Reset Button */}
            <button
              type="button"
              onClick={() => {
                reset();
                setFiles([]);
                setSelectedAgent(null);
                setSelectedAmenities([]);
              }}
              className={`w-full sm:w-auto px-6 py-2 rounded-md shadow-sm text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${currentTheme.button.secondary}`}
            >
              Reset
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed ${currentTheme.button.primary}`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="inline h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus className="inline h-4 w-4 mr-2" />
                  Add Property
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProperty;