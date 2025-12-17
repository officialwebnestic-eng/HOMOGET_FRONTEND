import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';
import { http } from '../../axios/axios';
import { toast } from 'react-toastify';
import SuccessPropertyAdd from '../../model/SuccessPropertyAdd';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const PropertyRegistrationForm = () => {
  const [propertyType, setPropertyType] = useState('');
  const [showModel, setShowModel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  const themeClasses = {
    dark: {
      bg: 'bg-gray-900',
      card: 'bg-gray-800 border-gray-700',
      text: 'text-gray-100',
      input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:outline-none',
      button: 'bg-blue-600 hover:bg-blue-700',
      checkbox: 'bg-gray-700 border-gray-600 focus:ring-blue-500',
      error: 'text-red-400',
    },
    light: {
      bg: 'bg-gray-50',
      card: 'bg-white border-gray-200',
      text: 'text-gray-800',
      input: 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:outline-none',
      button: 'bg-blue-600 hover:bg-blue-700',
      checkbox: 'bg-white border-gray-300 focus:ring-blue-500',
      error: 'text-red-600',
    },
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  const validationSchema = Yup.object().shape({
    propertyname: Yup.string().required('Property name is required'),
    propertytype: Yup.string().required('Property type is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    listingtype: Yup.string().required('Listing type is required'),
    price: Yup.string().required('Price is required'),
    status: Yup.string().required('Status is required'),
    zipcode: Yup.number().required('Zipcode is required'),
    terms: Yup.boolean().oneOf([true], 'You must accept terms'),
    image: Yup.array().min(1, 'At least one image is required'),

    ...(propertyType === 'house' ? {
      bathroom: Yup.string().required('Bathroom is required'),
      bedroom: Yup.string().required('Bedroom is required'),
      floor: Yup.string().required('Floor is required'),
      squarefoot: Yup.string().required('Square footage is required'),
    } : {}),
    ...(propertyType === 'land' ? {
      squarefoot: Yup.string().required('Square footage is required'),
    } : {})
  });

  const formik = useFormik({
    initialValues: {
      propertyname: '',
      propertytype: '',
      address: '',
      bathroom: '',
      bedroom: '',
      city: '',
      state: '',
      floor: '',
      listingtype: '',
      price: '',
      squarefoot: '',
      aminities: [],
      status: '',
      zipcode: '',
      terms: false,
      image: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'image') {
          value.forEach((file) => formData.append('image', file));
        } else if (key === 'aminities') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      try {
        const response = await http.post('/addpropertybyuser', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.success) {
          setShowModel(true);
          formik.resetForm();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to submit property');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'land', label: 'Land' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const listingTypes = ['For Sale', 'For Rent', 'For Lease'];
  const statusOptions = ['Available', 'Pending', 'Sold'];

  const amenities = [
    'Swimming Pool', 'Garden', 'Garage', 'Security', 
    'Parking', 'Elevator', 'Furnished', 'Air Conditioning'
  ];

  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
    formik.handleChange(e);
    // Reset conditional fields
    if (e.target.value !== 'house') {
      formik.setFieldValue('bedroom', '');
      formik.setFieldValue('bathroom', '');
      formik.setFieldValue('floor', '');
    }
    if (e.target.value !== 'land') {
      formik.setFieldValue('squarefoot', '');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    formik.setFieldValue('image', files);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg border ${currentTheme.card}`}
      >
        <h1 className={`text-3xl font-semibold mb-6 ${currentTheme.text}`}>Register Your Property</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          
          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Name */}
            <div className="col-span-2">
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Property Name *</label>
              <input
                type="text"
                name="propertyname"
                placeholder="e.g., Neha House"
                className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.propertyname && formik.errors.propertyname ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.propertyname}
              />
              {formik.touched.propertyname && formik.errors.propertyname && (
                <p className={`text-sm ${currentTheme.error}`}>{formik.errors.propertyname}</p>
              )}
            </div>

            {/* Property Type */}
            <div className="col-span-2">
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Property Type *</label>
              <select
                name="propertytype"
                className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.propertytype && formik.errors.propertytype ? 'border-red-500' : ''}`}
                onChange={handlePropertyTypeChange}
                onBlur={formik.handleBlur}
                value={formik.values.propertytype}
              >
                <option value="">Select property type</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {formik.touched.propertytype && formik.errors.propertytype && (
                <p className={`text-sm ${currentTheme.error}`}>{formik.errors.propertytype}</p>
              )}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Address *</label>
              <input
                type="text"
                name="address"
                placeholder="123 Main St, Near Park"
                className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.address && formik.errors.address ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />
              {formik.touched.address && formik.errors.address && (
                <p className={`text-sm ${currentTheme.error}`}>{formik.errors.address}</p>
              )}
            </div>

            {/* Conditional: Bedrooms, Bathrooms, Floors */}
            {propertyType === 'house' && (
              <>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Bedrooms *</label>
                  <input
                    type="number"
                    name="bedroom"
                    placeholder="e.g., 3"
                    className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.bedroom && formik.errors.bedroom ? 'border-red-500' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bedroom}
                  />
                  {formik.touched.bedroom && formik.errors.bedroom && (
                    <p className={`text-sm ${currentTheme.error}`}>{formik.errors.bedroom}</p>
                  )}
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Bathrooms *</label>
                  <input
                    type="number"
                    name="bathroom"
                    placeholder="e.g., 2"
                    className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.bathroom && formik.errors.bathroom ? 'border-red-500' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bathroom}
                  />
                  {formik.touched.bathroom && formik.errors.bathroom && (
                    <p className={`text-sm ${currentTheme.error}`}>{formik.errors.bathroom}</p>
                  )}
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Floors *</label>
                  <input
                    type="number"
                    name="floor"
                    placeholder="e.g., 2"
                    className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.floor && formik.errors.floor ? 'border-red-500' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.floor}
                  />
                  {formik.touched.floor && formik.errors.floor && (
                    <p className={`text-sm ${currentTheme.error}`}>{formik.errors.floor}</p>
                  )}
                </div>
              </>
            )}

            {/* Square Footage (for all properties) */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Square Footage *</label>
              <input
                type="number"
                name="squarefoot"
                placeholder="e.g., 1500"
                className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.squarefoot && formik.errors.squarefoot ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.squarefoot}
              />
              {formik.touched.squarefoot && formik.errors.squarefoot && (
                <p className={`text-sm ${currentTheme.error}`}>{formik.errors.squarefoot}</p>
              )}
            </div>

            {/* Location: City & State */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>City *</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.city && formik.errors.city ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
              />
              {formik.touched.city && formik.errors.city && (
                <p className={`text-sm ${currentTheme.error}`}>{formik.errors.city}</p>
              )}
            </div>
            <div>
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>State *</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.state && formik.errors.state ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.state}
              />
              {formik.touched.state && formik.errors.state && (
                <p className={`text-sm ${currentTheme.error}`}>{formik.errors.state}</p>
              )}
            </div>

            {/* Zipcode */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Zipcode *</label>
              <input
                type="number"
                name="zipcode"
                placeholder="Zipcode"
                className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.zipcode && formik.errors.zipcode ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.zipcode}
              />
              {formik.touched.zipcode && formik.errors.zipcode && (
                <p className={`text-sm ${currentTheme.error}`}>{formik.errors.zipcode}</p>
              )}
            </div>
          </div>

          {/* Listing & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Listing Type */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Listing Type *</label>
              <select
                name="listingtype"
                className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.listingtype && formik.errors.listingtype ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.listingtype}
              >
                <option value="">Select listing type</option>
                {listingTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {formik.touched.listingtype && formik.errors.listingtype && (
                <p className={`text-sm ${currentTheme.error}`}>{formik.errors.listingtype}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Price *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className={currentTheme.textSecondary}>$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  className={`w-full p-3 pl-8 pr-4 rounded-md ${currentTheme.input} ${formik.touched.price && formik.errors.price ? 'border-red-500' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
              </div>
              {formik.touched.price && formik.errors.price && (
                <p className={`text-sm ${currentTheme.error}`}>{formik.errors.price}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="mt-4">
            <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Status *</label>
            <select
              name="status"
              className={`w-full p-3 rounded-md ${currentTheme.input} ${formik.touched.status && formik.errors.status ? 'border-red-500' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
            >
              <option value="">Select status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {formik.touched.status && formik.errors.status && (
              <p className={`text-sm ${currentTheme.error}`}>{formik.errors.status}</p>
            )}
          </div>

          {/* Amenities (for house/apartment) */}
          {(propertyType === 'house' || propertyType === 'apartment') && (
            <div className="mt-4">
              <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      checked={formik.values.aminities.includes(amenity)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          formik.setFieldValue('aminities', [...formik.values.aminities, amenity]);
                        } else {
                          formik.setFieldValue('aminities', formik.values.aminities.filter((a) => a !== amenity));
                        }
                      }}
                      className={`h-4 w-4 ${currentTheme.checkbox}`}
                    />
                    <label htmlFor={`amenity-${amenity}`} className={`text-sm ${currentTheme.text}`}>{amenity}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload with Preview */}
          <div className="mt-6">
            <label className={`block mb-2 text-sm font-medium ${currentTheme.text}`}>Images *</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full p-2 border border-dashed rounded-md ${currentTheme.input}`}
            />
            {formik.errors.image && (
              <p className={`mt-2 text-sm ${currentTheme.error}`}>{formik.errors.image}</p>
            )}

            {/* Preview Thumbnails */}
            {formik.values.image.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {formik.values.image.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded shadow"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="mt-6 flex items-start">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formik.values.terms}
              onChange={formik.handleChange}
              className={`h-4 w-4 ${currentTheme.checkbox}`}
            />
            <label htmlFor="terms" className={`ml-2 text-sm ${currentTheme.text}`}>
              I agree to the <a href="#" className="text-blue-500 underline">terms and conditions</a> *
            </label>
            {formik.touched.terms && formik.errors.terms && (
              <p className={`mt-1 text-sm ${currentTheme.error}`}>{formik.errors.terms}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-md font-semibold text-white ${currentTheme.button} hover:scale-105 transition transform ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Register Property'
              )}
            </button>
          </div>
        </form>
        {/* Success Modal */}
        {showModel && <SuccessPropertyAdd onClose={() => setShowModel(false)} />}
      </motion.div>
    </div>
  );
};

export default PropertyRegistrationForm;