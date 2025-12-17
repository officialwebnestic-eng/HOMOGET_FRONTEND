import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Briefcase, GraduationCap, FileText, Moon, Sun, Image } from "lucide-react";
import { http } from "../../../axios/axios";
import useGetRole from "../../../hooks/useGetRole";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";

// Validation schemas for each step
const stepSchemas = [
  yup.object({
    name: yup.string().required("Full Name is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    phone: yup.string().required("Phone number is required").matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    address: yup.string().required("Address is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    dateOfBirth: yup.date().required("Date of birth is required").max(new Date(), "Date cannot be in the future"),
    profilePhoto: yup.mixed()
      .required("Profile photo is required")
      .test("fileType", "Only image files are accepted (JPEG, PNG)", (value) => {
        if (!value) return false;
        if (value instanceof File) {
          return value.type.startsWith("image/");
        }
        return false;
      }),
    aadharNumber: yup
      .string()
      .required("Aadhar number is required")
      .matches(/^\d{12}$/, "Aadhar must be 12 digits"),
    panNumber: yup
      .string()
      .required("PAN number is required")
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  }),
  yup.object({
    previousCompany: yup.string().required("Previous Company is required"),
    role: yup.string().required("Designation is required"),
    experienceYears: yup
      .number()
      .typeError("Must be a number")
      .required("Experience is required")
      .min(0, "Experience cannot be negative"),
    previousSalary: yup
      .number()
      .typeError("Must be a number")
      .required("Previous salary is required")
      .min(0, "Salary cannot be negative"),
    currentSalary: yup
      .number()
      .typeError("Must be a number")
      .required("Current salary is required")
      .min(0, "Salary cannot be negative"),
    joiningDate: yup.date().required("Joining date is required"),
    skills: yup
      .string()
      .required("Skills are required")
      .test("is-valid-array", "Please enter at least one skill", (value) => {
        return value && value.split(",").map(s => s.trim()).filter(Boolean).length > 0;
      }),
  }),
];





const AddAgent = () => {
  const { theme } = useTheme();
  const totalSteps = 2; // update to match actual number of steps
  const [currentStep, setCurrentStep] = useState(0);
  const [filePreviews, setFilePreviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { RolesPermessionData } = useGetRole();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(stepSchemas[currentStep]),
    mode: "onTouched",
  });

  const watchedFiles = watch();

  // Effect to show toast on success or error
  useEffect(() => {
    if (submitSuccess) {
      addToast("Agent added successfully!", "success");
    }
  }, [submitSuccess, addToast]);

  useEffect(() => {
    if (submitError) {
      addToast(submitError, "error");
    }
  }, [submitError, addToast]);

  const onSubmit = async (data) => {
    const isValid = await trigger();
    if (!isValid) return;

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();

      // Append all form data to FormData
      for (const key in data) {
        if (data[key] instanceof File) {
          formData.append(key, data[key]);
        } else if (data[key] !== null && data[key] !== undefined) {
          if (data[key] instanceof Date) {
            formData.append(key, data[key].toISOString());
          } else {
            formData.append(key, data[key]);
          }
        }
      }

      const response = await http.post("/addagent", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status !== 200 && response.status !== 201) {
        setSubmitError(`Error: ${response.status} - ${response.data?.message || "Failed to add agent"}`);
        return;
      }

      reset();
      setCurrentStep(0);
      setFilePreviews({});
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const Input = useCallback(
    ({ name, label, type = "text", placeholder, options }) => {
      if (type === "select" && options) {
        return (
          <div className="">
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {label}
            </label>
            <select
              {...register(name)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300'
                }`}
            >
              <option value="">Select {label}</option>
              {options.map((option, index) => (
                <option key={index} value={option.value || option}>
                  {option.label || option}
                </option>
              ))}
            </select>
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
          </div>
        );
      }
      return (
        <div className="">
          <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {label}
          </label>
          <input
            type={type}
            {...register(name)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'border-gray-300 placeholder-gray-500'
              }`}
          />
          {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
        </div>
      );
    },
    [register, errors, theme]
  );

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
          delete newPreviews[name];
          return newPreviews;
        });
        setValue(name, null, { shouldValidate: true });
      }
    };

    return (
      <div className="">
        <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`flex items-center justify-center w-full border-2 border-dashed rounded-xl p-6 ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
          <label className="flex flex-col items-center justify-center w-full cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <Image className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Click to upload image (JPEG, PNG)
              </p>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
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
  }, [setValue, filePreviews, errors, theme]);

  // Render current step form
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={`rounded-2xl shadow-lg p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Personal Info */}
            <div className="flex flex-col sm:flex-row sm:items-center mb-6 text-center sm:text-left">
              {/* Icon Section */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto sm:mx-0 sm:mr-4 mb-3 sm:mb-0 ${theme === "dark" ? "bg-blue-900" : "bg-blue-100"
                  }`}
              >
                <User
                  className={`w-6 h-6 ${theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                />
              </div>

              {/* Text Section */}
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                >
                  Personal Info
                </h2>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                  Basic agent details
                </p>
              </div>
            </div>

            {/* Inputs */}
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
                  { value: "Maharashtra", label: "Maharashtra" },
                  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                  { value: "Karnataka", label: "Karnataka" },
                  { value: "Tamil Nadu", label: "Tamil Nadu" },
                  { value: "Delhi", label: "Delhi" },
                  { value: "West Bengal", label: "West Bengal" },
                  { value: "Gujarat", label: "Gujarat" },
                  { value: "Rajasthan", label: "Rajasthan" }
                ]}
              />
              <Input
                name="city"
                label="City"
                type="select"
                options={[
                  { value: "Mumbai", label: "Mumbai" },
                  { value: "Pune", label: "Pune" },
                  { value: "Nagpur", label: "Nagpur" },
                  { value: "Nashik", label: "Nashik" },
                  { value: "Ahmedabad", label: "Ahmedabad" },
                  { value: "Surat", label: "Surat" },
                  { value: "Vadodara", label: "Vadodara" },
                  { value: "Jaipur", label: "Jaipur" },
                  { value: "Udaipur", label: "Udaipur" },
                  { value: "Jodhpur", label: "Jodhpur" },
                  { value: "Kolkata", label: "Kolkata" },
                  { value: "Howrah", label: "Howrah" },
                  { value: "Darjeeling", label: "Darjeeling" }
                ]}
              />

              <Input name="aadharNumber" label="Aadhar Number" placeholder="123412341234" />
              <Input name="panNumber" label="PAN Number" placeholder="ABCDE1234F" />
              <FileInput
                name="profilePhoto"
                label="Profile Photo"
                required
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className={`rounded-2xl shadow-lg p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Professional Info */}
            <div className="flex items-center mb-6 flex-wrap sm:flex-nowrap">
              {/* Icon Box */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4 mb-2 sm:mb-0 ${theme === "dark" ? "bg-green-900" : "bg-green-100"
                  }`}
              >
                <Briefcase
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === "dark" ? "text-green-300" : "text-green-600"
                    }`}
                />
              </div>

              {/* Text Section */}
              <div>
                <h2
                  className={`text-lg sm:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                >
                  Professional Info
                </h2>
                <p
                  className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Work experience details
                </p>
              </div>
            </div>

            {/* Inputs */}
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
              <Input name="previousSalary" label="Previous Salary" type="number" placeholder="In inr" />
              <Input name="currentSalary" label="Expected Salary" type="number" placeholder="In Inr" />
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
      <div className="max-w-6xl mx-auto relative">
        {/* Success & Error handled via useEffect */}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {renderStep()}

          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
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

          {/* Buttons */}
          <div className="flex justify-between max-w-xl mx-auto mt-6">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className={`font-semibold py-2 px-6 rounded-lg disabled:opacity-50 ${theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                  }`}
              >
                Previous
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`font-semibold py-2 px-6 rounded-lg disabled:opacity-50 ${theme === 'dark'
                ? 'bg-blue-700 hover:bg-blue-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {currentStep === totalSteps - 1 ? "Submitting..." : "Loading..."}
                </span>
              ) : currentStep === totalSteps - 1 ? (
                "Submit"
              ) : (
                "Next"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgent;