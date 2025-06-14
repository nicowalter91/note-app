import React from 'react';
import Layout from '../../components/Layout/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="mb-6">
            Last updated: June 14, 2025
          </p>
          
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-6">
            Welcome to mytacticlab. These terms and conditions outline the rules and regulations for the use of mytacticlab's website and services.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">2. License to Use</h2>
          <p className="mb-6">
            Unless otherwise stated, mytacticlab and/or its licensors own the intellectual property rights for all material on the mytacticlab platform. All intellectual property rights are reserved. You may view and/or print pages from the platform for your own personal use subject to restrictions set in these terms and conditions.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">3. Restrictions</h2>
          <p className="mb-6">
            You are specifically restricted from all of the following:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Publishing any website material in any other media</li>
            <li className="mb-2">Selling, sublicensing and/or otherwise commercializing any website material</li>
            <li className="mb-2">Publicly performing and/or showing any website material</li>
            <li className="mb-2">Using this website in any way that is or may be damaging to this website</li>
            <li className="mb-2">Using this website in any way that impacts user access to this website</li>
            <li className="mb-2">Using this website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the website, or to any person or business entity</li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4">4. Your Account</h2>
          <p className="mb-6">
            If you create an account on the website, you are responsible for maintaining the security of your account, and you are fully responsible for all activities that occur under the account. You must immediately notify mytacticlab of any unauthorized uses of your account or any other breaches of security.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p className="mb-6">
            In no event shall mytacticlab, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website, whether such liability is under contract, tort or otherwise. mytacticlab shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this website.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">6. Indemnification</h2>
          <p className="mb-6">
            You hereby indemnify to the fullest extent mytacticlab from and against any and all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">7. Severability</h2>
          <p className="mb-6">
            If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">8. Variation of Terms</h2>
          <p className="mb-6">
            mytacticlab is permitted to revise these Terms at any time as it sees fit, and by using this website you are expected to review these Terms on a regular basis.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">9. Entire Agreement</h2>
          <p className="mb-6">
            These Terms constitute the entire agreement between mytacticlab and you in relation to your use of this website, and supersede all prior agreements and understandings.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">10. Governing Law & Jurisdiction</h2>
          <p className="mb-6">
            These Terms will be governed by and interpreted in accordance with the laws of Germany, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Germany for the resolution of any disputes.
          </p>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>mytacticlab GmbH</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
