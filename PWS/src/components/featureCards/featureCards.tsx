import { MdCheckCircle } from 'react-icons/md';

const FeatureCards = () => {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

          <div className="bg-surface-alt rounded-4xl md:rounded-5xl p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 size-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 duration-500" />

            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 relative z-10">For Families</h3>
            <p className="text-gray-600 text-sm md:text-base mb-8 relative z-10 leading-relaxed">
              Finding trustworthy, qualified care shouldn't be stressful. We simplify the process so you can focus on what matters most.
            </p>

            <ul className="space-y-4 mb-10 relative z-10">
              <li className="flex items-start gap-3">
                <MdCheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                <span className="text-gray-700 font-medium text-sm md:text-base">Access to fully vetted, certified PSWs</span>
              </li>
              <li className="flex items-start gap-3">
                <MdCheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                <span className="text-gray-700 font-medium text-sm md:text-base">Transparent pricing with no hidden fees</span>
              </li>
              <li className="flex items-start gap-3">
                <MdCheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                <span className="text-gray-700 font-medium text-sm md:text-base">Build a roster of your favorite caregivers</span>
              </li>
            </ul>

            <button className="btn-gradient-pink text-white px-8 py-3.5 rounded-full font-medium relative z-10 text-sm md:text-base">
              Find Care
            </button>
          </div>

          <div className="bg-hero-purple text-white rounded-4xl md:rounded-5xl p-8 md:p-12 shadow-xl relative overflow-hidden group">
            <div className="absolute -bottom-24 -right-24 size-72 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 duration-500" />

            <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">For PSWs</h3>
            <p className="text-white/80 text-sm md:text-base mb-8 relative z-10 leading-relaxed">
              Take control of your career. Set your own schedule, choose your clients, and earn what you deserve.
            </p>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-8 inline-block relative z-10 backdrop-blur-sm">
              <div className="text-white/70 text-[10px] md:text-xs uppercase tracking-wider mb-1">Average Earnings</div>
              <div className="text-xl md:text-2xl font-bold">$25.00 - $35.00 <span className="text-xs md:text-sm font-normal text-white/70">/ hr</span></div>
            </div>

            <ul className="space-y-4 mb-10 relative z-10">
              <li className="flex items-start gap-3">
                <MdCheckCircle className="text-white mt-1 shrink-0" size={18} />
                <span className="text-white/90 font-medium text-sm md:text-base">100% control over your availability</span>
              </li>
              <li className="flex items-start gap-3">
                <MdCheckCircle className="text-white mt-1 shrink-0" size={18} />
                <span className="text-white/90 font-medium text-sm md:text-base">Guaranteed and automated payments</span>
              </li>
              <li className="flex items-start gap-3">
                <MdCheckCircle className="text-white mt-1 shrink-0" size={18} />
                <span className="text-white/90 font-medium text-sm md:text-base">Access to a wide pool of clients in your area</span>
              </li>
            </ul>

            <button className="border-2 border-white text-white px-8 py-3.5 rounded-full font-medium hover:bg-white hover:text-primary-dark duration-300 relative z-10 text-sm md:text-base">
              Apply Now
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
