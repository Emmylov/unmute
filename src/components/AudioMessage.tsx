import { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

interface AudioMessageProps {
  audioUrl: string;
  isSender: boolean;
}

const AudioMessage = ({ audioUrl, isSender }: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  
  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;
    
    try {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: isSender ? '#e4e4e7' : '#8b5cf6',
        progressColor: isSender ? '#ffffff' : '#7c3aed',
        cursorColor: 'transparent',
        barWidth: 2,
        barRadius: 3,
        barGap: 2,
        height: 40,
        responsive: true,
      });
      
      wavesurfer.load(audioUrl);
      
      wavesurfer.on('ready', () => {
        wavesurferRef.current = wavesurfer;
        setAudioDuration(wavesurfer.getDuration());
        setIsLoaded(true);
      });
      
      wavesurfer.on('audioprocess', () => {
        setCurrentTime(wavesurfer.getCurrentTime());
      });
      
      wavesurfer.on('finish', () => {
        setIsPlaying(false);
      });
      
      wavesurfer.on('error', () => {
        setLoadError(true);
      });
      
      return () => {
        wavesurfer.destroy();
        wavesurferRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing wavesurfer:', error);
      setLoadError(true);
    }
  }, [audioUrl, isSender]);
  
  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    
    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div className="flex items-center w-full max-w-xs">
      <button 
        onClick={handlePlayPause}
        disabled={!isLoaded || loadError}
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-2 ${
          !isLoaded ? 'bg-gray-300 text-gray-500' :
          isSender ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'
        }`}
      >
        {!isLoaded && !loadError ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        ) : loadError ? (
          <span className="text-xs">Error</span>
        ) : (
          isPlaying ? <Pause size={18} /> : <Play size={18} />
        )}
      </button>
      
      <div className="flex-1">
        {loadError ? (
          <div className="text-xs text-red-500">Failed to load audio message</div>
        ) : (
          <>
            <div ref={waveformRef} className="w-full"></div>
            <div className="flex justify-between text-xs mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{isLoaded ? formatTime(audioDuration) : '--:--'}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioMessage;
