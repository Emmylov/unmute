import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Webcam from 'react-webcam';
import SimplePeer from 'simple-peer';
import { Mic, MicOff, Users, Video, VideoOff } from 'lucide-react';

interface LiveStreamBroadcastProps {
  streamId: string;
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
  onViewerCountChange?: (count: number) => void;
  isPreview?: boolean;
}

const LiveStreamBroadcast = ({
  streamId,
  onStreamStart,
  onStreamEnd,
  onViewerCountChange,
  isPreview = false
}: LiveStreamBroadcastProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewers, setViewers] = useState<{ id: string; peer: SimplePeer.Instance }[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // WebRTC connections handled here
  useEffect(() => {
    if (!isStreaming || isPreview) return;

    // In a real application, this would connect to a signaling server
    // For this demo, we're using localStorage as a very simple signaling mechanism
    const checkForViewers = () => {
      try {
        const pendingConnections = JSON.parse(localStorage.getItem(`stream_${streamId}_pending_viewers`) || '[]');
        
        pendingConnections.forEach((connection: { viewerId: string; signal: SimplePeer.SignalData }) => {
          // Check if viewer is already connected
          if (!viewers.some(v => v.id === connection.viewerId)) {
            const peer = new SimplePeer({
              initiator: false,
              trickle: false,
              stream: mediaStreamRef.current || undefined
            });

            peer.on('signal', (data) => {
              // Send signal back to viewer
              const responses = JSON.parse(localStorage.getItem(`stream_${streamId}_broadcaster_signals`) || '[]');
              responses.push({
                viewerId: connection.viewerId,
                signal: data
              });
              localStorage.setItem(`stream_${streamId}_broadcaster_signals`, JSON.stringify(responses));
            });

            peer.on('connect', () => {
              console.log(`Viewer ${connection.viewerId} connected`);
              setViewers(prev => [...prev, { id: connection.viewerId, peer }]);
            });

            peer.on('close', () => {
              console.log(`Viewer ${connection.viewerId} disconnected`);
              setViewers(prev => prev.filter(v => v.id !== connection.viewerId));
            });

            peer.on('error', (err) => {
              console.error('Peer error:', err);
              setViewers(prev => prev.filter(v => v.id !== connection.viewerId));
            });

            // Accept the incoming signal
            peer.signal(connection.signal);
          }
        });

        // Remove processed connections
        localStorage.setItem(`stream_${streamId}_pending_viewers`, JSON.stringify([]));
      } catch (error) {
        console.error('Error processing viewer connections:', error);
      }
    };

    // Poll for new viewers every second
    const interval = setInterval(checkForViewers, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [streamId, isStreaming, viewers, isPreview]);

  // Update viewer count
  useEffect(() => {
    onViewerCountChange?.(viewers.length);
  }, [viewers.length, onViewerCountChange]);

  // Audio visualization
  useEffect(() => {
    const analyzeAudio = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
      setAudioLevel(average / 255); // Normalize to 0-1
      
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    };

    if (isStreaming && audioEnabled && mediaStreamRef.current) {
      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          
          const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
          source.connect(analyserRef.current);
          
          const bufferLength = analyserRef.current.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength);
          
          animationFrameRef.current = requestAnimationFrame(analyzeAudio);
        } catch (error) {
          console.error('Error initializing audio analyzer:', error);
        }
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current.suspend();
      }
      
      setAudioLevel(0);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStreaming, audioEnabled]);

  const handleStartStream = () => {
    if (!webcamRef.current?.stream) {
      toast.error('Camera not available. Please check your permissions.');
      return;
    }

    mediaStreamRef.current = webcamRef.current.stream;
    setIsStreaming(true);
    onStreamStart?.();

    // Announce this stream is active
    localStorage.setItem(`stream_${streamId}_active`, 'true');
    localStorage.setItem(`stream_${streamId}_started_at`, Date.now().toString());

    // Initialize empty arrays for signaling
    localStorage.setItem(`stream_${streamId}_pending_viewers`, JSON.stringify([]));
    localStorage.setItem(`stream_${streamId}_broadcaster_signals`, JSON.stringify([]));

    toast.success('Live stream started!');
  };

  const handleEndStream = () => {
    // Close all peer connections
    viewers.forEach(viewer => {
      try {
        viewer.peer.destroy();
      } catch (e) {
        console.error('Error destroying peer:', e);
      }
    });
    setViewers([]);

    // Stop the stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setIsStreaming(false);
    onStreamEnd?.();

    // Update stream status
    localStorage.removeItem(`stream_${streamId}_active`);
    localStorage.removeItem(`stream_${streamId}_pending_viewers`);
    localStorage.removeItem(`stream_${streamId}_broadcaster_signals`);

    toast.success('Live stream ended');
  };

  const toggleAudio = () => {
    if (webcamRef.current?.stream) {
      webcamRef.current.stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (webcamRef.current?.stream) {
      webcamRef.current.stream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {(!isStreaming || (isStreaming && videoEnabled)) && (
        <Webcam
          ref={webcamRef}
          audio={true}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user"
          }}
          className="w-full h-full object-cover"
          onUserMediaError={(error) => {
            console.error('Webcam error:', error);
            toast.error('Could not access camera or microphone. Please check your permissions.');
          }}
        />
      )}

      {!videoEnabled && isStreaming && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-xl">Camera is off</div>
        </div>
      )}

      {/* Stream info overlay */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white rounded-lg p-2 flex items-center">
        {isStreaming ? (
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm">LIVE</span>
            <div className="ml-4 flex items-center">
              <Users size={16} className="mr-1" />
              <span className="text-sm">{viewers.length}</span>
            </div>
          </div>
        ) : isPreview ? (
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-sm">PREVIEW</span>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">NOT STREAMING</span>
          </div>
        )}
      </div>

      {/* Audio level meter */}
      {isStreaming && audioEnabled && (
        <div className="absolute bottom-20 left-2 bg-black bg-opacity-50 rounded-full w-4 h-32">
          <div 
            className="bg-green-500 rounded-full w-full absolute bottom-0 transition-all duration-100"
            style={{ height: `${audioLevel * 100}%` }}
          ></div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-4 p-2">
        <button
          onClick={toggleAudio}
          className={`rounded-full p-3 ${audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {audioEnabled ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-white" />}
        </button>
        <button
          onClick={toggleVideo}
          className={`rounded-full p-3 ${videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {videoEnabled ? <Video size={20} className="text-white" /> : <VideoOff size={20} className="text-white" />}
        </button>
        {!isPreview && (
          isStreaming ? (
            <button
              onClick={handleEndStream}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-3"
            >
              End Stream
            </button>
          ) : (
            <button
              onClick={handleStartStream}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3"
            >
              Go Live
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default LiveStreamBroadcast;
