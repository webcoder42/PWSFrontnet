import React from 'react';
import { useAdmin } from '../context/AdminContext';
import SupportHeader from './support/SupportHeader';
import TicketList from './support/TicketList';
import QuickResolution from './support/QuickResolution';

const Support = () => {
  const { tickets, resolveTicket } = useAdmin();

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <SupportHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <TicketList tickets={tickets} onResolve={resolveTicket} />
        </div>
        <div className="lg:col-span-4 space-y-10">
          <QuickResolution />
        </div>
      </div>
    </div>
  );
};

export default Support;
