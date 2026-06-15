import React from 'react';
import { clsx } from 'clsx';
import { HiUser } from 'react-icons/hi';

const ProviderSteps = [
  { id: 1, title: 'Language', sub: 'App & communication' },
  { id: 2, title: 'Personal Info', sub: 'Name & photo' },
  { id: 3, title: 'Contact Info', sub: 'Phone & email' },
  { id: 4, title: 'Location', sub: 'Service area' },
  { id: 5, title: 'Gender', sub: 'For client matching' },
  { id: 6, title: 'PSW Certificate', sub: 'Upload your cert' },
  { id: 7, title: 'Backcheck', sub: 'Background check' },
  { id: 8, title: 'Experience', sub: 'Skills & background' },
  { id: 9, title: 'Services', sub: 'What you offer' },
  { id: 10, title: 'Availability', sub: 'Your schedule' },
  { id: 11, title: 'Capabilities', sub: 'Physical & transport' },
];

interface ProviderSidebarProps {
  currentStep: number;
}

const ProviderSidebar: React.FC<ProviderSidebarProps> = ({ currentStep }) => {
  const maxSteps = ProviderSteps.length;
  const progressPercent = Math.round((currentStep / maxSteps) * 100);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-100 flex flex-col z-20 hidden lg:flex">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="size-10 rounded-lg bg-linear-to-r from-primary to-primary-light flex items-center justify-center text-white">
            <HiUser size={22} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-none font-playfair">Profile Setup</h2>
            <p className="text-sm text-gray-400 mt-1 font-dm">Care Provider</p>
          </div>
        </div>

        <div className="mb-10 px-1">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 mt-2 font-dm">Profile Completion <span className="text-primary font-bold ml-1">{progressPercent}%</span></span>
          <div className="h-1.5 w-full bg-primary-extralight rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-linear-to-r from-primary to-primary-light duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-8 no-scrollbar scroll-smooth">
        <div className="space-y-1">
          {ProviderSteps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            return (
              <div
                key={step.id}
                className={clsx(
                  'flex items-center gap-4 p-4 rounded-xl px-4 py-3 duration-300',
                  isActive && 'bg-primary-extralight'
                )}
              >
                <div className={clsx(
                  'size-8 shrink-0 rounded-md flex items-center justify-center text-xs font-bold duration-300',
                  isCompleted && 'bg-linear-to-r from-primary to-primary-light text-white',
                  isActive && 'bg-linear-to-r from-primary to-primary-light text-white shadow-sm',
                  !isCompleted && !isActive && 'bg-white border-2 border-gray-100 text-gray-400'
                )}>
                  {step.id}
                </div>
                <div>
                  <h4 className={clsx(
                    'text-[15px] font-dm font-bold leading-none duration-300',
                    isActive ? 'text-primary' : 'text-gray-900'
                  )}>{step.title}</h4>
                  <p className="text-[13px] text-gray-400 mt-1 font-medium">{step.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default ProviderSidebar;
