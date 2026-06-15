import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { getAppointmentsByUserAPI } from '../../../utils/api';
import { useLiveDataRefresh } from '../../../hooks/useLiveDataRefresh';

const StarMini = ({ value }) => (
  <span className="text-amber-400 text-xs tracking-tight">
    {'★'.repeat(Math.min(5, Math.max(0, value)))}
    <span className="text-gray-200">{'★'.repeat(5 - Math.min(5, Math.max(0, value)))}</span>
  </span>
);

const ListView = ({ onBookNew, onReschedule, onViewDetails, refreshKey = 0 }) => {
  const { rawUser, profile } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAppointments = useCallback(async () => {
    try {
      const uId = rawUser?._id || rawUser?.id || profile?.id || '5f8d04b3b54764421b7156c0';
      const response = await getAppointmentsByUserAPI(uId);
      if (response.success) {
        setAppointments(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [rawUser?._id, rawUser?.id, profile?.id]);

  useEffect(() => {
    setLoading(true);
    fetchAppointments();
  }, [fetchAppointments, refreshKey]);

  useLiveDataRefresh(fetchAppointments);

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
    const pswName = appt.pswId 
      ? (typeof appt.pswId === 'object' 
         ? `${appt.pswId.firstName || ''} ${appt.pswId.lastName || ''}`.toLowerCase() 
         : '')
      : '';
    const serviceName = (appt.service || '').toLowerCase();
    const dateStr = (appt.date || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = pswName.includes(query) || serviceName.includes(query) || dateStr.includes(query);

    if (!matchesSearch) return false;

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

  if (error) {
    return (
      <div className="p-10 text-center bg-red-50/50 border border-red-100 text-red-600 rounded-[2.5rem] my-10 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-red-100/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <p className="font-bold text-lg mb-2">Error loading appointments</p>
        <p className="text-sm mb-6 text-red-500/80">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-700 transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Appointments</h2>
          <div className="flex items-center text-gray-400 bg-white px-4 py-2 rounded-2xl border border-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-fit">
            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Manage Scheduled Care Visits</span>
          </div>
        </div>
        <button 
          onClick={onBookNew}
          className="bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white px-10 py-5 rounded-[1.5rem] font-bold flex items-center shadow-[0_20px_50px_rgba(89,21,189,0.15)] hover:shadow-[0_20px_50px_rgba(89,21,189,0.25)] hover:-translate-y-1 transition-all active:scale-[0.98] uppercase tracking-widest text-[11px]"
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
              className={`flex-1 md:flex-none px-8 py-3 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest transition-all ${
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
              const pswName = appt.pswId 
                ? (typeof appt.pswId === 'object' 
                   ? `${appt.pswId.firstName || ''} ${appt.pswId.lastName || ''}`.trim() 
                   : 'Care Provider')
                : 'Care Provider';
              const pswPhoto = appt.pswId?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pswName}`;
              
              return (
                <div 
                  key={appt._id} 
                  className={`bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group transition-all cursor-pointer ${styles.borderColor}`} 
                  onClick={() => onViewDetails(appt)}
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
                     onClick={(e) => { e.stopPropagation(); onViewDetails(appt); }} 
                     className="w-full py-5 bg-gradient-to-r from-[#5915BD]/5 to-[#7C3AED]/5 text-purple-600 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center rounded-2xl hover:from-[#5915BD] hover:to-[#7C3AED] hover:text-white hover:shadow-xl hover:shadow-purple-100 transition-all"
                   >
                      View Details <svg className="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
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
              const pswName = past.pswId 
                ? (typeof past.pswId === 'object' 
                   ? `${past.pswId.firstName || ''} ${past.pswId.lastName || ''}`.trim() 
                   : 'Care Provider')
                : 'Care Provider';
              const isCompleted = normalizeStatus(past.status) === 'completed';
              
              return (
                <div 
                  key={past._id} 
                  onClick={() => onViewDetails(past)} 
                  className="bg-white p-6 rounded-[1.75rem] border border-gray-50 flex flex-col md:flex-row items-start md:items-center group hover:shadow-lg hover:shadow-gray-200/20 transition-all cursor-pointer gap-6"
                >
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{pswName} <span className="text-gray-300 mx-2">·</span> <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-sans">{past.service}</span></h4>
                      <p className="text-[10px] text-gray-400 font-medium tracking-tight font-sans">{past.date} @ {past.time}</p>
                      {isCompleted && Number(past.rating) >= 1 && (
                        <div className="mt-2 flex items-center gap-2">
                          <StarMini value={Number(past.rating)} />
                          {past.comment ? (
                            <span className="text-[10px] text-gray-500 italic truncate max-w-[200px]">&ldquo;{past.comment}&rdquo;</span>
                          ) : null}
                        </div>
                      )}
                      {isCompleted && (!past.rating || Number(past.rating) < 1) && (
                        <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-purple-600">Submit your rating</p>
                      )}
                   </div>
                   <div className="flex items-center justify-between w-full md:w-auto md:space-x-10">
                      <div className="flex items-center">
                         <div className={`w-1.5 h-1.5 rounded-full mr-3 ${isCompleted ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                         <span className={`text-[9px] font-bold uppercase tracking-widest ${isCompleted ? 'text-emerald-600' : 'text-red-500'}`}>{normalizeStatus(past.status)}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onViewDetails(past); }} 
                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all"
                      >
                        View Details
                      </button>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default ListView;
