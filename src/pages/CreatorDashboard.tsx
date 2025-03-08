import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChartBar, BookOpen, Camera, Pencil, FileImage, Film, ChartLine, MessageSquare, PenLine, Settings, Sparkles, Tv, UserPlus, Video, Wand } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getPosts, getReels, getLiveStreams } from '../utils/data';
import AiContentHelper from '../components/AiContentHelper';

const CreatorDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'analytics' | 'ai'>('overview');
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [aiContentType, setAiContentType] = useState<'caption' | 'ideas' | 'hashtags'>('caption');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    reels: 0,
    livestreams: 0,
    followers: 0,
    views: 0,
    engagement: 0,
    impressions: 0,
    growth: 0
  });

  useEffect(() => {
    if (!currentUser) return;

    // Simulate loading user stats
    setIsLoading(true);
    
    try {
      // Get user content counts
      const userPosts = getPosts().filter(post => post.userId === currentUser.id);
      const userReels = getReels().filter(reel => reel.userId === currentUser.id);
      const userStreams = getLiveStreams().filter(stream => stream.userId === currentUser.id);
      
      // Get follower count
      const followers = currentUser.subscribers?.length || 0;
      
      // Calculate some example metrics
      const totalLikes = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
      const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
      const engagement = userPosts.length > 0 ? 
        ((totalLikes + totalComments) / userPosts.length).toFixed(1) : 
        0;
      
      // Set stats with actual and simulated data
      setStats({
        posts: userPosts.length,
        reels: userReels.length,
        livestreams: userStreams.length,
        followers: followers,
        views: (followers * 2) + Math.floor(Math.random() * 200),
        engagement: Number(engagement),
        impressions: followers * 5 + Math.floor(Math.random() * 500),
        growth: Math.floor(Math.random() * 10) + 1
      });
    } catch (error) {
      console.error('Error loading creator stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const openAiHelper = (contentType: 'caption' | 'ideas' | 'hashtags') => {
    setAiContentType(contentType);
    setShowAiHelper(true);
  };

  if (!currentUser) return null;

  return (
    <div className="pb-6">
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-16 h-16 rounded-full border-4 border-white mr-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://ui-avatars.com/api/?name=${currentUser.name.replace(/ /g, '+')}`;
              }}
            />
            <div>
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-purple-100">@{currentUser.username}</p>
            </div>
          </div>
          <Link to="/profile/edit" className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg px-4 py-2 transition-all">
            <Settings size={18} className="mr-2" />
            Settings
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-purple-100 text-sm">Followers</p>
            <div className="flex items-end">
              <h3 className="text-2xl font-bold">{stats.followers}</h3>
              <span className="text-green-300 text-sm ml-2 flex items-center">
                +{stats.growth}%
              </span>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-purple-100 text-sm">Posts</p>
            <h3 className="text-2xl font-bold">{stats.posts}</h3>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-purple-100 text-sm">Reels</p>
            <h3 className="text-2xl font-bold">{stats.reels}</h3>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-purple-100 text-sm">Livestreams</p>
            <h3 className="text-2xl font-bold">{stats.livestreams}</h3>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`flex-1 py-4 px-2 text-center font-medium ${
              activeTab === 'overview' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('content')} 
            className={`flex-1 py-4 px-2 text-center font-medium ${
              activeTab === 'content' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'
            }`}
          >
            Content Tools
          </button>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`flex-1 py-4 px-2 text-center font-medium ${
              activeTab === 'analytics' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'
            }`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('ai')} 
            className={`flex-1 py-4 px-2 text-center font-medium ${
              activeTab === 'ai' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'
            }`}
          >
            AI Tools
          </button>
        </div>
        
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Creator Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="stat-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-500">Total Views</h3>
                    <ChartLine size={18} className="text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold">{stats.views.toLocaleString()}</p>
                  <p className="metric-up">↑ 12% from last week</p>
                </div>
                
                <div className="stat-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-500">Engagement Rate</h3>
                    <ChartBar size={18} className="text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold">{stats.engagement}%</p>
                  <p className="metric-up">↑ 3% from last week</p>
                </div>
                
                <div className="stat-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-500">Impressions</h3>
                    <ChartLine size={18} className="text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold">{stats.impressions.toLocaleString()}</p>
                  <p className="metric-down">↓ 2% from last week</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white rounded-xl shadow-sm p-4">
                  <h3 className="font-medium text-gray-500 mb-4">Recent Performance</h3>
                  <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Performance chart will appear here</p>
                  </div>
                </div>
                
                <div className="flex-1 bg-white rounded-xl shadow-sm p-4">
                  <h3 className="font-medium text-gray-500 mb-4">Getting Started</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                        <PenLine size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Complete your profile</p>
                        <p className="text-sm text-gray-500">Add a bio and profile image to increase engagement</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                        <MessageSquare size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Create your first post</p>
                        <p className="text-sm text-gray-500">Share your thoughts with your audience</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                        <UserPlus size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Grow your audience</p>
                        <p className="text-sm text-gray-500">Find and connect with users who share your interests</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Content Tools Tab */}
          {activeTab === 'content' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Content Creation Tools</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Link to="/create" className="tool-item">
                  <div className="tool-icon">
                    <Pencil size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Create Post</h3>
                </Link>
                
                <Link to="/reels/create" className="tool-item">
                  <div className="tool-icon">
                    <Video size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Create Reel</h3>
                </Link>
                
                <Link to="/live/create" className="tool-item">
                  <div className="tool-icon">
                    <Tv size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Go Live</h3>
                </Link>
                
                <div 
                  className="tool-item"
                  onClick={() => toast.success('Story creator will open')}
                >
                  <div className="tool-icon">
                    <Camera size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Create Story</h3>
                </div>
                
                <div 
                  className="tool-item"
                  onClick={() => toast.success('Poll creator will open')}
                >
                  <div className="tool-icon">
                    <ChartBar size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Create Poll</h3>
                </div>
                
                <div 
                  className="tool-item"
                  onClick={() => toast.success('Meme creator will open')}
                >
                  <div className="tool-icon">
                    <FileImage size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Create Meme</h3>
                </div>
                
                <div 
                  className="tool-item"
                  onClick={() => toast.success('Interactive guide will open')}
                >
                  <div className="tool-icon">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Content Guides</h3>
                </div>
                
                <div 
                  className="tool-item"
                  onClick={() => setActiveTab('ai')}
                >
                  <div className="tool-icon">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-sm font-medium">AI Assistance</h3>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">Content Creation Tips</h3>
                <div className="space-y-3">
                  <div className="tooltip tooltip-top">
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                        <Film size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Create engaging reels</p>
                        <p className="text-sm text-gray-600">Short-form videos get 53% more engagement</p>
                      </div>
                    </div>
                    <div className="tooltip-content">
                      <p>Tips for great reels:</p>
                      <ul className="list-disc pl-5 mt-1 text-xs">
                        <li>Keep videos between 15-30 seconds</li>
                        <li>Start with a hook in the first 3 seconds</li>
                        <li>Use trending music or sounds</li>
                        <li>Add text overlays for accessibility</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="tooltip tooltip-top">
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                        <MessageSquare size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Ask questions in your posts</p>
                        <p className="text-sm text-gray-600">Increases comment rate by up to 85%</p>
                      </div>
                    </div>
                    <div className="tooltip-content">
                      <p>Engagement-boosting questions:</p>
                      <ul className="list-disc pl-5 mt-1 text-xs">
                        <li>Ask for opinions on a trending topic</li>
                        <li>Create "This or That" scenarios</li>
                        <li>Ask about personal experiences</li>
                        <li>Request feedback or suggestions</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="tooltip tooltip-top">
                    <div className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-2 mr-3 mt-1">
                        <Camera size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Post consistently</p>
                        <p className="text-sm text-gray-600">Regular posting increases follower growth by 30%</p>
                      </div>
                    </div>
                    <div className="tooltip-content">
                      <p>Posting schedule tips:</p>
                      <ul className="list-disc pl-5 mt-1 text-xs">
                        <li>Aim for 3-5 posts per week</li>
                        <li>Post stories daily for maximum visibility</li>
                        <li>Schedule posts for peak engagement times</li>
                        <li>Create a content calendar to stay organized</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Content Analytics</h2>
              
              <div className="bg-white border rounded-xl p-4 mb-6">
                <h3 className="font-medium text-gray-500 mb-4">Content Performance</h3>
                <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Performance chart will appear here</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-xl p-4">
                  <h3 className="font-medium text-gray-500 mb-4">Top Performing Content</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="flex items-center border-b pb-3">
                        <img 
                          src={`https://source.unsplash.com/random/100x100?sig=${index}`} 
                          alt="Content thumbnail" 
                          className="w-12 h-12 rounded-md object-cover mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Post #{index + 1}</p>
                          <p className="text-xs text-gray-500">Posted {index + 2} days ago</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{Math.floor(Math.random() * 100) + 50} likes</p>
                          <p className="text-xs text-gray-500">{Math.floor(Math.random() * 20) + 5} comments</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border rounded-xl p-4">
                  <h3 className="font-medium text-gray-500 mb-4">Audience Demographics</h3>
                  <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <p className="text-gray-400">Demographics chart will appear here</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">Age Range</p>
                      <p className="text-gray-500">25-34 (40%)</p>
                    </div>
                    <div>
                      <p className="font-medium">Gender</p>
                      <p className="text-gray-500">Female (55%)</p>
                    </div>
                    <div>
                      <p className="font-medium">Top Location</p>
                      <p className="text-gray-500">United States</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* AI Tools Tab */}
          {activeTab === 'ai' && (
            <div>
              <h2 className="text-xl font-bold mb-4">AI Assisted Creation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div 
                  className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => openAiHelper('caption')}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg">
                      <PenLine size={24} />
                    </div>
                    <Sparkles className="text-yellow-500" size={16} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Caption Generator</h3>
                  <p className="text-gray-600 text-sm">Create engaging captions for your posts automatically</p>
                </div>
                
                <div 
                  className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => openAiHelper('ideas')}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-lg">
                      <Sparkles size={24} />
                    </div>
                    <Sparkles className="text-yellow-500" size={16} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Content Ideas</h3>
                  <p className="text-gray-600 text-sm">Generate trending content ideas for your audience</p>
                </div>
                
                <div 
                  className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => openAiHelper('hashtags')}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-lg">
                      <Wand size={24} />
                    </div>
                    <Sparkles className="text-yellow-500" size={16} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Hashtag Suggestions</h3>
                  <p className="text-gray-600 text-sm">Get optimized hashtags to increase your reach</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
                    <Sparkles size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">AI-Powered Content Creation</h3>
                    <p className="text-gray-700 mb-4">Our AI tools help you create better content with less effort. Try generating captions, ideas, or hashtags to enhance your posts.</p>
                    <button 
                      onClick={() => setShowAiHelper(true)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      Try AI Assistant
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-medium mb-4">Trending Topics</h3>
                  <div className="space-y-3">
                    {['Climate Action', 'Equality Movements', 'Education Access', 'Health Advocacy', 'Community Building'].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border-b">
                        <p>{topic}</p>
                        <span className="text-xs text-gray-500">+{Math.floor(Math.random() * 100) + 20}% trending</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-medium mb-4">Popular Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['#ClimateAction', '#EqualityNow', '#EducationForAll', '#HealthForAll', '#CommunityMatters', 
                      '#SustainableFuture', '#Advocacy', '#SocialJustice', '#Activism', '#ChangeTheWorld'].map((tag, index) => (
                      <span key={index} className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Content Helper Modal */}
      {showAiHelper && (
        <AiContentHelper 
          contentType={aiContentType} 
          onClose={() => setShowAiHelper(false)} 
        />
      )}
    </div>
  );
};

export default CreatorDashboard;
