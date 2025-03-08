import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CAUSES } from '../utils/data';
import { toast } from 'react-hot-toast';
import { ArrowRight, Bell, Camera, Check, Heart, House, MessageCircle, Plus, Search, Settings, Share2, User, Video } from 'lucide-react';
import FileUploader from '../components/FileUploader';

// Interface for tutorial highlights
interface TutorialHighlight {
  element: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const Onboarding = () => {
  const { currentUser, updateProfile, completeTutorial } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');
  const [profileComplete, setProfileComplete] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [notificationPreferences, setNotificationPreferences] = useState({
    likes: true,
    comments: true,
    newFollowers: true,
    mentions: true,
    directMessages: true
  });
  const [displayName, setDisplayName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  
  // Tutorial highlights information
  const tutorialHighlights: TutorialHighlight[] = [
    {
      element: '.home-icon',
      title: 'House Feed',
      description: 'Your personalized feed shows posts from causes you follow and people you\'re interested in.',
      position: 'right'
    },
    {
      element: '.explore-icon',
      title: 'Explore',
      description: 'Discover new content, causes, and connect with other activists.',
      position: 'right'
    },
    {
      element: '.create-icon',
      title: 'Create',
      description: 'Share your thoughts, photos, or videos to spread awareness about causes you care about.',
      position: 'top'
    },
    {
      element: '.reels-icon',
      title: 'Reels',
      description: 'Watch and create short videos to engage with the community.',
      position: 'left'
    },
    {
      element: '.profile-icon',
      title: 'Profile',
      description: 'Manage your profile, posts, and settings.',
      position: 'left'
    }
  ];
  
  // Mock elements for tutorial
  useEffect(() => {
    // Only create mock elements if tutorial is active
    if (showTutorial) {
      // Remove any existing mock elements first
      const existingMock = document.getElementById('tutorial-mock-nav');
      if (existingMock) {
        existingMock.remove();
      }
      
      // Create mock navigation for tutorial
      const mockNav = document.createElement('div');
      mockNav.id = 'tutorial-mock-nav';
      mockNav.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex items-center justify-center space-x-8 z-50';
      
      // Create HTML for navigation icons (using string for icon elements)
      mockNav.innerHTML = `
        <div class="home-icon flex flex-col items-center">
          <span class="lucide-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </span>
          <span class="text-xs mt-1">House</span>
        </div>
        <div class="explore-icon flex flex-col items-center">
          <span class="lucide-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <span class="text-xs mt-1">Explore</span>
        </div>
        <div class="create-icon flex flex-col items-center">
          <span class="lucide-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </span>
          <span class="text-xs mt-1">Create</span>
        </div>
        <div class="reels-icon flex flex-col items-center">
          <span class="lucide-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
          </span>
          <span class="text-xs mt-1">Reels</span>
        </div>
        <div class="profile-icon flex flex-col items-center">
          <span class="lucide-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <span class="text-xs mt-1">Profile</span>
        </div>
      `;
      
      document.body.appendChild(mockNav);
      
      // Clean up when component unmounts or tutorial ends
      return () => {
        if (document.getElementById('tutorial-mock-nav')) {
          document.getElementById('tutorial-mock-nav')?.remove();
        }
      };
    }
  }, [showTutorial, tutorialStep]);
  
  if (!currentUser) return null;
  
  const handleCauseToggle = (causeId: string) => {
    if (selectedCauses.includes(causeId)) {
      setSelectedCauses(selectedCauses.filter(id => id !== causeId));
    } else {
      setSelectedCauses([...selectedCauses, causeId]);
    }
  };
  
  const handleNext = () => {
    if (step === 1 && selectedCauses.length === 0) {
      toast.error('Please select at least one cause you care about');
      return;
    }
    
    if (step === 2 && !avatarUrl) {
      toast.error('Please upload a profile picture or use the default');
      return;
    }
    
    if (step === 3 && !bio.trim()) {
      toast.error('Please add a short bio about yourself');
      return;
    }
    
    if (step === 4 && (!displayName.trim() || !username.trim())) {
      toast.error('Please provide both display name and username');
      return;
    }
    
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Start tutorial
      setShowTutorial(true);
    }
  };
  
  const handleTutorialNext = () => {
    if (tutorialStep < tutorialHighlights.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      // Complete tutorial
      setShowTutorial(false);
      
      // Save profile
      updateProfile({
        followingCauses: selectedCauses,
        bio,
        avatar: avatarUrl,
        name: displayName,
        username
      });
      
      // Mark tutorial as completed
      completeTutorial();
      
      setProfileComplete(true);
      toast.success('Profile created successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/home`);
      }, 2000);
    }
  };
  
  const handleSkipTutorial = () => {
    setShowTutorial(false);
    
    // Save profile
    updateProfile({
      followingCauses: selectedCauses,
      bio,
      avatar: avatarUrl,
      name: displayName,
      username
    });
    
    // Mark tutorial as completed
    completeTutorial();
    
    setProfileComplete(true);
    toast.success('Profile created successfully!');
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate(`/home`);
    }, 2000);
  };

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };
  
  // Render tutorial overlay
  const renderTutorial = () => {
    const currentHighlight = tutorialHighlights[tutorialStep];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl p-6 max-w-md">
          <h3 className="text-xl font-bold mb-2">{currentHighlight.title}</h3>
          <p className="text-gray-600 mb-4">{currentHighlight.description}</p>
          <div className="flex justify-between">
            <button
              onClick={handleSkipTutorial}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip tutorial
            </button>
            <button
              onClick={handleTutorialNext}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              {tutorialStep < tutorialHighlights.length - 1 ? 'Next' : 'Complete'}
            </button>
          </div>
        </div>
        
        {/* Tutorial highlight indicators */}
        {document.querySelector(currentHighlight.element) && (
          <div className="tutorial-highlight absolute border-2 border-purple-500 rounded-full animate-pulse" 
            style={{
              width: `${(document.querySelector(currentHighlight.element) as HTMLElement).offsetWidth + 16}px`,
              height: `${(document.querySelector(currentHighlight.element) as HTMLElement).offsetHeight + 16}px`,
              left: `${(document.querySelector(currentHighlight.element) as HTMLElement).getBoundingClientRect().left - 8}px`,
              top: `${(document.querySelector(currentHighlight.element) as HTMLElement).getBoundingClientRect().top - 8}px`,
            }}
          />
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        {!profileComplete && !showTutorial ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-purple-600 mb-1">Unmute</h1>
              <h2 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.name}!</h2>
              <p className="text-gray-600">Let's set up your profile ({step}/5)</p>
              
              <div className="flex justify-center space-x-2 mt-4">
                <div className={`h-2 w-10 rounded-full ${step >= 1 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                <div className={`h-2 w-10 rounded-full ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                <div className={`h-2 w-10 rounded-full ${step >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                <div className={`h-2 w-10 rounded-full ${step >= 4 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                <div className={`h-2 w-10 rounded-full ${step >= 5 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">What causes do you care about?</h3>
                  <p className="text-gray-600 mb-6">
                    Select causes you're interested in to personalize your experience.
                    <br />
                    <span className="text-sm text-purple-600">Select at least one</span>
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6 max-h-96 overflow-y-auto pr-2">
                    {CAUSES.map(cause => (
                      <button
                        key={cause.id}
                        onClick={() => handleCauseToggle(cause.id)}
                        className={`flex items-center p-3 rounded-lg transition-all ${
                          selectedCauses.includes(cause.id)
                            ? 'bg-purple-100 border-purple-500 border-2 transform scale-105'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl mr-3">{cause.icon}</span>
                        <div className="text-left flex-1">
                          <p className="font-medium">{cause.name}</p>
                        </div>
                        {selectedCauses.includes(cause.id) && (
                          <Check size={18} className="text-purple-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Add a profile picture</h3>
                  <p className="text-gray-600 mb-6">
                    Help others recognize you by adding a profile picture.
                  </p>
                  
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 mb-4">
                      <FileUploader
                        type="avatar"
                        initialPreview={avatarUrl}
                        onUploadComplete={handleAvatarUpload}
                        bucketName="avatars"
                        folderPath={`user_${currentUser.id}`}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500">
                    <p>You can also use your current avatar:</p>
                    <button 
                      className="mt-2 text-purple-600 font-medium hover:underline"
                      onClick={() => setAvatarUrl(currentUser.avatar)}
                    >
                      Use current avatar
                    </button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Tell us about yourself</h3>
                  <p className="text-gray-600 mb-6">
                    Add a bio to let others know who you are and what you care about.
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[120px]"
                      placeholder="Share a bit about yourself, your interests, and what causes you're passionate about..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={250}
                    ></textarea>
                    <p className="text-xs text-gray-500 text-right mt-1">
                      {bio.length}/250 characters
                    </p>
                  </div>
                </div>
              )}
              
              {step === 4 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Your Profile Information</h3>
                  <p className="text-gray-600 mb-6">
                    Configure how others will identify you on Unmute.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Your full name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          @
                        </span>
                        <input
                          type="text"
                          className="flex-1 border rounded-r-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This will be your unique identifier. No spaces allowed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 5 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
                  <p className="text-gray-600 mb-6">
                    Choose what notifications you'd like to receive. You can change these settings anytime.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="text-red-500 mr-3" size={20} />
                        <span>Likes on your posts</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.likes}
                          onChange={() => setNotificationPreferences({
                            ...notificationPreferences,
                            likes: !notificationPreferences.likes
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageCircle className="text-blue-500 mr-3" size={20} />
                        <span>Comments on your posts</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.comments}
                          onChange={() => setNotificationPreferences({
                            ...notificationPreferences,
                            comments: !notificationPreferences.comments
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="text-purple-500 mr-3" size={20} />
                        <span>New followers</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.newFollowers}
                          onChange={() => setNotificationPreferences({
                            ...notificationPreferences,
                            newFollowers: !notificationPreferences.newFollowers
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="text-yellow-500 mr-3" size={20} />
                        <span>Mentions</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.mentions}
                          onChange={() => setNotificationPreferences({
                            ...notificationPreferences,
                            mentions: !notificationPreferences.mentions
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageCircle className="text-green-500 mr-3" size={20} />
                        <span>Direct messages</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationPreferences.directMessages}
                          onChange={() => setNotificationPreferences({
                            ...notificationPreferences,
                            directMessages: !notificationPreferences.directMessages
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                <div className={step === 1 ? 'w-full' : 'flex-1 flex justify-end'}>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 ml-auto"
                  >
                    {step === 5 ? 'Start Tutorial' : 'Next'}
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>By continuing, you agree to our <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>.</p>
            </div>
          </>
        ) : showTutorial ? (
          renderTutorial()
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Profile Complete!</h3>
            <p className="text-gray-600 mb-6">
              Your profile has been set up successfully. Redirecting you to your feed...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
