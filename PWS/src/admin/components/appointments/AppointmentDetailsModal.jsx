import React from 'react';

const AppointmentDetailsModal = ({ appointment, onClose, onReschedule }) => {
  if (!appointment) return null;

  const avatarUrl = appointment.pswPhotoUrl || appointment.clientPhotoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(appointment.psw || appointment.client || 'PSW')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between gap-4 bg-purple-600 px-8 py-6 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-purple-100 font-bold">Appointment details</p>
            <h2 className="text-3xl font-bold">{appointment.type || 'Care Session'}</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Close</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 p-8">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-gray-100 p-6 bg-gray-50 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={avatarUrl} alt={appointment.psw || appointment.client} className="w-20 h-20 rounded-3xl object-cover border border-white shadow-md" />
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
                {appointment.rating != null && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Rating</span>
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                      <span>{appointment.rating.toFixed(1)}</span>
                      <svg className="w-4 h-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Status</span>
                  <span className={`uppercase text-[11px] font-bold tracking-[0.2em] text-white px-3 py-1 rounded-full ${
                    appointment.status === 'Active'
                      ? 'bg-purple-600'
                      : appointment.status === 'Pending'
                      ? 'bg-orange-500'
                      : appointment.status === 'Completed'
                      ? 'bg-emerald-600'
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
                    <span>${appointment.price ?? 0}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-3">Notes</p>
                <p className="text-sm text-gray-500">Use this view to confirm assignment details, reschedule the appointment, or contact the client for any changes.</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <button
                type="button"
                onClick={() => onReschedule?.(appointment)}
                className="w-full bg-purple-600 text-white py-4 rounded-3xl text-sm font-bold uppercase tracking-widest hover:bg-purple-700 transition-colors"
              >
                Reschedule Appointment
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-3xl text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
