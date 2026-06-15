import React from 'react';

const TopPsws = ({ psws = [], onManageAll }) => {
  const top = [...psws].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50">
      <h3 className="text-xl font-bold mb-8 font-serif leading-none">Top PSWs</h3>
      <div className="space-y-8">
        {top.length === 0 ? (
          <p className="text-gray-400 text-sm">No PSWs registered yet.</p>
        ) : (
          top.map((member) => (
            <div key={member.id} className="flex items-center group cursor-pointer">
              <img
                src={member.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}`}
                className="w-12 h-12 rounded-2xl border-2 border-white shrink-0 shadow-sm transition-transform group-hover:scale-110 object-cover"
                alt={member.name}
              />
              <div className="ml-5 flex-1 min-w-0 pr-4">
                <h4 className="font-bold text-sm truncate group-hover:text-purple-600 transition-colors">{member.name}</h4>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{member.role}</p>
                <div className="w-full h-1 bg-gray-50 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-orange-400" style={{ width: `${((member.rating || 0) / 5) * 100}%` }}></div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-gray-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                  {(member.rating || 0).toFixed(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <button onClick={onManageAll} className="w-full mt-10 py-4 bg-gray-25 text-gray-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">
        Manage All PSWs
      </button>
    </div>
  );
};

export default TopPsws;
