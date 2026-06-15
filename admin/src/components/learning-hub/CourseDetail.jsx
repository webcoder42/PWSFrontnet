import React from 'react';

const CourseDetail = ({ course, onBack }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
    <button 
      onClick={onBack}
      className="flex items-center text-gray-400 hover:text-purple-600 font-bold mb-8 transition-colors text-xs uppercase tracking-widest group"
    >
      <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
      Back to Training Hub
    </button>

    <div className={`bg-gradient-to-br ${course?.color || 'from-purple-600 to-indigo-700'} rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden mb-12 shadow-2xl shadow-purple-100`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 10px 10px, rgba(0,0,0,0.15) 0%, transparent 100%),
          linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px, 20px 20px, 20px 20px',
      }}
    >
       <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
       <div className="relative z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 font-mono">
             <span>Training Hub</span>
             <span>/</span>
             <span className="text-white">Current Course</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-10 max-w-2xl leading-tight font-serif">{course?.title}</h2>
          
          <div className="max-w-md mb-10">
             <div className="flex justify-between text-xs font-bold mb-3">
                <span className="text-white/60">Course Progress</span>
                <span>{course?.progress}%</span>
             </div>
             <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${course?.progress}%` }}></div>
             </div>
          </div>

          <button className="bg-white text-purple-900 px-10 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-purple-50 transition-all uppercase tracking-widest">
             {course?.progress > 0 ? 'Resume Lesson' : 'Start Course'}
          </button>
       </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold font-serif">Course Curriculum</h3>
            <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{course?.curriculum?.length || 0} Modules</span>
         </div>

         <div className="space-y-4">
            {(course?.curriculum?.length > 0 ? course.curriculum : [{ title: 'Module 1: Introduction', time: '10 min', status: 'not-started' }]).map((module, i) => (
              <div key={i} className="p-6 rounded-[2rem] bg-white border border-gray-50 shadow-sm flex items-center group cursor-pointer hover:shadow-md transition-all">
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center mr-6 shrink-0 bg-gray-50 text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                       <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-lg border border-gray-100 bg-gray-50 text-gray-400">{module.status || 'Upcoming'}</span>
                       <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{module.time}</span>
                    </div>
                    <h4 className="font-bold text-gray-900">{module.title}</h4>
                 </div>
                 <div className="ml-4 shrink-0"><svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></div>
              </div>
            ))}
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm h-fit">
         <h3 className="text-xl font-bold mb-8 font-serif">Instructor</h3>
         <div className="flex items-center gap-4 mb-8">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course?.instructor?.seed || 'Admin'}`} className="w-16 h-16 rounded-2xl shadow-sm border-2 border-white" alt="Instructor" />
            <div>
               <h4 className="font-bold text-gray-900">{course?.instructor?.name}</h4>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{course?.instructor?.role}</p>
            </div>
         </div>
         <button className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors">Contact Instructor</button>
      </div>
    </div>
  </div>
);

export default CourseDetail;
