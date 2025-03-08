import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Camera, Music, Video } from 'lucide-react';
import { saveReel, CAUSES, fileToDataUrl } from '../utils/data';
import { toast } from 'react-hot-toast';

const CreateReel = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [caption, setCaption] = useState('');
  const [cause, setCause] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [audioName, setAudioName] = useState(`Original Audio - ${currentUser?.username || 'user'}`);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!currentUser) return null;
  
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size should be less than 100MB');
      return;
    }
    
    try {
      const dataUrl = await fileToDataUrl(file);
      setVideoPreview(dataUrl);
      setVideoFile(file);
    } catch (error) {
      toast.error('Error processing video');
      console.error(error);
    }
  };
  
  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file for the thumbnail');
      return;
    }
    
    try {
      const dataUrl = await fileToDataUrl(file);
      setThumbnailPreview(dataUrl);
      setThumbnailFile(file);
    } catch (error) {
      toast.error('Error processing thumbnail');
      console.error(error);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoPreview) {
      toast.error('Please select a video');
      return;
    }
    
    if (!caption) {
      toast.error('Please add a caption');
      return;
    }
    
    setIsLoading(true);
    
    // Use default thumbnail if none provided
    const thumbnailUrl = thumbnailPreview || 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=2574&auto=format&fit=crop';
    
    // Save the reel
    const newReel = {
      id: `reel-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      videoUrl: videoPreview,
      thumbnailUrl,
      caption,
      audio: audioName,
      likes: 0,
      comments: 0,
      createdAt: Date.now(),
      likedBy: []
    };
    
    setTimeout(() => {
      try {
        saveReel(newReel);
        toast.success('Reel created successfully!');
        navigate('/reels');
      } catch (error) {
        toast.error('Failed to create reel');
      } finally {
        setIsLoading(false);
      }
    }, 1500); // Simulate upload delay
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b flex items-center">
        <button 
          onClick={() => navigate('/reels')}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Create Reel</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Video
          </label>
          
          {videoPreview ? (
            <div className="relative rounded-lg overflow-hidden mb-2">
              <video 
                src={videoPreview} 
                className="w-full h-64 object-cover"
                controls
              />
              <button
                type="button"
                onClick={() => {
                  setVideoPreview(null);
                  setVideoFile(null);
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
              >
                <ArrowLeft size={16} className="rotate-45" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-2">
              <Video className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Upload a video for your reel</p>
              <label className="mt-4 inline-block file-input-label">
                Browse Files
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="file-input"
                />
              </label>
            </div>
          )}
          <p className="text-xs text-gray-500">
            For best results, use vertical videos with aspect ratio 9:16
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Thumbnail (Optional)
          </label>
          
          {thumbnailPreview ? (
            <div className="relative rounded-lg overflow-hidden mb-2">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail" 
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setThumbnailPreview(null);
                  setThumbnailFile(null);
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
              >
                <ArrowLeft size={16} className="rotate-45" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-2">
              <Camera className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Upload a custom thumbnail</p>
              <label className="mt-3 inline-block file-input-label">
                Browse Files
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="file-input"
                />
              </label>
            </div>
          )}
          <p className="text-xs text-gray-500">
            A thumbnail helps your reel get more views
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Write a caption for your reel..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            maxLength={2200}
          ></textarea>
          <p className="text-xs text-gray-500 text-right mt-1">
            {caption.length}/2200
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audio
          </label>
          <div className="flex items-center border rounded-lg p-3 bg-gray-50">
            <Music size={20} className="text-gray-500 mr-3" />
            <input
              type="text"
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="Add a name for your audio"
              value={audioName}
              onChange={(e) => setAudioName(e.target.value)}
            />
          </div>
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
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/reels')}
            className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !videoPreview}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : 'Post Reel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReel;
