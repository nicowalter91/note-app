import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileInfo from '../Cards/ProfileInfo';
import Logo from '../../assets/img/Logo.png';
import { 
  HiBell, 
  HiMenuAlt2, 
  HiX, 
  HiSearch, 
  HiGlobe, 
  HiUserCircle, 
  HiOutlineLogout, 
  HiCog,
  HiPlus,
  HiLightningBolt,
  HiQuestionMarkCircle,
  HiDocumentText,
  HiOutlineClipboard,
  HiUsers,
  HiChevronDown,
  HiMoon,
  HiSun,
  HiHome,
  HiArrowSmRight,
  HiCalendar,
  HiVideoCamera,
  HiChatAlt2,
  HiInboxIn,
  HiSparkles,
  HiColorSwatch
} from 'react-icons/hi';

const Navbar = ({ 
  userInfo, 
  onLogout, 
  notifications = [], 
  toggleSidebar, 
  sidebarOpen,
  onSearchNote,
  handleClearSearch,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  toggleTheme
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const quickActionsRef = useRef(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationDropdownOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setIsQuickActionsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get current page title
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/notes')) return 'Notes';
    if (path.includes('/exercises')) return 'Exercises';
    if (path.includes('/team') || path.includes('/players')) return 'Team';
    if (path.includes('/profil')) return 'Profile';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/tools')) return 'Tools';
    if (path.includes('/help') || path.includes('/support')) return 'Help & Support';
    if (path.includes('/legal')) return 'Legal';
    if (path.includes('/data')) return 'Data Management';
    return '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close other menus when opening this one
    setIsProfileDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
    setIsQuickActionsOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    // Close other menus when opening this one
    setIsMenuOpen(false);
    setIsNotificationDropdownOpen(false);
    setIsQuickActionsOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    // Close other menus when opening this one
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsQuickActionsOpen(false);
  };
  
  const toggleQuickActions = () => {
    setIsQuickActionsOpen(!isQuickActionsOpen);
    // Close other menus when opening this one
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchVisible(!isMobileSearchVisible);
  };

  const getUserInitials = (fullName = '') => {
    const names = fullName.split(' ');
    const initials = names.map(name => name.charAt(0)).join('').toUpperCase();
    return initials || '?';
  };

  const displayName = userInfo?.fullName || userInfo?.name || 'User';
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchNote(value);
    
    // Mock search results (in a real app, this would come from an API or local data)
    if (value.trim().length > 0) {
      setSearchResults([
        { id: 1, type: 'note', title: 'Training Plan', match: `Match: ${value}` },
        { id: 2, type: 'exercise', title: 'Passing Drill', match: `Match: ${value}` },
        { id: 3, type: 'player', title: 'John Smith', match: `Match: ${value}` },
      ]);
    } else {
      setSearchResults([]);
    }
  };
  
  // Recent activity for quick access (mock data)
  const recentActivity = [
    { id: 1, title: 'Weekly Training Plan', type: 'note', path: '/notes/123' },
    { id: 2, title: 'Team Meeting Notes', type: 'note', path: '/notes/456' },
    { id: 3, title: 'Passing Exercise', type: 'exercise', path: '/exercises/789' },
  ];
  
  // Quick action items
  const quickActions = [
    { id: 1, title: 'New Note', icon: <HiDocumentText />, path: '/notes?action=new' },
    { id: 2, title: 'New Exercise', icon: <HiOutlineClipboard />, path: '/exercises?action=new' },
    { id: 3, title: 'Add Player', icon: <HiUsers />, path: '/players?action=new' },
    { id: 4, title: 'Quick Actions', icon: <HiLightningBolt />, path: '/tools/quick-actions' },
    { id: 5, title: 'Schedule Event', icon: <HiCalendar />, path: '/team/schedule?action=new' },
    { id: 6, title: 'Record Video', icon: <HiVideoCamera />, path: '/video?action=record' },
  ];

  return (
    <div className="relative z-50">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0">
        {/* Left Section: Logo, Sidebar Toggle, and Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          <button 
            className="text-xl text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors" 
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {sidebarOpen ? <HiX /> : <HiMenuAlt2 />}
          </button>
          
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8 md:h-9" />
            <h2 className="text-lg font-medium hidden sm:block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              mytacticlab
            </h2>
          </Link>
          
          {/* Breadcrumbs for current location */}
          <div className="hidden md:flex items-center text-sm ml-3">
            {getCurrentPageTitle() && (
              <>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-600 dark:text-gray-300 font-medium">{getCurrentPageTitle()}</span>
              </>
            )}
          </div>
        </div>

        {/* Center Section: Navigation Tabs - Desktop Only */}
        <div className="hidden lg:flex items-center gap-1">
          <Link 
            to="/dashboard" 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/dashboard' 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <HiHome className="inline mr-1.5" />
            Dashboard
          </Link>
          
          <Link 
            to="/notes" 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/notes') 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <HiDocumentText className="inline mr-1.5" />
            Notes
          </Link>
          
          <Link 
            to="/exercises" 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/exercises') 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <HiOutlineClipboard className="inline mr-1.5" />
            Exercises
          </Link>
          
          <Link 
            to="/players" 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/players') || location.pathname.includes('/team')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <HiUsers className="inline mr-1.5" />
            Team
          </Link>
        </div>

        {/* Right Section: Search, Actions, Notifications and Profile */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Search Component */}
          <div className="relative hidden md:block">
            <div className={`bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md px-3 py-1.5 flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
              isSearchFocused ? 'ring-2 ring-blue-300 dark:ring-blue-700' : ''
            }`}>
              <HiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-52 lg:w-64 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              {searchQuery && (
                <button 
                  onClick={handleClearSearch}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <HiX />
                </button>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
                <div className="p-2">
                  {searchResults.map(result => (
                    <Link 
                      key={result.id} 
                      to="#" 
                      className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">
                          {result.type === 'note' && <HiDocumentText className="text-blue-500" />}
                          {result.type === 'exercise' && <HiOutlineClipboard className="text-green-500" />}
                          {result.type === 'player' && <HiUsers className="text-purple-500" />}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{result.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{result.match}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-2 text-center">
                  <Link to={`/search?q=${searchQuery}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View all results
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Search Button */}
          <button 
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 md:hidden transition-colors"
            onClick={toggleMobileSearch}
            aria-label="Search"
          >
            <HiSearch />
          </button>

          {/* Quick Actions Button */}
          <div className="relative" ref={quickActionsRef}>
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
              onClick={toggleQuickActions}
              aria-label="Quick Actions"
            >
              <HiPlus className="text-xl" />
              <HiChevronDown className={`ml-0.5 text-sm transition-transform duration-200 ${isQuickActionsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isQuickActionsOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-20 w-56 border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Quick Actions</h3>
                </div>
                <div className="p-2">
                  {quickActions.map(action => (
                    <Link 
                      key={action.id} 
                      to={action.path} 
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-blue-600 dark:text-blue-400">{action.icon}</span>
                      <span className="text-sm">{action.title}</span>
                    </Link>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">Recent Activity</h4>
                  {recentActivity.map(item => (
                    <Link 
                      key={item.id} 
                      to={item.path} 
                      className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.title}</span>
                      <HiArrowSmRight className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={toggleNotificationDropdown}
              aria-label="Notifications"
            >
              <HiBell className="text-xl" />
              {notifications.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {isNotificationDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-20 w-64 sm:w-80 border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Notifications</h3>
                  {notifications.length > 0 && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                      {notifications.length} new
                    </span>
                  )}
                </div>
                
                <div className="max-h-72 overflow-y-auto">
                  {notifications && notifications.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification, index) => (
                        <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex">
                            <div className="flex-shrink-0 mr-3">
                              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300">
                                <HiBell className="h-4 w-4" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-800 dark:text-gray-200">{notification}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                2 minutes ago
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                  <Link to="/settings/notifications" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Manage notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden md:block"
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <HiSun className="text-xl" /> : <HiMoon className="text-xl" />}
          </button>

          {/* Language Switcher */}
          <Link 
            to="/settings/language" 
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden md:block"
            aria-label="Change Language"
          >
            <HiGlobe className="text-xl" />
          </Link>

          {/* User Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 py-1 px-1 md:px-2 rounded-full transition-colors ml-1"
              aria-label="User Profile"
            >
              {userInfo?.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div
                  className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold"
                >
                  {getUserInitials(displayName)}
                </div>
              )}
              <span className="hidden md:block text-sm font-medium max-w-[100px] truncate text-gray-700 dark:text-gray-300">
                {displayName}
              </span>
              <HiChevronDown className={`hidden md:block text-gray-400 dark:text-gray-500 text-sm transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-20 w-56 border border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{userInfo?.email}</p>
                </div>
                <div className="py-1">
                  <Link to="/profil" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <HiUserCircle className="text-blue-600 dark:text-blue-400" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <HiCog className="text-blue-600 dark:text-blue-400" />
                    <span>Settings</span>
                  </Link>
                  <Link to="/tools/quick-actions" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <HiLightningBolt className="text-blue-600 dark:text-blue-400" />
                    <span>Quick Actions</span>
                  </Link>
                  <Link to="/support/help-center" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <HiQuestionMarkCircle className="text-blue-600 dark:text-blue-400" />
                    <span>Help Center</span>
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <HiOutlineLogout />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Conditional Render */}
      {isMobileSearchVisible && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 p-3 shadow-md border-t border-gray-200 dark:border-gray-700 z-10">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md px-3 py-2">
            <HiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
            {searchQuery ? (
              <button 
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <HiX />
              </button>
            ) : (
              <button 
                onClick={toggleMobileSearch}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <HiX />
              </button>
            )}
          </div>
          
          {/* Mobile Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="mt-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              {searchResults.map(result => (
                <Link 
                  key={result.id} 
                  to="#" 
                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <span className="mr-2">
                    {result.type === 'note' && <HiDocumentText className="text-blue-500" />}
                    {result.type === 'exercise' && <HiOutlineClipboard className="text-green-500" />}
                    {result.type === 'player' && <HiUsers className="text-purple-500" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{result.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{result.match}</p>
                  </div>
                </Link>
              ))}
              <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                <Link to={`/search?q=${searchQuery}`} className="text-xs text-blue-600 dark:text-blue-400">
                  View all results
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
