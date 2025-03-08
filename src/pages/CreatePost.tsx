import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import { savePost, CAUSES } from '../utils/data';
import { toast } from 'react-hot-toast';
import { Share } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import { v4 as uuidv4 } from 'uuid';

const CreatePost = () => {
  const { currentUser } = useAuth();
  const { supabase } = useSupabase();
  const [content, setContent] = useState('');
  const [cause, setCause] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | ''>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  if (!currentUser) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please write something in your post');
      return;
    }
    
    if (!cause) {
      toast.error('Please select a cause for your post');
      return;
    }
    
    setLoading(true);
    
    try {
      const postId = `post-${uuidv4()}`;
      
      if (supabase) {
        // Create post in Supabase
        const { error } = await supabase
          .from('posts')
          .insert({
            id: postId,
            user_id: currentUser.id,
            content: content.trim(),
            cause_id: cause,
            media_url: mediaUrl || null,
            media_type: mediaType || null,
          });
        
        if (error) throw error;
      } else {
        // Fallback to localStorage
        const newPost = {
          id: postId,
          userId: currentUser.id,
          username: currentUser.username,
          name: currentUser.name,
          userAvatar: currentUser.avatar,
          content: content.trim(),
          cause,
          likes: [],
          comments: [],
          createdAt: Date.now()
        };
        
        if (mediaUrl) {
          newPost.image = mediaUrl;
          newPost.mediaType = mediaType;
        }
        
        savePost(newPost);
      }
      
      toast.success('Post created successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMediaUpload = (url: string) => {
    setMediaUrl(url);
    
    // Determine media type based on file extension
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      setMediaType('image');
    } else if (url.match(/\.(mp4|mov|wmv|avi|flv|mkv|webm)$/i)) {
      setMediaType('video');
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>
      
      <div className="bg-white rounded-xl shadow p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              placeholder="What do you want to share?"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <FileUploader
              type="media"
              onUploadComplete={handleMediaUpload}
              bucketName="posts"
              folderPath={`user_${currentUser.id}`}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a cause:
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
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                toast.success('Share functionality coming soon!');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Share size={18} className="mr-2" />
              Share
            </button>
            
            <div>
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
