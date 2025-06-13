import React from 'react';
import Layout from '../../components/Layout/Layout';
import { FaChartLine, FaCalendarAlt, FaUsers, FaClipboardList } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
    const performanceData = [
        { name: 'Session 1', performance: 80 },
        { name: 'Session 2', performance: 85 },
        { name: 'Session 3', performance: 78 },
        { name: 'Session 4', performance: 90 },
        { name: 'Session 5', performance: 88 },
    ];

    const attendanceData = [
        { name: 'Week 1', attendance: 20 },
        { name: 'Week 2', attendance: 18 },
        { name: 'Week 3', attendance: 22 },
        { name: 'Week 4', attendance: 19 },
    ];

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Übersicht</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                        <FaChartLine className="text-blue-600 text-3xl mr-4" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700">Teamleistung</h2>
                            <p className="text-gray-500">Verfolge die letzten Sitzungen</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                        <FaCalendarAlt className="text-green-600 text-3xl mr-4" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700">Bevorstehende Ereignisse</h2>
                            <p className="text-gray-500">Sieh dir deinen Zeitplan an</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                        <FaUsers className="text-yellow-600 text-3xl mr-4" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700">Spieler</h2>
                            <p className="text-gray-500">Verwalte dein Team</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                        <FaClipboardList className="text-red-600 text-3xl mr-4" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700">Berichte</h2>
                            <p className="text-gray-500">Analysiere Statistiken</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Teamleistung</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="performance" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Teamanwesenheit</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={attendanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="attendance" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
