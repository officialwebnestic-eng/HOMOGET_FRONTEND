import React, { useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import useGetAllAgent from './../../../hooks/useGetAllAgent'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useToast } from '../../../model/SuccessToasNotification'
import { useTheme } from '../../../context/ThemeContext'
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions'
import EmptyStateModel from '../../../model/EmptyStateModel'
import { useLoading } from '../../../model/LoadingModel'

const ViewAllAgentList = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState({
        agentName: '',
        email: '',
        status: '',
    })

    const { theme } = useTheme()
    const { addToast } = useToast()
    const limit = 5
    const { agentList, loading, error, pagination, deleteAgent, UpdateStatus } = useGetAllAgent(currentPage, limit, filters)
    const navigate = useNavigate()
    const LoadingModel = useLoading({ type: "table", count: 1, rows: 5, columns: 4 });


    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        })
        setCurrentPage(1)
    }

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this agent?")
        if (!confirm) return
        try {
            const result = await deleteAgent(id)
            if (result.success === true) {
                addToast(result.data.message || "Agent Deleted Successfully", "error")
                navigate("/viewallagentlist")
            }
        } catch (error) {
            addToast(error || "error for agent deleted", "success")
        }
    }

    const handleAgentStatusChange = async (newStatus, agentId) => {

        try {
            const result = await UpdateStatus(newStatus, agentId)
            if (result.success) {
                addToast(result.data.message, "success")
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Theme-based styles
    const themeStyles = {
        light: {
            background: 'bg-gray-50',
            card: 'bg-white',
            text: 'text-gray-800',
            input: 'bg-white border-gray-200',
            tableHeader: 'from-blue-500 to-cyan-500',
            tableRowHover: 'hover:bg-gray-50',
            pagination: 'text-gray-700 bg-white hover:bg-gray-50',
            button: 'bg-indigo-600 text-white hover:bg-indigo-700',
            searchIcon: 'text-gray-400'
        },
        dark: {
            background: 'bg-gray-900',
            card: 'bg-gray-800',
            text: 'text-gray-100',
            input: 'bg-gray-700 border-gray-600',
            tableHeader: 'from-gray-700 to-gray-600',
            tableRowHover: 'hover:bg-gray-700',
            pagination: 'text-gray-200 bg-gray-700 hover:bg-gray-600',
            button: 'bg-indigo-700 text-white hover:bg-indigo-600',
            searchIcon: 'text-gray-300'
        }
    }

    const currentTheme = themeStyles[theme]

    return (
        <div className={`p-5 min-h-screen ${currentTheme.background}`}>
            <div className={`p-6 rounded-xl shadow-sm border ${currentTheme.card} ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 mb-6 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600`}>
                    <h2 className="text-2xl font-bold text-white">Agent Management</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                name="agentName"
                                placeholder="Search by name..."
                                value={filters.agentName}
                                onChange={handleFilterChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${currentTheme.input}`}
                            />
                            <svg
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.searchIcon}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="email"
                                placeholder="Search by email..."
                                value={filters.email}
                                onChange={handleFilterChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${currentTheme.input}`}
                            />
                            <svg
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.searchIcon}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${currentTheme.input}`}
                        >
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>

                    <div className="flex-shrink-0">
                        <Link
                            to="/addagent"
                            className={`inline-block px-4 py-2 rounded-lg transition-colors ${currentTheme.button}`}
                        >
                            Add New Agent
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <LoadingModel loading={true} /> 
                ) : error ? (


                    <EmptyStateModel
                        type="custom"
                        title="NO Agents Found"
                        message="."


                        showActionButton={true}
                        actionButtonText="Add Agent"
                        onActionClick={() => navigate('/addagent')}
                    />


                ) : (
                    <>
                        <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className={`bg-gradient-to-r ${currentTheme.tableHeader}`}>
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Agent
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'} ${currentTheme.card}`}>
                                    {agentList.map((user, index) => (
                                        <tr key={index} className={currentTheme.tableRowHover}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={user.profilePhoto || 'https://randomuser.me/api/portraits/men/1.jpg'}
                                                            alt={user.name}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className={`text-sm font-medium ${currentTheme.text}`}>{user.name}</div>
                                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${currentTheme.text}`}>{user.email}</div>
                                                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.phone || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${currentTheme.text}`}>{user.city}, {user.state}</div>
                                                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>{user.address || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                                                    {user.role || 'Agent'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={user.status}
                                                    onChange={(e) => handleAgentStatusChange(e.target.value, user._id)}
                                                    className={`text-xs px-2 py-1 rounded-full font-semibold ${user.status === 'Active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : user.status === 'Pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {/* View */}
                                                    <PermissionProtectedAction action="view" model="Team Management">
                                                        <Link
                                                            to={`/agentdetails/${user._id}`}
                                                            className={`p-2 rounded-full transition-colors ${theme === "dark"
                                                                ? "text-indigo-400 hover:bg-gray-700"
                                                                : "text-indigo-600 hover:bg-indigo-50"
                                                                }`}
                                                            title="View details"
                                                        >
                                                            <Eye size={18} />
                                                        </Link>
                                                    </PermissionProtectedAction>

                                                    {/* Edit */}
                                                    <PermissionProtectedAction action="update" model="Team Management">
                                                        <Link
                                                            className={`p-2 rounded-full transition-colors ${theme === "dark"
                                                                ? "text-green-400 hover:bg-gray-700"
                                                                : "text-green-600 hover:bg-green-50"
                                                                }`}
                                                            title="Edit"
                                                            to={`/updateagent/${user._id}`}
                                                        >
                                                            <Pencil size={18} />
                                                        </Link>
                                                    </PermissionProtectedAction>

                                                    {/* Delete */}
                                                    <PermissionProtectedAction action="delete" model="Team Management">

                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className={`p-2 rounded-full transition-colors ${theme === "dark"
                                                                ? "text-red-400 hover:bg-gray-700"
                                                                : "text-red-600 hover:bg-red-50"
                                                                }`}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </PermissionProtectedAction>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-3">
                            {/* Showing Info */}
                            <div
                                className={`text-sm text-center sm:text-left ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Showing{" "}
                                <span className="font-medium">
                                    {(currentPage - 1) * limit + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium">
                                    {Math.min(currentPage * limit, pagination?.totalItems || 0)}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">{pagination?.totalItems || 0}</span>{" "}
                                agents
                            </div>

                            {/* Pagination Buttons */}
                            <div className="flex justify-center sm:justify-end space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium ${theme === "dark" ? "border-gray-600" : "border-gray-300"
                                        } ${currentTheme.pagination} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, pagination?.totalPages || 1)
                                        )
                                    }
                                    disabled={currentPage === pagination?.totalPages}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium ${theme === "dark" ? "border-gray-600" : "border-gray-300"
                                        } ${currentTheme.pagination} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                    </>
                )}
            </div>
        </div>
    )
}

export default ViewAllAgentList