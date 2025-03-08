import { useState } from 'react';
import { formatTimeAgo } from '../utils/data';
import AudioMessage from './AudioMessage';

interface ChatMessageProps {
  content: string;
  timestamp: number;
  isSender: boolean;
  senderName?: string;
  senderAvatar?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  onRetry?: () => void;
}

const ChatMessage = ({ 
  content, 
  timestamp, 
  isSender, 
  senderName, 
  senderAvatar,
  status = 'sent',
  onRetry
}: ChatMessageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if message contains URLs
  const containsUrl = /(https?:\/\/[^\s]+)/g.test(content);

  // Check if message is a meme template
  const isMeme = content.startsWith('[MEME:') && content.includes(']');
  
  // Check if message is an audio recording
  const isAudio = content.startsWith('[AUDIO:') && content.includes(']');
  
  let memeInfo = { template: '', topText: '', bottomText: '' };
  let audioUrl = '';
  let displayContent = content;
  
  if (isMeme) {
    try {
      const memeData = content.substring(content.indexOf('[MEME:') + 6, content.indexOf(']'));
      const [template, topText, bottomText] = memeData.split('|');
      memeInfo = { template, topText, bottomText };
      
      // Remove the meme markup from the content for regular display
      displayContent = content.substring(content.indexOf(']') + 1).trim();
    } catch (error) {
      console.error('Error parsing meme data:', error);
    }
  }
  
  if (isAudio) {
    try {
      audioUrl = content.substring(content.indexOf('[AUDIO:') + 7, content.indexOf(']'));
      displayContent = "🎤 Voice message";
    } catch (error) {
      console.error('Error parsing audio data:', error);
    }
  }
  
  const messageContainerClass = isSender 
    ? "flex flex-col items-end" 
    : "flex flex-col items-start";
  
  const messageBubbleClass = isSender
    ? "bg-purple-600 text-white rounded-2xl rounded-br-none p-3 max-w-[80%]"
    : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-3 max-w-[80%]";
  
  const longMessage = displayContent.length > 150 && !isAudio;
  const visibleContent = longMessage && !isExpanded 
    ? displayContent.substring(0, 150) + '...' 
    : displayContent;

  // Collection of meme template images with proper URLs
  const memeTemplates = {
    'drake': 'https://i.imgflip.com/30b1gx.jpg',
    'distracted': 'https://i.imgflip.com/1ur9b0.jpg',
    'button': 'https://i.imgflip.com/1g8my4.jpg',
    'change': 'https://i.imgflip.com/24y43o.jpg',
    'doge': 'https://i.imgflip.com/4t0m5.jpg',
    'batman': 'https://i.imgflip.com/9ehk.jpg',
    'expanding': 'https://i.imgflip.com/1jwhww.jpg',
    'thinking': 'https://i.imgflip.com/1h7in3.jpg',
    'woman-yelling': 'https://i.imgflip.com/345v97.jpg',
    'disaster-girl': 'https://i.imgflip.com/23ls.jpg',
    'guy-looking': 'https://i.imgflip.com/1ihzfe.jpg', 
    'bernie': 'https://i.imgflip.com/4frcuo.jpg'
  };

  return (
    <div className={messageContainerClass}>
      {!isSender && senderName && (
        <div className="flex items-center mb-1">
          {senderAvatar && (
            <img 
              src={senderAvatar} 
              alt={senderName} 
              className="w-6 h-6 rounded-full mr-1"
            />
          )}
          <span className="text-xs text-gray-500">{senderName}</span>
        </div>
      )}
      
      <div className={messageBubbleClass}>
        {isMeme && (
          <div className="mb-2 bg-black relative rounded overflow-hidden">
            <img 
              src={memeTemplates[memeInfo.template as keyof typeof memeTemplates] || 'https://i.imgflip.com/23ls.jpg'}
              alt="Meme"
              className="w-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://via.placeholder.com/300x300?text=Meme+Template';
              }}
            />
            <div className="absolute top-2 left-0 right-0 text-center text-white font-bold text-lg uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              {memeInfo.topText}
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center text-white font-bold text-lg uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              {memeInfo.bottomText}
            </div>
          </div>
        )}
        
        {isAudio ? (
          <AudioMessage audioUrl={audioUrl} isSender={isSender} />
        ) : containsUrl ? (
          <p className="break-words">
            {visibleContent.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
              if (part.match(/(https?:\/\/[^\s]+)/g)) {
                return (
                  <a 
                    key={index} 
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={isSender ? "text-blue-200 underline" : "text-blue-600 underline"}
                  >
                    {part}
                  </a>
                );
              }
              return part;
            })}
          </p>
        ) : (
          <p className="break-words">{visibleContent}</p>
        )}
        
        {longMessage && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-xs mt-1 ${isSender ? 'text-purple-200' : 'text-gray-500'}`}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      
      <div className="flex items-center mt-1">
        <span className="text-xs text-gray-500 mr-2">
          {formatTimeAgo(timestamp)}
        </span>
        
        {isSender && (
          <span className="text-xs text-gray-500">
            {status === 'sent' && '✓'}
            {status === 'delivered' && '✓✓'}
            {status === 'read' && <span className="text-blue-500">✓✓</span>}
            {status === 'failed' && (
              <span className="text-red-500 flex items-center">
                Failed 
                {onRetry && (
                  <button 
                    onClick={onRetry}
                    className="ml-1 text-purple-500 hover:underline"
                  >
                    Retry
                  </button>
                )}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
