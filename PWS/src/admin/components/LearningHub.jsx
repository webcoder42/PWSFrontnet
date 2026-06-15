import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import PortalMain from './learning-hub/PortalMain';
import CourseDetail from './learning-hub/CourseDetail';
import AddEditCourse from './learning-hub/AddEditCourse';

const LearningHub = () => {
  const { courses, addCourse, updateCourse } = useAdmin();
  const [activeTab, setActiveTab] = useState('All');
  const [view, setView] = useState('main'); // 'main', 'course-detail', 'add-edit'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'PSW Onboarding',
    duration: '',
    lessons: '',
    details: { duration: '', difficulty: 'Beginner', certification: '' }
  });

  const tabs = ['All', 'PSW Onboarding', 'Compliance', 'Admin Tools', 'Videos'];

  const handleOpenCourse = (course) => {
    setSelectedCourse(course);
    setView('course-detail');
  };

  const handleAddCourse = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      category: 'PSW Onboarding',
      duration: '',
      lessons: '',
      details: { duration: '', difficulty: 'Beginner', certification: '' }
    });
    setView('add-edit');
  };

  const handleEditCourse = (e, course) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      duration: course.duration,
      lessons: course.lessons,
      details: course.details
    });
    setView('add-edit');
  };

  const handleSave = () => {
    if (isEditing) {
      updateCourse(selectedCourse.id, formData);
    } else {
      addCourse({
        ...formData,
        curriculum: [],
        instructor: { name: 'Admin User', role: 'Platform Admin', seed: 'Admin' },
        color: 'from-gray-600 to-gray-800'
      });
    }
    setView('main');
  };

  return (
    <div className="h-full">
      {view === 'main' && (
        <PortalMain 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          courses={courses}
          tabs={tabs}
          onAddCourse={handleAddCourse}
          onOpenCourse={handleOpenCourse}
          onEditCourse={handleEditCourse}
        />
      )}
      
      {view === 'course-detail' && (
        <CourseDetail 
          course={selectedCourse}
          onBack={() => setView('main')}
        />
      )}

      {view === 'add-edit' && (
        <AddEditCourse 
          isEditing={isEditing}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onCancel={() => setView('main')}
          tabs={tabs}
        />
      )}
    </div>
  );
};

export default LearningHub;
