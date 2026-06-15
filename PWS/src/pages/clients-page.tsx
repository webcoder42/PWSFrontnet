import React, { useEffect, useMemo, useState } from 'react';

import { clsx } from 'clsx';
import {
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineArrowRight,
  HiOutlineStar,
  HiOutlineXCircle
} from 'react-icons/hi';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import { useUser } from '../context/UserContext';
import { getAppointmentsByPswAPI, getUserProfileAPI } from '../utils/api';
import { getLoggedInUserId } from '../utils/appointmentHelpers';
import {
  buildPswClientsFromAppointments,
  getClientsPageSummary,
  mergeUserProfileIntoClient,
  type PswClient,
} from '../utils/pswClientHelpers';

const ClientProfileModal: React.FC<{ client: PswClient; onClose: () => void; loading?: boolean }> = ({ client, onClose, loading }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Care Needs'>('Overview');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-4xl shadow-xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500">
        <div className="px-8 pt-8 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="size-20 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <img src={client.image} alt={client.name} className="size-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">{client.name}</h2>
              <p className="text-sm text-gray-400 font-medium font-dm mt-1">
                {client.type} • {client.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 duration-300"
          >
            <HiOutlineXCircle className="size-6" />
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="flex items-center gap-8 border-b border-gray-50 mb-8 mt-4">
            {['Overview', 'Care Needs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={clsx(
                  "pb-4 text-sm font-bold font-dm relative duration-300",
                  activeTab === tab ? "text-primary" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in slide-in-from-left duration-300" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[350px]">
            {loading && (
              <p className="text-sm text-gray-400 font-dm text-center py-12">Loading profile...</p>
            )}
            {!loading && activeTab === 'Overview' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-50 space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Legal Name</p>
                      <p className="text-sm font-bold text-gray-900 font-dm">{client.details.fullName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Age</p>
                        <p className="text-sm font-bold text-gray-900 font-dm">
                          {typeof client.details.age === 'number' ? `${client.details.age} years` : client.details.age}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                        <p className="text-sm font-bold text-gray-900 font-dm">{client.details.gender}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Languages</p>
                      <div className="flex flex-wrap gap-1.5">
                        {client.details.languages.map(lang => (
                          <span key={lang} className="px-2.5 py-1 bg-white text-gray-600 text-[10px] font-bold rounded-lg border border-gray-100 font-dm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-50 space-y-6">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Contact Details</p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold mb-0.5">Phone</p>
                        <p className="text-sm font-bold text-gray-900 font-dm">{client.details.phone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold mb-0.5">Email</p>
                        <p className="text-sm font-bold text-gray-900 font-dm truncate">{client.details.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold mb-0.5">Address</p>
                        <p className="text-sm font-bold text-gray-900 font-dm leading-tight">{client.details.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Emergency Contact</p>
                    <p className="text-sm font-bold text-gray-900 font-dm">{client.details.emergencyContact.name}</p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">{client.details.emergencyContact.relation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold mb-1">Direct Line</p>
                    <p className="text-base font-bold text-primary font-dm tracking-tight">{client.details.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {!loading && activeTab === 'Care Needs' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Patient Height</p>
                    <p className="text-xl font-bold text-gray-900 font-dm">{client.details.physicalStats.height}</p>
                  </div>
                  <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Patient Weight</p>
                    <p className="text-xl font-bold text-gray-900 font-dm">{client.details.physicalStats.weight}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Care Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {client.details.careConditions.map(cond => (
                        <span key={cond} className="px-4 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-2xl border border-gray-100">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Services Needed</p>
                    <div className="flex flex-wrap gap-2">
                      {client.details.careServices.map(service => (
                        <span key={service} className="px-4 py-2 bg-primary/5 text-primary text-xs font-bold rounded-2xl border border-primary/10">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientCard: React.FC<{ client: PswClient; onViewProfile: (client: PswClient) => void }> = ({ client, onViewProfile }) => {

  return (
    <div className={clsx(
      "bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 duration-500 group",
      client.status === 'INACTIVE' && "opacity-80"
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6 sm:mb-8">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="size-14 sm:size-20 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm shrink-0">
            <img src={client.image} alt={client.name} className="size-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-lg sm:text-2xl font-bold text-gray-900 font-playfair truncate">{client.name}</h4>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-sm text-gray-400 font-medium font-dm mt-0.5 sm:mt-1">
              <span>{client.type}</span>
              <span className="size-1 rounded-full bg-gray-300 hidden xs:block" />
              <span>{client.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start sm:justify-end shrink-0">
          <span className={clsx(
            "px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl",
            client.status === 'ACTIVE' ? "bg-primary/5 text-primary" :
              client.status === 'NEW' ? "bg-green-50 text-green-600" :
                "bg-gray-50 text-gray-400"
          )}>
            {client.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-5 sm:py-8 border-y border-gray-50">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest">Total Visits</p>
          <p className="text-xl sm:text-2xl font-bold text-primary font-dm">{client.stats.totalVisits}</p>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest">Hrs This Month</p>
          <p className="text-xl sm:text-2xl font-bold text-primary font-dm">{client.stats.hrsThisMonth}</p>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest">Rating</p>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="text-xl sm:text-2xl font-bold text-primary font-dm">{client.stats.rating}</p>
            <HiOutlineStar className="size-3.5 sm:size-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest">Client Since</p>
          <p className="text-xl sm:text-2xl font-bold text-primary font-dm">{client.stats.since}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center flex-wrap justify-between gap-6 mt-6 sm:mt-8">
        <div className="flex items-center gap-4">
          <div className={clsx(
            "size-10 sm:size-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
            client.status === 'INACTIVE' ? "bg-gray-50 text-gray-300" : "bg-primary/5 text-primary"
          )}>
            <HiOutlineCalendar className="size-5 sm:size-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">Next Appointment</p>
            <p className={clsx(
              "text-xs sm:text-sm font-bold font-dm mt-0.5 truncate",
              client.status === 'INACTIVE' ? "text-gray-300" : "text-gray-900"
            )}>
              {client.nextAppointment.date}, {client.nextAppointment.time}
            </p>
          </div>
        </div>

        <button
          onClick={() => onViewProfile(client)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-purple text-white rounded-xl text-sm font-bold font-dm hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] duration-300 shrink-0"
        >
          View Profile <HiOutlineArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

const ClientsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<PswClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<PswClient | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { rawUser, profile } = useUser();

  const tabs = ['All Clients', 'Active', 'New', 'Inactive'];

  useEffect(() => {
    const fetchClients = async () => {
      const pswId = getLoggedInUserId(rawUser, profile);
      if (!pswId) {
        setLoading(false);
        setError('Please sign in to view your clients.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getAppointmentsByPswAPI(pswId);
        if (response.success) {
          setClients(buildPswClientsFromAppointments(response.data || []));
        } else {
          throw new Error(response.message || 'Failed to load clients');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load clients';
        setError(message);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [rawUser?._id, rawUser?.id, profile?.id]);

  const pageSummary = useMemo(() => getClientsPageSummary(clients), [clients]);

  const filteredClients = clients.filter(client => {
    const tabStatus = activeTab === 'Active' ? 'ACTIVE' : activeTab === 'New' ? 'NEW' : activeTab === 'Inactive' ? 'INACTIVE' : '';
    const matchesTab = activeTab === 'All Clients' || client.status === tabStatus;
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleViewProfile = async (client: PswClient) => {
    setSelectedClient(client);
    setProfileLoading(true);
    try {
      const response = await getUserProfileAPI(client.userId);
      if (response.success && response.data) {
        setSelectedClient(mergeUserProfileIntoClient(client, response.data as Record<string, unknown>));
      }
    } catch (err) {
      console.error('Failed to load client profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-8 custom-scrollbar">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-playfair mb-2">My Clients</h1>
              <p className="text-sm lg:text-base text-gray-400 font-medium font-dm">
                {pageSummary.active} active client{pageSummary.active === 1 ? '' : 's'}
                {pageSummary.newThisMonth > 0
                  ? ` · ${pageSummary.newThisMonth} new this month`
                  : ''}
              </p>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap items-center gap-2 sm:gap-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-bold font-dm duration-300 whitespace-nowrap shrink-0",
                  activeTab === tab
                    ? 'bg-gradient-purple text-white'
                    : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative group">
            <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 size-6 text-gray-400 group-focus-within:text-primary duration-300" />
            <input
              type="text"
              placeholder="Search by name or condition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-16 pr-8 bg-white rounded-xl border border-gray-100 shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none font-dm font-medium text-gray-900 placeholder:text-gray-400 duration-300"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full bg-white rounded-5xl border border-gray-100 p-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-gray-400 font-medium font-dm">Loading your clients...</p>
              </div>
            ) : error ? (
              <div className="col-span-full bg-white rounded-5xl border border-red-100 p-20 text-center">
                <p className="text-red-500 font-medium font-dm">{error}</p>
              </div>
            ) : filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onViewProfile={handleViewProfile}
                />
              ))
            ) : (
              <div className="col-span-full bg-white rounded-5xl border border-dashed border-gray-200 p-20 text-center">
                <p className="text-gray-400 font-medium font-dm text-lg">
                  {clients.length === 0
                    ? 'No clients yet. When someone books an appointment with you, they will appear here.'
                    : 'No clients found matching your search.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedClient && (
        <ClientProfileModal
          client={selectedClient}
          loading={profileLoading}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
};

export default ClientsPage;
