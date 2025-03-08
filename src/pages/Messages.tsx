import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ClipboardPen, Search } from 'lucide-react';
import { getUsers, getMessages, MessageConversation } from '../utils/data';

const Messages = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  
  useEffect(() => {
    if (!currentUser) return;
    
    // Get all conversations
    const userMessages = getMessages(currentUser.id);
    setConversations(userMessages);
    
    // Get all users for new conversations
    const allUsers = getUsers().filter(user => user.id !== currentUser.id);
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  }, [currentUser]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query) {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages"
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      
      {conversations.length > 0 ? (
        <div className="divide-y">
          {conversations.map(convo => (
            <Link 
              key={convo.userId}
              to={`/chat/${convo.username}`}
              className="flex items-center p-4 hover:bg-gray-50 transition"
            >
              <img 
                src={convo.avatar} 
                alt={convo.name} 
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{convo.name}</h3>
                  <span className="text-xs text-gray-500">{convo.lastMessageTime}</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
                  {convo.unread > 0 && (
                    <span className="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {convo.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <ClipboardPen className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-medium mb-2">No messages yet</h3>
          <p className="text-gray-500 mb-4">
            Connect with other users to start messaging!
          </p>
        </div>
      )}
      
      <div className="p-4 border-t">
        <h3 className="font-medium mb-2">Start a new conversation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
          {filteredUsers.map(user => (
            <Link 
              key={user.id}
              to={`/chat/${user.username}`}
              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-full mb-1"
              />
              <span className="text-xs truncate w-full text-center">{user.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
