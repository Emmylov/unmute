import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Bell, Heart, MessageCircle, User, Video } from 'lucide-react';
import { getNotifications, Notification, markAsRead } from '../utils/data';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const userNotifications = getNotifications(currentUser.id);
    setNotifications(userNotifications);
  }, [currentUser]);
  
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
        return <Heart size={20} className="text-red-500" />;
      case 'comment':
        return <MessageCircle size={20} className="text-blue-500" />;
      case 'follow':
        return <User size={20} className="text-purple-500" />;
      case 'mention':
        return <Bell size={20} className="text-yellow-500" />;
      case 'reel':
        return <Video size={20} className="text-green-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>
      
      {notifications.length > 0 ? (
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
  );
};

export default Notifications;
