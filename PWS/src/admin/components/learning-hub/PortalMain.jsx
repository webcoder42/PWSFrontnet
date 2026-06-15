import React from 'react';
import HubHeader from './HubHeader';
import CourseCard from './CourseCard';

const PortalMain = ({ activeTab, setActiveTab, courses, tabs, onAddCourse, onOpenCourse, onEditCourse }) => (
  <div className="animate-in fade-in duration-700">
    <HubHeader onAddCourse={onAddCourse} />

    {/* Filter Tabs */}
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

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.filter(c => activeTab === 'All' || c.category === activeTab).map(course => (
        <CourseCard 
          key={course.id} 
          course={course} 
          onOpen={onOpenCourse} 
          onEdit={onEditCourse} 
        />
      ))}
    </div>
  </div>
);

export default PortalMain;
