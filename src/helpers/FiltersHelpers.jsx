  // The specific filter fields requested
  
  
  import {
  MapPin, Bed, Ruler,  Home, IndianRupee, Bath,
  Barcode, Wrench, Building2

} from "lucide-react";
  
  export const filterFields = [
    { name: "state", label: "Location", icon: <MapPin size={14} /> },
    { name: "listingtype", label: "Category", icon: <Building2 size={14} /> },
    { name: "propertytype", label: "Type", icon: <Home size={14} /> },
    { name: "price", label: "Price", icon: <IndianRupee size={14} /> },
    { name: "squarefoot", label: "Area", icon: <Ruler size={14} /> },
    { name: "bedroom", label: "Beds", icon: <Bed size={14} /> },
    { name: "bathroom", label: "Baths", icon: <Bath size={14} /> },
    { name: "floor", label: "Floor", icon: <Barcode size={14} /> },
    { name: "city", label: "City", icon: <MapPin size={14} /> },
    { name: "aminities", label: "Amenities", icon: <Wrench size={14} /> },
  ];