import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <div className="mb-8 flex items-center">
          <Link to="/" className="text-purple-600 hover:text-purple-700 mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-purple-600">Unmute</h1>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Terms of Service</h2>
        
        <div className="prose prose-purple max-w-none">
          <p className="text-gray-700 mb-4">
            Last Updated: June 1, 2023
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1. Agreement to Terms</h3>
          <p className="mb-4">
            By accessing or using the Unmute platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h3>
          <p className="mb-4">
            Unmute is a social media platform designed to promote activism and social causes. We provide users with tools to share content, connect with others, and engage with important social issues.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h3>
          <p className="mb-4">
            When you create an account with us, you must provide accurate, complete, and up-to-date information. You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4. User Content</h3>
          <p className="mb-4">
            Our platform allows you to post, link, store, share and otherwise make available certain information, text, images, videos, or other material. You are responsible for the content you post, including its legality, reliability, and appropriateness.
          </p>
          <p className="mb-4">
            By posting content on Unmute, you grant us the right to use, reproduce, modify, perform, display, distribute, and otherwise disclose to third parties any such material for the purpose of providing and improving our service.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">5. Prohibited Activities</h3>
          <p className="mb-4">
            You may not engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Posting harmful, threatening, abusive, harassing, defamatory, or hateful content.</li>
            <li>Engaging in any illegal activities.</li>
            <li>Impersonating another person or entity.</li>
            <li>Interfering with or disrupting the service or servers or networks connected to the service.</li>
            <li>Collecting or tracking the personal information of others.</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">6. Intellectual Property</h3>
          <p className="mb-4">
            The Unmute platform and its original content, features, and functionality are owned by Unmute and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">7. Termination</h3>
          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">8. Limitation of Liability</h3>
          <p className="mb-4">
            In no event shall Unmute, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">9. Changes to Terms</h3>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h3>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at terms@unmute.io.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
