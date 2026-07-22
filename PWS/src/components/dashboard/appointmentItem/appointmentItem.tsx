import React from 'react';
import clsx from 'clsx';

interface AppointmentItemProps {
  name: string;
  location: string;
  image: string;
  time: string;
  status: 'Confirmed' | 'Pending';
  isToday?: boolean;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ name, location, image, time, status, isToday, onClick }) => {
  return (
    <div onClick={onClick} className="py-4 sm:py-6 border-b border-border-soft last:border-0 duration-300 group px-2 cursor-pointer">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="size-14 sm:size-16 rounded-full overflow-hidden border-2 border-primary/5 shadow-sm shrink-0">
            <img src={image} alt={name} className="size-full object-top object-cover group-hover:scale-110 duration-500" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 font-dm truncate">{name}</h4>
            <p className="text-sm sm:text-base text-gray-400 font-medium font-dm mt-0.5 truncate">{location}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {isToday && (
            <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-accent-extralight text-accent text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-full">
              Today
            </span>
          )}
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-extralight rounded-full text-primary font-bold text-[11px] sm:text-sm font-dm whitespace-nowrap">
            {time}
          </div>
          <span className={clsx(
            "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold font-dm whitespace-nowrap",
            status === 'Confirmed' ? "bg-emerald-50 text-emerald-500" : "bg-orange-50 text-orange-500"
          )}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;

