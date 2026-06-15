import { MdCheckCircle } from 'react-icons/md';

const CTA = () => {
  return (
    <section className="py-16 md:py-24 bg-surface text-center">
      <div className="container">
        <div className="mx-auto rounded-4xl bg-hero-purple text-white py-16 md:py-20 px-6 md:px-16 shadow-2xl relative overflow-hidden">

          <div className="absolute top-0 left-0 w-full h-1 bg-white/10" style={{ boxShadow: '0 0 20px 2px rgba(255,255,255,0.6)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/40 blur-[80px] rounded-full -z-10" />
          <div className="absolute -top-24 -left-24 size-64 border-[40px] border-white/5 rounded-full z-0" />
          <div className="absolute -bottom-24 -right-24 size-64 border-[40px] border-white/5 rounded-full z-0" />

          <div className="relative max-w-max-content mx-auto z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">Start Your Care Journey Today</h2>
            <p className="text-white/80 mx-auto mb-10 text-sm md:text-lg leading-relaxed">
              Join thousands of satisfied families and empowered care providers. Experience the new standard in personalized home care across the country.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
              <button className="w-full sm:w-auto btn-gradient-pink text-white px-10 py-4 rounded-full font-medium text-lg">
                Find A PSW
              </button>
              <button className="w-full sm:w-auto px-10 py-4 rounded-full font-medium text-lg border-2 border-white text-white hover:bg-white hover:text-primary duration-300">
                Become A PSW
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2"><MdCheckCircle className="text-green-400" /> Easy Setup</div>
              <div className="flex items-center gap-2"><MdCheckCircle className="text-green-400" /> Secure Payments</div>
              <div className="flex items-center gap-2"><MdCheckCircle className="text-green-400" /> 24/7 Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
