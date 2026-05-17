import React, { useState } from 'react';
import { Search, MapPin, ChevronDown, Home, Building2, Bed, Bath, IndianRupee, Star, Heart } from 'lucide-react';

const Agentfilter = () => {
  const [activeTab, setActiveTab] = useState('rent');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedsBaths, setBedsBaths] = useState('');

  const tabs = [
    { id: 'rent', label: 'Rent' },
    { id: 'buy', label: 'Buy' },
    { id: 'new-projects', label: 'New projects' },
    { id: 'commercial', label: 'Commercial' },
  ];

  const featuredProjects = [
    {
      id: 1,
      name: 'Vida Residences Hillside',
      location: 'Dubai, Dubai Hills Estate',
      price: '1,827,888',
      currency: 'AED',
      beds: '1-3',
      type: 'Multiple',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      delivery: 'Q2 2029',
      paymentPlans: '2 Payment Plans',
      developer: 'EMAAR'
    },
    {
      id: 2,
      name: 'City Walk Crestlane Phase 5',
      location: 'Dubai, City Walk',
      price: '2,800,000',
      currency: 'AED',
      beds: '1-4',
      type: 'Multiple',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      delivery: 'Q2 2030',
      paymentPlans: 'Payment Plan: 20/55/25',
      developer: 'MERAAS'
    },
    {
      id: 3,
      name: 'Creek Haven',
      location: 'Dubai, Dubai Creek Harbour',
      price: '1,951,888',
      currency: 'AED',
      beds: '1-3',
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      delivery: 'Q1 2030',
      paymentPlans: '2 Payment Plans',
      developer: 'EMAAR'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-[600px] xoverflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600')",
          }}
        >
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Your home search starts here
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Find properties to rent, buy or invest.
            </p>
          </div>

          {/* Search Card */}
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl shadow-xl p-2 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, community or building"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Property Type Dropdown */}
                <div className="relative lg:w-48">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full appearance-none px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Beds & Baths Dropdown */}
                <div className="relative lg:w-48">
                  <select
                    value={bedsBaths}
                    onChange={(e) => setBedsBaths(e.target.value)}
                    className="w-full appearance-none px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Beds & Baths</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4+">4+ Beds</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Search Button */}
                <button className="lg:w-auto w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore new projects in the UAE
          </h2>
          <p className="text-lg text-gray-600">
            Discover the latest off-plan properties and be informed.
          </p>
        </div>

        {/* Location Tabs */}
        <div className="flex flex-wrap gap-6 mb-8 border-b border-gray-200">
          {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah'].map((city) => (
            <button
              key={city}
              className={`pb-4 px-2 font-semibold transition-all ${
                city === 'Dubai'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Project Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  <span className="inline-block bg-gray-800/90 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Off-Plan
                  </span>
                  <span className="block bg-gray-800/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    Delivery Date: {project.delivery}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors group/heart">
                  <Heart className="w-5 h-5 text-gray-700 group-hover/heart:text-red-500 transition-colors" />
                </button>

                {/* Developer Logo */}
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                  <span className="font-bold text-gray-900">{project.developer}</span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {project.location}
                </p>

                {/* Property Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {project.beds} Beds
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {project.type}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Launch price:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.price.toLocaleString()} {project.currency}
                  </p>
                  <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {project.paymentPlans}
                  </span>
                </div>

                {/* WhatsApp Button */}
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2">
            <span>View All Projects</span>
            <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Agentfilter;