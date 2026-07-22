import React from 'react';
import { steps } from './AppointmentData';

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-12 overflow-x-auto px-2">
    {steps.map((step, index) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center relative shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
            currentStep > index + 1 ? 'bg-purple-600 text-white' : 
            currentStep === index + 1 ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-110' : 
            'bg-gray-100 text-gray-400'
          }`}>
            {currentStep > index + 1 ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : index + 1}
          </div>
          <span className={`absolute -bottom-7 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
            currentStep === index + 1 ? 'text-purple-600' : 'text-gray-400'
          }`}>
            {step}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div className={`w-12 md:w-24 h-1 mx-2 md:mx-4 shrink-0 transition-colors duration-300 ${
            currentStep > index + 1 ? 'bg-purple-600' : 'bg-gray-100'
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default StepIndicator;
