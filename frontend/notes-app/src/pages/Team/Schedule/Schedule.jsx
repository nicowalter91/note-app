import React from 'react';
import Layout from '../../../components/Layout/Layout';
import { PageHeader, Card } from '../../../components/UI/DesignSystem';
import { FaCalendarAlt } from 'react-icons/fa';

const Schedule = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                <PageHeader
                    title="Spielplan & Termine"
                    subtitle="Verwalte Spiele, Trainings und andere wichtige Termine"
                    icon={FaCalendarAlt}
                />
                
                <Card>
                    <p>Schedule-Seite wird gerade migriert...</p>
                </Card>
            </div>
        </Layout>
    );
};

export default Schedule;