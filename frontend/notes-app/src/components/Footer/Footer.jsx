import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1E293B] text-gray-300 text-center py-2 flex flex-col md:flex-row justify-between items-center px-4 md:pl-72">
      <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      <div className="mt-2 md:mt-0">
        <a href="/legal" className="text-[#38BDF8] hover:text-[#0EA5E9] mx-2">Legal Notice</a>
        <a href="/privacy" className="text-[#38BDF8] hover:text-[#0EA5E9] mx-2">Privacy Policy</a>
        <a href="/terms" className="text-[#38BDF8] hover:text-[#0EA5E9] mx-2">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
