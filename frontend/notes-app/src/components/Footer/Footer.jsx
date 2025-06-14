import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiHeart, HiQuestionMarkCircle, HiInformationCircle, HiClipboardCheck } from 'react-icons/hi';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#1E293B] text-gray-300 py-4 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and Copyright */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
            <div className="text-sm">
              <p>&copy; {currentYear} mytacticlab. All rights reserved.</p>
            </div>
            <p className="hidden md:flex items-center text-sm">
              <span className="mx-2 text-blue-400">•</span>
              Made with <HiHeart className="text-red-500 mx-1" size={14} /> in Germany
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-5 md:gap-6 text-sm">
            {/* Legal Links */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-xs uppercase text-gray-500 font-medium">Legal</span>
              <div className="flex gap-4">
                <Link 
                  to="/legal" 
                  className="text-[#38BDF8] hover:text-[#0EA5E9] transition-colors duration-200 flex items-center gap-1"
                >
                  <HiInformationCircle className="text-sm" />
                  <span>Legal Notice</span>
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-[#38BDF8] hover:text-[#0EA5E9] transition-colors duration-200 flex items-center gap-1"
                >
                  <HiClipboardCheck className="text-sm" />
                  <span>Privacy</span>
                </Link>
              </div>
            </div>
            
            {/* Support Link */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-xs uppercase text-gray-500 font-medium">Help</span>
              <Link 
                to="/help" 
                className="text-[#38BDF8] hover:text-[#0EA5E9] transition-colors duration-200 flex items-center gap-1"
              >
                <HiQuestionMarkCircle className="text-sm" />
                <span>Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
