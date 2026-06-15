import { useNavigate } from 'react-router-dom';
import { HiArrowRight, HiUserGroup, HiHeart } from 'react-icons/hi';

const UserType = () => {
  const navigate = useNavigate();

  const handleRecipientStart = () => {
    sessionStorage.setItem('signup_role', 'looking_for_care');
    navigate('/account-setup');
  };

  const handleProviderStart = () => {
    sessionStorage.setItem('signup_role', 'care_provider');
    navigate('/provider-profile-setup');
  };

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col items-center justify-center p-4 md:p-12 font-dm">
      <div className="max-w-4xl w-full text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-playfair">
          How will you use myPSW?
        </h1>
        <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
          Choose your role to get started with personalized features and recommendations tailored to your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-white rounded-4xl md:rounded-5xl p-8 md:p-12 shadow-logs border border-primary/5 flex flex-col items-center text-center group hover:scale-[1.02] duration-500">
          <div className="size-24 rounded-full bg-info-light flex items-center justify-center text-info mb-8 group-hover:scale-110 duration-500">
            <HiUserGroup size={48} />
          </div>

          <span className="px-4 py-1.5 bg-primary-extralight text-primary rounded-full text-[10px] font-black tracking-widest uppercase mb-6">
            CARE RECIPIENT
          </span>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">
            I'm Looking for Care
          </h2>

          <p className="text-gray-500 mb-10 leading-relaxed text-lg">
            Find qualified Personal Support Workers for yourself or a loved one. Browse profiles, book visits, and manage care all in one place.
          </p>

          <button
            onClick={handleRecipientStart}
            className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-3 duration-300 active:scale-95"
          >
            Get Started <HiArrowRight />
          </button>
        </div>

        <div className="bg-white rounded-4xl md:rounded-5xl p-8 md:p-12 shadow-logs border border-primary/5 flex flex-col items-center text-center group hover:scale-[1.02] duration-500">
          <div className="size-24 rounded-full bg-accent-light flex items-center justify-center text-accent mb-8 group-hover:scale-110 duration-500">
            <HiHeart size={48} />
          </div>

          <span className="px-4 py-1.5 bg-accent-light text-accent rounded-full text-[10px] font-black tracking-widest uppercase mb-6">
            CARE PROVIDER
          </span>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">
            I'm a Care Provider
          </h2>

          <p className="text-gray-500 mb-10 leading-relaxed text-lg">
            Join our network of trusted PSWs. Set your own schedule, choose your clients, and get paid fairly for the care you provide.
          </p>

          <button
            onClick={handleProviderStart}
            className="w-full py-5 bg-gradient-pink text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-accent/30 flex items-center justify-center gap-3 duration-300 active:scale-95"
          >
            Get Started <HiArrowRight />
          </button>
        </div>
      </div>

      <p className="mt-12 text-gray-400 font-medium">
        Not sure? You can always change this later in settings.
      </p>
    </div>
  );
};

export default UserType;
