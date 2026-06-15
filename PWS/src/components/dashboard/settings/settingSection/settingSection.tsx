import React from 'react';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6 sm:mb-8 lg:mb-10">
      <h4 className="text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4 ml-1">
        {title}
      </h4>
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SettingSection;
