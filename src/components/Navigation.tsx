import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications } from '../utils/data';
import { Bell, Film, House, LogOut, MessageCircle, Plus, Search, Sparkles, Tv, User } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  mobile?: boolean;
}

const Navigation = ({ mobile = false }: NavigationProps) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    if (!currentUser) return;
    
    // Get unread notifications count
    const notifications = getNotifications(currentUser.id);
    const unreadCount = notifications.filter(notif => !notif.read).length;
    setNotificationCount(unreadCount);
    
    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      const notifications = getNotifications(currentUser.id);
      const unreadCount = notifications.filter(notif => !notif.read).length;
      setNotificationCount(unreadCount);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentUser]);
  
  if (!currentUser) return null;
  
  const navItems = [
    { path: '/home', icon: <House size={24} />, label: 'House' },
    { path: '/explore', icon: <Search size={24} />, label: 'Explore' },
    { path: '/create', icon: <Plus size={24} />, label: 'Post' },
    { path: '/chat', icon: <MessageCircle size={24} />, label: 'Chat' },
    { path: '/notifications', icon: <Bell size={24} />, label: 'Notifications', count: notificationCount },
    { path: '/reels', icon: <Film size={24} />, label: 'Reels' },
    { path: '/live', icon: <Tv size={24} />, label: 'Live' },
    { path: '/creator', icon: <Sparkles size={24} />, label: 'Creator Studio' },
    { path: `/profile/${currentUser.username}`, icon: <User size={24} />, label: 'Profile' },
  ];
  
  // For mobile, we'll show fewer items
  const mobileNavItems = mobile 
    ? navItems.slice(0, 5)
    : navItems;
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { scale: 1.05 }
  };
  
  if (mobile) {
    return (
      <div className="flex justify-around items-center py-2 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg glass">
        {mobileNavItems.map((item, index) => (
          <Link 
            key={item.path}
            to={item.path}
            className="relative flex flex-col items-center p-1"
          >
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              variants={itemVariants}
              transition={{ delay: index * 0.05 }}
              className={`flex flex-col items-center ${
                location.pathname === item.path 
                  ? 'text-purple-600' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
              
              {item.count > 0 && (
                <span className="notification-badge">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="mb-10 flex items-center justify-between">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold rainbow-text"
        >
          Unmute
        </motion.h1>
        <ThemeSelector />
      </div>
      <nav className="space-y-1">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={item.path}
              className={`flex items-center px-4 py-3 text-lg rounded-full relative ${
                location.pathname === item.path 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-md' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 transition-transform'
              }`}
            >
              <span className="mr-4">{item.icon}</span>
              {item.label}
              
              {item.count > 0 && (
                <span className="notification-badge ml-2">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              )}
            </Link>
          </motion.div>
        ))}
        <motion.button 
          onClick={logout}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: navItems.length * 0.05 }}
          className="flex items-center px-4 py-3 text-lg rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 w-full hover:scale-105 transition-transform"
        >
          <span className="mr-4"><LogOut size={24} /></span>
          Logout
        </motion.button>
      </nav>
    </div>
  );
};

export default Navigation;
