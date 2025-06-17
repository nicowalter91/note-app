import React from 'react';
import Layout from '../../components/Layout/Layout';
import { PageHeader, Card } from '../../components/UI/DesignSystem';

const LegalNotice = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Impressum"
          subtitle="Gesetzlich erforderliche Angaben gemäß TMG"
        />
        
        <Card className="p-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Unternehmensangaben</h2>
              <p className="text-gray-700">
                mytacticlab GmbH<br />
                Musterstraße 123<br />
                12345 Berlin<br />
                Deutschland
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Kontakt</h2>
              <p className="text-gray-700">
                E-Mail: info@mytacticlab.com<br />
                Telefon: +49 123 456789
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Geschäftsführung</h2>
              <p className="text-gray-700">
                Max Mustermann (Geschäftsführer)<br />
                Maria Musterfrau (Technische Leitung)
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Registrierung</h2>
              <p className="text-gray-700">
                Handelsregister: Amtsgericht Berlin<br />
                Registernummer: HRB 123456
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Umsatzsteuer-Identifikationsnummer</h2>
              <p className="text-gray-700">
                USt-ID: DE123456789
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Verantwortlich für den Inhalt</h2>
              <p className="text-gray-700">
                Max Mustermann<br />
                Musterstraße 123<br />
                12345 Berlin<br />
                Deutschland
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Letzte Aktualisierung: 17. Juni 2025
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LegalNotice;
