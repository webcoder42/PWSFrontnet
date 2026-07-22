import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi';

import { updateAppointmentStatusAPI } from '../../../utils/api';
import {
  getStatusActions,
  toDisplayStatus,
  type DisplayStatus,
} from '../../../utils/appointmentHelpers';

interface RequestCardProps {
  appointmentId: string;
  appointment?: any;
  name: string;
  type: string;
  image?: string;
  initials: string;
  color: string;
  date: string;
  time: string;
  status: DisplayStatus;
  paymentStatus?: string;
  onStatusChange?: (appointmentId: string, newStatus: DisplayStatus) => void;
  onViewDetails?: (appointment: any) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  appointmentId,
  appointment,
  name,
  type,
  image,
  initials,
  color,
  date,
  time,
  status: initialStatus,
  paymentStatus = 'unpaid',
  onStatusChange,
  onViewDetails,
}) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  const { canConfirm, canCancel, showActions } = getStatusActions(currentStatus);

  const handleStatusUpdate = async (apiStatus: 'confirmed' | 'completed' | 'cancelled', e?: React.MouseEvent) => {
    if (updating) return;
    setUpdating(true);
    try {
      if (e) e.stopPropagation();
      const response = await updateAppointmentStatusAPI(appointmentId, apiStatus);
      const next = toDisplayStatus(response.data?.status || apiStatus);
      setCurrentStatus(next);
      onStatusChange?.(appointmentId, next);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      window.alert(message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div onClick={() => onViewDetails?.(appointment || { _id: appointmentId })} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 duration-500 group flex flex-col md:flex-row md:items-center justify-between gap-6 relative cursor-pointer">
      <div className="flex items-center gap-5">
        <div className={clsx(
          "size-16 rounded-full flex items-center justify-center text-xl font-bold font-dm shrink-0 overflow-hidden",
          !image && color
        )}>
          {image ? (
            <img
              src={image}
              alt={name}
              className="size-full object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`; }}
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900 font-playfair">{name}</h4>
          <p className="text-sm text-gray-400 font-medium font-dm mt-0.5">{type}</p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-extralight rounded-lg text-primary text-[11px] font-bold font-dm">
              <HiOutlineCalendar className="size-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-extralight rounded-lg text-primary text-[11px] font-bold font-dm">
              <HiOutlineClock className="size-4" />
              <span>{time}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
        <span className={clsx(
          "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
          currentStatus === 'CONFIRMED' ? "bg-green-50 text-green-500" :
            currentStatus === 'COMPLETED' ? "bg-blue-50 text-blue-500" :
              currentStatus === 'CANCELLED' ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
        )}>
          {currentStatus}
        </span>
        
        {paymentStatus && (
          <span className={clsx(
            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
            paymentStatus === 'paid' ? "bg-green-50 text-green-600 border border-green-200" :
            paymentStatus === 'failed' ? "bg-red-50 text-red-600 border border-red-200" :
            "bg-gray-100 text-gray-500 border border-gray-200"
          )}>
            {paymentStatus === 'paid' ? 'Paid' : paymentStatus === 'failed' ? 'Payment Failed' : 'Unpaid'}
          </span>
        )}

        {showActions && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {canConfirm && (
              <button
                type="button"
                disabled={updating}
                onClick={(e) => handleStatusUpdate('confirmed', e)}
                title="Confirm appointment"
                className={clsx(
                  "size-9 sm:size-10 rounded-xl flex items-center justify-center duration-300 border",
                  "bg-white text-gray-400 border-gray-100 hover:bg-green-50 hover:text-green-600 hover:border-green-100",
                  updating && "opacity-50 cursor-not-allowed"
                )}
              >
                <HiOutlineCheckCircle className="size-5 sm:size-6" />
              </button>
            )}

            {canCancel && (
              <>
                {canConfirm && <div className="w-px h-6 bg-gray-100 mx-0.5" />}
                <button
                  type="button"
                  disabled={updating}
                  onClick={(e) => handleStatusUpdate('cancelled', e)}
                  title="Cancel appointment"
                  className={clsx(
                    "size-9 sm:size-10 rounded-xl flex items-center justify-center duration-300 border",
                    "bg-white text-gray-400 border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100",
                    updating && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <HiOutlineXCircle className="size-5 sm:size-6" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
