import React, { useMemo } from 'react';

const OperationsSummary = ({ appointments = [], psws = [], overview = {} }) => {
  const totalHours = useMemo(() => {
    const active = appointments.filter(a => a.status !== 'Cancelled' && a.status !== 'cancelled');
    return active.reduce((sum, a) => {
      const dur = a.duration || '';
      const match = dur.match(/(\d+(?:\.\d+)?)/);
      return sum + (match ? parseFloat(match[1]) : 1);
    }, 0);
  }, [appointments]);

  const avgMinutes = appointments.length > 0 ? Math.round(totalHours * 60 / Math.max(appointments.filter(a => a.status !== 'Cancelled' && a.status !== 'cancelled').length, 1)) : 75;
  const avgHours = Math.floor(avgMinutes / 60);
  const avgMins = avgMinutes % 60;

  const topPsw = useMemo(() => {
    const counts = {};
    appointments.forEach(a => {
      if (a.psw) {
        counts[a.psw] = (counts[a.psw] || 0) + 1;
      }
    });
    const entries = Object.entries(counts);
    return entries.length ? entries.sort((a, b) => b[1] - a[1])[0][0] : (psws[0]?.name || 'N/A');
  }, [appointments, psws]);

  const weeklyData = useMemo(() => {
    const weeks = [{ label: 'W1', count: 0 }, { label: 'W2', count: 0 }, { label: 'W3', count: 0 }, { label: 'W4', count: 0 }];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    appointments.forEach(a => {
      const d = a.appointmentDate ? new Date(a.appointmentDate) : null;
      if (d && d.getMonth() === currentMonth && d.getFullYear() === currentYear && a.status !== 'Cancelled' && a.status !== 'cancelled') {
        const day = d.getDate();
        const weekIdx = Math.min(Math.floor((day - 1) / 7), 3);
        weeks[weekIdx].count++;
      }
    });
    const maxCount = Math.max(...weeks.map(w => w.count), 1);
    return weeks.map(w => ({ ...w, height: `${Math.max((w.count / maxCount) * 100, 5)}%`, active: w.count > 0 }));
  }, [appointments]);

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm relative overflow-hidden">
       <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">Operations Summary — {monthName}</h3>
       <div className="flex items-end justify-between h-32 mb-8 px-4">
          {weeklyData.map((item, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
               <div className={`w-3 ${item.active ? 'bg-purple-600' : 'bg-purple-100'} rounded-full transition-all duration-1000`} style={{ height: item.height }}></div>
               <span className={`text-[8px] font-bold mt-3 ${item.active ? 'text-purple-600' : 'text-gray-300'}`}>{item.label}</span>
            </div>
          ))}
       </div>
       <div className="space-y-4 pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium tracking-tight">Total hours billed</span>
            <span className="text-sm font-bold text-gray-900">{totalHours.toLocaleString()} hrs</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium tracking-tight">Avg session duration</span>
            <span className="text-sm font-bold text-gray-900">{avgHours}h {avgMins}m</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium tracking-tight">Top PSW</span>
            <span className="text-sm font-bold text-purple-600">{topPsw}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium tracking-tight">Revenue</span>
            <span className="text-sm font-bold text-gray-900">${Number(overview?.revenue || appointments.reduce((s, a) => s + (a.price || 0), 0)).toLocaleString()}</span>
          </div>
       </div>
    </div>
  );
};

export default OperationsSummary;
