import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Check, X, IndianRupee } from 'lucide-react';
import usegetAppoinment from './../../hooks/usegetAppoinment';
import formatToLocalDateTime from '../../utils/DateConverter';
import { http } from "../../axios/axios";
import { useTheme } from '../../context/ThemeContext';
import PermissionProtectedAction from '../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../model/EmptyStateModel';

const GetAppoinment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMeetingLinkId, setEditingMeetingLinkId] = useState(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState('');
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [statusInput, setStatusInput] = useState('');
  const { theme } = useTheme();

  const limit = 10;
  const { Appointment, loading, error, pagination, refetch, handleDeleteAppointment } = usegetAppoinment(currentPage, limit, searchTerm);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditMeetingLink = (id, currentLink) => {
    setEditingMeetingLinkId(id);
    setMeetingLinkInput(currentLink || '');
  };

  const saveMeetingLink = async (id) => {
    try {
      await http.put(`/appoinmentupdate/${id}`, { meetingLink: meetingLinkInput });
      setEditingMeetingLinkId(null);
      refetch();
    } catch (err) {
      alert('Failed to update meeting link');
      console.error(err);
    }
  };

  const saveStatus = async (id) => {
    try {
      await http.put(`/statusupdate/${id}`, { status: statusInput });
      setEditingStatusId(null);
      refetch();
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <EmptyStateModel
        title="Failed to fetch appointments"
        size="large"
        message="Failed to fetch appointments. Please try again later."
      />
    );

  return (
    <div className={`rounded-lg shadow-md transition-colors duration-300 ${theme === 'dark' ? 'dark:bg-gray-800' : 'bg-white'}`}>
      {/* Header & Search */}
      <div
        className={`flex flex-col bg-gradient-to-r from-blue-600 to-cyan-600 md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-4 rounded-lg ${theme === 'dark' ? 'dark:from-blue-800 dark:to-cyan-800' : ''}`}
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Appointments</h2>
          <p className={`text-white/90 ${theme === 'dark' ? 'dark:text-white/80' : ''}`}>
            Manage and track property viewing appointments
          </p>
        </div>
        {/* Search input */}
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by AppointmentID, name, email, status..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-sm ${theme === 'dark' ? 'dark:bg-gray-700/90 dark:border-gray-600 dark:text-white' : 'bg-white/90'}`}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Table or Empty State */}
      <div className="w-full overflow-x-auto">
        {Appointment.length === 0 ? (
          <div className="w-full mb-2">
            <EmptyStateModel
              type="Appointments"
              title="No Appointments Match Your Search"
              message="Try adjusting your filters to see more results."
              showResetButton={true}
              size="large"
              actionButtonText="Create Booking"
            />
          </div>
        ) : (
          <table className={`min-w-full divide-y ${theme === 'dark' ? 'dark:divide-gray-700' : 'divide-gray-200'}`}>
            {/* Table Header */}
            <thead className={`bg-gradient-to-r from-blue-500 to-cyan-500 ${theme === 'dark' ? 'dark:from-blue-700 dark:to-cyan-700' : ''}`}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">AppointmentID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Meeting Link</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className={`divide-y ${theme === 'dark' ? 'dark:bg-gray-800 dark:divide-gray-700' : 'bg-white divide-gray-200'}`}>
              {Appointment.map((appointment) => (
                <tr key={appointment._id} className={`${theme === 'dark' ? 'dark:hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                  {/* Appointment ID */}
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'dark:text-gray-400' : 'text-gray-500'}`}>
                    {appointment.appointmentId}
                  </td>
                  {/* Property */}
                  <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2">
                    {appointment.property?.images?.[0] && (
                      <img
                        src={appointment.property.images[0]}
                        alt={appointment.property.propertytype}
                        className="w-10 h-10 rounded-full object-cover border-2"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'dark:text-white' : 'text-gray-900'}`}>
                        {appointment.property.propertytype}
                      </div>
                      <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        <IndianRupee size={12} className="inline-block mr-1" />
                        {appointment.property?.price}
                      </div>
                    </div>
                  </td>
                  {/* Client */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'dark:text-white' : 'text-gray-900'}`}>
                      {appointment.user.firstname}
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'dark:text-gray-400' : 'text-gray-500'}`}>
                      {appointment.user.email}
                    </div>
                  </td>
                  {/* Location */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className={`text-sm ${theme === 'dark' ? 'dark:text-white' : 'text-gray-900'}`}>
                      {appointment.property.city}
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'dark:text-gray-400' : 'text-gray-500'}`}>
                      {appointment.property.state}
                    </div>
                  </td>
                  {/* Platform */}
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'dark:text-gray-400' : 'text-gray-500'}`}>
                    {appointment.meetingPlatform}
                  </td>
                  {/* Date & Time */}
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'dark:text-gray-400' : 'text-gray-500'}`}>
                    {formatToLocalDateTime(appointment.date)}
                  </td>
                  {/* Meeting Link */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingMeetingLinkId === appointment._id ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="text"
                          value={meetingLinkInput}
                          onChange={(e) => setMeetingLinkInput(e.target.value)}
                          className={`px-2 py-1 border rounded text-sm w-full max-w-xs ${theme === 'dark' ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''}`}
                        />
                        <button
                          onClick={() => saveMeetingLink(appointment._id)}
                          className={`${theme === 'dark' ? 'dark:text-green-400 dark:hover:text-green-300' : 'text-green-600 hover:text-green-800'}`}
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingMeetingLinkId(null)}
                          className={`${theme === 'dark' ? 'dark:text-red-400 dark:hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        {appointment.meetingLink ? (
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm truncate max-w-[120px] ${theme === 'dark' ? 'dark:text-blue-400' : 'text-blue-600 hover:underline'}`}
                          >
                            Meeting Link
                          </a>
                        ) : (
                          <span className={`text-sm ${theme === 'dark' ? 'dark:text-gray-500' : 'text-gray-400'}`}>No link</span>
                        )}
                        <PermissionProtectedAction action="view" module="Appoinment Management">
                          <button
                            onClick={() => handleEditMeetingLink(appointment._id, appointment.meetingLink)}
                            className={`${theme === 'dark' ? 'dark:text-blue-400 dark:hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                        </PermissionProtectedAction>
                      </div>
                    )}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {editingStatusId === appointment._id ? (
                        <>
                          <select
                            value={statusInput}
                            onChange={(e) => setStatusInput(e.target.value)}
                            className={`border rounded px-2 py-1 text-sm ${theme === 'dark' ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''}`}
                          >
                            {['pending', 'Confirmed', 'cancelled', 'complete'].map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => saveStatus(appointment._id)}
                            className={`${theme === 'dark' ? 'dark:text-green-400 dark:hover:text-green-300' : 'text-green-600 hover:text-green-800'}`}
                            title="Save"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingStatusId(null)}
                            className={`${theme === 'dark' ? 'dark:text-red-400 dark:hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${appointment.status === 'Confirmed'
                                ? theme === 'dark'
                                  ? 'dark:bg-green-900 dark:text-green-100'
                                  : 'bg-green-100 text-green-800'
                                : appointment.status === 'pending'
                                  ? theme === 'dark'
                                    ? 'dark:bg-yellow-900 dark:text-yellow-100'
                                    : 'bg-yellow-100 text-yellow-800'
                                  : appointment.status === 'cancelled'
                                    ? theme === 'dark'
                                      ? 'dark:bg-red-900 dark:text-red-100'
                                      : 'bg-red-100 text-red-800'
                                    : theme === 'dark'
                                      ? 'dark:bg-gray-900 dark:text-gray-100'
                                      : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {appointment.status}
                          </span>
                          <PermissionProtectedAction action="update" module="Appoinment Management">
                            <button
                              onClick={() => {
                                setEditingStatusId(appointment._id);
                                setStatusInput(appointment.status);
                              }}
                              className={`${theme === 'dark' ? 'dark:text-blue-400 dark:hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                          </PermissionProtectedAction>
                        </>
                      )}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <PermissionProtectedAction action="delete" module="Appoinment Management">
                        <button
                          onClick={() => handleDeleteAppointment(appointment._id)}
                          className={`${theme === 'dark' ? 'dark:text-red-400 dark:hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
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
        )}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 px-4 md:px-6">
          <div className={`text-sm ${theme === 'dark' ? 'dark:text-gray-300' : 'text-gray-700'}`}>
            Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * limit, pagination.totalCount)}</span> of{' '}
            <span className="font-medium">{pagination.totalCount}</span> results
          </div>
          {/* Pagination buttons */}
          <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-md ${currentPage === 1
                ? theme === 'dark'
                  ? 'dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 cursor-not-allowed text-gray-400'
                : theme === 'dark'
                  ? 'dark:hover:bg-gray-700 dark:text-gray-300'
                  : 'hover:bg-gray-50 text-gray-700'
                }`}
            >
              Previous
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
                  className={`px-4 py-2 border rounded-md ${currentPage === pageNum
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {pagination.totalPages > 5 && (
              <span className={`px-4 py-2 ${theme === 'dark' ? 'dark:text-gray-300' : 'text-gray-700'}`}>...</span>
            )}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className={`px-4 py-2 border rounded-md ${currentPage === pagination.totalPages
                ? theme === 'dark'
                  ? 'dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 cursor-not-allowed text-gray-400'
                : theme === 'dark'
                  ? 'dark:hover:bg-gray-700 dark:text-gray-300'
                  : 'hover:bg-gray-50 text-gray-700'
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAppoinment;