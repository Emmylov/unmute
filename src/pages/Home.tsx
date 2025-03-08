import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPosts, Post } from '../utils/data';
import PostCard from '../components/PostCard';
import { Sparkles } from 'lucide-react';
import FindFriends from '../components/FindFriends';

const Home = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFriends, setShowFriends] = useState(false);
  
  const loadPosts = () => {
    if (!currentUser) return;
    
    const allPosts = getPosts();
    // Show posts from causes the user follows + some general posts
    let filteredPosts = allPosts;
    
    if (currentUser.followingCauses && currentUser.followingCauses.length > 0) {
      // If user follows causes, filter by them
      filteredPosts = allPosts.filter(post => 
        currentUser.followingCauses.includes(post.cause) || post.cause === 'general'
      );
    }
    
    // If no posts found after filtering or no causes followed, just show all posts
    if (filteredPosts.length === 0) {
      filteredPosts = allPosts;
    }
    
    setPosts(filteredPosts);
    setLoading(false);
    
    // Show friends suggestion if user has very few connections
    if (!currentUser.followingUsers || currentUser.followingUsers.length < 3) {
      setShowFriends(true);
    }
  };
  
  useEffect(() => {
    loadPosts();
  }, [currentUser]);
  
  if (!currentUser) return null;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">Home Feed</h1>
        <button className="flex items-center space-x-1 text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 rounded-full">
          <Sparkles size={16} />
          <span>For You</span>
        </button>
      </div>
      
      {/* Show find friends when user has few connections */}
      {showFriends && <FindFriends />}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4 animate__animated animate__fadeIn">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onUpdate={loadPosts} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center interactive-gradient">
          <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <Sparkles size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-medium mb-2">Your feed is empty</h3>
          <p className="text-gray-700 mb-4">
            Follow some causes or create your first post to get started!
          </p>
          <button 
            onClick={() => setShowFriends(true)} 
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full font-medium hover:from-purple-700 hover:to-purple-800 transition transform hover:scale-105"
          >
            Discover People & Causes
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
