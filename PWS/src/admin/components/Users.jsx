import React, { useMemo, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

const roleLabels = ['All', 'Client', 'PSW', 'Admin'];

const normalizePhotoUrl = (photoUrl) => {
  const trimmed = typeof photoUrl === 'string' ? photoUrl.trim() : '';
  if (!trimmed) return '';
  if (/^file:\/\//i.test(trimmed)) return '';
  return trimmed;
};

const Users = ({ onNavigate }) => {
  const { clients, psws, admins, updateUser, loading, error } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', role: 'Client' });

  const users = useMemo(() => {
    const normalizedClients = clients.map((client) => ({
      id: client.id || client._id,
      _id: client._id,
      name: client.name,
      email: client.email,
      status: client.status,
      sessions: client.sessions,
      photoUrl: normalizePhotoUrl(client.photoUrl),
      roleType: 'Client',
      displayRole: 'Client',
      sourceType: 'Client',
    }));

    const normalizedPsws = psws.map((psw) => ({
      id: psw.id || psw._id,
      _id: psw._id,
      name: psw.name,
      email: psw.email || '',
      status: psw.status,
      rating: psw.rating,
      photoUrl: normalizePhotoUrl(psw.photoUrl),
      roleType: 'PSW',
      displayRole: psw.role || 'PSW',
      sourceType: 'PSW',
    }));

    const normalizedAdmins = admins.map((admin) => ({
      id: admin.id || admin._id,
      _id: admin._id,
      name: admin.name,
      email: admin.email || '',
      status: admin.status || 'Active',
      photoUrl: normalizePhotoUrl(admin.photoUrl),
      roleType: 'Admin',
      displayRole: 'Administrator',
      sourceType: 'Admin',
    }));

    return [...normalizedClients, ...normalizedPsws, ...normalizedAdmins];
  }, [clients, psws, admins]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = [user.name, user.email, user.roleType, user.displayRole, user.status]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = filterRole === 'All' || user.roleType === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setEditData({
      name: user.name,
      email: user.email || '',
      role: user.roleType || 'Client',
    });
  };

  const handleSave = () => {
    if (!selectedUser) return;
    updateUser(selectedUser.id, {
      name: editData.name,
      email: editData.email,
      role: editData.role,
    });
    setSelectedUser({ ...selectedUser, ...editData });
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-5xl font-bold text-gray-900 mb-2 font-serif tracking-tight">Platform Users</h2>
          <p className="text-gray-400 text-sm">Review all registered clients and PSWs, update profiles, and change roles.</p>
        </div>
        <button
          onClick={() => onNavigate('Appointments')}
          className="bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white px-8 py-4 rounded-[1.5rem] text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-100 hover:-translate-y-0.5 transition-transform"
        >
          View Appointments
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 border border-gray-50 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 w-full md:w-auto">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
              <div className="flex items-center gap-3">
                {roleLabels.map((label) => (
                  <button
                    key={label}
                    onClick={() => setFilterRole(label)}
                    className={`text-[10px] font-bold uppercase tracking-widest px-4 py-3 rounded-full transition-all ${filterRole === label ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">User</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Role</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-sm text-gray-400 font-bold uppercase tracking-widest">Loading users...</td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-sm text-gray-400">No users match your search.</td>
                    </tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={`${user.sourceType}-${user.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                            alt={user.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-gray-100"
                          />
                          <div>
                            <p className="font-bold text-sm text-gray-900">{user.name}</p>
                            <p className="text-[11px] text-gray-400">{user.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
                          {user.displayRole}
                        </span>
                      </td>
                      <td className="p-4 align-top text-sm text-gray-500">
                        {user.status || (user.role === 'PSW' ? 'Available' : 'Registered')}
                      </td>
                      <td className="p-4 align-top text-right">
                        <button
                          onClick={() => handleSelectUser(user)}
                          className="text-purple-600 font-bold text-xs uppercase tracking-widest hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Selected user</p>
                <h3 className="text-2xl font-bold text-gray-900">{selectedUser ? selectedUser.name : 'Choose a user'}</h3>
              </div>
              {selectedUser && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-full bg-gray-50 text-gray-500">
                  {selectedUser.sourceType}
                </span>
              )}
            </div>
            {!selectedUser ? (
              <div className="text-sm text-gray-500">Select a user from the list to review and update profile information, photo, or role.</div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <label className="text-xs uppercase tracking-widest text-gray-400">Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full rounded-3xl border border-gray-100 px-4 py-3 text-sm outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-100"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label className="text-xs uppercase tracking-widest text-gray-400">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full rounded-3xl border border-gray-100 px-4 py-3 text-sm outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-100"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label className="text-xs uppercase tracking-widest text-gray-400">Role</label>
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    className="w-full rounded-3xl border border-gray-100 px-4 py-3 text-sm outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-100"
                  >
                    <option value="Client">Client</option>
                    <option value="PSW">PSW</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest">Profile status</p>
                    <p className="text-sm font-bold text-gray-700">{selectedUser.status || 'Active'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-purple-600 text-white py-4 px-8 rounded-3xl text-sm font-bold uppercase tracking-widest hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Quick actions</h4>
            <button
              onClick={() => onNavigate('Clients')}
              className="w-full text-left bg-gray-50 rounded-3xl py-4 px-5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Manage Clients
            </button>
            <button
              onClick={() => onNavigate('PSWs')}
              className="w-full text-left bg-gray-50 rounded-3xl py-4 px-5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors mt-3"
            >
              Manage PSWs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
