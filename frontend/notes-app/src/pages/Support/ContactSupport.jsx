import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { FaPaperPlane, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Hier würde der Code zum Senden der Support-Anfrage an den Server stehen
    console.log(formData);
    
    // Simulierte erfolgreiche Übermittlung
    setIsSubmitted(true);
    
    // Form zurücksetzen
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contact Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="mb-4 text-green-500">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Request Received</h2>
                  <p className="text-gray-600 mb-4">
                    Thank you for contacting us. We've received your support request and will get back to you soon.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-semibold mb-6">Submit a Support Request</h2>
                  
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Category & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                        Support Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General Question</option>
                        <option value="account">Account Issues</option>
                        <option value="billing">Billing & Subscription</option>
                        <option value="technical">Technical Problem</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please describe your issue in detail..."
                      required
                    ></textarea>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex items-center transition"
                    >
                      <FaPaperPlane className="mr-2" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Right Column - Contact Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">support@mytacticlab.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaPhone className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+49 123 456789</p>
                    <p className="text-xs text-gray-500">Mon-Fri, 9:00-17:00 CET</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaComment className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-gray-600">Available on business days</p>
                    <p className="text-xs text-gray-500">9:00-17:00 CET</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-sm text-gray-600 mb-4">
                We typically respond to support requests within 24 hours during business days.
              </p>
              <h3 className="font-semibold mb-2">Before Contacting Us</h3>
              <p className="text-sm text-gray-600">
                Check our <a href="/help" className="text-blue-600 hover:underline">Help Center</a> for quick answers to common questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactSupport;
