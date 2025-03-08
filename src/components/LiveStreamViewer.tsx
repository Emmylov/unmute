import { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { toast } from 'react-hot-toast';
import { ArrowLeftRight, Wifi, WifiOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface LiveStreamViewerProps {
  streamId: string;
  fallbackContent?: React.ReactNode;
  onStreamStatus?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
}

const LiveStreamViewer = ({ streamId, fallbackContent, onStreamStatus }: LiveStreamViewerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'medium' | 'poor'>('good');
  const viewerId = useRef(uuidv4()).current;
  const attemptCounter = useRef(0);
  const hasConnectedBefore = useRef(false);

  const checkStreamStatus = () => {
    try {
      const isStreamActive = localStorage.getItem(`stream_${streamId}_active`) === 'true';
      setIsActive(isStreamActive);
      return isStreamActive;
    } catch (error) {
      console.error('Error checking stream status:', error);
      return false;
    }
  };

  const initializeConnection = () => {
    if (peerRef.current) {
      // Destroy existing connection first
      peerRef.current.destroy();
      peerRef.current = null;
    }

    attemptCounter.current++;
    setStatus('connecting');
    onStreamStatus?.('connecting');

    const peer = new SimplePeer({
      initiator: true,
      trickle: false
    });

    peer.on('signal', (data) => {
      // Send signal to broadcaster through localStorage (demo only)
      try {
        const pendingConnections = JSON.parse(localStorage.getItem(`stream_${streamId}_pending_viewers`) || '[]');
        pendingConnections.push({
          viewerId,
          signal: data
        });
        localStorage.setItem(`stream_${streamId}_pending_viewers`, JSON.stringify(pendingConnections));
      } catch (error) {
        console.error('Error sending signal:', error);
      }
    });

    peer.on('connect', () => {
      console.log('Connected to broadcaster');
      setStatus('connected');
      onStreamStatus?.('connected');
      hasConnectedBefore.current = true;
      attemptCounter.current = 0;
      setConnectionQuality('good');
    });

    peer.on('stream', (stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
      }
    });

    peer.on('close', () => {
      console.log('Connection closed');
      setStatus('disconnected');
      onStreamStatus?.('disconnected');
      
      // Try to reconnect if the stream is still active
      if (checkStreamStatus() && attemptCounter.current < 3) {
        setTimeout(() => {
          initializeConnection();
        }, 2000);
      }
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      setStatus('error');
      onStreamStatus?.('error');
      
      // Try to reconnect if the stream is still active
      if (checkStreamStatus() && attemptCounter.current < 3) {
        setTimeout(() => {
          initializeConnection();
        }, 2000);
      }
    });

    // Listen for broadcaster's response
    const checkForResponse = () => {
      try {
        const responses = JSON.parse(localStorage.getItem(`stream_${streamId}_broadcaster_signals`) || '[]');
        const response = responses.find((r: { viewerId: string }) => r.viewerId === viewerId);
        
        if (response) {
          peer.signal(response.signal);
          
          // Remove processed response
          const updatedResponses = responses.filter((r: { viewerId: string }) => r.viewerId !== viewerId);
          localStorage.setItem(`stream_${streamId}_broadcaster_signals`, JSON.stringify(updatedResponses));
        }
      } catch (error) {
        console.error('Error processing broadcaster signal:', error);
      }
    };

    // Start checking for responses
    const intervalId = setInterval(checkForResponse, 1000);

    // Store the peer and interval for cleanup
    peerRef.current = peer;

    return () => {
      clearInterval(intervalId);
    };
  };

  // Simulate network quality
  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        const qualities = ['good', 'medium', 'poor'] as const;
        // Bias towards good quality
        const weights = [0.7, 0.2, 0.1];
        
        const randomNum = Math.random();
        let qualityIndex = 0;
        let sum = weights[0];
        
        while (randomNum > sum && qualityIndex < weights.length - 1) {
          qualityIndex++;
          sum += weights[qualityIndex];
        }
        
        setConnectionQuality(qualities[qualityIndex]);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [status]);

  // Initialize and handle stream status
  useEffect(() => {
    const isStreamActive = checkStreamStatus();
    
    if (isStreamActive) {
      const cleanup = initializeConnection();
      
      // Periodically check if the stream is still active
      const intervalId = setInterval(() => {
        const stillActive = checkStreamStatus();
        if (!stillActive && status !== 'disconnected') {
          setStatus('disconnected');
          onStreamStatus?.('disconnected');
          
          if (peerRef.current) {
            peerRef.current.destroy();
            peerRef.current = null;
          }
        }
      }, 5000);
      
      return () => {
        cleanup();
        clearInterval(intervalId);
        
        if (peerRef.current) {
          peerRef.current.destroy();
          peerRef.current = null;
        }
      };
    } else {
      setStatus('disconnected');
      onStreamStatus?.('disconnected');
    }
  }, [streamId]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Video player */}
      {status === 'connected' || status === 'connecting' ? (
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover" 
          playsInline 
          autoPlay 
          muted={false}
        />
      ) : (
        // Fallback content when not connected
        <div className="w-full h-full">
          {fallbackContent || (
            <div className="flex items-center justify-center h-full flex-col text-white">
              <WifiOff size={48} className="mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">Stream not available</h3>
              <p className="text-gray-400 text-center max-w-md">
                This stream is currently offline. Please check back later or try refreshing the page.
              </p>
              <button 
                onClick={() => {
                  checkStreamStatus();
                  if (isActive) {
                    initializeConnection();
                  } else {
                    toast.error('Stream is still offline');
                  }
                }}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Connection status indicator */}
      <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm text-white">
        {status === 'connected' && (
          <>
            <Wifi size={16} className={`mr-2 ${
              connectionQuality === 'good' ? 'text-green-400' : 
              connectionQuality === 'medium' ? 'text-yellow-400' : 
              'text-red-400'
            }`} />
            <span>
              {connectionQuality === 'good' ? 'Good' : 
               connectionQuality === 'medium' ? 'Fair' : 
               'Poor'} connection
            </span>
          </>
        )}
        {status === 'connecting' && (
          <>
            <ArrowLeftRight size={16} className="mr-2 text-yellow-400 animate-pulse" />
            <span>Connecting...</span>
          </>
        )}
        {status === 'disconnected' && (
          <>
            <WifiOff size={16} className="mr-2 text-gray-400" />
            <span>Disconnected</span>
          </>
        )}
        {status === 'error' && (
          <>
            <WifiOff size={16} className="mr-2 text-red-400" />
            <span>Connection error</span>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveStreamViewer;
