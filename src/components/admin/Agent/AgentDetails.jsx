import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2, User, MapPin, Phone, Mail, Calendar, Building2, Award, DollarSign, Briefcase, Clock, Star, IndianRupee } from 'lucide-react';

import useGetAllAgent from './../../../hooks/useGetAllAgent';
import { toast } from 'react-toastify';
import { useTheme } from '../../../context/ThemeContext';
import { useParams } from 'react-router-dom';
import EmptyStateModel from '../../../model/EmptyStateModel';

const AgentDetails = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  console.log(id);

  const { agent, loading, error, getOneAgent } = useGetAllAgent();



  

  useEffect(() => {
    getOneAgent(id);
  }, [id]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen`}>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
        <EmptyStateModel
          type="bookings"
          showActionButton={true}
          actionButtonText="Create Booking"
          message="No Agent Found"
          customIcon={User}
        />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Inactive':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Pending':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Section */}
        <div className={`relative overflow-hidden rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-600 to-purple-700'}`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={agent.profilePhoto}
                  alt={agent.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                />
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${getStatusColor(agent.status)} flex items-center justify-center`}>
                  <div className="w-3 h-3 rounded-full bg-current"></div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold mb-2">{agent.name}</h1>
                <p className="text-xl text-white/80 mb-4">{agent.role || agent.designation}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {agent.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {agent.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {agent.city}, {agent.state}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(agent.status)} backdrop-blur-sm`}>
                {agent.status}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Personal Information */}
          <div className={`lg:col-span-1 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Personal Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {agent.dateOfBirth || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Full Address</p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {agent.address}
                  </p>
                </div>
              </div>



              {/* Skills */}
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(
                      Array.isArray(agent.skills)
                        ? agent.skills
                        : typeof agent.skills === 'string'
                          ? agent.skills.split(',').filter(skill => skill.trim())
                          : []
                    ).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                      >
                        {skill.trim()}
                      </span>
                    ))}


                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Overview */}
          <div className={`lg:col-span-2 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Company Overview
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Current Designation</p>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {agent.designation || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Previous Company</p>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {agent.previousCompany || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Joining Date</p>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {agent.joiningDate || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {agent.experienceYears ? `${agent.experienceYears} years` : 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Current Salary</p>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {agent.currentSalary ? `₹${agent.currentSalary}` : 'Not disclosed'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Account Balance</p>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {agent.balance ? `₹${agent.balance}` : '₹0'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default AgentDetails;