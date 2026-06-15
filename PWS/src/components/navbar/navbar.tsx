import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import logoDark from '../../assets/logo-dark.png';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const NavLinksData = [
  { title: 'About', href: '#about' },
  { title: 'Services', href: '#services' },
  { title: 'How It Works', href: '#how-it-works' },
  { title: 'Testimonials', href: '#testimonials' },
];

const SocialLinksData = [
  { Icon: FaFacebook, href: '#' },
  { Icon: FaTwitter, href: '#' },
  { Icon: FaInstagram, href: '#' },
  { Icon: FaLinkedin, href: '#' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);



  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-white backdrop-blur-lg border-b border-gray-100/50">
      <div className="container">
        <nav className="flex justify-between items-center py-5">

          <div className="flex items-center">
            <a href="#" className="flex items-center group">
              <img src={logoDark} alt="myPSW+ logo" className="h-8 lg:h-11 group-hover:scale-105 duration-300" />
            </a>
          </div>

          <ul className="hidden lg:flex gap-10 text-[15px] items-center">
            {NavLinksData.map((link) => (
              <li key={link.title}>
                <a
                  href={link.href}
                  className="relative py-2 text-gray-600 hover:text-primary font-medium duration-300 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-primary hover:before:w-full before:duration-300"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-6">
            <Link to="/login" className="text-gray-600 font-semibold border border-gray-600/20 rounded-full hover:text-primary hover:border-primary duration-300 px-4 py-2">Login</Link>
            <Link to="/signup" className="btn-gradient-pink text-white px-7 py-3 rounded-full font-bold shadow-md hover:shadow-lg">
              Get Started
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-primary hover:scale-110 active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
          >
            <HiMenuAlt3 size={32} />
          </button>
        </nav>
      </div>

      <div
        className={clsx(
          'fixed inset-0 bg-primary/20 backdrop-blur-md z-[101] lg:hidden duration-500',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={clsx(
          'fixed top-0 right-0 h-screen w-full sm:w-mobile-sidebar bg-white z-[102] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col lg:hidden duration-500 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full bg-white">
          <div className="p-4 flex justify-between items-center bg-gray-100/40 border-b border-gray-100">
            <img src={logoDark} alt="logo" className="h-8 lg:h-11 group-hover:scale-105 duration-300" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-primary hover:bg-primary/10 rounded-full duration-300"
            >
              <HiX size={32} />
            </button>
          </div>

          <div className="p-6 sm:p-8 pb-12 flex flex-col flex-grow bg-gradient-to-b from-white to-primary/5">

            <ul className="flex flex-col gap-6 flex-grow">
              {NavLinksData.map((link, i) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      'text-3xl sm:text-5xl font-black text-gray-900 hover:text-primary duration-700 flex items-center gap-4 group',
                      isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    )}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <span className="text-xs text-primary/30 group-hover:text-primary">0{i + 1}</span>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className={clsx(
              'space-y-8 mt-auto pt-10 border-t border-primary/10 duration-700 delay-500',
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            )}>
              <div className="flex flex-col gap-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-4 text-gray-900 font-bold text-lg border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full text-center py-5 btn-gradient-pink text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl">
                  Get Started
                </Link>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-6">
                  {SocialLinksData.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="text-gray-400 hover:text-primary duration-300 text-2xl"
                    >
                      <social.Icon />
                    </a>
                  ))}
                </div>
                <p className="text-xs text-primary/40">© 2026 myPSW+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
