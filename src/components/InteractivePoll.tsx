import { useState, useEffect, useRef } from 'react';
import { ChartBar, Check, Plus, RefreshCw, Sparkles, User, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { v4 as uuidv4 } from 'uuid';

interface PollOption {
  id: string;
  text: string;
  emoji?: string;
  votes: number;
  voters: string[];
}

interface Poll {
  id: string;
  userId: string;
  username: string;
  name: string;
  userAvatar: string;
  question: string;
  options: PollOption[];
  allowMultipleAnswers: boolean;
  totalVotes: number;
  expiresAt: number;
  createdAt: number;
  status: 'active' | 'ended';
  isGifPoll?: boolean;
}

interface InteractivePollProps {
  initialPoll?: Poll;
  readOnly?: boolean;
  onPollCreated?: (poll: Poll) => void;
  onPollVote?: (pollId: string, optionId: string) => void;
}

const InteractivePoll = ({ 
  initialPoll, 
  readOnly = false, 
  onPollCreated, 
  onPollVote 
}: InteractivePollProps) => {
  const { currentUser } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(initialPoll || null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<{id: string; text: string; emoji?: string; }[]>([
    { id: uuidv4(), text: '', emoji: '👍' },
    { id: uuidv4(), text: '', emoji: '👎' }
  ]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [duration, setDuration] = useState(24); // hours
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiOption, setActiveEmojiOption] = useState<string | null>(null);

  // For animated results
  const [showResults, setShowResults] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);
  const resultsTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (resultsTimeoutRef.current) {
        clearTimeout(resultsTimeoutRef.current);
      }
    };
  }, []);

  const handleEmojiSelect = (emoji: EmojiClickData) => {
    if (!activeEmojiOption) return;
    
    setOptions(options.map(option => 
      option.id === activeEmojiOption 
        ? { ...option, emoji: emoji.emoji } 
        : option
    ));
    
    setShowEmojiPicker(false);
    setActiveEmojiOption(null);
  };

  const handleAddOption = () => {
    if (options.length >= 6) {
      toast.error('Maximum 6 options allowed');
      return;
    }
    const emojis = ['😍', '🙌', '🔥', '💯', '🤔', '😎', '😂'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setOptions([...options, { id: uuidv4(), text: '', emoji: randomEmoji }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    setOptions(options.filter(option => option.id !== id));
  };

  const handleCreatePoll = () => {
    if (!currentUser) return;
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (options.some(option => !option.text.trim())) {
      toast.error('All options must have text');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newPoll: Poll = {
        id: `poll-${uuidv4()}`,
        userId: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        userAvatar: currentUser.avatar,
        question,
        options: options.map(opt => ({
          id: opt.id,
          text: opt.text,
          emoji: opt.emoji,
          votes: 0,
          voters: []
        })),
        allowMultipleAnswers: allowMultiple,
        totalVotes: 0,
        createdAt: Date.now(),
        expiresAt: Date.now() + (duration * 60 * 60 * 1000), // hours to ms
        status: 'active',
        isGifPoll: false
      };
      
      // Store poll in localStorage
      const polls = JSON.parse(localStorage.getItem('polls') || '[]');
      polls.push(newPoll);
      localStorage.setItem('polls', JSON.stringify(polls));
      
      setPoll(newPoll);
      
      // Call the callback if provided
      if (onPollCreated) {
        onPollCreated(newPoll);
      }
      
      toast.success('Poll created successfully!');
      
      // Reset form
      setQuestion('');
      setOptions([
        { id: uuidv4(), text: '', emoji: '👍' },
        { id: uuidv4(), text: '', emoji: '👎' }
      ]);
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (optionId: string) => {
    if (!poll || !currentUser) return;
    
    // Check if poll has expired
    if (poll.expiresAt < Date.now() || poll.status === 'ended') {
      toast.error('This poll has ended');
      return;
    }
    
    // Check if user has already voted in this poll
    const hasVoted = poll.options.some(opt => opt.voters.includes(currentUser.id));
    
    if (hasVoted && !poll.allowMultipleAnswers) {
      toast.error('You have already voted in this poll');
      return;
    }
    
    // Update the poll
    const updatedOptions = poll.options.map(option => {
      if (option.id === optionId) {
        return {
          ...option,
          votes: option.votes + 1,
          voters: [...option.voters, currentUser.id]
        };
      }
      return option;
    });
    
    const updatedPoll = {
      ...poll,
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1
    };
    
    // Update localStorage
    const polls = JSON.parse(localStorage.getItem('polls') || '[]');
    const pollIndex = polls.findIndex((p: Poll) => p.id === poll.id);
    
    if (pollIndex !== -1) {
      polls[pollIndex] = updatedPoll;
      localStorage.setItem('polls', JSON.stringify(polls));
    }
    
    setPoll(updatedPoll);
    
    // Call the callback if provided
    if (onPollVote) {
      onPollVote(poll.id, optionId);
    }
    
    // Show animated results
    setAnimateResults(true);
    setShowResults(true);
    
    // Reset animation after 2 seconds
    if (resultsTimeoutRef.current) {
      clearTimeout(resultsTimeoutRef.current);
    }
    
    resultsTimeoutRef.current = window.setTimeout(() => {
      setAnimateResults(false);
    }, 2000);
    
    toast.success('Vote recorded!');
  };

  // Check if poll has expired
  const isPollEnded = poll ? (poll.expiresAt < Date.now() || poll.status === 'ended') : false;
  
  // Check if user has voted
  const hasUserVoted = poll && currentUser ? poll.options.some(opt => opt.voters.includes(currentUser.id)) : false;
  
  // Should show results if poll ended, user has voted, or explicitly showing results
  const shouldShowResults = isPollEnded || hasUserVoted || showResults;

  const calculateRemainingTime = () => {
    if (!poll) return '';
    
    const now = Date.now();
    if (poll.expiresAt <= now) return 'Poll ended';
    
    const remainingMs = poll.expiresAt - now;
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    
    return `${minutes}m remaining`;
  };

  // If we're in read-only mode and have a poll to display
  if (readOnly && poll) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-4">
        <div className="flex items-center mb-3">
          <img 
            src={poll.userAvatar} 
            alt={poll.name} 
            className="w-10 h-10 rounded-full mr-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://ui-avatars.com/api/?name=${poll.name.replace(/ /g, '+')}`;
            }}
          />
          <div>
            <div className="font-medium">{poll.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Asked {new Date(poll.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="ml-auto flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">{poll.question}</h3>
        
        <div className="space-y-3 mb-3">
          {poll.options.map(option => {
            const percentage = poll.totalVotes > 0 
              ? Math.round((option.votes / poll.totalVotes) * 100) 
              : 0;
            
            const isVoted = currentUser && option.voters.includes(currentUser.id);
            
            return (
              <div key={option.id} className="relative">
                <button
                  onClick={() => handleVote(option.id)}
                  disabled={isPollEnded || (hasUserVoted && !poll.allowMultipleAnswers)}
                  className={`w-full text-left p-3 rounded-lg border relative overflow-hidden transition-all ${
                    isVoted 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  {shouldShowResults && (
                    <div 
                      className={`absolute top-0 left-0 bottom-0 bg-purple-100 dark:bg-purple-900/30 ${animateResults ? 'transition-all duration-1000' : ''}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  )}
                  
                  <div className="relative flex items-center">
                    {option.emoji && (
                      <span className="text-xl mr-2">{option.emoji}</span>
                    )}
                    <span>{option.text}</span>
                    
                    {isVoted && (
                      <Check size={16} className="text-purple-600 ml-2" />
                    )}
                    
                    {shouldShowResults && (
                      <span className="ml-auto font-medium">{percentage}%</span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>{poll.allowMultipleAnswers ? 'Multiple selections allowed' : 'Select one option'}</div>
          <div>{calculateRemainingTime()}</div>
        </div>
      </div>
    );
  }

  // Create poll form
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-4">
      <div className="flex items-center mb-4">
        <Sparkles className="text-purple-500 mr-2" size={22} />
        <h2 className="text-xl font-semibold">Create a Poll</h2>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Question
        </label>
        <input
          type="text"
          className="w-full border dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Options
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">{options.length}/6 options</span>
        </div>
        
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  setActiveEmojiOption(option.id);
                  setShowEmojiPicker(true);
                }}
                className="mr-2 h-8 w-8 flex items-center justify-center border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {option.emoji || '😃'}
              </button>
              <input
                type="text"
                className="flex-1 border dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => {
                  const updatedOptions = [...options];
                  updatedOptions[index].text = e.target.value;
                  setOptions(updatedOptions);
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveOption(option.id)}
                className="ml-2 text-gray-400 hover:text-red-500 p-2"
                disabled={options.length <= 2}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={handleAddOption}
          className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
          disabled={options.length >= 6}
        >
          <Plus size={16} className="mr-1" />
          Add Option
        </button>
        
        {showEmojiPicker && (
          <div className="absolute z-50 mt-2">
            <div 
              className="fixed inset-0"
              onClick={() => setShowEmojiPicker(false)}
            ></div>
            <div className="relative">
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                width={300}
                height={400}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="allowMultiple"
            checked={allowMultiple}
            onChange={() => setAllowMultiple(!allowMultiple)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="allowMultiple" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Allow multiple answers
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Poll Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full border dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
            <option value={48}>2 days</option>
            <option value={72}>3 days</option>
            <option value={168}>1 week</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCreatePoll}
          disabled={isSubmitting}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <RefreshCw size={18} className="mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ChartBar size={18} className="mr-2" />
              Create Poll
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InteractivePoll;
