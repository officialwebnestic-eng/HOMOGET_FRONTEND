import { useEffect, useState } from "react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";

const AgentPropertyList = () => {
  const [latestProperty, setLatestProperty] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const colors = {
    light: {
      background: "bg-gray-50",
      card: "bg-white",
      text: "text-gray-800",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      primary: "bg-blue-600",
      primaryHover: "hover:bg-blue-700",
      accent: "text-blue-600",
      modal: "bg-white",
      modalBorder: "border-gray-200",
      buttonSecondary: "bg-gray-100 hover:bg-gray-200 text-gray-800"
    },
    dark: {
      background: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-gray-100",
      textSecondary: "text-gray-300",
      border: "border-gray-700",
      primary: "bg-indigo-600",
      primaryHover: "hover:bg-indigo-700",
      accent: "text-indigo-400",
      modal: "bg-gray-800",
      modalBorder: "border-gray-700",
      buttonSecondary: "bg-gray-700 hover:bg-gray-600 text-gray-100"
    }
  };

  const getLatestProperty = async () => {
    try {
      const response = await http.get("/getlatestproperty");
      if (response.data.success) {
        setLatestProperty(response.data.data);
      } else {
        console.log("No data found");
      }
    } catch (error) {
      console.log("Error fetching latest properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLatestProperty();
  }, []);

  const openModal = (property) => {
    setSelectedProperty(property);
    document.body.style.overflow = 'hidden'; 
  };

  const closeModal = () => {
    setSelectedProperty(null);
    document.body.style.overflow = 'auto'; 
  };

  if (loading) {
    return (
      <div className={`max-w-xl mx-auto px-4 mt-6 min-h-[60vh] flex items-center justify-center ${colors[theme].background}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className={`h-12 w-12 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-blue-500'} rounded-full mb-4`}></div>
          <p className={`text-lg ${colors[theme].textSecondary}`}>Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${colors[theme].background}`}>
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${colors[theme].text} mb-2`}>
            Latest Property Listings
          </h2>
          <div className={`w-24 h-1 ${theme === 'dark' ? 'bg-indigo-500' : 'bg-blue-600'} mx-auto`}></div>
        </div>

        {latestProperty.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div className="w-64 h-64 mb-6">
    <img 
      src="https://cdn3d.iconscout.com/3d/premium/thumb/no-house-found-5665724-4721949.png" 
      alt="No properties found"
      className="w-full h-full object-contain animate-float"
    />
  </div>
  <h3 className={`text-xl font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
    No properties found matching your criteria
  </h3>
  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    Try adjusting your search filters or browse our featured properties
  </p>
 
</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestProperty.map((property, index) => (
              <div
                key={index}
                onClick={() => openModal(property)}
                className={`relative group cursor-pointer ${colors[theme].card} rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border ${colors[theme].border}`}
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={property.image?.[0] || property.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"}
                    alt={property.propertyname || "Property"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-lg font-semibold">View Details</p>
                  </div>
                  <div className={`absolute top-4 right-4 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-blue-600'} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {property.propertytype || "Property"}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className={`text-xl font-bold ${colors[theme].text} mb-1 truncate`}>
                    {property.propertyname || "Untitled Property"}
                  </h3>
                  <p className={`${colors[theme].textSecondary} mb-2 flex items-center`}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {property.city || "N/A"}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div className={`flex space-x-4 text-sm ${colors[theme].textSecondary}`}>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {property.bedroom || "0"} Beds
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {property.bathroom || "0"} Baths
                      </span>
                    </div>
                    <div className={`${colors[theme].accent} font-bold text-lg`}>
                      ₹{new Intl.NumberFormat('en-IN').format(property.price) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
   {selectedProperty && (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity duration-300">
    <div 
      className={`${colors[theme].modal} rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-95 animate-fadeIn border ${colors[theme].modalBorder}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={closeModal}
        className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} text-3xl font-light transition-colors`}
        aria-label="Close modal"
      >
        &times;
      </button>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Left Side: Main Image & Thumbnails */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={
                selectedProperty.image?.[0] ||
                selectedProperty.image ||
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
              }
              alt="Property Main"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails (if more images) */}
          {selectedProperty.image && selectedProperty.image.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {selectedProperty.image.slice(1).map((img, index) => (
                <div key={index} className="h-20 rounded overflow-hidden">
                  <img
                    src={img || "https://via.placeholder.com/100"}
                    alt={`Thumbnail ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

         
        </div>

        {/* Right Side: Details */}
        <div>
          {/* Property Name */}
          <h2 className={`text-3xl font-bold ${colors[theme].text} mb-2`}>
            {selectedProperty.propertyname || "Untitled Property"}
          </h2>

          {/* Property Type */}
          <p className={`${colors[theme].accent} font-semibold mb-4`}>
            {selectedProperty.propertytype || "Property Type"}
          </p>

          {/* Location */}
          <div className={`flex items-center ${colors[theme].textSecondary} mb-4`}>
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>
              {selectedProperty.city || "N/A"}, {selectedProperty.state || "N/A"} {selectedProperty.zipcode || ""}
            </span>
          </div>

          {/* Price & Features */}
          <div className={`bg-gray-50 p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-3xl font-bold ${colors[theme].accent} mb-2`}>
              ₹{new Intl.NumberFormat('en-IN').format(selectedProperty.price) || "N/A"}
            </div>
            <div className={`flex space-x-4 text-sm ${colors[theme].textSecondary}`}>
              {/* Beds */}
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {selectedProperty.bedroom || "0"} Beds
              </span>
              {/* Baths */}
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {selectedProperty.bathroom || "0"} Baths
              </span>
              {/* Square Feet */}
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 010-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                {selectedProperty.squareFeet || "0"} sq.ft
              </span>
            </div>
          </div>

          {/* Amenities - show only if exists */}
          {selectedProperty.aminities && Array.isArray(selectedProperty.aminities) && selectedProperty.aminities.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-xl font-semibold ${colors[theme].text} mb-3`}>Amenities</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProperty.aminities.map((item, index) => {
                  try {
                    const parsed = JSON.parse(item);
                    const list = Array.isArray(parsed) ? parsed : [parsed];

                    return list.map((val, i) => (
                      <span
                        key={`${index}-${i}`}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {val}
                      </span>
                    ));
                  } catch {
                    return (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {item}
                      </span>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </div>
       {/* Description */}
          <div className=" p-4    font-serif">
            <h3 className={`text-xl font-semibold ${colors[theme].text} mb-3`}>Description</h3>
            <p className={colors[theme].textSecondary}>
              {selectedProperty.description || "No description available for this property."}
            </p>
          </div>

      {/* Footer */}
      <div className={`px-6 py-4 border-t ${colors[theme].modalBorder} flex justify-end`}>
        <button
          onClick={closeModal}
          className={`px-6 py-2 ${colors[theme].primary} text-white rounded-lg ${colors[theme].primaryHover} transition-colors`}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default AgentPropertyList;