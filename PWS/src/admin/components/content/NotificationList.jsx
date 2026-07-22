import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminBroadcastsAPI, sendAdminBroadcastAPI } from '../../../utils/adminApi';

const NotificationList = ({ notifications }) => {
  const queryClient = useQueryClient();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [target, setTarget] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);

  const { data: broadcasts = [] } = useQuery({
    queryKey: ['admin', 'broadcasts'],
    queryFn: () => fetchAdminBroadcastsAPI().then(r => (Array.isArray(r.data) ? r.data : [])),
  });

  const sendMutation = useMutation({
    mutationFn: (payload) => sendAdminBroadcastAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'broadcasts'] });
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setFeedback({ type: 'error', message: 'Please add both a subject and message.' });
      return;
    }

    setFeedback({ type: '', message: '' });

    try {
      const data = await sendMutation.mutateAsync({ target, subject: subject.trim(), message: message.trim() });
      setFeedback({ type: 'success', message: data.message || 'Broadcast sent successfully.' });
      setSubject('');
      setMessage('');
      setTarget('all');
      setIsComposerOpen(false);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Unable to send the broadcast.' });
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
      <div className="p-10 border-b border-gray-50 flex justify-between items-center gap-4">
        <h3 className="text-2xl font-bold font-serif">System Notifications</h3>
        <button
          onClick={() => {
            setIsComposerOpen((prev) => !prev);
            setFeedback({ type: '', message: '' });
          }}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-purple-200"
        >
          {isComposerOpen ? 'Close' : 'New Broadcast'}
        </button>
      </div>

      {isComposerOpen && (
        <form onSubmit={handleSubmit} className="p-8 border-b border-gray-50 bg-gray-50/60 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm font-semibold text-gray-700">
              Send to
              <select value={target} onChange={(event) => setTarget(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-purple-500 focus:outline-none">
                <option value="all">All Users</option>
                <option value="clients">Clients</option>
                <option value="psws">PSWs</option>
                <option value="admins">Admins</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-gray-700">
              Subject
              <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Announcement title" className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-purple-500 focus:outline-none" />
            </label>
          </div>
          <label className="block text-sm font-semibold text-gray-700">
            Message
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows="4" placeholder="Write the email message to send" className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-purple-500 focus:outline-none" />
          </label>
          {feedback.message && (
            <div className={`rounded-xl px-4 py-3 text-sm ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {feedback.message}
            </div>
          )}
          <div className="flex justify-end">
            <button type="submit" disabled={sendMutation.isPending} className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
              {sendMutation.isPending ? 'Sending...' : 'Send Broadcast'}
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-gray-50">
        {(broadcasts.length ? broadcasts : notifications).map((n) => {
          const title = n.subject || n.title || 'Broadcast';
          const target = n.targetLabel || n.target || 'All Users';
          const status = n.status === 'sent' ? 'Sent' : n.status === 'partially_failed' ? 'Partially Sent' : n.status === 'failed' ? 'Failed' : n.status || 'Sending';
          const createdAt = n.createdAt || n.created_at;
          const id = n.id || n._id;
          return (
            <div key={id} className="p-8 hover:bg-gray-25/30 transition-all group flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">Broadcast</span>
                    <span className="text-xs text-gray-400 font-medium">Target: {target}</span>
                    {createdAt && <span className="text-xs text-gray-400 font-medium">{new Date(createdAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status === 'Sent' || status === 'sent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'} border`}>
                  {status}
                </span>
                <button onClick={() => setSelectedBroadcast(n)} className="text-gray-400 hover:text-purple-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600">Broadcast Details</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">{selectedBroadcast.subject || selectedBroadcast.title}</h3>
              </div>
              <button onClick={() => setSelectedBroadcast(null)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">✕</button>
            </div>
            <div className="mt-6 space-y-4 text-sm text-gray-600">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Audience</p>
                <p className="mt-2 font-semibold text-gray-900">{selectedBroadcast.targetLabel || selectedBroadcast.target || 'All Users'}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-gray-700">{selectedBroadcast.message}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Delivery</p>
                <p className="mt-2">Sent: {selectedBroadcast.deliveredCount ?? selectedBroadcast.delivered ?? 0} · Failed: {selectedBroadcast.failedCount ?? selectedBroadcast.failed ?? 0} · Total: {selectedBroadcast.totalRecipients ?? selectedBroadcast.recipients?.length ?? 0}</p>
              </div>
              {Array.isArray(selectedBroadcast.recipients) && selectedBroadcast.recipients.length > 0 && (
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Recipients</p>
                  <ul className="mt-3 max-h-48 space-y-2 overflow-auto">
                    {selectedBroadcast.recipients.map((recipient, index) => (
                      <li key={`${recipient.email}-${index}`} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-gray-700">
                        <span>{recipient.name || recipient.email}</span>
                        <span className={`text-xs font-semibold ${recipient.status === 'sent' ? 'text-emerald-600' : 'text-rose-600'}`}>{recipient.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
