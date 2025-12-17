import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ArrowLeft, Wallet, Banknote, Smartphone, MapPin, Home, IndianRupee, Calendar, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { http } from '../../../axios/axios';
import { AuthContext } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyStateModel from '../../../model/EmptyStateModel';

const PaymentConfirmationForm = () => {
  const navigate = useNavigate();
  const { state: booking } = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true); // Initially true to show loader
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false); // For extra payment details

  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    watch,
    formState: { errors: paymentErrors },
  } = useForm();

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    setSelectedMethod(paymentMethod);
    if (paymentMethod && paymentMethod !== 'Cash') {
      setShowAdditionalDetails(true);
    } else {
      setShowAdditionalDetails(false);
    }
  }, [paymentMethod]);

  // Fetch some data on mount
  const getAdminstatusData = async () => {
    try {
      const response = await http.get("/agentstatus", { withCredentials: true });
      const data = response.data;
      // handle data if needed
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data and then set loading to false
  useEffect(() => {
    const fetchData = async () => {
      await getAdminstatusData();
      setLoading(false); // Data fetched, stop loading
    };
    fetchData();
  }, []);

  const handlePayment = async (bookingId, data) => {
    try {
      setIsSubmitting(true);
      if (!booking?.agentId || !booking?.propertyId?.price) {
        toast.error("Booking data is incomplete.");
        return;
      }
      const payload = { ...data };
      if (showAdditionalDetails && selectedMethod !== 'Cash') {
        if (!payload.transactionId || !payload.paymentDate) {
          toast.error("Please provide transaction ID and payment date.");
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log("No additional details provided");
      }
      const res = await http.post(
        `/confirmsale/${bookingId}?price=${booking.propertyId.price}&agentId=${booking.agentId._id}&propertyId=${booking.propertyId._id}`,
        payload,
        { withCredentials: true }
      );
      if (res.data.success) {
        setShowConfetti(true);
        toast.success("Payment confirmed successfully!");
        setTimeout(() => navigate("/viewallbookings"), 2000);
      } else {
        toast.error(res.data.message || "Failed to confirm payment.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    {
      id: 'UPI',
      name: 'UPI Payment',
      subtitle: 'Pay with any UPI app',
      icon: <Smartphone className="w-7 h-7" />,
      image: 'https://images.unsplash.com/photo-1594707974175-7b0f6441822a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-purple-500 to-purple-700',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
      textColor: 'text-purple-700 dark:text-purple-300',
      popular: true
    },
    {
      id: 'Cash',
      name: 'Cash On Delivery',
      subtitle: 'Pay when you receive',
      icon: <Banknote className="w-7 h-7" />,
      image: 'https://images.unsplash.com/photo-1602428523470-8ed0c4b987f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-green-500 to-green-700',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
      textColor: 'text-green-700 dark:text-green-300'
    },
    {
      id: 'Credit Card',
      name: 'Credit Card',
      subtitle: 'Visa, Mastercard, Rupay',
      icon: <CreditCard className="w-7 h-7" />,
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-blue-500 to-blue-700',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    {
      id: 'Debit Card',
      name: 'Debit Card',
      subtitle: 'All major banks',
      icon: <CreditCard className="w-7 h-7" />,
      image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30',
      textColor: 'text-indigo-700 dark:text-indigo-300'
    },
    {
      id: 'Net Banking',
      name: 'Net Banking',
      subtitle: '50+ banks supported',
      icon: <Wallet className="w-7 h-7" />,
      image: 'https://images.unsplash.com/photo-1574250889808-111924d2d8d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'from-teal-500 to-teal-700',
      bgColor: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30',
      textColor: 'text-teal-700 dark:text-teal-300'
    }
  ];

  if (!booking) {
    return (
      <EmptyStateModel
        type="custom"
        title="No Booking Found"
        message="Start by adding your Booking to see analytics here."
      />
    );
  }

  const property = booking?.propertyId || {};

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'} animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-300'} animate-pulse`} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's'
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 w-full py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`group flex items-center mb-8 px-4 py-2 rounded-xl transition-all duration-300 font-medium backdrop-blur-md ${theme === 'dark'
            ? 'bg-gray-800/50 text-indigo-400 hover:bg-gray-700/50 hover:text-indigo-300 border border-gray-700'
            : 'bg-white/50 text-indigo-600 hover:bg-white/70 hover:text-indigo-800 border border-white/20 shadow-lg'
            }`}
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Previous Page
        </button>

        {/* Layout */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Property Details */}
          <div className="xl:w-3/5 w-full">
            <div className={`rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300 ${theme === 'dark'
              ? 'bg-gray-800/90 border border-gray-700/50'
              : 'bg-white/90 border border-white/20'
              }`}>
              <div className="p-8">
                {loading ? (
                  <>
                    <Skeleton height={40} width="80%" className="mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <Skeleton height={30} width="90%" />
                      <Skeleton height={30} width="90%" />
                      <Skeleton height={30} width="90%" />
                      <Skeleton height={30} width="90%" />
                    </div>
                    <Skeleton height={100} className="mb-6" />
                  </>
                ) : (
                  <>
                    {/* Property Header */}
                    <div className="mb-6">
                      <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {property.propertyname || 'Luxury Property'}
                      </h2>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{property.city}, {property.state}</span>
                      </div>
                    </div>

                    {/* Property Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      {/* Property Type */}
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} backdrop-blur-sm`}>
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-500 rounded-lg mr-3">
                            <Home className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Property Type</span>
                            <p className="font-semibold">{property.propertytype || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      {/* Total Price */}
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} backdrop-blur-sm`}>
                        <div className="flex items-center">
                          <div className="p-2 bg-green-500 rounded-lg mr-3">
                            <IndianRupee className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Price</span>
                            <p className="font-bold text-xl text-green-600">₹{property.price?.toLocaleString() || '0'}</p>
                          </div>
                        </div>
                      </div>
                      {/* Location */}
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} backdrop-blur-sm`}>
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-500 rounded-lg mr-3">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Location</span>
                            <p className="font-semibold">{property.city || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      {/* State */}
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} backdrop-blur-sm`}>
                        <div className="flex items-center">
                          <div className="p-2 bg-orange-500 rounded-lg mr-3">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>State</span>
                            <p className="font-semibold">{property.state || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Description</h3>
                      <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {property.description || 'Experience luxury living in this exceptional property with premium amenities and prime location.'}
                      </p>
                    </div>

                    {/* Amenities */}
                    <div className={`border-t pt-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Premium Amenities</h3>
                      <div className="flex flex-wrap gap-3">
                        {property.aminities &&
                          Array.isArray(property.aminities) &&
                          property.aminities.map((item, index) => {
                            try {
                              const parsed = JSON.parse(item);
                              const list = Array.isArray(parsed) ? parsed : [parsed];
                              return list.map((val, i) => (
                                <span
                                  key={`${index}-${i}`}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
                                >
                                  {val}
                                </span>
                              ));
                            } catch {
                              return (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
                                >
                                  {item}
                                </span>
                              );
                            }
                          })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className="xl:w-2/5 w-full mt-8">
              <div className={`rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 ${theme === 'dark'
                ? 'bg-gray-800/90 border border-gray-700/50'
                : 'bg-white/90 border border-white/20'
                }`}>
                {loading ? (
                  <div className="p-8">
                    <Skeleton height={40} width="70%" className="mx-auto mb-6" />
                    <Skeleton height={30} width="50%" className="mx-auto mb-8" />
                    <Skeleton height={200} className="mb-6" />
                    <Skeleton height={60} className="rounded-xl" />
                  </div>
                ) : (
                  <>
                    {/* Payment Header */}
                    <div className="p-8 pb-0">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
                            <Shield className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-indigo-600'}`} />
                          </div>
                        </div>
                        <h2 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Secure Payment
                        </h2>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          Complete your booking safely
                        </p>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                          Booking ID: {booking._id?.slice(-8)}
                        </div>
                      </div>

                      {/* Price Summary */}
                      <div className={`p-6 rounded-xl mb-8 ${theme === 'dark'
                        ? 'bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700/30'
                        : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
                        }`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Total Amount
                          </span>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">
                              ₹{property.price?.toLocaleString() || '0'}
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              Including all taxes
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Form */}
                      <form onSubmit={handlePaymentSubmit((data) => handlePayment(booking._id, data))} className="space-y-6">
                        {/* Payment Method Selection */}
                        <div>
                          <label className={`block text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Choose Payment Method
                          </label>
                          <div className="grid grid-cols-1 gap-4">
                            {paymentMethods.map((method) => (
                              <label
                                key={method.id}
                                className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 transform hover:scale-[1.02] ${selectedMethod === method.id
                                  ? `${theme === 'dark' ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-xl' : 'border-indigo-500 ring-4 ring-indigo-200 shadow-xl'} scale-[1.02]`
                                  : `${theme === 'dark' ? 'border-gray-700 hover:border-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`
                                  } ${method.bgColor}`}
                              >
                                <input
                                  type="radio"
                                  {...registerPayment("paymentMethod", {
                                    required: "Payment method is required",
                                  })}
                                  value={method.id}
                                  className="absolute opacity-0"
                                />
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${method.gradient} shadow-lg mr-4`}>
                                      <div className="text-white">{method.icon}</div>
                                    </div>
                                    <div>
                                      <div className="flex items-center">
                                        <span className={`font-bold text-lg ${method.textColor}`}>
                                          {method.name}
                                        </span>
                                        {method.popular && (
                                          <span className="ml-2 px-2 py-1 text-xs font-bold text-orange-800 bg-orange-200 rounded-full">
                                            POPULAR
                                          </span>
                                        )}
                                      </div>
                                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {method.subtitle}
                                      </span>
                                    </div>
                                  </div>
                                  {selectedMethod === method.id && (
                                    <div className="animate-scale-in">
                                      <CheckCircle className="w-6 h-6 text-green-500" />
                                    </div>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                          {paymentErrors.paymentMethod && (
                            <p className="mt-3 text-sm text-red-500 flex items-center">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                              {paymentErrors.paymentMethod.message}
                            </p>
                          )}
                        </div>

                        {/* Conditionally show extra payment details */}
                        {showAdditionalDetails && selectedMethod !== 'Cash' && (
                          <div className="animate-fade-in">
                            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                              <h4 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Payment Details
                              </h4>
                              {/* Transaction ID */}
                              <div className="mb-4">
                                <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Transaction ID
                                </label>
                                <input
                                  type="text"
                                  {...registerPayment("transactionId", {
                                    required: true,
                                  })}
                                  className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                  placeholder="Enter Transaction ID"
                                />
                                {paymentErrors.transactionId && (
                                  <p className="text-sm text-red-500">Transaction ID is required</p>
                                )}
                              </div>
                              {/* Payment Date */}
                              <div>
                                <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Payment Date
                                </label>
                                <input
                                  type="date"
                                  {...registerPayment("paymentDate", {
                                    required: true,
                                  })}
                                  className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                />
                                {paymentErrors.paymentDate && (
                                  <p className="text-sm text-red-500">Payment date is required</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting || !selectedMethod}
                          className={`w-full py-4 px-6 font-bold text-lg rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${isSubmitting || !selectedMethod
                            ? 'bg-gray-400 cursor-not-allowed scale-100'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/25'
                            } text-white`}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing Payment...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <Shield className="w-5 h-5 mr-2" />
                              Complete Secure Payment
                            </span>
                          )}
                        </button>
                        
                        <div className={`text-center text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-4`}>
                          <div className="flex items-center justify-center mb-2">
                            <Shield className="w-4 h-4 mr-1" />
                            <span>256-bit SSL secured payment</span>
                          </div>
                          <p>Your payment information is encrypted and secure</p>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>

              {/* Why choose us? */}
              {!loading && (
                <div className={`mt-6 p-6 rounded-xl ${theme === 'dark'
                  ? 'bg-gray-800/50 border border-gray-700/50'
                  : 'bg-white/50 border border-white/20'
                  } backdrop-blur-md`}>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Why choose us?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Instant booking confirmation
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        24/7 customer support
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Secure payment gateway
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        No hidden charges
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentConfirmationForm;