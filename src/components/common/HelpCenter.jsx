import React, { useState } from 'react';
import {
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
  ChevronDown,
  ChevronRight,
  Zap,
  BookOpen,
  Video,
  Search,
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';
import EnquiryEmailModal from '../../model/EnquiryEmailModel';
import CallNowModal from '../../model/CallNowModel';

const HelpCenter = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmailModelOpen, setisEmailModelOpen] = useState(false);
  const [isCallNowModel, setIsCallNowModel] = useState(false);

  const themeClasses = {
    light: {
      bg: 'bg-gray-50',
      cardBg: 'bg-white',
      text: 'text-gray-800',
      secondaryText: 'text-gray-600',
      accent: 'text-blue-600',
      border: 'border-gray-200',
      inputBg: 'bg-white',
      hover: 'hover:bg-gray-100',
      shadow: 'shadow-lg',
      gradient: 'from-blue-50 to-purple-50',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    dark: {
      bg: 'bg-gray-900',
      cardBg: 'bg-gray-800',
      text: 'text-gray-100',
      secondaryText: 'text-gray-300',
      accent: 'text-blue-400',
      border: 'border-gray-700',
      inputBg: 'bg-gray-700',
      hover: 'hover:bg-gray-700',
      shadow: 'shadow-lg shadow-gray-900/50',
      gradient: 'from-gray-800 to-gray-900',
      button: 'bg-blue-700 hover:bg-blue-600 text-white',
    },
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Zap className="w-5 h-5" />,
      articles: [
        { title: 'Account Setup', views: '1.2k' },
        { title: 'First Steps Guide', views: '892' },
        { title: 'Navigation Basics', views: '756' },
      ],
    },
    {
      id: 'account',
      title: 'Account & Billing',
      icon: <BookOpen className="w-5 h-5" />,
      articles: [
        { title: 'Update Payment Method', views: '1.5k' },
        { title: 'Change Password', views: '1.1k' },
        { title: 'Subscription Plans', views: '943' },
      ],
    },
    {
      id: 'features',
      title: 'Features Guide',
      icon: <Video className="w-5 h-5" />,
      articles: [
        { title: 'Advanced Settings', views: '876' },
        { title: 'Keyboard Shortcuts', views: '654' },
        { title: 'Customization Options', views: '532' },
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <LifeBuoy className="w-5 h-5" />,
      articles: [
        { title: 'Common Issues', views: '2.1k' },
        { title: 'Error Messages', views: '1.8k' },
        { title: 'Performance Tips', views: '1.2k' },
      ],
    },
  ];

  const popularArticles = [
    { title: 'How to reset your password', views: '3.4k', category: 'account' },
    { title: 'Understanding your dashboard', views: '2.9k', category: 'getting-started' },
    { title: 'Troubleshooting login issues', views: '2.7k', category: 'troubleshooting' },
    { title: 'Customizing your profile', views: '2.3k', category: 'features' },
  ];

  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.articles.some((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className={`min-h-screen p-6 ${currentTheme.bg}`}>
      <div className={`relative rounded-2xl p-8 mb-10 mt-24 bg-gradient-to-br ${currentTheme.gradient} ${currentTheme.shadow}`}>
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-400/20 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-purple-400/20 blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <LifeBuoy className={`w-8 h-8 ${currentTheme.accent} mr-3`} />
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>Help Center</h1>
          </div>
          <p className={`max-w-2xl mb-6 ${currentTheme.secondaryText}`}>
            Find answers to common questions, guides, and troubleshooting tips to help you get the most out of our platform.
          </p>
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search help articles..."
              className={`w-full px-5 py-3 rounded-xl ${currentTheme.inputBg} ${currentTheme.border} border ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 translate-y-[-50%] text-gray-400" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className={`text-xl font-semibold mb-6 ${currentTheme.text}`}>Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 ${currentTheme.cardBg} ${currentTheme.border} border ${currentTheme.shadow} transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start mb-4">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} mr-4`}>
                    {categories.find((cat) => cat.id === article.category)?.icon}
                  </div>
                  <h3 className={`font-medium ${currentTheme.text}`}>{article.title}</h3>
                </div>
                <p className={`text-sm ${currentTheme.secondaryText}`}>{article.views} views</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className={`text-xl font-semibold mb-6 ${currentTheme.text}`}>Help Categories</h2>
          <div className="space-y-4">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className={`rounded-xl overflow-hidden ${currentTheme.cardBg} ${currentTheme.border} border ${currentTheme.shadow}`}
                >
                  <button
                    onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                    className={`w-full flex items-center justify-between p-6 ${currentTheme.hover}`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} mr-4`}>
                        {category.icon}
                      </div>
                      <h3 className={`text-lg font-medium ${currentTheme.text}`}>{category.title}</h3>
                    </div>
                    {activeCategory === category.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>

                  {activeCategory === category.id && (
                    <div className="px-6 pb-6">
                      <div className="space-y-3">
                        {category.articles.map((article, index) => (
                          <div key={index} className={`p-4 rounded-lg ${currentTheme.hover}`}>
                            <h4 className={`font-medium ${currentTheme.text}`}>{article.title}</h4>
                            <p className={`text-sm ${currentTheme.secondaryText}`}>{article.views} views</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={`p-8 text-center rounded-xl ${currentTheme.cardBg} ${currentTheme.border} border`}>
                <p className={currentTheme.text}>No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        <div className={`mt-16 rounded-2xl p-8 ${currentTheme.cardBg} ${currentTheme.border} border ${currentTheme.shadow}`}>
          <h2 className={`text-2xl font-bold mb-6 ${currentTheme.text}`}>Still need help?</h2>
          <p className={`mb-8 max-w-3xl ${currentTheme.secondaryText}`}>
            Our support team is available 24/7 to help you with any questions or issues you might have.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Support */}
            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} ${currentTheme.border} border`}>
              <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-100'} w-fit mb-4`}>
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className={`font-semibold mb-2 ${currentTheme.text}`}>Email Support</h3>
              <p className={`text-sm mb-4 ${currentTheme.secondaryText}`}>Get help via email with our support team</p>
              <button
                onClick={() => setisEmailModelOpen(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${currentTheme.button}`}
              >
                Contact via Email
              </button>
              <EnquiryEmailModal isOpen={isEmailModelOpen} onClose={() => setisEmailModelOpen(false)} />
            </div>

            {/* Live Chat */}
            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'} ${currentTheme.border} border`}>
              <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-900/40' : 'bg-purple-100'} w-fit mb-4`}>
                <MessageSquare className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className={`font-semibold mb-2 ${currentTheme.text}`}>Live Chat</h3>
              <p className={`text-sm mb-4 ${currentTheme.secondaryText}`}>Chat with a support agent in real-time</p>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === 'dark' ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
              >
                Start Live Chat
              </button>
            </div>

            {/* Phone Support */}
            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'} ${currentTheme.border} border`}>
              <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-900/40' : 'bg-green-100'} w-fit mb-4`}>
                <Phone className="w-6 h-6 text-green-500" />
              </div>
              <h3 className={`font-semibold mb-2 ${currentTheme.text}`}>Phone Support</h3>
              <p className={`text-sm mb-4 ${currentTheme.secondaryText}`}>Call us directly for immediate assistance</p>
              <button
                onClick={() => setIsCallNowModel(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === 'dark' ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white`}
              >
                Call Now
              </button>
              <CallNowModal isOpen={isCallNowModel} onClose={() => setIsCallNowModel(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
