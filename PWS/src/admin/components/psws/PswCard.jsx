import React from 'react';

const getAvatarUrl = (photoUrl, seed) => {
  const trimmed = typeof photoUrl === 'string' ? photoUrl.trim() : '';
  if (trimmed && !/^file:\/\//i.test(trimmed)) return trimmed;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'User')}`;
};

const certConfig = {
  approved: { label: 'Verified', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600' },
  rejected: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-600' },
};

const PswCard = ({ psw, onViewProfile, onAssignTask }) => {
  const cert = certConfig[psw.pswCertificateStatus] || certConfig.pending;
  return (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm group hover:-translate-y-1 transition-all relative">
    <div className="absolute top-4 left-4">
      <span className={`text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${cert.bg} ${cert.text}`}>
        {cert.label}
      </span>
    </div>
    <div className="flex justify-between items-start mb-6">
      <img src={getAvatarUrl(psw.photoUrl, psw.seed || psw.name)} className="w-20 h-20 rounded-2xl shadow-md border-4 border-white group-hover:scale-105 transition-transform" alt={psw.name} />
      <div className="text-right">
        <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
          psw.status === 'On Shift' ? 'bg-purple-50 text-purple-600' :
          psw.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
          'bg-gray-50 text-gray-400'
        }`}>
          {psw.status}
        </span>
        <div className="mt-2 flex items-center justify-end gap-1">
          <span className="text-xs font-bold text-gray-900">{psw.rating}</span>
          <svg className="w-3 h-3 text-orange-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </div>
      </div>
    </div>
    <h4 className="text-xl font-bold text-gray-900 mb-1">{psw.name}</h4>
    <p className="text-gray-400 text-xs font-medium uppercase tracking-tight mb-8">{psw.role}</p>
    <div className="flex gap-4">
      <button onClick={() => onViewProfile(psw)} className="flex-1 bg-gray-50 text-gray-900 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors">View Profile</button>
      <button onClick={onAssignTask} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-colors shadow-lg shadow-purple-50">Assign Task</button>
    </div>
  </div>
  );
};

export default PswCard;
