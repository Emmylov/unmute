import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Image, Mic, Paperclip, Send, Smile } from 'lucide-react';
import { getMessagesByUsername, sendMessage, formatTimeAgo } from '../utils/data';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from '../components/ChatMessage';
import GifPicker from '../components/GifPicker';
import AudioRecorder from '../components/AudioRecorder';
import MemeCreator from '../components/MemeCreator';
import EmojiPicker from 'emoji-picker-react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read?: boolean;
}

const SingleChat = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [chatData, setChatData] = useState<{ user: any, messages: Message[] }>({ user: null, messages: [] });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [showMemeCreator, setShowMemeCreator] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!currentUser || !username) return;
    
    const loadChat = () => {
      setIsLoading(true);
      const data = getMessagesByUsername(currentUser.id, username);
      setChatData(data);
      setIsLoading(false);
    };
    
    loadChat();
    
    // Refresh chat every 10 seconds to check for new messages
    const interval = setInterval(loadChat, 10000);
    return () => clearInterval(interval);
  }, [currentUser, username]);
  
  useEffect(() => {
    scrollToBottom();
  }, [chatData.messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!currentUser || !chatData.user || !inputMessage.trim()) return;
    
    try {
      const newMessage = {
        id: `msg-${uuidv4()}`,
        senderId: currentUser.id,
        receiverId: chatData.user.id,
        content: inputMessage.trim(),
        timestamp: Date.now()
      };
      
      sendMessage(newMessage);
      
      // Update local state immediately
      setChatData(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));
      
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  const handleEmojiSelect = (emojiData: any) => {
    setInputMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
  const handleGifSelect = (gif: { url: string }) => {
    if (!currentUser || !chatData.user) return;
    
    try {
      const gifMessage = {
        id: `msg-${uuidv4()}`,
        senderId: currentUser.id,
        receiverId: chatData.user.id,
        content: gif.url,
        timestamp: Date.now()
      };
      
      sendMessage(gifMessage);
      
      // Update local state immediately
      setChatData(prev => ({
        ...prev,
        messages: [...prev.messages, gifMessage]
      }));
    } catch (error) {
      console.error('Error sending GIF:', error);
      toast.error('Failed to send GIF');
    }
  };
  
  const handleAudioRecorded = (audioData: string) => {
    if (!currentUser || !chatData.user) return;
    
    try {
      const audioMessage = {
        id: `msg-${uuidv4()}`,
        senderId: currentUser.id,
        receiverId: chatData.user.id,
        content: `[AUDIO:${audioData}]`,
        timestamp: Date.now()
      };
      
      sendMessage(audioMessage);
      
      // Update local state immediately
      setChatData(prev => ({
        ...prev,
        messages: [...prev.messages, audioMessage]
      }));
      
      setShowAudioRecorder(false);
    } catch (error) {
      console.error('Error sending audio:', error);
      toast.error('Failed to send audio message');
    }
  };
  
  const handleMemeCreated = (memeData: string) => {
    if (!currentUser || !chatData.user) return;
    
    try {
      const memeMessage = {
        id: `msg-${uuidv4()}`,
        senderId: currentUser.id,
        receiverId: chatData.user.id,
        content: memeData,
        timestamp: Date.now()
      };
      
      sendMessage(memeMessage);
      
      // Update local state immediately
      setChatData(prev => ({
        ...prev,
        messages: [...prev.messages, memeMessage]
      }));
    } catch (error) {
      console.error('Error sending meme:', error);
      toast.error('Failed to send meme');
    }
  };
  
  if (!currentUser) return null;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-160px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!chatData.user) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">User not found</h2>
        <p className="text-gray-600 mb-6">The user you're looking for doesn't exist or is unavailable.</p>
        <button 
          onClick={() => navigate('/chat')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Back to Messages
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-160px)]">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <button 
          onClick={() => navigate('/chat')}
          className="mr-3"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center flex-1">
          <img 
            src={chatData.user.avatar} 
            alt={chatData.user.name} 
            className="w-10 h-10 rounded-full mr-3 border-2 border-white"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://ui-avatars.com/api/?name=${chatData.user.name.replace(/ /g, '+')}`;
            }}
          />
          <div>
            <h2 className="font-bold text-lg">{chatData.user.name}</h2>
            <p className="text-sm text-purple-100">@{chatData.user.username}</p>
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chatData.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Send size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">No messages yet</h3>
            <p className="text-gray-500 mb-6">Send your first message to start a conversation with @{chatData.user.username}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatData.messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                timestamp={message.timestamp}
                isSender={message.senderId === currentUser.id}
                senderName={message.senderId !== currentUser.id ? chatData.user.name : undefined}
                senderAvatar={message.senderId !== currentUser.id ? chatData.user.avatar : undefined}
                status={message.read ? 'read' : 'delivered'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      {showAudioRecorder ? (
        <AudioRecorder
          onAudioReady={handleAudioRecorded}
          onCancel={() => setShowAudioRecorder(false)}
        />
      ) : (
        <form onSubmit={handleSendMessage} className="p-3 border-t flex items-center bg-white">
          <div className="flex items-center bg-gray-100 rounded-xl flex-1 px-3 py-2">
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-purple-600 p-1"
            >
              <Smile size={24} />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:outline-none px-2"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <div className="flex space-x-1">
              <button 
                type="button" 
                onClick={() => setShowAudioRecorder(true)}
                className="text-gray-500 hover:text-purple-600 p-1"
              >
                <Mic size={24} />
              </button>
              <button 
                type="button" 
                onClick={() => setShowGifPicker(true)}
                className="text-gray-500 hover:text-purple-600 p-1"
              >
                <Image size={24} />
              </button>
              <button 
                type="button" 
                onClick={() => setShowMemeCreator(true)}
                className="text-gray-500 hover:text-purple-600 p-1"
              >
                <Paperclip size={24} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="ml-2 bg-purple-600 text-white p-3 rounded-full disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      )}
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-0 z-50">
          <div 
            className="fixed inset-0"
            onClick={() => setShowEmojiPicker(false)}
          ></div>
          <div className="relative">
            <EmojiPicker onEmojiClick={handleEmojiSelect} />
          </div>
        </div>
      )}
      
      {/* GIF Picker */}
      {showGifPicker && (
        <GifPicker 
          onGifSelected={handleGifSelect} 
          onClose={() => setShowGifPicker(false)}
        />
      )}
      
      {/* Meme Creator */}
      {showMemeCreator && (
        <MemeCreator
          onClose={() => setShowMemeCreator(false)}
          onMemeCreated={handleMemeCreated}
        />
      )}
    </div>
  );
};

export default SingleChat;
