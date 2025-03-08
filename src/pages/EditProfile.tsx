import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FileUploader from '../components/FileUploader';

const EditProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!currentUser) return;
    
    setName(currentUser.name || '');
    setUsername(currentUser.username || '');
    setBio(currentUser.bio || '');
    setAvatar(currentUser.avatar || '');
  }, [currentUser]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !username) {
      toast.error('Name and username are required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updates = {
        name,
        username,
        bio,
        avatar
      };
      
      if (supabase && currentUser) {
        // Update in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({
            name,
            username,
            bio,
            avatar_url: avatar
          })
          .eq('id', currentUser.id);
        
        if (error) throw error;
      }
      
      // Update in local context
      updateProfile(updates);
      toast.success('Profile updated successfully');
      navigate(`/profile/${username}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAvatarUpload = (url: string) => {
    setAvatar(url);
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b flex items-center">
        <button 
          onClick={() => navigate(`/profile/${currentUser.username}`)}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-4">
            <FileUploader
              type="avatar"
              initialPreview={avatar}
              onUploadComplete={handleAvatarUpload}
              bucketName="avatars"
              folderPath={`user_${currentUser.id}`}
            />
          </div>
          <p className="text-sm text-gray-500">Upload a profile picture</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">@</span>
              <input
                type="text"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={250}
            ></textarea>
            <p className="text-xs text-gray-500 text-right mt-1">
              {bio.length}/250 characters
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => navigate(`/profile/${currentUser.username}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
          >
            {isLoading ? 'Saving...' : (
              <>
                <Save size={18} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
