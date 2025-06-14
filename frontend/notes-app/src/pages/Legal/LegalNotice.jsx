import React from 'react';
import Layout from '../../components/Layout/Layout';

const LegalNotice = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Legal Notice</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <p className="mb-4">
            mytacticlab GmbH<br />
            Sample Street 123<br />
            12345 Berlin<br />
            Germany
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Contact</h2>
          <p className="mb-4">
            Email: info@mytacticlab.com<br />
            Phone: +49 123 456789
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Management</h2>
          <p className="mb-4">
            John Doe (CEO)<br />
            Jane Smith (CTO)
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Registration</h2>
          <p className="mb-4">
            Commercial Register: Local Court Berlin<br />
            Registration Number: HRB 123456
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">VAT Identification Number</h2>
          <p className="mb-4">
            VAT ID: DE123456789
          </p>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Responsible for Content</h2>
          <p className="mb-4">
            John Doe<br />
            Sample Street 123<br />
            12345 Berlin<br />
            Germany
          </p>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Last updated: June 14, 2025</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LegalNotice;
