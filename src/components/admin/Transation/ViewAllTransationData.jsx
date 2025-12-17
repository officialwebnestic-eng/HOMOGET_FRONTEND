import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { http } from '../../../axios/axios'
import { DollarSign, Eye, Home, ReceiptIndianRupee, Users, ArrowLeft } from 'lucide-react'
import { AuthContext } from '../../../context/AuthContext'
import { motion } from 'framer-motion'

const ViewAllTransationData = () => {
    const [transaction, setTransaction] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useContext(AuthContext)
    const { id } = useParams()

    const getData = async () => {
        try {
            setLoading(true)
            const response = await http.get(`/gettransation/${id}`, {
                withCredentials:true
            })
            if (response.data?.success === true) {
                setTransaction(response.data?.data)
            }
        } catch (error) {
            setError(error.message || "Failed to fetch transaction data")
            console.error("Error fetching transaction:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id ) {
            getData()
        }
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-16 w-16 rounded-full border-4 border-indigo-400 border-t-transparent"
                ></motion.div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 max-w-md w-full"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={getData}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }



    if (!transaction) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Transaction Found</h3>
                    <p className="text-gray-600">The requested transaction data could not be found.</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">

            <motion.button
                whileHover={{ x: -4 }}
                className="flex items-center text-indigo-600 mb-6"
                onClick={() => window.history.back()}
            >
                <ArrowLeft className="mr-2" size={20} />
                Back to Transactions
            </motion.button>


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            >

                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <h1 className="text-2xl md:text-3xl font-bold">Transaction Details</h1>
                    <p className="text-indigo-100">ID: {transaction._id}</p>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-white/90 to-indigo-50 rounded-xl shadow-md border border-white/30 overflow-hidden"
                    >
                        <div className="bg-indigo-500/10 p-4 border-b border-indigo-100 flex items-center">
                            <Home className="text-indigo-600 mr-3" size={20} />
                            <h3 className="text-lg font-semibold text-indigo-800">Property Information</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Name</span>
                                <span className="font-medium text-gray-800">{transaction.propertyId?.propertyname || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Type</span>
                                <span className="font-medium text-gray-800 capitalize">{transaction.propertyId?.propertytype?.toLowerCase() || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Location</span>
                                <span className="font-medium text-gray-800">{transaction.propertyId?.city}, {transaction.propertyId?.state}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Price</span>
                                <span className="font-bold text-green-600">₹{transaction.propertyId?.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-white/90 to-blue-50 rounded-xl shadow-md border border-white/30 overflow-hidden"
                    >
                        <div className="bg-blue-500/10 p-4 border-b border-blue-100 flex items-center">
                            <ReceiptIndianRupee className="text-blue-600 mr-3" size={20} />
                            <h3 className="text-lg font-semibold text-blue-800">Transaction Details</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date</span>
                                <span className="font-medium text-gray-800">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Method</span>
                                <span className="font-medium text-gray-800 capitalize">{transaction.paymentMethod?.toLowerCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Price</span>
                                <span className="font-bold text-green-600 ">₹{transaction.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === "completed" ? "bg-green-100 text-green-800" : transaction.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                                    {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
                                </span>
                            </div>
                        </div>
                    </motion.div>


                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-white/90 to-purple-50 rounded-xl shadow-md border border-white/30 overflow-hidden"
                    >
                        <div className="bg-purple-500/10 p-4 border-b border-purple-100 flex items-center">
                            <Users className="text-purple-600 mr-3" size={20} />
                            <h3 className="text-lg font-semibold text-purple-800">Agent Information</h3>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="relative">
                                    <img
                                        src={transaction.sale.agent?.image || '/default-avatar.png'}
                                        alt={transaction.agentId?.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${transaction.agentId?.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">{transaction.agentId?.name || 'N/A'}</h4>
                                    <p className="text-sm text-gray-600">{transaction.agentId?.email}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Location</span>
                                    <span className="font-medium text-gray-800">{transaction.agentId?.city}, {transaction.agentId?.state}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`font-medium ${transaction.agentId?.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                                        {transaction.agentId?.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-t border-emerald-100 p-6"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <DollarSign className="text-emerald-600 mr-3" size={20} />
                        Commission Breakdown
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 border border-white/50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Admin</span>
                                <span className="text-sm font-semibold bg-indigo-500/10 text-indigo-800 px-3 py-1 rounded-full">
                                    {transaction.commissions?.admin?.percentage}%
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-indigo-700">
                                ₹{transaction.commissions?.admin?.amount?.toLocaleString()}
                            </div>
                        </div>


                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 border border-white/50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Agent</span>
                                <span className="text-sm font-semibold bg-blue-500/10 text-blue-800 px-3 py-1 rounded-full">
                                    {transaction.commissions?.agent?.percentage}%
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-blue-700">
                                ₹{transaction.commissions?.agent?.amount?.toLocaleString()}
                            </div>
                        </div>


                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 border border-white/50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Sales Employee</span>
                                <span className="text-sm font-semibold bg-green-500/10 text-green-800 px-3 py-1 rounded-full">
                                    {transaction.commissions?.salesEmployee?.percentage}%
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-green-700">
                                ₹{transaction.commissions?.salesEmployee?.amount?.toLocaleString()}
                            </div>
                        </div>
                    </div>

        
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 border border-white/50">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-700">Total Commission</span>
                            <span className="text-2xl font-bold text-emerald-700">
                                ₹{transaction.totalCommission?.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </motion.div>


                {transaction.propertyId?.image?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100 p-6"
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <Eye className="text-amber-600 mr-3" size={20} />
                            Property Images
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {transaction.sale.property.images.map((img, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.03 }}
                                    className="overflow-hidden rounded-xl shadow-md border border-white/50 bg-white/90 backdrop-blur-sm"
                                >
                                    <img
                                        src={img}
                                        alt={`Property ${index + 1}`}
                                        className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default ViewAllTransationData