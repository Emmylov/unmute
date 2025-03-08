import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUsers } from '../utils/data';
import { Search, UserPlus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
}

const FindFriends = () => {
  const { currentUser, followUser, unfollowUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    setIsLoading(true);
    // Get all users except current user
    const allUsers = getUsers().filter(user => user.id !== currentUser.id);
    setUsers(allUsers);
    setFilteredUsers(allUsers);
    setIsLoading(false);
  }, [currentUser]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query) {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(query) || 
        user.name.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const isFollowing = (userId: string) => {
    return currentUser?.followingUsers?.includes(userId) || false;
  };

  const handleFollowToggle = (userId: string) => {
    if (isFollowing(userId)) {
      unfollowUser(userId);
      toast.success('Unfollowed user');
    } else {
      followUser(userId);
      toast.success('Following user');
    }
  };

  if (!currentUser) return null;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Find Friends</h2>
      
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by name or username"
          className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        {searchQuery && (
          <button 
            onClick={() => {
              setSearchQuery('');
              setFilteredUsers(users);
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between border-b pb-4">
              <Link to={`/profile/${user.username}`} className="flex items-center flex-1">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(/ /g, '+')}`} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://ui-avatars.com/api/?name=${user.name.replace(/ /g, '+')}`;
                  }}
                />
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  {user.bio && (
                    <p className="text-sm text-gray-600 line-clamp-1">{user.bio}</p>
                  )}
                </div>
              </Link>
              <button
                onClick={() => handleFollowToggle(user.id)}
                className={`ml-4 px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                  isFollowing(user.id)
                    ? 'border border-gray-300 hover:bg-gray-100'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                <UserPlus size={16} className="mr-1" />
                {isFollowing(user.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-2">
            {searchQuery ? 'No users found matching your search.' : 'No other users found.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilteredUsers(users);
              }}
              className="text-purple-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FindFriends;
