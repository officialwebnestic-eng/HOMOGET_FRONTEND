import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiEdit,
    FiMail,
    FiCalendar,
    FiMapPin,
    FiUser,
} from 'react-icons/fi';
import { Phone } from 'lucide-react';
import { http } from '../axios/axios';
import { useToast } from '../model/SuccessToasNotification';
import PermissionProtectedAction from '../Authorization/PermissionProtectedActions';
import { useTheme } from '../context/ThemeContext';
const UserProfile = () => {
    const [isEditing, setIsEditing] = useState({ status: false, id: null });
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: '',
        status: '',
        joinDate: '',
        location: '',
        address: '',
        bio: '',
        skills: [],
        balance: 0,
        image: '',
        phone: '',
    });
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { addToast } = useToast();

    // Fetch user data
    const getUserData = async () => {
        try {
            setIsLoading(true);
            const response = await http.get('/getuser', { withCredentials: true });
            const data = response.data?.user;

            if (data) {
                const isAgent =
                    data.role?.toLowerCase() !== "user" &&
                    data.role?.toLowerCase() !== "admin";

                const fullName = isAgent
                    ? data.name || ''
                    : `${data.firstname || ''} ${data.lastname || ''}`.trim();

                setUserData({
                    name: fullName,
                    phone: data.phone,
                    email: data.email || '',
                    role: data.role || '',
                    status: data.status || '',
                    joinDate: data.createdAt
                        ? `Joined ${new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                        : '',
                    location: `${data.city || 'Unknown'}, ${data.state || 'Unknown'}`,
                    address: data.address || 'Not specified',
                    bio: data.bio || 'No bio yet',
                    skills: data.skills || [],
                    image: data.image || '',
                    balance: data.balance || 0,
                });
                setSelectedUserId(data._id);
            }
        } catch (error) {
            addToast(
                error.response?.data?.message || 'Failed to fetch user data',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const handleEditClick = () => {
        setIsEditing({ status: true, id: selectedUserId });
    };

    const updateUser = async () => {
        try {
            setIsLoading(true);
            const response = await http.put(
                `/update-user/${selectedUserId}`,
                {
                    agentName: userData.name,
                    bio: userData.bio,
                    address: userData.address,
                    skills: userData.skills,
                },
                { withCredentials: true }
            );
            if (response.data.success) {
                addToast('Profile updated successfully', 'success');
                setIsEditing({ status: false, id: null });
                getUserData();
            } else {
                addToast('Update failed', 'error');
            }
        } catch (error) {
            addToast(error.response?.data?.message || 'Something went wrong', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Deduplicate skills
    const uniqueSkills = [...new Set(userData.skills)];

    // Define theme-based classes
    const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const inputBgClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
    const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';

    return (
        <div className={`min-h-screen ${bgClass} ${textClass} p-4 md:p-8`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8 mt-14">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Profile
                    </h1>
                    <div className="flex space-x-4">
                        <PermissionProtectedAction action="update" module="Profile Management">
                            <button
                                onClick={handleEditClick}
                                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
                            >
                                <FiEdit className="text-lg" />
                            </button>
                        </PermissionProtectedAction>
                    </div>
                </div>

                {/* Profile Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="rounded-2xl overflow-hidden shadow-2xl mb-8"
                    style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                        boxShadow: '0 25px 50px -12px rgba(0, 255, 255, 0.3)',
                        backgroundColor: theme === 'dark' ? '#2d3748' : '#f9fafb',
                        color: theme === 'dark' ? 'white' : 'black',
                    }}
                >
                    <div className="md:flex">
                        {/* Avatar */}
                        <div className="md:w-1/3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-20"></div>
                            <div className="p-8 flex justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotateY: 10 }}
                                    className="relative w-48 h-48 rounded-full border-4 border-cyan-400 overflow-hidden shadow-lg"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {userData.image ? (
                                            <img
                                                src={userData.image}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-6xl" />
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="md:w-2/3 p-8">
                            {isEditing.status ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={userData.name}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-lg px-4 py-2 ${inputBgClass} border ${borderColor}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={userData.bio}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-lg px-4 py-2 ${inputBgClass} border ${borderColor}`}
                                            rows="3"
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={updateUser}
                                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing({ status: false, id: null })}
                                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                                    <p className="">{userData.bio}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div className="flex items-center space-x-3">
                                            <FiMail className="text-cyan-400" />
                                            <span>{userData.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <FiCalendar className="text-cyan-400" />
                                            <span>{userData.joinDate}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Phone className="text-cyan-400" />
                                            <span>{userData.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <FiMapPin className="text-cyan-400" />
                                            <span>{userData.location}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Skills */}
                <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {uniqueSkills.map((skill, index) => (
                        <motion.div
                            key={skill}
                            whileHover={{ y: -5, rotateX: 5 }}
                            className=" p-4 rounded-xl shadow-lg border border-cyan-400/20"
                        >
                            <div className="h-32 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-xl font-bold">{index + 1}</span>
                                    </div>
                                    <h3 className="font-medium">{skill}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfile;