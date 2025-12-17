import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useParams } from 'react-router-dom';
import { http } from '../../../axios/axios';

const BookingUpdateForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
     
 
     const { id } = useParams()

    // Sample client data (in a real app, this would come from an API)
    const clients = [
        { id: 1, name: 'John Doe', contact: 'john@example.com' },
        { id: 2, name: 'Jane Smith', contact: 'jane@example.com' },
        { id: 3, name: 'Robert Johnson', contact: 'robert@example.com' },
    ];

    // Sample property data
    const properties = [
        { id: 1, name: 'Beachfront Villa', location: 'Miami, FL' },
        { id: 2, name: 'Mountain Cabin', location: 'Aspen, CO' },
        { id: 3, name: 'City Apartment', location: 'New York, NY' },
    ];




    const validationSchema = Yup.object().shape({
        client: Yup.string().required('Client is required'),
        contact: Yup.string()
            .email('Invalid email address')
            .required('Contact email is required'),
        property: Yup.string().required('Property is required'),
        location: Yup.string().required('Location is required'),
        price: Yup.number()
            .positive('Price must be positive')
            .required('Price is required'),
        date: Yup.date().required('Date is required'),
        paymentTransactionId: Yup.string().required('Transaction ID is required'),
        status: Yup.string().required('Status is required')
    });

    const formik = useFormik({
        initialValues: {
            client: '',
            contact: '',
            property: '',
            location: '',
            price: '',
            date: '',
            paymentTransactionId: '',
            status: 'Pending'
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setSuccessMessage('Booking updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error('Error updating booking:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    });
   
   






    const statusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Confirmed', label: 'Confirmed' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Refunded', label: 'Refunded' }
    ];

    const handleClientChange = (e) => {
        const selectedClientId = e.target.value;
        const selectedClient = clients.find(client => client.id.toString() === selectedClientId);
        formik.setFieldValue('client', selectedClient?.name || '');
        formik.setFieldValue('contact', selectedClient?.contact || '');
    };


   
    
const getbookingByid = async (id) => {
    console.log("Passed ID:", id);
    try {
      const response = await http.get(`/bookingbyid/${id}`);
      console.log("booking response", response.data);
    } catch (error) {
      console.log("API error:", error);
    }
  };



  useEffect(() => {
    if (id) {
      getbookingByid(id); // <-- pass id here
    }
  }, [id]);
    const handlePropertyChange = (e) => {
        const selectedPropertyId = e.target.value;
        const selectedProperty = properties.find(property => property.id.toString() === selectedPropertyId);
        formik.setFieldValue('property', selectedProperty?.name || '');
        formik.setFieldValue('location', selectedProperty?.location || '');
    };

    const handleDelete = () => {
        setShowDeleteConfirmation(true);
    };



    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            // Simulate delete API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccessMessage('Booking deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            // Reset form after deletion
            formik.resetForm();
        } catch (error) {
            console.error('Error deleting booking:', error);
        } finally {
            setIsSubmitting(false);
            setShowDeleteConfirmation(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Update Booking</h1>
                    <p className="text-gray-600 mt-1">Edit the booking details below</p>
                </div>

                {successMessage && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4 rounded">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{successMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {/* Client Field */}
                        <div className="sm:col-span-2">
                            <label htmlFor="client-select" className="block text-sm font-medium text-gray-700">
                                Client *
                            </label>
                            <select
                                id="client-select"
                                name="client-select"
                                onChange={handleClientChange}
                                onBlur={formik.handleBlur}
                                value={clients.find(c => c.name === formik.values.client)?.id || ''}
                                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.client && formik.errors.client ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select a client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.client && formik.errors.client && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.client}</p>
                            )}
                        </div>

                        {/* Contact Field */}
                        <div className="sm:col-span-2">
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                                Contact Email *
                            </label>
                            <input
                                id="contact"
                                name="contact"
                                type="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.contact}
                                className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formik.touched.contact && formik.errors.contact ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {formik.touched.contact && formik.errors.contact && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.contact}</p>
                            )}
                        </div>

                        {/* Property Field */}
                        <div className="sm:col-span-2">
                            <label htmlFor="property-select" className="block text-sm font-medium text-gray-700">
                                Property *
                            </label>
                            <select
                                id="property-select"
                                name="property-select"
                                onChange={handlePropertyChange}
                                onBlur={formik.handleBlur}
                                value={properties.find(p => p.name === formik.values.property)?.id || ''}
                                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.property && formik.errors.property ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select a property</option>
                                {properties.map((property) => (
                                    <option key={property.id} value={property.id}>
                                        {property.name} - {property.location}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.property && formik.errors.property && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.property}</p>
                            )}
                        </div>

                        {/* Location Field */}
                        <div className="sm:col-span-2">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Location *
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.location}
                                className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formik.touched.location && formik.errors.location ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {formik.touched.location && formik.errors.location && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.location}</p>
                            )}
                        </div>

                        {/* Price Field */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price ($) *
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price}
                                    className={`block w-full pl-7 pr-12 sm:text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formik.touched.price && formik.errors.price ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="0.00"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <label htmlFor="currency" className="sr-only">Currency</label>
                                    <select
                                        id="currency"
                                        name="currency"
                                        className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option>USD</option>
                                        <option>EUR</option>
                                        <option>GBP</option>
                                    </select>
                                </div>
                            </div>
                            {formik.touched.price && formik.errors.price && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
                            )}
                        </div>

                        {/* Date Field */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                Date *
                            </label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.date}
                                className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formik.touched.date && formik.errors.date ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            />
                            {formik.touched.date && formik.errors.date && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.date}</p>
                            )}
                        </div>

                        {/* Payment & Transaction ID Field */}
                        <div className="sm:col-span-2">
                            <label htmlFor="paymentTransactionId" className="block text-sm font-medium text-gray-700">
                                Payment & Transaction ID *
                            </label>
                            <input
                                id="paymentTransactionId"
                                name="paymentTransactionId"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.paymentTransactionId}
                                className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formik.touched.paymentTransactionId && formik.errors.paymentTransactionId ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., Credit Card - TXN12345"
                            />
                            {formik.touched.paymentTransactionId && formik.errors.paymentTransactionId && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.paymentTransactionId}</p>
                            )}
                        </div>

                        {/* Status Field */}
                        <div className="sm:col-span-2">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status *
                            </label>
                            <select
                                id="status"
                                name="status"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.status}
                                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.status && formik.errors.status ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.status && formik.errors.status && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.status}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete Booking
                        </button>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => formik.resetForm()}
                                disabled={isSubmitting}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Booking'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete booking</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete this booking? This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirmation(false)}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={isSubmitting}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingUpdateForm;