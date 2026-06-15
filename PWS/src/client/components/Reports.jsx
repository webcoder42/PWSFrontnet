import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { useUser } from '../../context/UserContext';
import { useLiveDataRefresh } from '../../hooks/useLiveDataRefresh';
import { getAppointmentsByUserAPI } from '../../utils/api';
import pswLogo from '../assets/PSW+ Logo.png';

const STATUS_TABS = ['All', 'Completed', 'Pending', 'Cancelled'];

const safeDate = (dateValue) => {
  if (!dateValue) return null;
  const d = new Date(dateValue);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDateLabel = (dateValue) => {
  const d = safeDate(dateValue);
  if (!d) return 'Date pending';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatMonthYear = (dateValue) => {
  const d = safeDate(dateValue);
  if (!d) return 'Visit Log';
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const getDayBadge = (dateValue) => {
  const d = safeDate(dateValue);
  if (!d) return { month: 'TBD', day: '--' };
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.toLocaleDateString('en-US', { day: '2-digit' }),
  };
};

const normalizeStatus = (status) => {
  if (!status) return 'pending';
  const lower = String(status).toLowerCase();
  if (lower === 'confirmed') return 'upcoming';
  return lower;
};

const formatTimeSlot = (time) => {
  if (!time) return 'Time pending';
  const lower = String(time).toLowerCase().trim();
  if (lower === 'morning') return '09:00 AM - 12:00 PM';
  if (lower === 'afternoon') return '12:00 PM - 06:00 PM';
  if (lower === 'evening') return '06:00 PM - 12:00 AM';
  return time;
};

const toHours = (appointment) => {
  const duration = Number(appointment?.duration);
  if (Number.isFinite(duration) && duration > 0) {
    return duration >= 10 ? duration / 60 : duration;
  }
  if (String(appointment?.time || '').toLowerCase().includes(' - ')) {
    return 1;
  }
  return 1;
};

const getImageDataUrl = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const Reports = ({ onNavigate }) => {
  const { rawUser, profile } = useUser();
  const [activeTab, setActiveTab] = useState('main');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRecordIds, setSelectedRecordIds] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const userId = rawUser?._id || rawUser?.id || profile?.id;
      if (!userId) {
        setAppointments([]);
        return;
      }
      const response = await getAppointmentsByUserAPI(userId);
      const rows = Array.isArray(response?.data) ? response.data : [];
      setAppointments(rows);
    } catch (err) {
      setError(err?.message || 'Unable to load reports data.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [rawUser?._id, rawUser?.id, profile?.id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useLiveDataRefresh(fetchAppointments);

  const records = useMemo(() => {
    return [...appointments]
      .map((appt) => {
        const date = safeDate(appt?.date);
        const psw = appt?.pswId && typeof appt.pswId === 'object' ? appt.pswId : null;
        const providerName = `${psw?.firstName || ''} ${psw?.lastName || ''}`.trim() || 'Care Provider';
        const service = appt?.service || 'Personal Care';
        return {
          id: appt?._id || `${providerName}-${appt?.date || ''}-${appt?.time || ''}`,
          date,
          rawDate: appt?.date,
          providerName,
          service,
          timeLabel: formatTimeSlot(appt?.time),
          status: normalizeStatus(appt?.status),
          hours: toHours(appt),
        };
      })
      .sort((a, b) => (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0));
  }, [appointments]);

  const filteredRecords = useMemo(() => {
    if (statusFilter === 'All') return records;
    const key = statusFilter.toLowerCase();
    return records.filter((r) => r.status === key);
  }, [records, statusFilter]);

  const stats = useMemo(() => {
    const completed = records.filter((r) => r.status === 'completed');
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const thisMonth = records.filter((r) => {
      if (!r.date) return false;
      return r.date.getMonth() === month && r.date.getFullYear() === year;
    });
    const active = records.filter((r) => r.status === 'pending' || r.status === 'upcoming');
    const totalHours = completed.reduce((sum, r) => sum + r.hours, 0);
    const uniqueProviders = new Set(records.map((r) => r.providerName).filter(Boolean));

    return [
      { label: 'Total Visits', value: String(records.length).padStart(2, '0'), sub: `${completed.length} Completed Records`, color: 'bg-purple-600', textColor: 'text-white' },
      { label: 'This Month', value: String(thisMonth.length).padStart(2, '0'), sub: `${active.length} Active Visits`, color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
      { label: 'Hours of Care', value: String(Math.round(totalHours)).padStart(2, '0'), sub: 'Total hours delivered', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
      { label: 'Assigned PSWs', value: String(uniqueProviders.size).padStart(2, '0'), sub: 'Primary Caregivers', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
    ];
  }, [records]);

  const monthTitle = useMemo(() => {
    return records[0]?.date ? formatMonthYear(records[0].date) : 'March 2026';
  }, [records]);

  const exportRows = useMemo(() => {
    const source = records.length > 0 ? records : [];
    return source.slice(0, 12);
  }, [records]);

  useEffect(() => {
    setSelectedRecordIds(new Set(exportRows.map((r) => r.id)));
  }, [exportRows]);

  const selectedRows = useMemo(() => {
    return exportRows.filter((row) => selectedRecordIds.has(row.id));
  }, [exportRows, selectedRecordIds]);

  const toggleRow = (rowId) => {
    setSelectedRecordIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const setSelectAll = () => {
    if (selectedRecordIds.size === exportRows.length) {
      setSelectedRecordIds(new Set());
      return;
    }
    setSelectedRecordIds(new Set(exportRows.map((r) => r.id)));
  };

  const generatePdf = async () => {
    if (selectedRows.length === 0) return;
    setIsExporting(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 10;
      const logoDataUrl = await getImageDataUrl(pswLogo);

      doc.setFillColor(89, 21, 189);
      doc.rect(0, 0, pageWidth, 34, 'F');
      doc.setTextColor(255, 255, 255);
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', 14, 7, 26, 20);
      }
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('PSW+', 44, 16);
      doc.setFontSize(12);
      doc.text('Clinical Visit Report', 44, 24);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 16, { align: 'right' });
      doc.text(`Client: ${profile?.name || 'Patient'}`, pageWidth - 14, 24, { align: 'right' });

      y = 44;
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Export Summary', 14, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Selected records: ${selectedRows.length}`, 14, y);
      y += 6;
      doc.text(`Total visits on dashboard: ${records.length}`, 14, y);
      y += 6;
      doc.text(`Completed visits: ${records.filter((r) => r.status === 'completed').length}`, 14, y);
      y += 10;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Visit Details', 14, y);
      y += 8;

      selectedRows.forEach((row, idx) => {
        if (y > pageHeight - 35) {
          doc.addPage();
          y = 16;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text('Visit Details (continued)', 14, y);
          y += 8;
        }

        doc.setFillColor(248, 245, 255);
        doc.roundedRect(12, y - 5, pageWidth - 24, 24, 2, 2, 'F');
        doc.setTextColor(17, 24, 39);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${idx + 1}. ${row.providerName} - ${row.service}`, 16, y + 1);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Date: ${formatDateLabel(row.date || row.rawDate)}`, 16, y + 7);
        doc.text(`Time: ${row.timeLabel}`, 16, y + 12);
        doc.text(`Status: ${row.status.toUpperCase()}`, 16, y + 17);
        y += 30;
      });

      const fileDate = new Date().toISOString().slice(0, 10);
      doc.save(`psw-plus-report-${fileDate}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  const renderMainView = () => (
    <div className="animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Reports</h2>
          <p className="text-gray-400 text-sm">Manage and export your clinical visit documentation.</p>
        </div>
        <button 
          onClick={() => setActiveTab('export')}
          className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-2xl font-bold text-sm flex items-center hover:bg-purple-50 transition-all shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Export Records
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between h-44 ${stat.textColor}`}>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70`}>{stat.label}</p>
              <p className="text-4xl font-bold">{stat.value}</p>
            </div>
            <p className="text-[10px] mt-auto font-medium opacity-80">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Visit Log */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
          <div className="p-8 pb-0 flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900">Visit Log</h3>
            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
               <button className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
               <span className="text-xs font-bold text-gray-700 mx-3">{monthTitle}</span>
               <button className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></button>
            </div>
          </div>
          
          <div className="px-8 flex gap-2 mb-8 border-b border-gray-50 pb-6">
            {STATUS_TABS.map(t => (
              <button key={t} className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all ${
                t === statusFilter ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-gray-400 hover:bg-gray-50'
              }`} onClick={() => setStatusFilter(t)}>{t}</button>
            ))}
          </div>

          <div className="space-y-4 px-8 pb-8">
            {loading ? (
              <div className="py-12 text-center text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                Loading report data...
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="py-12 text-center text-[11px] text-gray-400 font-bold uppercase tracking-wider border border-dashed border-gray-100 rounded-3xl">
                No visits found
              </div>
            ) : (
              filteredRecords.slice(0, 8).map((row) => {
                const badge = getDayBadge(row.date || row.rawDate);
                const statusClass =
                  row.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : row.status === 'cancelled'
                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                      : 'bg-purple-50 text-purple-600';

                return (
                  <div key={row.id} className="bg-white p-6 rounded-3xl border border-gray-50 flex items-center group cursor-pointer transition-all hover:bg-gray-25/50 border-dashed">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 mr-6 group-hover:bg-white transition-colors">
                      <span className="text-[10px] font-bold uppercase leading-none mb-1">{badge.month}</span>
                      <span className="text-xl font-bold leading-none">{badge.day}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{row.providerName}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">{row.service} · {Math.max(0.5, row.hours)} hour session</p>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <p className="text-[11px] font-bold text-gray-700 mb-1">{row.timeLabel}</p>
                        <span className={`text-[8px] font-bold px-3 py-1 rounded-full uppercase ${statusClass}`}>{row.status}</span>
                      </div>
                      <button className="text-purple-600 text-[10px] font-bold hover:underline">View Details</button>
                    </div>
                  </div>
                );
              })
            )}

            <button onClick={() => onNavigate('Appointments')} className="w-full py-4 text-purple-600 text-xs font-bold flex items-center justify-center gap-2 mt-4 hover:bg-purple-25 rounded-2xl transition-all">
              View Complete Log <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-900">Documents</h3>
                <button className="bg-purple-50 text-purple-600 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-purple-100 transition-colors uppercase">Upload +</button>
             </div>
             <div className="space-y-6">
                <div className="flex items-center group cursor-pointer">
                  <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mr-4 shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-900">Visit Report ({records[0]?.providerName || 'PSW'})</h4>
                    <p className="text-[10px] text-gray-400">PDF · Dynamic export</p>
                  </div>
                  <button className="text-gray-300 hover:text-purple-600 p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
                </div>

                <div className="flex items-center group cursor-pointer">
                  <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mr-4 shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-900">Care Plan Q1 2026</h4>
                    <p className="text-[10px] text-gray-400">DOCX · 450 KB</p>
                  </div>
                  <button className="text-gray-300 hover:text-purple-600 p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
                </div>
             </div>
             <button className="text-purple-600 text-[10px] font-bold flex items-center mt-8 hover:underline uppercase tracking-wide">
               All Documents <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
             </button>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm relative overflow-hidden">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">Care Summary — March</h3>
             
             <div className="flex items-end justify-between h-32 mb-8 px-4">
                {[
                  { w: 'W1', h: '40%' },
                  { w: 'W2', h: '80%', active: true },
                  { w: 'W3', h: '30%' },
                  { w: 'W4', h: '50%' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                     <div className={`w-3 ${item.active ? 'bg-purple-600' : 'bg-purple-100'} rounded-full transition-all duration-1000`} style={{ height: item.h }}></div>
                     <span className={`text-[8px] font-bold mt-3 ${item.active ? 'text-purple-600' : 'text-gray-300'}`}>{item.w}</span>
                  </div>
                ))}
             </div>

             <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium tracking-tight">Monthly hours</span>
                  <span className="text-sm font-bold text-gray-900">{stats[2].value}.0 hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium tracking-tight">Avg visit time</span>
                  <span className="text-sm font-bold text-gray-900">
                    {records.length ? `${(records.reduce((sum, r) => sum + r.hours, 0) / records.length).toFixed(1)}h` : '0h'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium tracking-tight">Top Provider</span>
                  <span className="text-sm font-bold text-purple-600">{records[0]?.providerName || 'N/A'}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Export Records</h2>
        <p className="text-gray-400 text-sm">Select documents and reports to export for your records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-800">Selection Filters</h3>
                <button className="text-xs font-bold text-rose-500 hover:underline">Reset Filters</button>
             </div>
             
             <div className="space-y-8">
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Date Range</p>
                   <div className="flex items-center justify-between p-4 bg-gray-25 border border-gray-100 rounded-2xl w-full max-w-md cursor-pointer hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center">
                         <svg className="w-5 h-5 text-gray-400 mr-3 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                         <span className="text-sm font-bold text-gray-700">Mar 1 – Mar 31, 2026</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                   </div>
                </div>

                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Document Types</p>
                   <div className="flex flex-wrap gap-3">
                      {[
                        { name: 'Visit Reports', active: true },
                        { name: 'Care Plans', active: true },
                        { name: 'Medication Logs', active: false },
                        { name: 'Clinical Notes', active: false },
                      ].map(type => (
                        <button key={type.name} className={`px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                          type.active ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white border-gray-100 text-gray-600 hover:border-purple-200 hover:bg-purple-25'
                        }`}>{type.name}</button>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm relative">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-gray-800">Records to Export</h3>
                <button onClick={setSelectAll} className="flex items-center text-[10px] font-bold text-purple-600 uppercase tracking-wide bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
                  Select All
                  {selectedRecordIds.size === exportRows.length && exportRows.length > 0 ? (
                    <div className="ml-3 w-5 h-5 rounded-md border-2 border-purple-600 flex items-center justify-center bg-purple-600">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                  ) : null}
                </button>
             </div>

             <div className="space-y-4">
                {exportRows.map((row) => {
                  const checked = selectedRecordIds.has(row.id);
                  const type = row.status === 'completed' ? 'Report' : 'Active';
                  return (
                  <div key={row.id} onClick={() => toggleRow(row.id)} className="flex items-center p-5 rounded-3xl group hover:bg-gray-25/50 border border-transparent hover:border-gray-50 transition-all cursor-pointer">
                     <div className={`w-5 h-5 rounded-md border-2 border-purple-600 flex items-center justify-center mr-5 shrink-0 ${checked ? 'bg-purple-600' : 'bg-white'}`}>
                        {checked ? <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg> : null}
                     </div>
                     <div className="w-11 h-11 bg-indigo-50 text-indigo-500 rounded-xl ml-1 flex items-center justify-center shrink-0 mr-5 shadow-xs">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{`${row.providerName} (${formatDateLabel(row.date || row.rawDate)})`}</h4>
                        <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tight">{`${row.service} • ${row.timeLabel}`}</p>
                     </div>
                     <span className="text-[9px] font-bold text-gray-400 group-hover:text-purple-600 border border-gray-100 px-3 py-1 rounded-full group-hover:border-purple-200 transition-colors uppercase tracking-widest">{type}</span>
                  </div>
                )})}
             </div>
          </div>
        </div>

        {/* Export Card Right */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col h-full ring-1 ring-gray-25">
             <div className="bg-purple-600 px-10 py-10 relative overflow-hidden">
                <div className="absolute top-8 right-8 text-white/20">
                   <svg className="w-8 h-8 rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Export Summary</h3>
                <p className="text-purple-100 text-sm font-medium leading-relaxed max-w-[200px]">{selectedRows.length} records selected for processing</p>
             </div>
             
             <div className="p-10 flex-1 space-y-10">
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">File Format</p>
                   <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-bold text-gray-700">PDF (Document Format)</span>
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                   </div>
                </div>

                <div className="space-y-4">
                  <button onClick={generatePdf} disabled={isExporting || selectedRows.length === 0} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 transform active:scale-[0.98]">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                    {isExporting ? 'Exporting...' : 'Generate & Export'}
                  </button>
                  <button onClick={() => setActiveTab('main')} className="w-full bg-white text-gray-400 border border-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors group">
                    Cancel
                  </button>
                </div>

                <div className="mt-8 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 flex items-start">
                   <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-blue-500 mr-4 shrink-0 shadow-xs ring-1 ring-blue-100">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                   <p className="text-[9px] text-blue-800/70 leading-relaxed font-medium">Selected reports will be compiled into a detailed branded PDF with PSW+ header and per-visit details.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      ) : null}
      {activeTab === 'main' ? renderMainView() : renderExportView()}
    </div>
  );
};

export default Reports;
