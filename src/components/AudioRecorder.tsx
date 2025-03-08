import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, CircleStop, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AudioRecorderProps {
  onAudioReady: (audioData: string) => void;
  onCancel: () => void;
}

const AudioRecorder = ({ onAudioReady, onCancel }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [audioVisualization, setAudioVisualization] = useState<number[]>(Array(20).fill(5));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Set up audio context for visualization
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyserRef.current = analyser;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioData(reader.result as string);
        };
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        // Stop visualizations
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      intervalRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Start visualization
      updateVisualization();
      
    } catch (err) {
      console.error('Error starting recording:', err);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };
  
  const updateVisualization = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Get average volume at different frequency ranges
    const samples = 20;
    const sampleSize = Math.floor(dataArray.length / samples);
    const newVisualization = [];
    
    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < sampleSize; j++) {
        sum += dataArray[i * sampleSize + j];
      }
      const average = sum / sampleSize;
      const normalized = Math.max(5, Math.min(50, average / 5)); // Scale between 5-50
      newVisualization.push(normalized);
    }
    
    setAudioVisualization(newVisualization);
    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setAudioData(null);
    setRecordingDuration(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    onCancel();
  };
  
  // Send the recorded audio
  const sendAudio = () => {
    if (!audioData) return;
    onAudioReady(audioData);
    setAudioData(null);
    setRecordingDuration(0);
    setAudioVisualization(Array(20).fill(5));
  };
  
  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {isRecording ? (
            <CircleStop 
              size={24} 
              className="text-red-500 animate-pulse mr-2" 
              onClick={stopRecording}
            />
          ) : (
            <Mic size={24} className="text-purple-600 mr-2" />
          )}
          <span className="font-medium text-gray-800 dark:text-white">
            {isRecording ? 'Recording...' : audioData ? 'Ready to send' : 'Voice message'}
          </span>
        </div>
        <button 
          onClick={cancelRecording}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Recording visualization */}
      <div className="flex items-center justify-center h-16 mb-2">
        {isRecording ? (
          <div className="flex items-end space-x-1 h-full">
            {audioVisualization.map((height, i) => (
              <div 
                key={i}
                className="w-1 bg-purple-500 rounded-full"
                style={{ height: `${height}px` }}
              ></div>
            ))}
          </div>
        ) : audioData ? (
          <div className="text-center text-purple-600 text-sm">
            ✓ Audio recorded successfully
          </div>
        ) : (
          <button
            onClick={startRecording}
            className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center"
          >
            <Mic size={24} className="text-white" />
          </button>
        )}
      </div>
      
      {/* Timer */}
      {(isRecording || recordingDuration > 0) && (
        <div className="text-center text-gray-500 text-sm mb-2">
          {formatTime(recordingDuration)}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-end">
        {audioData && (
          <button
            onClick={sendAudio}
            className="bg-purple-600 text-white rounded-full px-4 py-2 flex items-center"
          >
            <Send size={16} className="mr-1" />
            Send
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
