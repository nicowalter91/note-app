import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 p-4 border-t border-gray-200 flex justify-between items-center">
      {/* Copyright Section */}
      <p className="text-sm">© 2025 Team Management App</p>

      {/* Legal Links Section */}
      <div className="flex space-x-4 text-xs">
        <Link to="/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link to="/terms-of-service" className="hover:underline">
          Terms of Service
        </Link>
        <Link to="/imprint" className="hover:underline">
          Imprint
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
