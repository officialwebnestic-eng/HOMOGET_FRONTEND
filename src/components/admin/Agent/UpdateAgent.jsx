import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Briefcase, Sun, Moon } from "lucide-react";
import { http } from "../../../axios/axios";
import useGetRole from "../../../hooks/useGetRole";
import { useTheme } from "../../../context/ThemeContext";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useParams } from "react-router-dom";

// Validation schemas (create & update)
const createSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
  phone: yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required(),
  address: yup.string().required(),
  state: yup.string().required(),
  city: yup.string().required(),
  dateOfBirth: yup.date().max(new Date(), "Date cannot be in the future").required(),
  profilePhoto: yup.mixed()
    .required("Profile photo is required")
    .test("fileType", "Only image files are accepted (JPEG, PNG)", (value) => value && value.type.startsWith("image/")),
  aadharNumber: yup.string().matches(/^\d{12}$/, "Aadhar must be 12 digits").required(),
  panNumber: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN").required(),
});

const updateSchema = yup.object({
  name: yup.string(),
  email: yup.string().email(),
  password: yup.string().min(6),
  phone: yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
  address: yup.string(),
  state: yup.string(),
  city: yup.string(),
  dateOfBirth: yup.date().max(new Date(), "Date cannot be in the future"),
  profilePhoto: yup.mixed()
    .notRequired()
    .test("fileType", "Only image files are accepted (JPEG, PNG)", (value) => {
      if (!value) return true; // optional
      if (value instanceof File) {
        return value.type.startsWith("image/");
      }
      return false;
    }),
  aadharNumber: yup.string().matches(/^\d{12}$/, "Aadhar must be 12 digits"),
  panNumber: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN"),
});

const UpdateAgent = () => {
  const { theme, toggleTheme } = useTheme();
  const { RolesPermessionData } = useGetRole();
  const { agent, getOneAgent } = useGetAllAgent();
  const { id } = useParams();

  const isUpdateMode = Boolean(id);
  const resolverSchema = yupResolver(isUpdateMode ? updateSchema : createSchema);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: resolverSchema,
    mode: "onTouched",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [filePreviews, setFilePreviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isEditable, setIsEditable] = useState(!isUpdateMode); // auto-edit mode for create, optional for update

  // Fetch existing agent data if editing
  useEffect(() => {
    if (isUpdateMode) {
      getOneAgent(id);
    }
  }, [id, isUpdateMode, getOneAgent]);

  // Populate form with existing data
  useEffect(() => {
    if (agent) {
      reset(agent);
    }
  }, [agent, reset]);

  // Cleanup object URLs on unmount or change
  useEffect(() => {
    return () => {
      Object.values(filePreviews).forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [filePreviews]);

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditable(prev => {
      const newVal = !prev;
      if (newVal && agent) {
        reset(agent);
      }
      return newVal;
    });
  };

  const onSubmit = async (data) => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();
      for (const key in data) {
        const value = data[key];
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value);
          }
        }
      }

      const response = await http.put(`/updateagent/${id}`, formData, {
        withCredentials: true,
      });

      if (![200, 201].includes(response.status)) {
        throw new Error(response.data?.message || `API failed with status ${response.status}`);
      }

      // Refresh data after update
      getOneAgent(id);
      setCurrentStep(0);
      setFilePreviews({});
      setSubmitSuccess(true);
      setIsEditable(false);
    } catch (error) {
      console.error("Error submitting:", error);
      setSubmitError(error.response?.data?.message || error.message || "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    trigger().then((valid) => {
      if (valid && currentStep < 2) {
        setCurrentStep(prev => prev + 1);
      }
    });
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  // Input component
  const Input = useCallback(({ name, label, type = "text", placeholder, options }) => {
    if (type === "select" && options) {
      return (
        <div className="mb-6">
          <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {label}
          </label>
          <select
            {...register(name)}
            disabled={!isEditable}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300'
              }`}
          >
            <option value="">Select {label}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value || option}>{option.label || option}</option>
            ))}
          </select>
          {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
        </div>
      );
    }
    return (
      <div className="mb-6">
        <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          disabled={!isEditable}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'border-gray-300 placeholder-gray-500'
            }`}
        />
        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
      </div>
    );
  }, [register, errors, theme, isEditable]);

  const FileInput = useCallback(({ name, label, required = false }) => {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setValue(name, file, { shouldValidate: true });
        const previewUrl = URL.createObjectURL(file);
        setFilePreviews(prev => ({ ...prev, [name]: { url: previewUrl, name: file.name, type: file.type } }));
      } else {
        setFilePreviews(prev => {
          const newPreviews = { ...prev };
          if (newPreviews[name]) {
            URL.revokeObjectURL(newPreviews[name].url);
            delete newPreviews[name];
          }
          return newPreviews;
        });
        setValue(name, null, { shouldValidate: true });
      }
    };
    return (
      <div className="mb-6">
        <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`flex items-center justify-center w-full border-2 border-dashed rounded-xl p-6 ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
          <label className="flex flex-col items-center justify-center w-full cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <User className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Click to upload image (JPEG, PNG)
              </p>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              disabled={!isEditable}
              className="hidden"
            />
          </label>
        </div>
        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
        {filePreviews[name] && (
          <div className="mt-4">
            <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Preview of {filePreviews[name].name}:
            </p>
            <img
              src={filePreviews[name].url}
              alt="Preview"
              className="w-full max-w-xs h-auto object-contain rounded-lg border"
              onLoad={() => URL.revokeObjectURL(filePreviews[name].url)}
            />
          </div>
        )}
      </div>
    );
  }, [setValue, filePreviews, errors, theme, isEditable]);

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={`rounded-2xl shadow-lg p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input name="name" label="Full Name" placeholder="John Doe" />
              <Input name="email" type="email" label="Email" placeholder="john@example.com" />
              <Input name="password" type="password" label="Password" placeholder="At least 6 characters" />
              <Input name="phone" type="tel" label="Phone" placeholder="10 digits" />
              <Input name="dateOfBirth" type="date" label="Date of Birth" />
              <Input name="address" label="Address" placeholder="Full address" />

              <Input
                name="state"
                label="State"
                type="select"
                options={[
                  { value: "California", label: "California" },
                  { value: "Texas", label: "Texas" },
                  { value: "New York", label: "New York" },
                  { value: "Florida", label: "Florida" }
                ]}
              />
              <Input
                name="city"
                label="City"
                type="select"
                options={[
                  { value: "Los Angeles", label: "Los Angeles" },
                  { value: "New York", label: "New York" },
                  { value: "Chicago", label: "Chicago" },
                  { value: "Houston", label: "Houston" }
                ]}
              />

              <Input name="aadharNumber" label="Aadhar Number" placeholder="123412341234" />
              <Input name="panNumber" label="PAN Number" placeholder="ABCDE1234F" />
              <FileInput
                name="profilePhoto"
                label="Profile Photo"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className={`rounded-2xl shadow-lg p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Professional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input name="previousCompany" label="Previous Company" placeholder="Company name" />

              <Input
                name="role"
                label="Role"
                type="select"
                options={RolesPermessionData.map(role => ({
                  value: role.roleName,
                  label: role.roleName
                }))}
              />

              <Input name="experienceYears" label="Experience (Years)" type="number" placeholder="e.g. 5" />
              <Input name="previousSalary" label="Previous Salary" type="number" placeholder="In USD" />
              <Input name="currentSalary" label="Expected Salary" type="number" placeholder="In USD" />
              <Input name="joiningDate" label="Joining Date" type="date" />
            </div>
            {/* Skills */}
            <div className="mt-6">
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Skills
              </label>
              <textarea
                {...register("skills")}
                rows={4}
                placeholder="Comma-separated skills (e.g., JavaScript, React, Node.js)"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300 placeholder-gray-500'
                  }`}
              />
              {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen py-10 px-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="absolute top-0 right-0 p-2 rounded-full z-10"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-yellow-300" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Edit toggle & Save button */}
      {!isEditable && (
        <button
          onClick={handleEditToggle}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
        >
          Update Details
        </button>
      )}
      {isEditable && (
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      )}

      {/* Success/Error message */}
      {submitSuccess && (
        <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}>
          Agent updated successfully!
        </div>
      )}
      {submitError && (
        <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
          {submitError}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)();
        }}
        className="space-y-8"
      >
        {renderStep()}

        {/* Progress dots */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentStep
                  ? theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
                  : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between max-w-xl mx-auto mt-6">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className={`py-2 px-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              Previous
            </button>
          )}
          {currentStep < 2 && (
            <button
              type="button"
              onClick={handleNext}
              className={`py-2 px-4 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Next
            </button>
          )}
        </div>
        {/* Submit button on last step */}
        {currentStep === 2 && (
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
            >
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateAgent;