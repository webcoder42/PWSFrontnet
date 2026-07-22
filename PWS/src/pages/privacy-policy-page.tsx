import { Link } from 'react-router-dom';
import logoDark from '../assets/logo-dark.png';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-6">
        <Link to="/" className="inline-block">
          <img src={logoDark} alt="myPSW+ logo" className="h-12 hover:scale-105 duration-300" />
        </Link>
      </div>

      <div className="container max-w-4xl pb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">Privacy Notice</h1>
        <p className="text-gray-400 font-medium mb-12">Last updated: 2024-01-08</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <p>
              Essential Help Global Corp. (“we” or “us”) operates the mypswplus.com website (the “Website”) and marketplace application (the “Application”, and together with the Website, the “Service”) to facilitate the purchase and scheduling of third-party Caregiving Services, by Care Providers, as such terms are defined under our Terms of Service. We respect the privacy of all of our users, and this Privacy Notice specifically applies to:
            </p>
            <p className="mt-4">
              <strong>(a)</strong> Care Providers: Care Providers are individuals who offer Caregiving Services and support to individuals in need, often including services related to healthcare, personal assistance, and companionship;
            </p>
            <p className="mt-2">
              <strong>(b)</strong> Patients: Patients refer to individuals who seek medical, caregiving or healthcare services, treatment, or assistance to address their physical or medical conditions (collectively “Caregiving Services”), seeking care and support from Care Providers; and
            </p>
            <p className="mt-2">
              <strong>(c)</strong> Guest Users: Family members of patients or other users who utilize the Service to efficiently schedule and request Caregiving Services for their elderly family members or other Patients who require specialized care.
            </p>
            <p className="mt-4">
              We are committed to protecting the personal information of each User. This Privacy Notice applies to all Users and is effective as of the date of its posting. Please take the time to review this Privacy Notice carefully. By accessing the Website, downloading or using the Application, or providing any type of personal information to us, you agree to the terms of this Privacy Notice. If you do not agree to the terms set out in this Privacy Notice, we request that you cease using any part of the Service immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Personal Information Collected</h2>
            <p>
              Through your access and use of the Website or the use of our services we may collect the following types of “User Information”:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Identifiers</strong> – information reasonably capable of identifying you, such as a real name, alias, postal address, email address, demographic data, user verification photos, or other similar identifiers;</li>
              <li><strong>Commercial information</strong> – information regarding services purchased from us, third-party Caregiving Services purchased, and information disclosed to us to perform such services or to facilitate the performance of the Caregiving Services, and payment information, used to facilitate your payment;</li>
              <li><strong>Patient Information</strong> – information regarding any personal health or medical information provided by you through the Application to facilitate the provision of the Caregiving Services by the Care Providers;</li>
              <li><strong>User Content</strong> – information provided by you, including all ratings and reviews associated with your experience with applicable Care Providers, and any associated content; and</li>
              <li><strong>Geolocation data</strong> – information that can be used to identify an electronic device’s physical location.</li>
            </ul>
            <p className="mt-4">
              In addition, we may collect the following types of Personal Information on a deidentified basis:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Electronic network activity information regarding your interaction with the Website, Application or our advertisements; and</li>
              <li>Inferences drawn from any of the information identified in this section – to create a profile about a consumer reflecting the consumer’s preferences, characteristics, psychological trends, predispositions, behaviour, attitudes, abilities, and aptitudes.</li>
            </ul>
            <p className="mt-4">
              We collect Device Information through the following ways:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Cookies</strong> are data files that are placed on your device or computer and often include an anonymous unique identifier. We use cookies to track your use of the Service and this enables us to understand how you use our services and track patterns to better improve our functionality and offerings.</li>
              <li><strong>Log files</strong> track actions occurring through the Service, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.</li>
              <li><strong>Web beacons</strong>, “tags”, and “pixels” are electronic files used to record information about how you browse the Website or the Application.</li>
            </ul>
            <p className="mt-4">
              References to “Personal Information” in this Privacy Policy refer to both Device Information and User Information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Use, Disclosure, and Consent</h2>
            <p>
              For the purposes of all Personal Information collected through the Service, we are the data controller. We operate and process personal data globally in accordance with the terms of this Privacy Notice; wherever and whenever you require Caregiving Services, your data travels with you so we can offer you a seamless experience. We respect all relevant international data processing legislation and regulation.
            </p>
            <p className="mt-4">
              We use User Information to perform our services, including the facilitation of the Caregiving Services and to provide you information on our services via email. In performing our services, certain User Information will be provided to third party Care Providers for the purpose of performing such Caregiving Services. Additionally, we use certain third party services to assist us in the provision of the Service. Additionally, we may use such information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>create, administer and update your Application account and provide our Service;</li>
              <li>facilitate the provision of the Caregiving Services, including providing the applicable Care Provider with all relevant Patient Information, enabling communication between you and such Care Provider(s), and using Patient Information to match you with potential Care Providers;</li>
              <li>verify your identity and screen for potential risk or fraud;</li>
              <li>process your payments;</li>
              <li>provide you with information or advertising relating to our services;</li>
              <li>enable certain third party advertising through our Service, including sponsored Care Provider listings personalized based on your location and service needs, and other forms of personalized advertisements;</li>
              <li>provide customer support to you;</li>
              <li>improve our Service; or</li>
              <li>meet regulatory requirements.</li>
            </ul>
            <p className="mt-4">
              We use Patient Information for the sole purpose of facilitating the provision of the Caregiving Services and for no other purpose, and shall be maintained at all times in accordance with the terms of the Personal Health Information Protection Act (Ontario).
            </p>
            <p className="mt-4">
              We use Device Information to assist us in screening for potential risk and fraud (in particular, your IP address), and more generally to evaluate, improve, develop and optimize our Service. We may also use Device Information to map and forecast general industry trends and other analytical information.
            </p>
            <p className="mt-4">
              We will not use or disclose any Personal Information to anyone except as described in this Privacy Policy. We will not sell your Personal Information to other parties without your consent. Except as explicitly specified below, we will obtain your express or implied consent to collect, use, sell or disclose any Personal Information. You can provide consent orally, in writing, electronically or through an authorized representative. We will never sell any of your Patient Information.
            </p>
            <p className="mt-4">
              In the event of a change of control of our business, or substantially all of our business undertaking (inclusive of a merger or consolidation), or any other form of corporate reorganization, action or transfer between our corporate entities, you expressly consent us transferring your Personal Information to the new owner or successor entity to enable the continued performance of our Service. Where required, we will notify the applicable data protection agency in each jurisdiction applicable to such transfer in accordance with all relevant data protection legislation.
            </p>
            <p className="mt-4">
              You provide us with implied consent where our purpose for collecting, using or disclosing Personal Information is necessary for the provision of our services or would be considered obvious or reasonable in the circumstances. Your consent may also be implied where you have received notice and a reasonable opportunity to opt-out of having the Personal Information used, and you have not provided us with notice of your opting-out, including but not limited to use for mail-outs, marketing or fundraising.
            </p>
            <p className="mt-4">
              We may collect, use or disclose your Personal Information without your consent in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>when permitted or required by law;</li>
              <li>in an emergency that threatens an individual’s life, health, or personal security;</li>
              <li>when the Personal Information is available from a public source;</li>
              <li>when we require legal advice from a lawyer; or</li>
              <li>for the purposes of collecting a debt or protection from fraud; or</li>
              <li>other legally established reasons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Caregiving Services</h2>
            <p>
              You agree that you shall not provide us with any Patient Information from a third party Patient, unless you have the express written consent and authorization: (i) to act on behalf of such Patient with respect to the provision of the Caregiving Services; and (ii) of such Patient with respect to the transmission of such Patient Information.
            </p>
            <p className="mt-4">
              By purchasing any Caregiving Service through our Application, you agree that all applicable Personal Information and Patient Information provided to us in the course of administering your account may be processed as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>you expressly consent to the disclosure and transfer of such information to the applicable third-party Care Provider from whom you have purchased such Caregiving Service; and</li>
              <li>you acknowledge and agree that following the transfer of such information to any Care Provider, we will, upon request, remove any such Personal Information from our databases in accordance with this Policy, but cannot guarantee the removal of such information from any third-party client database, or other location outside of our control.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Third-Party Services</h2>
            <p>
              From time to time, we may make use of third-party service providers (“External Providers”), including service providers located in Canada and the United States to store and process data, including your Personal Information, on our behalf. We may use External Providers to process your payments, to provide cloud storage, to enable third party social media or search engine advertising, to assist in measuring our marketing performance, and to assist in further research and development of our Service. When acting on our behalf, such External Providers shall only be authorized to collect, use, disclose or store your Personal Information in accordance with this Privacy Notice. However, the government, courts, law enforcement, security, or regulatory agencies of a particular country may be able to obtain access to or disclosure of Personal Information as permitted by the laws of that country. A current list of third-party service providers who may have access to your personal information is as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>GoogleDrive</strong> – we use GoogleDrive to store certain information and to provide clients with access to such information;</li>
              <li><strong>GoDaddy</strong> – we use GoDaddy to host the Website;</li>
              <li><strong>Google Analytics</strong> – we use Google Analytics to help us understand how our customers use the Website; and</li>
              <li><strong>Additional third-party tools</strong> – as applicable to our eCommerce or email campaign services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Storage of Personal Information</h2>
            <p>
              Your Personal Information may be stored electronically in our database, including databases hosted by applicable External Providers, or in hardcopy format. We will only retain Personal Information and associated Patient Information for the time necessary to fulfill the identified purposes or an applicable legal or business purpose, or as otherwise required by an application governing or regulatory body. The period that we retain your Personal Information is determined by the type of data collected, type of Patient to whom such data relates and the purpose(s) under which we collected such Personal Information.
            </p>
            <p className="mt-4">
              Please note, when you sign up for an account through the Application, or enroll in our mailing list, we will maintain your Personal Information for our records unless and until you request that we delete this information. However, we make no guarantee of any period of retention, and reserve the right to delete such information at any time.
            </p>
            <p className="mt-4">
              Users may request the deletion of their account through the support contact provided below. We will use appropriate security measures when destroying your Personal Information such as shredding documents or deleting electronically stored information. Following an account deletion request, we delete the account and all associated data unless any such information must be retained due to legal or regulatory requirements, for purposes of safety, security, and fraud prevention, or because of an issue relating to such account, such as outstanding payments or unresolved claims or disputes. As we are subject to legal and regulatory requirements relating to caregivers and patients, this generally means that we retain their account and data for the applicable statutory retention period after a deletion request. For patients and caregivers, data is generally deleted within 90 days of a deletion request, except where retention is necessary for the above reasons.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Access to Personal Information and Your Legal Rights</h2>
            <p>
              If requested, we will provide you with a copy of any of your Personal Information in electronic form, which may include the following related information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>what Information we are storing;</li>
              <li>where it is being stored; and</li>
              <li>for what purpose we are storing it.</li>
            </ul>
            <p className="mt-4">
              Under applicable data protection laws you have rights in relation to your Personal Information that include the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing such data is your consent) to withdraw consent, or to cease use of any such Personal Information while we resolve any complaint made by you.
            </p>
            <p className="mt-4">
              At any time, you may request that we remove your Personal Information from our records, and we will delete, or request that an applicable External Provider deletes, such Personal Information within ninety (90) days of receipt of such request.
            </p>
            <p className="mt-4">
              For privacy protection purposes, we will need to verify your identity before providing you with access to, deleting or otherwise modifying your Personal Information.
            </p>
            <p className="mt-4">
              You can learn more about your legal rights at the Information and Privacy Commissioner of Ontario.
            </p>
            <p className="mt-4">
              To submit a question to us about the collection or use of the Personal Information, or to make any request pursuant to your rights set out above, please email us at <strong>privacy@mypswplus.com</strong> and insert “Privacy Information Question” in the subject header. If you are not happy with any aspect of how we collect and use your Personal data, you have the right to complain to the Information and Privacy Commissioner of Ontario.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Security</h2>
            <p>
              We are committed to ensuring the security of your Personal Information and may use passwords, encryption, firewalls, restricted employee access or other methods, at our reasonable discretion.
            </p>
            <p className="mt-4">
              While we strive to use commercially acceptable means to protect the Personal Information, you acknowledge and agree that no method of transmission over the Internet, or method of electronic storage is 100% secure. We make no guarantee as to the absolute security of the Personal Information.
            </p>
            <p className="mt-4">
              In the unlikely event that our system is breached, and any Personal Information has been compromised, we will notify such local authorities as may be required within seventy-two (72) hours of the breach and will also use our best efforts to notify you, using the most current contact information that we have on file. We are not responsible for any failure to notify you based on incorrect or outdated contact information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Cookies</h2>
            <p>
              We use Cookies in the operation of the Website. When these Cookies are not strictly necessary for your use of the Service’s functionality, we will ask your consent to use such Cookies.
            </p>
            <p className="mt-4">
              We may use Cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Authentication</strong> – to identify you when you visit and navigate any part of the Service;</li>
              <li><strong>Personalization</strong> – to store information about your preferences and personalize our Service offering for you;</li>
              <li><strong>Security</strong> – to protect the Service;</li>
              <li><strong>Analysis</strong> – to help us analyze the use and performance of the Service; and</li>
              <li><strong>Cookie consent</strong> – to store your preferences in relation to the use of Cookies.</li>
            </ul>
            <p className="mt-4">
              Most browsers allow you to refuse to accept cookies or to delete cookies. Blocking cookies may negatively impact the performance of our website, or your access to all features of our Service. You may obtain up-to-date information about blocking and deleting cookies via your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Citizens of the European Union</h2>
            <p>
              If you are a European resident, please note that we are located in Canada and your Personal Information may be processed in any country where we engage External Providers.
            </p>
            <p className="mt-4">
              If you are located in the European Economic Area (“EEA”), we comply with the provisions of the General Data Protection Regulations that protect your Personal Information. Where we transfer your data to third parties outside of the EEA, we will ensure that certain safeguards are in place to ensure a similar degree of security for your Personal Information. As such:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>we may transfer your Personal Information to countries that the European Commission has approved as providing an adequate level of protection for Personal Information; or</li>
              <li>where we use certain service providers who are established outside of the EEA, we may use specific contracts or codes of conduct or certification mechanisms approved by the European Commission which give personal data the same protection it has in Europe.</li>
            </ul>
            <p className="mt-4">
              If none of the above safeguards is available, we shall only transfer your data where you have provided your consent. You will have the right to withdraw this consent at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Changes</h2>
            <p>
              We may update this Privacy Notice from time to time, and we will post updates to this Privacy Policy to this page. You are advised to review this Privacy Notice periodically to be aware of any updates. Changes to this Privacy Notice are effective as of their posting on this page.
            </p>
            <p className="mt-4">
              If any material changes are made to this Privacy Notice, we will notify you either through the email address you have provided us, or by placing a prominent notice on the Website.
            </p>
            <p className="mt-4">
              By continuing to use the Website after changes are made to this Privacy Notice, you are agreeing to be bound by the updated Privacy Notice. If you do not agree to be bound by the updated Privacy Notice, please stop using the Service, or any part thereof.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Do Not Track</h2>
            <p>
              Please note that we do not alter our data collection and use practices when we receive any type of Do Not Track signal from your browser and will continue to collect, use, and dispose of your Personal Information in accordance with this Privacy Notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Links to Other Websites</h2>
            <p>
              The Website may contain links to other web sites that we do not control (“Third Party Sites”). We strongly advise you to review the privacy policy of every site you visit. We have no control over, and assume no responsibility for the content, privacy policies or practices of any Third Party Site or their associated services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Minors</h2>
            <p>
              If you are a parent or guardian and you are aware that your minor child has provided us with Personal Information, please contact us. If we become aware that we have collected Personal Information from minors, we will take all appropriate steps to remove that information from our servers, unless otherwise agreed in writing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Contact Us</h2>
            <p>
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <strong>privacy@mypswplus.com</strong> or by mail using the details provided below:
            </p>
            <p className="mt-4">
              <strong>Essential Help Global Corp.</strong><br />
              Attn: Data Protection Officer<br />
              Re: Privacy<br />
              123 Care Street, Suite 200, Toronto, ON M5V 2T6, Canada
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
