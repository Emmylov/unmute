import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Camera, Cog, Pencil, Share2, UserPlus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProfileStats from './ProfileStats';
import FollowersList from './FollowersList';
import FileUploader from './FileUploader';

interface ProfileHeaderProps {
  profileUser: any;
  isCurrentUser: boolean;
  postsCount: number;
  onProfileUpdate?: () => void;
}

const ProfileHeader = ({ profileUser, isCurrentUser, postsCount, onProfileUpdate }: ProfileHeaderProps) => {
  const { currentUser, followUser, unfollowUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profileUser.name || '');
  const [bio, setBio] = useState(profileUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profileUser.avatar || '');
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [listType, setListType] = useState<'followers' | 'following'>('followers');
  
  const isFollowing = currentUser?.followingUsers?.includes(profileUser.id) || false;
  
  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(profileUser.id);
      toast.success(`Unfollowed ${profileUser.name}`);
    } else {
      followUser(profileUser.id);
      toast.success(`Following ${profileUser.name}`);
    }
  };
  
  const handleUpdateProfile = () => {
    if (!currentUser) return;
    
    updateProfile({
      name,
      bio,
      avatar: avatarUrl
    });
    
    setIsEditing(false);
    toast.success('Profile updated successfully!');
    if (onProfileUpdate) onProfileUpdate();
  };
  
  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };
  
  const showFollowers = () => {
    setListType('followers');
    setShowFollowersList(true);
  };
  
  const showFollowing = () => {
    setListType('following');
    setShowFollowingList(true);
  };
  
  return (
    <>
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-purple-400 to-purple-600 relative">
        {isCurrentUser && (
          <button 
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
            onClick={() => {
              toast.success('Cover photo functionality coming soon!');
            }}
          >
            <Camera size={18} className="text-purple-600" />
          </button>
        )}
      </div>
      
      <div className="px-6 pb-6 relative">
        {/* Profile Picture */}
        <div className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
          {isEditing ? (
            <FileUploader
              type="avatar"
              initialPreview={avatarUrl}
              onUploadComplete={handleAvatarUpload}
              bucketName="avatars"
              folderPath={`user_${currentUser?.id}`}
            />
          ) : (
            <img 
              src={profileUser.avatar} 
              alt={profileUser.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://ui-avatars.com/api/?name=${profileUser.name.replace(/ /g, '+')}`;
              }}
            />
          )}
        </div>
        
        {/* Profile Actions */}
        <div className="flex justify-end mt-2">
          {isCurrentUser ? (
            isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <X size={16} className="mr-1 inline" />
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Pencil size={16} className="mr-1" />
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 border rounded-lg hover:bg-gray-50"
                >
                  <Cog size={18} />
                </button>
              </div>
            )
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isFollowing
                    ? 'border border-gray-300 hover:bg-gray-50'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                <UserPlus size={16} className="mr-1" />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={() => navigate(`/chat/${profileUser.username}`)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Message
              </button>
              <button
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                <Bell size={18} />
              </button>
              <button
                className="p-2 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Profile link copied to clipboard!');
                }}
              >
                <Share2 size={18} />
              </button>
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="mt-8">
          {isEditing ? (
            <input
              type="text"
              className="text-2xl font-bold mb-1 border-b pb-1 focus:outline-none focus:border-purple-500 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <h1 className="text-2xl font-bold">{profileUser.name}</h1>
          )}
          <p className="text-gray-500 mb-2">@{profileUser.username}</p>
          
          {isEditing ? (
            <textarea
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 mb-3"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={250}
            ></textarea>
          ) : (
            <p className="text-gray-700 mb-3">
              {profileUser.bio || 'No bio yet.'}
            </p>
          )}
          
          {/* Stats */}
          <ProfileStats 
            username={profileUser.username}
            postsCount={postsCount}
            onFollowersClick={showFollowers}
            onFollowingClick={showFollowing}
          />
          
          {/* Followed Causes */}
          {profileUser.followingCauses && profileUser.followingCauses.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Causes {isCurrentUser ? 'You' : 'They'} Follow</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.followingCauses.map((causeId: string) => {
                  const cause = profileUser.causes?.find((c: any) => c.id === causeId);
                  return cause ? (
                    <span 
                      key={cause.id} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white" 
                      style={{ backgroundColor: cause.color.replace('bg-', '') }}
                    >
                      <span className="mr-1">{cause.icon}</span>
                      {cause.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showFollowersList && (
        <FollowersList 
          username={profileUser.username}
          type="followers"
          onClose={() => setShowFollowersList(false)}
        />
      )}
      
      {showFollowingList && (
        <FollowersList 
          username={profileUser.username}
          type="following"
          onClose={() => setShowFollowingList(false)}
        />
      )}
    </>
  );
};

export default ProfileHeader;
