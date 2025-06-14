import React from 'react';
import Layout from '../../components/Layout/Layout';
import { FaSearch, FaBook, FaVideo, FaQuestionCircle } from 'react-icons/fa';

const HelpCenter = () => {
  // Häufig gestellte Fragen
  const faqs = [
    {
      question: "Wie erstelle ich eine neue Notiz?",
      answer: "Um eine neue Notiz zu erstellen, gehen Sie zur Notes-Seite und klicken Sie auf die '+' Schaltfläche in der rechten unteren Ecke. Füllen Sie dann die erforderlichen Felder aus und klicken Sie auf 'Speichern'."
    },
    {
      question: "Wie lade ich ein Spielerfoto hoch?",
      answer: "Navigieren Sie zur Spielerseite, wählen Sie einen Spieler aus oder erstellen Sie einen neuen. Klicken Sie auf das Profilbild und wählen Sie 'Foto hochladen' aus dem Menü. Wählen Sie dann ein Bild von Ihrem Gerät aus."
    },
    {
      question: "Kann ich meine Daten exportieren?",
      answer: "Ja, Sie können Ihre Daten exportieren. Gehen Sie zu Einstellungen > Daten > Export und wählen Sie das gewünschte Format aus. Die Daten werden dann als Datei zum Download angeboten."
    },
    {
      question: "Wie ändere ich mein Passwort?",
      answer: "Um Ihr Passwort zu ändern, gehen Sie zu Ihrem Profil, klicken Sie auf 'Einstellungen' und dann auf 'Passwort ändern'. Geben Sie Ihr aktuelles Passwort und dann Ihr neues Passwort ein."
    },
    {
      question: "Wie kann ich eine Taktik erstellen?",
      answer: "Gehen Sie zur Taktik-Seite und klicken Sie auf 'Neue Taktik erstellen'. Wählen Sie dann die Formation und positionieren Sie die Spieler auf dem Feld durch Drag & Drop."
    }
  ];

  // Hilfe-Kategorien
  const helpCategories = [
    {
      title: "Erste Schritte",
      icon: <FaBook className="text-blue-500" size={24} />,
      description: "Grundlegende Anleitungen zur Verwendung der App"
    },
    {
      title: "Video-Tutorials",
      icon: <FaVideo className="text-blue-500" size={24} />,
      description: "Videoanleitungen zu verschiedenen Funktionen"
    },
    {
      title: "FAQs",
      icon: <FaQuestionCircle className="text-blue-500" size={24} />,
      description: "Häufig gestellte Fragen und Antworten"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Help Center</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help topics..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {helpCategories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Popular FAQs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          
          <div className="divide-y">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <h3 className="text-lg font-medium mb-2 text-blue-600">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact Support */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-3">Still need help?</h2>
          <p className="mb-4">Our support team is ready to assist you with any questions.</p>
          <button 
            onClick={() => window.location.href = '/support'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Contact Support
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
