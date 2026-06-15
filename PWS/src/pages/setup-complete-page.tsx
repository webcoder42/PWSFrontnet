import { HiCheck, HiChevronRight } from 'react-icons/hi';

const SetupCompletePage = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#4b318f] via-[#7d41a7] to-[#a452bf]">
      <div className="absolute top-0 right-0 size-[40vw] max-w-[600px] max-h-[600px] bg-[#663fac] rounded-full blur-[100px] opacity-60 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-[50vw] max-w-[800px] max-h-[800px] bg-[#9146a8] rounded-full blur-[120px] opacity-50 translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">

        <div className="size-20 sm:size-24 md:size-28 lg:size-40 rounded-full border-[1.5px] lg:border-2 border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl mb-8 md:mb-14 animate-in zoom-in duration-700 delay-200 fill-mode-both">
          <HiCheck className="text-white size-10 sm:size-12 md:size-20" strokeWidth={1} />
        </div>

        <div className="space-y-1 sm:space-y-6 mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          <h1 className="text-[40px] sm:text-6xl lg:text-[96px] font-bold text-white font-playfair tracking-tight leading-tight">
            Account Setup
          </h1>
          <h2 className="text-[32px] sm:text-5xl lg:text-[76px] font-bold text-[#ebdfff] font-playfair tracking-tight leading-tight">
            Complete!
          </h2>
        </div>

        <p className="text-[15px] sm:text-xl lg:text-2xl text-white/80 font-medium font-dm mx-auto text-balance mb-8 sm:mb-20 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-both">
          Your profile is all set. We're matching you with PSWs in your area based on your preferences.
        </p>

        <button
          onClick={() => window.location.href = '/dashboard'}
          className="group bg-white flex items-center justify-center gap-3 lg:gap-4 px-8 sm:px-20 py-4 lg:py-7 rounded-2xl sm:rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-700 fill-mode-both"
        >
          <span className="text-sm sm:text-2xl font-bold text-[#623b9d] font-dm whitespace-nowrap">
            Go to My Dashboard
          </span>
          <HiChevronRight className="text-[#623b9d] size-4 sm:size-8 duration-300 group-hover:translate-x-1 lg:group-hover:translate-x-2" />
        </button>

      </div>
    </div>
  );
};

export default SetupCompletePage;
