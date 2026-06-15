import React, { useState } from 'react';
import booksImage from '../assets/pair of books.png';

const LearningHub = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [view, setView] = useState('main'); // 'main' or 'course-detail'
  const [selectedCourse, setSelectedCourse] = useState(null);

  const tabs = ['All', 'Getting Started', 'Health & Care', 'Platform Guide', 'Videos'];

  const courses = [
    {
      id: 1,
      title: 'Understanding Your Care Plan',
      category: 'Getting Started',
      duration: '25 min',
      lessons: 5,
      progress: 40,
      icon: (
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
      ),
      curriculum: [
        { title: '1. Introduction to Care Plans', time: '10 mins', status: 'completed' },
        { title: '2. Roles & Responsibilities', time: '15 mins', status: 'completed' },
        { title: '3. Reading Your Daily Schedule', time: '12 mins', status: 'completed' },
        { title: '4. Requesting Changes', time: '8 mins', status: 'in-progress' },
        { title: '5. Sharing with Family', time: '20 mins', status: 'upcoming' },
      ],
      details: {
        duration: '25 Minutes',
        difficulty: 'Beginner',
        certification: 'PSWB Core Credit'
      },
      instructor: {
        name: 'Dr. Sarah Thompson',
        role: 'Chief Nursing Officer',
        seed: 'Sarah'
      },
      color: 'from-purple-600 to-indigo-700'
    },
    {
      id: 2,
      title: 'Managing Medications Safely',
      category: 'Health & Care',
      duration: '20 min',
      lessons: 4,
      progress: 0,
      icon: (
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.251a2 2 0 01-1.268 0l-.628-.251a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547l-.547 1.022a2 2 0 00.547 1.022l2.387.477a6 6 0 003.86-.517l.628-.251a2 2 0 011.268 0l.628.251a6 6 0 003.86.517l2.387-.477a2 2 0 001.022-.547l.547-1.022a2 2 0 00-.547-1.022z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"/></svg>
        </div>
      ),
      curriculum: [
        { title: '1. Medication Basics', time: '5 mins', status: 'not-started' },
        { title: '2. Tracking Your Schedule', time: '6 mins', status: 'not-started' },
        { title: '3. Side Effects & Warnings', time: '4 mins', status: 'not-started' },
        { title: '4. Communicating with your PSW', time: '5 mins', status: 'not-started' },
      ],
      details: {
         duration: '20 Minutes',
         difficulty: 'Intermediate',
         certification: 'Vitality Core Certified'
      },
      instructor: {
        name: 'Dr. Julian Vance',
        role: 'Chief Nursing Officer',
        seed: 'Julian'
      },
      color: 'from-blue-600 to-cyan-700'
    },
    {
      id: 3,
      title: 'Booking and Appointments',
      category: 'Platform Guide',
      duration: '15 min',
      lessons: 3,
      progress: 0,
      icon: (
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
      ),
      curriculum: [
        { title: '1. Using the Booking Tool', time: '5 mins', status: 'not-started' },
        { title: '2. Rescheduling & Cancellations', time: '6 mins', status: 'not-started' },
        { title: '3. Feedback & Ratings', time: '4 mins', status: 'not-started' },
      ],
      details: {
         duration: '15 Minutes',
         difficulty: 'Beginner',
         certification: 'PSWB Core Credit'
      },
      instructor: {
        name: 'Dr. Sarah Thompson',
        role: 'Chief Nursing Officer',
        seed: 'Sarah'
      },
      color: 'from-emerald-600 to-teal-700'
    },
    {
      id: 4,
      title: 'How PSWs Are Matched',
      category: 'Videos',
      duration: '5 min',
      lessons: 1,
      progress: 0,
      icon: (
        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
      ),
      curriculum: [
        { title: '1. Matching Algorithm Intro', time: '5 mins', status: 'not-started' },
      ],
      details: {
         duration: '5 Minutes',
         difficulty: 'Beginner',
         certification: 'General Info'
      },
      instructor: {
        name: 'Michael Chen',
        role: 'Community Lead',
        seed: 'Michael'
      },
      color: 'from-orange-500 to-rose-600'
    },
  ];

  const handleOpenCourse = (course) => {
    setSelectedCourse(course);
    setView('course-detail');
  };

  const renderMainPortal = () => (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Learning Hub</h2>
          <p className="text-gray-400 text-sm">Resources to help you get the most from your care.</p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="flex flex-col items-start p-12 isolate w-full max-w-[944px] h-[415px] relative overflow-hidden mb-12 shadow-[0px_20px_25px_-5px_rgba(76,29,149,0.1),0px_8px_10px_-6px_rgba(76,29,149,0.1)] rounded-lg text-white"
        style={{
          backgroundColor: '#4F1A8C',
          backgroundImage: `
            radial-gradient(circle at 10px 10px, rgba(0,0,0,0.2) 0%, transparent 100%),
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px, 20px 20px, 20px 20px'
        }}
      >
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between">
           <div>
              <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 mb-10 inline-block">Continue Learning</span>
              <h3 className="text-[48px] leading-[48px] tracking-[-1.2px] font-black mb-10 font-serif max-w-lg align-middle">Understanding Your Care Plan</h3>
           </div>
           
           <div className="w-full">
              <div className="mb-8 max-w-sm">
                 <div className="flex justify-between text-[11px] font-bold text-gray-200 mb-3 ml-1">
                    <span>60% complete · 2 lessons remaining</span>
                 </div>
                 <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '60%' }}></div>
                 </div>
              </div>
              
              <button 
                onClick={() => handleOpenCourse(courses[0])}
                className="bg-white text-[#4F1A8C] px-10 py-5 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-purple-900/20 transition-all flex items-center group active:scale-95"
               >
                 Continue Lesson 
                 <svg className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
           </div>
        </div>
        
        {/* Book Illustration */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none drop-shadow-2xl z-20">
           <img 
             src={booksImage} 
             className="h-36 w-auto object-contain animate-float" 
             alt="Books"
             onError={(e) => {
               // Fallback if the image doesn't load
               e.target.style.display = 'none';
               e.target.parentElement.innerHTML = `
                 <div className="w-full h-full flex flex-col items-center justify-center space-y-2 transform rotate-12 opacity-80 scale-125">
                   <div className="w-48 h-10 bg-emerald-500 rounded-lg shadow-lg"></div>
                   <div className="w-48 h-10 bg-rose-500 rounded-lg shadow-lg translate-x-4"></div>
                   <div className="w-48 h-10 bg-blue-500 rounded-lg shadow-lg translate-x-2"></div>
                 </div>
               `;
             }}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* My Progress Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm flex flex-col md:flex-row items-center">
           <div className="relative w-40 h-40 shrink-0 mb-6 md:mb-0">
              <svg className="w-full h-full transform -rotate-90">
                 <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                 <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-purple-600" strokeDasharray={440} strokeDashoffset={440 - (440 * 40) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-bold text-gray-900 leading-none">40%</span>
                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">2/5 Done</span>
              </div>
           </div>
           <div className="md:ml-10 flex-1">
              <h4 className="text-lg font-bold mb-2">My Progress</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">You're making great progress! Complete 3 more courses to earn your <span className="text-purple-600 font-bold">Care Badge</span>.</p>
              <div className="space-y-3">
                 {['Welcome to myPSW', 'Navigating the App'].map(item => (
                   <div key={item} className="flex items-center text-[11px] font-bold text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center mr-3 text-white">
                         <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      {item}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Weekly Activity Card */}
        <div className="bg-[#1A0A2E] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
           <div className="flex justify-between items-start mb-10">
              <div>
                 <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1">Total Learning Time</p>
                 <div className="flex items-end gap-3">
                    <h4 className="text-4xl font-bold">2.4h</h4>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg mb-1.5">+12%</span>
                 </div>
              </div>
           </div>
           <div className="flex items-end justify-between h-32 gap-2">
              {[
                { day: 'MON', h: '30%' },
                { day: 'TUE', h: '60%' },
                { day: 'WED', h: '25%' },
                { day: 'THU', h: '85%' },
                { day: 'FRI', h: '45%' },
                { day: 'SAT', h: '95%' },
                { day: 'SUN', h: '80%', active: true },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                   <div className={`w-full ${item.active ? 'bg-white' : 'bg-white/20'} rounded-lg transition-all cursor-pointer group-hover:bg-purple-400`} style={{ height: item.h }}></div>
                   <span className="text-[8px] font-bold text-white/40 mt-3">{item.day}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white border border-gray-100 text-gray-500 hover:border-purple-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured Courses */}
      <h3 className="text-xl font-bold mb-6">Featured Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {courses.filter(c => activeTab === 'All' || c.category === activeTab).map(course => (
          <div 
            key={course.id}
            onClick={() => handleOpenCourse(course)}
            className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-purple-50 transition-all group cursor-pointer"
          >
            <div className="mb-6">{course.icon}</div>
            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest mb-1">{course.category}</p>
            <h4 className="text-lg font-bold text-gray-900 leading-tight mb-6 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{course.title}</h4>
            <p className="text-xs text-gray-400 font-medium mb-10">{course.lessons} lessons · {course.duration}</p>
            <div className="flex items-center text-purple-600 text-xs font-bold">
               {course.progress > 0 ? 'Continue' : 'Start'} 
               <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
        ))}
      </div>

      {/* More Resources */}
      <h3 className="text-xl font-bold mb-6">More Resources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50 rounded-[2.5rem] border border-gray-50 p-4">
        {[
          { title: 'Care Recipient Rights', type: 'PDF Guide', size: '2.4 MB', icon: '📄' },
          { title: 'Getting the Most from App', type: 'Video', size: '8 min', icon: '▶️', arrow: true },
          { title: 'Emergency Procedures', type: 'PDF Guide', size: '1.1 MB', icon: '❄️' },
          { title: 'Frequently Asked Questions', type: 'Article', size: '5 min read', icon: '❓', external: true },
        ].map((res, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-50 hover:bg-gray-25/50 transition-colors cursor-pointer group shadow-sm">
             <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl mr-4 group-hover:scale-110 transition-transform">{res.icon}</div>
                <div>
                   <h4 className="text-sm font-bold text-gray-900 leading-none mb-1.5">{res.title}</h4>
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{res.type} · {res.size}</p>
                </div>
             </div>
             {res.external ? (
               <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
             ) : res.arrow ? (
               <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
             ) : (
               <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
             )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCourseDetail = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <button 
        onClick={() => setView('main')}
        className="flex items-center text-gray-400 hover:text-purple-600 font-bold mb-8 transition-colors text-xs uppercase tracking-widest group"
      >
        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        Back to Learning Hub
      </button>

      <div className={`bg-gradient-to-br ${selectedCourse?.color || 'from-purple-600 to-indigo-700'} rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden mb-12 shadow-2xl shadow-purple-100`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 10px 10px, rgba(0,0,0,0.15) 0%, transparent 100%),
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px, 20px 20px, 20px 20px',
          backgroundColor: '#4F1A8C' // Fallback or base color for the pattern
        }}
      >
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 font-mono">
               <span>Learning Hub</span>
               <span>/</span>
               <span className="text-white">Current Course</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-10 max-w-2xl leading-tight">{selectedCourse?.title}</h2>
            
            <div className="max-w-md mb-10">
               <div className="flex justify-between text-xs font-bold mb-3">
                  <span className="text-white/60">Course Progress</span>
                  <span>{selectedCourse?.progress}%</span>
               </div>
               <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${selectedCourse?.progress}%` }}></div>
               </div>
            </div>

            <button className="bg-white text-[#4F1A8C] px-10 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-purple-25 transition-all">
               {selectedCourse?.progress > 0 ? 'Resume Lesson' : 'Start Course'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold font-serif">Course Curriculum</h3>
              <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{selectedCourse?.curriculum.length} Modules</span>
           </div>

           <div className="space-y-4">
              {selectedCourse?.curriculum.map((module, i) => (
                <div 
                  key={i} 
                  className={`p-6 rounded-[2rem] border transition-all flex items-center group cursor-pointer ${
                    module.status === 'in-progress' 
                      ? 'bg-white border-purple-500 shadow-xl shadow-purple-50 scale-[1.02]' 
                      : 'bg-white border-gray-50 shadow-sm hover:shadow-md'
                  }`}
                >
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-6 shrink-0 transition-colors ${
                     module.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 
                     module.status === 'in-progress' ? 'bg-purple-600 text-white' : 
                     'bg-gray-50 text-gray-300'
                   }`}>
                      {module.status === 'completed' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      ) : module.status === 'in-progress' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      )}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                         <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-lg border ${
                           module.status === 'completed' ? 'border-emerald-100 bg-emerald-50/50 text-emerald-600' :
                           module.status === 'in-progress' ? 'border-purple-200 bg-purple-500 text-white' :
                           'border-gray-100 bg-gray-50 text-gray-400'
                         }`}>
                           {module.status}
                         </span>
                         <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{module.time}</span>
                      </div>
                      <h4 className={`font-bold transition-colors ${module.status === 'in-progress' ? 'text-purple-600' : 'text-gray-900'} ${module.status === 'upcoming' ? 'opacity-40' : ''}`}>
                        {module.title}
                      </h4>
                   </div>
                   <div className="ml-4 shrink-0 transition-transform group-hover:translate-x-1">
                      {module.status === 'upcoming' ? (
                        <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           {/* Course Details Card */}
           <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm">
              <h3 className="text-xl font-bold mb-8 font-serif">Course Details</h3>
              <div className="space-y-8">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Duration</p><p className="text-sm font-bold text-gray-900">{selectedCourse?.details.duration}</p></div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg></div>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Difficulty</p><p className="text-sm font-bold text-gray-900">{selectedCourse?.details.difficulty}</p></div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
                    <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Certification</p><p className="text-sm font-bold text-gray-900">{selectedCourse?.details.certification}</p></div>
                 </div>
              </div>

              <div className="mt-10 pt-10 border-t border-gray-50">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Supplemental Materials</h4>
                 <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-colors group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 border border-transparent group-hover:border-purple-100 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg></div>
                          <span className="text-xs font-bold text-gray-700">Download Guide</span>
                       </div>
                       <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-colors group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 border border-transparent group-hover:border-purple-100 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg></div>
                          <span className="text-xs font-bold text-gray-700">Daily Check-sheet</span>
                       </div>
                       <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </button>
                 </div>
              </div>
           </div>

           {/* Instructor Card */}
           <div className="bg-[#0D1117] rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 scale-150"><svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 px-1">Course Instructor</p>
              <div className="flex items-center gap-6">
                 <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCourse?.instructor.seed}`} className="w-20 h-20 rounded-3xl object-cover ring-2 ring-emerald-500/50 bg-white/5 shadow-2xl transition-transform group-hover:scale-105 duration-500" alt="Instructor" />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 border-4 border-[#0D1117] shadow-lg flex items-center justify-center">
                       <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold mb-1 leading-tight">{selectedCourse?.instructor.name}</h4>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{selectedCourse?.instructor.role}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {view === 'main' ? renderMainPortal() : renderCourseDetail()}
    </div>
  );
};

export default LearningHub;
