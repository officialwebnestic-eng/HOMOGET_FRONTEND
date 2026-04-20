import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  ArrowLeft,
  Navigation,
  CalendarCheck,
  FileText,
  MoveUpRight,
  ShieldCheck,
  Loader2,
  Phone,
  Mail,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import AmenitiesSection from "../../common/homecommon/AmenitiesSection.jsx";
import { http } from "../../../axios/axios";
import { toast } from "react-toastify";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const lastIdRef = useRef(null);

  const [property, setProperty] = useState(
    location.state?.propertyData || null,
  );
  const [loading, setLoading] = useState(!location.state?.propertyData);

  useEffect(() => {
    const fetchProperty = async () => {
      if (
        property &&
        property._id === id &&
        typeof property.agentId === "object"
      ) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await http.get(`/getpropertybyid/${id}`);
        if (response.data.success) {
          setProperty(response.data.data);
        }
      } catch (error) {
        toast.error("Error synchronizing asset data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      if (lastIdRef.current !== id) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        lastIdRef.current = id;
      }
      fetchProperty();
    }
  }, [id]);

  const formatPrice = (price, unit) => {
    const num = Number(price);
    if (isNaN(num)) return "On Request";
    let val =
      num >= 10000000
        ? `${(num / 10000000).toFixed(2)} Cr`
        : num >= 100000
          ? `${(num / 100000).toFixed(2)} Lac`
          : num.toLocaleString("en-IN");
    return `₹${val} ${unit && unit !== "Total Amount" ? `/ ${unit}` : ""}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-amber-500" size={30} />
      </div>
    );

  if (!property) return null;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-[#050505] text-white" : "bg-white text-black"}`}
    >
      {/* 1. ARCHITECTURAL HERO (Visual Only) */}
      <section className="relative w-full h-[75vh] bg-black overflow-hidden">
        <img
          src={property.image?.[0]}
          className="w-full h-full object-cover opacity-70 scale-105"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-10 z-20 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-amber-500 transition-all"
        >
          <ArrowLeft size={14} /> Back to Collection
        </button>

        <div className="absolute bottom-12 left-10 md:left-20">
          <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.5em] mb-3 block">
            Ref. {property._id?.slice(-8).toUpperCase()}
          </span>
          <h1 className="text-4xl md:text-6xl font-light uppercase tracking-tighter italic leading-none">
            {property.propertyname}
          </h1>
        </div>
      </section>

      {/* 2. PERSISTENT TRANSACTION BAR */}
      <div className="sticky top-0 z-40 border-y border-zinc-500/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-[1440px] mx-auto px-10 py-6 flex flex-wrap justify-between items-center gap-6">
          <div className="flex gap-12">
            <div>
              <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                Valuation
              </p>
              <p className="text-xl font-bold text-amber-500">
                {formatPrice(property.price, property.priceUnit)}
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                Status
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest">
                {property.propertystatus || "Available"}
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              navigate(`/bookings/${id}`, { state: { propertyData: property } })
            }
            className="bg-amber-500 text-black px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-2xl flex items-center gap-3"
          >
            <CalendarCheck size={14} /> Initiate Booking
          </button>
        </div>
      </div>

      {/* 3. CORE CONTENT GRID */}
      <main className="max-w-[1440px] mx-auto px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-32">
          {/* Narrative */}
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 mb-10 flex items-center gap-2">
              <FileText size={12} /> Property Manifesto
            </h3>
            <p className="text-xl md:text-2xl font-light italic leading-relaxed text-zinc-400 max-w-3xl">
              {property.description}
            </p>
          </section>

          {/* Technical Specs */}
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 mb-12 flex items-center gap-2">
              <ShieldCheck size={12} /> Technical Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
              <SpecItem label="Property Type" value={property.propertytype} />
              <SpecItem
                label="Asset Class"
                value={property.propertyAssetType}
              />
              <SpecItem
                label="Total Area"
                value={`${property.squarefoot} Sq.Ft`}
              />
              <SpecItem label="Corner Status" value={property.isCorner} />
              <SpecItem label="District" value={property.city} />
              <SpecItem
                label="Road Width"
                value={property.roadWidth ? `${property.roadWidth} Ft` : "N/A"}
              />
              <SpecItem label="Bedrooms" value={property.bedroom} />
              <SpecItem label="Bathrooms" value={property.bathroom} />
            </div>
          </section>

          {/* Ownership Verification */}
          <section className="p-12 border border-zinc-500/10 bg-zinc-500/5 rounded-[2rem]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 mb-10">
              Owner Authentication
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <SpecItem
                label="Legal Owner"
                value={property.ownerName || "Verified"}
              />
              <SpecItem
                label="Aadhar Verification"
                value={property.adharVerificationNo || "Secure"}
              />
              <div className="space-y-2">
                <p className="text-[8px] font-bold uppercase opacity-30 tracking-[0.2em]">
                  Title Deed / Khatuni
                </p>
                {property.khatuniDocument ? (
                  <a
                    href={property.khatuniDocument}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] flex items-center gap-2 font-black text-amber-500 hover:underline"
                  >
                    VIEW DOCUMENT <MoveUpRight size={10} />
                  </a>
                ) : (
                  <p className="text-[10px] text-zinc-500 font-bold">
                    NOT PROVIDED
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
        {/* RIGHT COLUMN (Agent Sidebar) */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-12">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">
                Representative
              </h4>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-zinc-900 rounded-full overflow-hidden border border-amber-500/20">
                  <img
                    src={property.agentId?.profilePhoto || ""}
                    className="w-full h-full object-cover grayscale"
                    alt="Agent"
                  />
                </div>
                <div>
                  <p className="text-xl font-bold uppercase tracking-tight">
                    {property.agentId?.name}
                  </p>
                  <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">
                    {property.agentId?.nationality} Expert
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-500/10">
                <ContactRow
                  icon={<Phone size={14} />}
                  value={property.agentId?.phone}
                />
                <ContactRow
                  icon={<Mail size={14} />}
                  value={property.agentId?.email}
                />
                <ContactRow
                  icon={<Globe size={14} />}
                  value={`${property.agentId?.city}, ${property.agentId?.state}`}
                />
              </div>
            </div>

            <div className="p-8 border border-amber-500/20 bg-amber-500/5 rounded-3xl">
              <p className="text-[8px] font-black uppercase tracking-widest text-amber-500 mb-2">
                Verified Agent
              </p>
              <p className="text-[11px] font-medium leading-relaxed opacity-60 italic">
                All legal documentation for this property has been pre-screened
                by our compliance team.
              </p>
            </div>
          </div>
        </aside>
      </main>

      {/* 4. GALLERY & AMENITIES */}
      {property.image?.length > 1 && (
        <section className="px-10 py-24 bg-zinc-500/5">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {property.image.slice(1, 3).map((img, i) => (
              <div
                key={i}
                className="aspect-video overflow-hidden border border-zinc-500/10"
              >
                <img
                  src={img}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                  alt="Detail"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {property.amenities?.length > 0 && (
        <section className="border-t border-zinc-500/10">
          <AmenitiesSection amenities={property.amenities} />
        </section>
      )}

      {/* 5. GEOSPATIAL MAP */}
      <section className="bg-black py-32">
        <div className="max-w-[1440px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">
              Geospatial Position
            </h3>
            <div className="space-y-2">
              <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
                Address
              </p>
              <p className="text-xl font-light italic text-zinc-300">
                {property.address}
              </p>
            </div>
            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`,
                  "_blank",
                )
              }
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white border-b border-amber-500/50 pb-2 hover:text-amber-500 transition-all"
            >
              <Navigation size={14} className="text-amber-500" /> Access Live
              Maps
            </button>
          </div>
          <div className="relative aspect-video bg-zinc-900 border border-white/5 overflow-hidden group cursor-crosshair">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-60 transition-opacity"
              alt="Map"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border border-amber-500 rounded-full animate-ping opacity-20" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- MINIMAL SUB-COMPONENTS ---

const SpecItem = ({ label, value, isVerified }) => {
  if (!value && value !== 0 && !isVerified) return null;
  return (
    <div className="space-y-1">
      <p className="text-[8px] font-bold uppercase opacity-30 tracking-[0.2em]">
        {label}
      </p>
      <p className="text-[12px] font-black uppercase tracking-tight text-zinc-300">
        {value}
      </p>
    </div>
  );
};

const ContactRow = ({ icon, value }) => (
  <div className="flex items-center gap-4 text-zinc-500 hover:text-white transition-colors cursor-pointer group">
    <span className="text-amber-500 group-hover:scale-110 transition-transform">
      {icon}
    </span>
    <span className="text-[11px] font-medium tracking-wide">
      {value || "Not Disclosed"}
    </span>
  </div>
);

export default PropertyDetailsPage;
