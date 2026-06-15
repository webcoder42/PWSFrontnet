import React from 'react';

const AddEditCourse = ({ isEditing, formData, setFormData, onSave, onCancel, tabs }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto pb-20">
    <button onClick={onCancel} className="flex items-center text-gray-400 hover:text-purple-600 font-bold mb-8 transition-colors text-xs uppercase tracking-widest group">
      <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
      Cancel
    </button>

    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm">
      <h3 className="text-2xl font-bold mb-8 font-serif">{isEditing ? 'Edit Course' : 'Add New Course'}</h3>
      
      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Course Title</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-purple-200 outline-none transition-all font-bold text-sm"
            placeholder="e.g. Advanced Patient Safety"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-purple-200 outline-none transition-all font-bold text-sm"
            >
              {tabs.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Lessons Count</label>
            <input 
              type="number" 
              value={formData.lessons}
              onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-purple-200 outline-none transition-all font-bold text-sm"
              placeholder="e.g. 5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Duration</label>
            <input 
              type="text" 
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-purple-200 outline-none transition-all font-bold text-sm"
              placeholder="e.g. 30 min"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Difficulty</label>
            <select 
              value={formData.details.difficulty}
              onChange={(e) => setFormData({ ...formData, details: { ...formData.details, difficulty: e.target.value } })}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-purple-200 outline-none transition-all font-bold text-sm"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={onSave}
            className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all uppercase tracking-widest"
          >
            {isEditing ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AddEditCourse;
