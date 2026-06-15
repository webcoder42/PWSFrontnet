import React from 'react';
import { useAdmin } from '../context/AdminContext';
import BillingHeader from './billing/BillingHeader';
import BillingStats from './billing/BillingStats';
import InvoiceTable from './billing/InvoiceTable';

const Billing = () => {
  const { invoices, setInvoices } = useAdmin();

  const stats = [
    { label: 'Total Revenue', value: `$${invoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}`, sub: 'All time', color: 'purple' },
    { label: 'Outstanding', value: `$${invoices.filter(i => i.status !== 'Paid').reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}`, sub: `${invoices.filter(i => i.status !== 'Paid').length} pending invoices`, color: 'orange' },
    { label: 'Total Invoices', value: invoices.length.toString(), sub: 'Invoices generated', color: 'emerald' },
  ];

  const handleStatusChange = (id, newStatus) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: newStatus, color: newStatus === 'Paid' ? 'emerald' : newStatus === 'Overdue' ? 'rose' : 'orange' } : inv
    ));
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <BillingHeader />
      <BillingStats stats={stats} />
      <InvoiceTable invoices={invoices} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default Billing;
