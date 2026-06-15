import { FaStar, FaQuoteRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sylvia Davies",
      role: "Family Caregiver",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150",
      quote: "Finding myPSW+ was a blessing. Having reliable, caring professionals look after my mother has given me immense peace of mind. The platform is incredibly easy to use and the caregivers truly become like family.",
      rating: 5,
    },
    {
      name: "Mary Campbell",
      role: "Personal Support Worker",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150",
      quote: "Working with myPSW+ has transformed my career. I have the flexibility to choose jobs that fit my schedule and the pay is much better than traditional agencies. It's empowering to take control of my work.",
      rating: 5,
    },
    {
      name: "John Wilson",
      role: "Senior Client",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150",
      quote: "The quality of care I receive is exceptional. My PSW is not just a worker, but a companion who understands my needs and respects my independence.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary text-center mb-12 md:mb-16">
            Stories From Our Community
          </h2>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 2,
              },
            }}
            className="testimonial-swiper !pb-16"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="group h-full bg-white border border-gray-100 duration-500 rounded-4xl p-8 md:p-10 relative overflow-hidden shadow-sm hover:shadow-2xl">

                  <div className="absolute inset-0 bg-[image:var(--background-image-gradient-purple)] opacity-0 group-hover:opacity-100 duration-500 z-0" />

                  <FaQuoteRight className="absolute top-6 right-6 md:top-8 md:right-8 text-primary/10 group-hover:text-white/10 duration-500 z-10" size={60} />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="size-14 md:size-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-white/20 duration-500">
                        <img src={testimonial.image} alt={testimonial.name} className="size-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl text-gray-900 group-hover:text-white duration-500">{testimonial.name}</h4>
                        <p className="text-gray-500 group-hover:text-white/70 text-xs md:text-sm duration-500">{testimonial.role}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 group-hover:text-white/90 text-sm md:text-lg leading-relaxed mb-8 duration-500">
                      "{testimonial.quote}"
                    </p>

                    <div className="flex text-yellow-500 group-hover:text-yellow-400 gap-1 duration-500">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} size={16} />
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
