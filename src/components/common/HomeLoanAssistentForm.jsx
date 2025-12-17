import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Home, User, Briefcase, CreditCard, FileText, Calculator, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { http } from "../../axios/axios";
import { useToast } from "../../model/SuccessToasNotification";

const HomeLoanAssistantForm = () => {
  // Destructure useForm hooks
  const { register, handleSubmit, trigger, reset, formState: { errors }, watch } = useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { addToast } = useToast();

  const steps = [
    { id: 0, title: "Personal Details", icon: User, description: "Basic information about you" },
    { id: 1, title: "Property Info", icon: Home, description: "Details about your property" },
    { id: 2, title: "Employment", icon: Briefcase, description: "Your employment details" },
    { id: 3, title: "Financial Info", icon: CreditCard, description: "Financial background" },
    { id: 4, title: "Review", icon: FileText, description: "Review and submit" },
  ];

  // Utility for formatting INR
  const formatINR = (amount) =>
    amount
      ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
      : "-";

  // Validation functions
  const validateEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  const validatePAN = (pan) => /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(pan);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);


  const validateStep = async () => {
    let fields = [];
    switch (currentStep) {
      case 0:
        fields = ["fullName", "email", "phone", "panNumber", "address"];
        break;
      case 1:
        fields = [" bankname,propertyLocation", "propertyType", "propertyValue", "loanAmount", "downPayment", "loanTerm"];
        break;
      case 2:
        fields = ["employmentStatus", "monthlyIncome", "employmentDuration"];
        break;
      case 3:
        // optional validation
        break;
      case 4:
        // review, no validation
        break;
      default:
        break;
    }
    const result = await trigger(fields);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

const onSubmit = async (data) => {
  console.log(data);
  const isValid = await trigger(); 
  if (!isValid) return;

  setIsSubmitting(true);
  try {
    const response = await http.post("/createloanrequest", data);
    if (response.data.success === true) {
      setSubmitSuccess(true);
      addToast("Loan request submitted successfully. We will contact you soon.", "success");
      reset(); 
    } else {
      setSubmitSuccess(false);
      addToast(response.data.message || "Error in creating loan request. Please try again later.", "error");
    }
  } catch (error) {
    // Safely handle error response
    const errorMessage = error.response?.data?.message || "An error occurred while submitting the form. Please try again later.";
    addToast(errorMessage, "error");
  } finally {
    setIsSubmitting(false);
  }
};

  // Render step content
  const renderStep = () => {
    // Call watch() inside render to get current form values
    const formData = watch();

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("fullName", { required: "Full name is required" })}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    validate: validateEmail,
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="example@domain.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.email.message || "Invalid email"}
                  </p>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone", {
                    required: "Phone is required",
                    validate: validatePhone,
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="9876543210"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.phone.message || "Invalid phone"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("panNumber", {
                    required: "PAN is required",
                    pattern: { value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/, message: "Invalid PAN format" },
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="ABCDE1234F"
                />
                {errors.panNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.panNumber.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Address <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("address", { required: "Address is required" })}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter your complete address"
                rows={4}
              />
              {errors.address && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.address.message}
                </p>
              )}
            </div>
          </div>
        );
      case 1:
        // Property Info
        return (
          <div className="space-y-6">
            {/* Loan Summary Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loan Summary</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Loan Amount */}
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Loan Amount</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatINR(Number(watch("loanAmount")))}</p>
                </div>
                {/* Property Value */}
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Property Value</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatINR(Number(watch("propertyValue")))}</p>
                </div>
                {/* Down Payment */}
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Down Payment</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {Number(watch("downPayment")) > 0
                      ? `${formatINR(Number(watch("downPayment")))} (${Math.round((Number(watch("downPayment")) / Number(watch("propertyValue"))) * 100)}%)`
                      : "-"}
                  </p>
                </div>
                {/* LTV Ratio */}
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">LTV Ratio</p>
                  <p
                    className={`font-semibold ${getLTVStatus() === "error" ? "text-red-500" : "text-gray-900 dark:text-white"
                      }`}
                  >
                    {Number(watch("loanAmount")) && Number(watch("propertyValue"))
                      ? Math.round((Number(watch("loanAmount")) / Number(watch("propertyValue"))) * 100) + "%"
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
            {/* Property Details Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Property Location <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("propertyLocation", { required: "Select property location" })}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Select --</option>
                  <option value="metro">Metro City</option>
                  <option value="tier1">Tier 1 City</option>
                  <option value="tier2">Tier 2 City</option>
                  <option value="rural">Rural Area</option>
                </select>
                {errors.propertyLocation && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.propertyLocation.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("propertyType", { required: "Select property type" })}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Select --</option>
                  <option value="residential">Residential House</option>
                  <option value="apartment">Apartment/Flat</option>
                  <option value="plot">Plot/Land</option>
                  <option value="villa">Villa</option>
                </select>
                {errors.propertyType && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.propertyType.message}
                  </p>
                )}
              </div>
            </div>
            {/* Property Values */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Property Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Property Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("propertyValue", { required: "Property value is required", min: { value: 500000, message: "Minimum ₹5,00,000" } })}
                  placeholder="50,00,000"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.propertyValue && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.propertyValue.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="string"
                  {...register("bankName", { required: "Bank value is required", })}
                  placeholder="HDFC Bank ,ICICI Bank, SBI"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.bankName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.bankName.message}
                  </p>
                )}
              </div>
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Loan Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("loanAmount", { required: "Loan amount is required", min: { value: 100000, message: "Minimum ₹1,00,000" } })}
                  placeholder="40,00,000"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.loanAmount && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.loanAmount.message}
                  </p>
                )}
              </div>
              {/* Down Payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Down Payment <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("downPayment", { required: "Down payment is required", min: { value: 0, message: "Invalid amount" } })}
                  placeholder="10,00,000"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.downPayment && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.downPayment.message}
                  </p>
                )}
              </div>
            </div>
            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loan Term <span className="text-red-500">*</span>
              </label>
              <select
                {...register("loanTerm", { required: "Select loan term" })}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">-- Select --</option>
                <option value="5">5 Years</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="25">25 Years</option>
                <option value="30">30 Years</option>
              </select>
              {errors.loanTerm && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.loanTerm.message}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        // Employment Details
        return (
          <div className="space-y-6">
            {/* Employment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employment Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("employmentStatus", { required: "Employment status is required" })}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">-- Select --</option>
                <option value="salaried">Salaried</option>
                <option value="self_employed">Self-Employed</option>
                <option value="professional">Professional (CA/Doctor/Lawyer)</option>
                <option value="retired">Retired</option>
              </select>
              {errors.employmentStatus && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.employmentStatus.message}
                </p>
              )}
            </div>
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name
              </label>
              <input
                {...register("companyName")}
                className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter company name"
              />
            </div>
            {/* Monthly Income & Employment Duration */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Monthly Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Income <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("monthlyIncome", { required: "Monthly income required", min: { value: 1, message: "Invalid" } })}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="75,000"
                />
                {errors.monthlyIncome && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.monthlyIncome.message}
                  </p>
                )}
              </div>
              {/* Employment Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Years at Current Job <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("employmentDuration", { required: "Employment duration required", min: { value: 0, message: "Invalid" } })}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="2"
                />
                {errors.employmentDuration && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.employmentDuration.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {/* EMI Payments */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Do you have ongoing EMI payments?
              </label>
              <div className="flex items-center space-x-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  {...register("ongoingEMI")}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${watch("ongoingEMI") ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {watch("ongoingEMI") && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <label
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={() => {
                    // toggle checkbox if needed
                  }}
                >
                  Yes, I do
                </label>
              </div>
            </div>

            {/* EMI Details if ongoingEMI */}
            {watch("ongoingEMI") && (
              <div className="ml-8 space-y-4">
                {/* EMI Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Monthly EMI Amount
                  </label>
                  <input
                    {...register("emiAmount")}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="15,000"
                  />
                </div>
                {/* EMI Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">EMI Type</label>
                  <select
                    {...register("emiType")}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">-- Select --</option>
                    <option value="car_loan">Car Loan</option>
                    <option value="personal_loan">Personal Loan</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="home_loan">Home Loan</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Past Loans */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Have you taken loans in last 5 years?
              </label>
              <div className="flex items-center space-x-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  {...register("pastLoans")}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${watch("pastLoans") ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {watch("pastLoans") && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => {
                  // toggle checkbox
                }}>Yes, I have</label>
              </div>
            </div>

            {/* Past Loan Details if pastLoans */}
            {watch("pastLoans") && (
              <div className="ml-8 space-y-4">
                {/* Loan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Type</label>
                  <select
                    {...register("pastLoanType")}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">-- Select --</option>
                    <option value="home_loan">Home Loan</option>
                    <option value="car_loan">Car Loan</option>
                    <option value="personal_loan">Personal Loan</option>
                    <option value="education_loan">Education Loan</option>
                  </select>
                </div>
                {/* Loan Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Status</label>
                  <select
                    {...register("pastLoanStatus")}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">-- Select --</option>
                    <option value="paid">Paid Off</option>
                    <option value="defaulted">Defaulted</option>
                    <option value="settled">Settled</option>
                  </select>
                </div>
              </div>
            )}

            {/* Existing Home Loan */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Do you have an existing home loan?
              </label>
              <div className="flex items-center space-x-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  {...register("existingLoan")}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${watch("existingLoan") ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {watch("existingLoan") && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => {
                  // toggle checkbox
                }}>Yes, I do</label>
              </div>
            </div>

            {/* Existing Loan Details */}
            {watch("existingLoan") && (
              <div className="ml-8 space-y-4">
                {/* Outstanding Balance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Outstanding Balance</label>
                  <input
                    {...register("existingLoanBalance")}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="15,00,000"
                  />
                </div>
                {/* Monthly Payment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Payment</label>
                  <input
                    {...register("existingLoanPayment")}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="12,000"
                  />
                </div>
                {/* Lender Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lender Name</label>
                  <input
                    {...register("existingLoanLender")}
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Bank Name"
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 4:
        // Review

        return (
          <div className="space-y-6">
            {/* Summary display */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-green-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Application Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {formData.fullName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {formData.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {formData.phone}
                  </div>
                  <div>
                    <span className="font-medium">Employment:</span> {formData.employmentStatus}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Property Type:</span> {formData.propertyType}
                  </div>
                  <div>
                    <span className="font-medium">Loan Amount:</span> {formatINR(Number(formData.loanAmount))}
                  </div>
                  <div>
                    <span className="font-medium">Property Value:</span> {formatINR(Number(formData.propertyValue))}
                  </div>
                  <div>
                    <span className="font-medium">Loan Term:</span> {formData.loanTerm} Years
                  </div>
                </div>
              </div>
            </div>
            {/* Additional notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Notes
              </label>
              <textarea
                {...register("additionalNotes")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 hover:border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Any additional information or questions..."
              />
            </div>
            {/* Terms & Conditions */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                By submitting this application, you agree to our{" "}
                <a href="#" className="font-medium underline hover:no-underline">Terms & Conditions</a> and{" "}
                <a href="#" className="font-medium underline hover:no-underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Helper function for LTV status
  const getLTVStatus = () => {
    const loan = Number(watch("loanAmount")) || 0;
    const value = Number(watch("propertyValue")) || 0;
    if (loan === 0 || value === 0) return "neutral";
    const ltv = (loan / value) * 100;
    if (
      (loan <= 3000000 && ltv > 90) ||
      (loan > 3000000 && loan <= 7500000 && ltv > 80) ||
      (loan > 7500000 && ltv > 75)
    )
      return "error";
    return "success";
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl">
          <div className="mx-auto mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Application Submitted Successfully!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Thank you for your application. Our team will review your information and contact you within 24-48 hours.</p>
          <motion.button
            onClick={() => {
              setSubmitSuccess(false);
              reset();
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit Another Application
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mt-10 mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Home Loan Application
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your application in simple steps</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center relative">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${isActive ? "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 text-white shadow-lg" :
                        isCompleted ? "bg-green-500 border-green-500 text-white" :
                          "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                      }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Previous Button */}
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${currentStep === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              whileHover={currentStep !== 0 ? { scale: 1.02 } : {}}
              whileTap={currentStep !== 0 ? { scale: 0.98 } : {}}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Previous
            </motion.button>

            {/* Next or Submit Button */}
            {currentStep < steps.length - 1 ? (
              <motion.button
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 flex items-center gap-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@homeloan.com" className="text-blue-600 hover:underline">support@homeloan.com</a> or call{" "}
            <a href="tel:+911800123456" className="text-blue-600 hover:underline">1800-123-456</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeLoanAssistantForm;