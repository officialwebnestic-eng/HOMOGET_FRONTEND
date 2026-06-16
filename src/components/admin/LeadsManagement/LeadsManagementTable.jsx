// LeadsManagementTable.jsx
import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Star,
  MoreVertical,
  Send,
  RefreshCw
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const LeadsManagementTable = ({ isDark = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const itemsPerPage = 10;

  // Random Lead Data with Property & Agent Information
  const leadsData = [
    {
      id: 1,
      leadName: "Ahmed Al Mansouri",
      leadPhone: "+971 50 123 4567",
      leadEmail: "ahmed@example.com",
      leadLocation: "Downtown Dubai",
      status: "replied",
      statusColor: "green",
      date: "2024-01-15",
      property: {
        title: "Luxury Penthouse with Burj View",
        type: "Penthouse",
        price: "AED 3,500,000",
        area: "2,500 sqft",
        bedrooms: 3,
        bathrooms: 4,
        location: "Burj Khalifa Area",
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=100"
      },
      agent: {
        name: "Sarah Johnson",
        phone: "+971 55 987 6543",
        email: "sarah@homoget.com",
        avatar: "SJ",
        rating: 4.9
      },
      lastContact: "2024-01-16",
      notes: "Interested in viewing this weekend",
      inquiryType: "buying"
    },
    {
      id: 2,
      leadName: "Fatima Al Qasimi",
      leadPhone: "+971 56 234 5678",
      leadEmail: "fatima@example.com",
      leadLocation: "Dubai Marina",
      status: "pending",
      statusColor: "yellow",
      date: "2024-01-16",
      property: {
        title: "Modern Villa with Private Pool",
        type: "Villa",
        price: "AED 5,200,000",
        area: "4,200 sqft",
        bedrooms: 5,
        bathrooms: 6,
        location: "Emirates Hills",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100"
      },
      agent: {
        name: "Mohammed Rashed",
        phone: "+971 50 876 5432",
        email: "mohammed@homoget.com",
        avatar: "MR",
        rating: 4.8
      },
      lastContact: "2024-01-16",
      notes: "Requested callback for mortgage info",
      inquiryType: "mortgage"
    },
    {
      id: 3,
      leadName: "John Smith",
      leadPhone: "+971 58 345 6789",
      leadEmail: "john@example.com",
      leadLocation: "Palm Jumeirah",
      status: "replied",
      statusColor: "green",
      date: "2024-01-14",
      property: {
        title: "Beachfront Apartment",
        type: "Apartment",
        price: "AED 2,800,000",
        area: "1,800 sqft",
        bedrooms: 2,
        bathrooms: 3,
        location: "JBR",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100"
      },
      agent: {
        name: "Sarah Johnson",
        phone: "+971 55 987 6543",
        email: "sarah@homoget.com",
        avatar: "SJ",
        rating: 4.9
      },
      lastContact: "2024-01-15",
      notes: "Scheduled viewing for Friday",
      inquiryType: "renting"
    },
    {
      id: 4,
      leadName: "Priya Sharma",
      leadPhone: "+971 52 456 7890",
      leadEmail: "priya@example.com",
      leadLocation: "Business Bay",
      status: "no_reply",
      statusColor: "red",
      date: "2024-01-13",
      property: {
        title: "Office Space in Prime Location",
        type: "Commercial",
        price: "AED 1,500,000",
        area: "1,200 sqft",
        bedrooms: 0,
        bathrooms: 2,
        location: "DIFC",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100"
      },
      agent: {
        name: "Ahmed Hassan",
        phone: "+971 55 765 4321",
        email: "ahmed@homoget.com",
        avatar: "AH",
        rating: 4.7
      },
      lastContact: "2024-01-13",
      notes: "Left voicemail, waiting for callback",
      inquiryType: "commercial"
    },
    {
    id: 5, 
      leadName: "Omar Al Hadid",
      leadPhone: "+971 54 567 8901",
      leadEmail: "omar@example.com",
      leadLocation: "Jumeirah",
      status: "replied",
      statusColor: "green",
      date: "2024-01-12",
      property: {
        title: "Luxury Townhouse with Garden",
        type: "Townhouse",
        price: "AED 3,200,000",
        area: "2,800 sqft",
        bedrooms: 4,
        bathrooms: 4,
        location: "Jumeirah Golf Estates",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=100"
      },
      agent: {
        name: "Mohammed Rashed",
        phone: "+971 50 876 5432",
        email: "mohammed@homoget.com",
        avatar: "MR",
        rating: 4.8
      },
      lastContact: "2024-01-14",
      notes: "Very interested, wants to negotiate price",
      inquiryType: "buying"
    },
    {
      id: 6,
      leadName: "Elena Petrova",
      leadPhone: "+971 50 678 9012",
      leadEmail: "elena@example.com",
      leadLocation: "Dubai Hills",
      status: "pending",
      statusColor: "yellow",
      date: "2024-01-11",
      property: {
        title: "Golf Course View Apartment",
        type: "Apartment",
        price: "AED 1,900,000",
        area: "1,500 sqft",
        bedrooms: 2,
        bathrooms: 2,
        location: "Dubai Hills Estate",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100"
      },
      agent: {
        name: "Sarah Johnson",
        phone: "+971 55 987 6543",
        email: "sarah@homoget.com",
        avatar: "SJ",
        rating: 4.9
      },
      lastContact: "2024-01-12",
      notes: "Will call back tomorrow",
      inquiryType: "renting"
    },
    {
      id: 7,
      leadName: "David Chen",
      leadPhone: "+971 58 789 0123",
      leadEmail: "david@example.com",
      leadLocation: "Al Barsha",
      status: "replied",
      statusColor: "green",
      date: "2024-01-10",
      property: {
        title: "Cozy Studio Near Metro",
        type: "Studio",
        price: "AED 650,000",
        area: "450 sqft",
        bedrooms: 0,
        bathrooms: 1,
        location: "Al Barsha South",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100"
      },
      agent: {
        name: "Ahmed Hassan",
        phone: "+971 55 765 4321",
        email: "ahmed@homoget.com",
        avatar: "AH",
        rating: 4.7
      },
      lastContact: "2024-01-11",
      notes: "First-time buyer, needs guidance",
      inquiryType: "buying"
    },
    {
      id: 8,
      leadName: "Layla Khoury",
      leadPhone: "+971 56 890 1234",
      leadEmail: "layla@example.com",
      leadLocation: "Mirdif",
      status: "no_reply",
      statusColor: "red",
      date: "2024-01-09",
      property: {
        title: "Spacious Family Villa",
        type: "Villa",
        price: "AED 4,500,000",
        area: "3,800 sqft",
        bedrooms: 6,
        bathrooms: 5,
        location: "Mirdif",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100"
      },
      agent: {
        name: "Mohammed Rashed",
        phone: "+971 50 876 5432",
        email: "mohammed@homoget.com",
        avatar: "MR",
        rating: 4.8
      },
      lastContact: "2024-01-09",
      notes: "Called twice, no answer",
      inquiryType: "selling"
    },
    {
      id: 9,
      leadName: "Ryan Wilson",
      leadPhone: "+971 52 901 2345",
      leadEmail: "ryan@example.com",
      leadLocation: "Dubai South",
      status: "pending",
      statusColor: "yellow",
      date: "2024-01-08",
      property: {
        title: "Investment Opportunity",
        type: "Apartment",
        price: "AED 850,000",
        area: "950 sqft",
        bedrooms: 1,
        bathrooms: 2,
        location: "Dubai South",
        image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=100"
      },
      agent: {
        name: "Sarah Johnson",
        phone: "+971 55 987 6543",
        email: "sarah@homoget.com",
        avatar: "SJ",
        rating: 4.9
      },
      lastContact: "2024-01-10",
      notes: "Sent documents, awaiting signature",
      inquiryType: "investment"
    },
    {
      id: 10,
      leadName: "Nadia Al Suwaidi",
      leadPhone: "+971 54 012 3456",
      leadEmail: "nadia@example.com",
      leadLocation: "Abu Dhabi",
      status: "replied",
      statusColor: "green",
      date: "2024-01-07",
      property: {
        title: "Waterfront Luxury Apartment",
        type: "Penthouse",
        price: "AED 6,800,000",
        area: "3,200 sqft",
        bedrooms: 4,
        bathrooms: 5,
        location: "Saadiyat Island",
        image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=100"
      },
      agent: {
        name: "Ahmed Hassan",
        phone: "+971 55 765 4321",
        email: "ahmed@homoget.com",
        avatar: "AH",
        rating: 4.7
      },
      lastContact: "2024-01-09",
      notes: "Pre-approved for mortgage",
      inquiryType: "buying"
    }
  ];

  // Filter and sort data
  const filteredData = leadsData.filter(lead => {
    const matchesSearch = 
      lead.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.leadPhone.includes(searchTerm) ||
      lead.leadEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'date') {
      aVal = new Date(a.date);
      bVal = new Date(b.date);
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status, statusColor) => {
    const config = {
      replied: { icon: <CheckCircle size={12} />, text: 'Replied', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
      pending: { icon: <Clock size={12} />, text: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
      no_reply: { icon: <XCircle size={12} />, text: 'No Reply', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
    };
    const statusConfig = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${statusConfig.color}`}>
        {statusConfig.icon}
        {statusConfig.text}
      </span>
    );
  };

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-zinc-900/50' : 'bg-white'} shadow-xl`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Leads Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Total Leads: {leadsData.length} | Replied: {leadsData.filter(l => l.status === 'replied').length} | Pending: {leadsData.filter(l => l.status === 'pending').length}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all">
            <Download size={18} />
          </button>
          <button className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email, property or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
              isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <option value="all">All Status</option>
          <option value="replied">Replied</option>
          <option value="pending">Pending</option>
          <option value="no_reply">No Reply</option>
        </select>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
            <tr>
              <th className="text-left py-3 px-3">
                <button onClick={() => handleSort('leadName')} className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400">
                  Lead Info <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="text-left py-3 px-3">
                <button onClick={() => handleSort('property')} className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400">
                  Property Details <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="text-left py-3 px-3">
                <button onClick={() => handleSort('agent')} className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400">
                  Agent <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="text-left py-3 px-3">
                <button onClick={() => handleSort('status')} className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400">
                  Status <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="text-left py-3 px-3">
                <button onClick={() => handleSort('date')} className="flex items-center gap-1 text-xs font-bold uppercase text-slate-400">
                  Date <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="text-left py-3 px-3 text-xs font-bold uppercase text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((lead) => (
              <tr key={lead.id} className={`border-b ${isDark ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                {/* Lead Info */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <User size={14} className="text-amber-500" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{lead.leadName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Phone size={10} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400">{lead.leadPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Mail size={10} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{lead.leadEmail}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-slate-400" />
                        <span className="text-[9px] text-slate-500">{lead.leadLocation}</span>
                      </div>
                    </div>
                  </div>
                </td>
                
                {/* Property Info */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <img src={lead.property.image} alt={lead.property.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'} max-w-[200px] truncate`}>
                        {lead.property.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Home size={10} className="text-amber-500" />
                        <span className="text-[9px] text-slate-400">{lead.property.type}</span>
                        <span className="text-[9px] text-slate-400">•</span>
                        <DollarSign size={10} className="text-amber-500" />
                        <span className="text-[9px] text-slate-400">{lead.property.price}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={9} className="text-slate-400" />
                        <span className="text-[8px] text-slate-500">{lead.property.location}</span>
                      </div>
                      <p className="text-[8px] text-slate-400 mt-1 truncate max-w-[200px]">{lead.notes}</p>
                    </div>
                  </div>
                </td>
                
                {/* Agent Info */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      {lead.agent.avatar}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{lead.agent.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] text-slate-400">{lead.agent.rating}</span>
                      </div>
                      <button className="text-[9px] text-amber-500 hover:underline mt-0.5">
                        {lead.agent.phone}
                      </button>
                    </div>
                  </div>
                </td>
                
                {/* Status */}
                <td className="py-3 px-3">
                  {getStatusBadge(lead.status, lead.statusColor)}
                  <p className="text-[9px] text-slate-400 mt-1">
                    Last: {lead.lastContact}
                  </p>
                </td>
                
                {/* Date */}
                <td className="py-3 px-3">
                  <span className="text-xs text-slate-400">{lead.date}</span>
                </td>
                
                {/* Actions */}
                <td className="py-3 px-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all" title="Call">
                      <Phone size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all" title="Email">
                      <Mail size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg bg-green-600/10 text-green-600 hover:bg-green-600/20 transition-all" title="WhatsApp">
                      <FaWhatsapp size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all" title="Send Message">
                      <Send size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {paginatedData.map((lead) => (
          <div key={lead.id} className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}>
            {/* Lead Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <User size={16} className="text-amber-500" />
                </div>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{lead.leadName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Phone size={10} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400">{lead.leadPhone}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(lead.status, lead.statusColor)}
            </div>
            
            {/* Property Info */}
            <div className="flex gap-3 mb-3">
              <img src={lead.property.image} alt={lead.property.title} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{lead.property.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Home size={10} className="text-amber-500" />
                  <span className="text-[9px] text-slate-400">{lead.property.type}</span>
                  <DollarSign size={10} className="text-amber-500" />
                  <span className="text-[9px] text-slate-400">{lead.property.price}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={9} className="text-slate-400" />
                  <span className="text-[8px] text-slate-500">{lead.property.location}</span>
                </div>
              </div>
            </div>
            
            {/* Agent Info */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-[8px] font-bold">
                  {lead.agent.avatar}
                </div>
                <span className={`text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{lead.agent.name}</span>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg bg-green-500/10 text-green-500" title="Call">
                  <Phone size={12} />
                </button>
                <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500" title="Email">
                  <Mail size={12} />
                </button>
                <button className="p-1.5 rounded-lg bg-green-600/10 text-green-600" title="WhatsApp">
                  <FaWhatsapp size={12} />
                </button>
              </div>
            </div>
            
            <p className="text-[9px] text-slate-400 mt-2">{lead.notes}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
          <p className="text-xs text-slate-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} leads
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 rounded-lg bg-amber-500 text-black text-sm font-bold">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManagementTable;