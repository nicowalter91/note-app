import React, { useState, useEffect } from 'react';
import { 
  HiHome, 
  HiDocumentText, 
  HiOutlineClipboard, 
  HiUsers, 
  HiCalendar, 
  HiChartBar, 
  HiAcademicCap, 
  HiViewBoards, 
  HiVideoCamera, 
  HiUser, 
  HiCog, 
  HiQuestionMarkCircle,
  HiDownload,
  HiUpload,
  HiChevronDown,
  HiChevronUp,
  HiOutlineLogout,
  HiOutlineMoon,
  HiOutlineSun,
  HiTranslate,
  HiInformationCircle,
  HiGlobe,
  HiBell,
  HiChatAlt2,
  HiExclamation,  HiMail,
  HiAnnotation,
  HiArrowCircleDown,
  HiUserGroup,
  HiArrowCircleUp,
  HiLightningBolt,
  HiClipboardCheck,
  HiArrowLeft
} from 'react-icons/hi';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout, userInfo, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();  
  const location = useLocation();

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    
    // Split the name by spaces and get first letters
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      // If only one name, return first letter
      return name.charAt(0).toUpperCase();
    } else {
      // Return first letter of first and last name
      return (nameParts[0].charAt(0) + nameParts[nameParts.length-1].charAt(0)).toUpperCase();
    }
  };

  // State for expanded submenus
  const [expandedMenus, setExpandedMenus] = useState(() => {
    const savedExpandedMenus = localStorage.getItem('expandedMenus');
    return savedExpandedMenus ? JSON.parse(savedExpandedMenus) : {};
  });
  
  // Mobile sidebar state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Animation state for menu items
  const [animateItems, setAnimateItems] = useState(false);
  
  // Save expanded menus state
  useEffect(() => {
    localStorage.setItem('expandedMenus', JSON.stringify(expandedMenus));
  }, [expandedMenus]);
  // Identify currently open submenu based on URL when navigating
  useEffect(() => {
    const path = location.pathname;
    
    // Automatically expand relevant submenus based on current path
    let newExpandedMenus = {...expandedMenus};
    
    if (path.includes('/team/') || path.includes('/players')) {
      newExpandedMenus.team = true;
    }
    
    if (path.includes('/settings/') || path.includes('/data/')) {
      newExpandedMenus.settings = true;
    }
    
    if (path.includes('/help') || path.includes('/legal') || 
        path.includes('/privacy') || path.includes('/terms') || 
        path.includes('/feedback') || path.includes('/support')) {
      newExpandedMenus.help = true;
    }
    
    setExpandedMenus(newExpandedMenus);
    
    // Start animation for menu items
    setAnimateItems(true);
    const timeout = setTimeout(() => setAnimateItems(false), 500);
    
    // Close mobile sidebar on navigation
    setIsMobileOpen(false);
    
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Logout function
  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      localStorage.clear();
      navigate("/login");
    }
  };

  // Toggle for submenus
  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]    }));
  };

  // Function to check if the current path corresponds to the active page
  const isActive = (path) => {
    // Handle exact matches
    if (location.pathname === `/${path.toLowerCase()}`) {
      return true;
    }
    
    // Handle parent paths
    if (path && location.pathname.startsWith(`/${path.toLowerCase()}/`)) {
      return true;
    }
    
    // Handle special cases
    if (path === 'players' && location.pathname.includes('/players')) {
      return true;
    }
    
    return false;
  };
  // NavItem component with submenu support
  const NavItem = ({ icon, label, onClick, path, submenu, badge, isNew }) => {
    const routePath = path || label.toLowerCase();
    const active = isActive(routePath);
    const hasSubmenu = submenu && submenu.length > 0;
    const isExpanded = expandedMenus[routePath.toLowerCase()];
    
    return (
      <div className="mb-1 relative">
        <a
          href={hasSubmenu || routePath === 'logout' ? '#' : `/${routePath}`}
          onClick={(e) => {
            e.preventDefault();
            if (hasSubmenu) {
              toggleSubmenu(routePath.toLowerCase());
            } else if (routePath === 'logout') {
              handleLogout();
            } else if (onClick) {
              onClick();
            } else {
              navigate(`/${routePath}`);
            }
          }}
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group
            ${active 
              ? 'bg-blue-600 text-white font-medium shadow-md' 
              : 'text-gray-300 hover:bg-blue-700/20 hover:text-white'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className={`text-lg ${active ? 'text-white' : 'text-blue-400 group-hover:text-white'}`}>{icon}</span>
            <span className="text-sm font-medium">{label}</span>
            
            {/* Badge for notifications or new items */}
            {badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            
            {/* "New" indicator */}
            {isNew && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                NEW
              </span>
            )}
          </div>
          
          {hasSubmenu && (
            <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
              <HiChevronDown />
            </span>
          )}
        </a>
        
        {/* Submenu with smooth animation */}
        {hasSubmenu && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out
              ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="ml-4 mt-1 pl-2 border-l border-blue-400/30">
              {submenu.map((item, index) => (
                <a
                  key={index}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 mt-0.5 group
                    ${location.pathname === item.path 
                      ? 'bg-blue-600/60 text-white font-medium' 
                      : 'text-gray-300 hover:bg-blue-700/20 hover:text-white'}
                  `}
                >
                  <span className={`text-md ${location.pathname === item.path ? 'text-white' : 'text-blue-400 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="text-xs">{item.label}</span>
                  
                  {/* Badge for submenu items */}
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  
                  {/* "New" indicator for submenu items */}
                  {item.isNew && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                      NEW
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  // Team submenu
  const teamSubmenu = [
    { 
      icon: <HiUsers />, 
      label: 'Players', 
      path: '/players', 
      onClick: () => navigate('/players') 
    },
    { 
      icon: <HiCalendar />, 
      label: 'Schedule', 
      path: '/team/schedule', 
      onClick: () => navigate('/team/schedule') 
    },
    { 
      icon: <HiChartBar />, 
      label: 'Statistics', 
      path: '/team/statistics', 
      onClick: () => navigate('/team/statistics') 
    },
    { 
      icon: <HiAcademicCap />, 
      label: 'Training', 
      path: '/team/training', 
      onClick: () => navigate('/team/training') 
    },    { 
      icon: <HiViewBoards />, 
      label: 'Tactics', 
      path: '/team/tactics', 
      onClick: () => navigate('/team/tactics') 
    },
    { 
      icon: <HiUsers />, 
      label: 'Formation', 
      path: '/team/formation', 
      onClick: () => navigate('/team/formation') 
    },
    { 
      icon: <HiVideoCamera />, 
      label: 'Video Analysis', 
      path: '/video', 
      onClick: () => navigate('/video'),
      isNew: true
    }
  ];
  
  // Settings submenu
  const settingsSubmenu = [
    { 
      icon: <HiUser />, 
      label: 'Profile', 
      path: '/profil', 
      onClick: () => navigate('/profil') 
    },
    { 
      icon: <HiBell />, 
      label: 'Notifications', 
      path: '/settings/notifications', 
      onClick: () => navigate('/settings/notifications') 
    },
    { 
      icon: <HiTranslate />, 
      label: 'Language', 
      path: '/settings/language', 
      onClick: () => navigate('/settings/language') 
    },
    { 
      icon: <HiDownload />, 
      label: 'Export Data', 
      path: '/data/export', 
      onClick: () => navigate('/data/export') 
    },
    { 
      icon: <HiUpload />, 
      label: 'Import Data', 
      path: '/data/import', 
      onClick: () => navigate('/data/import'),
      isNew: true
    },
  ];

  // Support submenu
  const supportSubmenu = [
    { 
      icon: <HiQuestionMarkCircle />, 
      label: 'Help Center', 
      path: '/help', 
      onClick: () => navigate('/help') 
    },
    { 
      icon: <HiAnnotation />, 
      label: 'Feedback', 
      path: '/feedback', 
      onClick: () => navigate('/feedback') 
    },
    { 
      icon: <HiMail />, 
      label: 'Contact Support', 
      path: '/support', 
      onClick: () => navigate('/support') 
    },
  ];
  
  // Legal submenu
  const legalSubmenu = [
    { 
      icon: <HiInformationCircle />, 
      label: 'Legal Notice', 
      path: '/legal', 
      onClick: () => navigate('/legal') 
    },
    { 
      icon: <HiGlobe />, 
      label: 'Privacy Policy', 
      path: '/privacy', 
      onClick: () => navigate('/privacy') 
    },
    { 
      icon: <HiClipboardCheck />, 
      label: 'Terms of Service', 
      path: '/terms', 
      onClick: () => navigate('/terms') 
    },
  ];
  
  // Tools submenu
  const toolsSubmenu = [
    { 
      icon: <HiLightningBolt />, 
      label: 'Quick Actions', 
      path: '/tools/quick-actions', 
      onClick: () => navigate('/tools/quick-actions'),
      isNew: true
    },
    { 
      icon: <HiArrowCircleDown />, 
      label: 'Import Templates', 
      path: '/tools/templates/import', 
      onClick: () => navigate('/tools/templates/import') 
    },
    { 
      icon: <HiArrowCircleUp />, 
      label: 'Export Templates', 
      path: '/tools/templates/export', 
      onClick: () => navigate('/tools/templates/export') 
    },
  ];
  return (
    <div className="h-full bg-[#1e293b] text-white flex flex-col shadow-lg overflow-y-auto">
      {/* User Profile Section */}      <div className="p-4 mb-4">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/70 hover:bg-gray-700/80 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-200 font-medium">
            {getUserInitials(userInfo?.name)}
          </div>          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate text-gray-200">{userInfo?.name || 'Nicht angemeldet'}</p>
            <p className="text-xs truncate text-gray-400">{userInfo?.email || 'Keine E-Mail'}</p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-3 py-2 space-y-6 custom-scrollbar">
        {/* Main Navigation */}
        <div>
          <div className="mb-2 px-3">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Main</p>
          </div>
          <nav className="space-y-1">            <NavItem icon={<HiHome />} label="Dashboard" onClick={() => navigate('/dashboard')} />
            <NavItem icon={<HiClipboardCheck />} label="Tasks" onClick={() => navigate('/tasks')} />
            <NavItem icon={<HiOutlineClipboard />} label="Exercises" onClick={() => navigate('/exercises')} />
          </nav>
        </div>

        {/* Team Section */}
        <div>
          <div className="mb-2 px-3">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Team</p>
          </div>
          <nav className="space-y-1">
            <NavItem 
              icon={<HiUsers />} 
              label="Team Management" 
              path="team" 
              submenu={teamSubmenu}
            />
          </nav>
        </div>

        {/* Tools Section */}
        <div>
          <div className="mb-2 px-3">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Tools</p>
          </div>
          <nav className="space-y-1">
            <NavItem 
              icon={<HiLightningBolt />} 
              label="Tools" 
              path="tools" 
              submenu={toolsSubmenu}
              isNew={true}
            />
          </nav>
        </div>

        {/* Settings Section */}
        <div>
          <div className="mb-2 px-3">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Settings</p>
          </div>
          <nav className="space-y-1">
            <NavItem 
              icon={<HiCog />} 
              label="Settings" 
              path="settings" 
              submenu={settingsSubmenu}
            />
            <NavItem 
              icon={isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />} 
              label={isDarkMode ? "Light Mode" : "Dark Mode"} 
              onClick={toggleTheme}
            />
          </nav>
        </div>
        
        {/* Support Section */}
        <div>
          <div className="mb-2 px-3">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Support</p>
          </div>
          <nav className="space-y-1">
            <NavItem 
              icon={<HiQuestionMarkCircle />} 
              label="Help & Support" 
              path="help" 
              submenu={supportSubmenu}
            />
            <NavItem 
              icon={<HiInformationCircle />} 
              label="Legal" 
              path="legal" 
              submenu={legalSubmenu}
            />
          </nav>
        </div>
      </div>
      
      {/* Back to Dashboard - Mobile only */}
      <div className="px-4 py-2 md:hidden">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-blue-700/20 hover:text-white transition-all duration-200"
        >
          <HiArrowLeft className="text-lg" />
          <span>Back to Dashboard</span>
        </button>
      </div>
      
      {/* Logout Button */}
      <div className="p-4 mt-auto border-t border-blue-700/30">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
        >
          <HiOutlineLogout className="text-lg" />
          <span>Logout</span>
        </button>
      </div>

      {/* App Version */}
      <div className="px-4 py-2 text-[10px] text-gray-500 text-center">
        <p>mytacticlab v1.3.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
