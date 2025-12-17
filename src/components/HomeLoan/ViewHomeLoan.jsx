import React, { useState, useEffect } from 'react';
import {
    Eye,
    Pencil,
    Trash2,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';

import 'react-loading-skeleton/dist/skeleton.css';
import useDebounce from '../../hooks/useDebounce'; // Your custom hook
import EmptyStateModel from '../../model/EmptyStateModel';
import { useLoading } from '../../model/LoadingModel';
import { http } from '../../axios/axios';
import PermissionProtectedAction from '../../Authorization/PermissionProtectedActions';
import { useToast } from '../../model/SuccessToasNotification';


const ViewHomeLoan = () => {
    const { theme } = useTheme();

    // States
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        fullName: '',
        email: '',
        phone: '',
        propertyLocation: '',
        bankName: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const LoadingModel = useLoading({ type: "table", count: 1, rows: 5, columns: 4 });
    const { addToast } = useToast();

    const limit = 5;
    const debouncedFilters = useDebounce(filters, 500);

    // Fetch data
    const getLoanRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const cleanedFilters = Object.fromEntries(
                Object.entries(debouncedFilters).filter(([_, v]) => v !== '')
            );
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                ...cleanedFilters,
            });
            const response = await http.get(`/getloanrequest?${queryParams.toString()}`);
            console.log(response.data);
            if (response.data.success === true) {
                setData(response.data?.data);
                setPagination(response.data?.pagination);
            } else {
                setError('Failed to fetch data');
            }
        } catch (err) {
            console.error(err);
            setError('Error fetching data');
        }
        setLoading(false);
    };


    useEffect(() => {
        getLoanRequests();
    }, [debouncedFilters, currentPage]);

    const tableHeader = [
        'Full Name',
        'Email',
        'Contact',
        'Bank Name',
        'Company Name',
        'Down Payment',
        'Employment Duration',
        'Employment Status',
        'Loan Amount',
        'Existing Loan',
        'Monthly Income',
        'Ongoing EMI',
        'Pan No',
        'Past Loans',
        'Property Location',
        'property Type',
        'Property Value',
        'Additional Notes',
        'Loan Status',
        'Actions'
    ];
    const getStatusValue = (status) => ['pending', 'approved', 'rejected'].includes(status) ? status : 'pending';

    // Function to render table rows
    const renderTableBody = () => {
        return data.map((item) => (
            <tr
                key={item._id}
                className={`transition-colors duration-150 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
            >

                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {item.fullName || 'N/A'}
                </td>

                <td className='px-6 py-4 whitespace-nowrap flex items-center gap-2'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.email}
                    </div>

                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.phone}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.bankName}
                    </div>
                </td>

                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.companyName}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.downPayment}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.employmentDuration}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.employmentStatus}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.loanAmount}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.existingLoan ? "yes" : "No"}
                    </div>
                </td>

                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.monthlyIncome}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.ongoingEMI ? 'Yes' : 'No'}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.panNumber}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.pastLoans ? "yes" : "No"}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.employmentDuration}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.propertyLocation}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.propertyType}
                    </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.propertyValue}
                    </div>
                </td>

                {/* Loan Status with dropdown */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <PermissionProtectedAction action="update" module="Home Loan Management">
                        <div className="flex items-center space-x-2">
                            <div className="relative w-40 flex items-center space-x-2">
                                <div className="w-full">
                                    <select
                                        className={`w-full px-3 py-2 text-sm rounded  focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-pointer ${theme === 'dark'
                                            ? 'bg-gray-700  text-white'
                                            : 'bg-white  text-gray-900'
                                            }`}
                                        value={getStatusValue(item.loanStatus)}
                                        onChange={(e) => handleUpdateLoanStatus(item._id, e.target.value)}
                                    >
                                        <option value="pending">pending</option>
                                        <option value="approved">approved</option>
                                        <option value="rejected">rejected</option>
                                    </select>
                                </div>

                            </div>
                        </div>
                    </PermissionProtectedAction>
                </td>

                {/* Other fields can be added here following the pattern */}
                {/* Actions */}
                <td className='px-6 py-4 whitespace-nowrap text-right'>
                    <div className='flex justify-end gap-2'>

                        <PermissionProtectedAction action="delete" module="Home Loan Management">
                            <button
                                onClick={() => handleDelete(item._id)}
                                className={`p-2 rounded-full transition-colors duration-300 ${theme === 'dark'
                                    ? 'text-red-400 hover:bg-gray-700'
                                    : 'text-red-600 hover:bg-red-50'
                                    }`}
                                title='Delete'
                            >
                                <Trash2 size={18} />
                            </button>
                        </PermissionProtectedAction>
                    </div>
                </td>
            </tr>
        ));
    };

    // Handle status update
    const handleUpdateLoanStatus = async (id, newStatus) => {

        try {
            const response = await http.put(`updateloanrequeststatus/${id}`, { loanStatus: newStatus });
            if (response.status === 200) {
                addToast("Loan status updated successfully", "success")

                getLoanRequests()
            } else {
                addToast("Failed to update loan status", "error")

            }
        } catch (error) {
            addToast(error || "internal Server Error", "error")

        }

    };

    //  delete loan request
    const handleDelete = async (id) => {
        try {
            const response = await http.delete(`/deleteloanrequest/${id}`);
            if (response.status === 200) {
                addToast("Loan request deleted successfully", "success")
                fetchData();
            } else {
                addToast("Failed to delete loan request", "error")
            }

        } catch (error) {
            addToast(error || "internal Server Error", "error")

        }



    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
        setCurrentPage(1);
    };


    return (
        <div className={`p-4 md:p-6 w-full mx-auto transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`rounded-xl shadow-sm overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                {/* Header & Filters */}
                <div
                    className={` mb-2 border-b transition-colors duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-100"
                        }`}
                >
                    {/* Title & Filter Button */}
                    <div
                        className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-lg transition-colors duration-300 ${theme === "dark"
                                ? "bg-gradient-to-r from-blue-800 to-cyan-800"
                                : "bg-gradient-to-r from-blue-600 to-cyan-600"
                            } text-white`}
                    >
                        {/* Left: Title */}
                        <div className="w-full md:w-auto">
                            <h2 className="text-xl md:text-2xl font-semibold">Data Management</h2>
                            <p className="text-sm mt-1 opacity-90">
                                {pagination?.totalItems || 0} data members in total
                            </p>
                        </div>

                        {/* Right: Filters & Search */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Filters Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-300 ${theme === "dark"
                                        ? "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
                                        : "bg-white text-black hover:bg-gray-50 border-gray-200"
                                    } border`}
                            >
                                <Filter size={16} />
                                <span>Filters</span>
                            </button>

                            {/* Search Input */}
                            <div className="relative flex-1 min-w-[200px]">
                                <Search
                                    size={16}
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                        }`}
                                />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Search data..."
                                    value={filters.fullName}
                                    onChange={handleFilterChange}
                                    className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-colors duration-300 ${theme === "dark"
                                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                                        } border`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div
                            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 transition-colors duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-100"
                                }`}
                        >
                            {["email", "loanAmount", "phone", "propertyLocation", "bankName"].map(
                                (field) => (
                                    <div key={field} className="flex flex-col">
                                        <label
                                            className={`block text-xs px-2 lg:px-4 md:px-3 font-medium mb-1 capitalize transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-500"
                                                }`}
                                        >
                                            {field}
                                        </label>
                                        <inputuuy
                                            type="text" 
                                            name={field}
                                            placeholder={
                                                field.charAt(0).toUpperCase() + field.slice(1)
                                            }
                                            value={filters[field]}
                                            onChange={handleFilterChange}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-colors duration-300 ${theme === "dark"
                                                    ? "bg-gray-700 border-gray-600 text-white"
                                                    : "bg-white border-gray-200 text-gray-900"
                                                }`}
                                        />
                                    </div>
                                )
                            )}
                            <div className="flex items-end">
                                <button
                                    onClick={() =>
                                        setFilters({
                                            fullName: "",
                                            email: "",
                                            phone: "",
                                            propertyLocation: "",
                                            bankName: "",
                                        })
                                    }
                                    className={`w-full py-2 text-sm rounded-lg transition-colors duration-300 ${theme === "dark"
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>


                {/* Data Table */}
                {loading ? (
                    <LoadingModel loading={true} />
                ) : error ? (
                    <EmptyStateModel
                        type='Loan Data'
                        title='No Data Match Your Search'
                        message='Try adjusting your data or price range to see more results.'
                    />
                ) : data.length === 0 ? (
                    <EmptyStateModel
                        type='Loan Data'
                        title='No Data Match Your Search'
                        message='Try adjusting your data or price range to see more results.'
                    />
                ) : (
                    <div className='overflow-x-auto   rounded-lg'>
                        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                            <thead className='bg-gradient-to-r  from-cyan-600 to-teal-500 text-white'>
                                <tr>
                                    {tableHeader.map((header, i) => (
                                        <th
                                            key={i}
                                            scope='col'
                                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${i === 0 ? '' : 'text-left'}`}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                {renderTableBody()}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div className={`px-4 md:px-6 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                        <div className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            Showing <span className='font-medium'>{(currentPage - 1) * limit + 1}</span> to <span className='font-medium'>{Math.min(currentPage * limit, pagination.totalItems)}</span> of <span className='font-medium'>{pagination.totalItems}</span> results
                        </div>
                        {/* Page Navigation Buttons */}
                        <div className='flex gap-2'>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 flex items-center gap-1 text-sm rounded-md transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-white hover:bg-gray-50 border-gray-300'} border disabled:opacity-50`}
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum;
                                if (pagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= pagination.totalPages - 2) {
                                    pageNum = pagination.totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 flex items-center justify-center text-sm rounded-md transition-colors duration-300 ${currentPage === pageNum ? 'bg-cyan-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                                disabled={currentPage === pagination.totalPages}
                                className={`px-3 py-1.5 flex items-center gap-1 text-sm rounded-md transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-white hover:bg-gray-50 border-gray-300'} border disabled:opacity-50`}
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewHomeLoan;