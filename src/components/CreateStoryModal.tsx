import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FileUploader from './FileUploader';
import { v4 as uuidv4 } from 'uuid';

interface CreateStoryModalProps {
  onClose: () => void;
}

const CreateStoryModal = ({ onClose }: CreateStoryModalProps) => {
  const { currentUser } = useAuth();
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!currentUser) return null;
  
  const handleUploadComplete = (url: string, type: 'image' | 'video' = 'image') => {
    setMediaUrl(url);
    setMediaType(type);
  };
  
  const handleCreateStory = async () => {
    if (!mediaUrl) {
      toast.error('Please select an image or video');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create story directly in localStorage
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem('stories') || '[]');
        const newStory = {
          id: `story-${uuidv4()}`,
          userId: currentUser.id,
          username: currentUser.username,
          userAvatar: currentUser.avatar,
          media: mediaUrl,
          caption: text,
          createdAt: Date.now(),
          mediaType
        };
        
        stories.push(newStory);
        localStorage.setItem('stories', JSON.stringify(stories));
        
        toast.success('Story created successfully!');
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium">Create Story</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <FileUploader
              type="media"
              onUploadComplete={(url) => {
                const isVideo = url.match(/\.(mp4|mov|wmv|avi|flv|mkv|webm)$/i);
                handleUploadComplete(url, isVideo ? 'video' : 'image');
              }}
              bucketName="stories"
              folderPath={`user_${currentUser.id}`}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Add caption (optional)
            </label>
            <textarea
              className="w-full border dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mr-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateStory}
              disabled={!mediaUrl || isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Share to Story'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
