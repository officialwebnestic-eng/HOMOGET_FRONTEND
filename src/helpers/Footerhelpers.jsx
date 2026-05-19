 
 
 import {
   Mail, Send, MapPin, Phone, ChevronRight, 
   Instagram, Linkedin, Facebook, Youtube, 
   ExternalLink, ShieldCheck, BadgeCheck, Building2,
   ArrowUpRight, Globe,
   ExternalLinkIcon
 } from "lucide-react";
 
 
    export  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/homogetfinder?igsh=NW52M3NyZGJheHk1" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/homogetfinder?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/share/1GZAg56QKe/" },
    {name:"tiktok", icon: ExternalLinkIcon, href: "https://www.tiktok.com/@homogetfinder?_t=ZS-90tTSGVAMq2&_r=1"},
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@homogetfinder?si=YS78-D4xhRjh3xpZ" }
  ];

   export  const discoverLinks = [
    { name: "Buy ", href: "/buy" },
    { name: "Rent", href: "/rent" },
    { name: "Off-Plan", href: "/off-plan" },
    { name: "Mortgage", href: "/mortgage" },
    { name: "Property Listing", href: "/propertylisting" },
    { name: "Find Agent", href: "/agents" },
    { name: "Find Developer", href: "/developers" },
    { name: "Contact", href: "/contact" },
  ];

  export const companyLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "Blog", href: "/blog" },
    { name: "Market News", href: "/news" },
    { name: "Help Center", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "RERA Compliance", href: "/rera-compliance" },
  ];

  export const resourcesLinks = [
    { name: "Market News", href: "/news" },
    { name: "Help Center", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "RERA Compliance", href: "/rera-compliance" },
  ];

  export const discoverLinksNew = [
    { name: "Residential", href: "/propertylisting?category=Residential" },
    { name: "Rent Homes", href: "/rent" },
    { name: "Off-Plan Projects", href: "/off-plan" }
  ];    

  export const complianceItems = [
    { 
      label: "RERA Licensed", 
      value: "Registration: 52933", 
      icon: ShieldCheck, 
      color: "text-emerald-500" 
    },
    { 
      label: "DLD Compliance", 
      value: "Trakheesi: 78910", 
      icon: BadgeCheck, 
      color: "text-blue-500" 
    },
    { 
      label: "Headquarters", 
      value: "Bur Dubai, UAE", 
      icon: Globe, 
      color: "text-amber-500" 
    }
  ];