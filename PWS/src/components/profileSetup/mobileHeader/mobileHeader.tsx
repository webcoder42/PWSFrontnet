import React from 'react';
import { HiUser } from 'react-icons/hi';

interface MobileHeaderProps {
  currentStep: number;
  totalSteps?: number;
  isFamilyMember?: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ currentStep, totalSteps = 10, isFamilyMember }) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);
  return (
    <div className="lg:hidden sticky top-0 bg-white border-b border-gray-100 z-40 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
            <HiUser size={18} />
          </div>
          <h2 className="font-bold text-gray-900 font-playfair">{isFamilyMember ? "Family Setup" : "Profile Setup"}</h2>
        </div>
        <span className="text-xs font-bold text-primary">{progressPercent}%</span>
      </div>
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-primary duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default MobileHeader;
