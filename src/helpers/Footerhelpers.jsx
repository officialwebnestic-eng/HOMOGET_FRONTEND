 
 
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
    { name: "Buy Properties", href: "/buy" },
    { name: "Sell Property", href: "/sell" },
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