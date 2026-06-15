import { useNavigate } from 'react-router-dom';

import { HiArrowRight } from 'react-icons/hi';

import personalImg from '../assets/personal-profile-setup-img.png';
import familyImg from '../assets/family-member-setup-img.png';

const AccountSetup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col items-center justify-center p-4 md:p-12 font-dm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="bg-white rounded-3xl md:rounded-5xl p-6 md:p-14 shadow-logs border border-primary/5 flex flex-col items-center text-center group hover:scale-[1.01] duration-500">
          <div className="w-full aspect-video flex items-center justify-center mb-10 overflow-hidden rounded-3xl bg-surface-alt">
            <img src={personalImg} alt="Personal setup" className="size-full object-contain p-4 group-hover:scale-105 duration-700" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Personal Profile Setup
          </h2>

          <p className="text-gray-500 mb-10 leading-relaxed text-lg">
            Create a space just for you. Manage your individual dreams, goals, and daily progress with a personalized dashboard.
          </p>

          <button
            onClick={() => {
              sessionStorage.setItem('signup_care_type', 'personal');
              navigate('/profile-setup');
            }}
            className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 duration-300"
          >
            Start Personal Setup <HiArrowRight />
          </button>
        </div>

        <div className="bg-white rounded-4xl md:rounded-5xl p-6 md:p-14 shadow-logs border border-primary/5 flex flex-col items-center text-center group hover:scale-[1.01] duration-500">
          <div className="w-full aspect-video flex items-center justify-center mb-10 overflow-hidden rounded-3xl bg-surface-alt">
            <img src={familyImg} alt="Family setup" className="size-full object-contain p-4 group-hover:scale-105 duration-700" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Family Member Setup
          </h2>

          <p className="text-gray-500 mb-10 leading-relaxed text-lg">
            Connect with your loved ones. Shared spaces, group activities, and synchronized goals for everyone in your household.
          </p>

          <button
            onClick={() => {
              sessionStorage.setItem('signup_care_type', 'family');
              navigate('/family-profile-setup');
            }}
            className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 duration-300"
          >
            Add Family Member <HiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSetup;
