import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CAUSES, getPosts, Post } from '../utils/data';
import PostCard from '../components/PostCard';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCause, setSelectedCause] = useState(searchParams.get('cause') || '');
  const [posts, setPosts] = useState<Post[]>([]);
  
  const loadPosts = () => {
    const allPosts = getPosts();
    
    if (selectedCause) {
      setPosts(allPosts.filter(post => post.cause === selectedCause));
    } else {
      setPosts(allPosts);
    }
  };
  
  useEffect(() => {
    loadPosts();
  }, [selectedCause]);
  
  const handleCauseSelect = (causeId: string) => {
    setSelectedCause(causeId === selectedCause ? '' : causeId);
    
    if (causeId === selectedCause) {
      searchParams.delete('cause');
    } else {
      searchParams.set('cause', causeId);
    }
    
    setSearchParams(searchParams);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Explore Causes</h1>
      
      <div className="mb-6 flex gap-2 overflow-x-auto py-2">
        {CAUSES.map((cause) => (
          <button
            key={cause.id}
            onClick={() => handleCauseSelect(cause.id)}
            className={`flex items-center px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCause === cause.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">{cause.icon}</span>
            {cause.name}
          </button>
        ))}
      </div>
      
      {selectedCause && (
        <div className="bg-white rounded-xl p-4 mb-4">
          <h2 className="text-xl font-bold mb-1">
            {CAUSES.find(c => c.id === selectedCause)?.name}
          </h2>
          <p className="text-gray-600">
            {CAUSES.find(c => c.id === selectedCause)?.description}
          </p>
        </div>
      )}
      
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard key={post.id} post={post} onUpdate={loadPosts} />
        ))
      ) : (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No posts found</h3>
          <p className="text-gray-500">
            {selectedCause 
              ? "There are no posts for this cause yet. Be the first to post!"
              : "No posts available. Start following causes or create your first post!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Explore;
