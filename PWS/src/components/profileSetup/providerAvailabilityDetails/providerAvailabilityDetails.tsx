import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiCheck, HiOutlineMinus, HiOutlineCalendar } from 'react-icons/hi';
import type { ProviderProfileFormData } from '../../../types/profile';

const DaysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TimeBlocks = [
  { id: 'Morning', time: '6am–12pm' },
  { id: 'Afternoon', time: '12pm–6pm' },
  { id: 'Evening', time: '6pm–10pm' },
  { id: 'Overnight', time: '10pm–6am' }
];

interface ProviderAvailabilityDetailsProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderAvailabilityDetails: React.FC<ProviderAvailabilityDetailsProps> = ({ formData, setFormData }) => {

  const toggleAvailability = (block: string, day: string) => {
    const newAvailability = { ...formData.availability };
    if (!newAvailability[block]) newAvailability[block] = {};
    newAvailability[block][day] = !newAvailability[block][day];
    setFormData({ ...formData, availability: newAvailability });
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">When are you available?</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">Set your typical weekly hours. Clients can only book you during your available times. Adjust anytime.</p>
      </div>

      <div className="space-y-6">
        <div className="hidden lg:block border border-gray-100 rounded-3xl bg-white shadow-sm overflow-hidden">
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="w-[180px] p-6" />
                {DaysOfWeek.map(day => (
                  <th key={day} className="p-4 text-[13px] font-bold text-gray-400 font-dm text-center uppercase tracking-widest">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TimeBlocks.map((block, idx) => (
                <tr key={block.id} className={clsx(
                  "hover:bg-gray-50/50 duration-200",
                  idx !== TimeBlocks.length - 1 && "border-b border-gray-50"
                )}>
                  <td className="p-6 align-middle">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-gray-900 font-dm">{block.id}</span>
                      <span className="text-[12px] text-gray-400 font-medium font-dm mt-1">{block.time}</span>
                    </div>
                  </td>
                  {DaysOfWeek.map(day => {
                    const isAvailable = formData.availability?.[block.id]?.[day];
                    return (
                      <td key={day} className="p-3 align-middle">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(block.id, day)}
                            className={clsx(
                              "size-11 rounded-xl flex items-center justify-center duration-300",
                              isAvailable
                                ? "bg-gradient-primary text-white shadow-md shadow-primary/20 scale-100"
                                : "bg-gray-50 text-gray-200 hover:bg-gray-100 hover:text-gray-300 scale-95"
                            )}
                          >
                            {isAvailable ? <HiCheck className="size-5" /> : <HiOutlineMinus className="size-5" />}
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-4 sm:space-y-6">
          {FullDays.map((dayFull, idx) => {
            const dayKey = DaysOfWeek[idx];
            return (
              <div key={dayKey} className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold font-dm text-sm">
                    {dayKey}
                  </div>
                  <h4 className="font-dm font-bold text-gray-900 text-base">{dayFull}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {TimeBlocks.map((block) => {
                    const isAvailable = formData.availability?.[block.id]?.[dayKey];
                    return (
                      <button
                        key={block.id}
                        onClick={() => toggleAvailability(block.id, dayKey)}
                        className={clsx(
                          "flex flex-col items-start p-3 sm:p-4 rounded-xl border-2 duration-300 text-left group",
                          isAvailable 
                            ? "bg-surface-pure border-primary shadow-sm" 
                            : "bg-white border-gray-50 hover:border-gray-100"
                        )}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={clsx("text-[13px] font-bold font-dm", isAvailable ? "text-primary" : "text-gray-700")}>
                            {block.id}
                          </span>
                          {isAvailable && <HiCheck className="size-3.5 text-primary" />}
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium font-dm">{block.time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-2xl p-4 sm:p-5 mt-6">
        <HiOutlineCalendar className="size-5 text-primary shrink-0 mt-0.5" />
        <p className="text-[13px] text-primary/80 font-medium font-dm leading-relaxed">
          Tip: Most clients book PSWs for Morning or Afternoon slots. Ensure these are updated for better visibility.
        </p>
      </div>
    </div>
  );
};

export default ProviderAvailabilityDetails;
