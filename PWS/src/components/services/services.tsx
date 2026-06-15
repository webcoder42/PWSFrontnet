import { FaUserNurse, FaHandsHelping, FaHome, FaUtensils, FaBroom, FaHeartbeat, FaArrowRight } from 'react-icons/fa';

const services = [
  {
    title: 'Personal Care',
    description: 'Assistance with daily living activities, hygiene, dressing, and mobility for a better quality of life.',
    icon: <FaUserNurse size={24} />,
  },
  {
    title: 'Respite Care',
    description: 'Temporary relief for primary caregivers, ensuring your loved ones are in safe and caring hands.',
    icon: <FaHeartbeat size={24} />,
  },
  {
    title: 'In-Home Nursing',
    description: 'Professional medical care, medication management, and health monitoring in the comfort of home.',
    icon: <FaHome size={24} />,
  },
  {
    title: 'Companionship',
    description: 'Meaningful social interaction, emotional support, and engaging activities to boost mental well-being.',
    icon: <FaHandsHelping size={24} />,
  },
  {
    title: 'Meal Preparation',
    description: 'Nutritious, customized meal planning and preparation to meet specific dietary requirements.',
    icon: <FaUtensils size={24} />,
  },
  {
    title: 'Household Support',
    description: 'Light housekeeping, laundry, and organization to maintain a tidy and safe living environment.',
    icon: <FaBroom size={24} />,
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-surface rounded-4xl">
      <div className="container">
        <div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 relative z-10">For Families</h3>
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">
                Comprehensive Care<br className="hidden md:block" /> For Every Chapter
              </h2>
              <p className="text-gray-600 text-lg">
                We provide tailored care solutions designed to meet the unique needs of every individual, ensuring comfort, dignity, and peace of mind.
              </p>
            </div>
            <button className="text-primary font-bold hover:text-accent duration-300 whitespace-nowrap flex items-center gap-2">
              View All Services <span className="text-sm"><FaArrowRight /></span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl duration-300 group border border-transparent hover:border-primary/10">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white duration-300">
                  {service.icon}
                </div>
                <h3 className="font-bold text-2xl text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-accent duration-300">
                  Learn More <FaArrowRight />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
