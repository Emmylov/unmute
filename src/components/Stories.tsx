import { useEffect, useState } from 'react';
import { CAUSES } from '../utils/data';
import { useAuth } from '../contexts/AuthContext';
import StoryUploader from './StoryUploader';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  media: string;
  caption: string;
  createdAt: number;
  viewed: boolean;
  mediaType: 'image' | 'video';
  likes?: string[];
  viewedBy?: string[];
  replies?: Array<{id: string, userId: string, username: string, content: string, timestamp: number}>;
}

const Stories = () => {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  
  const fetchStories = () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Get stories from localStorage
      const storedStories = JSON.parse(localStorage.getItem('stories') || '[]');
      
      // Filter for recent stories (last 24 hours)
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const recentStories = storedStories.filter((story: any) => story.createdAt > oneDayAgo);
      
      // Add likes and viewed by arrays if they don't exist
      const updatedStories = recentStories.map((story: Story) => ({
        ...story,
        likes: story.likes || [],
        viewedBy: story.viewedBy || [],
        replies: story.replies || []
      }));
      
      if (updatedStories.length > 0) {
        setStories(updatedStories);
        localStorage.setItem('stories', JSON.stringify(updatedStories));
      } else {
        // If no stories found, use mock data
        useMockStories();
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Unable to load stories. Please refresh the page.');
      useMockStories();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to load mock stories data
  const useMockStories = () => {
    const mockStories = CAUSES.slice(0, 6).map((cause, index) => ({
      id: `story-${index}`,
      userId: `user-${index}`,
      username: `${cause.name.toLowerCase().replace(/\s/g, '')}_activist`,
      userAvatar: `https://ui-avatars.com/api/?name=${cause.name.charAt(0)}&background=random`,
      media: `https://source.unsplash.com/random/300x600?${cause.name.toLowerCase()}`,
      caption: `Supporting ${cause.name} today and every day!`,
      createdAt: Date.now() - (index * 3600000),
      viewed: false,
      mediaType: 'image' as const,
      likes: [],
      viewedBy: [],
      replies: []
    }));

    setStories(mockStories);
    localStorage.setItem('stories', JSON.stringify(mockStories));
    setError(null);
  };

  useEffect(() => {
    fetchStories();
  }, [currentUser]);

  const handleStoryClick = (story: Story, index: number) => {
    setViewingStory(story);
    setStoryIndex(index);
    setStoryProgress(0);
    setIsPaused(false);
    
    // Mark story as viewed by adding user to viewedBy
    if (currentUser && !story.viewedBy?.includes(currentUser.id)) {
      const updatedStories = stories.map(s => 
        s.id === story.id 
          ? { ...s, viewedBy: [...(s.viewedBy || []), currentUser.id], viewed: true } 
          : s
      );
      setStories(updatedStories);
      localStorage.setItem('stories', JSON.stringify(updatedStories));
    }
    
    // Start the progress timer
    startProgressTimer(story);
  };
  
  const startProgressTimer = (story: Story) => {
    // Clear any existing timers
    if (window.storyTimer) {
      clearInterval(window.storyTimer);
    }
    
    // Start new timer only if not paused
    if (!isPaused) {
      const duration = 5000; // 5 seconds per story
      const interval = 50; // Update every 50ms
      const step = (interval / duration) * 100;
      
      window.storyTimer = setInterval(() => {
        setStoryProgress(prev => {
          const next = prev + step;
          if (next >= 100) {
            clearInterval(window.storyTimer);
            
            // Mark story as viewed
            setStories(prev => 
              prev.map(s => s.id === story.id ? { ...s, viewed: true } : s)
            );
            
            // Move to next story after a brief delay
            setTimeout(() => {
              handleNextStory();
            }, 300);
            
            return 100;
          }
          return next;
        });
      }, interval);
    }
  };
  
  const handleNextStory = () => {
    if (!viewingStory) return;
    
    if (storyIndex < stories.length - 1) {
      // Move to next story
      const nextStory = stories[storyIndex + 1];
      setViewingStory(nextStory);
      setStoryIndex(storyIndex + 1);
      setStoryProgress(0);
      startProgressTimer(nextStory);
    } else {
      // Close story view if at the end
      setViewingStory(null);
      setStoryIndex(0);
      setStoryProgress(0);
      if (window.storyTimer) {
        clearInterval(window.storyTimer);
      }
    }
  };
  
  const handlePrevStory = () => {
    if (!viewingStory) return;
    
    if (storyIndex > 0) {
      // Move to previous story
      const prevStory = stories[storyIndex - 1];
      setViewingStory(prevStory);
      setStoryIndex(storyIndex - 1);
      setStoryProgress(0);
      startProgressTimer(prevStory);
    }
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
    
    if (isPaused && viewingStory) {
      // Resume progress
      startProgressTimer(viewingStory);
    } else if (window.storyTimer) {
      // Pause progress
      clearInterval(window.storyTimer);
    }
  };
  
  const handleLikeStory = (storyId: string) => {
    if (!currentUser) return;
    
    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        const isLiked = story.likes?.includes(currentUser.id);
        
        if (isLiked) {
          // Unlike
          return {
            ...story,
            likes: story.likes?.filter(id => id !== currentUser.id) || []
          };
        } else {
          // Like
          const newLikes = [...(story.likes || []), currentUser.id];
          return {
            ...story,
            likes: newLikes
          };
        }
      }
      return story;
    });
    
    setStories(updatedStories);
    setViewingStory(updatedStories.find(s => s.id === storyId) || null);
    localStorage.setItem('stories', JSON.stringify(updatedStories));
    
    toast.success(viewingStory?.likes?.includes(currentUser.id) ? 'Removed like' : 'Liked the story!');
  };
  
  const sendReply = () => {
    if (!currentUser || !viewingStory || !replyText.trim()) return;
    
    const newReply = {
      id: `reply-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      content: replyText.trim(),
      timestamp: Date.now()
    };
    
    const updatedStories = stories.map(story => {
      if (story.id === viewingStory.id) {
        return {
          ...story,
          replies: [...(story.replies || []), newReply]
        };
      }
      return story;
    });
    
    setStories(updatedStories);
    setViewingStory(updatedStories.find(s => s.id === viewingStory.id) || null);
    localStorage.setItem('stories', JSON.stringify(updatedStories));
    
    setReplyText('');
    setShowReplyInput(false);
    toast.success('Reply sent!');
  };
  
  // If connection error, show a user-friendly message with retry button
  if (error && !stories.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-4">
        <div className="text-center py-4">
          <p className="text-red-500 mb-2">Unable to load stories</p>
          <p className="text-sm text-gray-500 mb-4">
            We're having trouble loading stories. This might be due to a temporary issue.
          </p>
          <button 
            onClick={fetchStories} 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-4 overflow-hidden">
        <div className="flex overflow-x-auto pb-2 space-x-4 scrollbar-hide">
          {/* Your story uploader */}
          <StoryUploader onStoryCreated={fetchStories} />
          
          {/* Other stories */}
          {stories.map((story, index) => (
            <div key={story.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
              <button 
                onClick={() => handleStoryClick(story, index)}
                className={`w-16 h-16 rounded-full p-0.5 flex items-center justify-center ${
                  story.viewedBy?.includes(currentUser.id) ? 'bg-gray-300 dark:bg-gray-600' : 'story-ring'
                }`}
              >
                <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-800 overflow-hidden">
                  <img 
                    src={story.userAvatar} 
                    alt={story.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://ui-avatars.com/api/?name=${story.username}`;
                    }}
                  />
                </div>
              </button>
              <span className="text-xs truncate w-16 text-center">{story.username}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Story viewing modal */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="w-full max-w-md h-screen max-h-[80vh] overflow-hidden relative">
            {/* Progress bar */}
            <div className="absolute top-2 left-2 right-2 h-1 bg-gray-700 z-20">
              <div 
                className="h-full bg-white"
                style={{ width: `${storyProgress}%` }}
              ></div>
            </div>
            
            {/* User info */}
            <div className="absolute top-6 left-4 flex items-center z-20">
              <img 
                src={viewingStory.userAvatar} 
                alt={viewingStory.username}
                className="w-8 h-8 rounded-full border border-white"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://ui-avatars.com/api/?name=${viewingStory.username}`;
                }}
              />
              <span className="text-white ml-2">{viewingStory.username}</span>
              <span className="text-gray-300 text-xs ml-2">
                {viewingStory.likes?.length || 0} likes • {viewingStory.viewedBy?.length || 0} views
              </span>
            </div>
            
            {/* Close button */}
            <button 
              onClick={() => {
                setViewingStory(null);
                if (window.storyTimer) {
                  clearInterval(window.storyTimer);
                }
              }}
              className="absolute top-6 right-4 text-white z-20"
            >
              ✕
            </button>
            
            {/* Previous/Next story controls */}
            <div className="absolute inset-0 flex justify-between z-10">
              <button 
                className="w-1/4 h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevStory();
                }}
              ></button>
              <button 
                className="w-2/4 h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePause();
                }}
              ></button>
              <button 
                className="w-1/4 h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextStory();
                }}
              ></button>
            </div>
            
            {/* Story content */}
            <div className="w-full h-full flex items-center justify-center" onClick={togglePause}>
              {viewingStory.mediaType === 'image' ? (
                <img 
                  src={viewingStory.media} 
                  alt="Story" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://via.placeholder.com/400x800?text=Image+Not+Available';
                  }}
                />
              ) : (
                <video
                  src={viewingStory.media}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    target.onerror = null;
                    const parent = target.parentNode as HTMLElement;
                    if (parent) {
                      parent.innerHTML = '<div class="flex items-center justify-center h-full text-white">Video not available</div>';
                    }
                  }}
                />
              )}
              
              {/* Caption */}
              {viewingStory.caption && (
                <div className="absolute bottom-20 left-0 right-0 p-4 text-white text-center">
                  <p className="bg-black bg-opacity-50 p-3 rounded-lg">{viewingStory.caption}</p>
                </div>
              )}
            </div>
            
            {/* Story interactions */}
            <div className="absolute bottom-4 left-0 right-0 px-4 flex items-center justify-between z-20">
              {/* Reply input */}
              {showReplyInput ? (
                <div className="flex-1 flex mr-2">
                  <input
                    type="text"
                    placeholder="Reply to story..."
                    className="flex-1 bg-white bg-opacity-20 text-white border-none rounded-l-full py-2 px-4 focus:outline-none"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    autoFocus
                  />
                  <button 
                    onClick={sendReply} 
                    className="bg-purple-600 rounded-r-full px-4"
                    disabled={!replyText.trim()}
                  >
                    <Send size={18} className="text-white" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setShowReplyInput(true);
                    togglePause();
                  }}
                  className="flex-1 bg-white bg-opacity-20 text-white rounded-full py-2 px-4 mr-2"
                >
                  Reply to story...
                </button>
              )}
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleLikeStory(viewingStory.id)}
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                >
                  <Heart 
                    size={20} 
                    className={viewingStory.likes?.includes(currentUser.id) ? "text-red-500 fill-current" : "text-white"} 
                  />
                </button>
                <button 
                  onClick={() => {
                    setShowReplyInput(true); 
                    togglePause();
                  }}
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                >
                  <MessageCircle size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
