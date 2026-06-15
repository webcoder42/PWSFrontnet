import React from 'react';
import { clsx } from 'clsx';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface SetupFooterProps {
  currentStep: number;
  totalSteps?: number;
  handleBack: () => void;
  handleContinue: () => void;
  errors: any;
}

const SetupFooter: React.FC<SetupFooterProps> = ({ currentStep, totalSteps = 10, handleBack, handleContinue, errors }) => {
  return (
    <footer className={clsx(
      'bg-white border-t border-gray-100 sticky bottom-0 z-30',
      'px-4 py-3.5 lg:px-8 lg:py-6',
      'flex items-center justify-between'
    )}>
      <div className="flex items-center gap-2 md:gap-5">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={clsx(
            'flex items-center justify-center border-2 border-gray-200 font-bold rounded-lg md:rounded-xl duration-300 active:scale-95',
            'p-2.5 lg:px-8 lg:py-4',
            currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'text-gray-600 hover:border-primary/20 hover:text-primary'
          )}
          title="Back"
        >
          <HiChevronLeft className="size-5 md:size-6" />
          <span className="hidden md:inline ml-2 text-base md:text-lg">Back</span>
        </button>

        <span className="text-gray-400 font-bold text-[10px] sm:text-xs md:text-sm tracking-tight font-dm whitespace-nowrap">
          <span className="md:hidden">Step {currentStep}/{totalSteps}</span>
          <span className="hidden md:inline">Step {currentStep} of {totalSteps}</span>
        </span>
      </div>

      <button
        onClick={handleContinue}
        disabled={(currentStep === 2 && errors.username !== '') || (currentStep === 12 && errors.payout && errors.payout !== '')}
        className={clsx(
          'flex items-center justify-center gap-2 bg-gradient-primary text-white font-bold rounded-lg md:rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 duration-300 active:scale-95',
          'px-6 py-3.5 lg:px-14 lg:py-5 text-sm md:text-xl',
          ((currentStep === 2 && errors.username !== '') || (currentStep === 12 && errors.payout && errors.payout !== '')) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className="md:text-lg">{currentStep === totalSteps ? 'Complete Setup' : 'Continue'}</span>
        <HiChevronRight className="size-5 md:size-6" />
      </button>
    </footer>
  );
};

export default SetupFooter;
