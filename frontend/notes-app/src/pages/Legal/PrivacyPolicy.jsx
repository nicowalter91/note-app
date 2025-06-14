import React from 'react';
import Layout from '../../components/Layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="mb-6">
            Last updated: June 14, 2025
          </p>
          
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-6">
            Welcome to mytacticlab. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our website and inform you about your privacy rights and how the law protects you.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">2. Data We Collect</h2>
          <p className="mb-6">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Identity Data includes first name, last name, username or similar identifier.</li>
            <li className="mb-2">Contact Data includes email address and telephone numbers.</li>
            <li className="mb-2">Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
            <li className="mb-2">Usage Data includes information about how you use our website and services.</li>
            <li className="mb-2">Profile Data includes your username and password, your preferences, feedback, and survey responses.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Data</h2>
          <p className="mb-6">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li className="mb-2">Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
            <li className="mb-2">Where we need to comply with a legal obligation.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-6">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">5. Your Legal Rights</h2>
          <p className="mb-6">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, object to processing, and data portability.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p className="mb-6">
            Email: privacy@mytacticlab.com<br />
            Address: Sample Street 123, 12345 Berlin, Germany
          </p>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>mytacticlab GmbH</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
