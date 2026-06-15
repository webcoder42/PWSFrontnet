import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import logoDark from '../../assets/logo-dark.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 md:pt-20 pb-8">
      <div className="container">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-16">

            <div className="lg:col-span-2">
              <a href="#" className="flex items-center mb-6 transform duration-300 hover:scale-105 inline-block">
                <img src={logoDark} alt="myPSW+ logo" className="h-12" />
              </a>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Connecting families with qualified, compassionate Personal Support Workers. Quality care, delivered to your door.
              </p>
              <div className="flex items-center gap-8 text-gray-400">
                <a href="#" className="flex items-center justify-center text-gray-400 hover:text-primary hover:-translate-y-1 duration-300"><FaFacebook size={28} /></a>
                <a href="#" className="flex items-center justify-center text-gray-400 hover:text-primary hover:-translate-y-1 duration-300"><FaTwitter size={28} /></a>
                <a href="#" className="flex items-center justify-center text-gray-400 hover:text-primary hover:-translate-y-1 duration-300"><FaInstagram size={28} /></a>
                <a href="#" className="flex items-center justify-center text-gray-400 hover:text-primary hover:-translate-y-1 duration-300"><FaLinkedin size={28} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#about" className="hover:text-primary hover:translate-x-1 inline-block duration-300">About Us</a></li>
                <li><a href="#how-it-works" className="hover:text-primary hover:translate-x-1 inline-block duration-300">How It Works</a></li>
                <li><a href="#services" className="hover:text-primary hover:translate-x-1 inline-block duration-300">Services</a></li>
                <li><a href="#testimonials" className="hover:text-primary hover:translate-x-1 inline-block duration-300">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Services</h4>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#services" className="hover:text-primary hover:translate-x-1 inline-block duration-300">Personal Care</a></li>
                <li><a href="#services" className="hover:text-primary hover:translate-x-1 inline-block duration-300">Respite Care</a></li>
                <li><a href="#services" className="hover:text-primary hover:translate-x-1 inline-block duration-300">In-Home Nursing</a></li>
                <li><a href="#services" className="hover:text-primary hover:translate-x-1 inline-block duration-300">Companionship</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Support</h4>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block duration-300">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block duration-300">FAQ</a></li>
                <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block duration-300">Terms of Service</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} myPSW+. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
