import React, { useState } from 'react';
import { X, Copy, Check, Facebook, Twitter, Linkedin, Mail, Share2, Instagram, MessageCircle, Send, QrCode, MapPin, Bed, Bath, Square, Building, Calendar, Crown, Briefcase, Home, Sparkles, Clock } from 'lucide-react';
import { FaWhatsapp, FaTelegram, FaReddit, FaPinterest, FaTiktok, FaSnapchat, FaWeixin, FaLine, FaDiscord, FaFacebookMessenger } from 'react-icons/fa';

const ShareModal = ({ property, onClose, isDark }) => {
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const propertyUrl = `${window.location.origin}/property/${property._id}`;
  const propertyTitle = property.propertyTitleEn || property.propertyname;
  const price = `AED ${Number(property.price).toLocaleString()}`;
  const location = property.community || property.city || "Dubai";
  const propertyImage = property.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg";
  
  // Helper functions to check property type
  const isOffPlan = () => property?.category === "Off-Plan";
  const isCommercial = () => property?.category === "Commercial";
  const isRent = () => property?.offeringType === "Rent";
  
  // Condition-based fields
  const bedroom = property.bedroom || 0;
  const bathroom = property.bathroom || 0;
  const squarefoot = property.squarefoot?.toLocaleString() || 0;
  const offPlanType = property.offPlanType || "Direct";
  const deliveryDate = property.deliveryDate || "Q4 2026";
  const completionPercentage = property.completionPercentage || 0;
  const propertyType = property.propertytype || (isCommercial() ? "Commercial Space" : "Residential");
  
  // Get property type icon and badge
  const getPropertyTypeIcon = () => {
    if (isOffPlan()) return "🏗️";
    if (isCommercial()) return "🏢";
    return "🏠";
  };
  
  const getStatusBadge = () => {
    if (isOffPlan()) return { text: "OFF-PLAN", icon: "📐" };
    if (isRent()) return { text: "FOR RENT", icon: "🔑" };
    return { text: "FOR SALE", icon: "💰" };
  };
  
  const statusBadge = getStatusBadge();
  
  // Build share message based on property type
  let shareMessage = `🏠 *${propertyTitle}*\n\n`;
  shareMessage += `📍 *Location:* ${location}\n`;
  shareMessage += `💰 *Price:* ${price}`;
  
  if (isRent() && property.rentedPeriod) {
    shareMessage += ` / ${property.rentedPeriod?.toLowerCase().replace("per ", "") || "year"}`;
  }
  shareMessage += `\n`;
  
  // Add property type specific details
  if (isOffPlan()) {
    shareMessage += `🏗️ *Type:* Off-Plan (${offPlanType})\n`;
    shareMessage += `📅 *Handover:* ${deliveryDate}\n`;
    shareMessage += `📊 *Completion:* ${completionPercentage}%\n`;
    shareMessage += `📐 *Area:* ${squarefoot} sqft\n`;
  } 
  else if (isCommercial()) {
    shareMessage += `🏢 *Property Type:* ${propertyType}\n`;
    shareMessage += `📐 *Area:* ${squarefoot} sqft\n`;
    if (property.parkingSlots) {
      shareMessage += `🅿️ *Parking:* ${property.parkingSlots} slots\n`;
    }
  } 
  else {
    // Residential
    shareMessage += `🛏️ *Bedrooms:* ${bedroom}\n`;
    shareMessage += `🛁 *Bathrooms:* ${bathroom}\n`;
    shareMessage += `📐 *Area:* ${squarefoot} sqft\n`;
    if (property.furnishingType && property.furnishingType !== "Unfurnished") {
      shareMessage += `🪑 *Furnishing:* ${property.furnishingType}\n`;
    }
  }
  
  // Add offering type
  shareMessage += `\n📋 *Offering:* ${isRent() ? "For Rent" : "For Sale"}\n`;
  
  // Add DLD verification if available
  if (property.dldQRCode && property.dldExpiryDate) {
    const isExpired = new Date(property.dldExpiryDate) < new Date();
    if (!isExpired) {
      shareMessage += `✅ *DLD Verified:* Active\n`;
    }
  }
  
  shareMessage += `\n🔗 *View Property:* ${propertyUrl}`;
  
  // Short message for social media
  const shortMessage = `${getPropertyTypeIcon()} ${propertyTitle}\n${location} | ${price}\n${isOffPlan() ? `Handover: ${deliveryDate}` : `${bedroom} Beds | ${bathroom} Baths`}\n\n${propertyUrl}`;
  
  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(propertyUrl);
    const encodedTitle = encodeURIComponent(propertyTitle);
    const encodedMessage = encodeURIComponent(shareMessage);
    const encodedShortMessage = encodeURIComponent(shortMessage);
    const encodedImage = encodeURIComponent(propertyImage);

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      whatsappBusiness: `https://api.whatsapp.com/send?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      facebookMessenger: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=your_app_id`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      instagram: `https://www.instagram.com/`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      tiktok: `https://www.tiktok.com/@homoget?refer=${encodedUrl}`,
      snapchat: `https://www.snapchat.com/share?url=${encodedUrl}`,
      wechat: `https://api.whatsapp.com/send?text=${encodedMessage}`,
      line: `https://line.me/R/msg/text/?${encodedMessage}`,
      discord: `https://discord.com/channels/@me`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedMessage}`,
      sms: `sms:?body=${encodedShortMessage}`,
      telegramChannel: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(shareMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleDownloadQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(propertyUrl)}`;
    window.open(qrUrl, '_blank');
  };

  const shareOptions = [
    { name: 'WhatsApp', icon: <FaWhatsapp size={22} className="text-green-500" />, key: 'whatsapp', color: 'hover:bg-green-50 dark:hover:bg-green-500/10' },
    { name: 'Facebook', icon: <Facebook size={20} className="text-blue-600" />, key: 'facebook', color: 'hover:bg-blue-50 dark:hover:bg-blue-500/10' },
    { name: 'Twitter', icon: <Twitter size={20} className="text-sky-500" />, key: 'twitter', color: 'hover:bg-sky-50 dark:hover:bg-sky-500/10' },
    { name: 'LinkedIn', icon: <Linkedin size={20} className="text-blue-700" />, key: 'linkedin', color: 'hover:bg-blue-50 dark:hover:bg-blue-500/10' },
    { name: 'Instagram', icon: <Instagram size={20} className="text-pink-600" />, key: 'instagram', color: 'hover:bg-pink-50 dark:hover:bg-pink-500/10' },
    { name: 'Telegram', icon: <FaTelegram size={20} className="text-blue-500" />, key: 'telegram', color: 'hover:bg-blue-50 dark:hover:bg-blue-500/10' },
    { name: 'TikTok', icon: <FaTiktok size={20} className="text-black dark:text-white" />, key: 'tiktok', color: 'hover:bg-gray-100 dark:hover:bg-gray-800' },
    { name: 'Reddit', icon: <FaReddit size={20} className="text-orange-600" />, key: 'reddit', color: 'hover:bg-orange-50 dark:hover:bg-orange-500/10' },
    { name: 'Pinterest', icon: <FaPinterest size={20} className="text-red-600" />, key: 'pinterest', color: 'hover:bg-red-50 dark:hover:bg-red-500/10' },
    { name: 'Snapchat', icon: <FaSnapchat size={20} className="text-yellow-500" />, key: 'snapchat', color: 'hover:bg-yellow-50 dark:hover:bg-yellow-500/10' },
    { name: 'Discord', icon: <FaDiscord size={20} className="text-indigo-500" />, key: 'discord', color: 'hover:bg-indigo-50 dark:hover:bg-indigo-500/10' },
    { name: 'Email', icon: <Mail size={20} className="text-amber-500" />, key: 'email', color: 'hover:bg-amber-50 dark:hover:bg-amber-500/10' },
    { name: 'SMS', icon: <MessageCircle size={20} className="text-green-500" />, key: 'sms', color: 'hover:bg-green-50 dark:hover:bg-green-500/10' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`relative w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl ${
          isDark ? 'bg-[#1a1a1f] border border-white/10' : 'bg-white border border-gray-200'
        }`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Share2 size={16} className="text-amber-500" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Share Property</h3>
              <p className="text-[9px] text-gray-500">Share with friends and family</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition">
            <X size={16} />
          </button>
        </div>

        {/* Property Preview */}
        <div className={`p-3 mx-3 mt-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img src={propertyImage} alt={propertyTitle} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">{getPropertyTypeIcon()}</span>
                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{propertyTitle}</p>
              </div>
              <p className="text-[11px] text-amber-500 font-bold mt-0.5">{price}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={9} className="text-gray-400" />
                <p className="text-[9px] text-gray-500 truncate">{location}</p>
              </div>
              {!isOffPlan() && !isCommercial() && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[8px] text-gray-400">🛏️ {bedroom}</span>
                  <span className="text-[8px] text-gray-400">🛁 {bathroom}</span>
                  <span className="text-[8px] text-gray-400">📐 {squarefoot} sqft</span>
                </div>
              )}
              {isOffPlan() && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[8px] text-purple-400">{offPlanType}</span>
                  <span className="text-[8px] text-gray-400">• Handover: {deliveryDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Toggle */}
        <div className="px-3 mt-2">
          <button
            onClick={() => setShowQR(!showQR)}
            className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
              showQR 
                ? 'bg-amber-500 text-white' 
                : isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <QrCode size={12} />
            {showQR ? 'Hide QR Code' : 'Show QR Code'}
          </button>
        </div>

        {/* QR Code Display */}
        {showQR && (
          <div className="mx-3 mt-2 p-3 rounded-xl bg-white dark:bg-gray-800 flex flex-col items-center">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(propertyUrl)}`} 
              alt="QR Code" 
              className="w-28 h-28"
            />
            <p className="text-[8px] text-gray-500 mt-1.5 text-center">Scan QR code to view property</p>
            <button
              onClick={handleDownloadQR}
              className="mt-1 text-[9px] text-amber-500 hover:underline"
            >
              Download QR Code
            </button>
          </div>
        )}

        {/* Share Options Grid */}
        <div className="p-3 max-h-[320px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-4 gap-2">
            {shareOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleShare(option.key)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${option.color} hover:scale-105 group`}
              >
                <div className="transition-transform group-hover:scale-110">
                  {option.icon}
                </div>
                <span className="text-[8px] font-medium text-gray-600 dark:text-gray-400">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`p-3 border-t ${isDark ? 'border-white/10' : 'border-gray-100'} space-y-1.5`}>
          <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
            <input 
              type="text" 
              value={propertyUrl} 
              readOnly 
              className={`flex-1 text-[10px] bg-transparent outline-none ${isDark ? 'text-gray-300' : 'text-gray-600'}`} 
            />
            <button 
              onClick={handleCopyLink} 
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500 text-black text-[9px] font-bold hover:bg-amber-400 transition"
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <button 
            onClick={handleCopyMessage}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[9px] font-medium transition-all ${
              isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {copiedMessage ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
            {copiedMessage ? "Message Copied" : "Copy Property Details"}
          </button>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${isDark ? '#1a1a1f' : '#f1f1f1'};
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? '#3a3f4b' : '#cbd5e1'};
            border-radius: 10px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ShareModal;