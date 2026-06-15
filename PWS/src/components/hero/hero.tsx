import { FaStar, FaHeart } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';

const Hero = () => {
  return (
    <section className="relative w-full bg-hero-purple pt-24 md:pt-32 pb-16 md:pb-24 text-white overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div className="lg:w-1/2 space-y-6 md:space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm">
              <MdCheckCircle className="text-white" />
              <span>A Personal Care Assistant, Near You.</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Quality Care,<br className="hidden md:block" />
              Delivered to Your<br className="hidden md:block" />
              Door
            </h1>

            <p className="text-white/80 lg:mx-0 text-base md:text-lg leading-relaxed">
              Find the perfect personal support worker for your unique needs. We make professional home care accessible, reliable, and compassionate.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 items-center pt-2">
              <button className="btn-gradient-pink text-white px-8 py-3.5 rounded-full font-medium text-sm md:text-base">
                Find A PSW
              </button>
              <button className="px-8 py-3.5 rounded-full font-medium border-2 border-white/40 hover:bg-white hover:border-white hover:text-primary-dark duration-300 text-white text-sm md:text-base">
                Become A PSW
              </button>
            </div>

            <div className="flex justify-center lg:justify-start gap-8 pt-6 md:pt-8">
              <div>
                <div className="text-xl md:text-2xl font-bold">3.8</div>
                <div className="text-white/60 text-xs md:text-sm">km away</div>
              </div>
              <div className="w-[1px] bg-white/20"></div>
              <div>
                <div className="text-xl md:text-2xl font-bold">5.0</div>
                <div className="text-white/60 text-xs md:text-sm">Rating</div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full relative flex justify-center lg:justify-end z-10 mt-8 lg:mt-0">

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-5xl md:rounded-6xl w-full max-w-xl shadow-2xl relative">

              <div className="bg-white/5 rounded-3xl p-4 md:p-6 mb-6 flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="size-16 md:size-20 rounded-full overflow-hidden bg-gray-200 border-4 border-white/20">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150" alt="Amanda Smith" className="size-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl md:text-2xl">Amanda Smith</h3>
                    <p className="text-white/60 text-sm md:text-base">Available • 42 reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <FaStar size={20} />
                  <span className="font-bold text-white text-base md:text-xl">5.0</span>
                </div>
              </div>

              <div className="bg-[#1b0033]/50 rounded-3xl p-6 space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="text-white/60">Services</span>
                  <span className="font-medium text-[var(--color-primary-light)]">View All</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                  <span className="px-4 py-1.5 rounded-full bg-white/10">Personal Care</span>
                  <span className="px-4 py-1.5 rounded-full bg-white/10">Respite</span>
                  <span className="px-4 py-1.5 rounded-full bg-white/10">Meal Prep</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-white/60 text-xs md:text-sm mb-1">Hourly Rate</div>
                  <div className="font-bold text-lg md:text-2xl">$25.00</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-white/60 text-xs md:text-sm mb-1">Experience</div>
                  <div className="font-bold text-lg md:text-2xl">5+ Years</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-2 md:-bottom-10 md:-right-6 lg:-right-8 bg-white text-[#1b0033] rounded-3xl py-3 md:py-4 px-5 md:px-7 shadow-2xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="size-10 md:size-14 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                  <FaHeart size={24} />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-gray-500">Total Visits</div>
                  <div className="font-bold text-xl md:text-3xl">100+</div>
                </div>
              </div>

            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 md:size-96 bg-primary-light/30 rounded-full blur-[80px] md:blur-[100px] -z-10 pointer-events-none"></div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
