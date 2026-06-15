import React from 'react';
import { clsx } from 'clsx';
import { HiUser, HiCheck } from 'react-icons/hi';
const RegistrationSteps = [
  { id: 1, title: 'Language', sub: 'Select your language' },
  { id: 2, title: 'Your Name', sub: 'Basic details' },
  { id: 3, title: 'Contact Info', sub: 'Phone and email' },
  { id: 4, title: 'Location', sub: 'Where you live' },
  { id: 5, title: 'Date Of Birth', sub: 'Your Birthday' },
  { id: 6, title: 'Gender', sub: 'Gender Identity' },
  { id: 7, title: 'Physical Info', sub: 'Height and weight' },
  { id: 8, title: 'Emergency Contact', sub: 'Contact info' },
  { id: 9, title: 'Care Needs', sub: 'Type of care' },
];

const FamilyRegistrationSteps = [
  { id: 1, title: 'Relationship', sub: 'How are they related' },
  { id: 2, title: 'Language', sub: 'Select their language' },
  { id: 3, title: 'Their Name', sub: 'Basic details' },
  { id: 4, title: 'Contact Info', sub: 'Phone and email' },
  { id: 5, title: 'Location', sub: 'Where they live' },
  { id: 6, title: 'Date Of Birth', sub: 'Their Birthday' },
  { id: 7, title: 'Gender', sub: 'Gender Identity' },
  { id: 8, title: 'Physical Info', sub: 'Height and weight' },
  { id: 9, title: 'Emergency Contact', sub: 'Contact info' },
  { id: 10, title: 'Care Needs', sub: 'Type of care' },
];

interface ProfileSidebarProps {
  currentStep: number;
  isFamilyMember?: boolean;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ currentStep, isFamilyMember }) => {
  const steps = isFamilyMember ? FamilyRegistrationSteps : RegistrationSteps;
  const maxSteps = steps.length;
  const progressPercent = Math.round((currentStep / maxSteps) * 100);
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-100 flex flex-col z-20 hidden lg:flex">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="size-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
            <HiUser size={22} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-none font-playfair">{isFamilyMember ? "Family Setup" : "Profile Setup"}</h2>
            <p className="text-sm text-gray-400 mt-1 font-dm">Care Recipient</p>
          </div>
        </div>

        <div className="mb-10 px-1">
          <span className="text-sm font-black text-gray-400 tracking-widest uppercase font-dm">PROGRESS</span>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-primary duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs font-bold text-gray-400 mt-2 font-dm">
            {currentStep === maxSteps ? (
              <div className="flex items-center gap-1.5 text-yellow-600 animate-in fade-in zoom-in duration-500">
                <span className="text-sm">🎉</span> Profile almost complete!
              </div>
            ) : (
              `${progressPercent}% Complete`
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-8 no-scrollbar scroll-smooth">
        <div className="space-y-1">
          {steps.map((step) => {
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
                  'size-8 shrink-0 rounded-2xl flex items-center justify-center text-xs font-bold duration-300',
                  isCompleted && 'bg-primary text-white',
                  isActive && 'bg-white border-2 border-primary shadow-sm text-primary',
                  !isCompleted && !isActive && 'bg-gray-100 text-gray-300'
                )}>
                  {isCompleted ? <HiCheck size={16} /> : step.id}
                </div>
                <div>
                  <h4 className={clsx(
                    'text-base font-dm font-bold leading-none duration-300',
                    isActive ? 'text-primary' : 'text-gray-900'
                  )}>{step.title}</h4>
                  <p className="text-sm text-gray-400 mt-1 font-medium">{step.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
