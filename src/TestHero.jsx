import React from 'react'

const TestHero = () => {
  return (
    <div>  <div className="relative overflow-hidden">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Luxury Properties"
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
              {/* Light gradient overlay for bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              {/* Pattern overlay for texture */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-10"></div>
            </div>
    
            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
                    <span className="block font-serif leading-[1.1]">
                      <RadialGradient
                        gradient={["circle, rgba(251,191,36,1) 0%, rgba(244,63,94,1) 100%"]}
                      >
                        Property Finder
                      </RadialGradient>
                    </span>
                    <span className="text-xl sm:text-2xl md:text-3xl mt-2  italic font-light text-slate-500">
                      Your home search starts here
                    </span>
                  </h1>
                  <p className="text-lg text-white/80 max-w-2xl mx-auto">
                    Find properties to rent, buy or invest
                  </p>
                </motion.div>
              </div>
    
              {/* Property Type Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-2 mb-8"
              >
                {["buy", "rent", "new projects", "commercial"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-6 py-3 rounded-full font-medium transition-all backdrop-blur-sm ${
                      selectedTab === tab
                        ? `${colors.primary} text-white shadow-lg`
                        : `bg-white/10 text-white hover:bg-white/20 border border-white/20`
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </motion.div>
    
              {/* Main Search Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Location Search */}
                    <div className="md:col-span-2 relative search-container">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(e.target.value.length > 0);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          placeholder="City, community or building"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      
                      {/* Suggestions Dropdown */}
                      <AnimatePresence>
                        {showSuggestions && propertyList.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white/95 backdrop-blur-md rounded-xl shadow-2xl divide-y divide-gray-100 z-50 border border-gray-200"
                          >
                            <div className="p-3">
                              <h3 className="text-xs font-semibold uppercase tracking-wide px-3 mb-2 text-gray-500">
                                Popular Locations
                              </h3>
                              {propertyList.slice(0, 5).map((location, index) => (
                                <motion.button
                                  key={`${location.city}-${location.state}-${index}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  onClick={() => {
                                    setSearchQuery(`${location.city}, ${location.state}`);
                                    setFilters((prev) => ({
                                      ...prev,
                                      city: location.city,
                                      state: location.state,
                                    }));
                                    setShowSuggestions(false);
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors group"
                                >
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                    <span>{location.city}, {location.state}</span>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
    
                    {/* Property Type */}
                    <div>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                        name="propertytype"
                        value={filters.propertytype}
                        onChange={handleFilterChange}
                      >
                        <option value="">Property type</option>
                        {getUniqueValues(propertyList, "propertytype").map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
    
                    {/* Search Button */}
                    <button
                      onClick={() => handleSubmit()}
                      className={`w-full ${colors.primary} text-white px-6 py-3 rounded-xl ${colors.primaryHover} transition-all flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transform`}
                    >
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </button>
                  </div>
    
                  {/* Advanced Filters Toggle */}
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Advanced Filters</span>
                      {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
    
                  {/* Advanced Filters Panel */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {filterFields.slice(2, 7).map(({ name, label, icon }) => {
                              const options = getUniqueValues(propertyList, name);
                              return (
                                <div key={name} className="relative">
                                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    {React.cloneElement(icon, { className: "w-4 h-4 text-gray-400" })}
                                  </div>
                                  <select
                                    className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    name={name}
                                    value={filters[name] || ""}
                                    onChange={handleFilterChange}
                                  >
                                    <option value="">{label}</option>
                                    {options.map((opt) => (
                                      <option key={opt} value={opt}>
                                        {name === "price" ? `₹${opt.toLocaleString()}` : opt}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={resetFilters}
                              className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Clear all
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
    
              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              >
                {[
                  { label: "Properties", value: "10K+", icon: "🏠" },
                  { label: "Happy Clients", value: "5K+", icon: "😊" },
                  { label: "Cities", value: "50+", icon: "📍" },
                  { label: "Years", value: "15+", icon: "⭐" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
    
            {/* Bottom Gradient Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
          </div></div>
  )
}

export default TestHero