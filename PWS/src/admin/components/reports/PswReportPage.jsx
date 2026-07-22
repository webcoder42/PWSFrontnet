import React, { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { fetchAdminExportReportAPI } from '../../../utils/adminApi';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const getDefaultMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const formatAmount = (str) => {
  if (typeof str === 'number') return str;
  const parsed = parseFloat(String(str).replace(/[^0-9.\-]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const STATUS_ORDER = ['Completed', 'Pending', 'Cancelled'];

const groupByPsw = (data) => {
  const groups = {};
  data.forEach((row) => {
    const key = row.psw || 'Unknown';
    if (!groups[key]) {
      groups[key] = { psw: key, pswEmail: row.pswEmail || '', appointments: [] };
    }
    groups[key].appointments.push(row);
  });
  return Object.values(groups);
};

const generatePdf = (groups, monthLabel) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageW - margin * 2;
  let y = 20;

  const addPage = () => { doc.addPage(); y = margin; };
  const ensureSpace = (needed) => { if (y + needed > pageH - margin) addPage(); };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('PSW Report', margin, y);
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Month: ${monthLabel}`, margin, y);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - margin, y, { align: 'right' });
  y += 6;
  doc.text(`Total PSWs: ${groups.length}`, margin, y);
  y += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  let grandTotal = 0;
  let grandPaid = 0;

  groups.forEach((group, gi) => {
    ensureSpace(50);
    doc.setFillColor(79, 70, 229);
    doc.rect(margin, y - 5, contentWidth, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(group.psw, margin + 2, y + 2);
    doc.text(`${group.appointments.length} appointment${group.appointments.length > 1 ? 's' : ''}`, pageW - margin - 2, y + 2, { align: 'right' });
    y += 14;

    let subtotal = 0;
    let paidCount = 0;

    group.appointments.forEach((row, idx) => {
      ensureSpace(42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(31, 41, 55);
      doc.text(`#${idx + 1} ${row.service || 'N/A'}`, margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const lines = [
        `Date: ${row.appointmentDate || row.date || 'N/A'}  |  Time: ${row.time || 'N/A'}  |  Duration: ${row.duration || 'N/A'}`,
        `Location: ${row.location || 'N/A'}  |  Status: ${row.status || 'N/A'}  |  Payment: ${row.paymentStatus || 'N/A'}`,
        `Client: ${row.client || 'N/A'}  |  Amount: ${row.amount || '$0.00'}`,
      ];
      lines.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, contentWidth);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 4.5;
      });
      y += 3;

      const amt = formatAmount(row.amount);
      subtotal += amt;
      if (String(row.paymentStatus || '').toLowerCase() === 'paid') paidCount++;
    });

    ensureSpace(25);
    doc.setFillColor(237, 242, 247);
    doc.rect(margin, y - 4, contentWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Subtotal (${group.appointments.length} appointment${group.appointments.length > 1 ? 's' : ''})`, margin + 2, y + 6);
    doc.text(`$${subtotal.toFixed(2)}`, pageW - margin - 2, y + 6, { align: 'right' });
    y += 20;

    grandTotal += subtotal;
    grandPaid += paidCount;
  });

  ensureSpace(30);
  doc.setFillColor(79, 70, 229);
  doc.rect(margin, y - 5, contentWidth, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`Grand Total (${groups.length} PSWs)`, margin + 2, y + 5);
  doc.text(`$${grandTotal.toFixed(2)}`, pageW - margin - 2, y + 5, { align: 'right' });

  return doc;
};

const PswReportPage = ({ onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAdminExportReportAPI('psw-performance', selectedMonth);
      if (res.success) {
        setData(res.data || []);
      } else {
        setError(res.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const groups = groupByPsw(data);

  const handleDownloadPdf = async () => {
    setExporting(true);
    try {
      const [year, monthNum] = selectedMonth.split('-');
      const monthLabel = `${MONTHS[parseInt(monthNum, 10) - 1]} ${year}`;
      const doc = generatePdf(groups, monthLabel);
      doc.save(`psw-report-${selectedMonth}.pdf`);
    } catch (err) {
      setError(err.message || 'PDF generation failed');
    } finally {
      setExporting(false);
    }
  };

  const monthLabel = (() => {
    const [y, m] = selectedMonth.split('-');
    return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
  })();

  const completedTotal = data.filter((r) => String(r.status || '').toLowerCase() === 'completed').length;
  const pendingTotal = data.filter((r) => String(r.status || '').toLowerCase() === 'pending').length;
  const cancelledTotal = data.filter((r) => String(r.status || '').toLowerCase() === 'cancelled').length;
  const grandTotal = groups.reduce((sum, g) => sum + g.appointments.reduce((s, r) => s + formatAmount(r.amount), 0), 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <h2 className="text-4xl font-bold text-gray-900 font-serif">PSW Report</h2>
          </div>
          <p className="text-gray-400 text-sm ml-9">View PSW appointment details, amounts, and generate reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white shadow-sm"
          />
          <button
            onClick={handleDownloadPdf}
            disabled={exporting || data.length === 0}
            className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm flex items-center hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            {exporting ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-100 rounded-2xl p-4 text-sm font-medium text-rose-600">{error}</div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Appointments</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data.length}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Completed</p>
          <p className="text-3xl font-bold text-emerald-700 mt-2">{completedTotal}</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Pending</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">{pendingTotal}</p>
        </div>
        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Cancelled</p>
          <p className="text-3xl font-bold text-rose-700 mt-2">{cancelledTotal}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">PSW Performance — {monthLabel}</h3>
            <p className="text-xs text-gray-400 mt-1">{groups.length} PSW{groups.length !== 1 ? 's' : ''} · {data.length} appointment{data.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grand Total</span>
            <p className="text-2xl font-bold text-purple-600">${grandTotal.toFixed(2)}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <p className="text-gray-400 font-medium">No appointments found for {monthLabel}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {groups.map((group) => {
              const pswSubtotal = group.appointments.reduce((s, r) => s + formatAmount(r.amount), 0);
              const pswCompleted = group.appointments.filter((r) => String(r.status || '').toLowerCase() === 'completed').length;
              const pswPending = group.appointments.filter((r) => String(r.status || '').toLowerCase() === 'pending').length;
              const pswCancelled = group.appointments.filter((r) => String(r.status || '').toLowerCase() === 'cancelled').length;

              return (
                <div key={group.psw} className="px-8 py-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                        {group.psw.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900">{group.psw}</h4>
                        <p className="text-[11px] text-gray-400">{group.pswEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="text-emerald-600">{pswCompleted} completed</span>
                      <span className="text-orange-600">{pswPending} pending</span>
                      <span className="text-rose-600">{pswCancelled} cancelled</span>
                      <span className="text-gray-900 bg-gray-100 px-4 py-1.5 rounded-full">${pswSubtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-25 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <th className="text-left px-4 py-3">#</th>
                          <th className="text-left px-4 py-3">Service</th>
                          <th className="text-left px-4 py-3">Date</th>
                          <th className="text-left px-4 py-3">Time</th>
                          <th className="text-left px-4 py-3">Duration</th>
                          <th className="text-left px-4 py-3">Amount</th>
                          <th className="text-left px-4 py-3">Payment</th>
                          <th className="text-left px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-25">
                        {group.appointments.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-25/50 transition-colors">
                            <td className="px-4 py-3 text-gray-400 font-bold text-xs">{idx + 1}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{row.service || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-600">{row.appointmentDate || row.date || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-600">{row.time || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-600">{row.duration || 'N/A'}</td>
                            <td className="px-4 py-3 font-bold text-gray-900">{row.amount || '$0.00'}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                String(row.paymentStatus || '').toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                String(row.paymentStatus || '').toLowerCase() === 'refunded' ? 'bg-rose-50 text-rose-600' :
                                'bg-amber-50 text-amber-600'
                              }`}>{row.paymentStatus || 'unpaid'}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                String(row.status || '').toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                String(row.status || '').toLowerCase() === 'cancelled' ? 'bg-rose-50 text-rose-600' :
                                'bg-orange-50 text-orange-600'
                              }`}>{row.status || 'pending'}</span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-25/70">
                          <td colSpan={5} className="px-4 py-3 text-right font-bold text-gray-700 text-xs uppercase tracking-wider">Subtotal ({group.appointments.length} appointment{group.appointments.length > 1 ? 's' : ''})</td>
                          <td className="px-4 py-3 font-bold text-purple-600">${pswSubtotal.toFixed(2)}</td>
                          <td colSpan={2}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            <div className="px-8 py-5 bg-purple-50 border-t-2 border-purple-100 flex items-center justify-between">
              <span className="font-bold text-gray-800">Grand Total ({groups.length} PSW{groups.length !== 1 ? 's' : ''})</span>
              <span className="text-2xl font-bold text-purple-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PswReportPage;
