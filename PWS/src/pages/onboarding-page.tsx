import { useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

import slide1Img from '../assets/onboarding-slide-1-img.png';
import slide2Img from '../assets/onboarding-slide-2-img.png';
import slide3Img from '../assets/onboarding-slide-3-img.png';
import slide4Img from '../assets/onboarding-slide-4-img.png';
import slide5Img from '../assets/onboarding-slide-5-img.png';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    tag: 'Personalized Care',
    title: 'Matched with Care That Fits You',
    description: 'Our intelligent matching system connects you with Personal Support Workers who meet your specific needs, preferences, and schedule. Whether you need daily assistance or occasional support, we help you find the perfect care provider for you or your loved one.',
    image: slide1Img
  },
  {
    tag: 'Easy Booking',
    title: 'Book Visits in Just a Few Taps',
    description: 'Schedule care visits quickly and easily through our intuitive platform. Choose your preferred times, set recurring appointments, and manage your calendar all in one place. No phone calls, no hassle—just simple, straightforward booking.',
    image: slide2Img
  },
  {
    tag: 'Vetted & Qualified',
    title: 'Verified & Trusted Professionals',
    description: 'Every Personal Support Worker on our platform is thoroughly vetted with background checks, credential verification, and professional references. Rest assured knowing you\'re working with qualified, experienced care providers who meet the highest standards.',
    image: slide3Img
  },
  {
    tag: 'Stay Connected',
    title: 'Real-Time Updates & Communication',
    description: 'Stay informed with instant notifications about upcoming visits, schedule changes, and care updates. Message your PSW directly through our secure platform and keep family members in the loop with shared access and activity logs.',
    image: slide4Img
  },
  {
    tag: '24/7 Support',
    title: 'Support When You Need It Most',
    description: 'Our dedicated support team is available around the clock to assist with any questions or concerns. Whether it\'s a technical issue, scheduling help, or care coordination, we\'re here to ensure your experience is smooth and stress-free.',
    image: slide5Img
  }
];

const Onboarding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 font-dm">
      <div className="w-full max-w-5xl overflow-x-auto no-scrollbar mb-8 md:mb-12">
        <div className="flex justify-start md:justify-center gap-3 pb-4 min-w-max px-4">
          {slides.map((slide, i) => (
            <button
              key={slide.tag}
              onClick={() => handleTabClick(i)}
              className={clsx(
                'px-5 md:px-7 py-2.5 rounded-full text-xs md:text-sm font-bold duration-300 border-2 whitespace-nowrap',
                activeIndex === i
                  ? 'bg-gradient-purple border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white border-primary/5 text-gray-400 hover:border-primary/20 hover:text-primary'
              )}
            >
              {slide.tag}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-4xl md:rounded-7xl shadow-logs overflow-hidden relative border border-primary/5">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={600}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center p-6 md:p-12 lg:p-20 gap-10 lg:gap-16">

                <div className="flex lg:order-2 items-center justify-center bg-surface-alt rounded-3xl md:rounded-5xl h-64 md:h-80 lg:h-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="size-full object-contain p-6 md:p-10 transform hover:scale-105 duration-1000"
                  />
                </div>

                <div className="space-y-6 md:space-y-8 lg:order-1">
                  <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase">
                    Slide {i + 1} of {slides.length}
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.2] lg:leading-[1.1] mb-4 md:mb-6">
                    {slide.title}
                  </h1>

                  <p className="text-gray-500 text-base md:text-lg lg:text-xl leading-relaxed font-medium">
                    {slide.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2 md:pt-4 mb-6 md:mb-8">
                    {slides.map((_, dotIdx) => (
                      <div
                        key={dotIdx}
                        className={clsx(
                          'h-2 md:h-2.5 rounded-full duration-500',
                          activeIndex === dotIdx ? 'w-10 md:w-12 bg-primary shadow-sm shadow-primary/30' : 'w-2 md:w-2.5 bg-primary/10'
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-2 md:pt-4">
                    <div className="flex gap-4 w-full sm:w-auto justify-center sm:justify-start order-2 sm:order-1">
                      <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="size-12 md:size-14 rounded-full border-2 border-primary/10 flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary duration-300 bg-white"
                      >
                        <HiChevronLeft size={28} />
                      </button>
                      <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="size-12 md:size-14 rounded-full border-2 border-primary/10 flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary duration-300 bg-white"
                      >
                        <HiChevronRight size={28} />
                      </button>
                    </div>

                    <button
                      onClick={() => navigate('/user-type')}
                      className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-gradient-primary text-white font-bold text-lg md:text-xl rounded-2xl shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 duration-300 order-1 sm:order-2"
                    >
                      Get Started
                    </button>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Onboarding;
