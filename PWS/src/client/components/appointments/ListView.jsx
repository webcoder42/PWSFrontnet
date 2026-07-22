import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useClientAppointments, useUpdateAppointmentStatus } from '../../hooks/useClientQueries';

const ListView = ({ onBookNew, onReschedule, onViewDetails }) => {
  const { user } = useUser();
  const uId = user?._id || user?.id;
  const { data: appointments = [], isLoading: loading, error: fetchError } = useClientAppointments(uId);
  const updateStatusMutation = useUpdateAppointmentStatus();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppt, setSelectedAppt] = useState(null);

  const handleMarkAsComplete = async (apptId) => {
    try {
      await updateStatusMutation.mutateAsync({ appointmentId: apptId, status: 'completed' });
      if (selectedAppt && selectedAppt._id === apptId) {
        setSelectedAppt(prev => ({ ...prev, status: 'completed' }));
      }
    } catch (err) {
      console.error('Failed to mark appointment as complete:', err);
      alert(err.message || 'Failed to complete appointment');
    }
  };

  const normalizeStatus = (status) => String(status || '').toLowerCase().trim();

  const getSortableDateTime = (dateStr, timeStr) => {
    try {
      if (!dateStr || dateStr.toLowerCase().includes('pending')) {
        return new Date(0);
      }
      let cleanDateStr = dateStr;
      if (dateStr.includes(',')) {
        const parts = dateStr.split(',');
        if (parts.length >= 2) cleanDateStr = parts.slice(1).join(',').trim();
      }
      const currentYear = new Date().getFullYear();
      let parseableDateStr = cleanDateStr;
      if (!cleanDateStr.match(/\d{4}/)) {
        parseableDateStr = `${cleanDateStr}, ${currentYear}`;
      }
      const parsedDate = new Date(parseableDateStr);
      if (isNaN(parsedDate.getTime())) return new Date(0);
      let hours = 12;
      if (timeStr) {
        const tLower = timeStr.toLowerCase().trim();
        if (tLower === 'morning') hours = 9;
        else if (tLower === 'afternoon') hours = 12;
        else if (tLower === 'evening') hours = 18;
      }
      parsedDate.setHours(hours, 0, 0, 0);
      return parsedDate;
    } catch {
      return new Date(0);
    }
  };

  const getStatusStyles = (status) => {
    switch (normalizeStatus(status)) {
      case 'completed':
        return {
          badgeBg: 'bg-emerald-50/30',
          dotColor: 'bg-emerald-500',
          textColor: 'text-emerald-600',
          label: 'Completed Session',
          borderColor: 'hover:border-emerald-200'
        };
      case 'cancelled':
        return {
          badgeBg: 'bg-rose-50/30',
          dotColor: 'bg-rose-500',
          textColor: 'text-rose-600',
          label: 'Cancelled Session',
          borderColor: 'hover:border-rose-200'
        };
      case 'confirmed':
        return {
          badgeBg: 'bg-purple-50/30',
          dotColor: 'bg-purple-500',
          textColor: 'text-purple-600',
          label: 'Confirmed Visitor',
          borderColor: 'hover:border-purple-200'
        };
      case 'pending':
      default:
        return {
          badgeBg: 'bg-orange-50/30',
          dotColor: 'bg-orange-400',
          textColor: 'text-orange-500',
          label: 'Pending Request',
          borderColor: 'hover:border-orange-200'
        };
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    // 1. Filter by search query
    const pswName = appt.pswId ? `${appt.pswId.firstName} ${appt.pswId.lastName}`.toLowerCase() : '';
    const serviceName = (appt.service || '').toLowerCase();
    const dateStr = (appt.date || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = pswName.includes(query) || serviceName.includes(query) || dateStr.includes(query);

    if (!matchesSearch) return false;

    // 2. Filter by tab
    if (activeTab === 'All') return true;
    const s = normalizeStatus(appt.status);
    if (activeTab === 'Upcoming') return s === 'pending' || s === 'confirmed';
    if (activeTab === 'Completed') return s === 'completed';
    if (activeTab === 'Cancelled') return s === 'cancelled';
    return true;
  });

  const upcomingAppointments = filteredAppointments.filter(appt => {
    const s = normalizeStatus(appt.status);
    return s === 'pending' || s === 'confirmed';
  });

  const historyAppointments = [...filteredAppointments.filter(appt => {
    const s = normalizeStatus(appt.status);
    if (activeTab === 'Completed') return s === 'completed';
    if (activeTab === 'Cancelled') return s === 'cancelled';
    return s === 'completed' || s === 'cancelled';
  })].sort((a, b) => {
    const dateA = getSortableDateTime(a.date, a.time);
    const dateB = getSortableDateTime(b.date, b.time);
    return dateB.getTime() - dateA.getTime();
  });

  const showUpcoming = activeTab === 'All' || activeTab === 'Upcoming';
  const showHistory = activeTab === 'All' || activeTab === 'Completed' || activeTab === 'Cancelled';

  const historySectionTitle =
    activeTab === 'Completed' ? 'Completed Sessions' :
    activeTab === 'Cancelled' ? 'Cancelled Sessions' :
    'Historical Archive';

  const historyEmptyMessage =
    activeTab === 'Completed' ? 'No completed sessions found' :
    activeTab === 'Cancelled' ? 'No cancelled sessions found' :
    'No historical care records found';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading appointments...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-10 text-center bg-red-50/50 border border-red-100 text-red-600 rounded-[2.5rem] my-10 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-red-100/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <p className="font-bold text-lg mb-2">Error loading appointments</p>
        <p className="text-sm mb-6 text-red-500/80">{fetchError.message || 'Failed to load appointments'}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-700 transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20 overflow-x-hidden">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Appointments</h2>
          <div className="flex items-center text-gray-400 bg-white px-4 py-2 rounded-2xl border border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-fit">
            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Manage Scheduled Care Visits</span>
          </div>
        </div>
        <button 
          onClick={onBookNew}
          className="bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white px-6 md:px-10 py-4 md:py-5 rounded-[1.5rem] font-bold flex items-center shadow-[0_20px_50px_rgba(89,21,189,0.15)] hover:shadow-[0_20px_50px_rgba(89,21,189,0.25)] hover:-translate-y-1 transition-all active:scale-[0.98] uppercase tracking-widest text-[11px]"
        >
          <span className="text-xl mr-3 font-normal">+</span> Book New Session
        </button>
      </div>

      {/* Filter Bar - Premium Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-md p-3 rounded-[2rem] border border-gray-50 mb-10 flex flex-col md:flex-row items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.02)] gap-4">
        <div className="flex bg-gray-50/50 p-1 rounded-2xl w-full md:w-auto">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-2 md:px-8 py-3 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest transition-all ${
                tab === activeTab ? 'bg-white text-purple-600 shadow-sm border border-gray-50' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
           <div className="relative flex-1 md:flex-none">
             <span className="absolute inset-y-0 left-0 pl-4 flex items-center pt-0.5 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, service or date..." 
                className="pl-10 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-[10px] font-bold tracking-tight w-full md:w-64 focus:ring-1 focus:ring-purple-200 outline-none transition-all" 
              />
           </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      {showUpcoming && (
      <div className="mb-16">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 ml-1">Live Tracking & Upcoming</h3>
        {upcomingAppointments.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.01)] text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            No upcoming sessions found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingAppointments.map((appt) => {
              const styles = getStatusStyles(appt.status);
              const pswName = appt.pswId ? `${appt.pswId.firstName} ${appt.pswId.lastName}` : 'Care Provider';
              const pswPhoto = appt.pswId?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pswName}`;
              
              return (
                <div 
                  key={appt._id} 
                  className={`bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group transition-all cursor-pointer ${styles.borderColor}`} 
                  onClick={() => setSelectedAppt(appt)}
                >
                   <div className={`absolute top-0 right-0 w-24 h-24 ${styles.badgeBg} rounded-bl-[100%]`}></div>
                   <div className="flex items-center mb-8 relative">
                      <img src={pswPhoto} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md shrink-0 group-hover:scale-105 transition-transform" alt={pswName} />
                      <div className="ml-5">
                         <h4 className="font-bold text-gray-900 text-lg leading-none mb-1.5">{pswName}</h4>
                         <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full ${styles.dotColor} mr-2 shadow-[0_0_10px_rgba(124,58,237,0.3)]`}></span>
                            <p className={`text-[9px] ${styles.textColor} font-bold uppercase tracking-widest`}>{styles.label}</p>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-5 mb-10">
                      <div className="flex items-center text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-25">
                         <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-purple-600 mr-4 shadow-xs">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                         </div>
                         <span className="text-[11px] font-bold text-gray-700">{appt.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-25">
                         <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-purple-600 mr-4 shadow-xs">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                         </div>
                         <span className="text-[11px] font-bold text-gray-700">{appt.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 bg-gray-50/50 p-3 rounded-2xl border border-gray-25">
                         <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-purple-600 mr-4 shadow-xs">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012-2v2M7 7h10"/></svg>
                         </div>
                         <span className="text-[11px] font-bold text-gray-700">{appt.service} ({appt.duration})</span>
                      </div>
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setSelectedAppt(appt); }} 
                     className="w-full py-5 bg-gradient-to-r from-[#5915BD]/5 to-[#7C3AED]/5 text-purple-600 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center rounded-2xl hover:from-[#5915BD] hover:to-[#7C3AED] hover:text-white hover:shadow-xl hover:shadow-purple-100 transition-all"
                   >
                      Manage Session <svg className="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                   </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* Past Appointments Section */}
      {showHistory && (
      <div>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 ml-1">{historySectionTitle}</h3>
        {historyAppointments.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.01)] text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            {historyEmptyMessage}
          </div>
        ) : (
          <div className="space-y-4 bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            {historyAppointments.map((past) => {
              const pswName = past.pswId ? `${past.pswId.firstName} ${past.pswId.lastName}` : 'Care Provider';
              const isCompleted = normalizeStatus(past.status) === 'completed';
              
              return (
                <div 
                  key={past._id} 
                  onClick={() => setSelectedAppt(past)} 
                  className="bg-white p-6 rounded-[1.75rem] border border-gray-50 flex flex-col md:flex-row items-start md:items-center group hover:shadow-lg hover:shadow-gray-200/20 transition-all cursor-pointer gap-6"
                >
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{pswName} <span className="text-gray-300 mx-2">·</span> <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-sans">{past.service}</span></h4>
                      <p className="text-[10px] text-gray-400 font-medium tracking-tight font-sans">{past.date} @ {past.time}</p>
                   </div>
                   <div className="flex items-center justify-between w-full md:w-auto md:space-x-10">
                      <div className="flex items-center">
                         <div className={`w-1.5 h-1.5 rounded-full mr-3 ${isCompleted ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                         <span className={`text-[9px] font-bold uppercase tracking-widest ${isCompleted ? 'text-emerald-600' : 'text-red-500'}`}>{normalizeStatus(past.status)}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedAppt(past); }} 
                        className="p-3 text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                      </button>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedAppt(null)}
          ></div>

          {/* Modal Container */}
          <div className="bg-white/95 backdrop-blur-lg rounded-[2.5rem] p-8 md:p-10 border border-gray-150/20 shadow-2xl relative w-full max-w-lg z-10 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedAppt(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            {/* Caregiver Profile Info */}
            <div className="flex items-center mb-8 pb-6 border-b border-gray-100">
              <img 
                src={selectedAppt.pswId?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAppt.pswId?.firstName || 'Care'}`} 
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md shrink-0" 
                alt="Caregiver" 
              />
              <div className="ml-5">
                <p className="text-purple-600 text-[10px] font-bold uppercase tracking-widest mb-1">Your Caregiver</p>
                <h4 className="font-bold text-gray-900 text-2xl tracking-tight leading-none mb-1.5">
                  {selectedAppt.pswId ? `${selectedAppt.pswId.firstName} ${selectedAppt.pswId.lastName}` : 'Care Provider'}
                </h4>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full ${
                    normalizeStatus(selectedAppt.status) === 'completed' ? 'bg-emerald-500' :
                    normalizeStatus(selectedAppt.status) === 'cancelled' ? 'bg-rose-500' :
                    normalizeStatus(selectedAppt.status) === 'confirmed' ? 'bg-purple-500' : 'bg-orange-400'
                  } mr-2 shadow-xs`}></span>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    Status: <span className={
                      normalizeStatus(selectedAppt.status) === 'completed' ? 'text-emerald-600' :
                      normalizeStatus(selectedAppt.status) === 'cancelled' ? 'text-rose-600' :
                      normalizeStatus(selectedAppt.status) === 'confirmed' ? 'text-purple-600' : 'text-orange-500'
                    }>{normalizeStatus(selectedAppt.status)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Visit Details */}
            <div className="space-y-5 mb-8">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visit Summary</h5>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-25 flex flex-col">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Service Type</span>
                  <span className="text-sm font-bold text-gray-800">{selectedAppt.service}</span>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-25 flex flex-col">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Duration</span>
                  <span className="text-sm font-bold text-gray-800">{selectedAppt.duration || '1 hour'}</span>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-25 flex flex-col">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date</span>
                  <span className="text-sm font-bold text-gray-800">{selectedAppt.date}</span>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-25 flex flex-col">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Time Window</span>
                  <span className="text-sm font-bold text-gray-800">{selectedAppt.time}</span>
                </div>
              </div>

              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-25 flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Location</span>
                <span className="text-sm font-bold text-gray-800">{selectedAppt.location || 'Client Home'}</span>
              </div>

              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-25 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total Amount</span>
                  <span className="text-[9px] text-gray-400 font-medium">Processed via Stripe</span>
                </div>
                <span className="text-xl font-black text-gray-900">${Number(selectedAppt.price || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedAppt(null)} 
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold text-[11px] uppercase tracking-widest rounded-2xl transition-all"
              >
                Close
              </button>
              
              {/* Only show Mark as Complete if status is confirmed */}
              {normalizeStatus(selectedAppt.status) === 'confirmed' && (
                <button 
                  onClick={() => handleMarkAsComplete(selectedAppt._id)} 
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListView;
