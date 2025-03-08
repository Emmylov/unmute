import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <div className="mb-8 flex items-center">
          <Link to="/" className="text-purple-600 hover:text-purple-700 mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-purple-600">Unmute</h1>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Privacy Policy</h2>
        
        <div className="prose prose-purple max-w-none">
          <p className="text-gray-700 mb-4">
            Last Updated: June 1, 2023
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h3>
          <p className="mb-4">
            Welcome to Unmute. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our platform and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2. The Data We Collect About You</h3>
          <p className="mb-4">
            Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Identity Data includes username, name, and profile picture.</li>
            <li>Contact Data includes email address.</li>
            <li>Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform, and other technology on the devices you use to access this platform.</li>
            <li>Profile Data includes your username, password, interests, preferences, feedback, and survey responses.</li>
            <li>Usage Data includes information about how you use our platform and services.</li>
            <li>Content Data includes photos, videos, and posts that you create on the platform.</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Personal Data</h3>
          <p className="mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>To register you as a new user.</li>
            <li>To provide and improve our service to you.</li>
            <li>To personalize your experience.</li>
            <li>To communicate with you about updates or changes to our service.</li>
            <li>To administer and protect our business and this platform.</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h3>
          <p className="mb-4">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">5. Your Legal Rights</h3>
          <p className="mb-4">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data, and the right to withdraw consent.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">6. Contact Us</h3>
          <p className="mb-4">
            If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@unmute.io.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
