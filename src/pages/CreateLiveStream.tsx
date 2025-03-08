import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Camera, Info, RefreshCw, Settings, Video } from 'lucide-react';
import { createLiveStream, fileToDataUrl, CAUSES } from '../utils/data';
import { toast } from 'react-hot-toast';
import LiveStreamBroadcast from '../components/LiveStreamBroadcast';
import { v4 as uuidv4 } from 'uuid';

const CreateLiveStream = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cause, setCause] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [goLiveStep, setGoLiveStep] = useState<'setup' | 'preview' | 'live' | 'troubleshoot'>('setup');
  const [streamId, setStreamId] = useState('');
  const [isPermissionsGranted, setIsPermissionsGranted] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  
  // Check for camera and microphone permissions
  useEffect(() => {
    async function checkPermissions() {
      setIsCheckingPermissions(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setIsPermissionsGranted(true);
        setPermissionError(null);
        
        // Stop the stream immediately as we're just checking for permissions
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Permission error:', error);
        setIsPermissionsGranted(false);
        
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            setPermissionError('You denied permission to use your camera or microphone. Please update your browser settings to allow access.');
          } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            setPermissionError('No camera or microphone found. Please connect a device and try again.');
          } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            setPermissionError('Your camera or microphone is already in use by another application.');
          } else {
            setPermissionError(error.message || 'Could not access camera or microphone');
          }
        } else {
          setPermissionError('Could not access camera or microphone for an unknown reason');
        }
      } finally {
        setIsCheckingPermissions(false);
      }
    }

    checkPermissions();
  }, []);
  
  if (!currentUser) return null;
  
  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    try {
      const dataUrl = await fileToDataUrl(file);
      setThumbnail(dataUrl);
      setThumbnailFile(file);
    } catch (error) {
      toast.error('Error processing image');
      console.error(error);
    }
  };
  
  const handleStartStream = () => {
    if (!title) {
      toast.error('Please enter a stream title');
      return;
    }
    
    if (!isPermissionsGranted) {
      toast.error('Camera and microphone permissions are required to go live');
      setGoLiveStep('troubleshoot');
      return;
    }
    
    // Generate a unique stream ID
    const newStreamId = `stream-${uuidv4()}`;
    setStreamId(newStreamId);
    setGoLiveStep('preview');
  };
  
  const handleGoLive = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const newStream = {
          id: streamId,
          userId: currentUser.id,
          username: currentUser.username,
          userAvatar: currentUser.avatar,
          title,
          description,
          thumbnailUrl: thumbnail || 'https://images.unsplash.com/photo-1604122435792-3ebf65d2dd05?q=80&w=500',
          viewers: 0,
          isLive: true,
          startedAt: Date.now(),
          cause: cause || undefined
        };
        
        createLiveStream(newStream);
        setGoLiveStep('live');
        
        // After a moment, navigate to the live stream
        setTimeout(() => {
          navigate(`/live/${streamId}`);
        }, 2000);
      } catch (error) {
        toast.error('Failed to start stream');
        setGoLiveStep('setup');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };
  
  const retryPermissions = async () => {
    setIsCheckingPermissions(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setIsPermissionsGranted(true);
      setPermissionError(null);
      setGoLiveStep('setup');
      toast.success('Camera and microphone access granted!');
    } catch (error) {
      console.error('Permission retry error:', error);
      toast.error('Still unable to access camera or microphone');
    } finally {
      setIsCheckingPermissions(false);
    }
  };
  
  const openBrowserSettings = () => {
    // Provide information based on browser
    const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
    const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    const isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1;
    
    let settingsInfo = '';
    if (isChrome) {
      settingsInfo = 'Open Chrome settings -> Privacy and security -> Site Settings -> Camera and Microphone';
    } else if (isFirefox) {
      settingsInfo = 'Open Firefox preferences -> Privacy & Security -> Permissions -> Camera and Microphone';
    } else if (isSafari) {
      settingsInfo = 'Open Safari preferences -> Websites -> Camera and Microphone';
    } else {
      settingsInfo = 'Check your browser settings for camera and microphone permissions';
    }
    
    toast.success(settingsInfo, { duration: 6000 });
  };
  
  if (isCheckingPermissions) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <h2 className="text-xl font-medium mb-2">Checking Camera & Microphone Access</h2>
        <p className="text-gray-600">
          Please wait while we check your device permissions...
        </p>
      </div>
    );
  }
  
  if (permissionError && goLiveStep === 'setup') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/live')} className="mr-3">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Create Live Stream</h1>
        </div>
        
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Camera className="text-red-600 h-10 w-10" />
          </div>
          <h2 className="text-xl font-medium mb-4">Permission Required</h2>
          <p className="text-gray-600 mb-6">
            To go live, you need to allow access to your camera and microphone.
            Please check your browser settings and try again.
          </p>
          <p className="text-sm text-red-500 mb-6">{permissionError}</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
            <button
              onClick={retryPermissions}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
              disabled={isCheckingPermissions}
            >
              {isCheckingPermissions ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : <RefreshCw className="mr-2" size={18} />}
              Try Again
            </button>
            
            <button
              onClick={openBrowserSettings}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              <Settings className="mr-2" size={18} />
              Browser Settings Help
            </button>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium mb-2">Why not try one of these instead?</h3>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button
                onClick={() => navigate('/create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create a Post
              </button>
              <button
                onClick={() => navigate('/reels/create')}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Create a Reel
              </button>
              <button
                onClick={() => navigate('/polls/create')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create a Poll
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (goLiveStep === 'troubleshoot') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button onClick={() => setGoLiveStep('setup')} className="mr-3">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Troubleshoot Permissions</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3">How to enable camera and microphone access:</h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Different browsers have different ways to manage permissions. Follow the steps for your browser below.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Chrome</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Click the lock icon (🔒) in the address bar</li>
                <li>Select "Site settings"</li>
                <li>Allow access to Camera and Microphone</li>
                <li>Refresh the page</li>
              </ol>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Firefox</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Click the lock icon in the address bar</li>
                <li>Select "Connection secure"</li>
                <li>Click "More Information"</li>
                <li>Go to "Permissions" tab</li>
                <li>Set Camera and Microphone to "Allow"</li>
                <li>Refresh the page</li>
              </ol>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Safari</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Click Safari in the menu bar</li>
                <li>Select "Preferences"</li>
                <li>Go to "Websites" tab</li>
                <li>Select "Camera" and "Microphone" from the left sidebar</li>
                <li>Find this website and set permissions to "Allow"</li>
                <li>Refresh the page</li>
              </ol>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Edge</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Click the lock icon in the address bar</li>
                <li>Select "Site permissions"</li>
                <li>Allow access to Camera and Microphone</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => setGoLiveStep('setup')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={retryPermissions}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {goLiveStep === 'setup' && (
        <>
          <div className="p-4 border-b flex items-center">
            <button 
              onClick={() => navigate('/live')}
              className="mr-3"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Create Live Stream</h1>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stream Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="What's your stream about?"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                placeholder="Tell viewers more about your stream..."
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stream Thumbnail (optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                {thumbnail ? (
                  <div className="relative w-full">
                    <img 
                      src={thumbnail} 
                      alt="Stream thumbnail" 
                      className="mx-auto h-48 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnail(null);
                        setThumbnailFile(null);
                      }}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                    >
                      <ArrowLeft size={16} className="rotate-45" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                        <span>Upload a thumbnail</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={handleThumbnailChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
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
                onClick={() => navigate('/live')}
                className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartStream}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <Video size={18} className="mr-2" />
                Next
              </button>
            </div>
          </div>
        </>
      )}
      
      {goLiveStep === 'preview' && (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center">
            <button 
              onClick={() => setGoLiveStep('setup')}
              className="mr-3"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Stream Preview</h1>
          </div>
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="lg:col-span-2 h-96 lg:h-auto">
              <LiveStreamBroadcast 
                streamId={streamId} 
                isPreview={true}
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Stream Details</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{title}</p>
              </div>
              
              {description && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{description}</p>
                </div>
              )}
              
              {cause && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cause</label>
                  <p className="text-gray-900 flex items-center">
                    <span className="mr-2">{CAUSES.find(c => c.id === cause)?.icon}</span>
                    {CAUSES.find(c => c.id === cause)?.name}
                  </p>
                </div>
              )}
              
              <div className="mt-8 text-sm text-gray-600">
                <p>Your stream will be visible to everyone once you go live.</p>
                <p className="mt-2">Make sure your camera and microphone are working properly before going live.</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t flex justify-between">
            <button
              type="button"
              onClick={() => setGoLiveStep('setup')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleGoLive}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? 'Preparing...' : 'Go Live'}
            </button>
          </div>
        </div>
      )}
      
      {goLiveStep === 'live' && (
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Video className="text-green-600 h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">You're Live!</h2>
          <p className="text-gray-600 mb-8">Redirecting you to your stream...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateLiveStream;
