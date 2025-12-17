import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, IndianRupee } from 'lucide-react';
import { http } from '../../../axios/axios';
import { useNavigate } from 'react-router-dom';
import { notfound } from '../../../ExportImages';
import { useTheme } from '../../../context/ThemeContext';

const GetAllTransaction = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [transactionData, setTransactionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    propertyname: '',
    price: '',
    agentName: '',
    paymentMethod: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDark ? 'bg-gray-900' : 'bg-white';
  const placeholderColor = isDark ? 'placeholder-gray-400' : 'placeholder-gray-500';

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  useEffect(() => {
    if (transactionData.length > 0) {
      const filtered = transactionData.filter(transaction =>
        (filters.propertyname === '' || transaction.propertyId?.propertyname?.toLowerCase().includes(filters.propertyname.toLowerCase())) &&
        (filters.price === '' || String(transaction.price).includes(filters.price)) &&
        (filters.agentName === '' || transaction.agentId?.agentName?.toLowerCase().includes(filters.agentName.toLowerCase())) &&
        (filters.paymentMethod === '' || transaction.paymentMethod?.toLowerCase().includes(filters.paymentMethod.toLowerCase())) &&
        (filters.status === '' || transaction.status?.toLowerCase().includes(filters.status.toLowerCase()))
      );
      setFilteredData(filtered);
    }
  }, [filters, transactionData]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await http.delete(`/property/${id}`, { withCredentials: true });
        getAllTransaction();
      } catch (err) {
        console.error("Failed to delete property", err);
      }
    }
  };

  const getAllTransaction = async () => {
    setLoading(true);
    try {
      const response = await http.get("/getalltransaction", { withCredentials: true });
      if (response.data.success) {
        setTransactionData(response.data.data);
        setFilteredData(response.data.data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTransaction();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewDetails = (id) => {
    navigate(`/viewalltransiondata/${id}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const clearFilters = () => setFilters({
    propertyname: '',
    price: '',
    agentName: '',
    paymentMethod: '',
    status: ''
  });

  return (
    <div className={`p-4 md:p-6 w-full mx-auto ${bgColor} ${textColor}`}>
      <div className={`rounded-xl shadow-lg border ${borderColor} overflow-hidden`}>

        {/* Header */}
        <div className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'}`}>
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Transaction Management</h2>
            <p className="text-sm opacity-80 mt-1">{filteredData.length || '0'} transactions in total</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded-lg shadow-sm hover:bg-gray-100 text-gray-700"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="propertyname"
                placeholder="Search properties..."
                value={filters.propertyname}
                onChange={handleFilterChange}
                className={`pl-10 pr-3 py-2 text-sm rounded-lg border ${borderColor} ${inputBg} ${textColor} ${placeholderColor}`}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b ${borderColor} ${cardBg}`}>
            {["propertyname", "price", "agentName", "paymentMethod", "status"].map((name, index) => (
              <div key={index}>
                <label className={`block text-xs font-medium mb-1 capitalize ${textColor}`}>{name}</label>
                <input
                  type="text"
                  name={name}
                  placeholder={`Enter ${name}`}
                  value={filters[name]}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                />
              </div>
            ))}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Table / Data */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-cyan-500 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <img src={notfound} alt="Not found" className="w-60 h-60 object-contain mx-auto" />
            <p className="mt-2">Failed to load data</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-gray-500">
            <img src={notfound} alt="No transactions" className="w-60 h-60 object-contain" />
            <p className="mt-2 text-sm">No transactions found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${borderColor}`}>
                <thead className={isDark ? 'bg-gray-700 text-gray-300' : 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white'}>
                  <tr>
                    {['Property', 'Type', 'Price', 'City', 'Agent', 'Payment', 'Status', 'Actions'].map((header, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-semibold uppercase">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={isDark ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-100'}>
                  {currentItems.map(transaction => (
                    <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.propertyId?.propertyname}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.propertyId?.propertytype}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          <IndianRupee size={12} className="inline-block mr-1" />
                          {transaction.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.propertyId?.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.agentId?.agentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                          }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleViewDetails(transaction._id)}><Eye size={16} /></button>
                          <button className="text-green-500 hover:text-green-700"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(transaction.propertyId?._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-3 text-sm">
              <div>
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> of{" "}
                <span className="font-medium">{filteredData.length}</span> results
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-2 rounded-lg text-sm ${currentPage === number ? 'bg-cyan-600 text-white' : 'bg-white hover:bg-gray-100'
                      }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GetAllTransaction;
