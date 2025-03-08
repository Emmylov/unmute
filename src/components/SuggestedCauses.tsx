import { useState } from 'react';
import { CAUSES } from '../utils/data';
import { useAuth } from '../contexts/AuthContext';

const SuggestedCauses = () => {
  const { currentUser, followCause, unfollowCause } = useAuth();
  const [activeTab, setActiveTab] = useState<'suggested' | 'following'>('suggested');

  if (!currentUser) return null;

  const userFollowing = currentUser.followingCauses || [];
  const suggestedCauses = CAUSES.filter(cause => !userFollowing.includes(cause.id));
  const followingCauses = CAUSES.filter(cause => userFollowing.includes(cause.id));

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6 sticky top-4">
      <div className="flex justify-between mb-4">
        <button 
          className={`px-3 py-2 text-sm font-medium rounded-lg ${
            activeTab === 'suggested' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('suggested')}
        >
          Suggested Causes
        </button>
        <button 
          className={`px-3 py-2 text-sm font-medium rounded-lg ${
            activeTab === 'following' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>
      
      <div className="space-y-3">
        {activeTab === 'suggested' ? (
          suggestedCauses.length > 0 ? suggestedCauses.map(cause => (
            <div key={cause.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{cause.icon}</span>
                <div>
                  <h3 className="font-medium">{cause.name}</h3>
                  <p className="text-sm text-gray-500">{cause.description}</p>
                </div>
              </div>
              <button 
                onClick={() => followCause(cause.id)}
                className="text-sm bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700"
              >
                Follow
              </button>
            </div>
          )) : (
            <p className="text-gray-500 text-center py-4">No suggestions right now. You're following all causes!</p>
          )
        ) : (
          followingCauses.length > 0 ? followingCauses.map(cause => (
            <div key={cause.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{cause.icon}</span>
                <div>
                  <h3 className="font-medium">{cause.name}</h3>
                  <p className="text-sm text-gray-500">{cause.description}</p>
                </div>
              </div>
              <button 
                onClick={() => unfollowCause(cause.id)}
                className="text-sm border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100"
              >
                Unfollow
              </button>
            </div>
          )) : (
            <p className="text-gray-500 text-center py-4">You're not following any causes yet.</p>
          )
        )}
      </div>
    </div>
  );
};

export default SuggestedCauses;
