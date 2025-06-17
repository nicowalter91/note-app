import React, { useState, useEffect } from 'react';
import { 
    FaChartLine, 
    FaUsers, 
    FaClock, 
    FaCheckCircle, 
    FaStepForward,
    FaUserGraduate,
    FaMapMarked,
    FaComments,
    FaStar,
    FaFilter
} from 'react-icons/fa';
import { Card, Button, LoadingSpinner } from '../UI/DesignSystem';
import { getOnboardingAnalytics } from '../../utils/analyticsService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const OnboardingAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('30d');
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, [timeframe]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getOnboardingAnalytics(timeframe);
            setAnalytics(response.analytics);
        } catch (error) {
            console.error('Error loading analytics:', error);
            setError('Fehler beim Laden der Analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="p-6 text-center">
                    <p className="text-red-600">{error}</p>
                    <Button onClick={loadAnalytics} className="mt-4">
                        Erneut versuchen
                    </Button>
                </div>
            </Card>
        );
    }

    if (!analytics) {
        return (
            <Card>
                <div className="p-6 text-center">
                    <p className="text-gray-600">Keine Analytics-Daten verfügbar</p>
                </div>
            </Card>
        );
    }

    const { overview, byUserType, byOnboardingType, byRole, stepAnalytics, recentSessions, feedback } = analytics;

    // Colors for charts
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Prepare data for completion rate pie chart
    const completionData = [
        { name: 'Abgeschlossen', value: overview.completedSessions, color: '#10b981' },
        { name: 'Übersprungen', value: overview.skippedSessions, color: '#f59e0b' },
        { name: 'Nicht abgeschlossen', value: overview.totalSessions - overview.completedSessions - overview.skippedSessions, color: '#ef4444' }
    ];

    // Prepare role completion data
    const roleData = byRole.map((role, index) => ({
        ...role,
        color: COLORS[index % COLORS.length]
    }));

    const formatTime = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
        return `${Math.round(seconds / 3600)}h`;
    };

    const getTimeframeLabel = (tf) => {
        switch (tf) {
            case '7d': return 'Letzte 7 Tage';
            case '30d': return 'Letzte 30 Tage';
            case '90d': return 'Letzte 90 Tage';
            case 'all': return 'Alle Zeit';
            default: return 'Letzte 30 Tage';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with filters */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Onboarding Analytics
                </h2>
                <div className="flex items-center space-x-3">
                    <FaFilter className="text-gray-500" />
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="7d">Letzte 7 Tage</option>
                        <option value="30d">Letzte 30 Tage</option>
                        <option value="90d">Letzte 90 Tage</option>
                        <option value="all">Alle Zeit</option>
                    </select>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaUsers className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Gesamt Sessions
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {overview.totalSessions}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaCheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Abschlussrate
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {overview.completionRate.toFixed(1)}%
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaClock className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Ø Abschlusszeit
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {formatTime(overview.avgCompletionTime)}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaStar className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Ø Bewertung
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {feedback.avgRating ? feedback.avgRating.toFixed(1) : 'N/A'}
                                        {feedback.totalFeedback > 0 && (
                                            <span className="text-sm text-gray-500 ml-1">
                                                ({feedback.totalFeedback})
                                            </span>
                                        )}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Completion Rate Pie Chart */}
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Abschlussstatus
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={completionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {completionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Role Performance */}
                {roleData.length > 0 && (
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Performance nach Rolle
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={roleData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="role" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value, name) => [
                                            name === 'rate' ? `${value.toFixed(1)}%` : value,
                                            name === 'rate' ? 'Abschlussrate' : name === 'total' ? 'Gesamt' : 'Abgeschlossen'
                                        ]}
                                    />
                                    <Bar dataKey="rate" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}
            </div>

            {/* Step Analytics */}
            {stepAnalytics.length > 0 && (
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Schritt-Analyse
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Schritt
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aufrufe
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Übersprungen
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ø Zeit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stepAnalytics.map((step, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {step.stepTitle}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {step.totalViews}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {step.skipped} ({step.skipRate.toFixed(1)}%)
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatTime(step.avgTimeSpent)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            )}

            {/* Recent Sessions */}
            {recentSessions.length > 0 && (
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Aktuelle Sessions
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Benutzer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Typ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dauer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Datum
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentSessions.map((session, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {session.userId?.fullName || 'Unbekannt'}
                                                {session.userRole && (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        ({session.userRole})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {session.onboardingType === 'wizard' ? 'Wizard' : 'Tour'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    session.status === 'completed' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : session.status === 'skipped'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {session.status === 'completed' ? 'Abgeschlossen' : 
                                                     session.status === 'skipped' ? 'Übersprungen' : 'Unvollständig'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatTime(session.timeSpent || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(session.createdAt).toLocaleDateString('de-DE')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            )}

            {/* User Type Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Haupt-Benutzer (Trainer)
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Gesamt:</span>
                                <span className="font-medium">{byUserType.main.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Abgeschlossen:</span>
                                <span className="font-medium">{byUserType.main.completed}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Rate:</span>
                                <span className="font-medium">{byUserType.main.rate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Eingeladene Benutzer
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Gesamt:</span>
                                <span className="font-medium">{byUserType.invited.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Abgeschlossen:</span>
                                <span className="font-medium">{byUserType.invited.completed}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Rate:</span>
                                <span className="font-medium">{byUserType.invited.rate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default OnboardingAnalytics;
