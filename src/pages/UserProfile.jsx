import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiEdit,
    FiMail,
    FiCalendar,
    FiMapPin,
    FiUser,
    FiCheck,
    FiX
} from 'react-icons/fi';
import { Phone, Briefcase, ShieldCheck } from 'lucide-react';
import { http } from '../axios/axios';
import { useToast } from '../model/SuccessToasNotification';
import PermissionProtectedAction from '../Authorization/PermissionProtectedActions';
import { useTheme } from '../context/ThemeContext';

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState({ status: false, id: null });
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();
    const { addToast } = useToast();

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

    // --- FIX 1: handleInputChange Logic ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
                    phone: data.phone || 'N/A',
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
            addToast(error.response?.data?.message || 'Failed to fetch user data', 'error');
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
            }
        } catch (error) {
            addToast(error.response?.data?.message || 'Update failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const uniqueSkills = [...new Set(userData.skills)];

    // Theme Styling
    const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
    const cardBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-white';
    const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const textSub = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const inputStyle = `w-full rounded-xl px-4 py-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border focus:ring-2 focus:ring-cyan-500 outline-none transition-all`;

    return (
        <div className={`min-h-screen ${bgClass} ${textMain} p-4 md:p-8 transition-colors duration-300`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
            >
                {/* Header Section */}
                <div className="flex justify-between items-end mb-10 mt-12">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                            My Account
                        </h1>
                        <p className={`${textSub} mt-2`}>Manage your personal information and expertise</p>
                    </div>
                    
                    <PermissionProtectedAction action="update" module="Profile Management">
                        {!isEditing.status && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEditClick}
                                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl shadow-lg shadow-cyan-900/20 transition-all font-bold"
                            >
                                <FiEdit /> Edit Profile
                            </motion.button>
                        )}
                    </PermissionProtectedAction>
                </div>

                {/* Profile Overview Card */}
                <div className={`${cardBg} backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden`}>
                    <div className="md:flex">
                        {/* Left: Avatar Side */}
                        <div className="md:w-1/3 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-10 flex flex-col items-center justify-center border-r border-white/5">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="relative group"
                            >
                                <div className="w-44 h-44 rounded-full border-4 border-cyan-500/30 p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-cyan-400">
                                        {userData.image ? (
                                            <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-5xl">
                                                <FiUser className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 right-4 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-800" />
                            </motion.div>
                            
                            <div className="mt-6 text-center">
                                <span className="px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                                    {userData.role}
                                </span>
                                <div className="flex items-center justify-center gap-2 mt-4 text-sm font-medium text-emerald-500">
                                    <ShieldCheck size={16} /> Verified Partner
                                </div>
                            </div>
                        </div>

                        {/* Right: Info Side */}
                        <div className="md:w-2/3 p-10">
                            {isEditing.status ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-2 block">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={userData.name}
                                                onChange={handleInputChange}
                                                className={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-2 block">Professional Bio</label>
                                            <textarea
                                                name="bio"
                                                value={userData.bio}
                                                onChange={handleInputChange}
                                                className={inputStyle}
                                                rows="4"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={updateUser}
                                            disabled={isLoading}
                                            className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <span className="animate-spin mr-2">O</span> : <FiCheck />} Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsEditing({ status: false, id: null })}
                                            className="px-8 py-4 bg-gray-700 rounded-xl font-bold hover:bg-gray-600 transition-all flex items-center gap-2"
                                        >
                                            <FiX /> Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-3xl font-bold">{userData.name}</h2>
                                        <p className={`${textSub} mt-4 text-lg leading-relaxed`}>{userData.bio}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pt-6 border-t border-white/5">
                                        <InfoItem icon={<FiMail />} label="Email Address" value={userData.email} />
                                        <InfoItem icon={<Phone size={18} />} label="Contact Number" value={userData.phone} />
                                        <InfoItem icon={<FiMapPin />} label="Current Location" value={userData.location} />
                                        <InfoItem icon={<FiCalendar />} label="Member Since" value={userData.joinDate} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="mt-16">
                    <div className="flex items-center gap-4 mb-8">
                        <Briefcase className="text-cyan-500" />
                        <h2 className="text-2xl font-bold">Expertise & Skills</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {uniqueSkills.length > 0 ? uniqueSkills.map((skill, index) => (
                            <motion.div
                                key={skill}
                                whileHover={{ scale: 1.05, translateY: -5 }}
                                className={`${cardBg} p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col items-center text-center`}
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white mb-4">
                                    {index + 1}
                                </div>
                                <h3 className="font-bold text-sm uppercase tracking-tight">{skill}</h3>
                            </motion.div>
                        )) : (
                            <p className={textSub}>No skills added yet.</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Helper Component for Info Grid
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="mt-1 text-cyan-400 p-2 bg-cyan-400/10 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{label}</p>
            <p className="font-semibold text-sm break-all">{value}</p>
        </div>
    </div>
);

export default UserProfile;