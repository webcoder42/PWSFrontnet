import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ClientsHeader from './clients/ClientsHeader';
import ClientsStats from './clients/ClientsStats';
import ClientList from './clients/ClientList';
import AddClient from './clients/AddClient';
import ClientDetail from './clients/ClientDetail';

const Clients = ({ onNavigate }) => {
  const { clients, addClient, loading, error } = useAdmin();
  const [view, setView] = useState('list'); 
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', status: 'Pending' });

  const handleAdd = () => {
    if (!formData.name || !formData.email) return;
    addClient(formData);
    setView('list');
    setFormData({ name: '', email: '', status: 'Pending' });
  };

  return (
    <div className="h-full">
      {view === 'list' && (
        <div className="animate-in fade-in duration-700">
          <ClientsHeader onAdd={() => setView('add')} />
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">{error}</div>
          )}
          {loading && clients.length === 0 ? (
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest py-12 text-center">Loading clients...</p>
          ) : (
          <>
          <ClientsStats clients={clients} />
          <ClientList 
            clients={clients} 
            onViewProfile={(client) => { setSelectedClient(client); setView('detail'); }} 
          />
          </>
          )}
        </div>
      )}

      {view === 'add' && (
        <AddClient 
          formData={formData}
          setFormData={setFormData}
          onAdd={handleAdd}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'detail' && (
        <ClientDetail 
          client={selectedClient}
          onBack={() => setView('list')}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default Clients;
