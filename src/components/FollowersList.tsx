import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, User } from '../utils/data';
import { ArrowLeft, Search, UserMinus, UserPlus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FollowersListProps {
  username?: string;
  type: 'followers' | 'following';
  onClose: () => void;
}

const FollowersList = ({ username, type, onClose }: FollowersListProps) => {
  const { currentUser, followUser, unfollowUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    // Get user by username if provided, otherwise use current user
    let targetUser = currentUser;
    if (username && username !== currentUser.username) {
      const allUsers = getUsers();
      const foundUser = allUsers.find(u => u.username === username);
      if (foundUser) {
        targetUser = foundUser;
      }
    }

    // Get all users
    const allUsers = getUsers();
    
    // Filter based on type (followers or following)
    let filteredUsers: User[] = [];
    if (type === 'followers') {
      // Find users who have the target user in their followingUsers
      filteredUsers = allUsers.filter(user => 
        user.followingUsers && user.followingUsers.includes(targetUser.id)
      );
    } else if (type === 'following') {
      // Get users that the target user follows
      filteredUsers = allUsers.filter(user => 
        targetUser.followingUsers && targetUser.followingUsers.includes(user.id)
      );
    }
    
    setUsers(filteredUsers);
    setIsLoading(false);
  }, [currentUser, username, type]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.name.toLowerCase().includes(searchLower)
    );
  });

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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={onClose} className="mr-2">
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <h2 className="text-lg font-medium">
              {type === 'followers' ? 'Followers' : 'Following'}
              {username && username !== currentUser.username ? ` of @${username}` : ''}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            {searchQuery && (
              <button 
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {filteredUsers.map(user => (
                <div key={user.id} className="p-4 flex items-center justify-between">
                  <Link to={`/profile/${user.username}`} className="flex items-center flex-1" onClick={onClose}>
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(/ /g, '+')}`} 
                      alt={user.name} 
                      className="w-12 h-12 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <h3 className="font-medium dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                    </div>
                  </Link>
                  
                  {/* Don't show follow button for current user or for follower list of other users */}
                  {user.id !== currentUser.id && (type === 'following' || username === currentUser.username) && (
                    <button
                      onClick={() => handleFollowToggle(user.id)}
                      className={`ml-2 px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                        isFollowing(user.id)
                          ? 'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isFollowing(user.id) ? (
                        <>
                          <UserMinus size={16} className="mr-1" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} className="mr-1" />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery 
                  ? 'No users found matching your search.'
                  : type === 'followers' 
                    ? 'No followers yet.' 
                    : 'Not following anyone yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersList;
