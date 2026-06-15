import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decryptData } from '../utils/security';
import { getDashboardPathForRole } from '../utils/linkedAccounts';
import Navbar from '../components/navbar/navbar';
import Hero from '../components/hero/hero';
import Stats from '../components/stats/stats';
import Safety from '../components/safety/safety';
import Services from '../components/services/services';
import Process from '../components/process/process';
import FeatureCards from '../components/featureCards/featureCards';
import Testimonials from '../components/testimonials/testimonials';
import CTA from '../components/cta/cta';
import Footer from '../components/footer/footer';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const sessionStr = localStorage.getItem('user_session');
        if (sessionStr) {
            try {
                const user = decryptData(sessionStr);
                if (user?.role) {
                    navigate(getDashboardPathForRole(user.role), { replace: true });
                }
            } catch (e) {
                localStorage.removeItem('user_session');
            }
        }
    }, [navigate]);

    return (
        <div className="bg-white">
            <Navbar />
            <Hero />
            <Stats />
            <Safety />
            <Services />
            <Process />
            <FeatureCards />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
};

export default LandingPage;
