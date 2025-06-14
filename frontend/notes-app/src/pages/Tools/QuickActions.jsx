import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { HiLightningBolt, HiPlusCircle, HiRefresh, HiDocumentDuplicate, HiStar } from 'react-icons/hi';

const QuickActions = () => {
  const [recentActions, setRecentActions] = useState([
    { id: 1, name: 'Create Training Plan', icon: <HiPlusCircle className="text-green-500" />, date: '2 hours ago' },
    { id: 2, name: 'Update Player Statistics', icon: <HiRefresh className="text-blue-500" />, date: '1 day ago' },
    { id: 3, name: 'Duplicate Tactic Board', icon: <HiDocumentDuplicate className="text-purple-500" />, date: '3 days ago' },
  ]);

  const quickActions = [
    { 
      id: 1, 
      title: 'Create New Note', 
      description: 'Quickly add a new note to your collection', 
      icon: <HiPlusCircle className="h-6 w-6 text-green-500" />,
      route: '/notes?action=new',
      color: 'from-green-400 to-green-600'
    },
    { 
      id: 2, 
      title: 'Add Player', 
      description: 'Add a new player to your team roster', 
      icon: <HiPlusCircle className="h-6 w-6 text-blue-500" />,
      route: '/players?action=new',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      id: 3, 
      title: 'Create Exercise', 
      description: 'Add a new exercise to your training program', 
      icon: <HiPlusCircle className="h-6 w-6 text-yellow-500" />,
      route: '/exercises?action=new',
      color: 'from-yellow-400 to-yellow-600'
    },
    { 
      id: 4, 
      title: 'Schedule Training', 
      description: 'Schedule a new training session', 
      icon: <HiPlusCircle className="h-6 w-6 text-purple-500" />,
      route: '/team/schedule?action=new',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      id: 5, 
      title: 'Export Data', 
      description: 'Export your data for backup or analysis', 
      icon: <HiDocumentDuplicate className="h-6 w-6 text-indigo-500" />,
      route: '/data/export',
      color: 'from-indigo-400 to-indigo-600'
    },
    { 
      id: 6, 
      title: 'Favorites', 
      description: 'Quick access to your favorite items', 
      icon: <HiStar className="h-6 w-6 text-amber-500" />,
      route: '/favorites',
      color: 'from-amber-400 to-amber-600'
    },
  ];

  const handleActionClick = (route) => {
    window.location.href = route;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quick Actions</h1>
            <p className="text-gray-600 mt-1">Access frequently used functions and recent actions</p>
          </div>
          <div className="flex items-center bg-blue-600 text-white p-2 rounded-md">
            <HiLightningBolt className="mr-2 h-5 w-5" />
            <span className="font-medium">Actions Center</span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {quickActions.map((action) => (
            <div 
              key={action.id}
              onClick={() => handleActionClick(action.route)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
            >
              <div className={`h-2 bg-gradient-to-r ${action.color}`}></div>
              <div className="p-5">
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    {action.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{action.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Actions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Actions</h2>
            <div className="divide-y divide-gray-200">
              {recentActions.map((action) => (
                <div key={action.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-lg p-2 mr-4">
                      {action.icon}
                    </div>
                    <div>
                      <p className="font-medium">{action.name}</p>
                      <p className="text-gray-500 text-sm">{action.date}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Repeat
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customization Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
          <HiLightningBolt className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <p className="text-blue-800 font-medium">Customize Your Quick Actions</p>
            <p className="text-blue-600 text-sm mt-1">
              You can customize which actions appear here by visiting your profile settings.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuickActions;
