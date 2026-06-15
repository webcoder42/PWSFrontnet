import { FaSearch, FaRegCalendarCheck, FaSmile } from 'react-icons/fa';

const Process = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="text-center">
          <div className='max-w-max-content mx-auto'>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">
              Simple, Safe & Stress-Free
            </h2>
            <p className="text-gray-600 text-base md:text-lg mx-auto mb-12 md:mb-16">
              Our streamlined process makes it easy to find and hire the right care provider for your needs, giving you peace of mind every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[3.5rem] left-[15%] right-[15%] h-[2px] bg-primary/10 -z-10" />

            <div className="flex flex-col items-center">
              <div className="size-28 rounded-full bg-surface flex items-center justify-center text-primary mb-6 shadow-sm shadow-primary/10 relative">
                <FaSearch size={40} />
                <div className="absolute -top-2 -right-2 size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Find a Provider</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Browse profiles of fully vetted and qualified PSWs matching your specific care requirements in your area.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="size-28 rounded-full bg-surface flex items-center justify-center text-primary mb-6 shadow-sm shadow-primary/10 relative">
                <FaRegCalendarCheck size={40} />
                <div className="absolute -top-2 -right-2 size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Book Services</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Review rates, availability, and easily schedule appointments directly through our secure platform.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="size-28 rounded-full bg-surface flex items-center justify-center text-primary mb-6 shadow-sm shadow-primary/10 relative">
                <FaSmile size={40} />
                <div className="absolute -top-2 -right-2 size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">3</div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Receive Quality Care</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enjoy peace of mind knowing your loved ones are receiving exceptional, compassionate care at home.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
