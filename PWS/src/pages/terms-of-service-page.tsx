import { Link } from 'react-router-dom';
import logoDark from '../assets/logo-dark.png';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-6">
        <Link to="/" className="inline-block">
          <img src={logoDark} alt="myPSW+ logo" className="h-12 hover:scale-105 duration-300" />
        </Link>
      </div>

      <div className="container max-w-4xl pb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">Terms of Service</h1>
        <p className="text-gray-400 font-medium mb-12">Last updated: July 7, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the myPSW+ platform ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you must not use the Platform.
            </p>
            <p>
              These Terms apply to all users, including families seeking care services, Personal Support Workers (PSWs) providing services, and any other visitors to the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">2. Description of Services</h2>
            <p>
              myPSW+ operates a digital marketplace that connects families and individuals requiring personal care services with qualified, vetted Personal Support Workers. We facilitate the discovery, booking, and payment for care services but are not a direct provider of care services.
            </p>
            <p>
              All care services are provided directly by independent PSWs who contract through our platform. myPSW+ does not employ, supervise, or direct PSWs in the provision of care.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">3. User Accounts and Registration</h2>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Account Creation</h3>
            <p>
              To access certain features, you must create an account. You agree to provide accurate, current, and complete information and to keep your account credentials confidential.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">Account Responsibilities</h3>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring the accuracy of all information you provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">4. PSW Requirements and Verification</h2>
            <p>
              All PSWs joining our platform must meet the following requirements:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Valid government-issued identification</li>
              <li>Clear vulnerable sector and police background checks</li>
              <li>Relevant certifications and training credentials</li>
              <li>Professional experience and references</li>
              <li>Compliance with all applicable laws and regulations</li>
            </ul>
            <p className="mt-4">
              myPSW+ conducts thorough verification of all PSWs but does not guarantee the accuracy of information provided by PSWs. We encourage families to review PSW profiles and conduct their own due diligence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">5. Bookings and Payments</h2>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Process</h3>
            <p>
              Families can browse PSW profiles, review rates and availability, and book services through our platform. Bookings are confirmed once both parties accept and payment is authorized.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">Payment Terms</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>All payments are processed securely through our platform</li>
              <li>No cash transactions are permitted between users</li>
              <li>Payment is due at the time of booking unless otherwise agreed</li>
              <li>Rates are set by individual PSWs and may vary</li>
              <li>A platform service fee may be applied to each transaction</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">Cancellation and Refunds</h3>
            <p>
              Cancellation policies are clearly displayed at the time of booking. Refunds are processed according to our cancellation policy, which varies depending on the notice period provided.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">6. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Use the Platform for any unlawful purpose</li>
              <li>Harass, abuse, or discriminate against any user</li>
              <li>Provide false or misleading information</li>
              <li>Attempt to circumvent our payment system</li>
              <li>Engage in any activity that disrupts or interferes with the Platform</li>
              <li>Impersonate any person or entity</li>
              <li>Violate the intellectual property rights of others</li>
              <li>Share or post inappropriate, offensive, or confidential information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, myPSW+ shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.
            </p>
            <p className="mt-2">
              myPSW+ is a marketplace platform and is not responsible for the quality, safety, or legality of care services provided by PSWs. The relationship for care services is strictly between the family and the PSW.
            </p>
            <p className="mt-2">
              Our total liability for any claim arising from these Terms shall not exceed the total fees paid by you in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">8. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless myPSW+, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your provision or receipt of care services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">9. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violations of these Terms, fraudulent activity, or conduct that may harm other users or the Platform.
            </p>
            <p className="mt-2">
              Upon termination, your right to use the Platform will immediately cease. Outstanding obligations, including payment for completed services, shall survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">10. Intellectual Property</h2>
            <p>
              The myPSW+ name, logo, platform design, and all related content are protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes arising from these Terms shall be resolved in the courts of Toronto, Ontario.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Platform. Your continued use of the Platform after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">13. Contact Information</h2>
            <p>
              For questions, concerns, or notices regarding these Terms, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Email: <strong>support@mypswplus.com</strong></li>
              <li>Phone: <strong>1-800-MYPSWPLUS</strong></li>
              <li>Address: <strong>123 Care Street, Suite 200, Toronto, ON M5V 2T6, Canada</strong></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
