import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, Video } from 'lucide-react';
import { getLiveStreams, LiveStream, CAUSES } from '../utils/data';

const LiveStreams = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<LiveStream[]>([]);
  const [selectedCause, setSelectedCause] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchStreams = () => {
      setIsLoading(true);
      const liveStreams = getLiveStreams().filter(stream => stream.isLive);
      setStreams(liveStreams);
      setFilteredStreams(liveStreams);
      setIsLoading(false);
    };
    
    fetchStreams();
    
    // Refresh live streams every 30 seconds
    const intervalId = setInterval(fetchStreams, 30000);
    
    return () => clearInterval(intervalId);
  }, [currentUser]);
  
  const handleCauseSelect = (causeId: string) => {
    setSelectedCause(causeId === selectedCause ? '' : causeId);
    
    if (causeId === selectedCause) {
      // Clear filter
      setFilteredStreams(streams);
    } else {
      // Apply filter
      setFilteredStreams(streams.filter(stream => stream.cause === causeId));
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-red-500 text-transparent bg-clip-text">Live Streams</h1>
        <button 
          onClick={() => navigate('/live/create')}
          className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800"
        >
          <Plus size={18} />
          <span>Go Live</span>
        </button>
      </div>
      
      {/* Cause filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto py-2">
        {CAUSES.map((cause) => (
          <button
            key={cause.id}
            onClick={() => handleCauseSelect(cause.id)}
            className={`flex items-center px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCause === cause.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">{cause.icon}</span>
            {cause.name}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredStreams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStreams.map(stream => (
            <Link 
              key={stream.id}
              to={`/live/${stream.id}`}
              className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition transform hover:scale-[1.02]"
            >
              <div className="relative">
                <img 
                  src={stream.thumbnailUrl} 
                  alt={stream.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                  LIVE
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center">
                  <Users size={14} className="mr-1" />
                  {stream.viewers}
                </div>
              </div>
              <div className="p-3">
                <div className="flex mb-2">
                  <img 
                    src={stream.userAvatar} 
                    alt={stream.username}
                    className="w-9 h-9 rounded-full mr-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://ui-avatars.com/api/?name=${stream.username}`;
                    }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-1">{stream.title}</h3>
                    <p className="text-sm text-gray-500">@{stream.username}</p>
                  </div>
                </div>
                {stream.cause && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white" style={{ 
                      backgroundColor: CAUSES.find(c => c.id === stream.cause)?.color.replace('bg-', '') || 'bg-gray-500'
                    }}>
                      {CAUSES.find(c => c.id === stream.cause)?.icon} {CAUSES.find(c => c.id === stream.cause)?.name}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <Video size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-medium mb-2">No active livestreams</h3>
          <p className="text-gray-700 mb-4">
            {selectedCause ? "There are no streams for this cause right now." : "There are no active streams right now."}
          </p>
          <button 
            onClick={() => navigate('/live/create')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full font-medium hover:from-purple-700 hover:to-purple-800 transition"
          >
            Start Streaming
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveStreams;
