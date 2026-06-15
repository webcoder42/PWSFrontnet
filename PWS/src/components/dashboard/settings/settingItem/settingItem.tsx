import React from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { clsx } from 'clsx';

interface SettingItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  showBorder?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, label, onClick, showBorder = true }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex items-center justify-between p-4 sm:p-6 cursor-pointer duration-300 group hover:bg-primary/[0.02]",
        showBorder && "border-b border-gray-100"
      )}
    >
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="size-10 sm:size-12 rounded-lg sm:rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white duration-300 shadow-sm group-hover:shadow-primary/20 shrink-0">
          <Icon className="size-5 sm:size-6" />
        </div>
        <span className="text-sm sm:text-[17px] font-semibold text-slate-700 font-dm group-hover:text-primary duration-300 tracking-tight">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <HiChevronRight className="size-5 sm:size-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 duration-300" />
      </div>
    </div>
  );
};

export default SettingItem;
