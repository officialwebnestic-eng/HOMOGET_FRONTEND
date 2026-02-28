export const UAE_STATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];

export const DUBAI_AREAS = [
  "Palm Jumeirah", "Dubai Marina", "Downtown Dubai", "Business Bay", 
  "Jumeirah Village Circle (JVC)", "Jumeirah Lakes Towers (JLT)", 
  "Dubai Hills Estate", "Arabian Ranches", "DAMAC Hills", "Dubai Creek Harbour",
  "Emaar Beachfront", "Meydan", "MBR City", "Al Furjan", "Dubai South", 
  "Bluewaters Island", "City Walk", "Jumeirah Golf Estates", "Arjan"
].sort();

export const PROPERTY_TYPES = [
  // --- Residential ---
  "Apartment", 
  "Villa", 
  "Townhouse", 
  "Penthouse", 
  "Hotel Apartment",
  "Compound",
  "Duplex",
  "Full Floor Residential",
  
  // --- Commercial ---
  "Office", 
  "Retail", 
  "Warehouse", 
  "Full Building",
  "Showroom",
  "Industrial Land",
  "Labor Camp",
  
  // --- Land & Specialized ---
  "Land", 
  "Residential Plot",
  "Commercial Plot",
  "Mixed Use Plot"
];

export const AMENITIES = [
  "Infinity Pool", "Private Pool", "Shared Gym", "Sauna", "Steam Room", 
  "Concierge Service", "Valet Parking", "Smart Home System", "Maid Service",
  "EV Charging Station", "24/7 Security", "Pet Friendly", "Covered Parking",
  "Children's Play Area", "BBQ Area", "Beach Access"
];

export const DUBAI_CATEGORIES = [
  {
    label: "Residential Ready",
    options: [
      { 
        value: "Resi-Sale", 
        label: "Residential Sale (Ready)", 
        meta: { usage: "Residential", listing: "Buy", segment: "Standard", type: "property" } 
      },
      { 
        value: "Resi-Rent", 
        label: "Residential Rent (Yearly)", 
        meta: { usage: "Residential", listing: "Rent", segment: "Standard", type: "property" } 
      },
      { 
        value: "Luxury", 
        label: "Luxury Collection", 
        meta: { usage: "Residential", listing: "Buy", segment: "Luxury" } 
      }
    ],
  },
  {
    label: "Commercial & Industrial",
    options: [
      { 
        value: "Office-Lease", 
        label: "Office Space (Lease)", 
        meta: { usage: "Commercial", listing: "Rent", propertyType: "Office" } 
      },
      { 
        value: "Retail-Sale", 
        label: "Retail & Shops (Sale)", 
        meta: { usage: "Commercial", listing: "Buy", propertyType: "Retail" } 
      },
      { 
        value: "Warehouse", 
        label: "Warehouse/Industrial", 
        meta: { usage: "Commercial", listing: "Rent", propertyType: "Warehouse" } 
      },
      { 
        value: "Full-Building", 
        label: "Full Building/Investment", 
        meta: { usage: "Commercial", listing: "Buy", propertyType: "Full Building" } 
      }
    ],
  },
  {
    label: "Off-Plan & Lands",
    options: [
      { 
        value: "Off-Plan", 
        label: "Off-Plan Projects", 
        meta: { usage: "Residential", listing: "Buy", segment: "Standard", type: "project" } 
      },
      { 
        value: "Plots", 
        label: "Land/Plots", 
        meta: { usage: "Land", listing: "Buy", segment: "Standard" } 
      }
    ],
  },
  {
    label: "Elite Collection",
    options: [
      { 
        value: "Penthouse", 
        label: "Luxury Penthouses", 
        meta: { usage: "Residential", listing: "Buy", segment: "Luxury", propertyType: "Penthouse" } 
      },
      { 
        value: "Villa-Elite", 
        label: "Exclusive Villas", 
        meta: { usage: "Residential", listing: "Buy", segment: "Luxury", propertyType: "Villa" } 
      }
    ]
  }
];




