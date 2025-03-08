import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUsers } from '../utils/data';
import FollowersList from './FollowersList';

interface ProfileStatsProps {
  username: string;
  postsCount: number;
}

const ProfileStats = ({ username, postsCount }: ProfileStatsProps) => {
  const { currentUser } = useAuth();
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  
  if (!currentUser) return null;
  
  // Get user data to display stats
  const allUsers = getUsers();
  const targetUser = username === currentUser.username 
    ? currentUser
    : allUsers.find(u => u.username === username);
  
  if (!targetUser) return null;
  
  // Calculate followers count - users who follow this profile
  const followersCount = allUsers.filter(u => 
    u.followingUsers && u.followingUsers.includes(targetUser.id)
  ).length;
  
  // Following count
  const followingCount = targetUser.followingUsers?.length || 0;
  
  return (
    <div className="flex space-x-10 mb-4">
      <div className="text-center">
        <div className="font-bold">{postsCount}</div>
        <div className="text-sm text-gray-500">Posts</div>
      </div>
      
      <button 
        className="text-center focus:outline-none"
        onClick={() => setShowFollowersList(true)}
      >
        <div className="font-bold">{followersCount}</div>
        <div className="text-sm text-gray-500">Followers</div>
      </button>
      
      <button 
        className="text-center focus:outline-none"
        onClick={() => setShowFollowingList(true)}
      >
        <div className="font-bold">{followingCount}</div>
        <div className="text-sm text-gray-500">Following</div>
      </button>
      
      {showFollowersList && (
        <FollowersList 
          username={username}
          type="followers"
          onClose={() => setShowFollowersList(false)}
        />
      )}
      
      {showFollowingList && (
        <FollowersList 
          username={username}
          type="following"
          onClose={() => setShowFollowingList(false)}
        />
      )}
    </div>
  );
};

export default ProfileStats;
