import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDown, ChevronUp, Heart, MessageCircle, Music, Plus, Send, Share, X } from 'lucide-react';
import { getReels, likeReel, addReelComment, Reel } from '../utils/data';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface ReelComment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  createdAt: number;
}

interface ExtendedReel extends Reel {
  likedBy: string[];
  comments: ReelComment[];
}

interface ReelCardProps {
  reel: ExtendedReel;
  isActive: boolean;
  onLike: () => void;
  onComment: (comment: string) => void;
  currentUser: any;
}

const ReelCard = ({ reel, isActive, onLike, onComment, currentUser }: ReelCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const isLiked = Array.isArray(reel.likedBy) && reel.likedBy.includes(currentUser.id);
  
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(err => {
          console.error("Video play error:", err instanceof Error ? err.message : String(err));
          setVideoError(true);
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    onComment(commentText);
    setCommentText('');
  };
  
  return (
    <div className="h-full w-full relative bg-black">
      {videoError ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-white">
          <img 
            src={reel.thumbnailUrl} 
            alt={reel.caption} 
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-4">
              <p className="text-xl font-bold mb-2">Video could not be played</p>
              <p className="text-sm">This video format might not be supported by your browser</p>
            </div>
            <button 
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.load();
                  videoRef.current.play().catch(err => console.error("Retry error:", err));
                  setVideoError(false);
                }
              }}
              className="px-4 py-2 bg-purple-600 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <video 
          ref={videoRef}
          src={reel.videoUrl} 
          poster={reel.thumbnailUrl}
          className="w-full h-full object-contain"
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
        />
      )}
      
      {/* Bottom overlay with info */}
      <div className="absolute bottom-0 left-0 right-0 reels-gradient p-4">
        <div className="flex items-center mb-3">
          <Link to={`/profile/${reel.username}`}>
            <img 
              src={reel.userAvatar} 
              alt={reel.username} 
              className="w-8 h-8 rounded-full border-2 border-white mr-2"
            />
          </Link>
          <Link to={`/profile/${reel.username}`} className="text-white font-medium">
            @{reel.username}
          </Link>
        </div>
        
        <p className="text-white mb-3">{reel.caption}</p>
        
        <div className="flex items-center text-white">
          <Music size={16} className="mr-1" />
          <span className="text-sm">{reel.audio}</span>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
        <button 
          className="text-white"
          onClick={onLike}
        >
          <Heart size={28} className={isLiked ? "fill-red-500 text-red-500" : ""} />
          <span className="block text-xs mt-1">{typeof reel.likes === 'number' ? reel.likes : reel.likedBy?.length || 0}</span>
        </button>
        <button 
          className="text-white"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={28} />
          <span className="block text-xs mt-1">{Array.isArray(reel.comments) ? reel.comments.length : 0}</span>
        </button>
        <button 
          className="text-white"
          onClick={() => toast.success('Reel link copied to clipboard!')}
        >
          <Share size={28} />
          <span className="block text-xs mt-1">Share</span>
        </button>
      </div>
      
      {/* Comment overlay */}
      {showComments && (
        <div className="absolute inset-0 bg-black bg-opacity-80 z-10 flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-gray-800">
            <h3 className="text-white font-medium">Comments</h3>
            <button 
              onClick={() => setShowComments(false)}
              className="text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {Array.isArray(reel.comments) && reel.comments.length > 0 ? (
              reel.comments.map((comment: ReelComment, index: number) => (
                <div key={index} className="mb-4 flex items-start">
                  <img 
                    src={comment.userAvatar || `https://ui-avatars.com/api/?name=${comment.username}`} 
                    alt={comment.username} 
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div className="bg-gray-800 rounded-lg p-2 flex-1">
                    <div className="font-medium text-white text-sm mb-1">@{comment.username}</div>
                    <div className="text-gray-300">{comment.content}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center mt-10">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
          
          <form onSubmit={handleCommentSubmit} className="p-4 border-t border-gray-800 flex">
            <input
              type="text"
              className="flex-1 bg-gray-800 border-none text-white rounded-l-lg px-4 py-2 focus:outline-none"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-purple-600 text-white px-4 rounded-r-lg disabled:opacity-50"
              disabled={!commentText.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const Reels = () => {
  const { currentUser } = useAuth();
  const [reels, setReels] = useState<ExtendedReel[]>([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) return;
    
    const loadReels = () => {
      try {
        setIsLoading(true);
        const allReels = getReels();
        
        // Ensure all reels have proper structure
        const formattedReels = allReels.map(reel => ({
          ...reel,
          likedBy: Array.isArray(reel.likedBy) ? reel.likedBy : [],
          comments: Array.isArray(reel.comments) ? reel.comments : []
        }));
        
        setReels(formattedReels);
        setError(null);
      } catch (err) {
        console.error('Error loading reels:', err);
        setError('Failed to load reels. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReels();
    
    // Refresh reels every 30 seconds to get new content
    const interval = setInterval(loadReels, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);
  
  const handleNext = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
      scrollToReel(currentReelIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
      scrollToReel(currentReelIndex - 1);
    }
  };
  
  const scrollToReel = (index: number) => {
    if (containerRef.current) {
      const reelHeight = containerRef.current.offsetHeight;
      containerRef.current.scrollTo({
        top: index * reelHeight,
        behavior: 'smooth'
      });
    }
  };
  
  const handleLikeReel = (reelId: string) => {
    if (!currentUser) return;
    
    try {
      likeReel(reelId, currentUser.id);
      
      // Update the UI
      setReels(reels.map(reel => {
        if (reel.id === reelId) {
          const isAlreadyLiked = Array.isArray(reel.likedBy) && reel.likedBy.includes(currentUser.id);
          
          return {
            ...reel,
            likes: typeof reel.likes === 'number' ? 
              (isAlreadyLiked ? reel.likes - 1 : reel.likes + 1) : 
              (Array.isArray(reel.likedBy) ? reel.likedBy.length : 0),
            likedBy: isAlreadyLiked ?
              reel.likedBy.filter((id: string) => id !== currentUser.id) :
              [...(reel.likedBy || []), currentUser.id]
          };
        }
        return reel;
      }));
    } catch (err) {
      console.error('Error liking reel:', err);
      toast.error('Failed to like reel. Please try again.');
    }
  };
  
  const handleAddComment = (reelId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    
    try {
      const comment = {
        id: `comment-${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        content,
        createdAt: Date.now()
      };
      
      addReelComment(reelId, comment);
      
      // Update the UI
      setReels(reels.map(reel => {
        if (reel.id === reelId) {
          return {
            ...reel,
            comments: Array.isArray(reel.comments) ? 
              [...reel.comments, comment] : 
              [comment]
          };
        }
        return reel;
      }));
      
      toast.success('Comment added!');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment. Please try again.');
    }
  };
  
  // Handle scroll events to update current reel index
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop;
        const reelHeight = containerRef.current.offsetHeight;
        const index = Math.round(scrollPosition / reelHeight);
        if (index !== currentReelIndex && index >= 0 && index < reels.length) {
          setCurrentReelIndex(index);
        }
      }
    };
    
    const containerElement = containerRef.current;
    if (containerElement) {
      containerElement.addEventListener('scroll', handleScroll);
      return () => containerElement.removeEventListener('scroll', handleScroll);
    }
  }, [currentReelIndex, reels.length]);
  
  if (!currentUser) return null;
  
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (reels.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">No Reels Available</h2>
          <p className="text-gray-600 mb-6">Be the first to create a reel!</p>
          <button
            onClick={() => navigate('/reels/create')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Create Reel
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-120px)] relative overflow-hidden bg-black rounded-xl">
      {/* Create Reel button */}
      <button
        onClick={() => navigate('/reels/create')}
        className="absolute top-4 right-4 z-20 bg-purple-600 text-white p-2 rounded-full shadow-lg"
      >
        <Plus size={24} />
      </button>
      
      {/* Navigation buttons */}
      <button 
        onClick={handlePrevious}
        disabled={currentReelIndex === 0}
        className="absolute top-1/2 transform -translate-y-1/2 left-4 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white disabled:opacity-30"
      >
        <ChevronUp size={24} />
      </button>
      
      <button 
        onClick={handleNext}
        disabled={currentReelIndex === reels.length - 1}
        className="absolute top-1/2 transform -translate-y-1/2 right-4 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white disabled:opacity-30"
      >
        <ChevronDown size={24} />
      </button>
      
      {/* Progress indicators */}
      <div className="absolute top-4 left-0 right-0 px-4 z-10">
        <div className="flex space-x-1">
          {reels.map((_, index) => (
            <div 
              key={index} 
              className={`h-1 rounded-full flex-1 ${
                index === currentReelIndex ? 'bg-white' : 'bg-white bg-opacity-30'
              }`}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Reels Container */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {reels.map((reel, index) => (
          <div 
            key={reel.id} 
            className="h-full w-full snap-start snap-always"
          >
            <ReelCard 
              reel={reel} 
              isActive={index === currentReelIndex} 
              onLike={() => handleLikeReel(reel.id)}
              onComment={(comment) => handleAddComment(reel.id, comment)}
              currentUser={currentUser}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;
