import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPosts, Post, getUsers, CAUSES } from '../utils/data';
import PostCard from '../components/PostCard';
import ProfileHeader from '../components/ProfileHeader';
import { Bookmark, Grid2x2, Tag } from 'lucide-react';
import SuggestedCreators from '../components/SuggestedCreators';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [isLoading, setIsLoading] = useState(true);
  
  const isCurrentUser = currentUser?.username === username;
  
  useEffect(() => {
    if (!currentUser || !username) return;
    
    const loadProfileData = () => {
      setIsLoading(true);
      
      try {
        // Get user data
        if (isCurrentUser) {
          setProfileUser({
            ...currentUser,
            causes: CAUSES.filter(cause => currentUser.followingCauses.includes(cause.id))
          });
        } else {
          const users = getUsers();
          const foundUser = users.find(u => u.username === username);
          
          if (foundUser) {
            setProfileUser({
              ...foundUser,
              causes: CAUSES.filter(cause => foundUser.followingCauses?.includes(cause.id))
            });
          } else {
            // User not found
            navigate('/home');
            return;
          }
        }
        
        // Get user posts
        const allPosts = getPosts();
        setUserPosts(allPosts.filter(post => post.username === username));
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, [currentUser, username, isCurrentUser, navigate]);
  
  const loadUserPosts = () => {
    const allPosts = getPosts();
    setUserPosts(allPosts.filter(post => post.username === username));
  };
  
  if (!currentUser || isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">User not found</h2>
        <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/home')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
        <ProfileHeader
          profileUser={profileUser}
          isCurrentUser={isCurrentUser}
          postsCount={userPosts.length}
          onProfileUpdate={loadUserPosts}
        />
        
        {/* Tabs */}
        <div className="border-t flex">
          <button 
            onClick={() => setActiveTab('posts')} 
            className={`flex-1 py-3 flex justify-center items-center ${
              activeTab === 'posts' ? 'border-t-2 border-purple-600 text-purple-600' : 'text-gray-500'
            }`}
          >
            <Grid2x2 size={18} className="mr-1" />
            <span className="text-sm font-medium">Posts</span>
          </button>
          {isCurrentUser && (
            <>
              <button 
                onClick={() => setActiveTab('saved')} 
                className={`flex-1 py-3 flex justify-center items-center ${
                  activeTab === 'saved' ? 'border-t-2 border-purple-600 text-purple-600' : 'text-gray-500'
                }`}
              >
                <Bookmark size={18} className="mr-1" />
                <span className="text-sm font-medium">Saved</span>
              </button>
              <button 
                onClick={() => setActiveTab('tagged')} 
                className={`flex-1 py-3 flex justify-center items-center ${
                  activeTab === 'tagged' ? 'border-t-2 border-purple-600 text-purple-600' : 'text-gray-500'
                }`}
              >
                <Tag size={18} className="mr-1" />
                <span className="text-sm font-medium">Tagged</span>
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          {/* Content based on active tab */}
          {activeTab === 'posts' && (
            <>
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <PostCard key={post.id} post={post} onUpdate={loadUserPosts} />
                ))
              ) : (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                    <Grid2x2 size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                  <p className="text-gray-500 mb-4">
                    {isCurrentUser 
                      ? "You haven't created any posts yet. Share something with the community!"
                      : "This user hasn't posted anything yet."}
                  </p>
                  {isCurrentUser && (
                    <button 
                      onClick={() => navigate('/create')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Create Your First Post
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          
          {activeTab === 'saved' && (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                <Bookmark size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No saved posts</h3>
              <p className="text-gray-500">
                Save posts to view them later. Only you can see what you've saved.
              </p>
            </div>
          )}
          
          {activeTab === 'tagged' && (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                <Tag size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No tagged posts</h3>
              <p className="text-gray-500">
                Photos and videos you're tagged in will appear here.
              </p>
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          {!isCurrentUser && <SuggestedCreators />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
