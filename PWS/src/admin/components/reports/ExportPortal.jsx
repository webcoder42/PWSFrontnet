import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { fetchAdminExportReportAPI } from '../../../utils/adminApi';

const REPORT_TYPES = [
  { key: 'psw-performance', name: 'PSW Utilization – Report', sub: 'Performance Report', type: 'Report', color: 'bg-indigo-50 text-indigo-500' },
  { key: 'client-reports', name: 'Client Satisfaction Report', sub: 'Analytics Report', type: 'Survey', color: 'bg-blue-50 text-blue-500' },
  { key: 'billing-summaries', name: 'Revenue & Billing Summary', sub: 'Financial Report', type: 'Finance', color: 'bg-emerald-50 text-emerald-500' },
  { key: 'compliance-logs', name: 'PSW Compliance Audit Log', sub: 'Compliance Report', type: 'Audit', color: 'bg-orange-50 text-orange-500' },
];

const generatePDF = (reportType, data) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  let y = 20;
  const margin = 20;
  const contentWidth = pageW - margin * 2;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const ensureSpace = (needed) => {
    if (y + needed > pageH - margin) {
      addPage();
    }
  };

  const formatAmount = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[^0-9.\-]/g, ''));
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const renderKeyValue = (label, value, color = [55, 65, 81]) => {
    const displayValue = value !== undefined && value !== null ? String(value) : '—';
    const text = `${label}: ${displayValue}`;
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.setTextColor(...color);
    doc.text(lines, margin, y);
    y += lines.length * 5;
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(reportType, margin, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
  doc.text(`Records: ${data.length}`, pageW - margin, y, { align: 'right' });
  y += 8;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  if (data.length === 0) {
    doc.setFontSize(11);
    doc.text('No records found.', margin, y);
    return doc;
  }

  const isPswReport = reportType.toLowerCase().includes('psw utilization');

  if (isPswReport) {
    const groups = data.reduce((acc, row) => {
      const key = `${row.psw || 'Unknown'}||${row.client || 'Unknown'}`;
      if (!acc[key]) {
        acc[key] = {
          psw: row.psw || 'Unknown',
          pswEmail: row.pswEmail || '',
          client: row.client || 'Unknown',
          clientEmail: row.clientEmail || '',
          rows: [],
        };
      }
      acc[key].rows.push(row);
      return acc;
    }, {});

    Object.values(groups).forEach((group, gi) => {
      ensureSpace(50);
      doc.setFillColor(79, 70, 229);
      doc.rect(margin, y - 5, contentWidth, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(`${group.psw}`, margin + 2, y + 2);
      doc.text(`Client: ${group.client}`, pageW - margin - 2, y + 2, { align: 'right' });
      y += 12;
      doc.setFontSize(8);
      doc.text(group.pswEmail || ' ', margin + 2, y + 2);
      doc.text(group.clientEmail || ' ', pageW - margin - 2, y + 2, { align: 'right' });
      y += 10;
      doc.setTextColor(17, 24, 39);

      let subtotal = 0;
      let paidCount = 0;
      let unpaidCount = 0;

      group.rows.forEach((row, index) => {
        ensureSpace(45);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(`Appointment ${index + 1}`, margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        renderKeyValue('Service', row.service, [31, 41, 55]);
        renderKeyValue('Appointment Date', row.appointmentDate || row.date, [31, 41, 55]);
        renderKeyValue('Time', row.time, [31, 41, 55]);
        renderKeyValue('Duration', row.duration, [31, 41, 55]);
        renderKeyValue('Location', row.location, [31, 41, 55]);

        const paymentColor = String(row.paymentStatus || '').toLowerCase() === 'paid' ? [16, 185, 129] : [239, 68, 68];
        renderKeyValue('Amount', row.amount, [31, 41, 55]);
        renderKeyValue('Payment Status', row.paymentStatus, paymentColor);
        renderKeyValue('Status', row.status, [113, 128, 150]);
        renderKeyValue('Payment Released', row.paymentReleasedStatus, String(row.paymentReleasedStatus || '').toLowerCase() === 'released' ? [16, 185, 129] : [239, 68, 68]);
        ensureSpace(8);
        y += 4;

        const amountValue = formatAmount(row.amount);
        subtotal += amountValue;
        if (String(row.paymentStatus || '').toLowerCase() === 'paid') {
          paidCount += 1;
        } else {
          unpaidCount += 1;
        }
      });

      ensureSpace(30);
      doc.setFillColor(237, 242, 247);
      doc.rect(margin, y - 4, contentWidth, 18, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(`Subtotal for ${group.rows.length} appointment${group.rows.length > 1 ? 's' : ''}`, margin + 2, y + 6);
      doc.text(`$${subtotal.toFixed(2)}`, pageW - margin - 2, y + 6, { align: 'right' });
      y += 22;

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y - 6, pageW - margin, y - 6);
      y += 2;
    });
  } else {
    const keys = Object.keys(data[0]);
    const colWidths = [];
    const usable = contentWidth - 4;
    const evenW = usable / keys.length;
    keys.forEach(() => colWidths.push(evenW));

    doc.setFillColor(88, 28, 135);
    doc.rect(margin, y - 4, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    let x = margin + 2;
    keys.forEach((k, i) => {
      doc.text(k.toUpperCase(), x, y + 1);
      x += colWidths[i];
    });
    y += 8;
    doc.setTextColor(50, 50, 50);

    data.forEach((row, ri) => {
      if (y > pageH - margin - 20) {
        addPage();
        doc.setFillColor(88, 28, 135);
        doc.rect(margin, y - 4, contentWidth, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        let x2 = margin + 2;
        keys.forEach((k, i) => {
          doc.text(k.toUpperCase(), x2, y + 1);
          x2 += colWidths[i];
        });
        y += 8;
        doc.setTextColor(50, 50, 50);
      }

      if (ri % 2 === 0) {
        doc.setFillColor(245, 245, 250);
        doc.rect(margin, y - 3, contentWidth, 7, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      let x = margin + 2;
      keys.forEach((k, i) => {
        const val = String(row[k] ?? '');
        const display = val.length > 30 ? val.slice(0, 29) + '…' : val;
        doc.text(display, x, y + 1);
        x += colWidths[i];
      });
      y += 7;
    });
  }

  return doc;
};

const ExportPortal = ({ selectedExports, toggleExport, toggleAllExports, onCancel }) => {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleExport = async () => {
    setExporting(true);
    setExportError('');
    try {
      const selected = REPORT_TYPES.filter((_, i) => selectedExports.includes(i));
      for (const report of selected) {
        const res = await fetchAdminExportReportAPI(report.key, selectedMonth);
        if (res.success) {
          const doc = generatePDF(report.name, res.data || []);
          const now = new Date().toISOString().split('T')[0];
          doc.save(`${report.key}-${now}.pdf`);
        }
      }
    } catch (err) {
      setExportError(err.message || 'Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Export Reports</h2>
        <p className="text-gray-400 text-sm">Generate and export platform analytics and operational reports.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800">Selection Filters</h3>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Date Range</p>
                <div className="flex items-center justify-between p-4 bg-gray-25 border border-gray-100 rounded-2xl w-full max-w-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span className="text-sm font-bold text-gray-700">Month</span>
                  </div>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white"
                  />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Report Types</p>
                <div className="flex flex-wrap gap-3">
                  {REPORT_TYPES.map((type, i) => (
                    <button
                      key={type.key}
                      onClick={() => toggleExport(i)}
                      className={`px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                        selectedExports.includes(i) ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white border-gray-100 text-gray-600 hover:border-purple-200 hover:bg-purple-25'
                      }`}
                    >{type.type}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-gray-800">Records to Export</h3>
              <button onClick={toggleAllExports} className="flex items-center text-[10px] font-bold text-purple-600 uppercase tracking-wide bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
                {selectedExports.length === REPORT_TYPES.length ? 'Deselect All' : 'Select All'}
                <div className={`ml-3 w-5 h-5 rounded-md border-2 flex items-center justify-center ${selectedExports.length === REPORT_TYPES.length ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'}`}>
                  {selectedExports.length === REPORT_TYPES.length && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                </div>
              </button>
            </div>
            <div className="space-y-4">
              {REPORT_TYPES.map((row, i) => (
                <div key={row.key} onClick={() => toggleExport(i)} className="flex items-center p-5 rounded-3xl group hover:bg-gray-25/50 border border-transparent hover:border-gray-50 transition-all cursor-pointer">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mr-5 shrink-0 transition-colors ${selectedExports.includes(i) ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'}`}>
                    {selectedExports.includes(i) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                  </div>
                  <div className={`w-11 h-11 ${row.color} rounded-xl ml-1 flex items-center justify-center shrink-0 mr-5 shadow-xs`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{row.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tight">{row.sub}</p>
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 group-hover:text-purple-600 border border-gray-100 px-3 py-1 rounded-full group-hover:border-purple-200 transition-colors uppercase tracking-widest">{row.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col h-full ring-1 ring-gray-25">
            <div className="bg-purple-600 px-10 py-10 relative overflow-hidden">
              <div className="absolute top-8 right-8 text-white/20">
                <svg className="w-8 h-8 rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Export Summary</h3>
              <p className="text-purple-100 text-sm font-medium leading-relaxed max-w-[200px]">{selectedExports.length} report{selectedExports.length !== 1 ? 's' : ''} selected for processing</p>
            </div>
            <div className="p-10 flex-1 space-y-10">
              {exportError && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-xs font-medium text-rose-600">{exportError}</div>
              )}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">File Format</p>
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="text-sm font-bold text-gray-700">PDF (Document Format)</span>
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  onClick={handleExport}
                  disabled={exporting || selectedExports.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                  {exporting ? 'Exporting...' : 'Generate & Export'}
                </button>
                <button onClick={onCancel} className="w-full bg-white text-gray-400 border border-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors group">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPortal;
