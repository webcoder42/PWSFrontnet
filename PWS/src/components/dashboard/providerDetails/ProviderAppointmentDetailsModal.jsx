import React, { useState, useEffect } from 'react';

const ProviderAppointmentDetailsModal = ({ appointment: initialAppointment, onClose, onReschedule, onStatusUpdated }) => {
  const [appointment, setAppointment] = useState(initialAppointment);

  useEffect(() => {
    setAppointment(initialAppointment);
  }, [initialAppointment]);

  if (!appointment) return null;

  const normalizedStatus = (appointment.status || 'pending').toLowerCase();

  const avatarUrl =
    appointment.pswPhotoUrl ||
    appointment.clientPhotoUrl ||
    (appointment.pswId && appointment.pswId.photoUrl) ||
    (appointment.userId && appointment.userId.photoUrl) ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(appointment.psw || appointment.client || 'PSW')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between gap-4 bg-purple-600 px-8 py-6 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-purple-100 font-bold">Care Request details</p>
            <h2 className="text-3xl font-bold">{appointment.type || 'Care Session'}</h2>
          </div>
          <div className="flex items-center gap-3">
           
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Close</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 p-8">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-gray-100 p-6 bg-gray-50 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={avatarUrl}
                  alt={appointment.psw || appointment.client}
                  className="w-20 h-20 rounded-3xl object-cover border border-white shadow-md"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(appointment.psw || appointment.client || 'PSW')}`; }}
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">Assigned PSW</p>
                  <h3 className="text-xl font-bold text-gray-900">{appointment.psw}</h3>
                  <p className="text-sm text-gray-500">{appointment.client}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 p-6 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Session summary</h4>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Client</span>
                  <span>{appointment.client}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Service</span>
                  <span>{appointment.type || 'Care Session'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Date</span>
                  <span>{appointment.date || 'TBD'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Time</span>
                  <span>{appointment.time || 'TBD'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Location</span>
                  <span>{appointment.location || 'Client home'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Duration</span>
                  <span>{appointment.duration || '1 hour'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Status</span>
                  <span className={`uppercase text-[11px] font-bold tracking-[0.2em] text-white px-3 py-1 rounded-full ${
                    normalizedStatus === 'completed'
                      ? 'bg-emerald-600'
                      : normalizedStatus === 'confirmed' || appointment.status === 'Active'
                      ? 'bg-purple-600'
                      : normalizedStatus === 'pending'
                      ? 'bg-orange-500'
                      : normalizedStatus === 'cancelled'
                      ? 'bg-rose-600'
                      : 'bg-gray-500'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 p-6 shadow-sm bg-white flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">Booking details</h4>
                <div className="grid gap-4 text-sm text-gray-600">
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium text-gray-900">Provider</span>
                    <span>{appointment.psw}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium text-gray-900">Client</span>
                    <span>{appointment.client}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium text-gray-900">Cost</span>
                    <span>$${(appointment.price ?? 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {(appointment.payment) && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">Payment info</h4>
                  <div className="grid gap-3 text-sm text-gray-600 bg-gray-50 rounded-3xl p-5 border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Status</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        appointment.payment.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        appointment.payment.status === 'refunded' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>{appointment.payment.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Amount</span>
                      <span className="font-bold">${(appointment.payment.amount || appointment.price || 0).toFixed(2)}</span>
                    </div>
                    {appointment.payment.grossAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Gross Amount</span>
                        <span>${appointment.payment.grossAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {appointment.payment.platformFee > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Platform Fee</span>
                        <span className="text-gray-400">-${appointment.payment.platformFee.toFixed(2)}</span>
                      </div>
                    )}
                    {appointment.payment.netAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Net to PSW</span>
                        <span className="font-bold text-purple-600">${appointment.payment.netAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {appointment.payment.paymentMethodId && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Payment Method</span>
                        <span className="text-[10px] font-mono text-gray-500 truncate max-w-[150px]" title={appointment.payment.paymentMethodId}>{appointment.payment.paymentMethodId.slice(0, 20)}...</span>
                      </div>
                    )}
                    {appointment.payment.chargeId && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Charge ID</span>
                        <span className="text-[10px] font-mono text-gray-500 truncate max-w-[150px]" title={appointment.payment.chargeId}>{appointment.payment.chargeId.slice(0, 20)}...</span>
                      </div>
                    )}
                    {appointment.payment.paidAt && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Paid At</span>
                        <span className="text-xs">{new Date(appointment.payment.paidAt).toLocaleString()}</span>
                      </div>
                    )}
                    {appointment.payment.paymentIntentId && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Intent ID</span>
                        <span className="text-[10px] font-mono text-gray-500 truncate max-w-[150px]" title={appointment.payment.paymentIntentId}>{appointment.payment.paymentIntentId.slice(0, 20)}...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-3">Notes</p>
                <p className="text-sm text-gray-500">Use this view to confirm assignment details, reschedule the appointment, or contact the client for any changes.</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {/* Footer area reserved for provider-only actions if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderAppointmentDetailsModal;
