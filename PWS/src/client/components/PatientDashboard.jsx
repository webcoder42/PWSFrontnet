import React from 'react';
import { useUser } from '../context/UserContext';
import { useClientAppointments } from '../hooks/useClientQueries';

const PatientDashboard = ({ onNavigate }) => {
  const { user } = useUser();
  const uId = user?._id;
  const { data: appointments = [], isLoading: loading } = useClientAppointments(uId);

  const formatTimeSlot = (time) => {
    if (!time) return 'Time pending';
    const lower = String(time).toLowerCase().trim();
    if (lower === 'morning') return '09:00 AM - 12:00 PM';
    if (lower === 'afternoon') return '12:00 PM - 06:00 PM';
    if (lower === 'evening') return '06:00 PM - 12:00 AM';
    return time;
  };

  const getDateBadge = (dateStr) => {
    if (!dateStr) return { dayShort: 'TBD', dateLabel: 'Date pending' };
    const parts = String(dateStr).split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return {
        dayShort: parts[0].slice(0, 3),
        dateLabel: parts.slice(1).join(', '),
      };
    }
    const parsed = new Date(dateStr);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        dayShort: parsed.toLocaleDateString('en-US', { weekday: 'short' }),
        dateLabel: parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    }
    return { dayShort: String(dateStr).slice(0, 3), dateLabel: String(dateStr) };
  };

  // 1. Next Appointment: Earliest upcoming appointment (pending or confirmed)
  const upcomingAppointments = appointments
    .filter(appt => appt.status === 'pending' || appt.status === 'confirmed')
    .sort((a, b) => {
      const dateA = a.appointmentDate ? new Date(a.appointmentDate) : new Date(0);
      const dateB = b.appointmentDate ? new Date(b.appointmentDate) : new Date(0);
      return dateA - dateB;
    });
  const nextAppt = upcomingAppointments[0];

  // 2. Total Visits: count of completed appointments
  const completedAppointments = appointments.filter(appt => appt.status === 'completed');
  const completedCount = completedAppointments.length;

  // 3. Unique PSWs (Care Team)
  const uniquePsws = [];
  const pswIds = new Set();
  appointments.forEach(appt => {
    if (appt.pswId && appt.pswId._id) {
      if (!pswIds.has(appt.pswId._id)) {
        pswIds.add(appt.pswId._id);
        uniquePsws.push(appt.pswId);
      }
    }
  });
  const careTeamCount = uniquePsws.length;

  // 4. Visit Timeline: Top 2 upcoming / non-cancelled appointments sorted chronologically
  const timelineAppointments = appointments
    .filter(appt => appt.status !== 'cancelled')
    .sort((a, b) => {
      const dateA = a.appointmentDate ? new Date(a.appointmentDate) : new Date(0);
      const dateB = b.appointmentDate ? new Date(b.appointmentDate) : new Date(0);
      return dateA - dateB;
    })
    .slice(0, 2);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Overview...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      {/* Editorial Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-gray-900 mb-2 font-serif leading-tight">Patient Overview</h2>
        <p className="text-gray-400 text-sm font-medium tracking-tight">Your health journey and care team at a glance.</p>
      </div>

      {/* Stats Grid - Enhanced with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Next Appointment Card */}
        <div className="bg-gradient-to-br from-[#5915BD] to-[#7C3AED] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(89,21,189,0.15)] group hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <p className="text-purple-100/70 text-[10px] font-bold uppercase tracking-widest mb-10">Next Appointment</p>
          <h2 className="text-2xl font-bold mb-2 font-serif tracking-tight truncate">{nextAppt ? nextAppt.date : 'None'}</h2>
          <p className="text-purple-100 text-xs font-semibold tracking-wide flex items-center gap-1">
            {nextAppt ? (
              <>
                <svg className="w-3.5 h-3.5 border-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {formatTimeSlot(nextAppt.time)}
              </>
            ) : (
              'No upcoming visits'
            )}
          </p>
        </div>

        {/* Total Visits Card */}
        <div className="bg-white rounded-[2.5rem] p-10 text-gray-900 relative overflow-hidden border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-10 right-10 bg-[#FFF5F7] p-3 rounded-2xl shadow-sm text-rose-500 border border-rose-50/50">
            <svg className="w-6 h-6 border-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-10">Total Visits</p>
          <h2 className="text-5xl font-bold mb-2 font-serif text-rose-500">{String(completedCount).padStart(2, '0')}</h2>
          <p className="text-gray-400 text-xs font-semibold tracking-tight">Clinical visits completed</p>
        </div>

        {/* My Care Team Card */}
        <div className="bg-white rounded-[2.5rem] p-10 text-gray-900 relative overflow-hidden border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-10 right-10 bg-emerald-50 p-3 rounded-2xl shadow-sm text-emerald-500 border border-emerald-50/50">
            <svg className="w-6 h-6 border-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-10">Care Team</p>
          <h2 className="text-5xl font-bold mb-2 font-serif text-emerald-600">{String(careTeamCount).padStart(2, '0')}</h2>
          <p className="text-gray-400 text-xs font-semibold tracking-tight">Active primary caregivers</p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* My Appointments Column */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-bl-[100%] opacity-50"></div>
          <div className="flex justify-between items-center mb-10 relative">
            <h3 className="text-2xl font-bold font-serif">Visit Timeline</h3>
            <button onClick={() => onNavigate("Reports")} className="text-purple-600 text-xs font-bold uppercase tracking-widest flex items-center hover:bg-purple-25 px-4 py-2 rounded-xl transition-all border border-purple-50">
              Complete Log
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          <div className="space-y-6">
            {timelineAppointments.length === 0 ? (
              <div className="bg-gray-25/50 border border-dashed border-gray-100 rounded-[2rem] p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                No care visits scheduled yet
              </div>
            ) : (
              timelineAppointments.map((appt, index) => {
                const badge = getDateBadge(appt.date);
                const pswName = appt.pswId ? `${appt.pswId.firstName} ${appt.pswId.lastName}` : 'Care Provider';
                const pswPhoto = appt.pswId?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${appt.pswId?.firstName || 'Care'}`;
                const isConfirmed = appt.status === 'confirmed';
                const isCompleted = appt.status === 'completed';

                let statusColor = 'text-orange-500 bg-orange-50';
                let statusLabel = 'Pending';
                if (isConfirmed) {
                  statusColor = 'text-emerald-600 bg-emerald-50';
                  statusLabel = 'Confirmed';
                } else if (isCompleted) {
                  statusColor = 'text-purple-600 bg-purple-50';
                  statusLabel = 'Completed';
                }

                return (
                  <div key={appt._id || index} className="flex flex-col sm:flex-row items-start sm:items-center p-8 rounded-[2rem] border border-transparent bg-[#F9F7FF] gap-6 group hover:border-purple-200 transition-all hover:shadow-xl hover:shadow-purple-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600"></div>
                    <img src={pswPhoto} className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md shrink-0 group-hover:scale-105 transition-transform" alt={pswName} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{pswName}</h4>
                      <p className="text-purple-600/60 text-[10px] font-bold uppercase tracking-widest">{appt.service || 'Personal Support Worker'}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex flex-col items-end">
                         <p className={`text-[10px] font-bold mb-1 uppercase tracking-wider px-3 py-1 rounded-full ${statusColor}`}>{statusLabel}</p>
                         <div className="flex items-center gap-2 mb-1">
                           <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">{badge.dayShort}</span>
                           <span className="text-xs font-semibold text-gray-700">{badge.dateLabel}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <svg className="w-3.5 h-3.5 text-gray-500 border-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           <span className="text-sm font-bold text-gray-900 leading-none">{formatTimeSlot(appt.time)}</span>
                           <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[9px] font-bold tracking-wider">PSW+</span>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            <button onClick={() => onNavigate("Appointments")} className="w-full py-6 mt-10 bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white rounded-[2rem] font-bold text-sm shadow-[0_20px_50px_rgba(89,21,189,0.15)] hover:shadow-[0_20px_50px_rgba(89,21,189,0.25)] transition-all hover:-translate-y-1 transform active:scale-[0.98] uppercase tracking-widest">
              Schedule New Consultation
            </button>
          </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="lg:col-span-4 space-y-10">
          {/* Care Team Widget */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50">
            <h3 className="text-xl font-bold mb-8 font-serif leading-none">Assigned Team</h3>
            {uniquePsws.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-[10px] bg-gray-25/50 rounded-2xl border border-dashed border-gray-100">
                No caregivers assigned yet
              </div>
            ) : (
              <div className="space-y-8">
                {uniquePsws.map((member, index) => {
                  const rating = member.rating || 5.0;
                  const name = `${member.firstName} ${member.lastName}`;
                  const photo = member.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.firstName || 'Care'}`;
                  const specializations = member.specializations && member.specializations.length > 0 
                    ? member.specializations.join(', ') 
                    : 'Personal Support Worker';

                  return (
                    <div key={member._id || index} className="flex items-center group cursor-pointer">
                      <img src={photo} className="w-12 h-12 rounded-2xl border-2 border-white shrink-0 shadow-sm transition-transform group-hover:scale-110" alt={name} />
                      <div className="ml-5 flex-1 min-w-0 pr-4">
                        <h4 className="font-bold text-sm truncate group-hover:text-purple-600 transition-colors">{name}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{specializations}</p>
                        <div className="w-full h-1 bg-gray-50 rounded-full mt-3 overflow-hidden">
                           <div className="h-full bg-orange-400" style={{ width: `${(rating / 5) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-gray-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">{rating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={() => onNavigate("Settings")} className="w-full mt-10 py-4 bg-gray-25 text-gray-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Manage Full Team</button>
          </div>

          {/* Quick Actions Portal */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50">
            <h3 className="text-xl font-bold mb-8 font-serif leading-none">Portals</h3>
            <div className="grid grid-cols-2 gap-5">
              <button onClick={() => onNavigate("Appointments")} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F9F7FF] border border-transparent hover:border-purple-200 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-[9px] font-bold text-center text-purple-900 uppercase tracking-widest">Calendar</span>
              </button>
              <button onClick={() => onNavigate("Messages")} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F9F7FF] border border-transparent hover:border-purple-200 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <span className="text-[9px] font-bold text-center text-purple-900 uppercase tracking-widest">Messages</span>
              </button>
              <div className="col-span-2">
                 <button onClick={() => onNavigate("Reports")} className="w-full flex items-center justify-between p-6 rounded-3xl bg-gray-25/50 border border-transparent hover:border-purple-100 transition-all group">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Health Records</span>
                   </div>
                   <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
