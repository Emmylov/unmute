import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface StoryUploaderProps {
  onStoryCreated: () => void;
}

const StoryUploader = ({ onStoryCreated }: StoryUploaderProps) => {
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      // Create a data URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Error processing image');
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (!preview) {
      toast.error('Please add an image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create story in localStorage
      const stories = JSON.parse(localStorage.getItem('stories') || '[]');
      const newStory = {
        id: `story-${uuidv4()}`,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        media: preview,
        caption: caption,
        createdAt: Date.now(),
        mediaType: 'image',
        viewed: false
      };

      stories.push(newStory);
      localStorage.setItem('stories', JSON.stringify(stories));

      toast.success('Story created!');
      setPreview(null);
      setCaption('');
      setIsExpanded(false);
      onStoryCreated();
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex flex-col items-center space-y-1 flex-shrink-0"
      >
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 p-0.5 flex items-center justify-center relative">
          <img 
            src={currentUser.avatar} 
            alt="Your Story" 
            className="w-full h-full object-cover rounded-full border-2 border-white dark:border-gray-800"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://ui-avatars.com/api/?name=${currentUser.name.replace(/ /g, '+')}`;
            }}
          />
          <div className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
            <Camera size={16} />
          </div>
        </div>
        <span className="text-xs">Your Story</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium">Create Story</h2>
          <button onClick={() => setIsExpanded(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {preview ? (
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://via.placeholder.com/400x400?text=Image+Error';
                }}
              />
              <button
                onClick={() => setPreview(null)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Camera className="h-10 w-10 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-600">Upload a photo for your story</p>
              <label className="mt-4 inline-block file-input-label">
                Browse Files
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </label>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Add caption (optional)
            </label>
            <textarea
              className="w-full border dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mr-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!preview || isSubmitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Share to Story'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryUploader;
