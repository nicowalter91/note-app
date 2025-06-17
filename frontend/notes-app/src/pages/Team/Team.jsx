import React from 'react';
import Layout from '../../components/Layout/Layout';
import { PageHeader, Card, Button, StatsGrid, QuickActionsGrid } from '../../components/UI/DesignSystem';
import { 
  FaUsers, 
  FaUserPlus, 
  FaCalendarAlt, 
  FaChartBar, 
  FaTrophy, 
  FaFutbol,
  FaBolt,
  FaClipboardList,
  FaDrawPolygon,
  FaEuroSign
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Team = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Aktive Spieler',
      value: '24',
      trend: '+2',
      icon: FaUsers,
      color: 'blue'
    },
    {
      label: 'Nächstes Spiel',
      value: 'in 3 Tagen',
      trend: 'vs. FC Rivalen',
      icon: FaFutbol,
      color: 'green'
    },
    {
      label: 'Training diese Woche',
      value: '3',
      trend: 'geplant',
      icon: FaBolt,
      color: 'yellow'
    },
    {
      label: 'Saisonspiele',
      value: '12/20',
      trend: '8 gewonnen',
      icon: FaTrophy,
      color: 'purple'
    }
  ];

  const quickActions = [
    {
      title: 'Spieler verwalten',
      description: 'Spieler hinzufügen, bearbeiten und verwalten',
      icon: FaUsers,
      color: 'blue',
      action: () => navigate('/team/players')
    },
    {
      title: 'Training planen',
      description: 'Trainingseinheiten erstellen und organisieren',
      icon: FaBolt,
      color: 'green',
      action: () => navigate('/team/training')
    },
    {
      title: 'Spieltag',
      description: 'Spieltag-Management und Aufstellungen',
      icon: FaFutbol,
      color: 'orange',
      action: () => navigate('/team/matchday')
    },
    {
      title: 'Termine',
      description: 'Spielplan und Termine verwalten',
      icon: FaCalendarAlt,
      color: 'purple',
      action: () => navigate('/team/schedule')
    },
    {
      title: 'Statistiken',
      description: 'Team- und Spielerstatistiken analysieren',
      icon: FaChartBar,
      color: 'indigo',
      action: () => navigate('/team/statistics')
    },
    {
      title: 'Formation',
      description: 'Aufstellungen und Taktiken planen',
      icon: FaDrawPolygon,
      color: 'red',
      action: () => navigate('/team/formation')
    },
    {
      title: 'Taktiken',
      description: 'Spieltaktiken entwickeln und analysieren',
      icon: FaClipboardList,
      color: 'pink',
      action: () => navigate('/team/tactics')
    },
    {
      title: 'Finanzen',
      description: 'Team-Budget und Ausgaben verwalten',
      icon: FaEuroSign,
      color: 'emerald',
      action: () => navigate('/team/finance')
    }
  ];

  const recentActivities = [
    {
      type: 'Spieler hinzugefügt',
      message: 'Max Müller wurde dem Team hinzugefügt',
      time: 'vor 2 Stunden',
      icon: FaUserPlus,
      color: 'blue'
    },
    {
      type: 'Training geplant',
      message: 'Trainingseinheit für Montag erstellt',
      time: 'vor 5 Stunden',
      color: 'green'
    },
    {
      type: 'Spiel gewonnen',
      message: 'Sieg gegen FC Rivalen (3:1)',
      time: 'vor 2 Tagen',
      icon: FaTrophy,
      color: 'yellow'
    },
    {
      type: 'Formation aktualisiert',
      message: 'Neue 4-3-3 Formation gespeichert',
      time: 'vor 3 Tagen',
      icon: FaDrawPolygon,
      color: 'purple'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <PageHeader
          title="Team-Management"
          subtitle="Verwalte alle Aspekte deines Teams - von Spielern bis zu Taktiken"
          icon={FaUsers}
          actions={
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                icon={FaChartBar}
                onClick={() => navigate('/team/statistics')}
              >
                Statistiken
              </Button>
              <Button 
                variant="primary" 
                icon={FaUserPlus}
                onClick={() => navigate('/team/players?action=add')}
              >
                Spieler hinzufügen
              </Button>
            </div>
          }
        />

        {/* Team-Statistiken */}
        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          {/* Schnellzugriffe */}
          <div className="xl:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaBolt className="text-blue-500" />
                Schnellzugriffe
              </h3>
              <QuickActionsGrid actions={quickActions} />
            </Card>
          </div>

          {/* Aktuelle Aktivitäten */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Letzte Aktivitäten
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`
                      p-2 rounded-lg text-white text-sm
                      ${activity.color === 'blue' ? 'bg-blue-500' : ''}
                      ${activity.color === 'green' ? 'bg-green-500' : ''}
                      ${activity.color === 'yellow' ? 'bg-yellow-500' : ''}
                      ${activity.color === 'purple' ? 'bg-purple-500' : ''}
                    `}>
                      {activity.icon && <activity.icon />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  Alle Aktivitäten anzeigen
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Team-Übersicht */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaFutbol className="text-green-500" />
              Nächste Spiele
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">vs. FC Rivalen</p>
                  <p className="text-sm text-gray-600">Auswärtsspiel</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Samstag, 15:00</p>
                  <p className="text-xs text-gray-500">in 3 Tagen</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">vs. SV Heimat</p>
                  <p className="text-sm text-gray-600">Heimspiel</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Sonntag, 14:00</p>
                  <p className="text-xs text-gray-500">in 10 Tagen</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/team/schedule')}
              >
                Vollständigen Spielplan anzeigen
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaBolt className="text-orange-500" />
              Nächste Trainings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Konditionstraining</p>
                  <p className="text-sm text-gray-600">Sportplatz A</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Heute, 18:00</p>
                  <p className="text-xs text-gray-500">in 2 Stunden</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Taktiktraining</p>
                  <p className="text-sm text-gray-600">Halle 1</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Mittwoch, 19:00</p>
                  <p className="text-xs text-gray-500">in 2 Tagen</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/team/training')}
              >
                Alle Trainings anzeigen
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Team;
