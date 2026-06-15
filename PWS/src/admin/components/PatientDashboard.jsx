import React from 'react';

const AdminDashboard = ({ onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-700 pb-20">
      {/* Editorial Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-gray-900 mb-2 font-serif leading-tight">Admin Overview</h2>
        <p className="text-gray-400 text-sm font-medium tracking-tight">Manage clients, PSWs, and operations at a glance.</p>
      </div>

      {/* Stats Grid - Enhanced with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Active Clients Card */}
        <div className="bg-gradient-to-br from-[#5915BD] to-[#7C3AED] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(89,21,189,0.15)] group hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-10 right-10 bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-lg border border-white/20">
            <svg className="w-6 h-6 border-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <p className="text-purple-100/70 text-[10px] font-bold uppercase tracking-widest mb-10">Active Clients</p>
          <h2 className="text-4xl font-bold mb-2 font-serif tracking-tight">128</h2>
          <p className="text-purple-100 text-xs font-semibold tracking-wide">Registered patients</p>
        </div>

        {/* Active PSWs Card */}
        <div className="bg-white rounded-[2.5rem] p-10 text-gray-900 relative overflow-hidden border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-10 right-10 bg-[#FFF5F7] p-3 rounded-2xl shadow-sm text-rose-500 border border-rose-50/50">
            <svg className="w-6 h-6 border-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-10">Active PSWs</p>
          <h2 className="text-5xl font-bold mb-2 font-serif text-rose-500">42</h2>
          <p className="text-gray-400 text-xs font-semibold tracking-tight">On-duty support workers</p>
        </div>

        {/* Today's Sessions Card */}
        <div className="bg-white rounded-[2.5rem] p-10 text-gray-900 relative overflow-hidden border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group hover:-translate-y-1 transition-all duration-500">
          <div className="absolute top-10 right-10 bg-emerald-50 p-3 rounded-2xl shadow-sm text-emerald-500 border border-emerald-50/50">
            <svg className="w-6 h-6 border-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-10">Today's Sessions</p>
          <h2 className="text-5xl font-bold mb-2 font-serif text-emerald-600">18</h2>
          <p className="text-gray-400 text-xs font-semibold tracking-tight">Scheduled appointments today</p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Activity Column */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-bl-[100%] opacity-50"></div>
          <div className="flex justify-between items-center mb-10 relative">
            <h3 className="text-2xl font-bold font-serif">Recent Assignments</h3>
            <button onClick={() => onNavigate("Reports")} className="text-purple-600 text-xs font-bold uppercase tracking-widest flex items-center hover:bg-purple-25 px-4 py-2 rounded-xl transition-all border border-purple-50">
              View All
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center p-8 rounded-[2rem] border border-transparent bg-[#F9F7FF] gap-6 group hover:border-purple-200 transition-all hover:shadow-xl hover:shadow-purple-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600"></div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md shrink-0 group-hover:scale-105 transition-transform" alt="Sarah" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-lg mb-1">Sarah Johnson → Jack Hudson</h4>
                <p className="text-purple-600/60 text-[10px] font-bold uppercase tracking-widest">PSW Assigned — Personal Care</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col items-end">
                   <p className="text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">Active — Today</p>
                   <span className="text-sm font-bold text-gray-900 leading-none">11:00 am – 12:00 pm</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center p-8 rounded-[2rem] border border-gray-50 bg-white gap-6 group hover:bg-gray-25/30 transition-all cursor-pointer border-dashed">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-sm shrink-0" alt="Michael" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-lg mb-1">Michael Chen → Mary Wilson</h4>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">PSW Assigned — Medication Mgmt</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                 <div className="flex flex-col items-end">
                   <p className="text-[10px] font-bold text-orange-500 mb-1 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">Pending — Mar 17</p>
                   <span className="text-sm font-bold text-gray-600 leading-none">2:00 pm – 3:30 pm</span>
                </div>
              </div>
            </div>
            
            <button onClick={() => onNavigate("Appointments")} className="w-full py-6 mt-10 bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white rounded-[2rem] font-bold text-sm shadow-[0_20px_50px_rgba(89,21,189,0.15)] hover:shadow-[0_20px_50px_rgba(89,21,189,0.25)] transition-all hover:-translate-y-1 transform active:scale-[0.98] uppercase tracking-widest">
              Create New Assignment
            </button>
          </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="lg:col-span-4 space-y-10">
          {/* Top PSWs Widget */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50">
            <h3 className="text-xl font-bold mb-8 font-serif leading-none">Top PSWs</h3>
            <div className="space-y-8">
              {[
                { name: 'Sarah Johnson', rating: 4.9, seed: 'Sarah', sub: "Alzheimer's Specialist" },
                { name: 'Michael Chen', rating: 4.8, seed: 'Michael', sub: "Medication Expert" },
                { name: 'Emily Davis', rating: 4.7, seed: 'Emily', sub: "Physical Therapist" },
              ].map((member) => (
                <div key={member.name} className="flex items-center group cursor-pointer">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}`} className="w-12 h-12 rounded-2xl border-2 border-white shrink-0 shadow-sm transition-transform group-hover:scale-110" alt={member.name} />
                  <div className="ml-5 flex-1 min-w-0 pr-4">
                    <h4 className="font-bold text-sm truncate group-hover:text-purple-600 transition-colors">{member.name}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{member.sub}</p>
                    <div className="w-full h-1 bg-gray-50 rounded-full mt-3 overflow-hidden">
                       <div className="h-full bg-orange-400" style={{ width: `${(member.rating / 5) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-gray-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">{member.rating}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate("Reports")} className="w-full mt-10 py-4 bg-gray-25 text-gray-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Manage All PSWs</button>
          </div>

          {/* Quick Actions Portal */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50">
            <h3 className="text-xl font-bold mb-8 font-serif leading-none">Admin Portals</h3>
            <div className="grid grid-cols-2 gap-5">
              <button onClick={() => onNavigate("Appointments")} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#F9F7FF] border border-transparent hover:border-purple-200 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-[9px] font-bold text-center text-purple-900 uppercase tracking-widest">Scheduling</span>
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
                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">Reports & Analytics</span>
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

export default AdminDashboard;
