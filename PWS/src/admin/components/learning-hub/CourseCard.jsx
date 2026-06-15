import React from 'react';

const CourseCard = ({ course, onOpen, onEdit }) => (
  <div 
    onClick={() => onOpen(course)}
    className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-purple-50 transition-all group cursor-pointer relative"
  >
    <button 
      onClick={(e) => onEdit(e, course)}
      className="absolute top-8 right-8 p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-all"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    </button>
    <div className="mb-6">{course.icon}</div>
    <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest mb-1">{course.category}</p>
    <h4 className="text-xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{course.title}</h4>
    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-8">
      <span>{course.lessons} lessons</span>
      <span>•</span>
      <span>{course.duration}</span>
    </div>
    <div className="w-full h-1.5 bg-gray-50 rounded-full mb-6 overflow-hidden">
       <div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{course.progress}% Complete</span>
      <div className="text-purple-600 text-xs font-bold flex items-center">
         {course.progress > 0 ? 'Continue' : 'Start'} 
         <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
      </div>
    </div>
  </div>
);

export default CourseCard;
