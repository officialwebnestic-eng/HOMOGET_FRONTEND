import React from 'react';
import { useForm } from "react-hook-form";

import { http } from '../axios/axios';
import { useTheme } from '../context/ThemeContext'; 
 import { useToast } from '../model/SuccessToasNotification';

const VirtualTourBookingForm = () => {
    const { theme } = useTheme();
    const {addToast}=useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleTourBook = async (data) => {
        try {
            const response = await http.post("/bookingrequest", data);
            if (response.data.success === true) {
                addToast(response.data.message || "Your Request Successfully  Submitted","success");
            } else {
                addToast(response.data.error || "Booking failed","error");
            }
        } catch (error) {
         addToast(error.response?.data?.message || "Internal server error","error");
        }
    };

    return (
        <div className={`w-full min-h-screen flex items-center justify-center py-12 px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`max-w-4xl w-full p-8 rounded-xl shadow-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-3xl font-normal text-center mb-6 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Book a Virtual Property Tour
                </h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(handleTourBook)}>

                    {/* Full Name */}
                    <div className="flex flex-col">
                        <label className={`text-sm mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className={`p-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-600' 
                                : 'border border-gray-300 focus:ring-cyan-500'}`}
                            {...register("fullname", { required: "Full name is required" })}
                        />
                        {errors.fullname && (
                            <p className={`mt-2 p-2 rounded text-sm transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-red-900 text-red-200' 
                                : 'bg-red-100 text-red-800'}`}>
                                {errors.fullname.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className={`text-sm mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className={`p-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-600' 
                                : 'border border-gray-300 focus:ring-cyan-500'}`}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email address",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className={`mt-2 p-2 rounded text-sm transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-red-900 text-red-200' 
                                : 'bg-red-100 text-red-800'}`}>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col">
                        <label className={`text-sm mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="e.g. +1 234 567 890"
                            className={`p-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-600' 
                                : 'border border-gray-300 focus:ring-cyan-500'}`}
                            {...register("phoneno", { 
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                                    message: "Please enter a valid phone number"
                                }
                            })}
                        />
                        {errors.phoneno && (
                            <p className={`mt-2 p-2 rounded text-sm transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-red-900 text-red-200' 
                                : 'bg-red-100 text-red-800'}`}>
                                {errors.phoneno.message}
                            </p>
                        )}
                    </div>

                    {/* Property Selection */}
                    <div className="flex flex-col">
                        <label className={`text-sm mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Select Property
                        </label>
                        <select 
                            className={`p-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-600' 
                                : 'border border-gray-300 focus:ring-cyan-500'}`}
                            {...register("propertyname", { required: "Please select a property" })}
                        >
                            <option value="">-- Choose Property --</option>
                            <option>Downtown Luxury Villa</option>
                            <option>Oceanview Apartment</option>
                            <option>Suburban Family House</option>
                            <option>Penthouse in the City</option>
                        </select>
                        {errors.propertyname && (
                            <p className={`mt-2 p-2 rounded text-sm transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-red-900 text-red-200' 
                                : 'bg-red-100 text-red-800'}`}>
                                {errors.propertyname.message}
                            </p>
                        )}
                    </div>

                    {/* Location Selection */}
                    <div className="flex flex-col">
                        <label className={`text-sm mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Select Location
                        </label>
                        <select 
                            className={`p-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-600' 
                                : 'border border-gray-300 focus:ring-cyan-500'}`}
                            {...register("propertylocation", { required: "Please select a location" })}
                        >
                            <option value="">-- Choose Location --</option>
                            <option>New York</option>
                            <option>Los Angeles</option>
                            <option>Chicago</option>
                            <option>Miami</option>
                        </select>
                        {errors.propertylocation && (
                            <p className={`mt-2 p-2 rounded text-sm transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-red-900 text-red-200' 
                                : 'bg-red-100 text-red-800'}`}>
                                {errors.propertylocation.message}
                            </p>
                        )}
                    </div>

                    {/* Date */}
                    <div className="flex flex-col">
                        <label className={`text-sm mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Preferred Date
                        </label>
                        <input
                            type="date"
                            className={`p-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-600' 
                                : 'border border-gray-300 focus:ring-cyan-500'}`}
                            {...register("date", { required: "Please select a date" })}
                        />
                        {errors.date && (
                            <p className={`mt-2 p-2 rounded text-sm transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-red-900 text-red-200' 
                                : 'bg-red-100 text-red-800'}`}>
                                {errors.date.message}
                            </p>
                        )}
                    </div>

                    {/* Time */}
                    <div className="flex flex-col">
                        <label className={`text-sm mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Preferred Time
                        </label>
                        <input
                            type="time"
                            className={`p-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-600' 
                                : 'border border-gray-300 focus:ring-cyan-500'}`}
                            {...register("time", { required: "Please select a time" })}
                        />
                        {errors.time && (
                            <p className={`mt-2 p-2 rounded text-sm transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-red-900 text-red-200' 
                                : 'bg-red-100 text-red-800'}`}>
                                {errors.time.message}
                            </p>
                        )}
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2 flex flex-col">
                        <label className={`text-sm mb-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Message (Optional)
                        </label>
                        <textarea
                            placeholder="Any specific questions or notes..."
                            rows="4"
                            className={`p-3 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-600' 
                                : 'border border-gray-300 focus:ring-cyan-500'}`}
                            {...register("message")}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className={`px-6 py-3 rounded-lg transition-all duration-300 ${theme === 'dark' 
                                ? 'bg-gradient-to-r from-cyan-700 to-lime-600 hover:from-cyan-600 hover:to-lime-500 text-white' 
                                : 'bg-gradient-to-r from-cyan-600 to-lime-500 hover:from-cyan-500 hover:to-lime-400 text-white'}`}
                        >
                            Book Virtual Tour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VirtualTourBookingForm;