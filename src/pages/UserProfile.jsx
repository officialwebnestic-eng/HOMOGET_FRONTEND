import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiEdit,
    FiMail,
    FiCalendar,
    FiMapPin,
    FiUser,
    FiCheck,
    FiX,
    FiKey,
    FiSend,
    FiLock,
    FiShield,
    FiCreditCard
} from 'react-icons/fi';
import { Phone, Briefcase, ShieldCheck, Award, Building2, Globe, Star, IdCard } from 'lucide-react';
import { http } from '../axios/axios';
import { useToast } from '../model/SuccessToasNotification';
import PermissionProtectedAction from '../Authorization/PermissionProtectedActions';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState({ status: false, id: null });
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showVerifyEmail, setShowVerifyEmail] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const { theme } = useTheme();
    const { addToast } = useToast();
    const { user } = useContext(AuthContext);

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
        // Agent specific fields
        agentId: '',
        reraLicenseNumber: '',
        experienceYears: 0,
        languages: [],
        totalPropertiesSold: 0,
        totalRevenueGenerated: 0,
        visaStatus: '',
        nationality: '',
        emiratesId: '',
        gender: '',
        isPublic: true,
        isBlocked: false,
        profilePhoto: '',
    });
    console.log(userData, "this is a userdataa")

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

                const isAdmin = data.role?.toLowerCase() === "admin";

                const fullName = isAgent || isAdmin
                    ? data.name || `${data.firstname || ''} ${data.lastname || ''}`.trim()
                    : `${data.firstname || ''} ${data.lastname || ''}`.trim();

                setUserData({
                    name: fullName,
                    phone: data.phone || data.mobile || 'N/A',
                    email: data.email || '',
                    role: data.role || '',
                    status: data.status || 'Active',
                    joinDate: data.createdAt
                        ? `Joined ${new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                        : '',
                    location: `${data.city || 'Dubai'}, ${data.state || 'UAE'}`,
                    address: data.address || 'Not specified',
                    bio: data.bio || 'No bio yet',
                    skills: data.skills || [],
                    image: data.image || data.profilePhoto || '',
                    balance: data.balance || 0,
                    // Agent specific
                    agentId: data.agentId || '',
                    reraLicenseNumber: data.reraLicenseNumber || '',
                    experienceYears: data.experienceYears || 0,
                    languages: data.languages || ['English'],
                    totalPropertiesSold: data.totalPropertiesSold || 0,
                    totalRevenueGenerated: data.totalRevenueGenerated || 0,
                    visaStatus: data.visaStatus || '',
                    nationality: data.nationality || '',
                    emiratesId: data.emiratesId || '',
                    gender: data.gender || '',
                    isPublic: data.isPublic !== undefined ? data.isPublic : true,
                    isBlocked: data.isBlocked || false,
                    profilePhoto: data.profilePhoto || data.image || '',
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
                `/update-user`,
                {
                    name: userData.name,
                    bio: userData.bio,
                    address: userData.address,
                    skills: userData.skills,
                    phone: userData.phone,
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

    // Handle Forgot Password
    const handleForgotPassword = async () => {
        if (!email) {
            addToast('Please enter your email address', 'error');
            return;
        }
        try {
            setIsLoading(true);
            const response = await http.post('/forgot-password', { email });
            addToast(response.data.message || 'Password reset link sent to your email', 'success');
            setShowForgotPassword(false);
            setShowVerifyEmail(true);
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to send reset link', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Verify Email/OTP
    const handleVerifyEmail = async () => {
        if (!otp) {
            addToast('Please enter the OTP', 'error');
            return;
        }
        try {
            setIsLoading(true);
            const response = await http.post('/verifytoken', { token: otp });
            addToast(response.data.message || 'OTP verified successfully', 'success');
            setResetToken(otp);
            setShowVerifyEmail(false);
            setShowResetPassword(true);
        } catch (error) {
            addToast(error.response?.data?.message || 'Invalid OTP', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Reset Password
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            addToast('Passwords do not match', 'error');
            return;
        }
        if (newPassword.length < 6) {
            addToast('Password must be at least 6 characters', 'error');
            return;
        }
        try {
            setIsLoading(true);
            const response = await http.post('/reset-password', {
                token: resetToken,
                newPassword: newPassword
            });
            addToast(response.data.message || 'Password reset successfully', 'success');
            setShowResetPassword(false);
            setNewPassword('');
            setConfirmPassword('');
            setOtp('');
            setResetToken('');
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to reset password', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Resend OTP
    const handleResendOTP = async () => {
        try {
            setIsLoading(true);
            const response = await http.post('/resend-otp', { email });
            addToast(response.data.message || 'OTP resent successfully', 'success');
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to resend OTP', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const uniqueSkills = [...new Set(userData.skills)];

    // Check if user is Agent
    const isAgent = userData.role?.toLowerCase() !== "user" && userData.role?.toLowerCase() !== "admin";
    const isAdmin = userData.role?.toLowerCase() === "admin";

    // Theme Styling - Amber Theme
    const bgClass = theme === 'dark' ? 'bg-[#0a0a0c]' : 'bg-amber-50/30';
    const cardBg = theme === 'dark' ? 'bg-[#141417]' : 'bg-white';
    const cardBorder = theme === 'dark' ? 'border-white/5' : 'border-amber-100';
    const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const textSub = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const accentColor = 'amber';
    const accentClass = 'amber-500';
    const accentBg = 'amber-500/10';
    const inputStyle = `w-full rounded-xl px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-amber-50/50 border-amber-200 text-gray-900'} border focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm`;

    return (
        <div className={`min-h-screen ${bgClass} ${textMain} p-4 md:p-8 transition-colors duration-300`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight">
                            <span className="text-amber-500">Welcome</span> {user?.firstname || 'User'}
                        </h1>
                        <p className={`${textSub} text-xs sm:text-sm mt-1`}>
                            {isAgent ? 'Manage your professional profile and expertise' : 'Manage your personal information'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                        <PermissionProtectedAction action="update" module="Profile Management">
                            {!isEditing.status && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleEditClick}
                                    className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/20 transition-all font-bold text-xs sm:text-sm"
                                >
                                    <FiEdit size={16} /> Edit Profile
                                </motion.button>
                            )}
                        </PermissionProtectedAction>

                        {/* Forgot Password Button */}
                        <button
                            onClick={() => setShowForgotPassword(true)}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl transition-all font-bold text-xs sm:text-sm"
                        >
                            <FiKey size={16} /> Change Password
                        </button>
                    </div>
                </div>

                {/* Profile Overview Card */}
                <div className={`${cardBg} backdrop-blur-xl border ${cardBorder} rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden`}>
                    <div className="flex flex-col md:flex-row">
                        {/* Left: Avatar Side */}
                        <div className="md:w-1/3 bg-gradient-to-br from-amber-500/10 to-orange-600/10 p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative group"
                            >
                                <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-amber-500/30 p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-amber-400">
                                        {(userData.image || userData.profilePhoto) ? (
                                            <img
                                                src={userData.image || userData.profilePhoto}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=C5A059&color=fff&bold=true`;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl sm:text-4xl text-white font-bold">
                                                {userData.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 right-4 bg-green-500 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 border-gray-900 dark:border-[#141417]" />
                            </motion.div>

                            <div className="mt-4 sm:mt-6 text-center">
                                <span className={`px-3 sm:px-4 py-1 rounded-full bg-${accentBg} text-${accentClass} text-[8px] sm:text-[10px] font-bold uppercase tracking-widest`}>
                                    {isAdmin ? 'Administrator' : userData.role}
                                </span>
                                {isAgent && (
                                    <div className="flex items-center justify-center gap-2 mt-2 text-[10px] sm:text-xs font-medium text-emerald-500">
                                        <ShieldCheck size={14} /> Verified Partner
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Info Side */}
                        <div className="md:w-2/3 p-6 sm:p-8 md:p-10">
                            {isEditing.status ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1 block">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={userData.name}
                                                onChange={handleInputChange}
                                                className={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1 block">Phone Number</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={userData.phone}
                                                onChange={handleInputChange}
                                                className={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1 block">Professional Bio</label>
                                            <textarea
                                                name="bio"
                                                value={userData.bio}
                                                onChange={handleInputChange}
                                                className={inputStyle}
                                                rows="3"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1 block">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={userData.address}
                                                onChange={handleInputChange}
                                                className={inputStyle}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                                        <button
                                            onClick={updateUser}
                                            disabled={isLoading}
                                            className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-xs sm:text-sm"
                                        >
                                            {isLoading ? <span className="animate-spin mr-2">⏳</span> : <FiCheck size={16} />} Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsEditing({ status: false, id: null })}
                                            className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-2 text-xs sm:text-sm"
                                        >
                                            <FiX size={16} /> Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{userData.name}</h2>
                                        <p className={`${textSub} text-sm sm:text-base mt-3 leading-relaxed`}>{userData.bio}</p>
                                    </div>

                                    {/* Info Grid - Added Emirates ID for Agents */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-8 pt-4 sm:pt-6 border-t border-white/5">
                                        <InfoItem icon={<FiMail size={14} />} label="Email Address" value={userData.email} />
                                        <InfoItem icon={<Phone size={14} />} label="Contact Number" value={userData.phone} />
                                        <InfoItem icon={<FiMapPin size={14} />} label="Current Location" value={userData.location} />
                                        <InfoItem icon={<FiCalendar size={14} />} label="Member Since" value={userData.joinDate} />
                                        
                                        {/* Agent Specific Fields */}
                                        {isAgent && (
                                            <>
                                                {/* ✅ Emirates ID - Now Showing */}
                                                <InfoItem 
                                                    icon={<IdCard size={14} />} 
                                                    label="Emirates ID" 
                                                    value={userData.emiratesId || 'N/A'} 
                                                />
                                                <InfoItem 
                                                    icon={<Award size={14} />} 
                                                    label="RERA License" 
                                                    value={userData.reraLicenseNumber || 'N/A'} 
                                                />
                                                <InfoItem 
                                                    icon={<Building2 size={14} />} 
                                                    label="Properties Sold" 
                                                    value={userData.totalPropertiesSold || 0} 
                                                />
                                                <InfoItem 
                                                    icon={<Globe size={14} />} 
                                                    label="Nationality" 
                                                    value={userData.nationality || 'N/A'} 
                                                />
                                                <InfoItem 
                                                    icon={<Briefcase size={14} />} 
                                                    label="Experience" 
                                                    value={`${userData.experienceYears || 0} Years`} 
                                                />
                                                <InfoItem 
                                                    icon={<ShieldCheck size={14} />} 
                                                    label="Visa Status" 
                                                    value={userData.visaStatus || 'N/A'} 
                                                />
                                                <InfoItem 
                                                    icon={<FiUser size={14} />} 
                                                    label="Gender" 
                                                    value={userData.gender || 'N/A'} 
                                                />
                                                <InfoItem 
                                                    icon={<FiCreditCard size={14} />} 
                                                    label="Agent ID" 
                                                    value={userData.agentId || 'N/A'} 
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="mt-12 sm:mt-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="text-amber-500" size={20} />
                        <h2 className="text-lg sm:text-xl font-bold">Expertise & Skills</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                        {uniqueSkills.length > 0 ? uniqueSkills.map((skill, index) => (
                            <motion.div
                                key={skill}
                                whileHover={{ scale: 1.03, translateY: -3 }}
                                className={`${cardBg} p-4 sm:p-5 rounded-xl border ${cardBorder} shadow-lg flex flex-col items-center text-center`}
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-xs sm:text-sm mb-2 sm:mb-3">
                                    {index + 1}
                                </div>
                                <h3 className="font-bold text-[10px] sm:text-xs uppercase tracking-tight">{skill}</h3>
                            </motion.div>
                        )) : (
                            <p className={`${textSub} text-sm col-span-full text-center py-4`}>No skills added yet.</p>
                        )}
                    </div>
                </div>

                {/* Agent Specific Stats */}
                {isAgent && (
                    <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <StatCard
                            icon={<Award className="text-amber-500" size={18} />}
                            label="Properties Sold"
                            value={userData.totalPropertiesSold || 0}
                            theme={theme}
                        />
                        <StatCard
                            icon={<Star className="text-amber-500" size={18} />}
                            label="Revenue Generated"
                            value={`AED ${(userData.totalRevenueGenerated || 0).toLocaleString()}`}
                            theme={theme}
                        />
                        <StatCard
                            icon={<ShieldCheck className="text-amber-500" size={18} />}
                            label="Visa Status"
                            value={userData.visaStatus || 'N/A'}
                            theme={theme}
                        />
                        <StatCard
                            icon={<Globe className="text-amber-500" size={18} />}
                            label="Languages"
                            value={userData.languages?.join(', ') || 'English'}
                            theme={theme}
                        />
                    </div>
                )}
            </motion.div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`${cardBg} rounded-2xl max-w-md w-full p-6 border ${cardBorder}`}>
                        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
                        <p className={`${textSub} text-sm mb-4`}>Enter your email to receive a password reset OTP</p>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputStyle}
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleForgotPassword}
                                disabled={isLoading}
                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
                            >
                                {isLoading ? <span className="animate-spin">⏳</span> : <FiSend size={16} />} Send OTP
                            </button>
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verify Email Modal */}
            {showVerifyEmail && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`${cardBg} rounded-2xl max-w-md w-full p-6 border ${cardBorder}`}>
                        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
                        <p className={`${textSub} text-sm mb-4`}>Enter the 6-digit OTP sent to your email</p>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className={inputStyle}
                            maxLength="6"
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleVerifyEmail}
                                disabled={isLoading}
                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
                            >
                                {isLoading ? <span className="animate-spin">⏳</span> : <FiCheck size={16} />} Verify
                            </button>
                            <button
                                onClick={handleResendOTP}
                                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold text-sm"
                            >
                                Resend
                            </button>
                            <button
                                onClick={() => setShowVerifyEmail(false)}
                                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetPassword && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`${cardBg} rounded-2xl max-w-md w-full p-6 border ${cardBorder}`}>
                        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                        <p className={`${textSub} text-sm mb-4`}>Enter your new password</p>
                        <div className="space-y-3">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={inputStyle}
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={inputStyle}
                            />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleResetPassword}
                                disabled={isLoading}
                                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
                            >
                                {isLoading ? <span className="animate-spin">⏳</span> : <FiLock size={16} />} Reset Password
                            </button>
                            <button
                                onClick={() => setShowResetPassword(false)}
                                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Component for Info Grid
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5 text-amber-500 p-1.5 sm:p-2 bg-amber-500/10 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
            <p className="font-semibold text-xs sm:text-sm break-all">{value}</p>
        </div>
    </div>
);

// Stat Card Component
const StatCard = ({ icon, label, value, theme }) => (
    <div className={`${theme === 'dark' ? 'bg-[#141417]' : 'bg-white'} p-4 rounded-xl border ${theme === 'dark' ? 'border-white/5' : 'border-amber-100'} shadow-lg`}>
        <div className="flex items-center gap-2 mb-1">
            {icon}
            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <p className="text-sm sm:text-base font-bold">{value}</p>
    </div>
);

export default UserProfile;