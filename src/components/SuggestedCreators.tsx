import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPopularCreators, User } from '../utils/data';
import { Sparkles, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SuggestedCreators = () => {
  const { currentUser, followUser, unfollowUser } = useAuth();
  const [creators, setCreators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadCreators = () => {
      setIsLoading(true);
      try {
        // Get popular creators
        const popularCreators = getPopularCreators();
        
        // Filter out creators the user already follows
        const filteredCreators = popularCreators.filter(creator => 
          !currentUser.followingUsers?.includes(creator.id) && 
          creator.id !== currentUser.id
        );
        
        setCreators(filteredCreators.slice(0, 5)); // Show top 5
      } catch (error) {
        console.error('Error loading creators:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCreators();
  }, [currentUser]);

  const handleFollowToggle = (userId: string) => {
    if (!currentUser) return;
    
    const isFollowing = currentUser.followingUsers?.includes(userId);
    
    if (isFollowing) {
      unfollowUser(userId);
      toast.success('Unfollowed user');
    } else {
      followUser(userId);
      toast.success('Following user');
    }
    
    // Update the list
    setCreators(prevCreators => 
      prevCreators.filter(creator => creator.id !== userId)
    );
  };

  if (!currentUser || creators.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex items-center mb-4">
        <Sparkles className="text-purple-600 mr-2" size={20} />
        <h2 className="text-lg font-bold">Suggested Creators</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {creators.map(creator => (
            <div key={creator.id} className="flex items-center justify-between">
              <Link to={`/profile/${creator.username}`} className="flex items-center group">
                <img 
                  src={creator.avatar || `https://ui-avatars.com/api/?name=${creator.name.replace(/ /g, '+')}`} 
                  alt={creator.name} 
                  className="w-10 h-10 rounded-full mr-3 group-hover:ring-2 ring-purple-500 transition-all"
                />
                <div>
                  <h3 className="font-medium group-hover:text-purple-600 transition-colors">{creator.name}</h3>
                  <p className="text-xs text-gray-500">@{creator.username}</p>
                </div>
              </Link>
              <button
                onClick={() => handleFollowToggle(creator.id)}
                className="ml-2 px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition-colors flex items-center"
              >
                <UserPlus size={14} className="mr-1" />
                Follow
              </button>
            </div>
          ))}
        </div>
      )}
      
      <Link 
        to="/explore" 
        className="mt-4 text-purple-600 text-sm hover:text-purple-800 block text-center"
      >
        Discover more creators
      </Link>
    </div>
  );
};

export default SuggestedCreators;
