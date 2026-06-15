import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiCheck, HiOutlineInformationCircle, HiOutlineSparkles } from 'react-icons/hi';
import {
  MdOutlineLocalLaundryService,
  MdOutlineVolunteerActivism,
  MdOutlineDirectionsCar,
  MdOutlineDirectionsWalk,
  MdOutlineNightShelter,
} from 'react-icons/md';
import type { ProviderProfileFormData } from '../../../types/profile';
const ServiceOptions = [
  { id: 'respite-care', label: 'Respite Care', Icon: MdOutlineNightShelter },
  { id: 'laundry', label: 'Laundry', Icon: MdOutlineLocalLaundryService },
  { id: 'light-housekeeping', label: 'Light Housekeeping', Icon: HiOutlineSparkles },
  { id: 'companionship', label: 'Companionship', Icon: MdOutlineVolunteerActivism },
  { id: 'transportation', label: 'Transportation Services', Icon: MdOutlineDirectionsCar },
  { id: 'mobility-rehab', label: 'Mobility / Rehabilitation Exercises', Icon: MdOutlineDirectionsWalk },
] as const;

interface ProviderServicesDetailsProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderServicesDetails: React.FC<ProviderServicesDetailsProps> = ({ formData, setFormData }) => {
  const toggleService = (serviceId: string) => {
    const currentServices = formData.services || [];
    if (currentServices.includes(serviceId)) {
      setFormData({ ...formData, services: currentServices.filter((s) => s !== serviceId) });
    } else {
      setFormData({ ...formData, services: [...currentServices, serviceId] });
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">What care services do you provide?</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">Select all services you're trained and comfortable offering. Clients filter PSWs by service type.</p>
        <span className="text-[11px] sm:text-[13px] text-gray-400 font-medium font-dm block">(Select all that apply)</span>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {ServiceOptions.map((service) => {
          const isSelected = (formData.services || []).includes(service.id);
          return (
            <div
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={clsx(
                'w-full flex items-center justify-between p-4 sm:p-5 rounded-xl md:rounded-2xl border-2 cursor-pointer duration-300',
                isSelected
                  ? 'bg-surface-pure border-primary shadow-sm'
                  : 'bg-white border-gray-100 hover:border-gray-200',
              )}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <service.Icon
                  className={clsx(
                    'size-5 sm:size-6 duration-300',
                    isSelected ? 'text-primary' : 'text-gray-400',
                  )}
                />
                <span
                  className={clsx(
                    'text-[14px] sm:text-[15px] font-bold font-dm duration-300',
                    isSelected ? 'text-primary' : 'text-gray-700',
                  )}
                >
                  {service.label}
                </span>
              </div>

              <div
                className={clsx(
                  'size-5 sm:size-6 rounded flex items-center justify-center duration-300 border-2',
                  isSelected
                    ? 'bg-primary border-primary text-white'
                    : 'bg-transparent border-gray-200 text-transparent',
                )}
              >
                <HiCheck className="size-3.5 sm:size-4" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 shadow-sm mt-8">
        <div className="size-5 sm:size-6 rounded-full bg-primary-extralight flex items-center justify-center text-primary shrink-0 mt-0.5">
          <HiOutlineInformationCircle className="size-3.5 sm:size-4" />
        </div>
        <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium font-dm leading-relaxed">
          You'll set your hourly rate for each service after your account is fully verified.
        </p>
      </div>
    </div>
  );
};

export default ProviderServicesDetails;
