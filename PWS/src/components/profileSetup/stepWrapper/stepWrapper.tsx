import React from 'react';
import { clsx } from 'clsx';

interface StepWrapperProps {
  step: number;
  currentStep: number;
  children: React.ReactNode;
  isStep1?: boolean;
  noPadding?: boolean;
}

const StepWrapper: React.FC<StepWrapperProps> = ({ step, currentStep, children, isStep1, noPadding }) => {
  return (
    <div className={clsx(
      'bg-white rounded-2xl md:rounded-3xl shadow-logs duration-700 animate-in fade-in slide-in-from-bottom-8 w-full overflow-hidden',
      !noPadding && (isStep1 ? 'p-6 md:p-12 xl:p-16' : 'p-5 sm:p-8 md:p-12 xl:p-16'),
      currentStep === step ? 'block' : 'hidden'
    )}>
      {children}
    </div>
  );
};

export default StepWrapper;
