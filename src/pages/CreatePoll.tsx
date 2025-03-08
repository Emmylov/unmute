import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { CAUSES, savePoll } from '../utils/data';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface PollOption {
  id: string;
  text: string;
}

const CreatePoll = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: uuidv4(), text: '' },
    { id: uuidv4(), text: '' }
  ]);
  const [cause, setCause] = useState('');
  const [duration, setDuration] = useState<number>(24);
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!currentUser) return null;
  
  const handleAddOption = () => {
    if (options.length >= 10) {
      toast.error('Maximum 10 options allowed');
      return;
    }
    
    setOptions([...options, { id: uuidv4(), text: '' }]);
  };
  
  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    
    setOptions(options.filter(opt => opt.id !== id));
  };
  
  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate poll
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (options.some(opt => !opt.text.trim())) {
      toast.error('All options must have text');
      return;
    }
    
    if (new Set(options.map(opt => opt.text.trim())).size !== options.length) {
      toast.error('All options must be unique');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newPoll = {
        id: `poll-${uuidv4()}`,
        userId: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        userAvatar: currentUser.avatar,
        question,
        options: options.map(opt => ({ id: opt.id, text: opt.text, votes: 0, voters: [] })),
        cause: cause || undefined,
        totalVotes: 0,
        isAnonymous,
        allowMultipleAnswers,
        createdAt: Date.now(),
        expiresAt: Date.now() + (duration * 60 * 60 * 1000), // Convert hours to milliseconds
        status: 'active'
      };
      
      // Save the poll
      savePoll(newPoll);
      toast.success('Poll created successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b flex items-center">
        <button 
          onClick={() => navigate('/home')}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Create Poll</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Poll Question <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Poll Options <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-500">{options.length}/10 options</span>
          </div>
          
          <div className="space-y-3 mb-3">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center">
                <span className="mr-2 text-sm font-medium w-6 text-gray-500">{index + 1}.</span>
                <input
                  type="text"
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(option.id)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                  disabled={options.length <= 2}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={handleAddOption}
            className="text-purple-600 hover:text-purple-700 flex items-center text-sm font-medium"
            disabled={options.length >= 10}
          >
            <Plus size={16} className="mr-1" />
            Add Option
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a cause (optional):
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CAUSES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCause(c.id)}
                className={`flex items-center px-3 py-2 rounded-lg border ${
                  cause === c.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl mr-2">{c.icon}</span>
                <span className="text-sm">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Poll Duration
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
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
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowMultiple"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={allowMultipleAnswers}
                onChange={(e) => setAllowMultipleAnswers(e.target.checked)}
              />
              <label htmlFor="allowMultiple" className="ml-2 block text-sm text-gray-700">
                Allow multiple answers
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                Anonymous poll (hide voter identities)
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Create Poll
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;
