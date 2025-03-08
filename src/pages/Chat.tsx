import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ClipboardPen, Pencil, Search, Sparkles, UserPlus } from 'lucide-react';
import { getUsers, getMessages, MessageConversation } from '../utils/data';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { toast } from 'react-hot-toast';

const Chat = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (!currentUser) return;
    
    // Get all conversations
    const userMessages = getMessages(currentUser.id);
    setConversations(userMessages);
    
    // Get all users for new conversations
    const allUsers = getUsers().filter(user => user.id !== currentUser.id);
    setUsers(allUsers);
    setFilteredUsers(allUsers);
    
    // Show confetti on first load
    if (userMessages.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentUser]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query) {
      // Filter conversations first
      const filteredConvos = conversations.filter(convo => 
        convo.name.toLowerCase().includes(query) || 
        convo.username.toLowerCase().includes(query) ||
        convo.lastMessage.toLowerCase().includes(query)
      );
      
      if (filteredConvos.length > 0) {
        setConversations(filteredConvos);
      } else {
        // If no conversation matches, filter users
        const filtered = users.filter(user => 
          user.username.toLowerCase().includes(query) ||
          user.name.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
      }
    } else {
      // Reset to original data
      const userMessages = getMessages(currentUser.id);
      setConversations(userMessages);
      setFilteredUsers(users);
    }
  };
  
  if (!currentUser) return null;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
        <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold mb-4 flex items-center">
            <Sparkles className="mr-2" /> 
            Messages
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages or people..."
              className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white/20 text-white placeholder-white/70"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-3 text-white/70" size={20} />
          </div>
        </div>
        
        {conversations.length > 0 ? (
          <motion.div 
            className="divide-y"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {conversations.map((convo, index) => (
              <motion.div
                key={convo.userId}
                variants={itemVariants}
                whileHover={{ backgroundColor: "#f9f5ff", x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to={`/chat/${convo.username}`}
                  className="flex items-center p-4 transition-all"
                >
                  <div className="relative">
                    <img 
                      src={convo.avatar} 
                      alt={convo.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-200"
                    />
                    {index < 2 && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 ml-3">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{convo.name}</h3>
                      <span className="text-xs text-gray-500">{convo.lastMessageTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500 truncate max-w-[180px]">{convo.lastMessage}</p>
                      {convo.unread > 0 && (
                        <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="p-8 text-center"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <ClipboardPen className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">No messages yet</h3>
            <p className="text-gray-500 mb-6">
              Connect with other users to start messaging!
            </p>
            <button 
              onClick={() => toast.success('Coming soon: Start a new conversation!')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <UserPlus className="inline mr-2" size={18} />
              Find People to Chat With
            </button>
          </motion.div>
        )}
        
        <div className="p-4 border-t">
          <h3 className="font-medium mb-2 flex items-center">
            <Pencil size={16} className="mr-1 text-purple-600" />
            Start a new conversation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-40 overflow-y-auto">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link 
                  to={`/chat/${user.username}`}
                  className="flex flex-col items-center p-2 hover:bg-purple-50 rounded-lg"
                >
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-12 h-12 rounded-full border-2 border-purple-100"
                    />
                    {Math.random() > 0.7 && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <span className="text-xs font-medium mt-1 truncate w-full text-center">{user.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
