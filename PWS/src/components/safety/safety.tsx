import { MdVerifiedUser, MdOutlinePayment, MdSupportAgent } from 'react-icons/md';

const Safety = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div className="lg:w-1/2 space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">
              Your Safety is Our<br className="hidden md:block" /> Highest Priority
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 size-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MdVerifiedUser size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-1">Thorough Background Checks</h4>
                  <p className="text-gray-600 leading-relaxed">Every PSW undergoes rigorous background and vulnerability sector checks before joining our platform.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 size-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MdOutlinePayment size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-1">Secure & Transparent Payments</h4>
                  <p className="text-gray-600 leading-relaxed">All transactions are securely processed through our platform. No cash handling required.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 size-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MdSupportAgent size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-1">24/7 Dedicated Support</h4>
                  <p className="text-gray-600 leading-relaxed">Our dedicated support team is always available to help you with any questions or concerns.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full relative flex justify-center lg:justify-end">
            <div className="relative w-full lg:max-w-xl w-full aspect-[4/3] rounded-4xl overflow-hidden shadow-2xl flex items-center justify-center p-6 md:p-12 border-8 border-white">

              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200"
                  alt="Laboratory medical professional"
                  className="size-full object-cover opacity-30 grayscale contrast-125"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />

              <div className="relative z-10 w-full flex flex-col gap-5 md:gap-7">

                <div className="bg-white/95 backdrop-blur-sm py-2.5 px-4 rounded-full shadow-logs flex items-center justify-between border border-gray-100/50 w-[95%] -translate-x-4 md:-translate-x-8">
                  <div className="flex items-center gap-4">
                    <div className="size-9 md:size-11 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <MdVerifiedUser size={22} />
                    </div>
                    <span className="font-bold text-sm md:text-base text-primary-dark tracking-tight">Identity Check</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[9px] md:text-[10px] font-black uppercase tracking-wider">Completed</span>
                </div>

                <div className="bg-white/95 backdrop-blur-sm py-2.5 px-4 rounded-full shadow-logs flex items-center justify-between border border-gray-100/50 w-[90%] self-end">
                  <div className="flex items-center gap-4">
                    <div className="size-9 md:size-11 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <MdOutlinePayment size={22} />
                    </div>
                    <span className="font-bold text-sm md:text-base text-primary-dark tracking-tight">Certificate Validated</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[9px] md:text-[10px] font-black uppercase tracking-wider">Completed</span>
                </div>

                <div className="bg-white/95 backdrop-blur-sm py-2.5 px-4 rounded-full shadow-logs flex items-center justify-between border border-gray-100/50 w-[92%] -translate-x-2 md:-translate-x-4">
                  <div className="flex items-center gap-4">
                    <div className="size-9 md:size-11 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <MdSupportAgent size={22} />
                    </div>
                    <span className="font-bold text-sm md:text-base text-primary-dark tracking-tight">Police Check</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[9px] md:text-[10px] font-black uppercase tracking-wider">Completed</span>
                </div>

                <div className="bg-white/95 backdrop-blur-sm py-2.5 px-4 rounded-full shadow-logs flex items-center justify-between border border-gray-100/50 w-[95%]">
                  <div className="flex items-center gap-4">
                    <div className="size-9 md:size-11 rounded-full bg-pink-50 flex items-center justify-center text-accent">
                      <MdVerifiedUser size={22} />
                    </div>
                    <span className="font-bold text-sm md:text-base text-accent tracking-tight">Final Verification</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-[9px] md:text-[10px] font-black uppercase tracking-wider">Approved</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Safety;
