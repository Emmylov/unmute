import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Heart, MessageCircle, User, Video, X } from 'lucide-react';
import { getNotifications, Notification, markAsRead } from '../utils/data';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchNotifications = () => {
      setIsLoading(true);
      try {
        const userNotifications = getNotifications(currentUser.id);
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchNotifications();
    }
    
    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currentUser, isOpen, onClose]);
  
  const handleMarkAsRead = (id: string) => {
    if (!currentUser) return;
    
    markAsRead(currentUser.id, id);
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={18} className="text-red-500" />;
      case 'comment':
        return <MessageCircle size={18} className="text-blue-500" />;
      case 'follow':
        return <User size={18} className="text-purple-500" />;
      case 'mention':
        return <Bell size={18} className="text-yellow-500" />;
      case 'reel':
        return <Video size={18} className="text-green-500" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  if (!currentUser) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            ref={notificationRef}
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 30 }}
            className="relative w-full max-w-sm bg-white shadow-xl h-full"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Notifications</h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 flex items-start hover:bg-gray-50 transition cursor-pointer ${
                        !notification.read ? 'bg-purple-50' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="mr-3 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <Link to={`/profile/${notification.fromUsername}`} className="font-medium hover:underline">
                              {notification.fromName}
                            </Link>
                            <span className="text-gray-700"> {notification.content}</span>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {notification.timeAgo}
                          </span>
                        </div>
                        {notification.postImage && (
                          <Link to={`/post/${notification.postId}`}>
                            <img 
                              src={notification.postImage} 
                              alt="Post" 
                              className="h-10 w-10 object-cover rounded mt-2"
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bell className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No notifications yet</h3>
                  <p className="text-gray-500">
                    When you get notifications, they'll show up here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
