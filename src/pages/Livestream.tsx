import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Heart, MessageCircle, Send, Share, Users } from 'lucide-react';
import { getLiveStreams, LiveStream as LiveStreamType } from '../utils/data';
import { toast } from 'react-hot-toast';
import LiveStreamViewer from '../components/LiveStreamViewer';
import LiveStreamBroadcast from '../components/LiveStreamBroadcast';

const LiveComment = ({ username, content, time }: { username: string, content: string, time: string }) => (
  <div className="mb-2 animate-fadeIn">
    <div className="flex">
      <span className="font-medium text-purple-600 mr-2">@{username}:</span>
      <span>{content}</span>
    </div>
    <div className="text-xs text-gray-500">{time}</div>
  </div>
);

const LiveStream = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stream, setStream] = useState<LiveStreamType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ username: string, content: string, time: string }>>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamStatus, setStreamStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [isBroadcaster, setIsBroadcaster] = useState(false);
  
  useEffect(() => {
    if (!currentUser || !streamId) return;
    
    const loadStream = () => {
      const streams = getLiveStreams();
      const foundStream = streams.find(s => s.id === streamId);
      
      if (foundStream) {
        setStream(foundStream);
        setViewerCount(foundStream.viewers);
        setLikeCount(Math.floor(foundStream.viewers * 0.7)); // Simulate like count
        
        // Check if current user is the broadcaster
        setIsBroadcaster(foundStream.userId === currentUser.id);
      } else {
        toast.error('Stream not found');
        navigate('/live');
      }
      
      setIsLoading(false);
    };
    
    loadStream();
    
    // Initialize with some sample comments
    const sampleComments = [
      { username: 'viewer123', content: 'Great stream!', time: '2m ago' },
      { username: 'activism_fan', content: 'This is so important', time: '1m ago' },
      { username: 'change_maker', content: 'How can we get involved?', time: '30s ago' }
    ];
    setComments(sampleComments);
    
    // Simulate new comments coming in
    const commentInterval = setInterval(() => {
      const usernames = ['new_follower', 'truth_seeker', 'supporter99', 'community_voice'];
      const messages = [
        'This is amazing!', 
        'Thank you for sharing this', 
        'I learned so much today',
        'Keep up the great work',
        'How long have you been working on this cause?',
        '❤️❤️❤️',
        'Can you talk more about how to get involved?'
      ];
      
      const newComment = {
        username: usernames[Math.floor(Math.random() * usernames.length)],
        content: messages[Math.floor(Math.random() * messages.length)],
        time: 'Just now'
      };
      
      setComments(prev => [newComment, ...prev].slice(0, 50));
    }, 5000);
    
    return () => clearInterval(commentInterval);
  }, [currentUser, streamId, navigate]);
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    const newComment = {
      username: currentUser?.username || 'anonymous',
      content: comment,
      time: 'Just now'
    };
    
    setComments(prev => [newComment, ...prev]);
    setComment('');
  };
  
  const handleLike = () => {
    if (!hasLiked) {
      setLikeCount(prev => prev + 1);
      setHasLiked(true);
      toast.success('You liked the stream!');
    }
  };
  
  const handleShare = () => {
    // Create a shareable URL
    const streamUrl = window.location.href;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: stream?.title || 'Live Stream',
        text: `Check out this live stream: ${stream?.title}`,
        url: streamUrl
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fallback to clipboard
        copyToClipboard(streamUrl);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(streamUrl);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Stream link copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link to clipboard');
      });
  };
  
  const handleViewerCountChange = (count: number) => {
    setViewerCount(count);
  };
  
  const handleStreamEnd = () => {
    navigate('/live');
    toast.success('Your stream has ended');
  };
  
  if (!currentUser) return null;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!stream) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Stream not found</h2>
        <button 
          onClick={() => navigate('/live')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Back to Live
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden h-[calc(100vh-120px)] flex flex-col">
      {/* Stream Header */}
      <div className="p-3 border-b flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/live')}
            className="mr-2 p-1 rounded-full hover:bg-purple-500"
          >
            <ArrowLeft size={20} />
          </button>
          <img 
            src={stream.userAvatar} 
            alt={stream.username} 
            className="w-10 h-10 rounded-full mr-3 border-2 border-white"
          />
          <div>
            <h3 className="font-medium flex items-center">
              {stream.username}
              {streamStatus === 'connected' && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
              )}
            </h3>
            <p className="text-xs text-purple-100">{stream.title}</p>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <div className="mr-3 flex items-center">
            <Users size={16} className="mr-1" />
            <span>{viewerCount}</span>
          </div>
          <div className="flex items-center">
            <Heart size={16} className="mr-1" />
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
      
      {/* Stream Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Video */}
        <div className="md:col-span-2 bg-black relative">
          {isBroadcaster ? (
            <LiveStreamBroadcast 
              streamId={streamId || ''}
              onViewerCountChange={handleViewerCountChange}
              onStreamEnd={handleStreamEnd}
            />
          ) : (
            <LiveStreamViewer 
              streamId={streamId || ''}
              onStreamStatus={setStreamStatus}
              fallbackContent={
                <div className="flex items-center justify-center h-full flex-col">
                  <img 
                    src={stream.thumbnailUrl} 
                    alt={stream.title}
                    className="w-full h-full object-cover absolute inset-0 opacity-20"
                  />
                  <div className="relative z-10 text-center text-white p-4">
                    <h3 className="text-xl font-medium mb-2">Stream temporarily unavailable</h3>
                    <p>The broadcaster may be experiencing technical difficulties</p>
                  </div>
                </div>
              }
            />
          )}
        </div>
        
        {/* Comments */}
        <div className="flex flex-col h-full border-l">
          <div className="flex-1 p-3 overflow-y-auto flex flex-col-reverse">
            {comments.map((comment, index) => (
              <LiveComment 
                key={index}
                username={comment.username}
                content={comment.content}
                time={comment.time}
              />
            ))}
          </div>
          
          {/* Comment Input */}
          <div className="border-t p-3">
            <form onSubmit={handleSubmitComment} className="flex">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 flex items-center justify-center"
                disabled={!comment.trim()}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Stream Actions - only for viewers */}
      {!isBroadcaster && (
        <div className="p-3 border-t flex justify-between">
          <div className="text-sm text-gray-500">
            Started {new Date(stream.startedAt).toLocaleTimeString()}
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={handleLike}
              className={`flex items-center ${hasLiked ? 'text-red-500' : 'text-gray-700'}`}
            >
              <Heart size={20} className={hasLiked ? 'fill-current' : ''} />
              <span className="ml-1">Like</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center text-gray-700"
            >
              <Share size={20} />
              <span className="ml-1">Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStream;
