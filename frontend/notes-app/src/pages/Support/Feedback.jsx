import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { FaPaperPlane, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Hier würde der Code zum Senden des Feedbacks an den Server stehen
    console.log({ feedbackType, feedbackText, email });
    
    // Simulierte erfolgreiche Übermittlung
    setIsSubmitted(true);
    
    // Form zurücksetzen
    setFeedbackType('');
    setFeedbackText('');
    setEmail('');
    
    // Nach 5 Sekunden die Erfolgsmeldung ausblenden
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Give Feedback</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mb-4 text-green-500">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
              <p className="text-gray-600">Your feedback has been submitted successfully. We appreciate your input!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="mb-6 text-gray-600">
                We value your opinion! Please share your thoughts, suggestions, or report any issues you've encountered.
                Your feedback helps us improve mytacticlab.
              </p>
              
              {/* Feedback Type Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3">How would you rate your experience?</label>
                <div className="flex justify-center space-x-8">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('positive')}
                    className={`flex flex-col items-center p-4 rounded-lg transition ${
                      feedbackType === 'positive' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaSmile className="text-3xl mb-2" />
                    <span>Positive</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFeedbackType('neutral')}
                    className={`flex flex-col items-center p-4 rounded-lg transition ${
                      feedbackType === 'neutral' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaMeh className="text-3xl mb-2" />
                    <span>Neutral</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFeedbackType('negative')}
                    className={`flex flex-col items-center p-4 rounded-lg transition ${
                      feedbackType === 'negative' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaFrown className="text-3xl mb-2" />
                    <span>Negative</span>
                  </button>
                </div>
              </div>
              
              {/* Feedback Text */}
              <div className="mb-6">
                <label htmlFor="feedback" className="block text-gray-700 text-sm font-bold mb-2">
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  rows="5"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please share your thoughts, suggestions, or report any issues..."
                  required
                ></textarea>
              </div>
              
              {/* Email Field */}
              <div className="mb-8">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your email address for follow-up"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll only use your email to follow up on your feedback if necessary.
                </p>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex items-center transition"
                  disabled={!feedbackType || !feedbackText}
                >
                  <FaPaperPlane className="mr-2" />
                  Submit Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
