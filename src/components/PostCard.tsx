import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { Post, likePost, addComment, formatTimeAgo, CAUSES } from '../utils/data';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from './ShareModal';

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

const PostCard = ({ post, onUpdate }: PostCardProps) => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  if (!currentUser) return null;
  
  const isLiked = post.likes.includes(currentUser.id);
  const causeInfo = CAUSES.find(c => c.id === post.cause);
  
  const handleLike = () => {
    likePost(post.id, currentUser.id);
    onUpdate();
  };
  
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      content: comment,
      createdAt: Date.now()
    };
    
    addComment(post.id, newComment);
    setComment('');
    onUpdate();
  };

  const getPostUrl = () => {
    // For now we'll just use a mock URL with post ID, but in a real app this would be a real URL
    return `${window.location.origin}/post/${post.id}`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex items-start mb-3">
        <Link to={`/profile/${post.username}`}>
          <img 
            src={post.userAvatar} 
            alt={post.name} 
            className="w-10 h-10 rounded-full mr-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://ui-avatars.com/api/?name=${post.name.replace(/ /g, '+')}`;
            }}
          />
        </Link>
        <div>
          <Link to={`/profile/${post.username}`} className="font-medium hover:underline">
            {post.name}
          </Link>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">@{post.username}</span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-gray-500 text-sm">{formatTimeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>
      
      {causeInfo && (
        <Link to={`/explore?cause=${post.cause}`} className="inline-flex items-center mb-2 px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: causeInfo.color.replace('bg-', '') }}>
          <span className="mr-1">{causeInfo.icon}</span>
          {causeInfo.name}
        </Link>
      )}
      
      <p className="mb-3 whitespace-pre-line">{post.content}</p>
      
      {post.image && (
        <img 
          src={post.image} 
          alt="Post content" 
          className="rounded-lg w-full mb-3"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://via.placeholder.com/600x400?text=Image+Unavailable';
          }}
        />
      )}
      
      <div className="flex justify-between text-gray-500 py-2 border-t border-b">
        <button 
          onClick={handleLike}
          className={`flex items-center ${isLiked ? 'text-red-500' : ''}`}
        >
          <Heart size={20} className={isLiked ? 'fill-current' : ''} />
          <span className="ml-1">{post.likes.length}</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center"
        >
          <MessageCircle size={20} />
          <span className="ml-1">{post.comments.length}</span>
        </button>
        <button 
          onClick={() => setShowShareModal(true)}
          className="flex items-center"
        >
          <Share size={20} />
          <span className="ml-1">Share</span>
        </button>
      </div>
      
      {showComments && (
        <div className="mt-3">
          <form onSubmit={handleComment} className="flex mb-3">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700"
            >
              Post
            </button>
          </form>
          
          {post.comments.length > 0 ? (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex">
                  <div className="mr-2 font-medium">@{comment.username}:</div>
                  <div>{comment.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No comments yet. Be the first!</p>
          )}
        </div>
      )}

      {showShareModal && (
        <ShareModal
          title={`Post by ${post.name}`}
          text={post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
          url={getPostUrl()}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default PostCard;
